/**
 * LLM narrative layer for the weekly report (hybrid model): the rules engine
 * (insights.ts) produces the facts and concrete flags; this module asks an
 * LLM to prioritize and phrase the Estonian marketing narrative on top.
 *
 * Providers (first configured key wins):
 *   1. Anthropic Messages API — ANTHROPIC_API_KEY (model: ANTHROPIC_MODEL)
 *   2. DeepSeek (OpenAI-compatible) — DEEPSEEK_API_KEY (model: DEEPSEEK_MODEL)
 * Both are plain fetch calls, no SDKs. With neither key set the report ships
 * rules-only (returns null, never blocks the pipeline).
 */

import type { Insight, ReportSnapshot } from "./types"

const TIMEOUT_MS = 90_000
const MAX_TOKENS = 2500

const SYSTEM_PROMPT = `Oled SPS Grupi (spsgrupp.ee) peamised turundusstrateeg ja SEO/Ads-analüütik. SPS Grupp on Tallinna koristus- ja hooldusteenuste ettevõte: kontorite koristus, hoolduskoristus, puhastusteenused, akende pesu, ehitusjärgne koristus, lammutustööd, remont.

KONTEKST, mida tead:
- Uus veebileht läks live'i 17.08.2026 (enne: vana WordPress). Pre-launch baasjoon: 9,0 orgaanilist klikki/päevas.
- Kaks kuldstandardit: „koristusfirma" ja „kontori koristus".
- Päris päringud (vormide DB) on konversioonitõde, mitte GA4 key events. Eesmärk ≥15 kontaktpäringut/kuu.
- GSC positsioon = näitamistega kaalutud keskmine. <10 näitamist/nädal = statistiline müra, mitte trend.
- Äsja lisatud lehed: /koristusteenus/hoolduskoristus/ ja /puhastusteenused/suurpuhastus/.
- Märksõnaperekonnad kattuvad teadlikult; ±2 positsiooni = stabiilne.
- „Konkurentsianalüüs" põhineb Ads'i rank-lost impression share'il ja GSC positsiooniliikumistel (Semrush-tüüpi tööriista pole).

KIRJUTA eesti keeles, otse ja numbritega. Sihtrühm: agentuuri omanik (Ronald), kes saadab kokkuvõtte edasi kliendile. Ära kasuta ingliskeelseid turundusklõpse. Ära leiuta numbreid, mida andmetes pole — kui midagi pole öelda, jäta välja.

VÄLJUNDI FORMAAT (GitHub-flavoured markdown, täpselt need neli pealkirja, selles järjekorras):
## Kokkuvõte
1 lõik: parem või halvem kui eelmine nädal + üks number, mis seda kõige paremini tõestab.
## Märkimisväärseimad liikumised
3–6 punkti (tärnid), igaüks: mis liikus + miks see oluline on.
## Järgmise nädala prioriteedid
Nummerdatud nimekiri (max 8), igaüks: konreetne tegevus + eeldatav efekt. Eralda selgelt SEO, Ads, sisu ja konversiooni tegevused.
## Sisu- ja kampaaniasoovitused
Konkreetsed ettepanekud: millisel teemal blogipostitus kirjutada (märksõnaga), kas ja milleks Meta-reklaami või e-posti kampaaniat teha olemasolevatele klientidele. Põhjenda andmetega.`

interface Digest {
  period: ReportSnapshot["period"]
  gsc?: {
    clicksPerDay: number
    prevClicksPerDay: number
    impressionsPerDay: number
    prevImpressionsPerDay: number
    ctr: number
    position: number
    families: {
      label: string
      pos: number | null
      prevPos: number | null
      impressions: number
      clicks: number
    }[]
    newQueries: { query: string; impressions: number; position: number }[]
    topQueries: { query: string; clicks: number; impressions: number; position: number }[]
  }
  ga4?: {
    sessions: number
    prevSessions: number
    engagementRate: number
    keyEvents: number
    trackingOk: boolean
    channels: { channel: string; sessions: number }[]
  }
  ads?: {
    cost: number
    clicks: number
    conversions: number
    campaigns: {
      name: string
      cost: number
      clicks: number
      conversions: number
      impressionShare: number | null
      rankLostIS: number | null
      budgetLostIS: number | null
    }[]
    brandCost: number
    nonBrandCost: number
    topTerms: { term: string; cost: number; clicks: number; conversions: number }[]
  }
  forms?: {
    contact: number
    prevContact: number
    career: number
    spam: number
    gclidLeads: number
    feeTotal: number
    profitTotal: number
  }
  insights: Pick<Insight, "area" | "severity" | "title" | "action">[]
  errors: string[]
}

const r1 = (n: number) => Math.round(n * 10) / 10

