// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"
// import { notFound } from "next/navigation"
// import ProjectPageClient from "@/components/dashboard/ProjectPageClient"

// export default async function ProjectPage({
//   params,
// }: {
//   params: { id: string }
// }) {
//   const session = await getServerSession(authOptions)

//   const workspace = await prisma.workspace.findFirst({
//     where: { id: params.id, userId: session!.user.id },
//     include: {
//       documents: { orderBy: { uploadedAt: "desc" } },
//       _count: { select: { chatLogs: true, documents: true } },
//     },
//   })

//   if (!workspace) notFound()

//   // Get daily chat counts for last 7 days
//   const sevenDaysAgo = new Date()
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
//   sevenDaysAgo.setHours(0, 0, 0, 0)

//   const recentChats = await prisma.chatLog.findMany({
//     where: {
//       workspaceId: workspace.id,
//       createdAt: { gte: sevenDaysAgo },
//     },
//     select: { createdAt: true },
//   })

//   // Build chart data: last 7 days
//   const chartData = Array.from({ length: 7 }, (_, i) => {
//     const d = new Date()
//     d.setDate(d.getDate() - (6 - i))
//     const label = d.toLocaleDateString("en-US", { weekday: "short" })
//     const count = recentChats.filter((c) => {
//       const cd = new Date(c.createdAt)
//       return (
//         cd.getDate() === d.getDate() &&
//         cd.getMonth() === d.getMonth() &&
//         cd.getFullYear() === d.getFullYear()
//       )
//     }).length
//     return { label, count }
//   })

//   return (
//     <ProjectPageClient
//       workspace={{
//         id: workspace.id,
//         name: workspace.name,
//         slug: workspace.slug,
//         color: workspace.color,
//         status: workspace.status,
//         systemPrompt: workspace.systemPrompt ?? "",
//         model: workspace.model ?? "gpt-4o-mini",
//         temperature: workspace.temperature,
//         welcomeMsg: workspace.welcomeMsg ?? "",
//         docCount: workspace._count.documents,
//         chatCount: workspace._count.chatLogs,
//       }}
//       documents={workspace.documents.map((d) => ({
//         id: d.id,
//         filename: d.filename,
//         size: d.size,
//         uploadedAt: d.uploadedAt.toISOString(),
//       }))}
//       chartData={chartData}
//     />
//   )
// }


import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProjectPageClient from "@/components/dashboard/ProjectPageClient"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params  // ← await params first
  const session = await getServerSession(authOptions)

  const workspace = await prisma.workspace.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      documents: { orderBy: { uploadedAt: "desc" } },
      _count: { select: { chatLogs: true, documents: true } },
    },
  })

  if (!workspace) notFound()

    // ── ADD THIS BLOCK ────────────────────────────────────────────────
  const allChatLogs = await prisma.chatLog.findMany({
    where: { workspaceId: workspace.id },
    select: { answered: true, responseMs: true },
  })

  const totalChats = allChatLogs.length
  const answeredCount = allChatLogs.filter(c => c.answered).length
  const answeredPct = totalChats > 0
    ? Math.round((answeredCount / totalChats) * 100)
    : 0

  const responseTimes = allChatLogs
    .filter(c => c.responseMs != null)
    .map(c => c.responseMs!)
  const avgResponseSec = responseTimes.length > 0
    ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000).toFixed(1)
    : "0.0"
  // ── END OF NEW BLOCK ──────────────────────────────────────────────

  // Get daily chat counts for last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const recentChats = await prisma.chatLog.findMany({
    where: {
      workspaceId: workspace.id,
      createdAt: { gte: sevenDaysAgo },
    },
    select: { createdAt: true },
  })

  // Build chart data: last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString("en-US", { weekday: "short" })
    const count = recentChats.filter((c) => {
      const cd = new Date(c.createdAt)
      return (
        cd.getDate() === d.getDate() &&
        cd.getMonth() === d.getMonth() &&
        cd.getFullYear() === d.getFullYear()
      )
    }).length
    return { label, count }
  })

  return (
    <ProjectPageClient
      workspace={{
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        color: workspace.color,
        status: workspace.status,
        systemPrompt: workspace.systemPrompt ?? "",
        model: workspace.model ?? "gpt-4o-mini",
        temperature: workspace.temperature,
        welcomeMsg: workspace.welcomeMsg ?? "",
        docCount: workspace._count.documents,
        chatCount: workspace._count.chatLogs,
      }}
      documents={workspace.documents.map((d) => ({
        id: d.id,
        filename: d.filename,
        size: d.size,
        uploadedAt: d.uploadedAt.toISOString(),
      }))}
      chartData={chartData}
      analytics={{ answeredPct, avgResponseSec }}
    />
  )
}
