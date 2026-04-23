import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import SettingsPageClient from "@/components/dashboard/SettingsPageClient"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      createdAt: true,
      _count: { select: { workspaces: true } },
    },
  })

  return (
    <SettingsPageClient
      user={{
        id: user!.id,
        name: user!.name,
        email: user!.email,
        plan: user!.plan,
        createdAt: user!.createdAt.toISOString(),
        workspaceCount: user!._count.workspaces,
      }}
    />
  )
}
