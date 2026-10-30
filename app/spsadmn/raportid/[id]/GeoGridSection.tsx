"use client"

import { useEffect, useRef, useState } from "react"
import "leaflet/dist/leaflet.css"
import type { GeoGridData, GeoGridKeywordRun } from "@/lib/reporting/types"

const fmtRank = (n: number) => n.toFixed(1).replace(".", ",")

/** Kohaliku nähtavuse värvid — sama konventsioon nagu LocalFalconi heatmap'il. */
function pointColor(rank: number | null): string {
  if (rank === null) return "#d64545"
  if (rank <= 3) return "#2d9e6b"
  if (rank <= 10) return "#a3c14a"
  return "#f5a623"
}

function rankLabel(rank: number | null): string {
  return rank === null ? "20+" : String(rank)
}

function DeltaNote({ value, invert }: { value?: number; invert?: boolean }) {
  if (value === undefined) return null
  const good = invert ? value < 0 : value > 0
  const cls = value === 0 ? "text-[#5a6474]" : good ? "text-green-600" : "text-red-600"
  const sign = value > 0 ? "+" : ""
  return <span className={`text-[12px] ${cls}`}> ({sign}{fmtRank(value)} vs eelm.)</span>
}

function LeafletMap({ run }: { run: GeoGridKeywordRun }) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let map: import("leaflet").Map | null = null
    ;(async () => {
      const L = await import("leaflet")
      if (cancelled || !divRef.current) return
      map = L.map(divRef.current, { scrollWheelZoom: true }).setView([59.427, 24.74], 11)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map)
      for (const p of run.points) {
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: 15,
          color: "#ffffff",
          weight: 2,
          fillColor: pointColor(p.rank),
          fillOpacity: 0.95,
        })
        marker.bindPopup(`${p.label}: ${p.rank === null ? "pole top-20" : `${p.rank}. koht`}`)
        marker.bindTooltip(rankLabel(p.rank), {
          permanent: true,
          direction: "center",
          className: "geo-pin-label",
          interactive: false,
        })
        marker.addTo(map)
      }
    })()
    return () => {
      cancelled = true
      map?.remove()
    }
  }, [run])

  return <div ref={divRef} className="w-full h-[420px] rounded-xl border border-[#e5eaf0] z-0" />
}

/**
 * Kaardi nähtavus (geo-grid): heatmap märksõna Maps-positsioonist fikseeritud
 * mõõtepunktides. Märksõna saab valida raporti mõõdetud nimekirjast VÕI mõõta
 * vabasõnalise märksõna kohe (POST /api/spsadmn/geogrid) — ka siis, kui raport
 * on vanast formaadist ilma geo-andmeteta.
 */
