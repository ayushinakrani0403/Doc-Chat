import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import UploadPageClient from "@/components/dashboard/UploadPageClient"

export default async function UploadPage() {
  const session = await getServerSession(authOptions)

  const workspaces = await prisma.workspace.findMany({
    where: { userId: session!.user.id },
    include: {
      documents: { orderBy: { uploadedAt: "desc" }, take: 20 },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <UploadPageClient
      workspaces={workspaces.map((w) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        color: w.color,
        documents: w.documents.map((d) => ({
          id: d.id,
          filename: d.filename,
          size: d.size,
          uploadedAt: d.uploadedAt.toISOString(),
        })),
      }))}
    />
  )
}
