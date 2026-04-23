

"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
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
    <div className="min-h-screen flex" style={{ background: "#0f0f12" }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 relative overflow-hidden" style={{ background: "#0a0a0d" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-120px] left-[-80px] w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(139,92,246,0.18)" }} />
          <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(99,102,241,0.12)" }} />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#7c3aed" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">DocChat</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Chat with your<br />
              <span style={{ color: "#a78bfa" }}>documents</span> instantly.
            </h2>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#a1a1aa" }}>
              Upload PDFs, Word docs, or any file — and get instant, accurate answers powered by AI.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { icon: "⚡", label: "Instant answers from any document" },
              { icon: "🔒", label: "Your data stays private and secure" },
              { icon: "🧠", label: "AI that understands context deeply" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span className="text-sm" style={{ color: "#d4d4d8" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "#52525b" }}>© {new Date().getFullYear()} DocChat. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-7">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#7c3aed" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-white font-semibold">DocChat</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: "#a1a1aa" }}>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#f87171" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl h-11 text-sm font-medium transition-all duration-200 disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            {googleLoading ? (
              <svg className="w-4 h-4 animate-spin" style={{ color: "#a1a1aa" }} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            )}
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "#52525b" }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "#d4d4d8" }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 h-11 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
                onFocus={e => (e.currentTarget.style.border = "1px solid rgba(139,92,246,0.6)")}
                onBlur={e => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)")}
                placeholder="you@example.com"
                required
                // autoComplete="email"
                autoComplete="off"

              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color: "#d4d4d8" }}>Password</label>
                {/* <Link href="/forgot-password" className="text-xs transition-colors" style={{ color: "#a78bfa" }}>Forgot password?</Link> */}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 pr-11 h-11 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
                  onFocus={e => (e.currentTarget.style.border = "1px solid rgba(139,92,246,0.6)")}
                  onBlur={e => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)")}
                  placeholder="••••••••"
                  required
                  // autoComplete="current-password"
                  autoComplete="new-password"

                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#71717a" }}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 text-white rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              style={{ background: "#7c3aed" }}
              onMouseEnter={e => { if (!loading && !googleLoading) e.currentTarget.style.background = "#6d28d9" }}
              onMouseLeave={e => (e.currentTarget.style.background = "#7c3aed")}
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in…</>
              ) : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: "#71717a" }}>
            Don't have an account?{" "}
            <Link href="/register" className="font-medium transition-colors" style={{ color: "#a78bfa" }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
