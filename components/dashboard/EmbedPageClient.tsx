// "use client"
// import { useState, useEffect } from "react"

// type Workspace = {
//   id: string
//   name: string
//   slug: string
//   color: string
//   welcomeMsg: string
//   position: string
// }

// type Props = {
//   workspaces: Workspace[]
//   appUrl: string
// }

// const COLORS = [
//   "#6366F1", "#0D9488", "#D97706", "#DC2626",
//   "#0EA5E9", "#7C3AED", "#059669", "#DB2777",
// ]

// const POSITIONS = [
//   { value: "bottom-left",   label: "↙ Bottom left" },
//   { value: "bottom-center", label: "↓ Bottom center" },
//   { value: "bottom-right",  label: "↘ Bottom right" },
// ]

// export default function EmbedPageClient({ workspaces, appUrl }: Props) {
//   const [selectedId, setSelectedId]     = useState(workspaces[0]?.id ?? "")
//   const [color, setColor]               = useState(workspaces[0]?.color ?? "#6366F1")
//   const [position, setPosition]         = useState(workspaces[0]?.position ?? "bottom-right")
//   const [welcomeMsg, setWelcomeMsg]     = useState(workspaces[0]?.welcomeMsg || "Hi! How can I help you today?")
//   const [copied, setCopied]             = useState(false)
//   const [saving, setSaving]             = useState(false)
//   const [toast, setToast]               = useState("")
//   const [toastVisible, setToastVisible] = useState(false)

//   const selectedWs = workspaces.find((w) => w.id === selectedId)

//   // When workspace changes, sync settings from that workspace
//   useEffect(() => {
//     if (!selectedWs) return
//     setColor(selectedWs.color)
//     setPosition(selectedWs.position || "bottom-right")
//     setWelcomeMsg(selectedWs.welcomeMsg || "Hi! How can I help you today?")
//   }, [selectedId])

//   function showToast(msg: string) {
//     setToast(msg)
//     setToastVisible(true)
//     setTimeout(() => setToastVisible(false), 2500)
//   }

//   const snippet = `<script\n  src="${appUrl}/embed.js"\n  data-workspace="${selectedWs?.slug ?? ""}"\n  data-color="${color}"\n  data-position="${position}"\n  data-welcome="${welcomeMsg}"\n  defer\n><\/script>`

//   function copySnippet() {
//     navigator.clipboard?.writeText(snippet)
//     setCopied(true)
//     showToast("Snippet copied to clipboard!")
//     setTimeout(() => setCopied(false), 2000)
//   }

//   async function saveSettings() {
//     if (!selectedId) return
//     setSaving(true)
//     const res = await fetch(`/api/workspace/${selectedId}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ color, position, welcomeMsg }),
//     })
//     setSaving(false)
//     if (res.ok) {
//       showToast("Widget settings saved!")
//     } else {
//       showToast("Failed to save settings")
//     }
//   }

//   // No workspaces state
//   if (workspaces.length === 0) {
//     return (
//       <div style={{ padding: "28px 30px", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
//         <h1 style={{ fontSize: 21, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Embed code generator</h1>
//         <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>Customise your chat widget and paste one line into any website</p>
//         <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
//           <p style={{ fontSize: 14, color: "#475569", marginBottom: 16 }}>You need a workspace before generating an embed snippet.</p>
//           <a href="/dashboard/projects/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
//             Create workspace →
//           </a>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div style={{ padding: "28px 30px", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>

//       {/* Page header */}
//       <div style={{ marginBottom: 24 }}>
//         <h1 style={{ fontSize: 21, fontWeight: 700, color: "#0F172A", margin: 0 }}>Embed code generator</h1>
//         <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>Customise your chat widget and paste one line into any website</p>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

//         {/* ── Left column: Settings ── */}
//         <div>
//           <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 14 }}>
//             <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 18 }}>Widget settings</div>

