"use client"

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react"

interface Submission {
  id: number
  form: string
  locale: string
  name: string
  email: string
  phone: string
  company: string
  message: string
  region: string
  workload: string
  workTime: string
  attachmentName: string
  fee: string
  profit: string
  notes: string
  isSpam: boolean
  pageUrl: string
  gclid: string
  source: string
  channel: string
  serviceKind: string
  salesStatus: string
  leadQuality: string
  createdAt: string
}

interface FinancialDraft {
  fee: string
  profit: string
  notes: string
}

const FORM_LABELS: Record<string, string> = {
  contact: "Kontaktivorm",
  career: "Tööavaldus",
}

/** Käsitsi lisatud päringu kanal (26.10.2026): telefonikõne või otse-e-kiri. */
const CHANNEL_LABELS: Record<string, string> = {
  phone: "Telefon",
  email: "E-post (otse)",
}

/** Teenuse liik (müügitoru analüüsiks). */
const SERVICE_KIND_LABELS: Record<string, string> = {
  "": "–",
  maintenance: "Hoolduskoristus",
  oneoff: "Ühekordne",
  other: "Muu",
}

/** Müügistaatus. */
const SALES_STATUS_LABELS: Record<string, string> = {
  "": "–",
  new: "Uus",
  contacted: "Kontaktitud",
  quoted: "Pakkumine",
  won: "Võidetud",
  lost: "Kadunud",
}

const SALES_STATUS_CLASSES: Record<string, string> = {
  "": "text-[#8a94a3]",
  new: "text-[#17345a]",
  contacted: "text-[#17345a]",
  quoted: "text-[#8a5a00]",
  won: "text-[#2d9e6b] font-bold",
  lost: "text-[#8a94a3]",
}

/** Päringu kvaliteet — admini hinnang (04.11.2026). */
const LEAD_QUALITY_LABELS: Record<string, string> = {
  "": "–",
  hot: "Kuum",
  warm: "Soe",
  cold: "Külm",
}

const LEAD_QUALITY_CLASSES: Record<string, string> = {
  "": "text-[#8a94a3]",
  hot: "text-[#dc2626] font-bold",
  warm: "text-[#8a5a00]",
  cold: "text-[#5a6474]",
}

const FORM_FILTER_OPTIONS = [
  { value: "", label: "Kõik" },
  { value: "contact", label: "Kontaktivorm" },
  { value: "career", label: "Tööavaldus" },
]

const WORKLOAD_LABELS: Record<string, string> = {
  full: "Täistööaeg",
  part: "Osaline tööaeg",
}

const WORK_TIME_LABELS: Record<string, string> = {
  day: "Päevane tööaeg",
  evening: "Õhtune tööaeg",
  night: "Öine tööaeg",
  any: "Kõik tööajad",
}

const AMOUNT_INPUT_RE = /^-?\d{1,10}([.,]\d{1,2})?$/

/**
 * User-resizable table columns: drag a header's right edge to change the width.
 * Widths persist in localStorage and are restored on the next visit.
 * TABLE_COLUMNS and DEFAULT_COL_WIDTHS are matched by index - keep them in sync.
 */
