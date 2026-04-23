
// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"

// // GET /api/workspace — fetch all workspaces for the logged-in user
// export async function GET() {
//   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     const workspaces = await prisma.workspace.findMany({
//       where: { userId: session.user.id },
//       include: {
//         _count: { select: { documents: true, chatLogs: true } },
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     return NextResponse.json(workspaces)
//   } catch (error) {
//     console.error("[WORKSPACE GET]", error)
//     return NextResponse.json({ error: "Failed to fetch workspaces." }, { status: 500 })
//   }
// }

// // POST /api/workspace — create a new workspace
// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     const body = await req.json()
//     const { name, systemPrompt, model, color } = body

//     // Validation
//     if (!name || typeof name !== "string") {
//       return NextResponse.json({ error: "Workspace name is required." }, { status: 400 })
//     }
//     if (name.trim().length < 2) {
//       return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 })
//     }
//     if (name.trim().length > 60) {
//       return NextResponse.json({ error: "Name must be under 60 characters." }, { status: 400 })
//     }

//     const trimmedName = name.trim()

//     // ── Step 1: Create workspace in AnythingLLM ───────────────────────────
//     const llmRes = await fetch(
//       `${process.env.ANYTHINGLLM_BASE_URL}/api/v1/workspace/new`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.ANYTHINGLLM_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: trimmedName }),
//       }
//     )

//     if (!llmRes.ok) {
//       console.error("[WORKSPACE] AnythingLLM failed:", llmRes.status)
//       return NextResponse.json(
//         { error: "Failed to create AI workspace. Please check your AnythingLLM connection." },
//         { status: 502 }
//       )
//     }

//     const llmData = await llmRes.json()

//     // ── Step 2: Read the ACTUAL slug AnythingLLM created ─────────────────
//     // AnythingLLM returns: { workspace: { slug: "...", name: "...", ... } }
//     const llmSlug = llmData?.workspace?.slug

//     if (!llmSlug) {
//       console.error("[WORKSPACE] AnythingLLM returned no slug:", llmData)
//       return NextResponse.json(
//         { error: "AnythingLLM did not return a workspace slug." },
//         { status: 502 }
//       )
//     }

//     console.log(`[WORKSPACE] AnythingLLM slug: "${llmSlug}"`)

//     // ── Step 3: Save AnythingLLM's slug to DB (not our generated one) ─────
//     const workspace = await prisma.workspace.create({
//       data: {
//         name: trimmedName,
//         slug: llmSlug,          // ← use AnythingLLM's slug, not ours
//         userId: session.user.id,
//         systemPrompt: systemPrompt?.trim() || "",
//         model: model || "",
//         color: color || "#6366F1",
//       },
//     })

//     return NextResponse.json(workspace, { status: 201 })
//   } catch (error) {
//     console.error("[WORKSPACE POST]", error)
//     return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canCreateWorkspace } from "@/lib/plan-limits"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const workspaces = await prisma.workspace.findMany({
      where: { userId: session.user.id },
      include: { _count: { select: { documents: true, chatLogs: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(workspaces)
  } catch (error) {
    console.error("[WORKSPACE GET]", error)
    return NextResponse.json({ error: "Failed to fetch workspaces." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { name, systemPrompt, model, color } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Workspace name is required." }, { status: 400 })
    }
    if (name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 })
    }
    if (name.trim().length > 60) {
      return NextResponse.json({ error: "Name must be under 60 characters." }, { status: 400 })
    }

    // ── Check plan limits ─────────────────────────────────────────────────
    const { allowed, reason } = await canCreateWorkspace(session.user.id)
    if (!allowed) {
      return NextResponse.json({ error: reason, upgradeRequired: true }, { status: 403 })
    }

    const trimmedName = name.trim()

    // ── Create workspace in AnythingLLM ───────────────────────────────────
    const llmRes = await fetch(
      `${process.env.ANYTHINGLLM_BASE_URL}/api/v1/workspace/new`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ANYTHINGLLM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName }),
      }
    )

    if (!llmRes.ok) {
      return NextResponse.json(
        { error: "Failed to create AI workspace. Please check your AnythingLLM connection." },
        { status: 502 }
      )
    }

    const llmData = await llmRes.json()
    const llmSlug = llmData?.workspace?.slug

    if (!llmSlug) {
      return NextResponse.json({ error: "AnythingLLM did not return a workspace slug." }, { status: 502 })
    }

    // ── Save to DB with AnythingLLM's slug ────────────────────────────────
    const workspace = await prisma.workspace.create({
      data: {
        name: trimmedName,
        slug: llmSlug,
        userId: session.user.id,
        systemPrompt: systemPrompt?.trim() || "",
        model: model || "",
        color: color || "#6366F1",
      },
    })

    return NextResponse.json(workspace, { status: 201 })
  } catch (error) {
    console.error("[WORKSPACE POST]", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}