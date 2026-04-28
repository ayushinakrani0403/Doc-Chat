
"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

type Workspace = {
  id: string
  name: string
  slug: string
  color: string
  welcomeMsg: string
}

type Message = {
  id: string
  role: "user" | "bot"
  text: string
  loading?: boolean
}

type Props = {
  workspaces: Workspace[]
}

function getSessionId() {
  if (typeof window === "undefined") return "ssr"
  let id = localStorage.getItem("preview-session-id")
  if (!id) {
    id = `preview-${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem("preview-session-id", id)
  }
  return id
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "AI"
}

function TypingDots({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 2px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: color,
          opacity: 0.6,
          animation: "dc-bounce 1.2s infinite ease-in-out",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  )
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
}

export default function PreviewPageClient({ workspaces }: Props) {
  const [selectedId, setSelectedId]   = useState(workspaces[0]?.id ?? "")
  const [messages, setMessages]       = useState<Message[]>([])
  const [input, setInput]             = useState("")
  const [isStreaming, setIsStreaming]  = useState(false)
  const [times, setTimes]             = useState<Record<string, string>>({})
  const [isMobile, setIsMobile]       = useState(false)
  const [showPanel, setShowPanel]     = useState(false) // mobile: slide-in left panel

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)
  const abortRef       = useRef<AbortController | null>(null)
  const mountedRef     = useRef(false)

  const selectedWs = workspaces.find((w) => w.id === selectedId)

  // Mobile detection
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setShowPanel(false)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      if (!selectedWs) return
      try {
        const savedMsgs  = localStorage.getItem(`chat-msgs-${selectedWs.id}`)
        const savedTimes = localStorage.getItem(`chat-times-${selectedWs.id}`)
        if (savedMsgs) {
          setMessages(JSON.parse(savedMsgs))
          setTimes(savedTimes ? JSON.parse(savedTimes) : {})
          return
        }
      } catch {}
      const welcomeId = "welcome"
      const now = formatTime(new Date())
      const msgs: Message[] = [{ id: welcomeId, role: "bot", text: selectedWs.welcomeMsg || "Hi! How can I help you today?" }]
      const ts = { [welcomeId]: now }
      setMessages(msgs)
      setTimes(ts)
      localStorage.setItem(`chat-msgs-${selectedWs.id}`, JSON.stringify(msgs))
      localStorage.setItem(`chat-times-${selectedWs.id}`, JSON.stringify(ts))
      return
    }
    if (!selectedWs) return
    abortRef.current?.abort()
    setIsStreaming(false)
    setInput("")
    try {
      const savedMsgs  = localStorage.getItem(`chat-msgs-${selectedWs.id}`)
      const savedTimes = localStorage.getItem(`chat-times-${selectedWs.id}`)
      if (savedMsgs) {
        setMessages(JSON.parse(savedMsgs))
        setTimes(savedTimes ? JSON.parse(savedTimes) : {})
        return
      }
    } catch {}
    const welcomeId = "welcome"
    const now = formatTime(new Date())
    const msgs: Message[] = [{ id: welcomeId, role: "bot", text: selectedWs.welcomeMsg || "Hi! How can I help you today?" }]
    const ts = { [welcomeId]: now }
    setMessages(msgs)
    setTimes(ts)
    localStorage.setItem(`chat-msgs-${selectedWs.id}`, JSON.stringify(msgs))
    localStorage.setItem(`chat-times-${selectedWs.id}`, JSON.stringify(ts))
  }, [selectedId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming || !selectedWs) return
    const userId = `user-${Date.now()}`
    const botId  = `bot-${Date.now()}`
    const now    = formatTime(new Date())

    setMessages((prev) => {
      const updated = [...prev,
        { id: userId, role: "user" as const, text: text.trim() },
        { id: botId,  role: "bot"  as const, text: "", loading: true },
      ]
      if (selectedWs) localStorage.setItem(`chat-msgs-${selectedWs.id}`, JSON.stringify(updated))
      return updated
    })
    setTimes((prev) => {
      const updated = { ...prev, [userId]: now, [botId]: now }
      if (selectedWs) localStorage.setItem(`chat-times-${selectedWs.id}`, JSON.stringify(updated))
      return updated
    })
    setInput("")
    setIsStreaming(true)
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedWs.slug, message: text.trim(), sessionId: getSessionId() }),
        signal: abortRef.current.signal,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data.upgradeRequired) {
          const checkoutRes  = await fetch("/api/billing/checkout", { method: "POST" })
          const checkoutData = await checkoutRes.json()
          if (checkoutData.url) { window.location.href = checkoutData.url; return }
        }
        throw new Error(data.error || "Failed to get response")
      }
      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value, { stream: true }).split("\n").filter((l) => l.trim())
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6)
          if (data === "[DONE]") break
          try {
            const parsed = JSON.parse(data)
            if (parsed.text) {
              accumulated += parsed.text
              setMessages((prev) => {
                const updated = prev.map((m) => m.id === botId ? { ...m, text: accumulated, loading: false } : m)
                if (selectedWs) localStorage.setItem(`chat-msgs-${selectedWs.id}`, JSON.stringify(updated))
                return updated
              })
            }
          } catch { /* skip */ }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setMessages((prev) =>
        prev.map((m) => m.id === botId ? { ...m, text: "Sorry, I couldn't get a response. Please try again.", loading: false } : m)
      )
    } finally {
      setIsStreaming(false)
      inputRef.current?.focus()
    }
  }, [selectedWs, isStreaming])

  function clearChat() {
    abortRef.current?.abort()
    setIsStreaming(false)
    setInput("")
    const welcomeId = "welcome-reset"
    const now  = formatTime(new Date())
    const msgs: Message[] = [{ id: welcomeId, role: "bot", text: selectedWs?.welcomeMsg || "Hi! How can I help you today?" }]
    const ts   = { [welcomeId]: now }
    setMessages(msgs)
    setTimes(ts)
    if (selectedWs) {
      localStorage.setItem(`chat-msgs-${selectedWs.id}`, JSON.stringify(msgs))
      localStorage.setItem(`chat-times-${selectedWs.id}`, JSON.stringify(ts))
    }
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

  const wsColor = selectedWs?.color ?? "#6366F1"

  // ── Left panel content (shared between desktop sidebar & mobile sheet) ──
  const panelContent = (
    <>
      {/* Workspace card */}
      <div style={{ background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: wsColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            {getInitials(selectedWs?.name ?? "")}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{selectedWs?.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ fontSize: 11, color: "#64748B" }}>online</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>
          Powered by DocChat AI · answers from your uploaded documents
        </div>
      </div>

      {/* Suggested questions */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Try asking</div>
        {[
          "What is the main topic of this document?",
          "Give me a summary",
          "What are the key details?",
          "What dates are mentioned?",
        ].map((q) => (
          <button
            key={q}
            onClick={() => { sendMessage(q); setShowPanel(false) }}
            disabled={isStreaming}
            style={{ width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", fontSize: 12, color: "#475569", cursor: isStreaming ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 6, transition: "all .12s", lineHeight: 1.4 }}
            onMouseOver={(e) => { if (!isStreaming) { e.currentTarget.style.borderColor = wsColor; e.currentTarget.style.color = "#0F172A" } }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#475569" }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Info */}
      <div style={{ marginTop: "auto", padding: "12px 0", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.6 }}>
          This preview uses your real AI engine. Responses come from your uploaded documents.
        </div>
      </div>
    </>
  )

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      background: "#F8FAFC",
    }}>

      {/* ── Top bar ── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        padding: isMobile ? "0 12px" : "0 24px",
        height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, gap: 8,
      }}>
        {/* Left: status + title */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, minWidth: 0 }}>
          {/* Mobile: info panel toggle button */}
          {isMobile && (
            <button
              onClick={() => setShowPanel(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 4, display: "flex", alignItems: "center", flexShrink: 0 }}
              title="Workspace info"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </button>
          )}
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
          <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap" }}>Chat Preview</span>
          {/* Hide subtitle on mobile */}
          {!isMobile && <span style={{ fontSize: 12, color: "#94A3B8" }}>— testing live AI responses</span>}
        </div>

        {/* Right: controls */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 8, flexShrink: 0 }}>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{
              padding: isMobile ? "5px 7px" : "6px 10px",
              border: "1px solid #E2E8F0", borderRadius: 8,
              fontSize: isMobile ? 12 : 13,
              fontFamily: "inherit", color: "#0F172A",
              background: "#fff", outline: "none", cursor: "pointer",
              maxWidth: isMobile ? 110 : "none",
            }}
          >
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          {/* Hide "Customise" text on mobile — icon only */}
          <Link
            href="/dashboard/embed"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: isMobile ? "6px 8px" : "6px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", fontSize: 12, fontWeight: 600, color: "#475569", textDecoration: "none" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
            {!isMobile && "Customise"}
          </Link>

          <button
            onClick={clearChat}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: isMobile ? "6px 8px" : "6px 12px", borderRadius: 8, background: "#F1F5F9", border: "1px solid #E2E8F0", fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer", fontFamily: "inherit" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
            {!isMobile && "Reset"}
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", gap: 0 }}>

        {/* ── Left panel: desktop sidebar ── */}
        {!isMobile && (
          <div style={{ width: 260, background: "#fff", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", flexShrink: 0, padding: "20px 16px" }}>
            {panelContent}
          </div>
        )}

        {/* ── Mobile: backdrop + slide-up sheet ── */}
        {isMobile && showPanel && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShowPanel(false)}
              style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
            />
            {/* Bottom sheet */}
            <div style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              zIndex: 60,
              background: "#fff",
              borderRadius: "18px 18px 0 0",
              padding: "20px 16px 32px",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
              maxHeight: "80vh",
              overflowY: "auto",
              display: "flex", flexDirection: "column",
            }}>
              {/* Sheet handle */}
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E2E8F0", margin: "0 auto 16px" }} />
              {/* Close row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Workspace info</span>
                <button onClick={() => setShowPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 4, display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              {panelContent}
            </div>
          </>
        )}

        {/* ── Right: Chat area ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* Chat header */}
          <div style={{ background: wsColor, padding: isMobile ? "10px 14px" : "14px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#fff", fontSize: isMobile ? 13 : 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {selectedWs?.name} Assistant
              </div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 1 }}>
                {isStreaming ? "Typing…" : "Powered by DocChat · online"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: isStreaming ? "#FCD34D" : "#4ADE80" }} />
              {!isMobile && <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>{isStreaming ? "thinking" : "ready"}</span>}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 12px" : "20px 24px", display: "flex", flexDirection: "column", gap: 16, background: "#F8FAFC" }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 4 }}>

                {/* Avatar + name row */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                  {msg.role === "bot" ? (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: wsColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
                      </svg>
                    </div>
                  ) : (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>
                    {msg.role === "bot" ? selectedWs?.name + " AI" : "You"} · {times[msg.id] ?? ""}
                  </span>
                </div>

                {/* Bubble — wider on mobile since there's no side panel */}
                <div style={{
                  maxWidth: isMobile ? "88%" : "72%",
                  padding: "11px 15px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                  background: msg.role === "user" ? wsColor : "#fff",
                  color: msg.role === "user" ? "#fff" : "#0F172A",
                  fontSize: 13,
                  lineHeight: 1.65,
                  border: msg.role === "bot" ? "1px solid #E2E8F0" : "none",
                  wordBreak: "break-word",
                }}>
                  {msg.loading ? <TypingDots color={wsColor} /> : (
                    msg.role === "bot" ? (
                      <div style={{ lineHeight: 1.65 }} className="markdown-body">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0", padding: isMobile ? "10px 12px" : "12px 20px", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", padding: "8px 8px 8px 16px" }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                placeholder={isMobile ? "Ask anything…" : `Ask ${selectedWs?.name} anything…`}
                disabled={isStreaming}
                style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, fontFamily: "inherit", color: "#0F172A", outline: "none", minWidth: 0 }}
              />
              {/* Hide "↵ send" hint on mobile to save space */}
              {input.length > 0 && !isMobile && (
                <span style={{ fontSize: 11, color: "#94A3B8", flexShrink: 0 }}>↵ send</span>
              )}
              <button
                onClick={() => sendMessage(input)}
                disabled={isStreaming || !input.trim()}
                style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: isStreaming || !input.trim() ? "#E2E8F0" : wsColor,
                  border: "none", cursor: isStreaming || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background .15s",
                }}
              >
                {isStreaming ? (
                  <div style={{ width: 14, height: 14, border: `2px solid #94A3B8`, borderTopColor: "transparent", borderRadius: "50%", animation: "dc-spin 0.7s linear infinite" }} />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? "#fff" : "#94A3B8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                )}
              </button>
            </div>
            {!isMobile && (
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "#CBD5E1" }}>
                Powered by <strong>DocChat</strong> · responses generated from your documents
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dc-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes dc-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .markdown-body { font-size: 13px; line-height: 1.65; color: #0F172A; }
        .markdown-body p { margin: 0 0 8px 0; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body strong { font-weight: 700; color: inherit; }
        .markdown-body em { font-style: italic; }
        .markdown-body ol { padding-left: 20px; margin: 6px 0; list-style-type: decimal; }
        .markdown-body ul { padding-left: 20px; margin: 6px 0; list-style-type: disc; }
        .markdown-body li { margin-bottom: 4px; line-height: 1.6; }
        .markdown-body li p { margin: 0; }
        .markdown-body li:last-child { margin-bottom: 0; }
        .markdown-body h1 { font-size: 16px; font-weight: 700; margin: 12px 0 6px; color: #0F172A; }
        .markdown-body h2 { font-size: 15px; font-weight: 700; margin: 10px 0 5px; color: #0F172A; }
        .markdown-body h3 { font-size: 14px; font-weight: 600; margin: 8px 0 4px; color: #0F172A; }
        .markdown-body h1:first-child, .markdown-body h2:first-child, .markdown-body h3:first-child { margin-top: 0; }
        .markdown-body code { background: #F1F5F9; color: #6366F1; padding: 2px 6px; border-radius: 5px; font-size: 12px; font-family: 'Fira Code', monospace; border: 1px solid #E2E8F0; }
        .markdown-body pre { background: #0F172A; padding: 12px 14px; border-radius: 10px; overflow-x: auto; margin: 8px 0; }
        .markdown-body pre code { background: none; color: #7DD3FC; border: none; padding: 0; font-size: 12px; }
        .markdown-body a { color: #6366F1; text-decoration: underline; }
        .markdown-body a:hover { color: #4F46E5; }
        .markdown-body blockquote { border-left: 3px solid #6366F1; padding: 6px 12px; color: #64748B; margin: 8px 0; background: #F8FAFC; border-radius: 0 6px 6px 0; }
        .markdown-body blockquote p { margin: 0; }
        .markdown-body hr { border: none; border-top: 1px solid #E2E8F0; margin: 10px 0; }
        .markdown-body table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 12px; }
        .markdown-body th { background: #F8FAFC; padding: 6px 10px; text-align: left; font-weight: 600; border: 1px solid #E2E8F0; }
        .markdown-body td { padding: 6px 10px; border: 1px solid #E2E8F0; }
        .markdown-body tr:nth-child(even) { background: #F8FAFC; }
      `}</style>
    </div>
  )
}
