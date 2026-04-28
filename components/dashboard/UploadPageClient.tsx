

"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"

type Doc = {
  id: string
  filename: string
  size: number
  uploadedAt: string
  status?: "embedded" | "uploading" | "indexing" | "error"
  progress?: number
}

type Workspace = {
  id: string
  name: string
  slug: string
  color: string
  documents: Doc[]
}

type Props = {
  workspaces: Workspace[]
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase()
  const colorMap: Record<string, { bg: string; stroke: string }> = {
    pdf:  { bg: "#EEF2FF", stroke: "#6366F1" },
    docx: { bg: "#F0F9FF", stroke: "#0EA5E9" },
    doc:  { bg: "#F0F9FF", stroke: "#0EA5E9" },
    md:   { bg: "#FFFBEB", stroke: "#D97706" },
    txt:  { bg: "#F0FDF4", stroke: "#22C55E" },
    csv:  { bg: "#F0FDFA", stroke: "#0D9488" },
  }
  const c = colorMap[ext ?? ""] ?? { bg: "#F1F5F9", stroke: "#64748B" }
  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    </div>
  )
}

function Badge({ status }: { status: Doc["status"] }) {
  const map = {
    embedded:  { bg: "#EEF2FF", color: "#3730A3", label: "embedded" },
    uploading: { bg: "#F0FDFA", color: "#134E4A", label: "uploading" },
    indexing:  { bg: "#FFFBEB", color: "#78350F", label: "indexing…" },
    error:     { bg: "#FEF2F2", color: "#991B1B", label: "error" },
  }
  const s = map[status ?? "embedded"]
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  )
}

