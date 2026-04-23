// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"

// // PATCH /api/workspace/[id] — update workspace settings
// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions)
//   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//   try {
//     const body = await req.json()
//     const { name, systemPrompt, model, temperature, welcomeMsg, color } = body

//     // Verify ownership
//     const workspace = await prisma.workspace.findFirst({
//       where: { id: params.id, userId: session.user.id },
//     })
//     if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

//     const updated = await prisma.workspace.update({
//       where: { id: params.id },
//       data: {
//         ...(name && { name: name.trim() }),
//         ...(systemPrompt !== undefined && { systemPrompt: systemPrompt.trim() }),
//         ...(model && { model }),
//         ...(temperature !== undefined && { temperature: parseFloat(temperature) }),
//         ...(welcomeMsg !== undefined && { welcomeMsg }),
//         ...(color && { color }),
//       },
//     })

//     return NextResponse.json(updated)
//   } catch (error) {
//     console.error("[WORKSPACE PATCH]", error)
//     return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
//   }
// }

// // DELETE /api/workspace/[id] — delete workspace
// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions)
//   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//   try {
//     const workspace = await prisma.workspace.findFirst({
//       where: { id: params.id, userId: session.user.id },
//     })
//     if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

//     // Delete from AnythingLLM first
//     await fetch(
//       `${process.env.ANYTHINGLLM_BASE_URL}/api/v1/workspace/${workspace.slug}`,
//       {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${process.env.ANYTHINGLLM_API_KEY}` },
//       }
//     ).catch(() => {}) // Non-fatal if LLM delete fails

//     // Delete from DB (cascades to documents + chatLogs via Prisma)
//     await prisma.workspace.delete({ where: { id: params.id } })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("[WORKSPACE DELETE]", error)
//     return NextResponse.json({ error: "Failed to delete workspace" }, { status: 500 })
//   }
// }



// // import { NextResponse } from "next/server"
// // import { getServerSession } from "next-auth"
// // import { authOptions } from "@/lib/auth"
// // import { prisma } from "@/lib/prisma"

// // // PATCH /api/workspace/[id] — update workspace settings
// // export async function PATCH(
// //   req: Request,
// //   { params }: { params: Promise<{ id: string }> }
// // ) {
// //   const session = await getServerSession(authOptions)
// //   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

// //   try {
// //     const { id } = await params
// //     const body = await req.json()

// //     const { name, systemPrompt, model, temperature, welcomeMsg, color } = body

// //     const workspace = await prisma.workspace.findFirst({
// //       where: { id, userId: session.user.id },
// //     })

// //     if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

// //     const updated = await prisma.workspace.update({
// //       where: { id },
// //       data: {
// //         ...(name && { name: name.trim() }),
// //         ...(systemPrompt !== undefined && { systemPrompt: systemPrompt.trim() }),
// //         ...(model && { model }),
// //         ...(temperature !== undefined && { temperature: parseFloat(temperature) }),
// //         ...(welcomeMsg !== undefined && { welcomeMsg }),
// //         ...(color && { color }),
// //       },
// //     })

// //     return NextResponse.json(updated)
// //   } catch (error) {
// //     console.error("[WORKSPACE PATCH]", error)
// //     return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
// //   }
// // }

// // // DELETE /api/workspace/[id] — delete workspace
// // export async function DELETE(
// //   req: Request,
// //   { params }: { params: Promise<{ id: string }> }
// // ) {
// //   const session = await getServerSession(authOptions)
// //   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

// //   try {
// //     const { id } = await params

// //     const workspace = await prisma.workspace.findFirst({
// //       where: { id, userId: session.user.id },
// //     })

// //     if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

// //     await fetch(
// //       `${process.env.ANYTHINGLLM_BASE_URL}/api/v1/workspace/${workspace.slug}`,
// //       {
// //         method: "DELETE",
// //         headers: { Authorization: `Bearer ${process.env.ANYTHINGLLM_API_KEY}` },
// //       }
// //     ).catch(() => {})

// //     await prisma.workspace.delete({ where: { id } })

// //     return NextResponse.json({ success: true })
// //   } catch (error) {
// //     console.error("[WORKSPACE DELETE]", error)
// //     return NextResponse.json({ error: "Failed to delete workspace" }, { status: 500 })
// //   }
// // }

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH /api/workspace/[id] — update workspace settings
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // ← await params first
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { name, systemPrompt, model, temperature, welcomeMsg, color } = body

    // Verify ownership
    const workspace = await prisma.workspace.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const updated = await prisma.workspace.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(systemPrompt !== undefined && { systemPrompt: systemPrompt.trim() }),
        ...(model && { model }),
        ...(temperature !== undefined && { temperature: parseFloat(temperature) }),
        ...(welcomeMsg !== undefined && { welcomeMsg }),
        ...(color && { color }),
      },
    })

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
  const { id } = await params  // ← await params first
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const workspace = await prisma.workspace.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Delete from AnythingLLM first
    await fetch(
      `${process.env.ANYTHINGLLM_BASE_URL}/api/v1/workspace/${workspace.slug}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.ANYTHINGLLM_API_KEY}` },
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