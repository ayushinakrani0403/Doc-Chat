import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import PreviewPageClient from "@/components/dashboard/PreviewPageClient"

export default async function PreviewPage() {
  const session = await getServerSession(authOptions)

  const workspaces = await prisma.workspace.findMany({
    where: { userId: session!.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      welcomeMsg: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <PreviewPageClient
      workspaces={workspaces.map((w) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        color: w.color,
        welcomeMsg: w.welcomeMsg ?? "Hi! How can I help you today?",
      }))}
    />
  )
}
