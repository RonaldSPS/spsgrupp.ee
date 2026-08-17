"use client"

import { useCallback, useEffect, useState } from "react"

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

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [drafts, setDrafts] = useState<Record<number, FinancialDraft>>({})
  const [saveStatus, setSaveStatus] = useState<Record<number, "saving" | "saved" | "error">>({})
  const [loading, setLoading] = useState(true)
  const [formFilter, setFormFilter] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [deleting, setDeleting] = useState(false)

  const queryString = useCallback(() => {
    const params = new URLSearchParams()
    if (formFilter === "spam") params.set("spam", "1")
    else if (formFilter) params.set("form", formFilter)
    if (fromDate) params.set("from", fromDate)
    if (toDate) params.set("to", toDate)
    const qs = params.toString()
    return qs ? `?${qs}` : ""
  }, [formFilter, fromDate, toDate])

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
  }, [queryString])

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
    "w-28 text-[15px] px-2 py-1.5 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] outline-none focus:border-[#5ab5da] text-right"

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

      <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-4 sm:p-5 mb-4 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-form" className="text-[15px] font-medium text-[#17345a]">Vorm</label>
          <select
            id="filter-form"
            value={formFilter}
            onChange={(e) => setFormFilter(e.target.value)}
            className="text-[15px] px-3 py-2 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] font-medium cursor-pointer hover:bg-[#f8fafc] transition-colors outline-none"
          >
            <option value="">Kõik</option>
            <option value="contact">Kontaktivorm</option>
            <option value="career">Tööavaldus</option>
            <option value="spam">Spämm</option>
          </select>
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
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] overflow-x-auto">
          <table className="w-full text-left text-[15px] min-w-[1560px]">
            <thead>
              <tr className="border-b border-[rgba(23,52,90,0.08)] text-[#5a6474]">
                <th className="px-4 py-3 font-medium w-10">
                  <input
                    type="checkbox"
                    aria-label="Vali kõik"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-[#17345a] cursor-pointer align-middle"
                  />
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Kuupäev</th>
                <th className="px-4 py-3 font-medium">Vorm</th>
                <th className="px-4 py-3 font-medium">Nimi</th>
                <th className="px-4 py-3 font-medium">E-post</th>
                <th className="px-4 py-3 font-medium">Telefon</th>
                <th className="px-4 py-3 font-medium">Ettevõte / piirkond</th>
                <th className="px-4 py-3 font-medium">Sõnum</th>
                <th className="px-4 py-3 font-medium">Keel</th>
                <th className="px-4 py-3 font-medium">Leht</th>
                <th className="px-4 py-3 font-medium text-right">Tasu</th>
                <th className="px-4 py-3 font-medium text-right">Kasum</th>
                <th className="px-4 py-3 font-medium">Märkused</th>
              </tr>
              <tr className="border-b border-[rgba(23,52,90,0.08)] bg-[#f8fafc] text-[#17345a]">
                <th colSpan={10} className="px-4 py-2 font-medium text-right whitespace-nowrap">
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
                    <td className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        aria-label={`Vali päring ${s.id}`}
                        checked={selected.has(s.id)}
                        onChange={() => toggleSelected(s.id)}
                        className="w-4 h-4 accent-[#17345a] cursor-pointer align-middle"
                      />
                    </td>
                    <td className="px-4 py-3 text-[#2d3748] whitespace-nowrap">{formatDateTime(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-[15px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                        s.form === "career" ? "bg-[#ecfdf5] text-[#2d9e6b]" : "bg-[#eef7fc] text-[#17345a]"
                      }`}>
                        {FORM_LABELS[s.form] ?? s.form}
                      </span>
                      {s.isSpam && (
                        <span className="inline-block text-[15px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-[#fef2f2] text-red-600 ml-1">
                          Spämm
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#17345a] font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-[#2d3748] break-all">{s.email}</td>
                    <td className="px-4 py-3 text-[#2d3748] whitespace-nowrap">{s.phone}</td>
                    <td className="px-4 py-3 text-[#2d3748]">
                      {s.company || s.region || "–"}
                      {(s.workload || s.workTime) && (
                        <span className="block text-[#5a6474]">
                          {[WORKLOAD_LABELS[s.workload] ?? s.workload, WORK_TIME_LABELS[s.workTime] ?? s.workTime]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#2d3748] max-w-[320px]">
                      <span className="block whitespace-pre-wrap break-words">
                        {s.message.length > 200 ? `${s.message.slice(0, 200)}…` : s.message || "–"}
                      </span>
                      {s.attachmentName && (
                        <span className="block text-[#5a6474] mt-1">Manus: {s.attachmentName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#5a6474] uppercase">{s.locale}</td>
                    <td className="px-4 py-3 text-[#2d3748] max-w-[220px]">
                      {s.pageUrl ? (
                        <a
                          href={s.pageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={s.pageUrl}
                          className="text-[#17345a] underline break-all hover:text-[#3abeff]"
                        >
                          {pageUrlLabel(s.pageUrl)}
                        </a>
                      ) : "–"}
                      {s.gclid && (
                        <span className="block text-[#5a6474] mt-1 break-all" title={s.gclid}>
                          GCLID: {s.gclid.length > 16 ? `${s.gclid.slice(0, 16)}…` : s.gclid}
                        </span>
                      )}
                    </td>
                    {isContact ? (
                      <>
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
                            className="w-56 text-[15px] px-2 py-1.5 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] outline-none focus:border-[#5ab5da] resize-y"
                          />
                          {status === "saving" && <span className="block text-[#5a6474] mt-1">Salvestan...</span>}
                          {status === "saved" && <span className="block text-[#2d9e6b] mt-1">Salvestatud</span>}
                          {status === "error" && <span className="block text-red-600 mt-1">Viga salvestamisel</span>}
                        </td>
                      </>
                    ) : (
                      <>
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
      )}
    </div>
  )
}