function buildDigest(snapshot: ReportSnapshot, insights: Insight[]): Digest {
  const d: Digest = {
    period: snapshot.period,
    insights: insights.map((i) => ({ area: i.area, severity: i.severity, title: i.title, action: i.action })),
    errors: snapshot.errors,
  }

  if (snapshot.gsc) {
    const g = snapshot.gsc
    d.gsc = {
      clicksPerDay: r1(g.current.clicks / g.current.days),
      prevClicksPerDay: r1(g.previous.clicks / g.previous.days),
      impressionsPerDay: r1(g.current.impressions / g.current.days),
      prevImpressionsPerDay: r1(g.previous.impressions / g.previous.days),
      ctr: g.current.ctr,
      position: r1(g.current.position),
      families: g.families
        .filter((f) => f.current.impressions > 0 || f.previous.impressions > 0)
        .map((f) => ({
          label: f.label,
          pos: f.current.position === null ? null : r1(f.current.position),
          prevPos: f.previous.position === null ? null : r1(f.previous.position),
          impressions: f.current.impressions,
          clicks: f.current.clicks,
        })),
      newQueries: g.newQueries.slice(0, 12).map((q) => ({ query: q.query, impressions: q.impressions, position: r1(q.position) })),
      topQueries: g.topQueries.slice(0, 15).map((q) => ({ query: q.query, clicks: q.clicks, impressions: q.impressions, position: r1(q.position) })),
    }
  }

  if (snapshot.ga4) {
    const g = snapshot.ga4
    const avgDaily = g.daily.length > 0 ? g.daily.reduce((s, x) => s + x.sessions, 0) / g.daily.length : 0
    d.ga4 = {
      sessions: g.current.sessions,
      prevSessions: g.previous.sessions,
      engagementRate: g.current.engagementRate,
      keyEvents: g.current.keyEvents,
      trackingOk: avgDaily >= 20,
      channels: g.channels.slice(0, 8).map((c) => ({ channel: c.channel, sessions: c.sessions })),
    }
  }

  if (snapshot.ads) {
    const a = snapshot.ads
    d.ads = {
      cost: r1(a.totals.cost),
      clicks: a.totals.clicks,
      conversions: r1(a.totals.conversions),
      campaigns: a.campaigns.map((c) => ({
        name: c.name,
        cost: r1(c.cost),
        clicks: c.clicks,
        conversions: r1(c.allConversions),
        impressionShare: c.impressionShare === null ? null : r1(c.impressionShare * 100),
        rankLostIS: c.rankLostIS === null ? null : r1(c.rankLostIS * 100),
        budgetLostIS: c.budgetLostIS === null ? null : r1(c.budgetLostIS * 100),
      })),
      brandCost: r1(a.brand.cost),
      nonBrandCost: r1(a.nonBrand.cost),
      topTerms: a.topTerms.slice(0, 15).map((t) => ({ term: t.term, cost: r1(t.cost), clicks: t.clicks, conversions: r1(t.conversions) })),
    }
  }

  if (snapshot.forms) {
    d.forms = {
      contact: snapshot.forms.current.contact,
      prevContact: snapshot.forms.previous.contact,
      career: snapshot.forms.current.career,
      spam: snapshot.forms.current.spam,
      gclidLeads: snapshot.forms.current.gclidLeads,
      feeTotal: snapshot.forms.current.feeTotal,
      profitTotal: snapshot.forms.current.profitTotal,
    }
  }

  return d
}

/**
 * Generate the Estonian narrative for a report. Returns null when no LLM
 * provider key is set or the API call fails (never blocks the report).
 */
export async function generateNarrative(snapshot: ReportSnapshot, insights: Insight[]): Promise<string | null> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const deepseekKey = process.env.DEEPSEEK_API_KEY
  if (!anthropicKey && !deepseekKey) return null

  const digest = buildDigest(snapshot, insights)
  const userContent =
    `Siin on möödunud nädala andmed (JSON) ja reeglipõhise mootori leiud. ` +
    `Koosta nende põhjal nädalaraporti analüütiline osa.\n\n` +
    JSON.stringify(digest, null, 1)

  if (anthropicKey) return callAnthropic(anthropicKey, userContent)
  return callDeepseek(deepseekKey!, userContent)
}

async function callAnthropic(apiKey: string, userContent: string): Promise<string | null> {
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5"
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
      }),
      signal: controller.signal,
    })
    if (!res.ok) {
      console.error(`Anthropic API ${res.status}: ${(await res.text()).slice(0, 300)}`)
      return null
    }
    const data = (await res.json()) as { content?: { type: string; text?: string }[] }
    const text = (data.content ?? []).filter((b) => b.type === "text").map((b) => b.text ?? "").join("").trim()
    return text || null
  } catch (error) {
    console.error("Anthropic narrative failed:", error instanceof Error ? error.message : error)
    return null
  } finally {
    clearTimeout(timer)
  }
}

/** DeepSeek chat completions (OpenAI-compatible schema). */
async function callDeepseek(apiKey: string, userContent: string): Promise<string | null> {
  const model = process.env.DEEPSEEK_MODEL ?? "deepseek-chat"
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
      }),
      signal: controller.signal,
    })
    if (!res.ok) {
      console.error(`DeepSeek API ${res.status}: ${(await res.text()).slice(0, 300)}`)
      return null
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const text = data.choices?.[0]?.message?.content?.trim()
    return text || null
  } catch (error) {
    console.error("DeepSeek narrative failed:", error instanceof Error ? error.message : error)
    return null
  } finally {
    clearTimeout(timer)
  }
}
