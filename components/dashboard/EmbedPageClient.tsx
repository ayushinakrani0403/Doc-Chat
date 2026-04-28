
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
  size: string
  customWidth: number
  customHeight: number
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

export default function EmbedPageClient({ workspaces, appUrl }: Props) {
  const [selectedId, setSelectedId]     = useState(workspaces[0]?.id ?? "")
  const [color, setColor]               = useState(workspaces[0]?.color ?? "#6366F1")
  const [position, setPosition]         = useState(workspaces[0]?.position ?? "bottom-right")
  const [welcomeMsg, setWelcomeMsg]     = useState(workspaces[0]?.welcomeMsg || "Hi! How can I help you today?")
  const [copied, setCopied]             = useState(false)
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [isMobile, setIsMobile]         = useState(false)

  const sizeDefaults: Record<string, { w: number; h: number }> = {
    small:  { w: 400, h: 480 },
    medium: { w: 460, h: 580 },
    large:  { w: 540, h: 680 },
  }
  const _initSize = workspaces[0]?.size || "medium"
  const _initDims = sizeDefaults[_initSize] || sizeDefaults.medium
  const [customWidth,  setCustomWidth]  = useState(
    (workspaces[0]?.customWidth  ?? 0) > 100 ? workspaces[0]!.customWidth  : _initDims.w
  )
  const [customHeight, setCustomHeight] = useState(
    (workspaces[0]?.customHeight ?? 0) > 100 ? workspaces[0]!.customHeight : _initDims.h
  )

  const selectedWs = workspaces.find((w) => w.id === selectedId)
  const [size, setSize] = useState(workspaces[0]?.size || "medium")

  const sizeMap: Record<string, { w: number; h: number }> = {
    small:  { w: 400, h: 480 },
    medium: { w: 460, h: 580 },
    large:  { w: 540, h: 680 },
  }

  // Mobile detection
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (!selectedWs) return
    const timer = setTimeout(() => {
      setColor(selectedWs.color)
      setPosition(selectedWs.position || "bottom-right")
      setWelcomeMsg(selectedWs.welcomeMsg || "Hi! How can I help you today?")
      setSize(selectedWs.size || "medium")
      const dims = sizeDefaults[selectedWs.size || "medium"] || sizeDefaults.medium
      setCustomWidth((selectedWs.customWidth   ?? 0) > 100 ? selectedWs.customWidth  : dims.w)
      setCustomHeight((selectedWs.customHeight ?? 0) > 100 ? selectedWs.customHeight : dims.h)
    }, 0)
    return () => clearTimeout(timer)
  }, [selectedId])

  function showToast(msg: string) {
    setToast(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  const snippet = `<script
  src="${appUrl}/embed.js"
  data-workspace="${selectedWs?.slug ?? ""}"
  data-color="${color}"
  data-position="${position}"
  data-welcome="${welcomeMsg}"
  data-width="${customWidth}"
  data-height="${customHeight}"
  defer
><\/script>`

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
      body: JSON.stringify({ color, position, welcomeMsg, size, customWidth, customHeight }),
    })
    setSaving(false)
    showToast(res.ok ? "Widget settings saved!" : "Failed to save settings")
  }

  // Responsive preview dimensions
  const previewWidth  = size === "small" ? 150 : size === "large" ? 220 : size === "custom" ? Math.round(customWidth / 2.5) : 185
  const previewHeight = size === "small" ? 90  : size === "large" ? 145 : size === "custom" ? Math.round(customHeight / 5)  : 115

  if (workspaces.length === 0) {
    return (
      <div style={{ padding: "48px 20px", textAlign: "center", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <p style={{ fontSize: 14, color: "#475569", marginBottom: 16 }}>No workspaces yet.</p>
        <Link href="/dashboard/projects/new" style={{ padding: "8px 16px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Create workspace →
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      // On mobile: normal scroll; on desktop: fixed viewport
      height: isMobile ? "auto" : "100vh",
      overflow: isMobile ? "visible" : "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      background: "#F8FAFC",
    }}>

      {/* ── Top bar ── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        padding: isMobile ? "0 16px" : "0 28px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}>
            Embed code
          </span>
          {/* Hide subtitle on mobile */}
          {!isMobile && (
            <span style={{ fontSize: 12, color: "#94A3B8" }}>
              · Customise your widget and paste one line into any website
            </span>
          )}
        </div>
        <Link
          href="/dashboard/preview"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: isMobile ? "6px 10px" : "7px 14px",
            borderRadius: 8, background: "#6366F1", color: "#fff",
            fontSize: 12, fontWeight: 600, textDecoration: "none",
            whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
          </svg>
          {isMobile ? "Preview" : "Test in preview"}
        </Link>
      </div>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        overflow: isMobile ? "visible" : "auto",
        padding: isMobile ? "16px" : "24px 28px",
      }}>
        {/* On desktop: 2-col grid. On mobile: single column stack */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 16 : 20,
          height: isMobile ? "auto" : "100%",
        }}>

          {/* ── LEFT: Settings ── */}
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            alignSelf: "start",
          }}>
            {/* Card header */}
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10, background: "#FAFAFA" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Widget settings</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>Customise the appearance</div>
              </div>
            </div>

            <div style={{ padding: isMobile ? 16 : 20 }}>

              {/* Workspace */}
              <div style={{ marginBottom: 18 }}>
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
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Accent colour</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      title={c.name}
                      onClick={() => setColor(c.hex)}
                      style={{
                        width: 28, height: 28, borderRadius: "50%", background: c.hex,
                        border: color === c.hex ? "3px solid #fff" : "3px solid transparent",
                        cursor: "pointer",
                        outline: color === c.hex ? `2px solid ${c.hex}` : "none",
                        outlineOffset: 1,
                        transform: color === c.hex ? "scale(1.15)" : "scale(1)",
                        boxShadow: color === c.hex ? `0 0 0 3px ${c.hex}40` : "none",
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
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: color }} />
                  <span style={{ fontSize: 11, color: "#64748B", fontFamily: "monospace" }}>{color}</span>
                </div>
              </div>

              {/* Position */}
              <div style={{ marginBottom: 18 }}>
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
              <div style={{ marginBottom: 20 }}>
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

              {/* Widget size */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Widget size</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 10 }}>
                  {[
                    { value: "small",  label: "Small",  desc: "400 × 480px" },
                    { value: "medium", label: "Medium", desc: "460 × 580px" },
                    { value: "large",  label: "Large",  desc: "540 × 680px" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => {
                        setSize(s.value)
                        setCustomWidth(sizeMap[s.value].w)
                        setCustomHeight(sizeMap[s.value].h)
                      }}
                      style={{
                        padding: "9px 6px", borderRadius: 9, textAlign: "center" as const,
                        border: `1.5px solid ${size === s.value ? color : "#E2E8F0"}`,
                        background: size === s.value ? color + "12" : "#fff",
                        color: size === s.value ? color : "#64748B",
                        cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: size === s.value ? 700 : 500 }}>{s.label}</div>
                      <div style={{ fontSize: 10, marginTop: 2, color: size === s.value ? color : "#94A3B8" }}>{s.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Custom size inputs */}
                <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 8 }}>Or enter custom size</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 11, color: "#64748B", marginBottom: 4, display: "block" }}>Width (px)</label>
                      <input
                        type="number"
                        min={300} max={800} step={10}
                        value={customWidth}
                        onChange={(e) => { setCustomWidth(Number(e.target.value)); setSize("custom") }}
                        style={{ width: "100%", padding: "7px 10px", border: "1px solid #E2E8F0", borderRadius: 7, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: "#64748B", marginBottom: 4, display: "block" }}>Height (px)</label>
                      <input
                        type="number"
                        min={400} max={900} step={10}
                        value={customHeight}
                        onChange={(e) => { setCustomHeight(Number(e.target.value)); setSize("custom") }}
                        style={{ width: "100%", padding: "7px 10px", border: "1px solid #E2E8F0", borderRadius: 7, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save */}
              <button
                onClick={saveSettings}
                disabled={saving}
                style={{ width: "100%", padding: "10px 0", borderRadius: 9, background: saving ? "#A5B4FC" : color, color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background .2s" }}
              >
                {saving ? "Saving…" : "Save widget settings"}
              </button>
            </div>
          </div>

          {/* ── RIGHT: Code + Preview ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>

            {/* Code snippet card */}
            <div style={{ background: "#0F172A", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                    <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                  ))}
                  <span style={{ fontSize: 11, color: "#475569", marginLeft: 4 }}>embed snippet</span>
                </div>
                <button
                  onClick={copySnippet}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: copied ? "rgba(13,148,136,.25)" : "rgba(255,255,255,.08)",
                    border: "none", color: copied ? "#5EEAD4" : "#7DD3FC",
                    borderRadius: 6, padding: "5px 10px", fontSize: 11,
                    cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {copied ? (
                    <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                  ) : (
                    <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy snippet</>
                  )}
                </button>
              </div>

              {/* Code block — horizontally scrollable on mobile */}
              <pre style={{
                color: "#7DD3FC",
                fontSize: isMobile ? 11 : 13,
                fontFamily: "'Fira Code','Courier New',monospace",
                padding: isMobile ? "14px" : "18px 20px",
                lineHeight: 2,
                overflowX: "auto",
                margin: 0,
                WebkitOverflowScrolling: "touch",
              }}>
                <span style={{ color: "#F472B6" }}>&lt;script</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>src</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{appUrl}/embed.js"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>data-workspace</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{selectedWs?.slug}"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>data-color</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{color}"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>data-position</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{position}"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>data-welcome</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{welcomeMsg}"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>data-width</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{customWidth}"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>data-height</span><span style={{ color: "#fff" }}>=</span><span style={{ color: "#FCD34D" }}>"{customHeight}"</span>{"\n"}
                {"  "}<span style={{ color: "#86EFAC" }}>defer</span>{"\n"}
                <span style={{ color: "#F472B6" }}>&gt;&lt;/script&gt;</span>
              </pre>
            </div>

            {/* Live preview card */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", flex: 1 }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FAFAFA" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Live preview</div>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>
                  {isMobile ? "updates live" : "updates as you change settings"}
                </span>
              </div>

              <div style={{ padding: isMobile ? 14 : 20 }}>
                {/* Mock browser window */}
                <div style={{ background: "#F1F5F9", borderRadius: 10, overflow: "hidden", border: "1px solid #E2E8F0" }}>
                  {/* Browser chrome */}
                  <div style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                        <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                      ))}
                    </div>
                    <div style={{ flex: 1, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 5, padding: "3px 10px", fontSize: 10, color: "#94A3B8", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedWs?.name.toLowerCase().replace(/\s+/g, "-")}.com
                    </div>
                  </div>

                  {/* Mock page content */}
                  <div style={{ padding: isMobile ? 14 : 20, minHeight: isMobile ? 220 : 260, position: "relative" }}>
                    {/* Skeleton content */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ height: 8, background: "#E2E8F0", borderRadius: 4, marginBottom: 8, width: "50%" }} />
                      <div style={{ height: 8, background: "#E2E8F0", borderRadius: 4, marginBottom: 8, width: "80%" }} />
                      <div style={{ height: 8, background: "#E2E8F0", borderRadius: 4, width: "35%" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: isMobile ? 6 : 10, marginBottom: 16 }}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} style={{ background: "#fff", borderRadius: 6, border: "1px solid #E2E8F0", padding: isMobile ? 8 : 12 }}>
                          <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, marginBottom: 6 }} />
                          <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, width: "70%" }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ height: 8, background: "#E2E8F0", borderRadius: 4, marginBottom: 6, width: "60%" }} />
                    <div style={{ height: 8, background: "#E2E8F0", borderRadius: 4, width: "45%" }} />

                    {/* Widget preview */}
                    <div style={{
                      position: "absolute", bottom: 12,
                      ...(position === "bottom-left"
                        ? { left: 12 }
                        : position === "bottom-center"
                        ? { left: "50%", transform: "translateX(-50%)" }
                        : { right: 12 }),
                      width: previewWidth,
                      transition: "width 0.3s ease",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}>
                      {/* Widget header */}
                      <div style={{ background: color, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, transition: "background .2s" }}>
                        <div style={{ width: 22, height: 22, background: "rgba(255,255,255,.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
                          </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: "#fff", fontSize: 11, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedWs?.name}</div>
                          <div style={{ color: "rgba(255,255,255,.7)", fontSize: 8 }}>Powered by DocChat</div>
                        </div>
                        <div style={{ width: 6, height: 6, background: "#4ADE80", borderRadius: "50%", flexShrink: 0 }} />
                      </div>

                      {/* Widget body */}
                      <div style={{ background: "#fff", padding: 10, minHeight: previewHeight, transition: "min-height 0.3s ease", borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>
                        <div style={{ background: "#F1F5F9", borderRadius: "8px 8px 8px 2px", padding: "6px 9px", fontSize: 10, color: "#0F172A", lineHeight: 1.5 }}>
                          {welcomeMsg || "Hi! How can I help you today?"}
                        </div>
                      </div>

                      {/* Widget input */}
                      <div style={{ background: "#fff", borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", borderRadius: "0 0 12px 12px", padding: "7px 8px", display: "flex", gap: 5 }}>
                        <div style={{ flex: 1, border: "1px solid #E2E8F0", borderRadius: 6, padding: "4px 8px", fontSize: 9, color: "#94A3B8" }}>Ask anything…</div>
                        <div style={{ width: 24, height: 24, background: color, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s", flexShrink: 0 }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage instruction */}
                <div style={{ marginTop: 14, padding: "11px 14px", background: "#F0FDF4", borderRadius: 9, border: "1px solid #BBF7D0", display: "flex", gap: 9, alignItems: "flex-start" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <div style={{ fontSize: 12, color: "#166534", lineHeight: 1.6 }}>
                    Copy the snippet above and paste it before the{" "}
                    <code style={{ background: "#DCFCE7", padding: "1px 5px", borderRadius: 3, fontFamily: "monospace" }}>&lt;/body&gt;</code>
                    {" "}tag of any webpage. The widget appears instantly.
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* end RIGHT column */}
        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: "fixed",
        bottom: isMobile ? 16 : 24,
        right: isMobile ? 16 : 24,
        left: isMobile ? 16 : "auto",
        background: "#0F172A",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        opacity: toastVisible ? 1 : 0,
        transform: toastVisible ? "translateY(0)" : "translateY(8px)",
        transition: "all .25s",
        pointerEvents: "none",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: isMobile ? "center" : "flex-start",
        gap: 8,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {toast}
      </div>
    </div>
  )
}
