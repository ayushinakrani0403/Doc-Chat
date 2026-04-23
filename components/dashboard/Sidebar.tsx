
// "use client"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useSession, signOut } from "next-auth/react"

// type NavLink = {
//   href: string
//   label: string
//   icon: React.ReactNode
// }

// type NavGroup = {
//   section: string
//   links: NavLink[]
// }

// const navItems: NavGroup[] = [
//   {
//     section: "Main",
//     links: [
//       {
//         href: "/dashboard",
//         label: "Dashboard",
//         icon: (
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <rect x="3" y="3" width="7" height="7" rx="1"/>
//             <rect x="14" y="3" width="7" height="7" rx="1"/>
//             <rect x="14" y="14" width="7" height="7" rx="1"/>
//             <rect x="3" y="14" width="7" height="7" rx="1"/>
//           </svg>
//         ),
//       },
//       {
//         href: "/dashboard/projects",
//         label: "Projects",
//         icon: (
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
//           </svg>
//         ),
//       },
//       {
//         href: "/dashboard/upload",
//         label: "Upload Docs",
//         icon: (
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
//             <polyline points="17 8 12 3 7 8"/>
//             <line x1="12" y1="3" x2="12" y2="15"/>
//           </svg>
//         ),
//       },
//       {
//         href: "/dashboard/embed",
//         label: "Embed Code",
//         icon: (
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="m18 16 4-4-4-4"/>
//             <path d="m6 8-4 4 4 4"/>
//             <path d="m14.5 4-5 16"/>
//           </svg>
//         ),
//       },
//       {
//         href: "/dashboard/preview",
//         label: "Chat Preview",
//         icon: (
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
//           </svg>
//         ),
//       },
//     ],
//   },
//   {
//     section: "Settings",
//     links: [
//       {
//         href: "/dashboard/settings",
//         label: "Settings",
//         icon: (
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <circle cx="12" cy="12" r="3"/>
//             <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
//           </svg>
//         ),
//       },
//     ],
//   },
// ]

// function isActiveLink(href: string, pathname: string): boolean {
//   if (href === "/dashboard") return pathname === "/dashboard"
//   return pathname.startsWith(href)
// }

// export default function Sidebar() {
//   const pathname = usePathname()
//   const { data: session } = useSession()

//   const initials = session?.user?.name
//     ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
//     : "U"

//   return (
//     <aside style={{
//       width: 220,
//       background: "#0F172A",
//       // background: "#4e5d81",

//       display: "flex",
//       flexDirection: "column",
//       height: "100vh",
//       flexShrink: 0,
//     }}>

//       {/* Logo */}
//       <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
//         <div style={{ width: 32, height: 32, background: "#6366F1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//           <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
//             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
//           </svg>
//         </div>
//         <div>
//           <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>DocChat</div>
//           <div style={{ marginTop: 3 }}>
//             <span style={{ background: "#EEF2FF", color: "#3730A3", padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700 }}>
//               {(session?.user as any)?.plan?.toUpperCase() || "FREE"}
//             </span>
//             <span style={{ color: "#475569", fontSize: 10, marginLeft: 4 }}>Plan</span>
//           </div>
//         </div>
//       </div>

