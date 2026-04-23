// "use client"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"

// const COLORS = [
//   { value: "#6366F1", label: "Indigo" },
//   { value: "#8B5CF6", label: "Violet" },
//   { value: "#EC4899", label: "Pink" },
//   { value: "#0D9488", label: "Teal" },
//   { value: "#F59E0B", label: "Amber" },
//   { value: "#EF4444", label: "Red" },
//   { value: "#3B82F6", label: "Blue" },
//   { value: "#10B981", label: "Emerald" },
// ]

// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2) || "WS"
// }

// export default function NewWorkspacePage() {
//   const router = useRouter()

//   const [name, setName] = useState("")
//   const [systemPrompt, setSystemPrompt] = useState("")
//   const [color, setColor] = useState("#6366F1")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")

//     // Client-side validation
//     if (name.trim().length < 2) {
//       setError("Workspace name must be at least 2 characters.")
//       return
//     }
//     if (name.trim().length > 60) {
//       setError("Workspace name must be under 60 characters.")
//       return
//     }

//     setLoading(true)

//     try {
//       const res = await fetch("/api/workspace", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name.trim(),
//           systemPrompt: systemPrompt.trim(),
//           color,
//         }),
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         setError(data.error || "Something went wrong. Please try again.")
//         setLoading(false)
//         return
//       }

//       router.push(`/dashboard/projects/${data.id}`)
//     } catch (err) {
//       console.error(err)
//       setError("Network error. Please check your connection.")
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={{ maxWidth: 600, margin: "0 auto", padding: "36px 24px", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>

//       {/* Back link */}
//       <Link
//         href="/dashboard"
//         style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6366F1", textDecoration: "none", marginBottom: 28, fontWeight: 500 }}
//       >
//         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M19 12H5M12 5l-7 7 7 7"/>
//         </svg>
//         Back to Dashboard
//       </Link>

//       {/* Page heading */}
//       <div style={{ marginBottom: 32 }}>
//         <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
//           Create New Workspace
//         </h1>
//         <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
//           Each workspace is an isolated AI chatbot trained on your documents.
//           Give it a name, pick a color, and optionally define its behavior.
//         </p>
//       </div>

//       {/* Error banner */}
//       {error && (
//         <div style={{
//           display: "flex", alignItems: "flex-start", gap: 10,
//           background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
//           borderRadius: 10, padding: "11px 14px", marginBottom: 24,
//         }}>
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
//             <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
//           </svg>
//           <span style={{ fontSize: 13, color: "#EF4444" }}>{error}</span>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

//         {/* Workspace Name */}
//         <div>
//           <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
//             Workspace Name <span style={{ color: "#EF4444" }}>*</span>
//           </label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="e.g. Acme Corp FAQ"
//             required
//             maxLength={60}
//             style={{
//               width: "100%", padding: "10px 14px", borderRadius: 10,
//               border: "1px solid #E2E8F0", fontSize: 14, outline: "none",
//               boxSizing: "border-box", color: "#0F172A",
//               transition: "border-color .15s",
//             }}
//             onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
//             onBlur={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
//           />
//           <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5, textAlign: "right" }}>
//             {name.length}/60
//           </div>
//         </div>

//         {/* System Prompt */}
//         <div>
//           <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
//             System Prompt
//             <span style={{ fontSize: 11, fontWeight: 400, color: "#94A3B8", marginLeft: 6 }}>Optional</span>
//           </label>
//           <textarea
//             value={systemPrompt}
//             onChange={(e) => setSystemPrompt(e.target.value)}
//             placeholder="e.g. You are a helpful assistant for Acme Corp. Answer only using the uploaded documents. If you don't know, say so."
//             rows={4}
//             style={{
//               width: "100%", padding: "10px 14px", borderRadius: 10,
//               border: "1px solid #E2E8F0", fontSize: 14, outline: "none",
//               resize: "vertical", boxSizing: "border-box", color: "#0F172A",
//               lineHeight: 1.6, transition: "border-color .15s",
//             }}
//             onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
//             onBlur={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
//           />
//           <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 5 }}>
//             This defines how the AI behaves inside this workspace.
//           </p>
//         </div>

//         {/* Color Picker */}
//         <div>
//           <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>
//             Widget Color
//           </label>
//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
//             {COLORS.map((c) => (
//               <button
//                 key={c.value}
//                 type="button"
//                 title={c.label}
//                 onClick={() => setColor(c.value)}
//                 style={{
//                   width: 32, height: 32, borderRadius: "50%",
//                   background: c.value, cursor: "pointer",
//                   border: color === c.value ? `3px solid #0F172A` : "3px solid transparent",
//                   outline: color === c.value ? `2px solid ${c.value}` : "none",
//                   outlineOffset: 2,
//                   transition: "all .15s",
//                 }}
//               />
//             ))}
//           </div>
//           <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 8 }}>
//             This color will be used for the chat widget on your website.
//           </p>
//         </div>

//         {/* Preview card */}
//         {name.trim() && (
//           <div style={{ background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
//               {getInitials(name)}
//             </div>
//             <div>
//               <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{name.trim()}</div>
//               <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
//                 {name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40)}-xxxxx
//               </div>
//             </div>
//             <div style={{ marginLeft: "auto" }}>
//               <span style={{ background: "#ECFDF5", color: "#064E3B", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>active</span>
//             </div>
//           </div>
//         )}

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             padding: "12px 0", borderRadius: 10,
//             background: loading ? "#A5B4FC" : "#6366F1",
//             color: "#fff", fontSize: 14, fontWeight: 600,
//             border: "none", cursor: loading ? "not-allowed" : "pointer",
//             display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//             transition: "background .15s",
//           }}
//         >
//           {loading ? (
//             <>
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
//                 <circle cx="12" cy="12" r="10" opacity=".25"/><path d="M12 2a10 10 0 0 1 10 10" opacity=".75"/>
//               </svg>
//               Creating workspace…
//             </>
//           ) : (
//             <>
//               Create Workspace
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//                 <path d="M5 12h14M12 5l7 7-7 7"/>
//               </svg>
//             </>
//           )}
//         </button>

//       </form>

//       <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
//     </div>
//   )
// }





"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const COLORS = [
  { value: "#6366F1", label: "Indigo" },
  { value: "#8B5CF6", label: "Violet" },
  { value: "#EC4899", label: "Pink" },
  { value: "#0D9488", label: "Teal" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#EF4444", label: "Red" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Emerald" },
]

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "WS"
}

function slugPreview(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 36)
}

