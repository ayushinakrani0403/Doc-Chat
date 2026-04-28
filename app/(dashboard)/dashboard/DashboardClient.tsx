// // "use client"
// // import { useState } from "react"
// // import Link from "next/link"

// // type Workspace = {
// //   id: string
// //   name: string
// //   slug: string
// //   color: string
// //   status: string
// //   docCount: number
// //   chatCount: number
// // }

// // type Stats = {
// //   totalWorkspaces: number
// //   totalDocs: number
// //   totalChats: number
// //   activeClients: number
  
// //   wsThisMonth: number        // ← ADD
// //   docsThisWeek: number       // ← ADD
// //   chatsThisMonth: number     // ← ADD
// //   chatsPctChange: number  
// // }

// // type User = {
// //   name?: string | null
// //   email?: string | null
// //   id?: string
// //   plan?: string
// // }

// // function getInitials(name?: string | null) {
// //   if (!name) return "U"
// //   return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
// // }

// // function getHour() {
// //   const h = new Date().getHours()
// //   if (h < 12) return "morning"
// //   if (h < 18) return "afternoon"
// //   return "evening"
// // }

// // export default function DashboardClient({ user, workspaces, stats }: { user: User; workspaces: Workspace[]; stats: Stats }) {
// //   const [toast, setToast] = useState("")
// //   const [showToast, setShowToast] = useState(false)

// //   const triggerToast = (msg: string) => {
// //     setToast(msg)
// //     setShowToast(true)
// //     setTimeout(() => setShowToast(false), 2500)
// //   }

// //   const statCards = [
// //     {
// //       label: "Workspaces",
// //       value: stats.totalWorkspaces,
// //       change: "Total created",
// //       changeColor: "#6366F1",
// //       iconBg: "#EEF2FF",
// //       icon: (
// //         <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
// //           <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
// //         </svg>
// //       ),
// //     },
// //     {
// //       label: "Docs embedded",
// //       value: stats.totalDocs,
// //       change: "Across all workspaces",
// //       changeColor: "#0D9488",
// //       iconBg: "#F0FDFA",
// //       icon: (
// //         <svg viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
// //           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
// //         </svg>
// //       ),
// //     },
// //     {
// //       label: "Total chats",
// //       value: stats.totalChats,
// //       change: "All time",
// //       changeColor: "#D97706",
// //       iconBg: "#FFFBEB",
// //       icon: (
// //         <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
// //           <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
// //         </svg>
// //       ),
// //     },
// //     {
// //       label: "Active workspaces",
// //       value: stats.activeClients,
// //       change: "Currently live",
// //       changeColor: "#059669",
// //       iconBg: "#ECFDF5",
// //       icon: (
// //         <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
// //           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
// //         </svg>
// //       ),
// //     },
// //   ]

// //   return (
// //     <div style={{ padding: "28px 30px", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
// //       {/* Header */}
// //       <div style={{ marginBottom: 24 }}>
// //         <h1 style={{ fontSize: 21, fontWeight: 700, color: "#0F172A" }}>
// //           Good {getHour()}, {user.name?.split(" ")[0] ?? "there"} 👋
// //         </h1>
// //         <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
// //           Here's what's happening across your workspaces today
// //         </p>
// //       </div>

// //       {/* Stats */}
// //       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
// //         {statCards.map((s) => (
// //           <div
// //             key={s.label}
// //             style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 18 }}
// //           >
// //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
// //               <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{s.label}</span>
// //               <div style={{ width: 30, height: 30, borderRadius: 8, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
// //                 {s.icon}
// //               </div>
// //             </div>
// //             <div style={{ fontSize: 30, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>{s.value}</div>
// //             <div style={{ fontSize: 11, marginTop: 5, fontWeight: 500, color: s.changeColor }}>{s.change}</div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Workspaces table */}
// //       <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
// //         <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //           <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Your workspaces</span>
// //           <Link
// //             href="/dashboard/projects/new"
// //             style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
// //           >
// //             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
// //             New workspace
// //           </Link>
// //         </div>