//       {/* Nav */}
//       <nav style={{ padding: "8px", flex: 1, overflowY: "auto" }}>
//         {navItems.map((group) => (
//           <div key={group.section}>
//             <div style={{ padding: "14px 10px 5px", fontSize: 10, fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>
//               {group.section}
//             </div>
//             {group.links.map((item) => {
//               const isActive = isActiveLink(item.href, pathname)
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 9,
//                     padding: "8px 10px",
//                     borderRadius: 7,
//                     textDecoration: "none",
//                     color: isActive ? "#818CF8" : "#64748B",
//                     fontSize: 13,
//                     fontWeight: isActive ? 600 : 400,
//                     marginBottom: 2,
//                     background: isActive ? "rgba(99,102,241,0.18)" : "transparent",
//                     transition: "all .12s",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isActive) {
//                       e.currentTarget.style.background = "rgba(255,255,255,0.05)"
//                       e.currentTarget.style.color = "#94A3B8"
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isActive) {
//                       e.currentTarget.style.background = "transparent"
//                       e.currentTarget.style.color = "#64748B"
//                     }
//                   }}
//                 >
//                   <span style={{ width: 15, height: 15, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     {item.icon}
//                   </span>
//                   {item.label}
//                 </Link>
//               )
//             })}
//           </div>
//         ))}
//       </nav>

//       {/* User */}
//       <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
//         <div style={{ width: 30, height: 30, background: "#6366F1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
//           {initials}
//         </div>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//             {session?.user?.name || "User"}
//           </div>
//           <div style={{ color: "#475569", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//             {session?.user?.email || ""}
//           </div>
//         </div>
//         <button
//           onClick={() => signOut({ callbackUrl: "/login" })}
//           title="Sign out"
//           style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", transition: "color .12s" }}
//           onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
//           onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
//         >
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
//             <polyline points="16 17 21 12 16 7"/>
//             <line x1="21" y1="12" x2="9" y2="12"/>
//           </svg>
//         </button>
//       </div>
//     </aside>
//   )
// }



// toggle sidebar


// "use client"
// import { useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useSession, signOut } from "next-auth/react"

// const navItems = [
//   {
//     section: "Main",
//     links: [
//       { href: "/dashboard", label: "Dashboard", icon: (
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
//       )},
//       { href: "/dashboard/projects", label: "Projects", icon: (
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
//       )},
//       { href: "/dashboard/upload", label: "Upload Docs", icon: (
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
//       )},
//       { href: "/dashboard/embed", label: "Embed Code", icon: (
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
//       )},
//       { href: "/dashboard/preview", label: "Chat Preview", icon: (
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
//       )},
//     ]
//   },
//   {
//     section: "Settings",
//     links: [
//       { href: "/dashboard/settings", label: "Settings", icon: (
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
//       )},
//     ]
//   }
// ]

// // Check if a nav item should be active based on current path
// function isActiveLink(href: string, pathname: string): boolean {
//   if (href === "/dashboard") {
//     // Only exact match for dashboard home
//     return pathname === "/dashboard"
//   }
//   // For all other links, active if pathname starts with href
//   return pathname.startsWith(href)
// }

// export default function Sidebar() {
//   const pathname = usePathname()
//   const { data: session } = useSession()
//   const [collapsed, setCollapsed] = useState(false)

//   const initials = session?.user?.name
//     ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
//     : "U"

//   const w = collapsed ? 60 : 220

//   return (
//     <aside style={{
//       width: w, minWidth: w, background: "#0F172A",
//       display: "flex", flexDirection: "column", height: "100vh",
//       flexShrink: 0, transition: "width .22s cubic-bezier(.4,0,.2,1), min-width .22s cubic-bezier(.4,0,.2,1)",
//       overflow: "hidden",
//     }}>

//       {/* Logo + toggle */}
//       <div style={{ padding: "14px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "space-between", flexShrink: 0 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
//           <div style={{ width: 32, height: 32, background: "#6366F1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//             <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
//               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
//             </svg>
//           </div>
//           {!collapsed && (
//             <div style={{ minWidth: 0 }}>
//               <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>DocChat</div>
//               <div style={{ color: "#475569", fontSize: 10, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
//                 <span style={{ background: "#EEF2FF", color: "#3730A3", padding: "1px 5px", borderRadius: 4, fontSize: 9, fontWeight: 700 }}>
//                   {session?.user?.plan?.toUpperCase() || "FREE"}
//                 </span>
//                 Plan
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Toggle button */}
//         {!collapsed && (
//           <button
//             onClick={() => setCollapsed(true)}
//             title="Collapse sidebar"
//             style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4, borderRadius: 6, display: "flex", flexShrink: 0 }}
//           >
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M11 19l-7-7 7-7"/><path d="M18 19l-7-7 7-7"/>
//             </svg>
//           </button>
//         )}
//       </div>

//       {/* Expand button when collapsed */}
//       {collapsed && (
//         <div style={{ padding: "10px 0", display: "flex", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
//           <button
//             onClick={() => setCollapsed(false)}
//             title="Expand sidebar"
//             style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 6, borderRadius: 6, display: "flex" }}
//           >
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M13 5l7 7-7 7"/><path d="M6 5l7 7-7 7"/>
//             </svg>
//           </button>
//         </div>
//       )}

//       {/* Nav */}
//       <nav style={{ padding: collapsed ? "10px 6px" : "10px 8px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
//         {navItems.map((group) => (
//           <div key={group.section}>
//             {/* Section label — hidden when collapsed */}
//             {!collapsed && (
//               <div style={{ padding: "16px 10px 4px", fontSize: 10, fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
//                 {group.section}
//               </div>
//             )}
//             {collapsed && <div style={{ height: 12 }} />}

//             {group.links.map((item) => {
//               const isActive = isActiveLink(item.href, pathname)
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   title={collapsed ? item.label : undefined}
//                   style={{
//                     display: "flex", alignItems: "center",
//                     gap: collapsed ? 0 : 9,
//                     padding: collapsed ? "9px 0" : "8px 10px",
//                     justifyContent: collapsed ? "center" : "flex-start",
//                     borderRadius: 7, textDecoration: "none",
//                     color: isActive ? "#818CF8" : "#64748B",
//                     fontSize: 13, fontWeight: isActive ? 600 : 400,
//                     marginBottom: 2,
//                     background: isActive ? "rgba(99,102,241,0.2)" : "transparent",
//                     transition: "all .12s",
//                     whiteSpace: "nowrap", overflow: "hidden",
//                   }}
//                 >
//                   <span style={{ width: 16, height: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     {item.icon}
//                   </span>
//                   {!collapsed && item.label}
//                 </Link>
//               )
//             })}
//           </div>
//         ))}
//       </nav>

