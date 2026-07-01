"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch("/api/spsadmn/toole")
      .then((r) => {
        if (r.ok) {
          setAuthenticated(true)
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/spsadmn/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setAuthenticated(true)
      } else {
        const data = await res.json().catch(() => ({ error: "Vale parool" }))
        setError(data.error || "Vale parool")
      }
    } catch {
      setError("Ühenduse viga. Proovi uuesti.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/spsadmn/logout", { method: "POST" })
    } catch {}
    setAuthenticated(false)
    router.push("/spsadmn")
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eceef1]">
        <p className="text-[15px] text-[#5a6474]">Laadin...</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eceef1]">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-10 shadow-lg max-w-[400px] w-full">
          <h1 className="text-[28px] font-bold text-[#17345a] mb-2">Admin</h1>
          <p className="text-[15px] text-[#5a6474] mb-6">Sisesta parool jätkamiseks</p>
          {error && <p className="text-[15px] text-red-600 mb-4">{error}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parool"
            className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-3 text-[16px] mb-4 focus:outline-none focus:border-[#3abeff]"
            autoFocus
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#17345a] text-white py-3 px-5 rounded-xl text-[16px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-50"
          >
            {submitting ? "Sisenen..." : "Sisene"}
          </button>
        </form>
      </div>
    )
  }

  const navItems = [
    { href: "/spsadmn", label: "Avaleht", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/spsadmn/blog", label: "Blogi", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
    { href: "/spsadmn/toole", label: "Tööpakkumised", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ]

  return (
    <div className="min-h-screen bg-[#eceef1] flex">
      <aside className="w-[240px] bg-[#17345a] text-white min-h-screen flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <h2 className="text-[18px] font-bold">SPS Admin</h2>
        </div>
        <nav className="flex-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] mb-1 transition-colors ${
                pathname === item.href ? "bg-white/15 font-medium" : "hover:bg-white/8"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-xl text-[15px] hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logi välja
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
