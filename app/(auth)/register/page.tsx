"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special char", pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"]
  const labels = ["Weak", "Fair", "Good", "Strong"]
  if (!password) return null
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i < score ? colors[score - 1] : "rgba(255,255,255,0.1)", transition: "background .3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {checks.map((c) => (
            <span key={c.label} style={{ fontSize: 11, color: c.pass ? "#86efac" : "#52525b", display: "flex", alignItems: "center", gap: 3 }}>
              {c.pass ? "✓" : "·"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: colors[score - 1] }}>{labels[score - 1]}</span>}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) { setError("Please agree to the Terms of Service and Privacy Policy."); return }
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.")
      setLoading(false)
    } else {
      await signIn("credentials", { email, password, redirect: false })
      router.push("/dashboard")
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        html, body { height: 100%; overflow: hidden; }

        .reg-root {
          height: 100vh;
          display: flex;
          background: #080810;
          font-family: 'Sora', sans-serif;
          overflow: hidden;
        }

        .reg-left {
          width: 48%;
          height: 100vh;
          background: #0c0c18;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(1.5rem, 3.5vw, 4rem) clamp(2rem, 4vw, 5rem);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .reg-left::before {
          content: '';
          position: absolute;
          top: -200px; left: -150px;
          width: clamp(400px, 50vw, 650px);
          height: clamp(400px, 50vw, 650px);
          background: radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%);
          pointer-events: none;
        }
        .reg-left::after {
          content: '';
          position: absolute;
          bottom: -150px; right: -100px;
          width: clamp(300px, 40vw, 500px);
          height: clamp(300px, 40vw, 500px);
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .reg-grid-bg {
          position: absolute; inset: 0; opacity: 0.035;
          background-image: linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px);
          background-size: 48px 48px; pointer-events: none;
        }
        .reg-left-logo { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
        .reg-left-logo-icon {
          width: clamp(36px, 3vw, 42px); height: clamp(36px, 3vw, 42px);
          background: #7c3aed; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .reg-left-logo-text { font-size: clamp(16px, 1.4vw, 20px); font-weight: 700; color: #fff; letter-spacing: -0.3px; }
        .reg-left-center { position: relative; z-index: 1; }
        .reg-left-headline {
          font-size: clamp(1.6rem, 2.8vw, 3.5rem); font-weight: 800; color: #fff;
          line-height: 1.12; letter-spacing: -1.5px; margin-bottom: clamp(0.6rem, 1.5vh, 1.4rem);
        }
        .reg-left-headline span { color: #a78bfa; }
        .reg-left-desc {
          font-size: clamp(12px, 0.9vw, 15px); color: #71717a; line-height: 1.7;
          max-width: 400px; margin-bottom: clamp(1rem, 2.5vh, 2.8rem); font-weight: 300;
        }
        .reg-feature-cards { display: flex; flex-direction: column; gap: clamp(6px, 1vh, 10px); }
        .reg-feature-card {
          border-radius: 12px; padding: clamp(8px, 1vh, 16px) clamp(12px, 1.2vw, 18px);
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
        }
        .reg-feature-card-title { font-size: clamp(12.5px, 0.9vw, 14px); font-weight: 600; color: #fff; margin-bottom: 3px; }
        .reg-feature-card-desc { font-size: clamp(11.5px, 0.8vw, 13px); color: #52525b; line-height: 1.5; }
        .reg-left-footer { font-size: 11px; color: #3f3f46; position: relative; z-index: 1; }

        .reg-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: clamp(1rem, 3vw, 4rem) clamp(1.5rem, 4vw, 5rem);
          height: 100vh; overflow-y: auto;
        }
        .reg-card { width: 100%; max-width: 430px; }

        .reg-mobile-logo { display: none; align-items: center; gap: 8px; margin-bottom: 2rem; }
        .reg-mobile-logo-icon { width: 30px; height: 30px; background: #7c3aed; border-radius: 7px; display: flex; align-items: center; justify-content: center; }
        .reg-mobile-logo-text { font-size: 15px; font-weight: 700; color: #fff; }

        .reg-title { font-size: clamp(1.3rem, 2vw, 2rem); font-weight: 700; color: #fff; letter-spacing: -0.5px; margin-bottom: 4px; }
        .reg-sub { font-size: 13px; color: #71717a; margin-bottom: clamp(1rem, 2vh, 1.8rem); }

        .reg-error-box {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px; padding: 10px 14px; margin-bottom: 1rem;
        }
        .reg-error-text { font-size: 13px; color: #f87171; }

        .reg-google-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          height: 44px; border-radius: 10px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #e4e4e7; font-size: 13.5px; font-weight: 500; cursor: pointer;
          transition: background 0.15s, border-color 0.15s; font-family: 'Sora', sans-serif;
          margin-bottom: clamp(0.8rem, 2vh, 1.5rem);
        }
        .reg-google-btn:hover:not(:disabled) { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.18); }
        .reg-google-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .reg-divider { display: flex; align-items: center; gap: 12px; margin-bottom: clamp(0.8rem, 2vh, 1.4rem); }
        .reg-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .reg-divider-text { font-size: 11.5px; color: #52525b; white-space: nowrap; }

        .reg-field { margin-bottom: clamp(0.6rem, 1.5vh, 1rem); }
        .reg-field-label { display: block; font-size: 12.5px; font-weight: 500; color: #d4d4d8; margin-bottom: 5px; }
        .reg-field-input {
          width: 100%; height: 42px; padding: 0 14px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px; color: #fff; font-size: 13.5px; font-family: 'Sora', sans-serif;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .reg-field-input::placeholder { color: #52525b; }
        .reg-field-input:focus { border-color: rgba(124,58,237,0.55); box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }

        .reg-pw-wrap { position: relative; }
        .reg-pw-wrap .reg-field-input { padding-right: 46px; }
        .reg-eye-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #52525b; display: flex; padding: 4px; transition: color 0.12s;
        }
        .reg-eye-btn:hover { color: #a1a1aa; }

        .reg-checkbox-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: clamp(0.5rem, 1.5vh, 1rem); cursor: pointer; }
        .reg-checkbox { width: 16px; height: 16px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; transition: all .15s; }
        .reg-checkbox-label { font-size: 12.5px; color: #a1a1aa; line-height: 1.5; }
        .reg-checkbox-label a { color: #a78bfa; text-decoration: none; }
        .reg-checkbox-label a:hover { color: #c4b5fd; }

        .reg-submit-btn {
          width: 100%; height: 44px; background: #7c3aed; color: #fff;
          border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: 'Sora', sans-serif; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s; margin-top: clamp(0.6rem, 1.5vh, 1.2rem);
        }
        .reg-submit-btn:hover:not(:disabled) { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.35); }
        .reg-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .reg-login-line { text-align: center; font-size: 13px; color: #71717a; margin-top: clamp(0.8rem, 2vh, 1.5rem); }
        .reg-login-line a { color: #a78bfa; font-weight: 500; text-decoration: none; }
        .reg-login-line a:hover { color: #c4b5fd; }

        @media (max-width: 900px) { .reg-left { width: 42%; padding: 2.5rem; } .reg-left-headline { letter-spacing: -1px; } }
        @media (max-width: 768px) {
          .reg-left { display: none; }
          .reg-right { align-items: flex-start; padding: 2.5rem 1.5rem; }
          .reg-mobile-logo { display: flex; }
          .reg-card { max-width: 100%; }
        }
        @media (max-width: 400px) { .reg-right { padding: 2rem 1.2rem; } }
        @media (min-width: 1440px) { .reg-left { padding: 5rem 6rem; } .reg-right { padding: 4rem 6rem; } .reg-card { max-width: 460px; } }
        @media (min-width: 1920px) { .reg-left { width: 45%; } .reg-card { max-width: 500px; } }
      `}</style>

      <div className="reg-root">

        {/* ── LEFT PANEL ── */}
        <div className="reg-left">
          <div className="reg-grid-bg" />
          <div className="reg-left-logo">
            <div className="reg-left-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="reg-left-logo-text">DocChat</span>
          </div>

          <div className="reg-left-center">
            <h2 className="reg-left-headline">
              Start for free.<br />
              <span>No credit card</span><br />
              needed.
            </h2>
            <p className="reg-left-desc">
              Create an account in seconds and start chatting with your documents right away. Upload, embed, and go live instantly.
            </p>
            <div className="reg-feature-cards">
              {[
                { title: "Free tier included", desc: "Up to 3 workspaces and 10 documents free forever." },
                { title: "AI-powered answers", desc: "Get context-aware answers from any document instantly." },
                { title: "Embeddable widget", desc: "Add a chat widget to your site in under 2 minutes." },
              ].map((item) => (
                <div key={item.title} className="reg-feature-card">
                  <p className="reg-feature-card-title">{item.title}</p>
                  <p className="reg-feature-card-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="reg-left-footer">© {new Date().getFullYear()} DocChat. All rights reserved.</p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="reg-right">
          <div className="reg-card">
            <div className="reg-mobile-logo">
              <div className="reg-mobile-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="reg-mobile-logo-text">DocChat</span>
            </div>

            <h1 className="reg-title">Create your account</h1>
            <p className="reg-sub">Get started in seconds — it&apos;s completely free</p>

            {error && (
              <div className="reg-error-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="1.8"/>
                  <path d="M12 8v4m0 4h.01" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span className="reg-error-text">{error}</span>
              </div>
            )}

            <button className="reg-google-btn" onClick={handleGoogle} disabled={googleLoading || loading}>
              {googleLoading ? (
                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#71717a" strokeWidth="4" opacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#71717a" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {googleLoading ? "Redirecting…" : "Sign up with Google"}
            </button>

            <div className="reg-divider">
              <div className="reg-divider-line" />
              <span className="reg-divider-text">or sign up with email</span>
              <div className="reg-divider-line" />
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="reg-field">
                <label className="reg-field-label">Full name</label>
                <input type="text" className="reg-field-input" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name"/>
              </div>
              <div className="reg-field">
                <label className="reg-field-label">Email address</label>
                <input type="email" className="reg-field-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"/>
              </div>
              <div className="reg-field">
                <label className="reg-field-label">Password</label>
                <div className="reg-pw-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="reg-field-input"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required minLength={8} autoComplete="new-password"
                  />
                  <button type="button" className="reg-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <path d="M1 1l22 22"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div className="reg-checkbox-row" onClick={() => setAgreed(!agreed)}>
                <div className="reg-checkbox" style={{ background: agreed ? "#7c3aed" : "rgba(255,255,255,0.05)", border: agreed ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.15)" }}>
                  {agreed && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className="reg-checkbox-label" onClick={(e) => e.stopPropagation()}>
                  I agree to the{" "}
                  <Link href="/terms">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy">Privacy Policy</Link>
                </span>
              </div>

              <button type="submit" className="reg-submit-btn" disabled={loading || googleLoading}>
                {loading ? (
                  <>
                    <svg className="spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                    Creating account…
                  </>
                ) : "Create  account"}
              </button>
            </form>

            <p className="reg-login-line">
              Already have an account?{" "}
              <Link href="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
