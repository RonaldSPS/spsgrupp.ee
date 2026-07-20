"use client"

import { useState, useEffect } from "react"

interface AdminUser {
  id: number
  email: string
  displayName: string
  role: string
  active: boolean
  isEnvAdmin?: boolean
}

export default function SeadedPage() {
  const [activeTab, setActiveTab] = useState<"general" | "users">("general")

  // General settings
  const [emailRecipients, setEmailRecipients] = useState("")
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState("")

  // Admin users
  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)
  const [editUserId, setEditUserId] = useState<number | null>(null)
  const [claimEmail, setClaimEmail] = useState("")
  const [claimPassword, setClaimPassword] = useState("")
  const [claimName, setClaimName] = useState("")
  const [claimSaving, setClaimSaving] = useState(false)
  const [claimMsg, setClaimMsg] = useState("")

  // New user form
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("manager")

  // Edit user
  const [editEmail, setEditEmail] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [editName, setEditName] = useState("")
  const [editRole, setEditRole] = useState("")

  const fetchSettings = () => {
    fetch("/api/spsadmn/seaded")
      .then((r) => r.json())
      .then((data) => {
        setEmailRecipients(data.settings?.email_recipients || "info@spsgrupp.ee")
      })
      .finally(() => setSettingsLoading(false))
  }

  const fetchUsers = () => {
    setUsersLoading(true)
    Promise.all([
      fetch("/api/spsadmn/seaded/admins").then((r) => r.json()),
      fetch("/api/spsadmn/me").then((r) => r.json()),
    ]).then(([adminsData, meData]) => {
      const dbUsers: AdminUser[] = (adminsData.users || [])
      const me = meData.user
      if (me && me.isEnvAdmin) {
        setUsers([{ id: 0, email: "", displayName: me.displayName, role: me.role, active: true, isEnvAdmin: true }, ...dbUsers])
      } else {
        setUsers(dbUsers)
      }
    }).finally(() => setUsersLoading(false))
  }

  useEffect(() => {
    fetchSettings()
    fetchUsers()
  }, [])

  const saveSettings = async () => {
    setSettingsSaving(true)
    setSettingsMessage("")
    try {
      const res = await fetch("/api/spsadmn/seaded", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: { email_recipients: emailRecipients } }),
      })
      if (res.ok) {
        setSettingsMessage("Seaded salvestatud")
      } else {
        setSettingsMessage("Viga salvestamisel")
      }
    } catch {
      setSettingsMessage("Viga salvestamisel")
    } finally {
      setSettingsSaving(false)
    }
  }

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/spsadmn/seaded/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPassword, displayName: newName, role: newRole }),
      })
      if (res.ok) {
        setNewEmail("")
        setNewPassword("")
        setNewName("")
        setNewRole("manager")
        setShowAddUser(false)
        fetchUsers()
      } else {
        const data = await res.json().catch(() => ({ error: "Viga" }))
        alert(data.error || "Kasutaja loomine ebaõnnestus")
      }
    } catch (err) {
      alert("Ühenduse viga. Palun proovi uuesti.")
      console.error("addUser failed:", err)
    }
  }

  const startEditUser = (user: AdminUser) => {
    setEditUserId(user.id)
    setEditEmail(user.email)
    setEditPassword("")
    setEditName(user.displayName)
    setEditRole(user.role)
  }

  const cancelEdit = () => {
    setEditUserId(null)
    setEditEmail("")
    setEditPassword("")
    setEditName("")
    setEditRole("")
  }

  const saveEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const fields: Record<string, string | boolean> = {
      email: editEmail,
      displayName: editName,
      role: editRole,
    }
    if (editPassword) fields.password = editPassword

    const res = await fetch("/api/spsadmn/seaded/admins", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editUserId, fields }),
    })
    if (res.ok) {
      cancelEdit()
      fetchUsers()
    } else {
      const data = await res.json().catch(() => ({ error: "Viga" }))
      alert(data.error || "Kasutaja uuendamine ebaõnnestus")
    }
  }

  const toggleUserActive = async (user: AdminUser) => {
    const res = await fetch("/api/spsadmn/seaded/admins", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, fields: { active: !user.active } }),
    })
    if (res.ok) {
      fetchUsers()
    } else {
      const data = await res.json().catch(() => ({ error: "Viga" }))
      alert(data.error || "Uuendamine ebaõnnestus")
    }
  }

  const deleteUser = async (user: AdminUser) => {
    if (!confirm(`Kustutada kasutaja "${user.displayName || user.email}"?`)) return
    const res = await fetch(`/api/spsadmn/seaded/admins?id=${user.id}`, { method: "DELETE" })
    if (res.ok) {
      fetchUsers()
    } else {
      const data = await res.json().catch(() => ({ error: "Viga" }))
      alert(data.error || "Kustutamine ebaõnnestus")
    }
  }

  return (
    <div>
      <h1 className="text-[24px] sm:text-[32px] font-bold text-[#17345a] mb-2">Seaded</h1>
      <p className="text-[15px] text-[#5a6474] mb-6">Halda süsteemi seadeid ja administraatoreid</p>

      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-[rgba(23,52,90,0.08)] w-fit">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-lg text-[15px] font-medium transition-colors ${
            activeTab === "general" ? "bg-[#17345a] text-white" : "text-[#5a6474] hover:bg-[#f8fafc]"
          }`}
        >
          Üldine
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-lg text-[15px] font-medium transition-colors ${
            activeTab === "users" ? "bg-[#17345a] text-white" : "text-[#5a6474] hover:bg-[#f8fafc]"
          }`}
        >
          Kasutajad
        </button>
      </div>

      {activeTab === "general" && (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-6">
          <h2 className="text-[20px] font-bold text-[#17345a] mb-4">E-posti saajad</h2>
          <p className="text-[15px] text-[#5a6474] mb-4">
            Siia saadetakse kõik kontaktvormi päringud. Lisa mitu aadressi eraldatuna komaga (,).
          </p>

          {settingsLoading ? (
            <p className="text-[15px] text-[#5a6474]">Laadin...</p>
          ) : (
            <div>
              <input
                type="text"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
                className="w-full px-4 py-3 border border-[rgba(23,52,90,0.12)] rounded-xl text-[15px] text-[#2d3748] outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)] mb-4"
                placeholder="info@spsgrupp.ee, personal@spsgrupp.ee"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={saveSettings}
                  disabled={settingsSaving}
                  className="bg-[#17345a] text-white py-2.5 px-6 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-60"
                >
                  {settingsSaving ? "Salvestan..." : "Salvesta"}
                </button>
                {settingsMessage && (
                  <span className={`text-[15px] ${settingsMessage.includes("Viga") ? "text-red-600" : "text-[#2d9e6b]"}`}>
                    {settingsMessage}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold text-[#17345a]">Administraatorid</h2>
            <button
              onClick={() => { setShowAddUser(!showAddUser); cancelEdit() }}
              className="bg-[#3abeff] text-white py-2.5 px-5 rounded-xl text-[15px] font-medium hover:bg-[#2ba8e8] transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Lisa kasutaja
            </button>
          </div>

          {showAddUser && (
            <form onSubmit={addUser} className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-6 mb-4">
              <h3 className="text-[16px] font-bold text-[#17345a] mb-4">Uus administrautor</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[15px] font-medium text-[#17345a]">E-mail *</label>
                  <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                    className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[15px] font-medium text-[#17345a]">Parool *</label>
                  <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[15px] font-medium text-[#17345a]">Nimi</label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[15px] font-medium text-[#17345a]">Roll</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
                    className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da] bg-white">
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-[#17345a] text-white py-2 px-5 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors">
                  Loo kasutaja
                </button>
                <button type="button" onClick={() => setShowAddUser(false)}
                  className="py-2 px-5 rounded-xl text-[15px] font-medium text-[#5a6474] hover:bg-gray-100 transition-colors border border-[rgba(23,52,90,0.12)]">
                  Tühista
                </button>
              </div>
            </form>
          )}

          {editUserId && (
            <form onSubmit={saveEditUser} className="bg-white rounded-2xl border border-[#3abeff] p-6 mb-4">
              <h3 className="text-[16px] font-bold text-[#17345a] mb-4">Muuda kasutajat</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[15px] font-medium text-[#17345a]">E-mail *</label>
                  <input type="email" required value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                    className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[15px] font-medium text-[#17345a]">Uus parool (tühjaks jätmisel ei muudeta)</label>
                  <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)}
                    className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[15px] font-medium text-[#17345a]">Nimi</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[15px] font-medium text-[#17345a]">Roll</label>
                  <select value={editRole} onChange={(e) => setEditRole(e.target.value)}
                    className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da] bg-white">
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-[#17345a] text-white py-2 px-5 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors">
                  Salvesta
                </button>
                <button type="button" onClick={cancelEdit}
                  className="py-2 px-5 rounded-xl text-[15px] font-medium text-[#5a6474] hover:bg-gray-100 transition-colors border border-[rgba(23,52,90,0.12)]">
                  Tühista
                </button>
              </div>
            </form>
          )}

          {usersLoading ? (
            <p className="text-[15px] text-[#5a6474]">Laadin...</p>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-10 text-center">
              <p className="text-[15px] text-[#5a6474]">Ühtegi lisakasutajat pole loodud.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] overflow-hidden">
              <div className="divide-y divide-[rgba(23,52,90,0.06)]">
                {users.map((user) => (
                  <div key={user.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 transition-colors ${user.active ? "hover:bg-[#f8fafc]" : "bg-[#f0f2f5] hover:bg-[#e8eaed]"}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[16px] font-medium text-[#17345a]">
                          {user.isEnvAdmin ? "Peaadministraator" : (user.displayName || user.email)}
                        </span>
                        {user.isEnvAdmin ? (
                          <>
                            <span className="shrink-0 text-[15px] px-2 py-0.5 rounded-full font-medium bg-[#fef3c7] text-[#92400e]">
                              Keskkond
                            </span>
                            <span className="shrink-0 text-[15px] px-2 py-0.5 rounded-full font-medium bg-[#2d9e6b]/10 text-[#2d9e6b]">
                              Aktiivne
                            </span>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleUserActive(user)}
                              className={`shrink-0 text-[15px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                                user.active ? "bg-[#2d9e6b]/10 text-[#2d9e6b]" : "bg-gray-100 text-[#5a6474]"
                              }`}
                            >
                              {user.active ? "Aktiivne" : "Blokeeritud"}
                            </button>
                            <span className={`shrink-0 text-[15px] px-2 py-0.5 rounded-full font-medium ${
                              user.role === "admin" ? "bg-[#fef3c7] text-[#92400e]" : "bg-[#eef7fc] text-[#17345a]"
                            }`}>
                              {user.role === "admin" ? "Admin" : "Manager"}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-[15px] text-[#5a6474] truncate">{user.isEnvAdmin ? "Konto loodud keskkonnaparooliga (ADMIN_PASSWORD)" : user.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {user.isEnvAdmin ? (
                        <button
                          onClick={async () => {
                            if (!claimEmail || !claimPassword) {
                              setClaimMsg("Palun sisesta e-mail ja parool")
                              return
                            }
                            setClaimSaving(true)
                            setClaimMsg("")
                            try {
                              const res = await fetch("/api/spsadmn/seaded/admins", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: claimEmail, password: claimPassword, displayName: claimName, role: "admin" }),
                              })
                              const data = await res.json().catch(() => ({}))
                              if (res.ok) {
                                setClaimMsg("Konto loodud! Logi välja ja sisse uuesti.")
                                setClaimEmail("")
                                setClaimPassword("")
                                setClaimName("")
                                fetchUsers()
                              } else {
                                setClaimMsg(data.error || "Viga")
                              }
                            } catch {
                              setClaimMsg("Viga konto loomisel")
                            } finally {
                              setClaimSaving(false)
                            }
                          }}
                          disabled={claimSaving}
                          className="text-[15px] py-1.5 px-4 rounded-xl font-medium bg-[#17345a] text-white hover:bg-[#1e4a7a] transition-colors disabled:opacity-60"
                          title="Loo andmebaasi konto"
                        >
                          {claimSaving ? "Loon..." : "Loo konto"}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditUser(user)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] transition-colors"
                            title="Muuda"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteUser(user)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Kustuta"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {/* Inline claim form for env admin */}
                {users.some((u) => u.isEnvAdmin) && (
                  <div className="px-4 sm:px-6 py-4 bg-[#fffbeb]">
                    <p className="text-[15px] font-medium text-[#92400e] mb-3">Sisesta andmed, et muuta keskkonna administraator andmebaasi kasutajaks:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input type="email" required placeholder="E-mail" value={claimEmail} onChange={(e) => setClaimEmail(e.target.value)}
                        className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da] bg-white" />
                      <input type="password" required placeholder="Parool (vähemalt 6 tähemärki)" value={claimPassword} onChange={(e) => setClaimPassword(e.target.value)}
                        className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da] bg-white" />
                      <input type="text" placeholder="Nimi" value={claimName} onChange={(e) => setClaimName(e.target.value)}
                        className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da] bg-white" />
                    </div>
                    {claimMsg && (
                      <p className={`text-[15px] mt-2 ${claimMsg.includes("Viga") ? "text-red-600" : "text-[#2d9e6b]"}`}>{claimMsg}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
