"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

const navItems = [
  {
    section: "Main",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
      )},
      { href: "/dashboard/projects", label: "Projects", icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      )},
      { href: "/dashboard/upload", label: "Upload Docs", icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      )},
      { href: "/dashboard/embed", label: "Embed Code", icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
      )},
      { href: "/dashboard/preview", label: "Chat Preview", icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
      )},
    ]
  },
  {
    section: "Settings",
    links: [
      { href: "/dashboard/settings", label: "Settings", icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      )},
    ]
  }
]

function isActiveLink(href: string, pathname: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname.startsWith(href)
}

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  const w = collapsed ? 60 : 220

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        .sidebar-nav-link { transition: background .12s, color .12s; }
        .sidebar-nav-link:hover { background: rgba(124,58,237,0.12) !important; color: #a78bfa !important; }
        .sidebar-collapse-btn:hover { background: rgba(255,255,255,0.07) !important; color: #a78bfa !important; }
        .sidebar-user-row:hover .sidebar-user-chevron { color: #a78bfa; }
        .sidebar-menu-link:hover { background: rgba(124,58,237,0.12) !important; color: #c4b5fd !important; }
        .sidebar-signout-btn:hover { background: rgba(239,68,68,0.08) !important; }
      `}</style>

      <aside style={{
        width: w, minWidth: w,
        background: "#0c0c18",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", height: "100vh",
        flexShrink: 0,
        transition: "width .22s cubic-bezier(.4,0,.2,1), min-width .22s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
        fontFamily: "'Sora', sans-serif",
        position: "relative",
      }}>

        {/* Grid overlay — matches login page */}
        <div style={{
          position: "absolute", inset: 0,
          opacity: 0.035,
          backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Radial glow top-left — matches login ::before */}
        <div style={{
          position: "absolute", top: -120, left: -80,
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Radial glow bottom-right — matches login ::after */}
        <div style={{
          position: "absolute", bottom: -100, right: -60,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* ── Logo + toggle ── */}
        <div style={{
          padding: "16px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center",
          gap: 10,
          justifyContent: collapsed ? "center" : "space-between",
          flexShrink: 0, position: "relative", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            {/* Logo icon */}
            <div style={{
              width: 32, height: 32, background: "#7c3aed",
              borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: "0 0 12px rgba(124,58,237,0.4)",
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", letterSpacing: "-0.3px" }}>DocChat</div>
                <div style={{ fontSize: 10, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, border: "1px solid rgba(124,58,237,0.3)" }}>
                    {(session?.user as any)?.plan?.toUpperCase() || "FREE"}
                  </span>
                  <span style={{ color: "#52525b" }}>Plan</span>
                </div>
              </div>
            )}
          </div>

          {/* Collapse button */}
          {!collapsed && (
            <button
              className="sidebar-collapse-btn"
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b", padding: 5, borderRadius: 6, display: "flex", flexShrink: 0, transition: "all .12s" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 19l-7-7 7-7"/><path d="M18 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div style={{ padding: "10px 0", display: "flex", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, position: "relative", zIndex: 1 }}>
            <button
              className="sidebar-collapse-btn"
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b", padding: 6, borderRadius: 6, display: "flex", transition: "all .12s" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 5l7 7-7 7"/><path d="M6 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        )}

        {/* ── Nav ── */}
        <nav style={{ padding: collapsed ? "8px 6px" : "8px 8px", flex: 1, overflowY: "auto", overflowX: "hidden", position: "relative", zIndex: 1 }}>
          {navItems.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <div style={{
                  padding: "14px 10px 4px",
                  fontSize: 9, fontWeight: 600, color: "#3f3f46",
                  textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
                }}>
                  {group.section}
                </div>
              )}
              {collapsed && <div style={{ height: 10 }} />}

              {group.links.map((item) => {
                const isActive = isActiveLink(item.href, pathname)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className="sidebar-nav-link"
                    style={{
                      display: "flex", alignItems: "center",
                      gap: collapsed ? 0 : 9,
                      padding: collapsed ? "9px 0" : "8px 10px",
                      justifyContent: collapsed ? "center" : "flex-start",
                      borderRadius: 8, textDecoration: "none",
                      color: isActive ? "#a78bfa" : "#71717a",
                      fontSize: 13, fontWeight: isActive ? 600 : 400,
                      marginBottom: 2,
                      background: isActive ? "rgba(124,58,237,0.15)" : "transparent",
                      border: isActive ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
                      whiteSpace: "nowrap", overflow: "hidden",
                    }}
                  >
                    <span style={{ width: 16, height: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.icon}
                    </span>
                    {!collapsed && item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* ── User section ── */}
        <div style={{
          padding: collapsed ? "12px 0" : "10px 10px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative", flexShrink: 0, zIndex: 1,
        }}>

          {/* Popup menu */}
          {showMenu && !collapsed && (
            <>
              <div onClick={() => setShowMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
              <div style={{
                position: "absolute", bottom: "100%", left: 10, right: 10,
                background: "#0c0c18",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden", zIndex: 20, marginBottom: 6,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}>
                {/* User info header */}
                <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7" }}>{session?.user?.name || "User"}</div>
                  <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>{session?.user?.email || ""}</div>
                </div>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowMenu(false)}
                  className="sidebar-menu-link"
                  style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 14px", fontSize: 13, color: "#a1a1aa", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "all .12s" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Settings
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="sidebar-signout-btn"
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "10px 14px", fontSize: 13, color: "#f87171", background: "none", border: "none", cursor: "pointer", fontFamily: "'Sora', sans-serif", textAlign: "left", transition: "all .12s" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          )}

          {/* User row */}
          <div
            className={!collapsed ? "sidebar-user-row" : ""}
            onClick={() => !collapsed && setShowMenu(!showMenu)}
            style={{
              display: "flex", alignItems: "center",
              gap: collapsed ? 0 : 9,
              justifyContent: collapsed ? "center" : "flex-start",
              cursor: collapsed ? "default" : "pointer",
              padding: collapsed ? 0 : "6px 6px",
              borderRadius: 8,
              background: showMenu && !collapsed ? "rgba(124,58,237,0.1)" : "transparent",
              border: showMenu && !collapsed ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
              transition: "all .12s",
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 30, height: 30,
              background: "linear-gradient(135deg, #7c3aed, #6366F1)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
              boxShadow: "0 0 8px rgba(124,58,237,0.3)",
            }}>
              {initials}
            </div>

            {!collapsed && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#e4e4e7", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {session?.user?.name || "User"}
                  </div>
                  <div style={{ color: "#52525b", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {session?.user?.email || ""}
                  </div>
                </div>
                <svg
                  className="sidebar-user-chevron"
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="#52525b" strokeWidth="2" strokeLinecap="round"
                  style={{ flexShrink: 0, transform: showMenu ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </>
            )}
          </div>
        </div>

      </aside>
    </>
  )
}
