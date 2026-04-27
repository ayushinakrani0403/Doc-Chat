
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const BASE_URL = process.env.ANYTHINGLLM_BASE_URL!
const API_KEY  = process.env.ANYTHINGLLM_API_KEY!

// PATCH /api/workspace/[id] — update workspace settings
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
   
  const { name, systemPrompt, model, temperature, welcomeMsg, color, position, size, customWidth, customHeight } = body
    // Verify ownership
    const workspace = await prisma.workspace.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // ── Step 1: Save to DB ────────────────────────────────────────────────
    const updated = await prisma.workspace.update({
      where: { id },
      data: {
        ...(name              && { name: name.trim() }),
        ...(systemPrompt !== undefined && { systemPrompt: systemPrompt.trim() }),
        ...(model             && { model }),
        ...(temperature !== undefined && { temperature: parseFloat(temperature) }),
        ...(welcomeMsg  !== undefined && { welcomeMsg }),
        ...(color             && { color }),
        ...(position          && { position }),
        ...(size !== undefined && { size }), 
        ...(customWidth  !== undefined && { customWidth:  Number(customWidth) }),
        ...(customHeight !== undefined && { customHeight: Number(customHeight) }),
      },
    })

    // ── Step 2: Sync to AnythingLLM ───────────────────────────────────────
    // Build the AnythingLLM update payload
    const llmPayload: Record<string, any> = {}

    if (systemPrompt !== undefined) {
      llmPayload.openAiPrompt = systemPrompt.trim()
    }

    if (temperature !== undefined) {
      llmPayload.openAiTemp = parseFloat(temperature)
    }

    if (model) {
      // Map our model names to AnythingLLM's expected format
      const modelMap: Record<string, string> = {
        "gpt-4o-mini":     "gpt-4o-mini",
        "gpt-4o":          "gpt-4o",
        "gpt-3.5-turbo":   "gpt-3.5-turbo",
        "claude-sonnet":   "claude-3-5-sonnet-20241022",
        "ollama":          "llama3.2",
      }
      llmPayload.chatModel = modelMap[model] ?? model
    }

    // Only call AnythingLLM if there's something to update
    if (Object.keys(llmPayload).length > 0) {
      const llmRes = await fetch(
        `${BASE_URL}/api/v1/workspace/${workspace.slug}/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(llmPayload),
        }
      )

      if (!llmRes.ok) {
        const err = await llmRes.text()
        console.error("[WORKSPACE PATCH] AnythingLLM sync failed:", err)
        // Non-fatal — DB is updated, just log the error
      } else {
        console.log(`[WORKSPACE PATCH] Synced to AnythingLLM:`, llmPayload)
      }
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[WORKSPACE PATCH]", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}

// DELETE /api/workspace/[id] — delete workspace
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const workspace = await prisma.workspace.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Delete from AnythingLLM first
    await fetch(
      `${BASE_URL}/api/v1/workspace/${workspace.slug}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    ).catch(() => {}) // Non-fatal

    // Delete from DB
    await prisma.workspace.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[WORKSPACE DELETE]", error)
    return NextResponse.json({ error: "Failed to delete workspace" }, { status: 500 })
  }
}