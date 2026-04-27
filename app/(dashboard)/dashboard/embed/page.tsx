import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import EmbedPageClient from "@/components/dashboard/EmbedPageClient"

export default async function EmbedPage() {
  const session = await getServerSession(authOptions)

  const workspaces = await prisma.workspace.findMany({
    where: { userId: session!.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      welcomeMsg: true,
      position: true,
      
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <EmbedPageClient
      workspaces={workspaces.map((w) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        color: w.color,
        welcomeMsg: w.welcomeMsg ?? "",
        position: w.position ?? "bottom-right",
      }))}
      appUrl={process.env.NEXT_PUBLIC_APP_URL ?? "https://yourdomain.com"}
    />
  )
}
