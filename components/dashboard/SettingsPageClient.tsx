"use client"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"


type User = {
  id: string
  name: string
  email: string
  plan: string
  createdAt: string
  workspaceCount: number
}

type Props = { user: User }

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "U"
}

function Toast({ visible, msg }: { visible: boolean; msg: string }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
      background: "#0F172A", color: "#fff",
      padding: "11px 20px", borderRadius: 12,
      fontSize: 13, fontWeight: 500,
      opacity: visible ? 1 : 0,
      transition: "all .25s", pointerEvents: "none", zIndex: 200,
      display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
      boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {msg}
    </div>
  )
}

function ErrBanner({ msg }: { msg: string }) {
  if (!msg) return null
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 9, marginBottom: 16,
      background: "#FEF2F2", border: "1px solid #FECACA",
      fontSize: 13, color: "#991B1B",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </div>
  )
}

// ── Reusable section card ──────────────────────────────────────────────────────
function SectionCard({
  icon, iconColor, iconBg, title, subtitle, children, defaultOpen = true,
}: {
  icon: React.ReactNode
  iconColor: string
  iconBg: string
  title: string
  subtitle: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 14,
    }}>
      {/* Header — always visible, clickable to collapse */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "16px 20px", background: "#F8FAFC",
          border: "none", cursor: "pointer", fontFamily: "inherit",
          borderBottom: open ? "1px solid #E2E8F0" : "none",
          transition: "background .12s",
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
        </div>
        <div style={{ textAlign: "left", flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{title}</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>{subtitle}</div>
        </div>
        {/* Chevron */}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Body */}
      {open && <div style={{ padding: "20px 20px" }}>{children}</div>}
    </div>
  )
}

// ── Field row ─────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, letterSpacing: "0.01em" }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 13px",
  border: "1px solid #E2E8F0", borderRadius: 9,
  fontSize: 13, fontFamily: "inherit", color: "#0F172A",
  background: "#fff", outline: "none",
  transition: "border-color .15s, box-shadow .15s",
  boxSizing: "border-box",
}