//       {/* User */}
//       <div style={{
//         padding: collapsed ? "12px 0" : "12px 14px",
//         borderTop: "1px solid rgba(255,255,255,0.07)",
//         display: "flex", alignItems: "center",
//         gap: collapsed ? 0 : 10,
//         justifyContent: collapsed ? "center" : "flex-start",
//         flexShrink: 0,
//       }}>
//         <div style={{ width: 30, height: 30, background: "#6366F1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
//           {initials}
//         </div>
//         {!collapsed && (
//           <>
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <div style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                 {session?.user?.name || "User"}
//               </div>
//               <div style={{ color: "#475569", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                 {session?.user?.email || ""}
//               </div>
//             </div>


//             <button
//               onClick={() => signOut({ callbackUrl: "/login" })}
//               title="Sign out"
//               style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4, borderRadius: 6, display: "flex", flexShrink: 0 }}
//             >
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
//               </svg>
//             </button>
            

//           </>
//         )}
//       </div>
//     </aside>
//   )
// }


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
    <aside style={{
      width: w, minWidth: w, background: "#0F172A",
      display: "flex", flexDirection: "column", height: "100vh",
      flexShrink: 0, transition: "width .22s cubic-bezier(.4,0,.2,1), min-width .22s cubic-bezier(.4,0,.2,1)",
      overflow: "hidden",
    }}>

      {/* ── Logo + toggle ── */}
      <div style={{ padding: "14px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 32, height: 32, background: "#6366F1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>DocChat</div>
              <div style={{ color: "#475569", fontSize: 10, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ background: "#EEF2FF", color: "#3730A3", padding: "1px 5px", borderRadius: 4, fontSize: 9, fontWeight: 700 }}>
                  {(session?.user as any)?.plan?.toUpperCase() || "FREE"}
                </span>
                Plan
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4, borderRadius: 6, display: "flex", flexShrink: 0 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 19l-7-7 7-7"/><path d="M18 19l-7-7 7-7"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Expand button when collapsed ── */}
      {collapsed && (
        <div style={{ padding: "10px 0", display: "flex", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 6, borderRadius: 6, display: "flex" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 5l7 7-7 7"/><path d="M6 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      )}

      {/* ── Nav ── */}
      <nav style={{ padding: collapsed ? "10px 6px" : "10px 8px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {navItems.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <div style={{ padding: "16px 10px 4px", fontSize: 10, fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                {group.section}
              </div>
            )}
            {collapsed && <div style={{ height: 12 }} />}
            {group.links.map((item) => {
              const isActive = isActiveLink(item.href, pathname)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex", alignItems: "center",
                    gap: collapsed ? 0 : 9,
                    padding: collapsed ? "9px 0" : "8px 10px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 7, textDecoration: "none",
                    color: isActive ? "#818CF8" : "#64748B",
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    marginBottom: 2,
                    background: isActive ? "rgba(99,102,241,0.2)" : "transparent",
                    transition: "all .12s",
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

      {/* ── User section with popup menu ── */}
      <div style={{
        padding: collapsed ? "12px 0" : "12px 14px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        position: "relative",
        flexShrink: 0,
      }}>

        {/* Popup menu — only when expanded */}
        {showMenu && !collapsed && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShowMenu(false)}
              style={{ position: "fixed", inset: 0, zIndex: 10 }}
            />
            <div style={{
              position: "absolute", bottom: "100%", left: 14, right: 14,
              background: "#1E293B", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              overflow: "hidden", zIndex: 20, marginBottom: 6,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}>
              {/* Settings link */}
              <Link
                href="/dashboard/settings"
                onClick={() => setShowMenu(false)}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", fontSize: 13, color: "#CBD5E1", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Settings
              </Link>

              {/* Sign out */}
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", fontSize: 13, color: "#F87171", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
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
          onClick={() => !collapsed && setShowMenu(!showMenu)}
          style={{
            display: "flex", alignItems: "center",
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? "center" : "flex-start",
            cursor: collapsed ? "default" : "pointer",
          }}
        >
          {/* Avatar */}
          <div style={{ width: 30, height: 30, background: "#6366F1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
            {initials}
          </div>

          {/* Name + email — hidden when collapsed */}
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {session?.user?.name || "User"}
                </div>
                <div style={{ color: "#475569", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {session?.user?.email || ""}
                </div>
              </div>

              {/* Chevron */}
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#475569" strokeWidth="2" strokeLinecap="round"
                style={{ flexShrink: 0, transform: showMenu ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </>
          )}
        </div>
      </div>

    </aside>
  )
}
