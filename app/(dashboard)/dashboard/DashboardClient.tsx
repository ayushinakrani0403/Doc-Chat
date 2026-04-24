"use client"
import { useState } from "react"
import Link from "next/link"

type Workspace = {
  id: string
  name: string
  slug: string
  color: string
  status: string
  docCount: number
  chatCount: number
}

type Stats = {
  totalWorkspaces: number
  totalDocs: number
  totalChats: number
  activeClients: number
}

type User = {
  name?: string | null
  email?: string | null
  id?: string
  plan?: string
}

function getInitials(name?: string | null) {
  if (!name) return "U"
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

function getHour() {
  const h = new Date().getHours()
  if (h < 12) return "morning"
  if (h < 18) return "afternoon"
  return "evening"
}

export default function DashboardClient({ user, workspaces, stats }: { user: User; workspaces: Workspace[]; stats: Stats }) {
  const [toast, setToast] = useState("")
  const [showToast, setShowToast] = useState(false)

  const triggerToast = (msg: string) => {
    setToast(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  const statCards = [
    {
      label: "Workspaces",
      value: stats.totalWorkspaces,
      change: "Total created",
      changeColor: "#6366F1",
      iconBg: "#EEF2FF",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
        </svg>
      ),
    },
    {
      label: "Docs embedded",
      value: stats.totalDocs,
      change: "Across all workspaces",
      changeColor: "#0D9488",
      iconBg: "#F0FDFA",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
    {
      label: "Total chats",
      value: stats.totalChats,
      change: "All time",
      changeColor: "#D97706",
      iconBg: "#FFFBEB",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
        </svg>
      ),
    },
    {
      label: "Active workspaces",
      value: stats.activeClients,
      change: "Currently live",
      changeColor: "#059669",
      iconBg: "#ECFDF5",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
  ]

  return (
    <div style={{ padding: "28px 30px", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 21, fontWeight: 700, color: "#0F172A" }}>
          Good {getHour()}, {user.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
          Here's what's happening across your workspaces today
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 18 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{s.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, marginTop: 5, fontWeight: 500, color: s.changeColor }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Workspaces table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Your workspaces</span>
          <Link
            href="/dashboard/projects/new"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New workspace
          </Link>
        </div>

        {workspaces.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, background: "#EEF2FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>No workspaces yet</p>
            <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Create your first workspace to get started</p>
            <Link href="/dashboard/projects/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "8px 16px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Create workspace
            </Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Workspace", "Documents", "Chats", "Status", "Usage", ""].map(h => (
                  <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workspaces.map((ws) => {
                const maxDocs = 20
                const usagePct = Math.min(Math.round((ws.docCount / maxDocs) * 100), 100)
                return (
                  <tr key={ws.id}>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: ws.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {getInitials(ws.name)}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{ws.name}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>{ws.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #F8FAFC" }}>{ws.docCount} docs</td>
                    <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #F8FAFC" }}>{ws.chatCount}</td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                        background: ws.status === "active" ? "#ECFDF5" : "#F1F5F9",
                        color: ws.status === "active" ? "#064E3B" : "#475569",
                      }}>
                        {ws.status}
                      </span>
                    </td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
                      <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden", width: 80 }}>
                        <div style={{ height: "100%", borderRadius: 2, background: ws.color, width: `${usagePct}%` }} />
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
                      <Link
                        href={`/dashboard/projects/${ws.id}`}
                        style={{ display: "inline-flex", alignItems: "center", padding: "5px 11px", borderRadius: 8, border: "1px solid #E2E8F0", background: "transparent", fontSize: 12, fontWeight: 600, color: "#475569", textDecoration: "none" }}
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Toast */}
      <div style={{
        position: "fixed", bottom: 24, right: 24, background: "#0F172A", color: "#fff",
        padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500,
        opacity: showToast ? 1 : 0, transform: showToast ? "translateY(0)" : "translateY(8px)",
        transition: "all .25s", pointerEvents: "none", zIndex: 100,
      }}>
        {toast}
      </div>
    </div>
  )
}

