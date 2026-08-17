"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface AdminUser {
  id: number
  email: string
  displayName: string
  role: string
  active: boolean
  isEnvAdmin?: boolean
}

type AutoReplyKind = "contact" | "career"

const AUTOREPLY_LOCALES = ["et", "en", "ru"] as const
type AutoReplyLocale = (typeof AUTOREPLY_LOCALES)[number]

/** Empty template = the built-in default text for that language is used. */
interface AutoReplyState {
  enabled: boolean
  subjects: Record<AutoReplyLocale, string>
  bodies: Record<AutoReplyLocale, string>
}

const emptyAutoReply: AutoReplyState = {
  enabled: true,
  subjects: { et: "", en: "", ru: "" },
  bodies: { et: "", en: "", ru: "" },
}

interface MeResponse {
  user: { id: number; email: string; displayName: string; role: string; isEnvAdmin?: boolean } | null
}

// One retry rides out transient pooler stalls; 401 means the session is gone
// and sends the user back to the login screen instead of a dead-end error.
async function fetchMe(): Promise<{ res: Response | null; data: MeResponse | null }> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch("/api/spsadmn/me")
      if (res.status === 401) return { res, data: null }
      if (res.ok) return { res, data: (await res.json()) as MeResponse }
    } catch {
      // network hiccup — retry once
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 800))
  }
  return { res: null, data: null }
}

