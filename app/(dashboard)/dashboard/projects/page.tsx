import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "WS"
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  const workspaces = await prisma.workspace.findMany({
    where: { userId: session!.user.id },
    include: {
      _count: { select: { documents: true, chatLogs: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div style={{ padding: "28px 30px", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 21, fontWeight: 700, color: "#0F172A", margin: 0 }}>Projects</h1>
          <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
            Manage your AI workspaces and documents
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New workspace
        </Link>
      </div>

      {/* Empty state */}
      {workspaces.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "60px 24px", textAlign: "center" }}>
          <div style={{ width: 52, height: 52, background: "#EEF2FF", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>No workspaces yet</p>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
            Create your first workspace to start building your AI chatbot
          </p>
          <Link
            href="/dashboard/projects/new"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            Create workspace
          </Link>
        </div>
      )}

      {/* Workspace grid */}
      {workspaces.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}
            >
              {/* Color bar */}
              <div style={{ height: 4, background: ws.color }} />

              <div style={{ padding: 18 }}>
                {/* Workspace name row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: ws.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {getInitials(ws.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ws.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ws.slug}
                    </div>
                  </div>

                  {/* <span style={{
                    background: ws.status === "active" ? "#ECFDF5" : "#F1F5F9",
                    color: ws.status === "active" ? "#064E3B" : "#475569",
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, flexShrink: 0
                  }}>
                    {ws.status}
                  </span> */}

                </div>

                {/* Stats */}
                {/* <div style={{ display: "flex", gap: 16, marginBottom: 16, padding: "10px 14px", background: "#F8FAFC", borderRadius: 8 }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{ws._count.documents}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>Documents</div>
                  </div>
                  <div style={{ width: 1, background: "#E2E8F0" }} />
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{ws._count.chatLogs}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>Chats</div>
                  </div>
                  <div style={{ width: 1, background: "#E2E8F0" }} />
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>
                      {new Date(ws.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>Created</div>
                  </div>
                </div> */}

                {/* // ✅ REPLACE WITH THIS (2 stats + date footer row): */}
                <div style={{ display: "flex", gap: 16, marginBottom: 10, padding: "10px 14px", background: "#F8FAFC", borderRadius: 8 }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{ws._count.documents}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>Documents</div>
                  </div>
                  <div style={{ width: 1, background: "#E2E8F0" }} />
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{ws._count.chatLogs}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>Chats</div>
                  </div>
                </div>

                {/* Footer row — date + status */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>
                    Created {new Date(ws.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                    background: ws.status === "active" ? "#ECFDF5" : "#F1F5F9",
                    color: ws.status === "active" ? "#059669" : "#475569",
                  }}>
                    {ws.status}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  

                  {/* // ✅ FIX — use workspace color */}
                <Link
                  href={`/dashboard/projects/${ws.id}`}
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 0", borderRadius: 8, background: ws.color, color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                >
                  Manage →
                </Link>
                  <Link
                    href={`/dashboard/upload?slug=${ws.slug}`}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "7px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "transparent", fontSize: 12, fontWeight: 600, color: "#475569", textDecoration: "none" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