// //         {workspaces.length === 0 ? (
// //           <div style={{ padding: "48px 24px", textAlign: "center" }}>
// //             <div style={{ width: 48, height: 48, background: "#EEF2FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
// //               <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
// //                 <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
// //               </svg>
// //             </div>
// //             <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>No workspaces yet</p>
// //             <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Create your first workspace to get started</p>
// //             <Link href="/dashboard/projects/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "8px 16px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
// //               Create workspace
// //             </Link>
// //           </div>
// //         ) : (
// //           <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //             <thead>
// //               <tr style={{ background: "#F8FAFC" }}>
// //                 {["Workspace", "Documents", "Chats", "Status", "Usage", ""].map(h => (
// //                   <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {workspaces.map((ws) => {
// //                 const maxDocs = 20
// //                 const usagePct = Math.min(Math.round((ws.docCount / maxDocs) * 100), 100)
// //                 return (
// //                   <tr key={ws.id}>
// //                     <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
// //                       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //                         <div style={{ width: 32, height: 32, borderRadius: 9, background: ws.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
// //                           {getInitials(ws.name)}
// //                         </div>
// //                         <div>
// //                           <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{ws.name}</div>
// //                           <div style={{ fontSize: 11, color: "#94A3B8" }}>{ws.slug}</div>
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #F8FAFC" }}>{ws.docCount} docs</td>
// //                     <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #F8FAFC" }}>{ws.chatCount}</td>
// //                     <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
// //                       <span style={{
// //                         display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
// //                         background: ws.status === "active" ? "#ECFDF5" : "#F1F5F9",
// //                         color: ws.status === "active" ? "#064E3B" : "#475569",
// //                       }}>
// //                         {ws.status}
// //                       </span>
// //                     </td>
// //                     <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
// //                       <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden", width: 80 }}>
// //                         <div style={{ height: "100%", borderRadius: 2, background: ws.color, width: `${usagePct}%` }} />
// //                       </div>
// //                     </td>
// //                     <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
// //                       <Link
// //                         href={`/dashboard/projects/${ws.id}`}
// //                         style={{ display: "inline-flex", alignItems: "center", padding: "5px 11px", borderRadius: 8, border: "1px solid #E2E8F0", background: "transparent", fontSize: 12, fontWeight: 600, color: "#475569", textDecoration: "none" }}
// //                       >
// //                         Manage →
// //                       </Link>
// //                     </td>
// //                   </tr>
// //                 )
// //               })}
// //             </tbody>
// //           </table>
// //         )}
// //       </div>

// //       {/* Toast */}
// //       <div style={{
// //         position: "fixed", bottom: 24, right: 24, background: "#0F172A", color: "#fff",
// //         padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500,
// //         opacity: showToast ? 1 : 0, transform: showToast ? "translateY(0)" : "translateY(8px)",
// //         transition: "all .25s", pointerEvents: "none", zIndex: 100,
// //       }}>
// //         {toast}
// //       </div>
// //     </div>
// //   )
// // }


// "use client"
// import { useState } from "react"
// import Link from "next/link"

// type Workspace = {
//   id: string
//   name: string
//   slug: string
//   color: string
//   status: string
//   docCount: number
//   chatCount: number
// }

// type Stats = {
//   totalWorkspaces: number
//   totalDocs: number
//   totalChats: number
//   activeClients: number
//   wsThisMonth: number
//   docsThisWeek: number
//   chatsThisMonth: number
//   chatsPctChange: number
// }

// type User = {
//   name?: string | null
//   email?: string | null
//   id?: string
//   plan?: string
// }

// function getInitials(name?: string | null) {
//   if (!name) return "U"
//   return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
// }

