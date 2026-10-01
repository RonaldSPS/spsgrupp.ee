/**
 * Weekly report e-mail rendering: compact HTML (inline styles, table layout —
 * mail-client safe) + plain-text fallback. Content: scorecard, LLM narrative
 * (when present), grouped insights, link to the full admin report.
 */

import type { AdsConversionBreakdown, AdsData, Insight, LeadRow, StoredReport } from "./types"

export interface AdsConvSplit {
  form: number
  contact: number
  other: number
  hasData: boolean
}

/**
 * Jaota Ads'i konversioonid kategooria alusel: päris vormipäringud eraldi
 * telefoni/e-posti klikkidest (kliendi palve 01.10.2026). hasData=false, kui
 * snapshot on vanast formaadist (breakdown puudub) — siis kuvatakse vana
 * kokkuvõtlikku arvu.
 */
export function splitAdsConversions(ads: { conversionBreakdown?: AdsConversionBreakdown[] } | null | undefined): AdsConvSplit {
  const out: AdsConvSplit = { form: 0, contact: 0, other: 0, hasData: ads?.conversionBreakdown !== undefined }
  for (const b of ads?.conversionBreakdown ?? []) {
    if (b.category === "SUBMIT_LEAD_FORM") out.form += b.conversions
    else if (b.category === "CONTACT" || b.category === "PHONE_CALL_LEAD") out.contact += b.conversions
    else out.other += b.conversions
  }
  return out
}

const fmtEur = (n: number) => `${n.toFixed(2).replace(".", ",")} €`
const fmtConv = (n: number) => n.toFixed(1).replace(".", ",")

/**
 * Hoolduskoristuse päringute maksumus Adsist (kliendi palve 01.10.2026 —
 * tuua raportis eraldi välja). null, kui Ads'i andmed puuduvad või kulu on 0.
 */
export function maintenanceCostLine(leads: LeadRow[], ads: AdsData | null | undefined): string | null {
  if (!ads?.available || ads.totals.cost <= 0) return null
  const maintTotal = leads.filter((l) => l.maintenance !== "no").length
  const maintAds = leads.filter((l) => l.maintenance !== "no" && l.viaAds).length
  if (maintAds > 0) {
    return `Hoolduskoristuse päringute maksumus Adsist: ${fmtEur(ads.totals.cost / maintAds)}/päring — perioodi Ads-kulu ${fmtEur(ads.totals.cost)} ÷ ${maintAds} Adsist tulnud hoolduspäringut (üle kanalite kokku ${maintTotal}).`
  }
  return `Adsist hoolduskoristuse päringuid sel perioodil ei tulnud (Ads-kulu ${fmtEur(ads.totals.cost)})${maintTotal > 0 ? ` — üle kanalite oli hoolduspäringuid ${maintTotal}` : ""}.`
}

const SEV_META: Record<Insight["severity"], { label: string; color: string; bg: string }> = {
  negative: { label: "Kriitiline", color: "#b91c1c", bg: "#fee2e2" },
  warning: { label: "Tähelepanu", color: "#92400e", bg: "#fef3c7" },
  opportunity: { label: "Võimalus", color: "#1d4ed8", bg: "#dbeafe" },
  positive: { label: "Positiivne", color: "#166534", bg: "#dcfce7" },
}

