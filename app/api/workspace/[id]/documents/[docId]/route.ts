// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"

// // DELETE /api/workspace/[id]/documents/[docId]
// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string; docId: string } }
// ) {
//   const session = await getServerSession(authOptions)
//   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//   try {
//     // Verify workspace belongs to user
//     const workspace = await prisma.workspace.findFirst({
//       where: { id: params.id, userId: session.user.id },
//     })
//     if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

//     // Get document
//     const doc = await prisma.document.findFirst({
//       where: { id: params.docId, workspaceId: params.id },
//     })
//     if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 })

//     // Remove from AnythingLLM vector store
//     await fetch(
//       `${process.env.ANYTHINGLLM_BASE_URL}/api/v1/workspace/${workspace.slug}/update-embeddings`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.ANYTHINGLLM_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ adds: [], deletes: [doc.filename] }),
//       }
//     ).catch(() => {}) // Non-fatal

//     // Delete from DB
//     await prisma.document.delete({ where: { id: params.docId } })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("[DOC DELETE]", error)
//     return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
//   }
// }


// // import { NextResponse } from "next/server"
// // import { getServerSession } from "next-auth"
// // import { authOptions } from "@/lib/auth"
// // import { prisma } from "@/lib/prisma"

// // // DELETE /api/workspace/[id]/documents/[docId]
// // export async function DELETE(
// //   req: Request,
// //   { params }: { params: Promise<{ id: string; docId: string }> }
// // ) {
// //   const session = await getServerSession(authOptions)
// //   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

// //   try {
// //     const { id, docId } = await params

// //     const workspace = await prisma.workspace.findFirst({
// //       where: { id, userId: session.user.id },
// //     })

// //     if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

// //     const doc = await prisma.document.findFirst({
// //       where: { id: docId, workspaceId: id },
// //     })

// //     if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 })

// //     await fetch(
// //       `${process.env.ANYTHINGLLM_BASE_URL}/api/v1/workspace/${workspace.slug}/update-embeddings`,
// //       {
// //         method: "POST",
// //         headers: {
// //           Authorization: `Bearer ${process.env.ANYTHINGLLM_API_KEY}`,
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ adds: [], deletes: [doc.filename] }),
// //       }
// //     ).catch(() => {})

// //     await prisma.document.delete({
// //       where: { id: docId },
// //     })

// //     return NextResponse.json({ success: true })
// //   } catch (error) {
// //     console.error("[DOC DELETE]", error)
// //     return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
// //   }
// // }


import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// DELETE /api/workspace/[id]/documents/[docId]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const { id, docId } = await params  // ← await params first
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    // Verify workspace belongs to user
    const workspace = await prisma.workspace.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Get document
    const doc = await prisma.document.findFirst({
      where: { id: docId, workspaceId: id },
    })
    if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 })

    // Remove from AnythingLLM vector store
    await fetch(
      `${process.env.ANYTHINGLLM_BASE_URL}/api/v1/workspace/${workspace.slug}/update-embeddings`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ANYTHINGLLM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adds: [], deletes: [doc.filename] }),
      }
    ).catch(() => {}) // Non-fatal

    // Delete from DB
    await prisma.document.delete({ where: { id: docId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DOC DELETE]", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}