export default function NewWorkspacePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [color, setColor] = useState("#6366F1")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (name.trim().length < 2) { setError("Workspace name must be at least 2 characters."); return }
    if (name.trim().length > 60) { setError("Workspace name must be under 60 characters."); return }
    setLoading(true)
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), systemPrompt: systemPrompt.trim(), color }),
      })
      const data = await res.json()

      // if (!res.ok) { setError(data.error || "Something went wrong."); 
      //   setLoading(false); return
      //  }
     
    if (!res.ok) {
      if (data.upgradeRequired) {
        // redirect straight to Stripe checkout
        const checkoutRes = await fetch("/api/billing/checkout", { method: "POST" })
        const checkoutData = await checkoutRes.json()
        if (checkoutData.url) { window.location.href = checkoutData.url; return }
      }
      setError(data.error || "Something went wrong.")
      setLoading(false)
      return
    }

      router.push(`/dashboard/projects/${data.id}`)
    } catch {
      setError("Network error. Please check your connection.")
      setLoading(false)
    }
  }

  const slug = slugPreview(name)
  const hasName = name.trim().length > 0

  return (
    <div style={{
      minHeight: "100%",
      background: "#F1F5F9",
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      padding: "32px 30px",
    }}>
      {/* Back link */}
      <Link
        href="/dashboard"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "#6366F1", textDecoration: "none",
          fontWeight: 500, marginBottom: 28,
          padding: "5px 10px", borderRadius: 7,
          background: "rgba(99,102,241,0.07)",
          transition: "background .15s",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to Dashboard
      </Link>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, maxWidth: 960, margin: "0 auto" }}>

        {/* ── LEFT: Form ── */}
        <div>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>
              Create New Workspace
            </h1>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, margin: 0 }}>
              Each workspace is an isolated AI chatbot trained on your documents.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 10, padding: "11px 14px", marginBottom: 20,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
              <span style={{ fontSize: 13, color: "#DC2626", fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Card 1: Basic Info */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 24, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Basic info</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>Name and identity of your workspace</div>
                </div>
              </div>

              {/* Workspace Name */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 7, letterSpacing: "0.02em" }}>
                  WORKSPACE NAME <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corp FAQ"
                  required
                  maxLength={60}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 9,
                    border: "1px solid #E2E8F0", fontSize: 14, outline: "none",
                    boxSizing: "border-box", color: "#0F172A", background: "#fff",
                    transition: "border-color .15s, box-shadow .15s",
                    fontFamily: "inherit",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,.1)" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {hasName ? (
                    <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>
                      slug: {slug}-xxxxx
                    </span>
                  ) : <span />}
                  <span style={{ fontSize: 11, color: name.length > 50 ? "#F59E0B" : "#94A3B8" }}>
                    {name.length}/60
                  </span>
                </div>
              </div>

              {/* Widget Color */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 10, letterSpacing: "0.02em" }}>
                  WIDGET COLOR
                </label>
                <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onClick={() => setColor(c.value)}
                      style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: c.value, cursor: "pointer",
                        border: color === c.value ? `3px solid #0F172A` : "3px solid transparent",
                        outline: color === c.value ? `2px solid ${c.value}` : "none",
                        outlineOffset: 2,
                        transition: "all .15s",
                        transform: color === c.value ? "scale(1.1)" : "scale(1)",
                        boxShadow: color === c.value ? `0 0 0 2px ${c.value}40` : "none",
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 8 }}>
                  Used for the chat bubble and widget header on your client's website.
                </p>
              </div>
            </div>

            {/* Card 2: AI Behaviour */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 24, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>AI behaviour</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>Optional — shapes how the bot responds</div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 7, letterSpacing: "0.02em" }}>
                  SYSTEM PROMPT
                  <span style={{ fontSize: 11, fontWeight: 400, color: "#94A3B8", marginLeft: 8, textTransform: "none", letterSpacing: 0 }}>Optional</span>
                </label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="e.g. You are a helpful assistant for Acme Corp. Answer only using the uploaded documents. If you don't know, say so."
                  rows={4}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 9,
                    border: "1px solid #E2E8F0", fontSize: 13, outline: "none",
                    resize: "vertical", boxSizing: "border-box", color: "#0F172A",
                    lineHeight: 1.6, transition: "border-color .15s, box-shadow .15s",
                    fontFamily: "inherit", background: "#fff",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#0D9488"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,.1)" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }}
                />
                <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 6, lineHeight: 1.5 }}>
                  Leave blank for a general-purpose assistant. Be specific to get better, more focused responses.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !hasName}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 10,
                background: loading || !hasName ? "#A5B4FC" : "#6366F1",
                color: "#fff", fontSize: 14, fontWeight: 600,
                border: "none", cursor: loading || !hasName ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all .15s", fontFamily: "inherit",
                boxShadow: loading || !hasName ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
              }}
            >
              {loading ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
                    <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round"/>
                  </svg>
                  Creating workspace…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
                  </svg>
                  Create Workspace
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div style={{ position: "sticky", top: 24 }}>

          {/* Preview card */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 14 }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: hasName ? "#10B981" : "#E2E8F0", transition: "background .3s" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>Workspace preview</span>
            </div>

            <div style={{ padding: 16 }}>
              {/* Workspace identity */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: hasName ? color : "#E2E8F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 16, fontWeight: 700, flexShrink: 0,
                  transition: "background .2s",
                }}>
                  {hasName ? getInitials(name) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: hasName ? "#0F172A" : "#CBD5E1", transition: "color .2s", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {hasName ? name.trim() : "Workspace name"}
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {hasName ? `${slug}-xxxxx` : "your-slug-xxxxx"}
                  </div>
                </div>
                <span style={{
                  background: hasName ? "#ECFDF5" : "#F1F5F9",
                  color: hasName ? "#064E3B" : "#94A3B8",
                  fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                  transition: "all .3s", flexShrink: 0,
                }}>
                  {hasName ? "active" : "—"}
                </span>
              </div>

              {/* Widget mini-preview */}
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 12, border: "1px solid #F1F5F9" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Chat widget</div>
                {/* Widget header */}
                <div style={{
                  background: hasName ? color : "#CBD5E1",
                  borderRadius: "8px 8px 0 0", padding: "8px 10px",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "background .2s",
                }}>
                  <div style={{ width: 22, height: 22, background: "rgba(255,255,255,0.2)", borderRadius: "50%", flexShrink: 0 }} />
                  <div>
                    <div style={{ color: "#fff", fontSize: 11, fontWeight: 600, opacity: hasName ? 1 : 0.5 }}>
                      {hasName ? `${name.trim()} Assistant` : "Your Bot Name"}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 9 }}>Powered by DocChat</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 6, height: 6, background: "#4ADE80", borderRadius: "50%" }} />
                </div>
                {/* Widget body */}
                <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderTop: "none", padding: 10 }}>
                  <div style={{ background: "#F1F5F9", padding: "7px 10px", borderRadius: "8px 8px 8px 2px", fontSize: 11, color: "#475569", lineHeight: 1.4, display: "inline-block", maxWidth: "85%" }}>
                    Hi! How can I help you today?
                  </div>
                </div>
                {/* Widget input */}
                <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderTop: "none", borderRadius: "0 0 8px 8px", padding: 7, display: "flex", gap: 5 }}>
                  <div style={{ flex: 1, border: "1px solid #E2E8F0", borderRadius: 6, padding: "5px 8px", fontSize: 10, color: "#94A3B8" }}>
                    Ask anything…
                  </div>
                  <div style={{ width: 26, height: 26, background: hasName ? color : "#CBD5E1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s", flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info tips */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>What happens next?</div>
            {[
              { icon: "📄", text: "Upload your PDFs, docs, and text files" },
              { icon: "🤖", text: "AI indexes and learns from your content" },
              { icon: "💬", text: "Embed the widget on any website in seconds" },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{step.icon}</span>
                <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .ws-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
