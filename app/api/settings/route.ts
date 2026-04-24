import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// PATCH /api/settings — update name or password
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { type } = body

    // ── Update profile (name) ─────────────────────────────────────────────
    if (type === "profile") {
      const { name } = body
      if (!name || name.trim().length < 2) {
        return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 })
      }
      const updated = await prisma.user.update({
        where: { id: session.user.id },
        data: { name: name.trim() },
      })
      return NextResponse.json({ success: true, name: updated.name })
    }

    // ── Change password ───────────────────────────────────────────────────
    if (type === "password") {
      const { currentPassword, newPassword } = body
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "All password fields are required." }, { status: 400 })
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 })
      }
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (!user?.password) {
        return NextResponse.json({ error: "No password set for this account." }, { status: 400 })
      }
      const valid = await bcrypt.compare(currentPassword, user.password)
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 })
      }
      const hashed = await bcrypt.hash(newPassword, 12)
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashed },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request type." }, { status: 400 })
  } catch (error) {
    console.error("[SETTINGS PATCH]", error)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}

// GET /api/settings — get current user info
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        createdAt: true,
        _count: { select: { workspaces: true } },
      },
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error("[SETTINGS GET]", error)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}

// DELETE /api/settings — permanently delete account and all data
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { confirmText} = body

    // ── Require typing "DELETE" to confirm ────────────────────────────────
    if (confirmText !== "DELETE") {
      return NextResponse.json({ error: 'Please type "DELETE" to confirm.' }, { status: 400 })
    }

    // ── Verify password before deleting ──────────────────────────────────
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 })

 

    // ── Get all workspaces for this user ──────────────────────────────────
    const workspaces = await prisma.workspace.findMany({
      where: { userId: session.user.id },
      select: { id: true, slug: true },
    })

    // ── Delete from AnythingLLM (best effort, non-fatal) ──────────────────
    for (const ws of workspaces) {
      await fetch(
        `${process.env.ANYTHINGLLM_BASE_URL}/api/v1/workspace/${ws.slug}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${process.env.ANYTHINGLLM_API_KEY}` },
        }
      ).catch(() => {}) // Non-fatal
    }

    // ── Delete all data in order (children first) ─────────────────────────
    const workspaceIds = workspaces.map((w) => w.id)

    // 1. Delete all chat logs
    await prisma.chatLog.deleteMany({
      where: { workspaceId: { in: workspaceIds } },
    })

    // 2. Delete all documents
    await prisma.document.deleteMany({
      where: { workspaceId: { in: workspaceIds } },
    })

    // 3. Delete all workspaces
    await prisma.workspace.deleteMany({
      where: { userId: session.user.id },
    })

    // 4. Delete the user account
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    console.log(`[DELETE ACCOUNT] User ${session.user.id} (${user.email}) deleted their account.`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[SETTINGS DELETE]", error)
    return NextResponse.json({ error: "Failed to delete account. Please try again." }, { status: 500 })
  }
}