export default function GeoGridSection({ geogrid }: { geogrid?: GeoGridData }) {
  const runs = geogrid?.keywords ?? []
  const [activeKw, setActiveKw] = useState(runs[0]?.keyword ?? "")
  const [input, setInput] = useState("")
  const [customRun, setCustomRun] = useState<GeoGridKeywordRun | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const isCustom = activeKw === "__custom"
  const run: GeoGridKeywordRun | null = isCustom ? customRun : (runs.find((k) => k.keyword === activeKw) ?? null)

  const measureCustom = async () => {
    const kw = input.trim()
    if (kw.length < 2 || busy) return
    setBusy(true)
    setError("")
    try {
      const res = await fetch("/api/spsadmn/geogrid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw }),
      })
      const data = (await res.json().catch(() => ({}))) as { run?: GeoGridKeywordRun; error?: string }
      if (res.ok && data.run) {
        setCustomRun(data.run)
        setActiveKw("__custom")
      } else {
        setError(data.error || "Mõõtmine ebaõnnestus")
      }
    } catch {
      setError("Mõõtmine ebaõnnestus")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 mb-6">
      {/* Pinide numbri sildid Leaflet tooltipi kaudu (inline, admin-only leht) */}
      <style>{`.geo-pin-label{background:transparent!important;border:none!important;box-shadow:none!important;color:#fff;font-weight:700;font-size:12px;text-shadow:0 0 2px rgba(0,0,0,.35)}.geo-pin-label:before{display:none!important}`}</style>
      <h2 className="text-[18px] font-bold text-[#17345a] mb-1">Kaardi nähtavus (geo-grid)</h2>
      <p className="text-[13px] text-[#5a6474] mb-3">
        Kohalik Maps-positsioon {run ? run.points.length : 27} fikseeritud Tallinna/Harjumaa mõõtepunktis (Google Places API, ~1,5 km bias).
        Leidmata punkt = pole esimese 20 seas. Üksikpunkti koht võib Maps rakendusest paar positsiooni erineda — trend on mõõdik, mitte üksikpin.
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {runs.length > 0 && (
          <select
            value={activeKw}
            onChange={(e) => setActiveKw(e.target.value)}
            className="px-3 py-2 border border-[#d5dce4] rounded-lg text-[14px] text-[#17345a] bg-white"
          >
            {runs.map((k) => (
              <option key={k.keyword} value={k.keyword}>{k.keyword}</option>
            ))}
            {customRun && <option value="__custom">mõõdetud: {customRun.keyword}</option>}
          </select>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") measureCustom() }}
          placeholder="Mõõda muu märksõna, nt akende pesu"
          className="px-3 py-2 border border-[#d5dce4] rounded-lg text-[14px] text-[#17345a] bg-white min-w-[260px]"
        />
        <button
          onClick={measureCustom}
          disabled={busy || input.trim().length < 2}
          className="bg-[#17345a] text-white py-2 px-4 rounded-lg text-[14px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-60"
        >
          {busy ? "Mõõdan… (kuni ~30 s)" : "Mõõda kohe"}
        </button>
        {error && <span className="text-[13px] text-red-600">{error}</span>}
      </div>

      {runs.length === 0 && !customRun && (
        <p className="text-[14px] text-[#5a6474] bg-[#f8fafc] border border-[#e5eaf0] rounded-lg px-3 py-2 mb-4">
          Sellel raportil pole geo-grid andmeid (vanem raport või Places API pole veel seadistatud). Vabasõnalise märksõna saab siiski kohe mõõta ülal.
        </p>
      )}

      {run && (
        <>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[#5a6474] mb-3">
            <span><span className="inline-block w-3 h-3 rounded-full align-middle mr-1" style={{ background: "#2d9e6b" }} />1–3</span>
            <span><span className="inline-block w-3 h-3 rounded-full align-middle mr-1" style={{ background: "#a3c14a" }} />4–10</span>
            <span><span className="inline-block w-3 h-3 rounded-full align-middle mr-1" style={{ background: "#f5a623" }} />11–20</span>
            <span><span className="inline-block w-3 h-3 rounded-full align-middle mr-1" style={{ background: "#d64545" }} />pole top-20</span>
            <span className="ml-auto">mõõdetud {new Date(run.measuredAt).toLocaleString("et-EE")}</span>
          </div>
          <LeafletMap run={run} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            <div className="bg-[#f8fafc] border border-[#e5eaf0] rounded-xl p-4">
              <div className="text-[13px] text-[#5a6474]">Keskmine koht</div>
              <div className="text-[22px] font-bold text-[#17345a] my-0.5">{fmtRank(run.summary.avgRank)}</div>
              <DeltaNote value={run.deltaAvgRank} invert />
            </div>
            <div className="bg-[#f8fafc] border border-[#e5eaf0] rounded-xl p-4">
              <div className="text-[13px] text-[#5a6474]">Top-3 punktides</div>
              <div className="text-[22px] font-bold text-[#17345a] my-0.5">{run.summary.top3}</div>
              <DeltaNote value={run.deltaTop3} />
            </div>
            <div className="bg-[#f8fafc] border border-[#e5eaf0] rounded-xl p-4">
              <div className="text-[13px] text-[#5a6474]">Top-10 punktides</div>
              <div className="text-[22px] font-bold text-[#17345a] my-0.5">{run.summary.top10}</div>
              <DeltaNote value={run.deltaTop10} />
            </div>
            <div className="bg-[#f8fafc] border border-[#e5eaf0] rounded-xl p-4">
              <div className="text-[13px] text-[#5a6474]">Leitud top-20</div>
              <div className="text-[22px] font-bold text-[#17345a] my-0.5">{run.summary.found}/{run.points.length}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