//             {/* Workspace selector */}
//             <div style={{ marginBottom: 18 }}>
//               <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Workspace</label>
//               <select
//                 value={selectedId}
//                 onChange={(e) => setSelectedId(e.target.value)}
//                 style={{ width: "100%", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#0F172A", background: "#fff", outline: "none" }}
//               >
//                 {workspaces.map((w) => (
//                   <option key={w.id} value={w.id}>{w.name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Accent color */}
//             <div style={{ marginBottom: 18 }}>
//               <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>Accent colour</label>
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {COLORS.map((c) => (
//                   <button
//                     key={c}
//                     onClick={() => setColor(c)}
//                     style={{
//                       width: 26, height: 26, borderRadius: "50%", background: c,
//                       cursor: "pointer", border: "none",
//                       outline: color === c ? `3px solid ${c}` : "3px solid transparent",
//                       outlineOffset: 2,
//                       transform: color === c ? "scale(1.15)" : "scale(1)",
//                       transition: "all .12s",
//                     }}
//                   />
//                 ))}
//                 {/* Custom color input */}
//                 <div style={{ position: "relative", width: 26, height: 26 }}>
//                   <input
//                     type="color"
//                     value={color}
//                     onChange={(e) => setColor(e.target.value)}
//                     title="Custom color"
//                     style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid #E2E8F0", cursor: "pointer", padding: 0, background: "none" }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Position */}
//             <div style={{ marginBottom: 18 }}>
//               <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>Widget position</label>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
//                 {POSITIONS.map((p) => (
//                   <button
//                     key={p.value}
//                     onClick={() => setPosition(p.value)}
//                     style={{
//                       padding: "7px 6px", border: "1px solid",
//                       borderColor: position === p.value ? "#6366F1" : "#E2E8F0",
//                       borderRadius: 7, fontSize: 11, fontWeight: position === p.value ? 600 : 500,
//                       background: position === p.value ? "#EEF2FF" : "#fff",
//                       color: position === p.value ? "#3730A3" : "#475569",
//                       cursor: "pointer", fontFamily: "inherit", textAlign: "center",
//                       transition: "all .12s",
//                     }}
//                   >
//                     {p.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Welcome message */}
//             <div style={{ marginBottom: 20 }}>
//               <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Welcome message</label>
//               <input
//                 type="text"
//                 value={welcomeMsg}
//                 onChange={(e) => setWelcomeMsg(e.target.value)}
//                 placeholder="Hi! How can I help you today?"
//                 style={{ width: "100%", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#0F172A", outline: "none", boxSizing: "border-box" }}
//                 onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
//                 onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
//               />
//             </div>

//             {/* Save button */}
//             <button
//               onClick={saveSettings}
//               disabled={saving}
//               style={{ width: "100%", padding: "9px 0", borderRadius: 8, background: saving ? "#A5B4FC" : "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}
//             >
//               {saving ? "Saving…" : "Save widget settings"}
//             </button>
//           </div>
//         </div>

//         {/* ── Right column: Code + Preview ── */}
//         <div>

//           {/* Code block */}
//           <div style={{ background: "#0F172A", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
//             {/* Mac-style header */}
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
//               <div style={{ display: "flex", gap: 5 }}>
//                 {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
//                   <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
//                 ))}
//               </div>
//               <button
//                 onClick={copySnippet}
//                 style={{
//                   background: copied ? "rgba(13,148,136,.2)" : "rgba(255,255,255,.08)",
//                   border: "none", color: copied ? "#5EEAD4" : "#7DD3FC",
//                   borderRadius: 5, padding: "4px 10px", fontSize: 11,
//                   cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
//                   fontFamily: "inherit", transition: "all .12s",
//                 }}
//               >
//                 {copied ? (
//                   <>
//                     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
//                     Copied!
//                   </>
//                 ) : (
//                   <>
//                     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
//                     Copy snippet
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Syntax highlighted code */}
//             <pre style={{ color: "#7DD3FC", fontSize: 12, fontFamily: "'Fira Code','Courier New',monospace", padding: "14px 16px", lineHeight: 1.8, overflowX: "auto", margin: 0 }}>
//               <span style={{ color: "#F472B6" }}>&lt;script</span>{"\n"}
//               {"  "}<span style={{ color: "#86EFAC" }}>src</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{appUrl}/embed.js"</span>{"\n"}
//               {"  "}<span style={{ color: "#86EFAC" }}>data-workspace</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{selectedWs?.slug}"</span>{"\n"}
//               {"  "}<span style={{ color: "#86EFAC" }}>data-color</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{color}"</span>{"\n"}
//               {"  "}<span style={{ color: "#86EFAC" }}>data-position</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{position}"</span>{"\n"}
//               {"  "}<span style={{ color: "#86EFAC" }}>data-welcome</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{welcomeMsg}"</span>{"\n"}
//               {"  "}<span style={{ color: "#86EFAC" }}>defer</span>{"\n"}
//               <span style={{ color: "#F472B6" }}>&gt;&lt;/script&gt;</span>
//             </pre>
//           </div>

//           {/* Live preview */}
//           <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
//             <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Live preview</div>

//             {/* Mock website */}
//             <div style={{ background: "linear-gradient(135deg,#E8EDF3 0%,#F1F5F9 100%)", borderRadius: 10, padding: 16, minHeight: 280, position: "relative" }}>

//               {/* Mock page content */}
//               <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E2E8F0", padding: 14, marginBottom: 12 }}>
//                 <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, marginBottom: 8 }} />
//                 <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, marginBottom: 8, width: "80%" }} />
//                 <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, width: "60%" }} />
//               </div>
//               <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E2E8F0", padding: 14 }}>
//                 <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, marginBottom: 8 }} />
//                 <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, width: "70%" }} />
//               </div>

//               {/* Chat widget preview */}
//               <div style={{ position: "absolute", bottom: 16, right: 16, width: 220 }}>
//                 {/* Header */}
//                 <div style={{ background: color, borderRadius: "10px 10px 0 0", padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, transition: "background .2s" }}>
//                   <div style={{ width: 22, height: 22, background: "rgba(255,255,255,.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
//                   </div>
//                   <div>
//                     <div style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>{selectedWs?.name ?? "Assistant"}</div>
//                     <div style={{ color: "rgba(255,255,255,.7)", fontSize: 9 }}>Powered by DocChat · online</div>
//                   </div>
//                 </div>

//                 {/* Chat body */}
//                 <div style={{ background: "#fff", borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", padding: 10 }}>
//                   <div style={{ background: "#F1F5F9", borderRadius: "10px 10px 10px 2px", padding: "6px 10px", fontSize: 11, color: "#0F172A", lineHeight: 1.4, maxWidth: "90%" }}>
//                     {welcomeMsg || "Hi! How can I help you today?"}
//                   </div>
//                 </div>

//                 {/* Input row */}
//                 <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "0 0 10px 10px", padding: 8, display: "flex", gap: 6 }}>
//                   <div style={{ flex: 1, border: "1px solid #E2E8F0", borderRadius: 6, padding: "5px 8px", fontSize: 10, color: "#94A3B8" }}>
//                     Ask anything…
//                   </div>
//                   <div style={{ width: 26, height: 26, background: color, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .2s" }}>
//                     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Toast */}
//       <div style={{
//         position: "fixed", bottom: 24, right: 24,
//         background: "#0F172A", color: "#fff",
//         padding: "10px 16px", borderRadius: 10,
//         fontSize: 13, fontWeight: 500,
//         opacity: toastVisible ? 1 : 0,
//         transform: toastVisible ? "translateY(0)" : "translateY(8px)",
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
  welcomeMsg: string
  position: string
}

type Props = {
  workspaces: Workspace[]
  appUrl: string
}

const COLORS = [
  { hex: "#6366F1", name: "Indigo" },
  { hex: "#0D9488", name: "Teal" },
  { hex: "#D97706", name: "Amber" },
  { hex: "#DC2626", name: "Red" },
  { hex: "#0EA5E9", name: "Sky" },
  { hex: "#7C3AED", name: "Violet" },
  { hex: "#059669", name: "Emerald" },
  { hex: "#DB2777", name: "Pink" },
  { hex: "#0F172A", name: "Dark" },
  { hex: "#EA580C", name: "Orange" },
]

const POSITIONS = [
  { value: "bottom-left",   label: "Bottom left",   icon: "↙" },
  { value: "bottom-center", label: "Bottom center", icon: "↓" },
  { value: "bottom-right",  label: "Bottom right",  icon: "↘" },
]

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "AI"
}