const COL_WIDTHS_KEY = "sps_paringud_col_widths"
const MIN_COL_WIDTH = 48
const MAX_COL_WIDTH = 900
const DEFAULT_COL_WIDTHS = [44, 150, 140, 150, 190, 130, 190, 300, 70, 220, 140, 130, 130, 110, 120, 120, 240]
const TABLE_COLUMNS: { label: string; headerClass?: string }[] = [
  { label: "" }, // valiku-checkbox
  { label: "Kuupäev", headerClass: "whitespace-nowrap" },
  { label: "Vorm" },
  { label: "Nimi" },
  { label: "E-post" },
  { label: "Telefon", headerClass: "whitespace-nowrap" },
  { label: "Ettevõte / piirkond" },
  { label: "Sõnum" },
  { label: "Keel" },
  { label: "Leht" },
  { label: "Allikas" },
  { label: "Teenus" },
  { label: "Staatus" },
  { label: "Kvaliteet" },
  { label: "Tasu", headerClass: "text-right" },
  { label: "Kasum", headerClass: "text-right" },
  { label: "Märkused" },
]

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatMoney(value: number): string {
  return `${value.toLocaleString("et-EE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

function parseDraftAmount(raw: string): number {
  const trimmed = raw.trim()
  if (!trimmed) return 0
  const n = Number(trimmed.replace(",", "."))
  return Number.isFinite(n) ? n : 0
}

/** Display label for a stored source-page URL: path + query for absolute URLs. */
function pageUrlLabel(url: string): string {
  try {
    const u = new URL(url)
    return u.pathname + u.search
  } catch {
    return url
  }
}

/**
 * Human-readable label for a classified lead-source code
 * (google_ads / utm:.. / organic:.. / referral:.. / direct; "" = unknown).
 * Conservative by design: unknown stays "Teadmata", never guessed as SEO.
 */
function sourceLabel(source: string): string {
  if (!source) return "Teadmata"
  if (source === "google_ads") return "Google Ads"
  if (source === "direct") return "Otsene (viitajata)"
  if (source === "referral") return "Viide"
  if (source === "utm") return "Kampaania"
  if (source.startsWith("organic:")) return `Otsing: ${source.slice("organic:".length)}`
  if (source.startsWith("referral:")) return `Viide: ${source.slice("referral:".length)}`
  if (source.startsWith("utm:")) return `Kampaania: ${source.slice("utm:".length)}`
  return "Teadmata"
}

/**
 * Long text collapsed to `limit` chars with a "Näita rohkem / Näita vähem"
 * toggle, so a single very long entry can't blow up the table row height.
 * When `href` is given the text renders as an external link (full URL in title).
 */
function ExpandableText({ text, limit, href }: { text: string; limit: number; href?: string }) {
  const [expanded, setExpanded] = useState(false)
  const collapsible = text.length > limit
  const shown = collapsible && !expanded ? `${text.slice(0, limit)}…` : text
  return (
    <>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={href}
          className="text-[#17345a] underline break-all hover:text-[#3abeff]"
        >
          {shown}
        </a>
      ) : (
        <span className="block whitespace-pre-wrap break-words">{shown}</span>
      )}
      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="block mt-0.5 text-[15px] font-medium text-[#3abeff] hover:text-[#17345a] cursor-pointer"
        >
          {expanded ? "Näita vähem" : "Näita rohkem"}
        </button>
      )}
    </>
  )
}

/**
 * Käsitsi lisatud telefoni-/otse-e-posti päring (26.10.2026 tegevuskava punkt 7).
 * Veebivorm ei kata neid kanaleid — ilma nende ridadeta pole kanali tasuvus
 * (võidetud lepingud ja nende väärtus) arvutatav.
 */
function ManualEntryForm({ onSaved, onCancel }: { onSaved: () => void; onCancel: () => void }) {
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [channel, setChannel] = useState("phone")
  const [source, setSource] = useState("")
  const [serviceKind, setServiceKind] = useState("")
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const inputClass =
    "w-full text-[15px] px-3 py-2 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] outline-none focus:border-[#5ab5da]"
  const labelClass = "block text-[15px] font-medium text-[#17345a] mb-1"

  const submit = async () => {
    setError("")
    if (!name.trim()) { setError("Nimi on kohustuslik."); return }
    if (!phone.trim() && !email.trim()) { setError("Sisesta vähemalt telefon või e-post."); return }
    setSaving(true)
    try {
      const res = await fetch("/api/spsadmn/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), company: company.trim(), phone: phone.trim(), email: email.trim(),
          channel, source, serviceKind, message: message.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : `HTTP ${res.status}`)
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Salvestamine ebaõnnestus.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#eef7fc] rounded-2xl border border-[rgba(23,52,90,0.12)] p-4 sm:p-5 mb-4">
      <h2 className="text-[17px] font-bold text-[#17345a] mb-1">Lisa telefoni- või e-posti päring käsitsi</h2>
      <p className="text-[15px] text-[#5a6474] mb-4">
        Kui hinnapäring saabub telefonil või otse e-postiga, logi see siia — siis saab kanali tasuvust
        (sh võidetud lepinguid) hiljem arvutada. E-kirju ei saadeta.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div>
          <label className={labelClass} htmlFor="me-name">Nimi *</label>
          <input id="me-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="me-company">Ettevõte</label>
          <input id="me-company" className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="me-phone">Telefon</label>
          <input id="me-phone" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="me-email">E-post</label>
          <input id="me-email" type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="me-channel">Kanal *</label>
          <select id="me-channel" className={inputClass} value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option value="phone">Telefon</option>
            <option value="email">E-post (otse)</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="me-source">Allikas</label>
          <select id="me-source" className={inputClass} value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">Teadmata</option>
            <option value="google_ads">Google Ads</option>
            <option value="organic:google">Otsing: google</option>
            <option value="organic:bing">Otsing: bing</option>
            <option value="referral">Viide</option>
            <option value="utm">Kampaania (utm)</option>
            <option value="direct">Otsene (viitajata)</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="me-kind">Teenuse liik</label>
          <select id="me-kind" className={inputClass} value={serviceKind} onChange={(e) => setServiceKind(e.target.value)}>
            {Object.entries(SERVICE_KIND_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label === "–" ? "Teadmata" : label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label className={labelClass} htmlFor="me-message">Sisu / märkus</label>
          <textarea id="me-message" rows={2} className={`${inputClass} resize-y`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mida küsiti (objekt, m², sagedus...)" />
        </div>
      </div>
      {error && <p className="text-[15px] text-red-600 mb-3" role="alert">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="bg-[#2d9e6b] text-white py-2.5 px-5 rounded-xl text-[15px] font-medium hover:bg-[#248a5c] transition-colors disabled:opacity-50"
        >
          {saving ? "Salvestan..." : "Salvesta päring"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="py-2.5 px-5 rounded-xl text-[15px] font-medium text-[#17345a] border border-[rgba(23,52,90,0.12)] hover:bg-white transition-colors"
        >
          Tühista
        </button>
      </div>
    </div>
  )
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [drafts, setDrafts] = useState<Record<number, FinancialDraft>>({})
  const [saveStatus, setSaveStatus] = useState<Record<number, "saving" | "saved" | "error">>({})
  const [loading, setLoading] = useState(true)
  const [formFilter, setFormFilter] = useState("")
  const [spamOnly, setSpamOnly] = useState(false)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [showAdd, setShowAdd] = useState(false)

  // User-resizable column widths (persisted in localStorage)
  const [colWidths, setColWidths] = useState<number[]>(DEFAULT_COL_WIDTHS)
  const colWidthsRef = useRef<number[]>(DEFAULT_COL_WIDTHS)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COL_WIDTHS_KEY)
      if (!raw) return
      const parsed: unknown = JSON.parse(raw)
      if (
        Array.isArray(parsed)
        && parsed.length === DEFAULT_COL_WIDTHS.length
        && parsed.every((n) => typeof n === "number" && Number.isFinite(n) && n >= MIN_COL_WIDTH && n <= MAX_COL_WIDTH)
      ) {
        colWidthsRef.current = parsed as number[]
        setColWidths(parsed as number[])
      }
    } catch {
      // corrupted storage - keep defaults
    }
  }, [])

  const persistColWidths = (widths: number[]) => {
    try { window.localStorage.setItem(COL_WIDTHS_KEY, JSON.stringify(widths)) } catch {}
  }

  const startColumnResize = (index: number, e: ReactMouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startWidth = colWidthsRef.current[index]
    const prevCursor = document.body.style.cursor
    document.body.style.cursor = "col-resize"
    const onMove = (ev: MouseEvent) => {
      const width = Math.min(MAX_COL_WIDTH, Math.max(MIN_COL_WIDTH, Math.round(startWidth + ev.clientX - startX)))
      setColWidths((prev) => {
        if (prev[index] === width) return prev
        const next = [...prev]
        next[index] = width
        colWidthsRef.current = next
        return next
      })
    }
    const onUp = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      document.body.style.cursor = prevCursor
      persistColWidths(colWidthsRef.current)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const resetColumnWidths = () => {
    colWidthsRef.current = DEFAULT_COL_WIDTHS
    setColWidths(DEFAULT_COL_WIDTHS)
    persistColWidths(DEFAULT_COL_WIDTHS)
  }

  const tableWidth = colWidths.reduce((sum, w) => sum + w, 0)

  // Synced always-visible horizontal scrollbar above the table - the native
  // one sits at the bottom of the table box and is easy to miss on tall tables.
  const topScrollRef = useRef<HTMLDivElement>(null)
  const tableScrollRef = useRef<HTMLDivElement>(null)
  const scrollSyncing = useRef(false)

  const syncScroll = (from: "top" | "table") => () => {
    if (scrollSyncing.current) return
    const top = topScrollRef.current
    const box = tableScrollRef.current
    if (!top || !box) return
    scrollSyncing.current = true
    if (from === "top") box.scrollLeft = top.scrollLeft
    else top.scrollLeft = box.scrollLeft
    scrollSyncing.current = false
  }

  const queryString = useCallback(() => {
    const params = new URLSearchParams()
    if (formFilter) params.set("form", formFilter)
    if (spamOnly) params.set("spam", "1")
    if (fromDate) params.set("from", fromDate)
    if (toDate) params.set("to", toDate)
    const qs = params.toString()
    return qs ? `?${qs}` : ""
  }, [formFilter, spamOnly, fromDate, toDate])

  useEffect(() => {
    fetch(`/api/spsadmn/submissions${queryString()}`)
      .then((r) => r.json())
      .then((data) => {
        const list: Submission[] = data.submissions || []
        setSubmissions(list)
        setDrafts(Object.fromEntries(list.map((s) => [s.id, { fee: s.fee, profit: s.profit, notes: s.notes }])))
        setSaveStatus({})
        setSelected(new Set())
      })
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false))
  }, [queryString, refreshKey])

  /** Teenuse liik / müügistaatus / kvaliteet — kohene salvestus rippmenüüst. */
  const saveSalesFields = async (id: number, fields: { serviceKind?: string; salesStatus?: string; leadQuality?: string }) => {
    const prev = submissions.find((r) => r.id === id)
    setSubmissions((rows) => rows.map((r) => (r.id === id ? { ...r, ...fields } : r)))
    setSaveStatus((p) => ({ ...p, [id]: "saving" }))
    try {
      const res = await fetch(`/api/spsadmn/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      })
      if (!res.ok) throw new Error(`PATCH failed: ${res.status}`)
      setSaveStatus((p) => ({ ...p, [id]: "saved" }))
      setTimeout(() => {
        setSaveStatus((p) => {
          if (p[id] !== "saved") return p
          const next = { ...p }
          delete next[id]
          return next
        })
      }, 2500)
    } catch {
      if (prev) setSubmissions((rows) => rows.map((r) => (r.id === id ? prev : r)))
      setSaveStatus((p) => ({ ...p, [id]: "error" }))
      alert("Salvestamine ebaõnnestus. Palun proovi uuesti.")
    }
  }

  const updateDraft = (id: number, field: keyof FinancialDraft, value: string) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  const saveFinancials = async (s: Submission) => {
    const draft = drafts[s.id]
    if (!draft) return

    const fee = draft.fee.trim()
    const profit = draft.profit.trim()
    if ((fee && !AMOUNT_INPUT_RE.test(fee)) || (profit && !AMOUNT_INPUT_RE.test(profit))) {
      setSaveStatus((prev) => ({ ...prev, [s.id]: "error" }))
      alert("Tasu ja Kasum peavad olema numbrid (nt 1200 või 1200,50).")
      return
    }

    const unchanged =
      fee === s.fee.trim() && profit === s.profit.trim() && draft.notes === s.notes
    if (unchanged) return

    setSaveStatus((prev) => ({ ...prev, [s.id]: "saving" }))
    try {
      const res = await fetch(`/api/spsadmn/submissions/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fee, profit, notes: draft.notes }),
      })
      if (!res.ok) throw new Error(`PATCH failed: ${res.status}`)
      const data = await res.json()
      const saved: FinancialDraft = {
        fee: typeof data.fee === "string" ? data.fee : fee,
        profit: typeof data.profit === "string" ? data.profit : profit,
        notes: typeof data.notes === "string" ? data.notes : draft.notes,
      }
      setSubmissions((prev) => prev.map((row) => (row.id === s.id ? { ...row, ...saved } : row)))
      setDrafts((prev) => ({ ...prev, [s.id]: saved }))
      setSaveStatus((prev) => ({ ...prev, [s.id]: "saved" }))
      setTimeout(() => {
        setSaveStatus((prev) => {
          if (prev[s.id] !== "saved") return prev
          const next = { ...prev }
          delete next[s.id]
          return next
        })
      }, 2500)
    } catch {
      setSaveStatus((prev) => ({ ...prev, [s.id]: "error" }))
      alert("Salvestamine ebaõnnestus. Palun proovi uuesti.")
    }
  }

  const toggleSelected = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allSelected = submissions.length > 0 && selected.size === submissions.length

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(submissions.map((s) => s.id)))
  }

  const deleteSelected = async () => {
    if (selected.size === 0 || deleting) return
    if (!window.confirm(`Kustuta ${selected.size} valitud päringut? Seda ei saa tagasi võtta.`)) return
    setDeleting(true)
    try {
      const res = await fetch("/api/spsadmn/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selected] }),
      })
      if (!res.ok) throw new Error(`DELETE failed: ${res.status}`)
      setSubmissions((prev) => prev.filter((s) => !selected.has(s.id)))
      setDrafts((prev) => {
        const next = { ...prev }
        for (const id of selected) delete next[id]
        return next
      })
      setSelected(new Set())
    } catch {
      alert("Kustutamine ebaõnnestus. Palun proovi uuesti.")
    } finally {
      setDeleting(false)
    }
  }

  const totalFee = submissions.reduce((sum, s) => sum + parseDraftAmount(drafts[s.id]?.fee ?? s.fee), 0)
  const totalProfit = submissions.reduce((sum, s) => sum + parseDraftAmount(drafts[s.id]?.profit ?? s.profit), 0)

  const amountInputClass =
    "w-full text-[15px] px-2 py-1.5 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] outline-none focus:border-[#5ab5da] text-right"

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[32px] font-bold text-[#17345a] mb-2">Päringud</h1>
          <p className="text-[15px] text-[#5a6474]">Kontaktivormi ja tööavalduste päringud</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-fit">
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            aria-expanded={showAdd}
            className="bg-[#17345a] text-white py-2.5 px-5 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Lisa telefoni/e-posti päring
          </button>
          <button
            type="button"
            onClick={deleteSelected}
            disabled={selected.size === 0 || deleting}
            className="bg-[#dc2626] text-white py-2.5 px-5 rounded-xl text-[15px] font-medium hover:bg-[#b91c1c] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#dc2626]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            {deleting ? "Kustutan..." : `Kustuta valitud${selected.size > 0 ? ` (${selected.size})` : ""}`}
          </button>
          <a
            href={`/api/spsadmn/submissions/export${queryString()}`}
            className="bg-[#2d9e6b] text-white py-2.5 px-5 rounded-xl text-[15px] font-medium hover:bg-[#248a5c] transition-colors flex items-center gap-2 no-underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Ekspordi CSV
          </a>
        </div>
      </div>

      {showAdd && (
        <ManualEntryForm
          onSaved={() => {
            setShowAdd(false)
            setRefreshKey((k) => k + 1)
          }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-4 sm:p-5 mb-4 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-medium text-[#17345a]">Vorm</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Vormi filter">
            {FORM_FILTER_OPTIONS.map((o) => (
              <button
                key={o.value || "all"}
                type="button"
                onClick={() => setFormFilter(o.value)}
                aria-pressed={formFilter === o.value}
                className={`text-[15px] px-3 py-2 rounded-lg font-medium cursor-pointer transition-colors border outline-none ${
                  formFilter === o.value
                    ? "bg-[#17345a] text-white border-[#17345a]"
                    : "bg-white text-[#17345a] border-[rgba(23,52,90,0.12)] hover:bg-[#f8fafc]"
                }`}
              >
                {o.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSpamOnly((v) => !v)}
              aria-pressed={spamOnly}
              className={`text-[15px] px-3 py-2 rounded-lg font-medium cursor-pointer transition-colors border outline-none ${
                spamOnly
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-red-600 border-[rgba(220,38,38,0.3)] hover:bg-[#fef2f2]"
              }`}
            >
              Spämm
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-from" className="text-[15px] font-medium text-[#17345a]">Kuupäev alates</label>
          <input
            id="filter-from"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="text-[15px] px-3 py-2 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] outline-none focus:border-[#5ab5da]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-to" className="text-[15px] font-medium text-[#17345a]">Kuupäev kuni</label>
          <input
            id="filter-to"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="text-[15px] px-3 py-2 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] outline-none focus:border-[#5ab5da]"
          />
        </div>
        <div className="sm:ml-auto text-[15px] text-[#5a6474] sm:text-right">
          <span className="block">Tasu kokku: <span className="font-bold text-[#17345a]">{formatMoney(totalFee)}</span></span>
          <span className="block">Kasum kokku: <span className="font-bold text-[#17345a]">{formatMoney(totalProfit)}</span></span>
        </div>
      </div>

      {loading ? (
        <p className="text-[15px] text-[#5a6474]">Laadin...</p>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-10 text-center">
          <p className="text-[15px] text-[#5a6474]">Päringuid ei leitud.</p>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={resetColumnWidths}
              className="text-[15px] text-[#5a6474] hover:text-[#17345a] underline underline-offset-2 cursor-pointer"
            >
              Lähtesta veerulaiused
            </button>
          </div>
          {/* Synced top scrollbar: the table box's own horizontal scrollbar is at
              the bottom of a tall box and easy to miss - this one is always in view. */}
          <div
            ref={topScrollRef}
            onScroll={syncScroll("top")}
            aria-hidden="true"
            className="admin-table-scroll overflow-x-auto overflow-y-hidden mb-1.5 h-3.5 rounded-lg"
          >
            <div style={{ width: tableWidth, height: 1 }} />
          </div>
          {/* Tall table: cap the box height so the horizontal scrollbar is always
              visible without scrolling the page to the bottom of all rows;
              vertical scrolling happens inside the box with a sticky header. */}
          <div
            ref={tableScrollRef}
            onScroll={syncScroll("table")}
            className="admin-table-scroll bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] overflow-auto max-h-[75vh]"
          >
            <table className="table-fixed text-left text-[15px]" style={{ width: tableWidth }}>
              <colgroup>
                {colWidths.map((w, i) => (
                  <col key={i} style={{ width: w }} />
                ))}
              </colgroup>
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-[rgba(23,52,90,0.08)] text-[#5a6474]">
                  {TABLE_COLUMNS.map((col, i) => (
                    <th key={col.label || "valik"} className={`relative bg-white px-4 py-3 font-medium ${col.headerClass ?? ""}`}>
                      {i === 0 ? (
                        <input
                          type="checkbox"
                          aria-label="Vali kõik"
                          checked={allSelected}
                          onChange={toggleAll}
                          className="w-4 h-4 accent-[#17345a] cursor-pointer align-middle"
                        />
                      ) : (
                        col.label
                      )}
                      <span
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Muuda veeru "${col.label || "valik"}" laiust`}
                        title="Lohista veeru laiuse muutmiseks"
                        onMouseDown={(e) => startColumnResize(i, e)}
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize select-none hover:bg-[#5ab5da]/40 active:bg-[#5ab5da]/60"
                      />
                    </th>
                  ))}
                </tr>
              <tr className="border-b border-[rgba(23,52,90,0.08)] bg-[#f8fafc] text-[#17345a]">
                <th colSpan={14} className="px-4 py-2 font-medium text-right whitespace-nowrap">
                  Kokku valitud perioodil ({submissions.length} päringut):
                </th>
                <th className="px-4 py-2 font-bold text-right whitespace-nowrap">{formatMoney(totalFee)}</th>
                <th className="px-4 py-2 font-bold text-right whitespace-nowrap">{formatMoney(totalProfit)}</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(23,52,90,0.06)]">
              {submissions.map((s) => {
                const draft = drafts[s.id] ?? { fee: s.fee, profit: s.profit, notes: s.notes }
                const status = saveStatus[s.id]
                const isContact = s.form === "contact"
                return (
                  <tr key={s.id} className={`transition-colors align-top ${selected.has(s.id) ? "bg-[#eef7fc]" : "hover:bg-[#f8fafc]"}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Vali päring ${s.id}`}
                        checked={selected.has(s.id)}
                        onChange={() => toggleSelected(s.id)}
                        className="w-4 h-4 accent-[#17345a] cursor-pointer align-middle"
                      />
                    </td>
                    <td className="px-4 py-3 text-[#2d3748] whitespace-nowrap overflow-hidden">{formatDateTime(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-[15px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                        s.channel === "phone" || s.channel === "email"
                          ? "bg-[#fff7ed] text-[#8a5a00]"
                          : s.form === "career"
                            ? "bg-[#ecfdf5] text-[#2d9e6b]"
                            : "bg-[#eef7fc] text-[#17345a]"
                      }`}>
                        {CHANNEL_LABELS[s.channel] ?? FORM_LABELS[s.form] ?? s.form}
                      </span>
                      {s.isSpam && (
                        <span className="inline-block text-[15px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-[#fef2f2] text-red-600 ml-1">
                          Spämm
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#17345a] font-medium break-words">{s.name}</td>
                    <td className="px-4 py-3 text-[#2d3748] break-all">{s.email}</td>
                    <td className="px-4 py-3 text-[#2d3748] whitespace-nowrap overflow-hidden">{s.phone}</td>
                    <td className="px-4 py-3 text-[#2d3748] break-words">
                      {s.company || s.region || "–"}
                      {(s.workload || s.workTime) && (
                        <span className="block text-[#5a6474]">
                          {[WORKLOAD_LABELS[s.workload] ?? s.workload, WORK_TIME_LABELS[s.workTime] ?? s.workTime]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#2d3748] break-words">
                      {s.message ? <ExpandableText text={s.message} limit={200} /> : "–"}
                      {s.attachmentName && (
                        <span className="block text-[#5a6474] mt-1">Manus: {s.attachmentName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#5a6474] uppercase">{s.locale}</td>
                    <td className="px-4 py-3 text-[#2d3748] break-words">
                      {s.pageUrl ? (
                        <ExpandableText text={pageUrlLabel(s.pageUrl)} limit={60} href={s.pageUrl} />
                      ) : "–"}
                      {s.gclid && (
                        <span className="block text-[#5a6474] mt-1 break-all" title={s.gclid}>
                          GCLID: {s.gclid.length > 16 ? `${s.gclid.slice(0, 16)}…` : s.gclid}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 break-words">
                      <span className={s.source ? "text-[#17345a] font-medium" : "text-[#8a94a3]"}>
                        {sourceLabel(s.source)}
                      </span>
                    </td>
                    {isContact ? (
                      <>
                        <td className="px-4 py-3">
                          <select
                            aria-label="Teenuse liik"
                            value={s.serviceKind}
                            onChange={(e) => saveSalesFields(s.id, { serviceKind: e.target.value })}
                            className="w-full text-[15px] px-2 py-1.5 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] outline-none focus:border-[#5ab5da] cursor-pointer"
                          >
                            {Object.entries(SERVICE_KIND_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            aria-label="Müügistaatus"
                            value={s.salesStatus}
                            onChange={(e) => saveSalesFields(s.id, { salesStatus: e.target.value })}
                            className={`w-full text-[15px] px-2 py-1.5 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] outline-none focus:border-[#5ab5da] cursor-pointer ${SALES_STATUS_CLASSES[s.salesStatus] ?? ""}`}
                          >
                            {Object.entries(SALES_STATUS_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            aria-label="Päringu kvaliteet"
                            value={s.leadQuality}
                            onChange={(e) => saveSalesFields(s.id, { leadQuality: e.target.value })}
                            className={`w-full text-[15px] px-2 py-1.5 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] outline-none focus:border-[#5ab5da] cursor-pointer ${LEAD_QUALITY_CLASSES[s.leadQuality] ?? ""}`}
                          >
                            {Object.entries(LEAD_QUALITY_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            inputMode="decimal"
                            aria-label="Tasu"
                            value={draft.fee}
                            onChange={(e) => updateDraft(s.id, "fee", e.target.value)}
                            onBlur={() => saveFinancials(s)}
                            placeholder="0,00"
                            className={amountInputClass}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            inputMode="decimal"
                            aria-label="Kasum"
                            value={draft.profit}
                            onChange={(e) => updateDraft(s.id, "profit", e.target.value)}
                            onBlur={() => saveFinancials(s)}
                            placeholder="0,00"
                            className={amountInputClass}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            aria-label="Märkused"
                            value={draft.notes}
                            onChange={(e) => updateDraft(s.id, "notes", e.target.value)}
                            onBlur={() => saveFinancials(s)}
                            rows={2}
                            placeholder="Lisa märkus..."
                            className="w-full text-[15px] px-2 py-1.5 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] outline-none focus:border-[#5ab5da] resize-y"
                          />
                          {status === "saving" && <span className="block text-[#5a6474] mt-1">Salvestan...</span>}
                          {status === "saved" && <span className="block text-[#2d9e6b] mt-1">Salvestatud</span>}
                          {status === "error" && <span className="block text-red-600 mt-1">Viga salvestamisel</span>}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-[#5a6474]">–</td>
                        <td className="px-4 py-3 text-[#5a6474]">–</td>
                        <td className="px-4 py-3 text-[#5a6474]">–</td>
                        <td className="px-4 py-3 text-[#5a6474] text-right">–</td>
                        <td className="px-4 py-3 text-[#5a6474] text-right">–</td>
                        <td className="px-4 py-3 text-[#5a6474]">–</td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}
