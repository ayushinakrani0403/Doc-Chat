

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canUploadDocument } from "@/lib/plan-limits"

const BASE_URL = process.env.ANYTHINGLLM_BASE_URL!
const API_KEY  = process.env.ANYTHINGLLM_API_KEY!

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData      = await req.formData()
    const file          = formData.get("file") as File | null
    const workspaceSlug = formData.get("workspaceSlug") as string | null

    if (!file)          return NextResponse.json({ error: "No file provided" }, { status: 400 })
    if (!workspaceSlug) return NextResponse.json({ error: "No workspace selected" }, { status: 400 })
    if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: "File too large. Max 50MB." }, { status: 400 })

    // Verify workspace belongs to user
    const workspace = await prisma.workspace.findFirst({
      where: { slug: workspaceSlug, userId: session.user.id },
    })
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 })

    // ── Check plan limits ─────────────────────────────────────────────────
    const { allowed, reason } = await canUploadDocument(session.user.id, workspace.id)
    if (!allowed) {
      return NextResponse.json({ error: reason, upgradeRequired: true }, { status: 403 })
    }

    // ── Step 1: Upload to AnythingLLM global store ────────────────────────
    const uploadForm = new FormData()
    uploadForm.append("file", file)

    const uploadRes = await fetch(`${BASE_URL}/api/v1/document/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}` },
      body: uploadForm,
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      console.error("[UPLOAD] AnythingLLM upload error:", err)
      return NextResponse.json({ error: "Failed to upload file to AI engine" }, { status: 502 })
    }

    const uploadData = await uploadRes.json()
    const docLocation = uploadData?.documents?.[0]?.location

    if (!docLocation) {
      return NextResponse.json({ error: "File uploaded but location not returned" }, { status: 502 })
    }

    // ── Step 2: Embed into workspace ──────────────────────────────────────
    await fetch(
      `${BASE_URL}/api/v1/workspace/${workspaceSlug}/update-embeddings`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ adds: [docLocation], deletes: [] }),
      }
    ).catch(() => {})

    // ── Step 3: Save to DB ────────────────────────────────────────────────
    const doc = await prisma.document.create({
      data: { filename: file.name, size: file.size, workspaceId: workspace.id },
    })

    return NextResponse.json({ success: true, document: doc })
  } catch (error) {
    console.error("[UPLOAD POST]", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })

  const workspace = await prisma.workspace.findFirst({
    where: { slug, userId: session.user.id },
    include: { documents: { orderBy: { uploadedAt: "desc" } } },
  })

  if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(workspace.documents)
}