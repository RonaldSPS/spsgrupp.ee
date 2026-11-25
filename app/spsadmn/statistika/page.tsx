"use client"

import { useCallback, useEffect, useState } from "react"

interface StatsResponse {
  summary: {
    pageViews: number
    uniqueVisitors: number
    pagesPerVisitor: number
    bounceRate: number
    avgSessionSeconds: number
  }
  topPages: Array<{ path: string; views: number }>
  topReferrers: Array<{ source: string; views: number }>
  topCountries: Array<{ country: string; views: number }>
  topCities: Array<{ city: string; views: number }>
  devices: Array<{ deviceType: string; views: number }>
  browsers: Array<{ browser: string; views: number }>
  osList: Array<{ os: string; views: number }>
  utmSources: Array<{ source: string; views: number }>
  daily: Array<{ date: string; views: number; visitors: number }>
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function formatNumber(n: number): string {
  return n.toLocaleString("et-EE")
}

function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m} min ${s} s`
}

export default function StatistikaPage() {
  const [from, setFrom] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 29)
    return formatDate(d)
  })
  const [to, setTo] = useState(() => formatDate(new Date()))
  const [data, setData] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/spsadmn/statistika?from=${from}&to=${to}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Viga andmete laadimisel")
    } finally {
      setLoading(false)
    }
  }, [from, to])

  useEffect(() => {
    load()
  }, [load])

  const setPreset = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - (days - 1))
    setFrom(formatDate(start))
    setTo(formatDate(end))
  }

  const maxDailyViews = data ? Math.max(...data.daily.map((d) => d.views), 1) : 1

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#17345a]">Külastusstatistika</h1>
          <p className="text-[15px] text-[#5a6474] mt-1">
            Privaatsussõbralik küpsisevaba analüütika. IP-aadresse ega püsivaid kasutajatunnuseid ei salvestata.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setPreset(days)}
              className="px-3 py-2 rounded-lg text-[15px] font-medium bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] hover:bg-[#f0f2f5] transition-colors"
            >
              {days} päeva
            </button>
          ))}
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748]"
          />
          <span className="text-[#5a6474]">–</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 border border-[rgba(23,52,90,0.12)] rounded-lg text-[15px] text-[#2d3748]"
          />
          <button
            onClick={load}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-[15px] font-medium text-white bg-[#17345a] hover:bg-[#1e4a7a] transition-colors disabled:opacity-50"
          >
            {loading ? "Laadin..." : "Uuenda"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-[15px]">
          {error}
        </div>
      )}

      {data && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <SummaryCard label="Lehevaated" value={formatNumber(data.summary.pageViews)} />
            <SummaryCard label="Unikaalsed külastajad" value={formatNumber(data.summary.uniqueVisitors)} />
            <SummaryCard label="Lehti külastuse kohta" value={data.summary.pagesPerVisitor.toFixed(2)} />
            <SummaryCard label="Põrkemäär" value={formatPercent(data.summary.bounceRate)} />
            <SummaryCard label="Keskmine külastuse kestus" value={formatDuration(data.summary.avgSessionSeconds)} />
          </div>

          {/* Daily chart */}
          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5 mb-8">
            <h2 className="text-[18px] font-bold text-[#17345a] mb-4">Päevane aktiivsus</h2>
            <div className="flex items-end gap-1 h-[180px] overflow-x-auto pb-2">
              {data.daily.map((day) => (
                <div key={day.date} className="flex flex-col items-center min-w-[40px] flex-1">
                  <div className="text-[12px] text-[#5a6474] mb-1">{day.views}</div>
                  <div
                    className="w-full max-w-[32px] bg-[#17345a] rounded-t-md transition-all"
                    style={{ height: `${(day.views / maxDailyViews) * 140}px`, minHeight: day.views > 0 ? "4px" : "0" }}
                    title={`${day.date}: ${day.views} lehevaadet, ${day.visitors} külastajat`}
                  />
                  <div className="text-[11px] text-[#8a94a3] mt-1 rotate-45 origin-left whitespace-nowrap">
                    {day.date.slice(5)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <StatsTable title="Top lehed" rows={data.topPages.map((p) => ({ label: p.path, value: p.views }))} />
            <StatsTable title="Top viitajad" rows={data.topReferrers.map((r) => ({ label: r.source, value: r.views }))} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <StatsTable title="Top riigid" rows={data.topCountries.map((c) => ({ label: c.country, value: c.views }))} />
            <StatsTable title="Top linnad" rows={data.topCities.map((c) => ({ label: c.city, value: c.views }))} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatsTable title="Seadmed" rows={data.devices.map((d) => ({ label: d.deviceType, value: d.views }))} />
            <StatsTable title="Brauserid" rows={data.browsers.map((b) => ({ label: b.browser, value: b.views }))} />
            <StatsTable title="Operatsioonisüsteemid" rows={data.osList.map((o) => ({ label: o.os, value: o.views }))} />
          </div>

          {data.utmSources.length > 0 && (
            <div className="mb-8">
              <StatsTable title="UTM-allikad" rows={data.utmSources.map((u) => ({ label: u.source, value: u.views }))} />
            </div>
          )}
        </>
      )}

      {!data && !loading && !error && (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-10 text-center text-[#5a6474]">
          Vali periood ja vajuta &quot;Uuenda&quot;.
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5">
      <div className="text-[14px] text-[#5a6474] mb-1">{label}</div>
      <div className="text-[28px] font-bold text-[#17345a]">{value}</div>
    </div>
  )
}

function StatsTable({ title, rows }: { title: string; rows: Array<{ label: string; value: number }> }) {
  const total = rows.reduce((sum, r) => sum + r.value, 0)
  return (
    <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5">
      <h2 className="text-[18px] font-bold text-[#17345a] mb-4">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-[15px] text-[#8a94a3]">Andmeid pole.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[15px] text-[#2d3748] truncate" title={row.label}>
                  {row.label}
                </div>
                <div className="w-full bg-[#eceef1] rounded-full h-1.5 mt-1">
                  <div
                    className="bg-[#17345a] h-1.5 rounded-full"
                    style={{ width: `${total > 0 ? (row.value / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="text-[15px] font-medium text-[#17345a] shrink-0">{formatNumber(row.value)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
