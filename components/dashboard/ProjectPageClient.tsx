"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────
type Workspace = {
  id: string
  name: string
  slug: string
  color: string
  status: string
  systemPrompt: string
  model: string
  temperature: number
  welcomeMsg: string
  size: string
  docCount: number
  chatCount: number
}

type Document = {
  id: string
  filename: string
  size: number
  uploadedAt: string
}

type ChartDay = { label: string; count: number }

type Props = {
  workspace: Workspace
  documents: Document[]
  chartData: ChartDay[]

  analytics: {           // ← ADD
    answeredPct: number
    avgResponseSec: string
  }

}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "WS"
}

function FileIcon({ filename }: { filename: string }) {
  const ext = filename.split(".").pop()?.toLowerCase()
  const map: Record<string, { bg: string; stroke: string }> = {
    pdf:  { bg: "#EEF2FF", stroke: "#6366F1" },
    docx: { bg: "#F0F9FF", stroke: "#0EA5E9" },
    doc:  { bg: "#F0F9FF", stroke: "#0EA5E9" },
    md:   { bg: "#FFFBEB", stroke: "#D97706" },
    txt:  { bg: "#F0FDF4", stroke: "#22C55E" },
    csv:  { bg: "#F0FDFA", stroke: "#0D9488" },
  }
  const c = map[ext ?? ""] ?? { bg: "#F1F5F9", stroke: "#64748B" }
  return (
    <div style={{ width: 34, height: 34, borderRadius: 8, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectPageClient({ workspace, documents: initialDocs, chartData, analytics }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"docs" | "embed" | "analytics" | "settings">("docs")
  const [docs, setDocs] = useState<Document[]>(initialDocs)
  const [toast, setToast] = useState("")
  const [toastVisible, setToastVisible] = useState(false)

  // Settings form state
  const [settingsName, setSettingsName] = useState(workspace.name)
  const [settingsPrompt, setSettingsPrompt] = useState(workspace.systemPrompt)
  const [settingsModel, setSettingsModel] = useState(workspace.model)
  const [settingsTemp, setSettingsTemp] = useState(String(workspace.temperature))
  const [settingsWelcome, setSettingsWelcome] = useState(workspace.welcomeMsg)
  const [settingsSaving, setSettingsSaving] = useState(false)

  // Add this with your other state declarations
  const [searchQuery, setSearchQuery] = useState("")

  // const snippetCode = `<script\n  src="${process.env.NEXT_PUBLIC_APP_URL ?? "https://yourdomain.com"}/embed.js"\n  data-workspace="${workspace.slug}"\n  data-color="${workspace.color}"\n  data-position="bottom-right"\n  data-welcome="${settingsWelcome || "Hi! How can I help you today?"}"\n  defer\n><\/script>`

  const snippetCode = `<script\n  src="${process.env.NEXT_PUBLIC_APP_URL ?? "https://yourdomain.com"}/embed.js"\n  data-workspace="${workspace.slug}"\n  data-color="${workspace.color}"\n  data-position="bottom-right"\n  data-welcome="${settingsWelcome || "Hi! How can I help you today?"}"\n  data-size="${workspace.size || "medium"}"\n  defer\n><\/script>`

  function showToast(msg: string) {
    setToast(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  async function deleteDoc(docId: string) {
    const doc = docs.find((d) => d.id === docId)
    setDocs((prev) => prev.filter((d) => d.id !== docId))

    const res = await fetch(`/api/workspace/${workspace.id}/documents/${docId}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      // Restore on failure
      if (doc) setDocs((prev) => [doc, ...prev])
      showToast("Failed to delete document")
    } else {
      showToast("Document removed")
    }
  }

  async function saveSettings() {
    setSettingsSaving(true)
    const res = await fetch(`/api/workspace/${workspace.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: settingsName,
        systemPrompt: settingsPrompt,
        model: settingsModel,
        temperature: settingsTemp,
        welcomeMsg: settingsWelcome,
      }),
    })
    setSettingsSaving(false)

    if (res.ok) {
      showToast("Settings saved!")
      router.refresh()
    } else {
      showToast("Failed to save settings")
    }
  }

  function copySnippet() {
    navigator.clipboard?.writeText(snippetCode)
    showToast("Snippet copied to clipboard!")
  }

  const maxChart = Math.max(...chartData.map((d) => d.count), 1)

  const tabStyle = (tab: typeof activeTab) => ({
    padding: "9px 18px",
    border: "none",
    background: "transparent",
    fontSize: 13,
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? "#6366F1" : "#94A3B8",
    cursor: "pointer",
    fontFamily: "inherit",
    borderBottom: activeTab === tab ? "2px solid #6366F1" : "2px solid transparent",
    marginBottom: -2,
    transition: "all .12s",
  } as React.CSSProperties)

  return (
    <div style={{ padding: "28px 30px", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>

      {/* ── Workspace header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, background: workspace.color, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
            {getInitials(workspace.name)}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 }}>{workspace.name}</h1>
              <span style={{ background: "#ECFDF5", color: "#064E3B", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                {workspace.status}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", fontFamily: "monospace", marginTop: 2 }}>
              slug: {workspace.slug} &nbsp;·&nbsp; {workspace.docCount} documents &nbsp;·&nbsp; {workspace.chatCount} chats
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setActiveTab("settings")}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "transparent", fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer", fontFamily: "inherit" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Settings
          </button>
          <Link
            href={`/dashboard/upload?slug=${workspace.slug}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Upload docs
          </Link>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", borderBottom: "2px solid #E2E8F0", marginBottom: 20 }}>
        {(["docs", "embed", "analytics", "settings"] as const).map((tab) => (
          <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "docs" && ` (${docs.length})`}
          </button>
        ))}
      </div>

      {/* ══ TAB: Documents ══ */}
      {activeTab === "docs" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
{/*        
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#475569" }}>{docs.length} documents</span>
            <Link
              href={`/dashboard/upload?slug=${workspace.slug}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 7, background: "#6366F1", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
            >
              + Upload
            </Link>
          </div>

          {docs.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 12 }}>No documents yet.</p>
              <Link href={`/dashboard/upload?slug=${workspace.slug}`} style={{ fontSize: 13, color: "#6366F1", fontWeight: 600, textDecoration: "none" }}>
                Upload your first document →
              </Link>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {docs.map((doc) => (
                <li key={doc.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #F8FAFC" }}>
                  <FileIcon filename={doc.filename} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.filename}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                      {formatSize(doc.size)} · uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{ background: "#EEF2FF", color: "#3730A3", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>embedded</span>
                  <button
                    onClick={() => deleteDoc(doc.id)}
                    title="Delete"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: "4px 6px", borderRadius: 6, display: "flex", transition: "all .12s" }}
                    onMouseOver={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "#FEF2F2" }}
                    onMouseOut={(e) => { e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.background = "none" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                      <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )} */}

{/* Header with search */}
<div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
  <span style={{ fontSize: 13, color: "#475569", flexShrink: 0 }}>
    {searchQuery ? `${docs.filter(d => d.filename.toLowerCase().includes(searchQuery.toLowerCase())).length} of ${docs.length} documents` : `${docs.length} documents`}
  </span>
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {/* Search input */}
    <div style={{ position: "relative" }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"
        style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search documents…"
        style={{
          padding: "6px 28px 6px 28px", border: "1px solid #E2E8F0",
          borderRadius: 8, fontSize: 12, fontFamily: "inherit",
          color: "#0F172A", background: "#F8FAFC", outline: "none",
          width: 180, boxSizing: "border-box" as const, transition: "border-color .15s",
        }}
        onFocus={e => e.currentTarget.style.borderColor = "#6366F1"}
        onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
      />
      {searchQuery && (
        <button onClick={() => setSearchQuery("")}
          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 0, display: "flex" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
    {/* Upload button */}
    <Link href={`/dashboard/upload?slug=${workspace.slug}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 7, background: "#6366F1", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
      + Upload
    </Link>
  </div>
</div>

{(() => {
  const filtered = docs.filter(d => d.filename.toLowerCase().includes(searchQuery.toLowerCase()))
  if (docs.length === 0) return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 12 }}>No documents yet.</p>
      <Link href={`/dashboard/upload?slug=${workspace.slug}`} style={{ fontSize: 13, color: "#6366F1", fontWeight: 600, textDecoration: "none" }}>
        Upload your first document →
      </Link>
    </div>
  )
  if (filtered.length === 0) return (
    <div style={{ padding: "40px 24px", textAlign: "center" }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 10px", display: "block" }}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>No results for <strong>{searchQuery}</strong></p>
      <button onClick={() => setSearchQuery("")} style={{ fontSize: 12, color: "#6366F1", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
        Clear search
      </button>
    </div>
  )
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {filtered.map((doc) => (
        <li key={doc.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #F8FAFC" }}>
          <FileIcon filename={doc.filename} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.filename}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
              {formatSize(doc.size)} · uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
            </div>
          </div>
          <span style={{ background: "#EEF2FF", color: "#3730A3", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>embedded</span>
          <button onClick={() => deleteDoc(doc.id)} title="Delete"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: "4px 6px", borderRadius: 6, display: "flex", transition: "all .12s" }}
            onMouseOver={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "#FEF2F2" }}
            onMouseOut={(e) => { e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.background = "none" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
              <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </li>
      ))}
    </ul>
  )
})()}


        </div>
      )}

      {/* ══ TAB: Embed ══ */}
      {activeTab === "embed" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>Your embed snippet</div>
          <div style={{ fontSize: 13, color: "#475569", marginBottom: 16 }}>Paste this one line into any website to activate your chatbot</div>

          <div style={{ background: "#0F172A", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <button
                onClick={copySnippet}
                style={{ background: "rgba(255,255,255,.08)", border: "none", color: "#7DD3FC", borderRadius: 5, padding: "4px 10px", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit" }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy snippet
              </button>
            </div>

            {/* <pre style={{ color: "#7DD3FC", fontSize: 12, fontFamily: "'Fira Code', monospace", padding: "14px 16px", lineHeight: 1.7, overflowX: "auto", margin: 0 }}>
              {`<script\n  src="${process.env.NEXT_PUBLIC_APP_URL ?? "https://yourdomain.com"}/embed.js"\n  data-workspace="`}<span style={{ color: "#FCD34D" }}>{workspace.slug}</span>{`"\n  data-color="`}<span style={{ color: "#FCD34D" }}>{workspace.color}</span>{`"\n  data-position="`}<span style={{ color: "#FCD34D" }}>bottom-right</span>{`"\n  data-welcome="`}<span style={{ color: "#FCD34D" }}>{settingsWelcome || "Hi! How can I help you today?"}</span>{`"\n  defer\n></script>`}
            </pre> */}
          <pre style={{ color: "#7DD3FC", fontSize: 12, fontFamily: "'Fira Code', monospace", padding: "14px 16px", lineHeight: 1.7, overflowX: "auto", margin: 0 }}>
            {`<script\n  src="${process.env.NEXT_PUBLIC_APP_URL ?? "https://yourdomain.com"}/embed.js"\n  data-workspace="`}<span style={{ color: "#FCD34D" }}>{workspace.slug}</span>{`"\n  data-color="`}<span style={{ color: "#FCD34D" }}>{workspace.color}</span>{`"\n  data-position="`}<span style={{ color: "#FCD34D" }}>bottom-right</span>{`"\n  data-welcome="`}<span style={{ color: "#FCD34D" }}>{settingsWelcome || "Hi! How can I help you today?"}</span>{`"\n  data-size="`}<span style={{ color: "#FCD34D" }}>{workspace.size || "medium"}</span>{`"\n  defer\n></script>`}
          </pre>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={copySnippet}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              Copy snippet
            </button>
            <Link
              href="/dashboard/embed"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #E2E8F0", background: "transparent", fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none" }}
            >
              Customise widget →
            </Link>
          </div>
        </div>
      )}

      {/* ══ TAB: Analytics ══ */}
      {activeTab === "analytics" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
            {[
              // { label: "Total conversations", value: workspace.chatCount, color: "#6366F1" },
              // { label: "Documents embedded", value: workspace.docCount, color: "#0D9488" },
              // { label: "Chats this week", value: chartData.reduce((s, d) => s + d.count, 0), color: "#D97706" },

              { label: "Total conversations", value: workspace.chatCount, color: "#6366F1" },
              { label: "Questions answered",  value: workspace.chatCount > 0 ? `${analytics.answeredPct}%` : "—", color: "#0D9488" },
              { label: "Avg response time",   value: workspace.chatCount > 0 ? `${analytics.avgResponseSec}s` : "—", color: "#D97706" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 18, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 14 }}>Daily chats — last 7 days</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, padding: "0 4px" }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.round((d.count / maxChart) * 64) + 4}px`,
                      background: i === 6 ? workspace.color : "#E2E8F0",
                      borderRadius: "3px 3px 0 0",
                      minHeight: 4,
                      transition: "height .3s",
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: i === 6 ? workspace.color : "#94A3B8", fontWeight: i === 6 ? 600 : 400 }}>
                  {d.label}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ══ TAB: Settings ══ */}
      {activeTab === "settings" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 20 }}>Workspace settings</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Workspace name</label>
              <input
                type="text"
                value={settingsName}
                onChange={(e) => setSettingsName(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#0F172A", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>LLM model</label>
              <select
                value={settingsModel}
                onChange={(e) => setSettingsModel(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#0F172A", outline: "none", background: "#fff" }}
              >
                <option value="gpt-4o-mini">GPT-4o mini</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="claude-sonnet">Claude Sonnet</option>
                <option value="ollama">Ollama (local)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>System prompt</label>
            <textarea
              value={settingsPrompt}
              onChange={(e) => setSettingsPrompt(e.target.value)}
              rows={4}
              placeholder="e.g. You are a helpful assistant. Answer only from the uploaded documents."
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#0F172A", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
            />
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>This shapes how the AI responds to your users.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Temperature</label>
              <input
                type="text"
                value={settingsTemp}
                onChange={(e) => setSettingsTemp(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#0F172A", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
              />
              <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>0 = deterministic · 1 = creative</p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Welcome message</label>
              <input
                type="text"
                value={settingsWelcome}
                onChange={(e) => setSettingsWelcome(e.target.value)}
                placeholder="Hi! How can I help you today?"
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#0F172A", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={saveSettings}
              disabled={settingsSaving}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, background: settingsSaving ? "#A5B4FC" : "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: settingsSaving ? "not-allowed" : "pointer", fontFamily: "inherit" }}
            >
              {settingsSaving ? "Saving…" : "Save settings"}
            </button>

            <button
              onClick={async () => {
                if (!confirm("Are you sure? This will permanently delete this workspace and all its documents.")) return
                const res = await fetch(`/api/workspace/${workspace.id}`, { method: "DELETE" })
                if (res.ok) {
                  window.location.href = "/dashboard"
                } else {
                  showToast("Failed to delete workspace")
                }
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "transparent", color: "#EF4444", fontSize: 13, fontWeight: 600, border: "1px solid #FECACA", cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}
            >
              Delete workspace
            </button>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      <div style={{
        position: "fixed", bottom: 24, right: 24,
        background: "#0F172A", color: "#fff",
        padding: "10px 16px", borderRadius: 10,
        fontSize: 13, fontWeight: 500,
        opacity: toastVisible ? 1 : 0,
        transform: toastVisible ? "translateY(0)" : "translateY(8px)",
        transition: "all .25s", pointerEvents: "none", zIndex: 100,
      }}>
        {toast}
      </div>
    </div>
  )
}