// function getHour() {
//   const h = new Date().getHours()
//   if (h < 12) return "morning"
//   if (h < 18) return "afternoon"
//   return "evening"
// }

// export default function DashboardClient({ user, workspaces, stats }: { user: User; workspaces: Workspace[]; stats: Stats }) {
//   const [toast, setToast]       = useState("")
//   const [showToast, setShowToast] = useState(false)

//   const triggerToast = (msg: string) => {
//     setToast(msg)
//     setShowToast(true)
//     setTimeout(() => setShowToast(false), 2500)
//   }

//   // ── Dynamic change labels ─────────────────────────────────────────────────
//   const wsChange = stats.wsThisMonth > 0
//     ? `+${stats.wsThisMonth} this month`
//     : "No new this month"

//   const docsChange = stats.docsThisWeek > 0
//     ? `+${stats.docsThisWeek} this week`
//     : "No new this week"

//   const chatsChange = stats.chatsPctChange > 0
//     ? `↑ ${stats.chatsPctChange}% vs last month`
//     : stats.chatsPctChange < 0
//     ? `↓ ${Math.abs(stats.chatsPctChange)}% vs last month`
//     : "Same as last month"

//   const chatsChangeColor = stats.chatsPctChange > 0
//     ? "#D97706"
//     : stats.chatsPctChange < 0
//     ? "#EF4444"
//     : "#94A3B8"

//   const statCards = [
//     {
//       label: "Workspaces",
//       value: stats.totalWorkspaces,
//       change: wsChange,
//       changeColor: "#6366F1",
//       iconBg: "#EEF2FF",
//       icon: (
//         <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
//           <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
//         </svg>
//       ),
//     },
//     {
//       label: "Docs embedded",
//       value: stats.totalDocs,
//       change: docsChange,
//       changeColor: "#0D9488",
//       iconBg: "#F0FDFA",
//       icon: (
//         <svg viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
//           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
//         </svg>
//       ),
//     },
//     {
//       label: "Chats this month",
//       value: stats.chatsThisMonth,
//       change: chatsChange,
//       changeColor: chatsChangeColor,
//       iconBg: "#FFFBEB",
//       icon: (
//         <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
//           <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
//         </svg>
//       ),
//     },
//     {
//       label: "Active workspaces",
//       value: stats.activeClients,
//       change: "All systems healthy",
//       changeColor: "#059669",
//       iconBg: "#ECFDF5",
//       icon: (
//         <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
//           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
//         </svg>
//       ),
//     },
//   ]

//   return (
//     <div style={{ padding: "28px 30px", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
//       {/* Header */}
//       <div style={{ marginBottom: 24 }}>
//         <h1 style={{ fontSize: 21, fontWeight: 700, color: "#0F172A" }}>
//           Good {getHour()}, {user.name?.split(" ")[0] ?? "there"} 👋
//         </h1>
//         <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
//           Here's what's happening across your workspaces today
//         </p>
//       </div>

//       {/* Stats */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
//         {statCards.map((s) => (
//           <div
//             key={s.label}
//             style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 18 }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
//               <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{s.label}</span>
//               <div style={{ width: 30, height: 30, borderRadius: 8, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 {s.icon}
//               </div>
//             </div>
//             <div style={{ fontSize: 30, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>{s.value}</div>
//             <div style={{ fontSize: 11, marginTop: 5, fontWeight: 500, color: s.changeColor }}>{s.change}</div>
//           </div>
//         ))}
//       </div>

//       {/* Workspaces table */}
//       <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
//         <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Your workspaces</span>
//           <Link
//             href="/dashboard/projects/new"
//             style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
//           >
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
//             New workspace
//           </Link>
//         </div>

