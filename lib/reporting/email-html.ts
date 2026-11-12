/**
 * Weekly report e-mail rendering: compact HTML (inline styles, table layout —
 * mail-client safe) + plain-text fallback. Content: scorecard, LLM narrative
 * (when present), grouped insights, link to the full admin report.
 */

import type { AdsConversionBreakdown, AdsData, AiVisibilityData, FormsData, FormsPeriod, GeoGridData, Insight, LeadRow, SiteChanges, StoredReport } from "./types"
import { getGbpWeekTasks, loadGbpCalendar, type GbpCalendar, type GbpWeekTasks } from "./gbp-calendar"

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
 *
 * Kliendi palve 06.11.2026: VÄLIKORISTUSE päringud (nt korteriühistu hoov,
 * kõnniteed, parklad) EI OLE „meile sobivad" äripindade hoolduskoristuse
 * päringud — need tuuakse eraldi välja ja Ads'i kulu ei jagata nende peale.
 * Maksumus arvutatakse seega ainult siseruumide (indoor) hoolduspäringutelt.
 */
export function maintenanceCostLine(leads: LeadRow[], ads: AdsData | null | undefined): string | null {
  if (!ads?.available || ads.totals.cost <= 0) return null
  /* serviceKind puudub vanadel raportitel — määramata loetakse indoor'iks
   * (välikoristus peab olema sõnaselge, vt forms.ts classifyServiceKind). */
  const isIndoorMaint = (l: LeadRow) => l.maintenance !== "no" && l.serviceKind !== "outdoor"
  const maintTotal = leads.filter(isIndoorMaint).length
  const maintAds = leads.filter((l) => isIndoorMaint(l) && l.viaAds).length
  const outdoorAds = leads.filter((l) => l.maintenance !== "no" && l.serviceKind === "outdoor" && l.viaAds).length
  const outdoorNote = outdoorAds > 0
    ? ` Lisaks tuli Adsist ${outdoorAds} välikoristuse päring${outdoorAds === 1 ? "" : "ut"} — see kajastub eraldi ega lähe äripindade hoolduskoristuse maksumuse arvestusse.`
    : ""
  if (maintAds > 0) {
    return `Hoolduskoristuse päringute maksumus Adsist: ${fmtEur(ads.totals.cost / maintAds)}/päring — perioodi Ads-kulu ${fmtEur(ads.totals.cost)} ÷ ${maintAds} Adsist tulnud äripindade (siseruumide) hoolduspäringut (üle kanalite kokku ${maintTotal}).${outdoorNote}`
  }
  return `Adsist äripindade (siseruumide) hoolduskoristuse päringuid sel perioodil ei tulnud (Ads-kulu ${fmtEur(ads.totals.cost)})${maintTotal > 0 ? ` — üle kanalite oli siseruumide hoolduspäringuid ${maintTotal}` : ""}.${outdoorNote}`
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
  // invertGood=true (nt positsioon, kus väiksem on parem): kuvame muutuse PARANEMISENA —
  // positiivne % = roheline ▲ (paranes), negatiivne % = punane ▼ (halvenes).
  const raw = ((cur - prev) / prev) * 100
  const pct = Math.round(invertGood ? -raw : raw)
  const good = pct > 0
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

/** Arvestusest välja jäetud ridade märkus (testpäringud + tööotsingud, kliendi palved 25.09/02.10.2026). */
function excludedLine(current: FormsPeriod | undefined): string | null {
  if (!current) return null
  const parts: string[] = []
  if (current.jobSeekers) parts.push(`${current.jobSeekers} tööotsing${current.jobSeekers === 1 ? "" : "ut"} (ei ole hinnapäring)`)
  if (current.tests) parts.push(`${current.tests} testpäring${current.tests === 1 ? "" : "ut"}`)
  return parts.length ? `Arvestusest on välja jäetud ${parts.join(" ja ")}.` : null
}

const CHANGE_GROUP_LABELS: Record<string, string> = {
  blog: "Blogi",
  content: "Lehtede sisu ja tekstid",
  seo: "Tehniline SEO",
  technical: "Muud tehnilised täiendused",
}

const etCount = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/**
 * „Lehekülje arendus" reeglipõhine kokkuvõte (fallback LLM-summaryle).
 * Jagatud admin-UIga — admin kasutab samu ridu, kui summary puudub.
 */
export function changesFallbackLines(changes: SiteChanges): string[] {
  const lines: string[] = []
  for (const group of changes.groups) {
    if (group.key === "blog") {
      if (changes.newBlogPosts.length > 0) {
        lines.push(`Blogi: avaldati ${etCount(changes.newBlogPosts.length, "uus artikkel", "uut artiklit")} — ${changes.newBlogPosts.map((t) => `„${t}"`).join(", ")}.`)
        const extra = group.count - changes.newBlogPosts.length
        if (extra > 0) lines.push(`Blogi täiendused: ${etCount(extra, "muudatus", "muudatust")}.`)
      } else {
        lines.push(`Blogi: ${etCount(group.count, "täiendus", "täiendust")} (${group.items.slice(0, 3).join("; ")}).`)
      }
      continue
    }
    if (group.key === "technical") {
      lines.push(`${CHANGE_GROUP_LABELS[group.key]}: ${etCount(group.count, "muudatus", "muudatust")}.`)
      continue
    }
    const shown = group.items.slice(0, 4)
    const rest = group.count - shown.length
    lines.push(`${CHANGE_GROUP_LABELS[group.key]}: ${etCount(group.count, "muudatus", "muudatust")} — ${shown.join("; ")}${rest > 0 ? ` (ja ${rest} veel)` : ""}.`)
  }
  return lines
}

/** „Lehekülje arendus" sektsioon: LLM-summary kui olemas, muidu struktureeritud read. */
function changesSection(changes: SiteChanges): { html: string; text: string[] } {
  const since = changes.since.slice(0, 10).split("-").reverse().join(".")
  const heading = `Lehekülje arendus (alates ${since})`
  if (changes.commits === 0) {
    const note = "Ülevaatusperioodil leheküljel muudatusi ei tehtud."
    return {
      html: `<h2 style="font-size:18px;color:#17345a;margin:24px 0 4px">${escapeHtml(heading)}</h2>` +
        `<p style="font-size:15px;color:#2d3748;margin:4px 0 8px">${escapeHtml(note)}</p>`,
      text: [heading.toUpperCase(), note, ""],
    }
  }
  if (changes.summary) {
    return {
      html: `<h2 style="font-size:18px;color:#17345a;margin:24px 0 4px">${escapeHtml(heading)}</h2>` + markdownToHtml(changes.summary),
      text: [heading.toUpperCase(), changes.summary, ""],
    }
  }
  const lines = changesFallbackLines(changes)
  return {
    html:
      `<h2 style="font-size:18px;color:#17345a;margin:24px 0 4px">${escapeHtml(heading)}</h2>` +
      `<ul style="margin:6px 0;padding-left:22px">` +
      lines.map((l) => `<li style="margin:4px 0;font-size:15px;line-height:1.5;color:#2d3748">${escapeHtml(l)}</li>`).join("") +
      `</ul>`,
    text: [heading.toUpperCase(), ...lines.map((l) => `- ${l}`), ""],
  }
}

/** Nädala päringute tabel koos hoolduskoristuse klassifikatsiooniga (kliendi põhieesmärk eraldi välja toodud). */
function leadsSection(leads: LeadRow[], ads: AdsData | null, current?: FormsPeriod, window?: FormsData["window"]): { html: string; text: string[] } {
  if (leads.length === 0) return { html: "", text: [] }
  const yes = leads.filter((l) => l.maintenance === "yes").length
  const likely = leads.filter((l) => l.maintenance === "likely").length
  /* Kliendi palve 23.10.2026: siseruumide hoolduskoristus ja välikoristus eraldi. */
  const outdoor = leads.filter((l) => l.maintenance !== "no" && l.serviceKind === "outdoor").length
  const indoor = yes + likely - outdoor
  const headline = `Nädala päringud: ${yes + likely > 0 ? `${yes + likely} soovis regulaarset hooldust — siseruumides ${indoor}, välikoristust ${outdoor} (${yes} selget${likely > 0 ? ` + ${likely} tõenäolist` : ""})` : "hoolduskoristuse päringuid ei olnud"}`
  const costLine = maintenanceCostLine(leads, ads)
  const excluded = excludedLine(current)
  /* Kliendi palve 09.10.2026: päringud on arvestatud kuni raporti koostamiseni
   * (mitte Google'i ~2-päevase viivitusega perioodi lõpuni) — aken nähtavalt. */
  const windowNote = window
    ? `Päringute aken: ${window.start} – ${window.end} (kõik päringud kuni raporti koostamiseni; Google'i statistika allpool lõppeb ~2 päeva varem).`
    : null
  const rows = leads
    .map((l) => {
      const m = MAINTENANCE_LABELS[l.maintenance]
      const kindSuffix = l.maintenance !== "no" && l.serviceKind === "outdoor" ? " · välikoristus" : ""
      const date = l.createdAt.slice(0, 10).split("-").reverse().slice(0, 2).join(".")
      return (
        `<tr>` +
        `<td style="padding:6px 8px;border-top:1px solid #edf0f4;font-size:14px;color:#5a6474;white-space:nowrap">${escapeHtml(date)}</td>` +
        `<td style="padding:6px 8px;border-top:1px solid #edf0f4;font-size:14px;color:#17345a;font-weight:bold">${escapeHtml(l.company || "—")}</td>` +
        `<td style="padding:6px 8px;border-top:1px solid #edf0f4"><span style="display:inline-block;background:${m.bg};color:${m.color};font-size:12px;font-weight:bold;border-radius:8px;padding:2px 8px">${m.label}${kindSuffix}</span></td>` +
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
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5eaf0;border-radius:12px;overflow:hidden">${rows}</table>` +
    (excluded
      ? `<p style="font-size:13px;color:#5a6474;margin:6px 0 0">${escapeHtml(excluded)}</p>`
      : "") +
    (windowNote
      ? `<p style="font-size:13px;color:#5a6474;margin:6px 0 0">${escapeHtml(windowNote)}</p>`
      : "")
  const text = [
    "NÄDALA PÄRINGUD",
    headline,
    ...(costLine ? [costLine] : []),
    ...(excluded ? [excluded] : []),
    ...(windowNote ? [windowNote] : []),
    ...leads.map((l) => {
      const date = l.createdAt.slice(0, 10).split("-").reverse().slice(0, 2).join(".")
      const kindSuffix = l.maintenance !== "no" && l.serviceKind === "outdoor" ? " · välikoristus" : ""
      return `- ${date} ${l.company || "—"} [${MAINTENANCE_LABELS[l.maintenance].label}${kindSuffix}; ${leadChannel(l)}; ${leadPath(l.pageUrl)}] ${l.summary}`
    }),
    "",
  ]
  return { html, text }
}

/**
 * „Kaardi nähtavus (Google Maps, geo-grid)“ — kohalik Maps-positsioon 27
 * fikseeritud mõõtepunktis (geogrid.ts). Deltad on eelmise nädala raporti
 * vastu ja arvutatud juba genereerimisel. Keskmise koha puhul on MADALAM
 * parem (leidmata punkt = 21). Puudub, kui Places API pole seadistatud või
 * raport on vanast formaadist. Mõõdab teadlikult Maps'i/äriprofiili
 * nähtavust — GSC orgaanilise otsingu positsioonidega (Top päringud)
 * EI pea kattuma; sektsioon ütleb selle ka lugejale sõnaselgelt.
 */
/** AI-nähtavuse sektsioon: kas AI-otsingud (12 fikseeritud päringut) SPS-i
 *  soovitavad + konkurendi-mainimised + tsiteeritud domeenid (kuhu off-page
 *  tööd suunata). Andmed: snapshot.aiVisibility (valikuline — render guard). */
function aiVisibilitySection(ai: AiVisibilityData): { html: string; text: string[] } {
  const delta = (d?: number) => {
    if (d === undefined) return ""
    const good = d > 0
    const color = d === 0 ? "#5a6474" : good ? "#166534" : "#b91c1c"
    const sign = d > 0 ? "+" : ""
    return `<span style="font-size:12px;color:${color}"> (${sign}${d} vs eelm.)</span>`
  }
  const providerRows = ai.providers
    .map((p) => {
      const failNote = p.failed > 0 ? ` · ${p.failed} päringut ebaõnnestus` : ""
      return (
        `<tr><td style="padding:7px 10px;border-top:1px solid #edf0f4;font-size:14px;color:#17345a;font-weight:bold">${escapeHtml(p.provider)}</td>` +
        `<td style="padding:7px 10px;border-top:1px solid #edf0f4;font-size:14px;text-align:right">${p.mentioned}/${p.asked}${delta(p.deltaMentioned)}${failNote}</td></tr>`
      )
    })
    .join("")
  const topComp = ai.topCompetitors.slice(0, 8).map(([n, c]) => `${escapeHtml(n)} (${c})`).join(", ")
  const topDom = ai.topDomains.slice(0, 10).map(([d, c]) => `${escapeHtml(d)} (${c})`).join(", ")
  const html =
    `<h2 style="font-size:18px;color:#17345a;margin:24px 0 4px">AI-nähtavus — kas AI-otsingud SPS-i soovitavad?</h2>` +
    `<p style="font-size:13px;color:#5a6474;margin:0 0 8px">Iga nädal esitatakse ${ai.providers.reduce((s, p) => s + p.asked + p.failed, 0)} fikseeritud päringut (ET/EN/RU) AI-otsingutele. „Mainitud" = mitmel päringul SPS Gruppi soovitati.</p>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5eaf0;border-radius:12px;overflow:hidden">` +
    `<tr><td style="padding:7px 10px;font-size:12px;color:#5a6474">Teenus</td><td style="padding:7px 10px;font-size:12px;color:#5a6474;text-align:right">SPS mainitud</td></tr>` +
    providerRows +
    `</table>` +
    (topComp ? `<p style="font-size:13px;color:#4a5568;margin:8px 0 0"><strong>Konkurente mainiti:</strong> ${topComp}</p>` : "") +
    (topDom ? `<p style="font-size:13px;color:#4a5568;margin:4px 0 0"><strong>AI tsiteerib allikaid:</strong> ${topDom} — nendes kohtades tasub SPS-i nähtavust kasvatada.</p>` : "")
  const text: string[] = [
    "AI-NÄHTAVUS (kas AI-otsingud SPS-i soovitavad):",
    ...ai.providers.map((p) => `- ${p.provider}: SPS mainitud ${p.mentioned}/${p.asked} päringus${p.deltaMentioned !== undefined ? ` (${p.deltaMentioned > 0 ? "+" : ""}${p.deltaMentioned} vs eelm.)` : ""}`),
    ...(topComp ? [`- Konkurente mainiti: ${ai.topCompetitors.slice(0, 8).map(([n, c]) => `${n} (${c})`).join(", ")}`] : []),
    ...(topDom ? [`- AI tsiteerib: ${ai.topDomains.slice(0, 10).map(([d, c]) => `${d} (${c})`).join(", ")}`] : []),
    "",
  ]
  return { html, text }
}

function geogridSection(geogrid: GeoGridData): { html: string; text: string[] } {  const fmtRank = (n: number) => n.toFixed(1).replace(".", ",")
  const deltaAvg = (d?: number) => {
    if (d === undefined) return ""
    const good = d < 0
    const color = d === 0 ? "#5a6474" : good ? "#166534" : "#b91c1c"
    const sign = d > 0 ? "+" : ""
    return `<span style="font-size:12px;color:${color}"> (${sign}${fmtRank(d)} vs eelm.)</span>`
  }
  const deltaCount = (d?: number) => {
    if (d === undefined) return ""
    const good = d > 0
    const color = d === 0 ? "#5a6474" : good ? "#166534" : "#b91c1c"
    const sign = d > 0 ? "+" : ""
    return `<span style="font-size:12px;color:${color}"> (${sign}${Math.round(d)} vs eelm.)</span>`
  }
  const rows = geogrid.keywords
    .map((k) => {
      const cells = [
        `<td style="padding:7px 10px;border-top:1px solid #edf0f4;font-size:14px;color:#17345a;font-weight:bold">${escapeHtml(k.keyword)}</td>`,
        `<td style="padding:7px 10px;border-top:1px solid #edf0f4;font-size:14px;text-align:right">${fmtRank(k.summary.avgRank)}${deltaAvg(k.deltaAvgRank)}</td>`,
        `<td style="padding:7px 10px;border-top:1px solid #edf0f4;font-size:14px;text-align:right">${k.summary.top3}${deltaCount(k.deltaTop3)}</td>`,
        `<td style="padding:7px 10px;border-top:1px solid #edf0f4;font-size:14px;text-align:right">${k.summary.top10}${deltaCount(k.deltaTop10)}</td>`,
        `<td style="padding:7px 10px;border-top:1px solid #edf0f4;font-size:14px;text-align:right;color:#5a6474">${k.summary.found}/${k.points.length}</td>`,
      ]
      return `<tr>${cells.join("")}</tr>`
    })
    .join("\n")
  const head = ["Märksõna", "Keskm. koht", "Top-3", "Top-10", "Leitud"]
    .map((h, i) => `<th style="padding:6px 10px;font-size:12px;color:#5a6474;text-align:${i === 0 ? "left" : "right"};font-weight:bold">${h}</th>`)
    .join("")
  const html =
    `<h2 style="font-size:18px;color:#17345a;margin:24px 0 4px">Kaardi nähtavus (Google Maps, geo-grid)</h2>` +
    `<p style="font-size:13px;color:#5a6474;margin:0 0 8px">Kohalik positsioon ${geogrid.keywords[0]?.points.length ?? 27} Tallinna/Harjumaa mõõtepunktis (Google Places API, ~1,5 km bias). Keskmine: leidmata punkt loetakse kohaks 21 — madalam on parem. Mõõdab Google Maps'i (äriprofiili) nähtavust, mitte orgaanilist veebiotsingut — Search Console'i positsioonid on teine mõõdik ja need ei pea kattuma. Interaktiivne kaart ja vaba märksõna mõõtmine on admini täisraportis.</p>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5eaf0;border-radius:12px;overflow:hidden"><tr>${head}</tr>${rows}</table>`
  const text = [
    "KAARDI NÄHTAVUS (Google Maps, geo-grid: positsioon 27 mõõtepunktis; leidmata = 21; ei ole võrreldav orgaanilise otsinguga)",
    ...geogrid.keywords.map((k) => {
      const d = k.deltaAvgRank !== undefined ? ` (${k.deltaAvgRank > 0 ? "+" : ""}${k.deltaAvgRank.toFixed(1)} vs eelm.)` : ""
      return `- ${k.keyword}: keskm. koht ${k.summary.avgRank.toFixed(1)}${d} · top-3 ${k.summary.top3} · top-10 ${k.summary.top10} · leitud ${k.summary.found}/${k.points.length}`
    }),
    "",
  ]
  return { html, text }
}

/**
 * „Sisu ja GBP — järgmise nädala tegevused" — avaldamiskalendri meeldetuletus
 * (data/gbp-calendar.json; kliendi palve 21.10.2026). Raport saabub reedel,
 * GBP-postitus avaldatakse E–K, seega kuvatakse JÄRGMISE nädala ülesanded
 * koos valmis postitustekstiga, et need saaks kohe tööle võtta.
 */
function gbpCalendarSection(tasks: GbpWeekTasks, calendar: GbpCalendar): { html: string; text: string[] } {
  const { week, weekStart, weekEnd, rotated } = tasks
  const rotatedNote = rotated
    ? `<p style="font-size:13px;color:#92400e;background:#fef3c7;border-radius:8px;padding:8px 12px;margin:8px 0">Kalender on ringis (12 nädalat on täis) — uuenda <code>data/gbp-calendar.json</code> värskete teemadega.</p>`
    : ""
  const postBox =
    `<div style="background:#f4f9ff;border:1px solid #dbeafe;border-radius:10px;padding:12px 14px;margin:8px 0">` +
    `<div style="font-size:13px;color:#5a6474;margin-bottom:4px">GBP postitus (avalda E–K, „Lisateave"-nupuga link):</div>` +
    `<div style="font-size:14px;color:#17345a;white-space:pre-line">${escapeHtml(week.post.text)}</div>` +
    `<div style="font-size:13px;color:#1d4ed8;margin-top:6px">Link: <a href="${escapeHtml(week.post.ctaUrl)}" style="color:#1d4ed8">${escapeHtml(week.post.ctaUrl)}</a></div>` +
    `<div style="font-size:13px;color:#5a6474;margin-top:4px">Foto postitusele: ${escapeHtml(week.post.photoIdea)}</div>` +
    `</div>`
  const photoRow = week.photoTask
    ? `<li style="margin:4px 0;font-size:14px;color:#17345a"><strong>Fotod GBP-sse:</strong> ${escapeHtml(week.photoTask)}</li>`
    : ""
  const blogRow = week.blogTopic
    ? `<li style="margin:4px 0;font-size:14px;color:#17345a"><strong>Blogi (sync):</strong> ${escapeHtml(week.blogTopic)}</li>`
    : ""
  const standing = calendar.standingTasks
    .map((t) => `<li style="margin:3px 0;font-size:13px;color:#4a5568">${escapeHtml(t)}</li>`)
    .join("")
  const html =
    `<h2 style="font-size:18px;color:#17345a;margin:24px 0 4px">Sisu ja GBP — järgmise nädala plaan (${weekStart} – ${weekEnd})</h2>` +
    `<p style="font-size:13px;color:#5a6474;margin:0 0 8px">Teema: <strong>${escapeHtml(week.theme)}</strong>${week.done ? ` · Märkus: ${escapeHtml(week.done)}` : ""}</p>` +
    rotatedNote +
    postBox +
    `<ul style="margin:6px 0 0;padding-left:18px">${photoRow}${blogRow}</ul>` +
    `<div style="font-size:13px;color:#5a6474;margin-top:10px"><strong>Püsitoimetused:</strong></div>` +
    `<ul style="margin:4px 0 0;padding-left:18px">${standing}</ul>`
  const text = [
    `SISU JA GBP — JÄRGMISE NÄDALA PLAAN (${weekStart} – ${weekEnd}): ${week.theme}`,
    ...(rotated ? ["(kalender ringis — uuenda data/gbp-calendar.json)"] : []),
    `GBP postitus: ${week.post.text}`,
    `Link: ${week.post.ctaUrl} · Foto: ${week.post.photoIdea}`,
    ...(week.photoTask ? [`Fotod GBP-sse: ${week.photoTask}`] : []),
    ...(week.blogTopic ? [`Blogi (sync): ${week.blogTopic}`] : []),
    `Püsitoimetused: ${calendar.standingTasks.join(" · ")}`,
    "",
  ]
  return { html, text }
}

export async function buildReportEmail(report: StoredReport, adminUrl: string): Promise<{ subject: string; html: string; text: string }> {
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
  // AI-otsingute suunamised (chatgpt.com, perplexity.ai jm) — render guard,
  // sest vanadel salvestatud raportitel aiReferrals puudub.
  if (s.ga4?.aiReferrals) {
    const ai = s.ga4.aiReferrals
    const srcNote = ai.sources.length > 0
      ? ` · ${ai.sources.slice(0, 3).map((x) => `${x.source} ${x.sessions}`).join(" · ")}`
      : ""
    cards.push(scoreCard("Sessioonid AI-otsingutest", String(ai.current), deltaSub(ai.current, ai.previous) + srcNote))
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
  const leads = leadsSection(s.forms?.leads ?? [], s.ads, s.forms?.current, s.forms?.window)
  const changes = s.changes ? changesSection(s.changes) : { html: "", text: [] }
  const geo = s.geogrid && s.geogrid.keywords.length > 0 ? geogridSection(s.geogrid) : { html: "", text: [] as string[] }
  const ai = s.aiVisibility && s.aiVisibility.providers.length > 0 ? aiVisibilitySection(s.aiVisibility) : { html: "", text: [] as string[] }
  const gbpCalendar = await loadGbpCalendar()
  const gbp = gbpCalendar ? gbpCalendarSection(getGbpWeekTasks(new Date(s.generatedAt), gbpCalendar), gbpCalendar) : { html: "", text: [] as string[] }
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
  ${geo.html}
  ${ai.html}
  ${narrativeHtml}
  ${changes.html}
  ${gbp.html}
  <h2 style="font-size:18px;color:#17345a;margin:24px 0 4px">Leiud ja järgmised sammud</h2>
  ${insightSections.join("\n")}
  <p style="margin-top:24px;font-size:14px;color:#5a6474">
    Täisraport tabelite ja trendidega: <a href="${escapeHtml(adminUrl)}" style="color:#1d4ed8">${escapeHtml(adminUrl)}</a>
  </p>
  <p style="font-size:12px;color:#9aa5b1;margin-top:16px;border-top:1px solid #edf0f4;padding-top:10px">
    Automaatne nädalaraport (reede 09:00) · Andmed: GSC, GA4, Google Ads API, päringute andmebaas · GSC/GA4/Ads-i andmed lõppevad ~2 päeva tagasi (Google'i viive); vormipäringud ja lehe muudatused on arvestatud kuni raporti koostamiseni.
  </p>
</div>
</body></html>`

  const textLines: string[] = [
    `SPS Grupp — nädalaraport ${s.period.start} – ${s.period.end}`,
    "",
  ]
  textLines.push(...leads.text)
  textLines.push(...geo.text)
  textLines.push(...ai.text)
  if (report.narrative) {
    textLines.push(report.narrative.replace(/\*\*/g, "").replace(/^#{2,4}\s*/gm, ""), "")
  }
  textLines.push(...changes.text)
  textLines.push(...gbp.text)
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
