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
  createdAt: string
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

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [formFilter, setFormFilter] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const queryString = useCallback(() => {
    const params = new URLSearchParams()
    if (formFilter) params.set("form", formFilter)
    if (fromDate) params.set("from", fromDate)
    if (toDate) params.set("to", toDate)
    const qs = params.toString()
    return qs ? `?${qs}` : ""
  }, [formFilter, fromDate, toDate])

  useEffect(() => {
    fetch(`/api/spsadmn/submissions${queryString()}`)
      .then((r) => r.json())
      .then((data) => setSubmissions(data.submissions || []))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false))
  }, [queryString])

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[32px] font-bold text-[#17345a] mb-2">Päringud</h1>
          <p className="text-[15px] text-[#5a6474]">Kontaktivormi ja tööavalduste päringud</p>
        </div>
        <a
          href={`/api/spsadmn/submissions/export${queryString()}`}
          className="bg-[#2d9e6b] text-white py-2.5 px-5 rounded-xl text-[15px] font-medium hover:bg-[#248a5c] transition-colors flex items-center gap-2 shrink-0 w-fit no-underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Ekspordi CSV
        </a>
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
      </div>

      {loading ? (
        <p className="text-[15px] text-[#5a6474]">Laadin...</p>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-10 text-center">
          <p className="text-[15px] text-[#5a6474]">Päringuid ei leitud.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] overflow-x-auto">
          <table className="w-full text-left text-[15px] min-w-[900px]">
            <thead>
              <tr className="border-b border-[rgba(23,52,90,0.08)] text-[#5a6474]">
                <th className="px-4 py-3 font-medium whitespace-nowrap">Kuupäev</th>
                <th className="px-4 py-3 font-medium">Vorm</th>
                <th className="px-4 py-3 font-medium">Nimi</th>
                <th className="px-4 py-3 font-medium">E-post</th>
                <th className="px-4 py-3 font-medium">Telefon</th>
                <th className="px-4 py-3 font-medium">Ettevõte / piirkond</th>
                <th className="px-4 py-3 font-medium">Sõnum</th>
                <th className="px-4 py-3 font-medium">Keel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(23,52,90,0.06)]">
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-[#f8fafc] transition-colors align-top">
                  <td className="px-4 py-3 text-[#2d3748] whitespace-nowrap">{formatDateTime(s.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[15px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                      s.form === "career" ? "bg-[#ecfdf5] text-[#2d9e6b]" : "bg-[#eef7fc] text-[#17345a]"
                    }`}>
                      {FORM_LABELS[s.form] ?? s.form}
                    </span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
