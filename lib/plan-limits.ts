import { prisma } from "@/lib/prisma"

export const PLAN_LIMITS = {
  free: {
    maxWorkspaces: 3,
    maxDocumentsPerWorkspace: 5,
    maxMessagesPerMonth: 100,
  },
  pro: {
    maxWorkspaces: Infinity,
    maxDocumentsPerWorkspace: Infinity,
    maxMessagesPerMonth: Infinity,
  },
}

// Check if user can create a new workspace
export async function canCreateWorkspace(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { _count: { select: { workspaces: true } } },
  })

  if (!user) return { allowed: false, reason: "User not found" }

  const limits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free

  if (user._count.workspaces >= limits.maxWorkspaces) {
    return {
      allowed: false,
      reason: `Free plan allows ${limits.maxWorkspaces} workspaces. Upgrade to Pro for unlimited workspaces.`,
    }
  }

  return { allowed: true }
}

// Check if user can upload a document to a workspace
export async function canUploadDocument(
  userId: string,
  workspaceId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) return { allowed: false, reason: "User not found" }

  const limits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free

  if (limits.maxDocumentsPerWorkspace === Infinity) return { allowed: true }

  const docCount = await prisma.document.count({
    where: { workspaceId },
  })

  if (docCount >= limits.maxDocumentsPerWorkspace) {
    return {
      allowed: false,
      reason: `Free plan allows ${limits.maxDocumentsPerWorkspace} documents per workspace. Upgrade to Pro for unlimited documents.`,
    }
  }

  return { allowed: true }
}

// Check if user can send a chat message this month
export async function canSendMessage(
  userId: string,
  workspaceId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) return { allowed: false, reason: "User not found" }

  const limits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free

  if (limits.maxMessagesPerMonth === Infinity) return { allowed: true }

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const msgCount = await prisma.chatLog.count({
    where: {
      workspaceId,
      createdAt: { gte: startOfMonth },
    },
  })

  if (msgCount >= limits.maxMessagesPerMonth) {
    return {
      allowed: false,
      reason: `You've used all ${limits.maxMessagesPerMonth} messages for this month. Upgrade to Pro for unlimited messages.`,
    }
  }

  return { allowed: true }
}