export default function UploadPageClient({ workspaces }: Props) {
  const [selectedSlug, setSelectedSlug] = useState(workspaces[0]?.slug ?? "")
  const [docs, setDocs] = useState<Doc[]>(() => {
    const ws = workspaces.find(w => w.slug === (workspaces[0]?.slug ?? ""))
    return (ws?.documents ?? []).map(d => ({ ...d, status: "embedded" as const, progress: 100 }))
  })
  const [isDragging, setIsDragging] = useState(false)
  const [toast, setToast]           = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [isMobile, setIsMobile]     = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedWs = workspaces.find(w => w.slug === selectedSlug)

  // Mobile detection
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  function handleWsChange(slug: string) {
    setSelectedSlug(slug)
    const ws = workspaces.find(w => w.slug === slug)
    setDocs((ws?.documents ?? []).map(d => ({ ...d, status: "embedded" as const, progress: 100 })))
  }

  function showToast(msg: string) {
    setToast(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  async function uploadFile(file: File) {
    const tempId = `temp-${Date.now()}-${file.name}`

    setDocs(prev => [{
      id: tempId,
      filename: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: "uploading",
      progress: 0,
    }, ...prev])

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 90) { clearInterval(interval); progress = 90 }
      setDocs(prev => prev.map(d => d.id === tempId ? { ...d, progress } : d))
    }, 200)

    try {
      const form = new FormData()
      form.append("file", file)
      form.append("workspaceSlug", selectedSlug)

      const res = await fetch("/api/upload", { method: "POST", body: form })
      clearInterval(interval)

      if (res.ok) {
        const data = await res.json()
        setDocs(prev => prev.map(d => d.id === tempId ? {
          id: data.document.id,
          filename: file.name,
          size: file.size,
          uploadedAt: data.document.uploadedAt,
          status: "indexing",
          progress: 100,
        } : d))
        setTimeout(() => {
          setDocs(prev => prev.map(d => d.id === data.document.id ? { ...d, status: "embedded" } : d))
        }, 3000)
      } else {
        const err = await res.json()
        if (err.upgradeRequired) {
          const checkoutRes = await fetch("/api/billing/checkout", { method: "POST" })
          const checkoutData = await checkoutRes.json()
          if (checkoutData.url) { window.location.href = checkoutData.url; return }
        }
        setDocs(prev => prev.map(d => d.id === tempId ? { ...d, status: "error", progress: 100 } : d))
        showToast(err.error || "Upload failed")
      }
    } catch {
      clearInterval(interval)
      setDocs(prev => prev.map(d => d.id === tempId ? { ...d, status: "error", progress: 100 } : d))
      showToast("Network error — please try again")
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (!selectedSlug) { showToast("Please select a workspace first"); return }
    const arr = Array.from(files)
    arr.forEach(f => uploadFile(f))
    showToast(`${arr.length} file${arr.length > 1 ? "s" : ""} queued for upload`)
  }

  const onDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [])
  const onDragLeave = useCallback(() => setIsDragging(false), [])
  const onDrop      = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug])

  const wsInitials = selectedWs?.name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "WS"

  return (
    <div style={{
      padding: isMobile ? "16px" : "28px 30px",
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        <h1 style={{ fontSize: isMobile ? 18 : 21, fontWeight: 700, color: "#0F172A", margin: 0 }}>
          Upload documents
        </h1>
        <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
          Add files to a workspace to power your AI chatbot
        </p>
      </div>

      {/* ── No workspaces state ── */}
      {workspaces.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "40px 24px", textAlign: "center", marginBottom: 16 }}>
          <p style={{ color: "#475569", fontSize: 14, marginBottom: 12 }}>You don&apos;t have any workspaces yet.</p>
          <Link href="/dashboard/projects/new" style={{ background: "#6366F1", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Create a workspace →
          </Link>
        </div>
      )}

      {workspaces.length > 0 && (
        <>
          {/* ── Workspace selector ── */}
          <div style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: 12,
            marginBottom: isMobile ? 14 : 22,
            padding: isMobile ? "12px" : "14px 16px",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
          }}>
            {/* Top row: avatar + select */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
              <div style={{
                width: 32, height: 32,
                background: selectedWs?.color ?? "#6366F1",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {wsInitials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Adding to workspace</div>
                <select
                  value={selectedSlug}
                  onChange={e => handleWsChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    border: "1px solid #E2E8F0",
                    borderRadius: 7,
                    fontSize: 13,
                    fontFamily: "inherit",
                    color: "#0F172A",
                    background: "#fff",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {workspaces.map(w => (
                    <option key={w.slug} value={w.slug}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* View workspace link — full-width on mobile */}
            <Link
            href="/dashboard/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: isMobile ? "100%" : "auto",
              padding: "5px 11px",        // ← REMOVE the isMobile conditional, use fixed padding
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "transparent",
              fontSize: 12,
              fontWeight: 600,
              color: "#475569",
              textDecoration: "none",
              whiteSpace: "nowrap",       // ← KEEP THIS so arrow never wraps
              boxSizing: "border-box" as const,
            }}
          >
            View workspace →
          </Link>
          </div>

          {/* ── Drop zone ── */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? "#6366F1" : "#E2E8F0"}`,
              borderRadius: 14,
              padding: isMobile ? "32px 16px" : "48px 24px",
              textAlign: "center",
              background: isDragging ? "#EEF2FF" : "#FAFBFC",
              cursor: "pointer",
              marginBottom: 16,
              transition: "all .18s",
              position: "relative",
            }}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt,.md,.csv"
              style={{ display: "none" }}
              onChange={e => handleFiles(e.target.files)}
            />

            <div style={{
              width: isMobile ? 44 : 52,
              height: isMobile ? 44 : 52,
              background: isDragging ? "#6366F1" : "#EEF2FF",
              borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: `0 auto ${isMobile ? 10 : 14}px`,
              transition: "all .18s",
            }}>
              <svg width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} viewBox="0 0 24 24" fill="none" stroke={isDragging ? "#fff" : "#6366F1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
            </div>

            <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: isDragging ? "#6366F1" : "#0F172A", marginBottom: 6 }}>
              {isDragging ? "Drop to upload" : isMobile ? "Tap to browse files" : "Drag & drop your files here"}
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: isMobile ? 12 : 16 }}>
              {isDragging
                ? `Release to add to ${selectedWs?.name}`
                : isMobile
                ? "Max 50 MB per file"
                : "or click anywhere to browse · max 50 MB per file"}
            </div>

            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              {["PDF", "DOCX", "TXT", "MD", "CSV"].map(fmt => (
                <span key={fmt} style={{ background: "#EEF2FF", color: "#3730A3", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* ── Recent uploads list ── */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <div style={{
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderBottom: "1px solid #E2E8F0",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Recent uploads</span>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>{docs.length} file{docs.length !== 1 ? "s" : ""}</span>
            </div>

            {docs.length === 0 ? (
              <div style={{ padding: "40px 24px", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>No documents uploaded yet. Drop files above to get started.</p>
              </div>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {docs.map(doc => (
                  <li
                    key={doc.id}
                    style={{
                      display: "flex",
                      alignItems: isMobile ? "flex-start" : "center",
                      gap: 12,
                      padding: isMobile ? "12px 14px" : "12px 16px",
                      borderBottom: "1px solid #F8FAFC",
                    }}
                  >
                    <FileIcon name={doc.filename} />

                    {/* File info — grows to fill */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: "#0F172A",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        animation: doc.status === "uploading" ? "pulse 1.5s infinite" : "none",
                        // On mobile, allow up to the badge
                        maxWidth: isMobile ? "calc(100vw - 120px)" : "none",
                      }}>
                        {doc.filename}
                      </div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                        {formatSize(doc.size)} · {doc.status === "uploading" ? "uploading…" : new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>

                      {/* Progress bar */}
                      <div style={{ width: isMobile ? "100%" : 90, height: 4, background: "#E2E8F0", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 2,
                          width: `${doc.progress ?? 100}%`,
                          background: doc.status === "error" ? "#EF4444"
                            : doc.status === "uploading" ? "#0D9488"
                            : doc.status === "indexing"  ? "#D97706"
                            : "#6366F1",
                          transition: "width 0.5s ease",
                        }} />
                      </div>

                      {/* Badge inline on mobile (below the bar) */}
                      {isMobile && (
                        <div style={{ marginTop: 6 }}>
                          <Badge status={doc.status ?? "embedded"} />
                        </div>
                      )}
                    </div>

                    {/* Badge on the right only on desktop */}
                    {!isMobile && <Badge status={doc.status ?? "embedded"} />}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* ── Toast ── */}
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
        opacity: toastVisible ? 1 : 0,
        transform: toastVisible ? "translateY(0)" : "translateY(8px)",
        transition: "all .25s",
        pointerEvents: "none",
        zIndex: 100,
        textAlign: isMobile ? "center" : "left",
      }}>
        {toast}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}