//         {workspaces.length === 0 ? (
//           <div style={{ padding: "48px 24px", textAlign: "center" }}>
//             <div style={{ width: 48, height: 48, background: "#EEF2FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
//                 <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
//               </svg>
//             </div>
//             <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>No workspaces yet</p>
//             <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Create your first workspace to get started</p>
//             <Link href="/dashboard/projects/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "8px 16px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
//               Create workspace
//             </Link>
//           </div>
//         ) : (
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ background: "#F8FAFC" }}>
//                 {["Workspace", "Documents", "Chats", "Status", "Usage", ""].map(h => (
//                   <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {workspaces.map((ws) => {
//                 const maxDocs  = 20
//                 const usagePct = Math.min(Math.round((ws.docCount / maxDocs) * 100), 100)
//                 return (
//                   <tr key={ws.id}>
//                     <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                         <div style={{ width: 32, height: 32, borderRadius: 9, background: ws.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
//                           {getInitials(ws.name)}
//                         </div>
//                         <div>
//                           <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{ws.name}</div>
//                           <div style={{ fontSize: 11, color: "#94A3B8" }}>{ws.slug}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #F8FAFC" }}>{ws.docCount} docs</td>
//                     <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #F8FAFC" }}>{ws.chatCount}</td>
//                     <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
//                       <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: ws.status === "active" ? "#ECFDF5" : "#F1F5F9", color: ws.status === "active" ? "#064E3B" : "#475569" }}>
//                         {ws.status}
//                       </span>
//                     </td>
//                     <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
//                       <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden", width: 80 }}>
//                         <div style={{ height: "100%", borderRadius: 2, background: ws.color, width: `${usagePct}%` }} />
//                       </div>
//                     </td>
//                     <td style={{ padding: "11px 16px", borderBottom: "1px solid #F8FAFC" }}>
//                       <Link
//                         href={`/dashboard/projects/${ws.id}`}
//                         style={{ display: "inline-flex", alignItems: "center", padding: "5px 11px", borderRadius: 8, border: "1px solid #E2E8F0", background: "transparent", fontSize: 12, fontWeight: 600, color: "#475569", textDecoration: "none" }}
//                       >
//                         Manage →
//                       </Link>
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Toast */}
//       <div style={{
//         position: "fixed", bottom: 24, right: 24, background: "#0F172A", color: "#fff",
//         padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500,
//         opacity: showToast ? 1 : 0, transform: showToast ? "translateY(0)" : "translateY(8px)",
//         transition: "all .25s", pointerEvents: "none", zIndex: 100,
//       }}>
//         {toast}
//       </div>
//     </div>
//   )
// }