export default function SeadedPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"general" | "users">("general")
  const [currentRole, setCurrentRole] = useState<string | null>(null)
  const [meError, setMeError] = useState(false)

  // General settings
  const [emailRecipients, setEmailRecipients] = useState("")
  const [careerEmailRecipients, setCareerEmailRecipients] = useState("")
  const [autoReplies, setAutoReplies] = useState<Record<AutoReplyKind, AutoReplyState>>({
    contact: emptyAutoReply,
    career: emptyAutoReply,
  })
  const [autoReplyTabs, setAutoReplyTabs] = useState<Record<AutoReplyKind, AutoReplyLocale>>({
    contact: "et",
    career: "et",
  })
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState("")

  // Database status / restore (Supabase auto-pause recovery)
  const [dbStatus, setDbStatus] = useState<{ configured: boolean; projectStatus: string | null; dbOk: boolean } | null>(null)
  const [dbRestoring, setDbRestoring] = useState(false)

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
        const s = data.settings ?? {}
        setEmailRecipients(s.email_recipients || "info@spsgrupp.ee")
        setCareerEmailRecipients(s.career_email_recipients || "personal@spsgrupp.ee")
        setAutoReplies({
          contact: {
            enabled: s.autoreply_contact_enabled !== "0",
            subjects: { et: s.autoreply_contact_subject_et || "", en: s.autoreply_contact_subject_en || "", ru: s.autoreply_contact_subject_ru || "" },
            bodies: { et: s.autoreply_contact_body_et || "", en: s.autoreply_contact_body_en || "", ru: s.autoreply_contact_body_ru || "" },
          },
          career: {
            enabled: s.autoreply_career_enabled !== "0",
            subjects: { et: s.autoreply_career_subject_et || "", en: s.autoreply_career_subject_en || "", ru: s.autoreply_career_subject_ru || "" },
            bodies: { et: s.autoreply_career_body_et || "", en: s.autoreply_career_body_en || "", ru: s.autoreply_career_body_ru || "" },
          },
        })
      })
      .finally(() => setSettingsLoading(false))
  }

  const fetchUsers = (me?: MeResponse["user"]) => {
    setUsersLoading(true)
    const mePromise = me !== undefined
      ? Promise.resolve({ user: me } as MeResponse)
      : fetch("/api/spsadmn/me").then((r) => r.json())
    Promise.all([
      fetch("/api/spsadmn/seaded/admins").then((r) => r.json()),
      mePromise,
    ]).then(([adminsData, meData]) => {
      const dbUsers: AdminUser[] = (adminsData.users || [])
      const meUser = meData.user
      if (meUser && meUser.isEnvAdmin) {
        setUsers([{ id: 0, email: "", displayName: meUser.displayName, role: meUser.role, active: true, isEnvAdmin: true }, ...dbUsers])
      } else {
        setUsers(dbUsers)
      }
    }).finally(() => setUsersLoading(false))
  }

  const isAdmin = currentRole === "admin"

  useEffect(() => {
    fetchMe().then(({ res, data }) => {
      if (res?.status === 401) {
        // Session expired/invalid — send back to the login screen
        router.push("/spsadmn/")
        return
      }
      if (data?.user) {
        setCurrentRole(data.user.role)
        fetchUsers(data.user)
        if (data.user.role === "admin") fetchDbStatus()
      } else {
        setMeError(true)
        fetchUsers()
      }
    })
    fetchSettings()
  }, [router])

  const fetchDbStatus = async () => {
    try {
      const res = await fetch("/api/spsadmn/db")
      if (res.ok) setDbStatus(await res.json())
    } catch {}
  }

  const restoreDb = async () => {
    setDbRestoring(true)
    try {
      const res = await fetch("/api/spsadmn/db", { method: "POST" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(data.error || "Andmebaasi käivitamine ebaõnnestus")
        return
      }
      // Restore takes ~1–3 min — poll until the project is active AND the DB answers.
      const deadline = Date.now() + 5 * 60 * 1000
      for (;;) {
        await new Promise((r) => setTimeout(r, 5000))
        try {
          const s = await fetch("/api/spsadmn/db")
          const sd = await s.json()
          setDbStatus(sd)
          if (sd.dbOk && (!sd.projectStatus || sd.projectStatus.startsWith("ACTIVE"))) break
        } catch {}
        if (Date.now() > deadline) break
      }
      fetchSettings()
      fetchUsers()
    } finally {
      setDbRestoring(false)
    }
  }

  const saveSettings = async () => {
    setSettingsSaving(true)
    setSettingsMessage("")
    try {
      const settings: Record<string, string> = {
        email_recipients: emailRecipients,
        career_email_recipients: careerEmailRecipients,
      }
      for (const kind of ["contact", "career"] as const) {
        const ar = autoReplies[kind]
        settings[`autoreply_${kind}_enabled`] = ar.enabled ? "1" : "0"
        for (const locale of AUTOREPLY_LOCALES) {
          settings[`autoreply_${kind}_subject_${locale}`] = ar.subjects[locale]
          settings[`autoreply_${kind}_body_${locale}`] = ar.bodies[locale]
        }
      }
      const res = await fetch("/api/spsadmn/seaded", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
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

      {isAdmin && (
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
      )}
      {meError && (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-10 text-center mb-6">
          <p className="text-[15px] text-red-600">Kasutaja andmete laadimine ebaõnnestus. Värskenda lehte — kui viga püsib, logi välja ja sisse uuesti.</p>
        </div>
      )}
      {!meError && currentRole === null && (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-10 text-center mb-6">
          <p className="text-[15px] text-[#5a6474]">Laadin...</p>
        </div>
      )}
      {!meError && currentRole !== null && !isAdmin && (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-10 text-center mb-6">
          <p className="text-[15px] text-[#5a6474]">Süsteemi seadete muutmine on lubatud ainult peaadministraatorile.</p>
        </div>
      )}

      {isAdmin && activeTab === "general" && (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-6">
          <h2 className="text-[20px] font-bold text-[#17345a] mb-4">Andmebaas</h2>
          <div className="mb-8 border border-[rgba(23,52,90,0.12)] rounded-xl p-4 sm:p-5">
            {dbStatus === null ? (
              <p className="text-[15px] text-[#5a6474]">Laadin olekut...</p>
            ) : (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dbStatus.dbOk ? "bg-[#2d9e6b]" : "bg-[#d97706]"}`} />
                  <p className="text-[15px] text-[#17345a] font-medium">
                    {dbStatus.dbOk
                      ? "Andmebaas on aktiivne ja vastab päringutele"
                      : "Andmebaas ei vasta — tõenäoliselt on Supabase'i projekt pausil"}
                  </p>
                </div>
                {!dbStatus.dbOk && (
                  dbStatus.configured ? (
                    <button
                      onClick={restoreDb}
                      disabled={dbRestoring}
                      className="bg-[#17345a] text-white py-2.5 px-6 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-60"
                    >
                      {dbRestoring ? "Käivitan... (1–3 minutit)" : "Käivita andmebaas"}
                    </button>
                  ) : (
                    <p className="text-[15px] text-[#92400e]">
                      Automaatkäivitus pole seadistatud (Verceli env: SUPABASE_ACCESS_TOKEN, SUPABASE_PROJECT_REF). Alternatiiv: <code className="bg-[#f8fafc] px-1 rounded">npm run db:restore</code>
                    </p>
                  )
                )}
              </div>
            )}
          </div>

          <h2 className="text-[20px] font-bold text-[#17345a] mb-4">E-posti saajad</h2>

          {settingsLoading ? (
            <p className="text-[15px] text-[#5a6474]">Laadin...</p>
          ) : (
            <div>
              <div className="mb-5">
                <label htmlFor="settings-email-recipients" className="block text-[15px] font-medium text-[#17345a] mb-1">
                  Kontaktvormi päringud
                </label>
                <p className="text-[15px] text-[#5a6474] mb-2">
                  Siia saadetakse kõik kontaktvormi (hinnapäringu) päringud. Lisa mitu aadressi eraldatuna komaga (,).
                </p>
                <input
                  id="settings-email-recipients"
                  type="text"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  className="w-full px-4 py-3 border border-[rgba(23,52,90,0.12)] rounded-xl text-[15px] text-[#2d3748] outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder="info@spsgrupp.ee"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="settings-career-email-recipients" className="block text-[15px] font-medium text-[#17345a] mb-1">
                  Tööavaldused (&quot;Tule meile tööle&quot;)
                </label>
                <p className="text-[15px] text-[#5a6474] mb-2">
                  Siia saadetakse kõik tööavaldused. Lisa mitu aadressi eraldatuna komaga (,).
                </p>
                <input
                  id="settings-career-email-recipients"
                  type="text"
                  value={careerEmailRecipients}
                  onChange={(e) => setCareerEmailRecipients(e.target.value)}
                  className="w-full px-4 py-3 border border-[rgba(23,52,90,0.12)] rounded-xl text-[15px] text-[#2d3748] outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder="personal@spsgrupp.ee"
                />
              </div>

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

              <hr className="my-8 border-[rgba(23,52,90,0.08)]" />

              <h2 className="text-[20px] font-bold text-[#17345a] mb-2">Automaatvastused</h2>
              <p className="text-[15px] text-[#5a6474] mb-6">
                Vormi saatnud inimesele saadetakse automaatne kinnituskiri. Tühja välja korral kasutatakse vaiketeksti
                vastavas keeles. Võtme sõna <code className="bg-[#f8fafc] px-1 rounded">{"{name}"}</code> asendatakse saatja nimega.
                Samalt aadressilt saadetakse ühe vormi kohta kinnitus kuni korra 24 tunni jooksul.
              </p>

              {(["contact", "career"] as const).map((kind) => {
                const ar = autoReplies[kind]
                const locale = autoReplyTabs[kind]
                const title = kind === "contact" ? "Kontaktvorm (hinnapäring)" : "Tööavaldus (\"Tule meile tööle\")"
                return (
                  <div key={kind} className="border border-[rgba(23,52,90,0.12)] rounded-xl p-4 sm:p-5 mb-4">
                    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                      <h3 className="text-[16px] font-bold text-[#17345a]">{title}</h3>
                      <label className="flex items-center gap-2 text-[15px] font-medium text-[#17345a] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ar.enabled}
                          onChange={(e) =>
                            setAutoReplies((prev) => ({ ...prev, [kind]: { ...prev[kind], enabled: e.target.checked } }))
                          }
                          className="w-4 h-4 accent-[#17345a]"
                        />
                        Automaatvastus sees
                      </label>
                    </div>

                    <div className="flex gap-1 mb-3 bg-[#f8fafc] rounded-lg p-1 w-fit">
                      {AUTOREPLY_LOCALES.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setAutoReplyTabs((prev) => ({ ...prev, [kind]: l }))}
                          className={`px-3 py-1 rounded-md text-[15px] font-medium uppercase transition-colors ${
                            locale === l ? "bg-[#17345a] text-white" : "text-[#5a6474] hover:bg-white"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col gap-1 mb-3">
                      <label htmlFor={`autoreply-${kind}-subject`} className="text-[15px] font-medium text-[#17345a]">
                        Pealkiri ({locale.toUpperCase()})
                      </label>
                      <input
                        id={`autoreply-${kind}-subject`}
                        type="text"
                        value={ar.subjects[locale]}
                        onChange={(e) =>
                          setAutoReplies((prev) => ({
                            ...prev,
                            [kind]: { ...prev[kind], subjects: { ...prev[kind].subjects, [locale]: e.target.value } },
                          }))
                        }
                        disabled={!ar.enabled}
                        className="w-full px-4 py-3 border border-[rgba(23,52,90,0.12)] rounded-xl text-[15px] text-[#2d3748] outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)] disabled:bg-[#f8fafc] disabled:text-[#9aa5b1]"
                        placeholder="Vaiketekst"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor={`autoreply-${kind}-body`} className="text-[15px] font-medium text-[#17345a]">
                        Sisu ({locale.toUpperCase()})
                      </label>
                      <textarea
                        id={`autoreply-${kind}-body`}
                        rows={8}
                        value={ar.bodies[locale]}
                        onChange={(e) =>
                          setAutoReplies((prev) => ({
                            ...prev,
                            [kind]: { ...prev[kind], bodies: { ...prev[kind].bodies, [locale]: e.target.value } },
                          }))
                        }
                        disabled={!ar.enabled}
                        className="w-full px-4 py-3 border border-[rgba(23,52,90,0.12)] rounded-xl text-[15px] text-[#2d3748] outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)] resize-y disabled:bg-[#f8fafc] disabled:text-[#9aa5b1]"
                        placeholder="Vaiketekst"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {isAdmin && activeTab === "users" && (
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