export default function EmbedPageClient({ workspaces, appUrl }: Props) {
  const [selectedId, setSelectedId]     = useState(workspaces[0]?.id ?? "")
  const [color, setColor]               = useState(workspaces[0]?.color ?? "#6366F1")
  const [position, setPosition]         = useState(workspaces[0]?.position ?? "bottom-right")
  const [welcomeMsg, setWelcomeMsg]     = useState(workspaces[0]?.welcomeMsg || "Hi! How can I help you today?")
  const [copied, setCopied]             = useState(false)
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState("")
  const [toastVisible, setToastVisible] = useState(false)

  const selectedWs = workspaces.find((w) => w.id === selectedId)

  useEffect(() => {
    if (!selectedWs) return
    setColor(selectedWs.color)
    setPosition(selectedWs.position || "bottom-right")
    setWelcomeMsg(selectedWs.welcomeMsg || "Hi! How can I help you today?")
  }, [selectedId])

  function showToast(msg: string) {
    setToast(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  const snippet = `<script\n  src="${appUrl}/embed.js"\n  data-workspace="${selectedWs?.slug ?? ""}"\n  data-color="${color}"\n  data-position="${position}"\n  data-welcome="${welcomeMsg}"\n  defer\n><\/script>`

  function copySnippet() {
    navigator.clipboard?.writeText(snippet)
    setCopied(true)
    showToast("Snippet copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  async function saveSettings() {
    if (!selectedId) return
    setSaving(true)
    const res = await fetch(`/api/workspace/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color, position, welcomeMsg }),
    })
    setSaving(false)
    showToast(res.ok ? "Widget settings saved!" : "Failed to save settings")
  }

  if (workspaces.length === 0) {
    return (
      <div style={{ padding: "48px 30px", textAlign: "center", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <p style={{ fontSize: 14, color: "#475569", marginBottom: 16 }}>No workspaces yet.</p>
        <Link href="/dashboard/projects/new" style={{ padding: "8px 16px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Create workspace →
        </Link>
      </div>
    )
  }

  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif", background: "#F8FAFC" }}>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Embed code generator</span>
          <span style={{ fontSize: 13, color: "#94A3B8", marginLeft: 10 }}>Customise your widget and paste one line into any website</span>
        </div>
        <Link href="/dashboard/preview" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
          Test in preview
        </Link>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 20, maxWidth: 1100 }}>

          {/* ── Left: Settings card ── */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
            {/* Card header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Widget settings</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>Customise the appearance</div>
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              {/* Workspace */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Workspace</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 9, fontSize: 13, fontFamily: "inherit", color: "#0F172A", background: "#fff", outline: "none", cursor: "pointer" }}
                >
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              {/* Accent color */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Accent colour</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      title={c.name}
                      onClick={() => setColor(c.hex)}
                      style={{
                        width: 28, height: 28, borderRadius: "50%", background: c.hex,
                        border: "none", cursor: "pointer",
                        outline: color === c.hex ? `3px solid ${c.hex}` : "3px solid transparent",
                        outlineOffset: 2,
                        transform: color === c.hex ? "scale(1.18)" : "scale(1)",
                        transition: "all .15s",
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    title="Custom colour"
                    style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #E2E8F0", cursor: "pointer", padding: 0, background: "none" }}
                  />
                </div>
                {/* Selected color display */}
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: color }} />
                  <span style={{ fontSize: 11, color: "#64748B", fontFamily: "monospace" }}>{color}</span>
                </div>
              </div>

              {/* Position */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Widget position</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                  {POSITIONS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPosition(p.value)}
                      style={{
                        padding: "8px 6px", borderRadius: 9,
                        border: `1.5px solid ${position === p.value ? color : "#E2E8F0"}`,
                        background: position === p.value ? color + "12" : "#fff",
                        color: position === p.value ? color : "#64748B",
                        fontSize: 11, fontWeight: position === p.value ? 700 : 500,
                        cursor: "pointer", fontFamily: "inherit", textAlign: "center",
                        transition: "all .15s",
                      }}
                    >
                      <div style={{ fontSize: 14, marginBottom: 2 }}>{p.icon}</div>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Welcome message */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Welcome message</label>
                <input
                  type="text"
                  value={welcomeMsg}
                  onChange={(e) => setWelcomeMsg(e.target.value)}
                  placeholder="Hi! How can I help you today?"
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 9, fontSize: 13, fontFamily: "inherit", color: "#0F172A", outline: "none", boxSizing: "border-box", transition: "border-color .15s" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                />
                <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>First message users see when they open the widget</p>
              </div>

              {/* Save */}
              <button
                onClick={saveSettings}
                disabled={saving}
                style={{ width: "100%", padding: "10px 0", borderRadius: 9, background: saving ? "#A5B4FC" : color, color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background .15s" }}
              >
                {saving ? "Saving…" : "Save widget settings"}
              </button>
            </div>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Code snippet card */}
            <div style={{ background: "#0F172A", borderRadius: 14, overflow: "hidden" }}>
              {/* Mac dots + copy */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                    <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                  ))}
                  <span style={{ fontSize: 11, color: "#475569", marginLeft: 6 }}>embed snippet</span>
                </div>
                <button
                  onClick={copySnippet}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: copied ? "rgba(13,148,136,.25)" : "rgba(255,255,255,.08)",
                    border: "none", color: copied ? "#5EEAD4" : "#7DD3FC",
                    borderRadius: 6, padding: "5px 12px", fontSize: 11,
                    cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                  }}
                >
                  {copied ? (
                    <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
                  ) : (
                    <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy snippet</>
                  )}
                </button>
              </div>

              {/* Code */}
              <pre style={{ color: "#7DD3FC", fontSize: 13, fontFamily: "'Fira Code','Courier New',monospace", padding: "18px 20px", lineHeight: 2, overflowX: "auto", margin: 0 }}>
                <span style={{ color: "#F472B6" }}>&lt;script</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>src</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{appUrl}/embed.js"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>data-workspace</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{selectedWs?.slug}"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>data-color</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{color}"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>data-position</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{position}"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>data-welcome</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{welcomeMsg}"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>defer</span>{"\n"}
                <span style={{ color: "#F472B6" }}>&gt;&lt;/script&gt;</span>
              </pre>
            </div>

            {/* Live preview card */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", flex: 1 }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Live preview</div>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>updates as you change settings</span>
              </div>

              <div style={{ padding: 16 }}>
                {/* Mock browser */}
                <div style={{ background: "#F1F5F9", borderRadius: 10, overflow: "hidden", border: "1px solid #E2E8F0" }}>
                  {/* Browser chrome */}
                  <div style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                        <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                      ))}
                    </div>
                    <div style={{ flex: 1, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 5, padding: "3px 10px", fontSize: 10, color: "#94A3B8", fontFamily: "monospace" }}>
                      {selectedWs?.name.toLowerCase().replace(/\s+/g, "-")}.com
                    </div>
                  </div>

                  {/* Mock page */}
                  <div style={{ padding: 16, minHeight: 220, position: "relative" }}>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ height: 7, background: "#E2E8F0", borderRadius: 4, marginBottom: 6, width: "55%" }} />
                      <div style={{ height: 7, background: "#E2E8F0", borderRadius: 4, marginBottom: 6, width: "80%" }} />
                      <div style={{ height: 7, background: "#E2E8F0", borderRadius: 4, width: "40%" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                      {[1,2,3].map((i) => (
                        <div key={i} style={{ background: "#fff", borderRadius: 6, border: "1px solid #E2E8F0", padding: 10 }}>
                          <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, marginBottom: 5 }} />
                          <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, width: "70%" }} />
                        </div>
                      ))}
                    </div>

                    {/* Widget preview */}
                    <div style={{
                      position: "absolute", bottom: 12,
                      ...(position === "bottom-left" ? { left: 12 } : position === "bottom-center" ? { left: "50%", transform: "translateX(-50%)" } : { right: 12 }),
                      width: 200,
                    }}>
                      <div style={{ background: color, borderRadius: "10px 10px 0 0", padding: "8px 10px", display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 20, height: 20, background: "rgba(255,255,255,.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                        </div>
                        <div>
                          <div style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{selectedWs?.name}</div>
                          <div style={{ color: "rgba(255,255,255,.7)", fontSize: 8 }}>Powered by DocChat</div>
                        </div>
                        <div style={{ marginLeft: "auto", width: 6, height: 6, background: "#4ADE80", borderRadius: "50%" }} />
                      </div>
                      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderTop: "none", padding: 8 }}>
                        <div style={{ background: "#F1F5F9", borderRadius: "8px 8px 8px 2px", padding: "5px 8px", fontSize: 9, color: "#0F172A", lineHeight: 1.4 }}>
                          {welcomeMsg || "Hi! How can I help you today?"}
                        </div>
                      </div>
                      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "6px 8px", display: "flex", gap: 5 }}>
                        <div style={{ flex: 1, border: "1px solid #E2E8F0", borderRadius: 5, padding: "4px 7px", fontSize: 8, color: "#94A3B8" }}>Ask anything…</div>
                        <div style={{ width: 22, height: 22, background: color, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage instruction */}
                <div style={{ marginTop: 12, padding: "10px 14px", background: "#F0FDF4", borderRadius: 8, border: "1px solid #BBF7D0", display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12"/></svg>
                  <div style={{ fontSize: 11, color: "#166534", lineHeight: 1.5 }}>
                    Copy the snippet above and paste it before the <code style={{ background: "#DCFCE7", padding: "1px 4px", borderRadius: 3 }}>&lt;/body&gt;</code> tag of any webpage. The widget appears instantly.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: "fixed", bottom: 24, right: 24,
        background: "#0F172A", color: "#fff",
        padding: "10px 18px", borderRadius: 10,
        fontSize: 13, fontWeight: 500,
        opacity: toastVisible ? 1 : 0,
        transform: toastVisible ? "translateY(0)" : "translateY(8px)",
        transition: "all .25s", pointerEvents: "none", zIndex: 100,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        {toast}
      </div>
    </div>
  )
}
