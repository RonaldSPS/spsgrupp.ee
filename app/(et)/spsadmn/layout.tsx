"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [currentUser, setCurrentUser] = useState<{
    id: number; email: string; displayName: string; role: string; isEnvAdmin: boolean
  } | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileEmail, setProfileEmail] = useState("")
  const [profileName, setProfileName] = useState("")
  const [profilePassword, setProfilePassword] = useState("")
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState("")

  const fetchMe = () => {
    fetch("/api/spsadmn/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user)
          setProfileEmail(data.user.email || "")
          setProfileName(data.user.displayName || "")
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetch("/api/spsadmn/toole")
      .then((r) => {
        if (r.ok) {
          setAuthenticated(true)
          fetchMe()
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  useEffect(() => {
    closeSidebar()
  }, [pathname, closeSidebar])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const body: Record<string, string> = { password }
      if (loginEmail.trim()) body.email = loginEmail.trim()
      const res = await fetch("/api/spsadmn/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setAuthenticated(true)
      } else {
        const data = await res.json().catch(() => ({ error: "Vale parool või e-mail" }))
        setError(data.error || "Vale parool või e-mail")
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
      <div className="min-h-screen flex items-center justify-center bg-[#eceef1] px-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg max-w-[400px] w-full">
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#17345a] mb-2">Admin</h1>
          <p className="text-[15px] text-[#5a6474] mb-6">
            Sisene keskkonna parooliga või oma e-posti ja parooliga
          </p>
          {error && <p className="text-[15px] text-red-600 mb-4">{error}</p>}
          {error.includes("Andmebaasi") && (
            <p className="text-[15px] text-[#92400e] bg-[#fef3c7] rounded-lg px-3 py-2 mb-4">
              Andmebaas on tõenäoliselt pausil. Logi sisse keskkonna parooliga (jäta e-post tühjaks) ja käivita andmebaas: Seaded → Andmebaas → „Käivita andmebaas“.
            </p>
          )}
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="E-post (ainult andmebaasi kasutajale)"
            className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-3 text-[16px] mb-3 focus:outline-none focus:border-[#3abeff]"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parool"
            className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-3 text-[16px] mb-4 focus:outline-none focus:border-[#3abeff]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#17345a] text-white py-3 px-5 rounded-xl text-[16px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-50"
          >
            {submitting ? "Sisenen..." : "Sisene"}
          </button>
          <p className="text-[15px] text-[#5a6474] mt-3 text-center font-light">
            Keskkonna administraator: jäta e-posti väli tühjaks
          </p>
        </form>
      </div>
    )
  }

  const navItems = [
    { href: "/spsadmn/", label: "Avaleht", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/spsadmn/testimonials/", label: "Arvamused", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" },
    { href: "/spsadmn/blog/", label: "Blogi", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
    { href: "/spsadmn/toole/", label: "Tööpakkumised", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { href: "/spsadmn/paringud/", label: "Päringud", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { href: "/spsadmn/seaded/", label: "Seaded", icon: "M12 15a3 3 0 100-6 3 3 0 000 6z" },
  ]

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-[18px] font-bold">SPS Admin</h2>
        <button
          onClick={closeSidebar}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
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
    </>
  )

  return (
    <div className="min-h-screen bg-[#eceef1]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[240px] bg-[#17345a] text-white min-h-screen flex-col shrink-0 fixed left-0 top-0 bottom-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={closeSidebar} />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#17345a] text-white flex flex-col z-50 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-[240px]">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white border-b border-[rgba(23,52,90,0.08)] px-4 py-2.5 lg:py-3 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f0f2f5] transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="text-[16px] font-bold text-[#17345a] lg:hidden">SPS Admin</span>
          </div>

          {/* Current user */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen)
                setProfileMsg("")
                if (currentUser) {
                  setProfileEmail(currentUser.email || "")
                  setProfileName(currentUser.displayName || "")
                }
                setProfilePassword("")
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#f0f2f5] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#17345a] text-white flex items-center justify-center text-[15px] font-bold shrink-0">
                {(currentUser?.displayName || "A")[0].toUpperCase()}
              </div>
              <span className="text-[15px] font-medium text-[#17345a] hidden sm:block max-w-[160px] truncate">
                {currentUser?.displayName || currentUser?.email || "Peaadmin"}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a6474" strokeWidth="2.5" className="hidden sm:block">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-[320px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-[rgba(23,52,90,0.08)] p-5 z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-[#17345a]">Minu konto</h3>
                  <button onClick={() => setProfileOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0f2f5] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a6474" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>

                <div className="text-[15px] text-[#5a6474] mb-3">
                  Roll: <span className="font-medium text-[#17345a]">{currentUser?.role === "admin" ? "Administraator" : "Manager"}</span>
                  {currentUser?.isEnvAdmin && <span className="block mt-1 text-[#92400e] bg-[#fef3c7] rounded-lg px-2 py-1">Keskkonna administraator — loo konto, et hallata profiili</span>}
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[15px] font-medium text-[#17345a]">E-mail</label>
                    <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)}
                      className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[15px] font-medium text-[#17345a]">Nimi</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)}
                      className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[15px] font-medium text-[#17345a]">{currentUser?.isEnvAdmin ? "Uus parool *" : "Uus parool (tühjaks jätmisel ei muudeta)"}</label>
                    <input type="password" value={profilePassword} onChange={(e) => setProfilePassword(e.target.value)}
                      className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da]" />
                  </div>
                </div>

                {profileMsg && (
                  <p className={`text-[15px] mt-3 ${profileMsg.includes("Viga") || profileMsg.includes("Peab") ? "text-red-600" : "text-[#2d9e6b]"}`}>
                    {profileMsg}
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={async () => {
                      setProfileSaving(true)
                      setProfileMsg("")
                      try {
                        const body: Record<string, string> = {}
                        if (profileEmail) body.email = profileEmail
                        if (profileName) body.displayName = profileName
                        if (profilePassword) body.password = profilePassword
                        if (currentUser?.isEnvAdmin) {
                          body.email = profileEmail
                          body.password = profilePassword
                        }
                        const res = await fetch("/api/spsadmn/me", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(body),
                        })
                        const data = await res.json().catch(() => ({}))
                        if (res.ok) {
                          setProfileMsg(data.message || "Salvestatud")
                          if (data.user) setCurrentUser(data.user)
                          if (data.message?.includes("logi sisse")) {
                            setTimeout(() => { handleLogout() }, 2000)
                          }
                          if (!currentUser?.isEnvAdmin) setProfileOpen(false)
                        } else {
                          setProfileMsg(data.error || "Viga salvestamisel")
                        }
                      } catch {
                        setProfileMsg("Viga salvestamisel")
                      } finally {
                        setProfileSaving(false)
                      }
                    }}
                    disabled={profileSaving}
                    className="bg-[#17345a] text-white py-2 px-5 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-60"
                  >
                    {profileSaving ? "Salvestan..." : "Salvesta"}
                  </button>
                  <button onClick={() => setProfileOpen(false)}
                    className="py-2 px-4 rounded-xl text-[15px] font-medium text-[#5a6474] hover:bg-gray-100 transition-colors border border-[rgba(23,52,90,0.12)]">
                    Sulge
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
