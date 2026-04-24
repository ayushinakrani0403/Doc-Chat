"use client"
import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.error) {
      setError("Invalid email or password. Please try again.")
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signIn("google", { callbackUrl })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        .login-root {
          min-height: 100vh;
          display: flex;
          background: #080810;
          font-family: 'Sora', sans-serif;
        }

        /* LEFT PANEL */
        .login-left {
          width: 48%;
          min-height: 100vh;
          background: #0c0c18;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(2.5rem, 5vw, 5rem) clamp(2.5rem, 5vw, 5.5rem);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .login-left::before {
          content: '';
          position: absolute;
          top: -200px; left: -150px;
          width: clamp(400px, 50vw, 650px);
          height: clamp(400px, 50vw, 650px);
          background: radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -150px; right: -100px;
          width: clamp(300px, 40vw, 500px);
          height: clamp(300px, 40vw, 500px);
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .grid-bg {
          position: absolute; inset: 0;
          opacity: 0.035;
          background-image:
            linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .left-logo {
          display: flex; align-items: center; gap: 12px;
          position: relative; z-index: 1;
        }
        .left-logo-icon {
          width: clamp(36px, 3vw, 42px);
          height: clamp(36px, 3vw, 42px);
          background: #7c3aed;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .left-logo-text {
          font-size: clamp(16px, 1.4vw, 20px);
          font-weight: 700; color: #fff;
          letter-spacing: -0.3px;
        }
        .left-center { position: relative; z-index: 1; }
        .left-headline {
          font-size: clamp(2rem, 3.2vw, 3.5rem);
          font-weight: 800; color: #fff;
          line-height: 1.12;
          letter-spacing: -1.5px;
          margin-bottom: clamp(1rem, 2vw, 1.4rem);
        }
        .left-headline span { color: #a78bfa; }
        .left-desc {
          font-size: clamp(13px, 1vw, 15px);
          color: #71717a; line-height: 1.75;
          max-width: 400px;
          margin-bottom: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 300;
        }
        .features { display: flex; flex-direction: column; gap: 14px; }
        .feature { display: flex; align-items: center; gap: 14px; }
        .feature-icon {
          width: clamp(32px, 2.5vw, 40px);
          height: clamp(32px, 2.5vw, 40px);
          border-radius: 10px;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-size: clamp(14px, 1.2vw, 17px);
        }
        .feature-text {
          font-size: clamp(12.5px, 0.9vw, 14px);
          color: #a1a1aa;
        }
        .left-footer {
          font-size: 11px; color: #3f3f46;
          position: relative; z-index: 1;
        }

        /* RIGHT PANEL */
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(2rem, 4vw, 4rem) clamp(1.5rem, 4vw, 5rem);
          min-height: 100vh;
        }
        .login-card { width: 100%; max-width: 430px; }
        .mobile-logo {
          display: none;
          align-items: center;
          gap: 8px;
          margin-bottom: 2rem;
        }
        .mobile-logo-icon {
          width: 30px; height: 30px;
          background: #7c3aed; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
        }
        .mobile-logo-text { font-size: 15px; font-weight: 700; color: #fff; }
        .login-title {
          font-size: clamp(1.5rem, 2vw, 2rem);
          font-weight: 700; color: #fff;
          letter-spacing: -0.5px; margin-bottom: 6px;
        }
        .login-sub { font-size: 13.5px; color: #71717a; margin-bottom: 1.8rem; }

        .error-box {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 1.2rem;
        }
        .error-text { font-size: 13px; color: #f87171; }

        .google-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          height: 46px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e4e4e7;
          font-size: 13.5px; font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          font-family: 'Sora', sans-serif;
          margin-bottom: 1.5rem;
        }
        .google-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
        }
        .google-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 1.4rem;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text { font-size: 11.5px; color: #52525b; white-space: nowrap; }

        .field { margin-bottom: 1rem; }
        .field-label {
          display: block; font-size: 12.5px;
          font-weight: 500; color: #d4d4d8; margin-bottom: 6px;
        }
        .field-input {
          width: 100%; height: 46px;
          padding: 0 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          color: #fff; font-size: 13.5px;
          font-family: 'Sora', sans-serif;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input::placeholder { color: #52525b; }
        .field-input:focus {
          border-color: rgba(124,58,237,0.55);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
        }
        .pw-wrap { position: relative; }
        .pw-wrap .field-input { padding-right: 46px; }
        .eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #52525b; display: flex; padding: 4px;
          transition: color 0.12s;
        }
        .eye-btn:hover { color: #a1a1aa; }

        .submit-btn {
          width: 100%; height: 46px;
          background: #7c3aed; color: #fff;
          border: none; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          margin-top: 1.2rem;
        }
        .submit-btn:hover:not(:disabled) {
          background: #6d28d9;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124,58,237,0.35);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .register-line {
          text-align: center; font-size: 13px;
          color: #71717a; margin-top: 1.5rem;
        }
        .register-line a {
          color: #a78bfa; font-weight: 500; text-decoration: none;
        }
        .register-line a:hover { color: #c4b5fd; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .login-left { width: 42%; padding: 2.5rem 2.5rem; }
          .left-headline { letter-spacing: -1px; }
        }
        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right {
            align-items: flex-start;
            padding: 2.5rem 1.5rem;
          }
          .mobile-logo { display: flex; }
          .login-card { max-width: 100%; }
        }
        @media (max-width: 400px) {
          .login-right { padding: 2rem 1.2rem; }
        }
        @media (min-width: 1440px) {
          .login-left { padding: 5rem 6rem; }
          .login-right { padding: 4rem 6rem; }
          .login-card { max-width: 460px; }
        }
        @media (min-width: 1920px) {
          .login-left { width: 45%; }
          .login-card { max-width: 500px; }
        }
      `}</style>

      <div className="login-root">
        {/* LEFT */}
        <div className="login-left">
          <div className="grid-bg" />
          <div className="left-logo">
            <div className="left-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="left-logo-text">DocChat</span>
          </div>

          <div className="left-center">
            <h2 className="left-headline">
              Chat with your<br />
              <span>documents</span><br />
              instantly.
            </h2>
            <p className="left-desc">
              Upload PDFs, Word docs, or any file — and get instant, accurate answers powered by AI. No more searching through pages.
            </p>
            <div className="features">
              {[
                { icon: "⚡", text: "Instant answers from any document" },
                { icon: "🔒", text: "Your data stays private and secure" },
                { icon: "🧠", text: "AI that understands context deeply" },
              ].map((f) => (
                <div key={f.text} className="feature">
                  <div className="feature-icon">{f.icon}</div>
                  <span className="feature-text">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="left-footer">© {new Date().getFullYear()} DocChat. All rights reserved.</p>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-card">
            <div className="mobile-logo">
              <div className="mobile-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="mobile-logo-text">DocChat</span>
            </div>

            <h1 className="login-title">Welcome back</h1>
            <p className="login-sub">Sign in to your account to continue...</p>

            {error && (
              <div className="error-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="1.8"/>
                  <path d="M12 8v4m0 4h.01" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span className="error-text">{error}</span>
              </div>
            )}

            <button className="google-btn" onClick={handleGoogle} disabled={googleLoading || loading}>
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
              {googleLoading ? "Redirecting…" : "Continue with Google"}
            </button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or sign in with email</span>
              <div className="divider-line" />
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="field">
                <label className="field-label">Email address</label>
                <input
                  type="email"
                  className="field-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <div className="pw-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="field-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
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
              </div>

              <button type="submit" className="submit-btn" disabled={loading || googleLoading}>
                {loading ? (
                  <>
                    <svg className="spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                    Signing in…
                  </>
                ) : "Sign in to DocChat"}
              </button>
            </form>

            <p className="register-line">
              Don&apos;t have an account?{" "}
              <Link href="/register">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg style={{ animation: "spin 0.8s linear infinite" }} width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="4" opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round"/>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