"use client"
import { useState, useEffect } from "react"
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
  wsThisMonth: number
  docsThisWeek: number
  chatsThisMonth: number
  chatsPctChange: number
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
  const [toast, setToast]         = useState("")
  const [showToast, setShowToast] = useState(false)
  const [isMobile, setIsMobile]   = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const triggerToast = (msg: string) => {
    setToast(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  // ── Dynamic change labels ─────────────────────────────────────────────────
  const wsChange = stats.wsThisMonth > 0
    ? `+${stats.wsThisMonth} this month`
    : "No new this month"

  const docsChange = stats.docsThisWeek > 0
    ? `+${stats.docsThisWeek} this week`
    : "No new this week"

  const chatsChange = stats.chatsPctChange > 0
    ? `↑ ${stats.chatsPctChange}% vs last month`
    : stats.chatsPctChange < 0
    ? `↓ ${Math.abs(stats.chatsPctChange)}% vs last month`
    : "Same as last month"

  const chatsChangeColor = stats.chatsPctChange > 0
    ? "#D97706"
    : stats.chatsPctChange < 0
    ? "#EF4444"
    : "#94A3B8"

  const statCards = [
    {
      label: "Workspaces",
      value: stats.totalWorkspaces,
      change: wsChange,
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
      change: docsChange,
      changeColor: "#0D9488",
      iconBg: "#F0FDFA",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
    {
      label: "Chats this month",
      value: stats.chatsThisMonth,
      change: chatsChange,
      changeColor: chatsChangeColor,
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
      change: "All systems healthy",
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
    <div style={{
      padding: isMobile ? "16px" : "28px 30px",
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        <h1 style={{ fontSize: isMobile ? 18 : 21, fontWeight: 700, color: "#0F172A" }}>
          Good {getHour()}, {user.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
          Here&apos;s what&apos;s happening across your workspaces today
        </p>
      </div>

      {/* Stats grid — 2 cols on mobile, 4 on desktop */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: isMobile ? 10 : 14,
        marginBottom: isMobile ? 14 : 22,
      }}>
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              padding: isMobile ? 14 : 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: "#94A3B8", fontWeight: 500 }}>{s.label}</span>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, marginTop: 5, fontWeight: 500, color: s.changeColor }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Workspaces section */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        {/* Section header */}
        <div style={{
          padding: isMobile ? "12px 14px" : "14px 18px",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Your workspaces</span>
          <Link
            href="/dashboard/projects/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: isMobile ? "5px 10px" : "5px 12px",
              borderRadius: 8,
              background: "#6366F1",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {isMobile ? "New" : "New workspace"}
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
        ) : isMobile ? (
          /* ── Mobile: card list instead of table ── */
          <div style={{ display: "flex", flexDirection: "column" }}>
            {workspaces.map((ws, idx) => {
              const maxDocs  = 20
              const usagePct = Math.min(Math.round((ws.docCount / maxDocs) * 100), 100)
              return (
                <div
                  key={ws.id}
                  style={{
                    padding: "14px",
                    borderBottom: idx < workspaces.length - 1 ? "1px solid #F1F5F9" : "none",
                  }}
                >
                  {/* Row 1: avatar + name + manage button */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: ws.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {getInitials(ws.name)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{ws.name}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{ws.slug}</div>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/projects/${ws.id}`}
                      style={{ display: "inline-flex", alignItems: "center", padding: "5px 11px", borderRadius: 8, border: "1px solid #E2E8F0", background: "transparent", fontSize: 12, fontWeight: 600, color: "#475569", textDecoration: "none", whiteSpace: "nowrap" }}
                    >
                      Manage →
                    </Link>
                  </div>

                  {/* Row 2: stats chips */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: "#475569" }}>
                      <span style={{ fontWeight: 600 }}>{ws.docCount}</span> docs
                    </span>
                    <span style={{ color: "#CBD5E1", fontSize: 11 }}>·</span>
                    <span style={{ fontSize: 11, color: "#475569" }}>
                      <span style={{ fontWeight: 600 }}>{ws.chatCount}</span> chats
                    </span>
                    <span style={{ color: "#CBD5E1", fontSize: 11 }}>·</span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", padding: "2px 8px",
                      borderRadius: 20, fontSize: 10, fontWeight: 700,
                      background: ws.status === "active" ? "#ECFDF5" : "#F1F5F9",
                      color: ws.status === "active" ? "#064E3B" : "#475569",
                    }}>
                      {ws.status}
                    </span>
                  </div>

                  {/* Row 3: usage bar */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: "#94A3B8" }}>Usage</span>
                      <span style={{ fontSize: 10, color: "#94A3B8" }}>{usagePct}%</span>
                    </div>
                    <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 2, background: ws.color, width: `${usagePct}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* ── Desktop: original table ── */
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
                const maxDocs  = 20
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
        position: "fixed",
        bottom: isMobile ? 16 : 24,
        right: isMobile ? 16 : 24,
        left: isMobile ? 16 : "auto",
        background: "#0F172A",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        opacity: showToast ? 1 : 0,
        transform: showToast ? "translateY(0)" : "translateY(8px)",
        transition: "all .25s",
        pointerEvents: "none",
        zIndex: 100,
        textAlign: isMobile ? "center" : "left",
      }}>
        {toast}
      </div>
    </div>
  )
}
