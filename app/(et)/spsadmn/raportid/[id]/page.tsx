"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import type { Insight, StoredReport } from "@/lib/reporting/types"
import { markdownToHtml } from "@/lib/reporting/email-html"

interface ReportSummary {
  id: number
  weekEnd: string
  stats: { gscClicksPerDay: number | null; sessions: number | null; adsCost: number | null; contacts: number | null }
}

const SEV_META: Record<Insight["severity"], { label: string; classes: string }> = {
  negative: { label: "Kriitiline", classes: "bg-red-100 text-red-700" },
  warning: { label: "Tähelepanu", classes: "bg-amber-100 text-amber-800" },
  opportunity: { label: "Võimalus", classes: "bg-blue-100 text-blue-700" },
  positive: { label: "Positiivne", classes: "bg-green-100 text-green-700" },
}

const AREA_LABELS: Record<Insight["area"], string> = {
  seo: "SEO / Search Console",
  ads: "Google Ads",
  ga4: "Liiklus (GA4)",
  forms: "Päringud",
  strategy: "Strateegia",
}

const AREA_ORDER: Insight["area"][] = ["seo", "ads", "ga4", "forms", "strategy"]

const r1 = (n: number) => Math.round(n * 10) / 10
const fmtPos = (p: number | null | undefined) => (p === null || p === undefined ? "–" : r1(p).toFixed(1).replace(".", ","))
const fmtMoney = (n: number) => `${n.toFixed(2).replace(".", ",")} €`
const fmtPct = (n: number | null) => (n === null ? "–" : `${Math.round(n * 100)} %`)

/** ▲ improved · ■ stable (±2) · ▼ dropped — the manual reports' convention. */
function posArrow(cur: number | null, prev: number | null): { symbol: string; classes: string } {
  if (cur === null || prev === null) return { symbol: "–", classes: "text-[#5a6474]" }
  const delta = prev - cur
  if (delta >= 2) return { symbol: "▲", classes: "text-green-600" }
  if (delta <= -2) return { symbol: "▼", classes: "text-red-600" }
  return { symbol: "■", classes: "text-[#5a6474]" }
}

function Delta({ cur, prev, invert = false, suffix = "%" }: { cur: number; prev: number; invert?: boolean; suffix?: string }) {
  if (prev === 0) return <span className="text-[#5a6474]">eelmine: 0</span>
  const pct = Math.round(((cur - prev) / prev) * 100)
  const good = invert ? pct < 0 : pct > 0
  const cls = pct === 0 ? "text-[#5a6474]" : good ? "text-green-600" : "text-red-600"
  const arrow = pct === 0 ? "■" : pct > 0 ? "▲" : "▼"
  return <span className={cls}>{arrow} {pct > 0 ? "+" : ""}{pct} {suffix} vs eelmine nädal</span>
}

function Card({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="bg-[#f8fafc] border border-[#e5eaf0] rounded-xl p-4">
      <div className="text-[13px] text-[#5a6474]">{label}</div>
      <div className="text-[24px] font-bold text-[#17345a] my-1">{value}</div>
      {children && <div className="text-[13px]">{children}</div>}
    </div>
  )
}

/** Tiny inline-SVG bar trend of the last N weekly values. */
function Trend({ label, values }: { label: string; values: (number | null)[] }) {
  const nums = values.filter((v): v is number => v !== null)
  if (nums.length < 2) return null
  const max = Math.max(...nums, 1)
  const w = 120
  const h = 36
  const bw = w / nums.length
  return (
    <div className="bg-[#f8fafc] border border-[#e5eaf0] rounded-xl p-4">
      <div className="text-[13px] text-[#5a6474] mb-1">{label}</div>
      <svg width={w} height={h} className="block" role="img" aria-label={label}>
        {nums.map((v, i) => {
          const bh = Math.max(2, (v / max) * (h - 4))
          return <rect key={i} x={i * bw + 1} y={h - bh} width={bw - 2} height={bh} rx={2} fill={i === nums.length - 1 ? "#17345a" : "#3abeff"} />
        })}
      </svg>
      <div className="text-[13px] text-[#17345a] font-medium mt-1">viimane: {r1(nums[nums.length - 1]).toString().replace(".", ",")}</div>
    </div>
  )
}