function SaveBtn({ loading, disabled, onClick, label = "Save changes", color = "#6366F1" }: {
  loading: boolean; disabled?: boolean; onClick: () => void; label?: string; color?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        padding: "9px 20px", borderRadius: 9,
        background: loading || disabled ? "#A5B4FC" : color,
        color: "#fff", fontSize: 13, fontWeight: 600,
        border: "none", cursor: loading || disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 7,
        transition: "all .15s",
        boxShadow: loading || disabled ? "none" : `0 3px 10px ${color}55`,
      }}
    >
      {loading && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ animation: "spin .8s linear infinite" }}>
          <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round"/>
        </svg>
      )}
      {loading ? "Saving…" : label}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsPageClient({ user }: Props) {
  const { update: updateSession } = useSession()
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // ── Profile ────────────────────────────────────────────────────────────────
  const [name, setName] = useState(user.name)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileErr, setProfileErr] = useState("")
  const nameChanged = name.trim() !== user.name

  async function saveProfile() {
    if (!nameChanged) return
    setProfileErr("")
    if (name.trim().length < 2) { setProfileErr("Name must be at least 2 characters."); return }
    setProfileSaving(true)
    const res = await fetch("/api/settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "profile", name }),
    })
    const data = await res.json()
    setProfileSaving(false)
    if (res.ok) { await updateSession({ name: data.name }); showToast("Profile saved!") }
    else setProfileErr(data.error || "Failed to update.")
  }

  // ── Password ───────────────────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw]         = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [showPw, setShowPw]       = useState(false)
  const [pwSaving, setPwSaving]   = useState(false)
  const [pwErr, setPwErr]         = useState("")

  const pwStrength = newPw.length === 0 ? null
    : newPw.length < 8 ? "weak"
    : newPw.length < 12 ? "fair" : "strong"
  const strengthMap = {
    weak:   { color: "#EF4444", bars: 1, label: "Weak — add numbers or symbols" },
    fair:   { color: "#F59E0B", bars: 2, label: "Fair — almost there!" },
    strong: { color: "#22C55E", bars: 3, label: "Strong — great choice!" },
  }

  async function changePassword() {
    setPwErr("")
    if (!currentPw || !newPw || !confirmPw) { setPwErr("All fields are required."); return }
    if (newPw.length < 8) { setPwErr("Min. 8 characters."); return }
    if (newPw !== confirmPw) { setPwErr("Passwords do not match."); return }
    if (currentPw === newPw) { setPwErr("New password must differ from current."); return }
    setPwSaving(true)
    const res = await fetch("/api/settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "password", currentPassword: currentPw, newPassword: newPw }),
    })
    const data = await res.json()
    setPwSaving(false)
    if (res.ok) { setCurrentPw(""); setNewPw(""); setConfirmPw(""); showToast("Password updated!") }
    else setPwErr(data.error || "Failed to change password.")
  }

  // ── Delete account ─────────────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal]     = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
 
  const [deleteErr, setDeleteErr]                 = useState("")
  const [deleteLoading, setDeleteLoading]         = useState(false)

  function closeDeleteModal() {
    setShowDeleteModal(false); setDeleteConfirmText("");  setDeleteErr("")
  }

  async function deleteAccount() {
    setDeleteErr("")
    if (deleteConfirmText !== "DELETE") { setDeleteErr('Type "DELETE" exactly.'); return }
    setDeleteLoading(true)
    const res = await fetch("/api/settings", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmText: deleteConfirmText }),
    })
    const data = await res.json()
    setDeleteLoading(false)
    if (res.ok) signOut({ callbackUrl: "/login" })
    else setDeleteErr(data.error || "Failed to delete account.")
  }

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast]               = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  function showToast(msg: string) {
    setToast(msg); setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100%", background: "#F1F5F9",
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      padding: "28px 30px",
    }}>

      {/* ── Page header with user summary ── */}
      <div style={{
        background: "#fff", borderRadius: 14,
        border: "1px solid #E2E8F0", padding: "20px 24px",
        marginBottom: 20,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        {/* Avatar */}
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 20, fontWeight: 700, flexShrink: 0,
        }}>
          {getInitials(name)}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>{name}</div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 3 }}>{user.email}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{
              background: user.plan === "pro" ? "#EEF2FF" : "#F1F5F9",
              color: user.plan === "pro" ? "#3730A3" : "#475569",
              fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
              textTransform: "uppercase",
            }}>
              {user.plan} plan
            </span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>Member since {memberSince}</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>·</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>{user.workspaceCount} workspace{user.workspaceCount !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 9,
            border: "1px solid #E2E8F0", background: "transparent",
            color: "#475569", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>

      {/* ══════════════════════════════════════
          SECTION 1: PROFILE
      ══════════════════════════════════════ */}
      <SectionCard
        iconBg="#EEF2FF" iconColor="#6366F1"
        icon={<><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>}
        title="Profile"
        subtitle="Your name and account details"
        defaultOpen={true}
      >
        <ErrBanner msg={profileErr} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 4 }}>
          <Field label="Full name">
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              maxLength={60} placeholder="Your full name"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,.1)" }}
              onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }}
            />
            <div style={{ fontSize: 11, color: "#94A3B8", textAlign: "right", marginTop: 4 }}>{name.length}/60</div>
          </Field>

          <Field label="Email address">
            <div style={{ position: "relative" }}>
              <input
                type="email" value={user.email} disabled
                style={{ ...inputStyle, background: "#F8FAFC", color: "#94A3B8", cursor: "not-allowed", paddingRight: 72 }}
              />
              <span style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "#E2E8F0", color: "#64748B",
                fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 5,
              }}>LOCKED</span>
            </div>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Cannot be changed. Contact support if needed.</p>
          </Field>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <SaveBtn loading={profileSaving} disabled={!nameChanged} onClick={saveProfile} />
          {nameChanged && (
            <button
              onClick={() => { setName(user.name); setProfileErr("") }}
              style={{ padding: "9px 16px", borderRadius: 9, background: "transparent", border: "1px solid #E2E8F0", color: "#64748B", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
            >
              Cancel
            </button>
          )}
        </div>
      </SectionCard>

      {/* ══════════════════════════════════════
          SECTION 2: SECURITY
      ══════════════════════════════════════ */}
      <SectionCard
        iconBg="#F0FDFA" iconColor="#0D9488"
        icon={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
        title="Security"
        subtitle="Change your password and manage sessions"
        defaultOpen={false}
      >
        <ErrBanner msg={pwErr} />

        <Field label="Current password">
          <input
            type={showPw ? "text" : "password"} value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="Enter current password"
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = "#0D9488"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,.1)" }}
            onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }}
          />
        </Field>

        <div style={{ height: 1, background: "#F1F5F9", margin: "4px 0 16px" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <Field label="New password">
              <input
                type={showPw ? "text" : "password"} value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 8 characters"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = "#0D9488"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,.1)" }}
                onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }}
              />
            </Field>
            {/* Strength bar */}
            {pwStrength && (() => {
              const s = strengthMap[pwStrength]
              return (
                <div style={{ marginTop: -8, marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= s.bars ? s.color : "#E2E8F0", transition: "background .2s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{s.label}</span>
                </div>
              )
            })()}
          </div>

          <Field label="Confirm new password">
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"} value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                style={{
                  ...inputStyle,
                  borderColor: confirmPw && newPw && confirmPw !== newPw ? "#FCA5A5" : "#E2E8F0",
                  paddingRight: 36,
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "#0D9488"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,.1)" }}
                onBlur={e => { e.currentTarget.style.borderColor = confirmPw && newPw && confirmPw !== newPw ? "#FCA5A5" : "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }}
              />
              {confirmPw && newPw && confirmPw === newPw && (
                <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>
          </Field>
        </div>

        {/* Show password toggle */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", width: "fit-content", marginBottom: 18 }}
          onClick={() => setShowPw(!showPw)}
        >
          <div style={{
            width: 18, height: 18, borderRadius: 5,
            border: `1.5px solid ${showPw ? "#6366F1" : "#CBD5E1"}`,
            background: showPw ? "#6366F1" : "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s",
          }}>
            {showPw && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <span style={{ fontSize: 13, color: "#475569", userSelect: "none" }}>Show passwords</span>
        </div>

        <SaveBtn
          loading={pwSaving}
          onClick={changePassword}
          label="Update password"
          color="#0D9488"
        />
      </SectionCard>

      {/* ══════════════════════════════════════
          SECTION 3: PLAN & BILLING
      ══════════════════════════════════════ */}
      <SectionCard
        iconBg="#FFFBEB" iconColor="#D97706"
        icon={<><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>}
        title="Plan & billing"
        subtitle={`You are on the ${user.plan} plan`}
        defaultOpen={false}
      >
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Plan", value: user.plan === "pro" ? "Pro" : "Free", sub: user.plan === "pro" ? "$19/month" : "Limited", accent: user.plan === "pro" ? "#6366F1" : "#0F172A" },
            { label: "Workspaces", value: `${user.workspaceCount}`, sub: user.plan === "free" ? "of 3 allowed" : "Unlimited", accent: "#0F172A" },
            { label: "Messages/mo", value: user.plan === "pro" ? "∞" : "100", sub: user.plan === "free" ? "resets monthly" : "Unlimited", accent: "#0F172A" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", padding: 14 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.accent }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Usage bar (free only) */}
        {user.plan === "free" && (
          <div style={{ background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Workspace usage</span>
              <span style={{ fontSize: 12, color: "#475569" }}>{user.workspaceCount} / 3</span>
            </div>
            <div style={{ height: 5, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min((user.workspaceCount / 3) * 100, 100)}%`,
                background: user.workspaceCount >= 3 ? "#EF4444" : "#6366F1",
                borderRadius: 3, transition: "width .3s",
              }} />
            </div>
          </div>
        )}

        {/* Upgrade CTA (free only) */}
        {user.plan === "free" && (
          <div style={{ background: "#0F172A", borderRadius: 12, padding: 22, position: "relative", overflow: "hidden" }}>
            {/* Decorative circle */}
            <div style={{ position: "absolute", top: -24, right: -24, width: 100, height: 100, borderRadius: "50%", background: "rgba(99,102,241,0.12)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(99,102,241,.18)", padding: "3px 10px", borderRadius: 20, marginBottom: 12 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#818CF8" }}>PRO PLAN</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC", marginBottom: 6 }}>Unlock everything for $19/mo</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 18, lineHeight: 1.6 }}>
                Remove all limits. Unlimited workspaces, documents, and messages.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 20 }}>
                {["Unlimited workspaces", "Unlimited documents", "Unlimited messages/mo", "Priority support", "Custom branding", "Advanced analytics"].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize: 12, color: "#CBD5E1" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                // onClick={() => showToast("Stripe billing coming soon!")}
                onClick={async () => {
                const res = await fetch("/api/billing/checkout", { method: "POST" })
                const data = await res.json()
                if (data.url) window.location.href = data.url
                else alert(data.error)
                }}
                style={{
                  padding: "11px 24px", borderRadius: 10,
                  background: "#6366F1", color: "#fff",
                  fontSize: 13, fontWeight: 700, border: "none",
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                }}
              >
                Upgrade to Pro →
              </button>
            </div>
          </div>
        )}

        {user.plan === "pro" && (
          <div style={{ display: "flex", gap: 10 }}>
         
            <button
              onClick={async () => {
                const res = await fetch("/api/billing/checkout", { method: "GET" })
                const data = await res.json()
                if (data.url) window.location.href = data.url
                else showToast("Failed to open billing portal")
              }}
              style={{ flex: 1, padding: "10px 0", borderRadius: 9,  background: "#6366F1", border: "1px solid #E2E8F0", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              Manage billing
            </button>
            <button
            onClick={async () => {
              if (!confirm("Are you sure you want to cancel your Pro plan?")) return
              const res = await fetch("/api/billing/checkout", { method: "GET" })
              const data = await res.json()
              if (data.url) window.location.href = data.url  // Stripe portal handles cancellation
              else showToast("Failed to open billing portal")
            }}
            style={{ flex: 1, padding: "10px 0", borderRadius: 9, background: "transparent", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            Cancel plan
          </button>

          </div>
        )}

        
      </SectionCard>

      {/* ══════════════════════════════════════
          SECTION 4: DANGER ZONE
      ══════════════════════════════════════ */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #FECACA", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", background: "#FFF5F5", borderBottom: "1px solid #FEF2F2", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>Danger zone</div>
        </div>
        <div style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 5 }}>Delete your account</div>
              <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, maxWidth: 380 }}>
                Permanently deletes your account and all data including workspaces, documents, and chat history. This cannot be undone.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                {["All workspaces", "All documents", "All chat logs", "Your profile"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                padding: "9px 18px", borderRadius: 10,
                background: "#DC2626", color: "#fff",
                fontSize: 13, fontWeight: 700, border: "none",
                cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              Delete account
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          DELETE MODAL
      ══════════════════════════════════════ */}
      {showDeleteModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeDeleteModal() }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
        >
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}>
            {/* Modal header */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#FEF2F2", border: "1.5px solid #FECACA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                  <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Delete your account</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>Permanent and cannot be undone</div>
              </div>
              <button onClick={closeDeleteModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 4, display: "flex", borderRadius: 6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* What gets deleted */}
              <div style={{ background: "#FEF2F2", borderRadius: 10, border: "1px solid #FECACA", padding: "12px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B", marginBottom: 8 }}>This will permanently delete:</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {["Your account & profile", "All workspaces", "All uploaded documents", "All chat history"].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      <span style={{ fontSize: 12, color: "#B91C1C" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Password */}
              {/* <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Your password</label>
                <input
                  type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password to confirm"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "#EF4444")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
                />
              </div> */}

              {/* Type DELETE */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Type{" "}
                  <code style={{ background: "#FEF2F2", color: "#DC2626", padding: "2px 6px", borderRadius: 5, fontFamily: "monospace", fontSize: 12 }}>DELETE</code>
                  {" "}to confirm
                </label>
                <input
                  type="text" value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.1em", borderColor: deleteConfirmText === "DELETE" ? "#FCA5A5" : "#E2E8F0" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#EF4444")}
                  onBlur={e => (e.currentTarget.style.borderColor = deleteConfirmText === "DELETE" ? "#FCA5A5" : "#E2E8F0")}
                />
                {deleteConfirmText.length > 0 && deleteConfirmText !== "DELETE" && (
                  <p style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}>Must be exactly "DELETE" in uppercase</p>
                )}
              </div>

              <ErrBanner msg={deleteErr} />

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={closeDeleteModal}
                  style={{ flex: 1, padding: "11px 0", borderRadius: 10, background: "#F1F5F9", color: "#475569", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAccount}
                  disabled={deleteLoading || deleteConfirmText !== "DELETE"}
                  style={{
                    flex: 1, padding: "11px 0", borderRadius: 10,
                    // background: deleteConfirmText === "DELETE" && deletePassword && !deleteLoading ? "#DC2626" : "#FCA5A5",
                    background: deleteConfirmText === "DELETE" && !deleteLoading ? "#DC2626" : "#FCA5A5",
                    color: "#fff", fontSize: 13, fontWeight: 700, border: "none",
                    // cursor: deleteConfirmText === "DELETE" && deletePassword && !deleteLoading ? "pointer" : "not-allowed",
                    cursor: deleteConfirmText === "DELETE" && !deleteLoading ? "pointer" : "not-allowed",
                    fontFamily: "inherit", transition: "background .15s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {deleteLoading ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        style={{ animation: "spin .7s linear infinite" }}>
                        <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round"/>
                      </svg>
                      Deleting…
                    </>
                  ) : "Delete my account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast visible={toastVisible} msg={toast} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
