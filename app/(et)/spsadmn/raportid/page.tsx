"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface ReportSummary {
  id: number
  weekStart: string
  weekEnd: string
  createdAt: string
  emailSentAt: string | null
  emailError: string
  hasNarrative: boolean
  insightsCount: number
  stats: {
    gscClicksPerDay: number | null
    gscImpressionsPerDay: number | null
    sessions: number | null
    adsCost: number | null
    contacts: number | null
    career: number | null
  }
}

const fmtDate = (iso: string) => iso.split("-").reverse().join(".")
const fmtNum = (n: number | null) => (n === null ? "–" : String(n).replace(".", ","))

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [message, setMessage] = useState("")

  const fetchReports = () => {
    fetch("/api/spsadmn/reports")
      .then((r) => r.json())
      .then((data) => setReports(data.reports ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const generate = async () => {
    setGenerating(true)
    setMessage("")
    try {
      const res = await fetch("/api/spsadmn/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendEmail: false }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setMessage("Raport genereeritud.")
        fetchReports()
      } else {
        setMessage(`Viga: ${data.error || "genereerimine ebaõnnestus"}`)
      }
    } catch {
      setMessage("Viga: genereerimine ebaõnnestus")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#17345a]">Raportid</h1>
          <p className="text-[15px] text-[#5a6474] mt-1">
            Iganädalane turundusraport (GSC + GA4 + Ads + päringud). Automaatselt igal reedel kell 09:00, saadetakse e-postiga.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={generating}
          className="bg-[#17345a] text-white py-2.5 px-6 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-60"
        >
          {generating ? "Genereerin… (1–3 min)" : "Genereeri raport kohe"}
        </button>
      </div>

      {message && (
        <p className={`text-[15px] mb-4 ${message.startsWith("Viga") ? "text-red-600" : "text-[#2d9e6b]"}`}>{message}</p>
      )}

      {loading ? (
        <p className="text-[15px] text-[#5a6474]">Laadin...</p>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-[15px] text-[#5a6474]">
            Raporteid pole veel. Klõpsa „Genereeri raport kohe“ või oota esimest reedest automaatkäivitust.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => (
            <Link
              key={r.id}
              href={`/spsadmn/raportid/${r.id}/`}
              className="bg-white rounded-2xl p-5 hover:shadow-md transition-shadow border border-transparent hover:border-[#3abeff]"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-[17px] font-bold text-[#17345a]">
                    {fmtDate(r.weekStart)} – {fmtDate(r.weekEnd)}
                  </div>
                  <div className="text-[13px] text-[#5a6474] mt-0.5">
                    Genereeritud {new Date(r.createdAt).toLocaleString("et-EE")}
                    {r.hasNarrative ? " · AI-analüüs" : " · reeglipõhine"}
                    {" · "}
                    {r.emailSentAt ? (
                      <span className="text-[#2d9e6b]">e-kiri saadetud</span>
                    ) : r.emailError ? (
                      <span className="text-red-600">e-kirja viga: {r.emailError}</span>
                    ) : (
                      "e-kirja pole saadetud"
                    )}
                  </div>
                </div>
                <div className="flex gap-5 text-[15px] text-[#2d3748]">
                  <div className="text-center">
                    <div className="font-bold text-[#17345a]">{fmtNum(r.stats.gscClicksPerDay)}</div>
                    <div className="text-[12px] text-[#5a6474]">klikki/päev</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-[#17345a]">{fmtNum(r.stats.sessions)}</div>
                    <div className="text-[12px] text-[#5a6474]">sessiooni</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-[#17345a]">{r.stats.adsCost === null ? "–" : `${fmtNum(r.stats.adsCost)} €`}</div>
                    <div className="text-[12px] text-[#5a6474]">Ads kulu</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-[#17345a]">{fmtNum(r.stats.contacts)}</div>
                    <div className="text-[12px] text-[#5a6474]">päringut</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-[#17345a]">{r.insightsCount}</div>
                    <div className="text-[12px] text-[#5a6474]">leidu</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