export default function ReportDetailPage() {
  const params = useParams()
  const id = Number(params?.id)
  const [report, setReport] = useState<StoredReport | null>(null)
  const [trend, setTrend] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!Number.isFinite(id)) return
    Promise.all([
      fetch(`/api/spsadmn/reports/${id}`).then((r) => r.json()),
      fetch("/api/spsadmn/reports").then((r) => r.json()),
    ])
      .then(([detail, list]) => {
        if (detail.report) setReport(detail.report)
        else setError(detail.error || "Raportit ei leitud")
        setTrend((list.reports ?? []).slice(0, 8).reverse())
      })
      .catch(() => setError("Raporti laadimine ebaõnnestus"))
      .finally(() => setLoading(false))
  }, [id])

  const narrativeHtml = useMemo(() => (report?.narrative ? markdownToHtml(report.narrative) : ""), [report])

  if (loading) return <p className="text-[15px] text-[#5a6474]">Laadin...</p>
  if (error || !report) return <p className="text-[15px] text-red-600">{error || "Raportit ei leitud"}</p>

  const s = report.snapshot
  const insightsByArea = new Map<Insight["area"], Insight[]>()
  for (const ins of report.insights) {
    insightsByArea.set(ins.area, [...(insightsByArea.get(ins.area) ?? []), ins])
  }

  const prevQueryMap = new Map((s.gsc?.prevQueries ?? []).map((q) => [q.query, q]))
  const families = (s.gsc?.families ?? []).filter((f) => f.current.impressions > 0 || f.previous.impressions > 0)

  return (
    <div className="max-w-[1100px]">
      <Link href="/spsadmn/raportid/" className="text-[15px] text-[#1d4ed8] hover:underline">← Kõik raportid</Link>

      <div className="flex items-start justify-between flex-wrap gap-3 mt-3 mb-6">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#17345a]">
            Nädalaraport {s.period.start.split("-").reverse().join(".")} – {s.period.end.split("-").reverse().join(".")}
          </h1>
          <p className="text-[15px] text-[#5a6474] mt-1">
            Võrdlusperiood {s.period.prevStart.split("-").reverse().join(".")} – {s.period.prevEnd.split("-").reverse().join(".")} ·
            genereeritud {new Date(report.createdAt).toLocaleString("et-EE")} ·{" "}
            {report.emailSentAt
              ? <span className="text-[#2d9e6b]">e-kiri saadetud {new Date(report.emailSentAt).toLocaleString("et-EE")}</span>
              : report.emailError
                ? <span className="text-red-600">e-kirja viga: {report.emailError}</span>
                : "e-kirja pole saadetud"}
          </p>
        </div>
      </div>

      {s.errors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <p className="text-[15px] text-amber-800 font-medium">Osad andmeallikad ebaõnnestusid:</p>
          <ul className="text-[14px] text-amber-800 list-disc pl-5 mt-1">
            {s.errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {s.gsc && (
          <>
            <Card label="GSC klikke/päevas" value={r1(s.gsc.current.clicks / s.gsc.current.days).toFixed(1).replace(".", ",")}>
              <Delta cur={s.gsc.current.clicks / s.gsc.current.days} prev={s.gsc.previous.clicks / s.gsc.previous.days} />
            </Card>
            <Card label="Näitamisi/päevas" value={String(Math.round(s.gsc.current.impressions / s.gsc.current.days))}>
              <Delta cur={s.gsc.current.impressions / s.gsc.current.days} prev={s.gsc.previous.impressions / s.gsc.previous.days} />
            </Card>
            <Card label="Keskmine positsioon" value={fmtPos(s.gsc.current.position)}>
              <Delta cur={s.gsc.current.position} prev={s.gsc.previous.position} invert suffix="%" />
            </Card>
            <Card label="CTR" value={`${(s.gsc.current.ctr * 100).toFixed(1).replace(".", ",")} %`}>
              <span className="text-[#5a6474]">eelmine: {(s.gsc.previous.ctr * 100).toFixed(1).replace(".", ",")} %</span>
            </Card>
          </>
        )}
        {s.ga4 && (
          <>
            <Card label="Sessioonid (GA4)" value={String(Math.round(s.ga4.current.sessions))}>
              <Delta cur={s.ga4.current.sessions} prev={s.ga4.previous.sessions} />
            </Card>
            <Card label="Kasutajad" value={String(Math.round(s.ga4.current.users))}>
              <Delta cur={s.ga4.current.users} prev={s.ga4.previous.users} />
            </Card>
            <Card label="Kaasatus" value={`${(s.ga4.current.engagementRate * 100).toFixed(1).replace(".", ",")} %`}>
              <span className="text-[#5a6474]">eelmine: {(s.ga4.previous.engagementRate * 100).toFixed(1).replace(".", ",")} %</span>
            </Card>
          </>
        )}
        {s.ads?.available && (
          <Card label="Ads kulu" value={fmtMoney(s.ads.totals.cost)}>
            <span className="text-[#5a6474]">{s.ads.totals.clicks} klikki · {s.ads.totals.conversions.toFixed(1).replace(".", ",")} konv</span>
          </Card>
        )}
        {s.forms && (
          <>
            <Card label="Kontaktpäringud" value={String(s.forms.current.contact)}>
              <Delta cur={s.forms.current.contact} prev={s.forms.previous.contact} suffix="" />
            </Card>
            <Card label="Tööavaldused" value={String(s.forms.current.career)}>
              <span className="text-[#5a6474]">spämm: {s.forms.current.spam} · gclid-päringuid: {s.forms.current.gclidLeads}</span>
            </Card>
          </>
        )}
      </div>

      {/* 8-week trends */}
      {trend.length > 1 && (
        <div className="bg-white rounded-2xl p-5 mb-6">
          <h2 className="text-[18px] font-bold text-[#17345a] mb-3">Trend (viimased {trend.length} nädalat)</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Trend label="GSC klikke/päevas" values={trend.map((t) => t.stats.gscClicksPerDay)} />
            <Trend label="Sessioonid" values={trend.map((t) => t.stats.sessions)} />
            <Trend label="Ads kulu €" values={trend.map((t) => t.stats.adsCost)} />
            <Trend label="Kontaktpäringud" values={trend.map((t) => t.stats.contacts)} />
          </div>
        </div>
      )}

      {/* LLM narrative */}
      {narrativeHtml && (
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-[18px] font-bold text-[#17345a] mb-2">Analüüs ja soovitused</h2>
          {/* LLM-generated Estonian narrative, sanitized via escapeHtml in markdownToHtml */}
          <div dangerouslySetInnerHTML={{ __html: narrativeHtml }} />
        </div>
      )}

      {/* Insights */}
      {report.insights.length > 0 && (
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-[18px] font-bold text-[#17345a] mb-4">Leiud ja järgmised sammud</h2>
          {AREA_ORDER.filter((a) => insightsByArea.has(a)).map((area) => (
            <div key={area} className="mb-5 last:mb-0">
              <h3 className="text-[16px] font-bold text-[#17345a] mb-2">{AREA_LABELS[area]}</h3>
              <div className="flex flex-col gap-2">
                {(insightsByArea.get(area) ?? []).map((ins, i) => (
                  <div key={i} className="border border-[#edf0f4] rounded-xl p-4">
                    <span className={`inline-block text-[12px] font-bold rounded-lg px-2 py-0.5 mb-1.5 ${SEV_META[ins.severity].classes}`}>
                      {SEV_META[ins.severity].label}
                    </span>
                    <div className="text-[15px] font-bold text-[#17345a]">{ins.title}</div>
                    <div className="text-[14px] text-[#4a5568] mt-1">{ins.detail}</div>
                    <div className="text-[14px] text-[#1d4ed8] mt-1.5"><strong>Järgmine samm:</strong> {ins.action}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Keyword families */}
      {families.length > 0 && (
        <div className="bg-white rounded-2xl p-6 mb-6 overflow-x-auto">
          <h2 className="text-[18px] font-bold text-[#17345a] mb-1">Märksõnade peatabel</h2>
          <p className="text-[13px] text-[#5a6474] mb-3">▲ tõus ≥2 kohta · ■ stabiilne · ▼ langus · positsioon = näitamistega kaalutud keskmine · &lt;10 näitamist = müra</p>
          <table className="w-full text-[14px] min-w-[560px]">
            <thead>
              <tr className="text-left text-[#5a6474] border-b border-[#edf0f4]">
                <th className="py-2 pr-3 font-medium">Märksõnapere</th>
                <th className="py-2 pr-3 font-medium text-right">Pos (7p)</th>
                <th className="py-2 pr-3 font-medium text-right">Eelmine</th>
                <th className="py-2 pr-3 font-medium text-center">Muutus</th>
                <th className="py-2 pr-3 font-medium text-right">Näitamised</th>
                <th className="py-2 font-medium text-right">Klikid</th>
              </tr>
            </thead>
            <tbody>
              {families.map((f) => {
                const arrow = posArrow(f.current.position, f.previous.position)
                const noise = f.current.impressions < 10 && f.previous.impressions < 10
                return (
                  <tr key={f.id} className="border-b border-[#f4f6f9] last:border-0">
                    <td className="py-2 pr-3 font-medium text-[#17345a]">{f.label}{noise && <span className="text-[#9aa5b1] font-normal"> (müra)</span>}</td>
                    <td className="py-2 pr-3 text-right">{fmtPos(f.current.position)}</td>
                    <td className="py-2 pr-3 text-right text-[#5a6474]">{fmtPos(f.previous.position)}</td>
                    <td className={`py-2 pr-3 text-center ${arrow.classes}`}>{arrow.symbol}</td>
                    <td className="py-2 pr-3 text-right">{f.current.impressions}</td>
                    <td className="py-2 text-right">{f.current.clicks}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Top queries */}
      {s.gsc && s.gsc.topQueries.length > 0 && (
        <div className="bg-white rounded-2xl p-6 mb-6 overflow-x-auto">
          <h2 className="text-[18px] font-bold text-[#17345a] mb-3">Top päringud (näitamiste järgi)</h2>
          <table className="w-full text-[14px] min-w-[620px]">
            <thead>
              <tr className="text-left text-[#5a6474] border-b border-[#edf0f4]">
                <th className="py-2 pr-3 font-medium">Päring</th>
                <th className="py-2 pr-3 font-medium text-right">Näitamised</th>
                <th className="py-2 pr-3 font-medium text-right">Klikid</th>
                <th className="py-2 pr-3 font-medium text-right">CTR</th>
                <th className="py-2 pr-3 font-medium text-right">Pos</th>
                <th className="py-2 font-medium text-right">Eelmine pos</th>
              </tr>
            </thead>
            <tbody>
              {s.gsc.topQueries.slice(0, 20).map((q) => {
                const prev = prevQueryMap.get(q.query)
                const arrow = posArrow(q.position, prev?.position ?? null)
                return (
                  <tr key={q.query} className="border-b border-[#f4f6f9] last:border-0">
                    <td className="py-2 pr-3 text-[#17345a]">{q.query}</td>
                    <td className="py-2 pr-3 text-right">{q.impressions}</td>
                    <td className="py-2 pr-3 text-right">{q.clicks}</td>
                    <td className="py-2 pr-3 text-right">{(q.ctr * 100).toFixed(1).replace(".", ",")} %</td>
                    <td className="py-2 pr-3 text-right">{fmtPos(q.position)} <span className={arrow.classes}>{arrow.symbol}</span></td>
                    <td className="py-2 text-right text-[#5a6474]">{prev ? fmtPos(prev.position) : "–"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* New queries */}
      {s.gsc && s.gsc.newQueries.length > 0 && (
        <div className="bg-white rounded-2xl p-6 mb-6 overflow-x-auto">
          <h2 className="text-[18px] font-bold text-[#17345a] mb-1">Uued päringud (võimalikud uued märksõnad)</h2>
          <p className="text-[13px] text-[#5a6474] mb-3">Ilmunud sel nädalal (eelmisel praktiliselt puudusid), brändipäringud välja arvatud.</p>
          <table className="w-full text-[14px] min-w-[480px]">
            <thead>
              <tr className="text-left text-[#5a6474] border-b border-[#edf0f4]">
                <th className="py-2 pr-3 font-medium">Päring</th>
                <th className="py-2 pr-3 font-medium text-right">Näitamised</th>
                <th className="py-2 font-medium text-right">Pos</th>
              </tr>
            </thead>
            <tbody>
              {s.gsc.newQueries.map((q) => (
                <tr key={q.query} className="border-b border-[#f4f6f9] last:border-0">
                  <td className="py-2 pr-3 text-[#17345a]">{q.query}</td>
                  <td className="py-2 pr-3 text-right">{q.impressions}</td>
                  <td className="py-2 text-right">{fmtPos(q.position)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ads campaigns */}
      {s.ads?.available && s.ads.campaigns.length > 0 && (
        <div className="bg-white rounded-2xl p-6 mb-6 overflow-x-auto">
          <h2 className="text-[18px] font-bold text-[#17345a] mb-3">Google Ads kampaaniad</h2>
          <table className="w-full text-[14px] min-w-[760px]">
            <thead>
              <tr className="text-left text-[#5a6474] border-b border-[#edf0f4]">
                <th className="py-2 pr-3 font-medium">Kampaania</th>
                <th className="py-2 pr-3 font-medium text-right">Kulu</th>
                <th className="py-2 pr-3 font-medium text-right">Klikid</th>
                <th className="py-2 pr-3 font-medium text-right">CPC</th>
                <th className="py-2 pr-3 font-medium text-right">Konv</th>
                <th className="py-2 pr-3 font-medium text-right">Näitam. osa</th>
                <th className="py-2 pr-3 font-medium text-right">Kaotatud (koht)</th>
                <th className="py-2 font-medium text-right">Kaotatud (eelarve)</th>
              </tr>
            </thead>
            <tbody>
              {s.ads.campaigns.map((c) => (
                <tr key={c.name} className="border-b border-[#f4f6f9] last:border-0">
                  <td className="py-2 pr-3 text-[#17345a] font-medium">{c.name}</td>
                  <td className="py-2 pr-3 text-right">{fmtMoney(c.cost)}</td>
                  <td className="py-2 pr-3 text-right">{c.clicks}</td>
                  <td className="py-2 pr-3 text-right">{fmtMoney(c.avgCpc)}</td>
                  <td className="py-2 pr-3 text-right">{c.allConversions.toFixed(1).replace(".", ",")}</td>
                  <td className="py-2 pr-3 text-right">{fmtPct(c.impressionShare)}</td>
                  <td className="py-2 pr-3 text-right">{fmtPct(c.rankLostIS)}</td>
                  <td className="py-2 text-right">{fmtPct(c.budgetLostIS)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[13px] text-[#5a6474] mt-3">
            Brändi päringud: {fmtMoney(s.ads.brand.cost)} / {s.ads.brand.clicks} klikki · mitte-brändi: {fmtMoney(s.ads.nonBrand.cost)} / {s.ads.nonBrand.clicks} klikki.
            „Kaotatud (koht)“ = konkurentsikaotus (ad rank), „kaotatud (eelarve)“ = eelarve piirang.
          </p>
        </div>
      )}

      {/* Forms */}
      {s.forms && (
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-[18px] font-bold text-[#17345a] mb-3">Päringud (andmebaas = tõde)</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <Card label="Kontaktpäringud" value={String(s.forms.current.contact)}>
              <span className="text-[#5a6474]">eelmine nädal: {s.forms.previous.contact}</span>
            </Card>
            <Card label="Tööavaldused" value={String(s.forms.current.career)}>
              <span className="text-[#5a6474]">eelmine nädal: {s.forms.previous.career}</span>
            </Card>
            <Card label="Spämm" value={String(s.forms.current.spam)}>
              <span className="text-[#5a6474]">eelmine nädal: {s.forms.previous.spam}</span>
            </Card>
            <Card label="Tasu / kasum (nädal)" value={`${fmtMoney(s.forms.current.feeTotal)} / ${fmtMoney(s.forms.current.profitTotal)}`}>
              <span className="text-[#5a6474]">gclid-päringuid: {s.forms.current.gclidLeads}</span>
            </Card>
          </div>
          {s.forms.topPages.length > 0 && (
            <>
              <h3 className="text-[15px] font-bold text-[#17345a] mb-2">Päringud lehe kaupa</h3>
              <table className="w-full text-[14px]">
                <tbody>
                  {s.forms.topPages.map((p) => (
                    <tr key={p.pageUrl} className="border-b border-[#f4f6f9] last:border-0">
                      <td className="py-1.5 pr-3 text-[#17345a] break-all">{p.pageUrl}</td>
                      <td className="py-1.5 text-right w-16">{p.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* GA4 channels + top pages */}
      {s.ga4 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-[18px] font-bold text-[#17345a] mb-3">Kanalid (GA4)</h2>
            <table className="w-full text-[14px]">
              <tbody>
                {s.ga4.channels.map((c) => (
                  <tr key={c.channel} className="border-b border-[#f4f6f9] last:border-0">
                    <td className="py-1.5 pr-3 text-[#17345a]">{c.channel}</td>
                    <td className="py-1.5 pr-3 text-right w-20">{Math.round(c.sessions)}</td>
                    <td className="py-1.5 text-right w-24 text-[#5a6474]">{Math.round(c.keyEvents)} key ev</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-[18px] font-bold text-[#17345a] mb-3">Top lehed (GA4)</h2>
            <table className="w-full text-[14px]">
              <tbody>
                {s.ga4.topPages.slice(0, 10).map((p) => (
                  <tr key={p.path} className="border-b border-[#f4f6f9] last:border-0">
                    <td className="py-1.5 pr-3 text-[#17345a] break-all">{p.path}</td>
                    <td className="py-1.5 text-right w-16">{Math.round(p.sessions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