const AREA_LABELS: Record<Insight["area"], string> = {
  seo: "SEO / GSC",
  ads: "Google Ads",
  ga4: "Liiklus (GA4)",
  forms: "Päringud",
  strategy: "Strateegia",
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

/** Minimal markdown -> HTML for the LLM narrative (##, ###, **, -, 1., paragraphs). */
export function markdownToHtml(md: string): string {
  const lines = md.split(/\r?\n/)
  const html: string[] = []
  let listOpen: "ul" | "ol" | null = null
  const closeList = () => {
    if (listOpen) {
      html.push(listOpen === "ul" ? "</ul>" : "</ol>")
      listOpen = null
    }
  }
  const inline = (s: string) =>
    escapeHtml(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>")

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      closeList()
      continue
    }
    const h = line.match(/^(#{2,4})\s+(.*)$/)
    if (h) {
      closeList()
      const size = h[1].length === 2 ? "18px" : "16px"
      html.push(`<h2 style="font-size:${size};color:#17345a;margin:20px 0 8px;font-family:Arial,sans-serif">${inline(h[2])}</h2>`)
      continue
    }
    const ul = line.match(/^[-*]\s+(.*)$/)
    if (ul) {
      if (listOpen !== "ul") {
        closeList()
        html.push('<ul style="margin:6px 0;padding-left:22px">')
        listOpen = "ul"
      }
      html.push(`<li style="margin:4px 0;font-size:15px;line-height:1.5;color:#2d3748">${inline(ul[1])}</li>`)
      continue
    }
    const ol = line.match(/^\d+[.)]\s+(.*)$/)
    if (ol) {
      if (listOpen !== "ol") {
        closeList()
        html.push('<ol style="margin:6px 0;padding-left:22px">')
        listOpen = "ol"
      }
      html.push(`<li style="margin:4px 0;font-size:15px;line-height:1.5;color:#2d3748">${inline(ol[1])}</li>`)
      continue
    }
    closeList()
    html.push(`<p style="margin:8px 0;font-size:15px;line-height:1.55;color:#2d3748">${inline(line)}</p>`)
  }
  closeList()
  return html.join("\n")
}

function scoreCard(label: string, value: string, sub: string): string {
  return (
    `<td style="width:25%;padding:4px">` +
    `<div style="background:#f8fafc;border:1px solid #e5eaf0;border-radius:12px;padding:12px 14px">` +
    `<div style="font-size:13px;color:#5a6474;font-family:Arial,sans-serif">${escapeHtml(label)}</div>` +
    `<div style="font-size:22px;font-weight:bold;color:#17345a;font-family:Arial,sans-serif;margin:2px 0">${escapeHtml(value)}</div>` +
    `<div style="font-size:12px;color:#5a6474;font-family:Arial,sans-serif">${sub}</div>` +
    `</div></td>`
  )
}

function deltaSub(cur: number, prev: number, invertGood = false): string {
  if (prev === 0 && cur === 0) return "eelmine nädal: –"
  if (prev === 0) return "eelmine nädal: 0"
  const pct = Math.round(((cur - prev) / prev) * 100)
  const good = invertGood ? pct < 0 : pct > 0
  const arrow = pct === 0 ? "■" : pct > 0 ? "▲" : "▼"
  const color = pct === 0 ? "#5a6474" : good ? "#166534" : "#b91c1c"
  return `<span style="color:${color}">${arrow} ${pct > 0 ? "+" : ""}${pct} %</span> eelmise nädalaga`
}

const MAINTENANCE_LABELS: Record<LeadRow["maintenance"], { label: string; color: string; bg: string }> = {
  yes: { label: "Regulaarne hooldus", color: "#166534", bg: "#dcfce7" },
  likely: { label: "Tõenäoliselt regulaarne", color: "#1d4ed8", bg: "#dbeafe" },
  no: { label: "Ühekordne/muu", color: "#5a6474", bg: "#f1f5f9" },
}

function leadChannel(lead: LeadRow): string {
  if (lead.viaAds) return "Google Ads"
  if (lead.source.startsWith("organic:")) return `Orgaaniline (${lead.source.slice("organic:".length)})`
  if (lead.source.startsWith("referral:")) return `Viide (${lead.source.slice("referral:".length)})`
  if (lead.source.startsWith("utm:")) return `Kampaania (${lead.source.slice(4)})`
  if (lead.source === "direct") return "Otse"
  return "–"
}

function leadPath(pageUrl: string): string {
  try {
    return new URL(pageUrl).pathname
  } catch {
    return pageUrl || "–"
  }
}

/** Nädala päringute tabel koos hoolduskoristuse klassifikatsiooniga (kliendi põhieesmärk eraldi välja toodud). */
function leadsSection(leads: LeadRow[], ads: AdsData | null): { html: string; text: string[] } {
  if (leads.length === 0) return { html: "", text: [] }
  const yes = leads.filter((l) => l.maintenance === "yes").length
  const likely = leads.filter((l) => l.maintenance === "likely").length
  const headline = `Nädala päringud: ${yes + likely > 0 ? `${yes + likely} soovis regulaarset hoolduskoristust (${yes} selget${likely > 0 ? ` + ${likely} tõenäolist` : ""})` : "hoolduskoristuse päringuid ei olnud"}`
  const costLine = maintenanceCostLine(leads, ads)
  const rows = leads
    .map((l) => {
      const m = MAINTENANCE_LABELS[l.maintenance]
      const date = l.createdAt.slice(0, 10).split("-").reverse().slice(0, 2).join(".")
      return (
        `<tr>` +
        `<td style="padding:6px 8px;border-top:1px solid #edf0f4;font-size:14px;color:#5a6474;white-space:nowrap">${escapeHtml(date)}</td>` +
        `<td style="padding:6px 8px;border-top:1px solid #edf0f4;font-size:14px;color:#17345a;font-weight:bold">${escapeHtml(l.company || "—")}</td>` +
        `<td style="padding:6px 8px;border-top:1px solid #edf0f4"><span style="display:inline-block;background:${m.bg};color:${m.color};font-size:12px;font-weight:bold;border-radius:8px;padding:2px 8px">${m.label}</span></td>` +
        `<td style="padding:6px 8px;border-top:1px solid #edf0f4;font-size:14px;color:#4a5568">${escapeHtml(leadChannel(l))}</td>` +
        `<td style="padding:6px 8px;border-top:1px solid #edf0f4;font-size:13px;color:#5a6474">${escapeHtml(leadPath(l.pageUrl))}</td>` +
        `</tr>` +
        `<tr><td colspan="5" style="padding:0 8px 8px;font-size:13px;color:#4a5568">${escapeHtml(l.summary)}</td></tr>`
      )
    })
    .join("\n")
  const html =
    `<h2 style="font-size:18px;color:#17345a;margin:24px 0 4px">Nädala päringud</h2>` +
    `<p style="font-size:15px;color:#2d3748;margin:4px 0 8px"><strong>${escapeHtml(headline)}</strong> — põhieesmärk on B2B regulaarse hoolduskoristuse lepingud, seega on need eraldi välja toodud.</p>` +
    (costLine
      ? `<p style="font-size:15px;color:#17345a;margin:4px 0 8px;background:#f0f7ff;border:1px solid #d7e7fa;border-radius:8px;padding:8px 12px">${escapeHtml(costLine)}</p>`
      : "") +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5eaf0;border-radius:12px;overflow:hidden">${rows}</table>`
  const text = [
    "NÄDALA PÄRINGUD",
    headline,
    ...(costLine ? [costLine] : []),
    ...leads.map((l) => {
      const date = l.createdAt.slice(0, 10).split("-").reverse().slice(0, 2).join(".")
      return `- ${date} ${l.company || "—"} [${MAINTENANCE_LABELS[l.maintenance].label}; ${leadChannel(l)}; ${leadPath(l.pageUrl)}] ${l.summary}`
    }),
    "",
  ]
  return { html, text }
}

export function buildReportEmail(report: StoredReport, adminUrl: string): { subject: string; html: string; text: string } {
  const s = report.snapshot
  const subject = `SPS nädalaraport ${s.period.start} – ${s.period.end}`

  const gscClicks = s.gsc ? s.gsc.current.clicks / s.gsc.current.days : null
  const gscPrevClicks = s.gsc ? s.gsc.previous.clicks / s.gsc.previous.days : null
  const cards: string[] = []
  if (s.gsc) {
    cards.push(scoreCard("GSC klikke/päevas", gscClicks!.toFixed(1).replace(".", ","), deltaSub(gscClicks!, gscPrevClicks!)))
  }
  if (s.ga4) {
    cards.push(scoreCard("Sessioonid (GA4)", String(Math.round(s.ga4.current.sessions)), deltaSub(s.ga4.current.sessions, s.ga4.previous.sessions)))
  }
  if (s.ads?.available) {
    const gclidLeads = s.forms?.current.gclidLeads ?? 0
    const convNote = gclidLeads > 0 ? ` · ${gclidLeads} päringut (DB)` : ""
    const split = splitAdsConversions(s.ads)
    const convText = split.hasData
      ? `konv (Ads): vorm ${fmtConv(split.form)} · tel/e-post ${fmtConv(split.contact)}${split.other > 0 ? ` · muu ${fmtConv(split.other)}` : ""}`
      : `${fmtConv(s.ads.totals.conversions)} konv (Ads)`
    cards.push(scoreCard("Ads kulu", `${s.ads.totals.cost.toFixed(0)} €`, `${s.ads.totals.clicks} klikki · ${convText}${convNote}`))
  }
  if (s.forms) {
    cards.push(scoreCard("Kontaktpäringud", String(s.forms.current.contact), deltaSub(s.forms.current.contact, s.forms.previous.contact)))
  }

  const insightsByArea = new Map<Insight["area"], Insight[]>()
  for (const ins of report.insights) {
    const list = insightsByArea.get(ins.area) ?? []
    list.push(ins)
    insightsByArea.set(ins.area, list)
  }

  const insightSections: string[] = []
  for (const [area, items] of insightsByArea) {
    const rows = items
      .map((ins) => {
        const meta = SEV_META[ins.severity]
        return (
          `<tr><td style="padding:8px 10px;border-top:1px solid #edf0f4;vertical-align:top">` +
          `<span style="display:inline-block;background:${meta.bg};color:${meta.color};font-size:12px;font-weight:bold;border-radius:8px;padding:2px 8px;margin-bottom:4px">${meta.label}</span>` +
          `<div style="font-size:15px;font-weight:bold;color:#17345a;font-family:Arial,sans-serif">${escapeHtml(ins.title)}</div>` +
          `<div style="font-size:14px;color:#4a5568;font-family:Arial,sans-serif;margin-top:2px">${escapeHtml(ins.detail)}</div>` +
          `<div style="font-size:14px;color:#1d4ed8;font-family:Arial,sans-serif;margin-top:4px"><strong>Järgmine samm:</strong> ${escapeHtml(ins.action)}</div>` +
          `</td></tr>`
        )
      })
      .join("\n")
    insightSections.push(
      `<h3 style="font-size:16px;color:#17345a;margin:22px 0 4px;font-family:Arial,sans-serif">${AREA_LABELS[area]}</h3>` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5eaf0;border-radius:12px;overflow:hidden">${rows}</table>`,
    )
  }

  const narrativeHtml = report.narrative ? markdownToHtml(report.narrative) : ""
  const leads = leadsSection(s.forms?.leads ?? [], s.ads)
  const errorsNote = s.errors.length
    ? `<p style="font-size:13px;color:#92400e;background:#fef3c7;border-radius:8px;padding:8px 12px">Osaliselt puuduvad andmed: ${escapeHtml(s.errors.join(" · "))}</p>`
    : ""

  const html = `<!doctype html>
<html><body style="margin:0;background:#eceef1;padding:16px;font-family:Arial,sans-serif">
<div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;padding:24px 28px;border:1px solid #e5eaf0">
  <div style="border-bottom:3px solid #3abeff;padding-bottom:12px;margin-bottom:16px">
    <div style="font-size:20px;font-weight:bold;color:#17345a">SPS Grupp — nädalaraport</div>
    <div style="font-size:14px;color:#5a6474">${s.period.start} → ${s.period.end} (võrdlus: ${s.period.prevStart} → ${s.period.prevEnd})</div>
  </div>
  ${errorsNote}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${cards.join("")}</tr></table>
  ${leads.html}
  ${narrativeHtml}
  <h2 style="font-size:18px;color:#17345a;margin:24px 0 4px">Leiud ja järgmised sammud</h2>
  ${insightSections.join("\n")}
  <p style="margin-top:24px;font-size:14px;color:#5a6474">
    Täisraport tabelite ja trendidega: <a href="${escapeHtml(adminUrl)}" style="color:#1d4ed8">${escapeHtml(adminUrl)}</a>
  </p>
  <p style="font-size:12px;color:#9aa5b1;margin-top:16px;border-top:1px solid #edf0f4;padding-top:10px">
    Automaatne nädalaraport (reede 09:00) · Andmed: GSC, GA4, Google Ads API, päringute andmebaas · Andmete lõppkuupäev on ~2 päeva tagasi (Google'i viive).
  </p>
</div>
</body></html>`

  const textLines: string[] = [
    `SPS Grupp — nädalaraport ${s.period.start} – ${s.period.end}`,
    "",
  ]
  textLines.push(...leads.text)
  if (report.narrative) {
    textLines.push(report.narrative.replace(/\*\*/g, "").replace(/^#{2,4}\s*/gm, ""), "")
  }
  textLines.push("LEIUD JA JÄRGMISED SAMMUD")
  for (const [area, items] of insightsByArea) {
    textLines.push("", `— ${AREA_LABELS[area]} —`)
    for (const ins of items) {
      textLines.push(`[${SEV_META[ins.severity].label}] ${ins.title}`, `  ${ins.detail}`, `  Järgmine samm: ${ins.action}`)
    }
  }
  textLines.push("", `Täisraport: ${adminUrl}`)

  return { subject, html, text: textLines.join("\n") }
}
