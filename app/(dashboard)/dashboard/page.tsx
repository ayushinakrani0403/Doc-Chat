

// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"
// import DashboardClient from "./DashboardClient"

// export default async function DashboardPage() {
//   const session = await getServerSession(authOptions)

//   const workspaces = await prisma.workspace.findMany({
//     where: { userId: session!.user.id },
//     include: {
//       _count: { select: { documents: true, chatLogs: true } },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   const totalDocs = workspaces.reduce((sum, w) => sum + w._count.documents, 0)
//   const totalChats = workspaces.reduce((sum, w) => sum + w._count.chatLogs, 0)
//   const activeCount = workspaces.filter(w => w.status === "active").length

//   return (
//     <DashboardClient
//       user={session!.user}
//       workspaces={workspaces.map(w => ({
//         id: w.id,
//         name: w.name,
//         slug: w.slug,
//         color: w.color,
//         status: w.status,
//         docCount: w._count.documents,
//         chatCount: w._count.chatLogs,
//       }))}
//       stats={{ totalWorkspaces: workspaces.length, totalDocs, totalChats, activeClients: activeCount }}
//     />
//   )
// }


import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const now = new Date()

  // Start of this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Start of this week (Monday)
  const startOfWeek = new Date(now)
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  startOfWeek.setDate(now.getDate() + diff)
  startOfWeek.setHours(0, 0, 0, 0)

  // Start of last month
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const workspaces = await prisma.workspace.findMany({
    where: { userId: session!.user.id },
    include: {
      _count: { select: { documents: true, chatLogs: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const totalDocs    = workspaces.reduce((sum, w) => sum + w._count.documents, 0)
  const totalChats   = workspaces.reduce((sum, w) => sum + w._count.chatLogs, 0)
  const activeCount  = workspaces.filter((w) => w.status === "active").length

  // ── Workspaces created this month ─────────────────────────────────────────
  const wsThisMonth = workspaces.filter(
    (w) => new Date(w.createdAt) >= startOfMonth
  ).length

  // ── Documents uploaded this week ──────────────────────────────────────────
  const workspaceIds = workspaces.map((w) => w.id)

  const docsThisWeek = await prisma.document.count({
    where: {
      workspaceId: { in: workspaceIds },
      uploadedAt: { gte: startOfWeek },
    },
  })

  // ── Chats this month vs last month ────────────────────────────────────────
  const chatsThisMonth = await prisma.chatLog.count({
    where: {
      workspaceId: { in: workspaceIds },
      createdAt: { gte: startOfMonth },
    },
  })

  const chatsLastMonth = await prisma.chatLog.count({
    where: {
      workspaceId: { in: workspaceIds },
      createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
    },
  })

  // Calculate % change vs last month
  const chatsPctChange = chatsLastMonth === 0
    ? chatsThisMonth > 0 ? 100 : 0
    : Math.round(((chatsThisMonth - chatsLastMonth) / chatsLastMonth) * 100)

  return (
    <DashboardClient
      user={session!.user}
      workspaces={workspaces.map((w) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        color: w.color,
        status: w.status,
        docCount: w._count.documents,
        chatCount: w._count.chatLogs,
      }))}
      stats={{
        totalWorkspaces: workspaces.length,
        totalDocs,
        totalChats,
        activeClients: activeCount,
        wsThisMonth,
        docsThisWeek,
        chatsThisMonth,
        chatsPctChange,
      }}
    />
  )
}

