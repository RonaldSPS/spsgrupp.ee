/**
 * AI-nähtavuse seire (AEO): fikseeritud 12 päringut (ET/EN/RU) käivad üle
 * nende AI-teenuste API-de, mille võti on keskkonnas olemas (ühtegi pole
 * kohustuslik):
 *   PERPLEXITY_API_KEY  -> Perplexity "sonar" (tagastab tsiteeritud allikad)
 *   OPENAI_API_KEY      -> OpenAI Responses API + web_search (annotatsioonid)
 *   GEMINI_API_KEY      -> Gemini 2.5 Flash + google_search grounding
 *
 * Iga päringu kohta logitakse: (1) kas SPS on vastuses, (2) milliseid
 * konkurente mainitakse, (3) MILLISEID ALLIKAID tsiteeritakse — viimane
 * näitab, kuhu off-page tööd suunata (kataloogid, listicle'id, arvustused).
 *
 * Tarvitajad:
 *   - nädalaraport (snapshot.ts -> snapshot.aiVisibility -> e-kiri + digest)
 *   - scripts/ai-visibility-check.ts (käsitsi jooks, toorandmed faili)
 *
 * PUHAS serverless-kood: failikirjutust siin EI ole (Vercel FS on read-only) —
 * toorandmete salvestamise teeb CLI-skript, raportis säilib koond snapshot'is.
 */

import type { AiVisibilityData } from "./types"

/* ---------- Päringud (fikseeritud — ära muuda, muidu katkeb trend) ---------- */

export interface AiSeirePrompt {
  id: string
  locale: "et" | "en" | "ru"
  text: string
}

export const AI_VISIBILITY_PROMPTS: AiSeirePrompt[] = [
  { id: "et-hooldus", locale: "et", text: "Millist koristusfirmat sa Tallinnas soovitaksid ettevõttele, kes vajab regulaarset hoolduskoristust äripindadel? Nimeta konkreetseid firmasid." },
  { id: "et-kontor", locale: "et", text: "Kellele usaldada kontori koristus Tallinnas? Soovita konkreetseid ettevõtteid." },
  { id: "et-kaubandus", locale: "et", text: "Milline firma pakub kaubanduskeskuste ja kaupluste koristusteenust Tallinnas?" },
  { id: "et-tootmine", locale: "et", text: "Soovita koristusfirmat tootmishoone ja lao koristuseks Harjumaal." },
  { id: "et-hind", locale: "et", text: "Kui palju maksab hoolduskoristus Tallinnas ja kellelt seda tellida?" },
  { id: "et-suurimad", locale: "et", text: "Millised on suurimad ja usaldusväärseimad koristusfirmad Eestis?" },
  { id: "et-vahetus", locale: "et", text: "Tahan vahetada ettevõtte koristuspartnerit — kuidas valida ja keda Tallinnas kaaluda?" },
  { id: "en-office", locale: "en", text: "Which cleaning company would you recommend for regular office cleaning in Tallinn, Estonia? Name specific companies." },
  { id: "en-commercial", locale: "en", text: "What are the best commercial cleaning companies in Tallinn for businesses?" },
  { id: "en-maintenance", locale: "en", text: "Who provides reliable maintenance cleaning for commercial properties in Harju County, Estonia?" },
  { id: "ru-office", locale: "ru", text: "Какую клининговую компанию ты порекомендуешь для регулярной уборки офиса в Таллине? Назови конкретные компании." },
  { id: "ru-commercial", locale: "ru", text: "Лучшие клининговые компании Таллина для обслуживания бизнес-объектов?" },
]

/* ---------- Tuvastus (puhtad funktsioonid — CLI --selftest kontrollib neid) ---------- */

const SPS_RE = /\bsps\b|spsgrupp/i

/** Konkurendid (nimekiri kooskõlas Ads'i negatiivsete/auditi skriptidega). */
const COMPETITORS: { name: string; re: RegExp }[] = [
  { name: "SOL", re: /\bSOL\b/ },
  { name: "ISS", re: /\bISS\b/ },
  { name: "Clean Planet", re: /clean ?planet/i },
  { name: "Liisu Puhastusteenused", re: /liisu/i },
  { name: "Forus", re: /\bforus\b/i },
  { name: "Kvatro", re: /kvatro/i },
  { name: "Tondi Puhastus", re: /\btondi\b/i },
  { name: "Multiclean", re: /multi ?clean/i },
  { name: "Euroclean", re: /euro ?clean/i },
  { name: "Happy Clean", re: /happy ?clean/i },
  { name: "GoClean", re: /\bgo ?clean/i },
  { name: "CleanSmart", re: /clean ?smart/i },
  { name: "Masterclean", re: /master ?clean/i },
  { name: "Kleenest", re: /kleenest/i },
  { name: "Lavida Clean", re: /lavida/i },
  { name: "Puhastusmeistrid", re: /puhastusmeistr/i },
  { name: "Cleanpoint", re: /clean ?point/i },
  { name: "Cleanstep", re: /clean ?step/i },
  { name: "Global Cleaning", re: /global ?cleaning/i },
  { name: "Easy Clean", re: /easy ?clean/i },
  { name: "Clean Control", re: /clean ?control/i },
  { name: "Cleaning Center", re: /cleaning center/i },
  { name: "Anhel", re: /\banhel\b/i },
  { name: "Ecocare", re: /eco ?care/i },
  { name: "Prof Puhastus", re: /prof ?puhastus/i },
  { name: "Ecolab", re: /ecolab/i },
  { name: "Diversey", re: /diversey/i },
  { name: "Wetrok", re: /wetrok/i },
]

export function detectSps(answer: string): boolean {
  return SPS_RE.test(answer)
}

export function detectCompetitors(answer: string): string[] {
  return COMPETITORS.filter((c) => c.re.test(answer)).map((c) => c.name)
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

/** Päringu tekst id järgi (snapshot hoiab ainult id'd — tekst on siin fikseeritud). */
export const AI_PROMPT_BY_ID: Record<string, AiSeirePrompt> = Object.fromEntries(
  AI_VISIBILITY_PROMPTS.map((p) => [p.id, p]),
)

/** Lühike kontekstinipp SPS-mainimise ümbert (e-kiri/admin: „mis kontekstis
 *  SPS välja tuleb"). Võtab mainimist sisaldava lause; vanadel snapshotidel puudub. */
export function spsMentionSnippet(answer: string, maxLen = 220): string | undefined {
  const normalized = answer
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // markdown-lingid -> tekst
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
  if (!normalized) return undefined
  const hit = normalized.split(/(?<=[.!?])\s+/).find((s) => SPS_RE.test(s))
  if (hit) return hit.length <= maxLen ? hit : hit.slice(0, maxLen - 1).replace(/\s+\S*$/, "") + "…"
  const m = SPS_RE.exec(normalized)
  if (!m) return undefined
  const from = Math.max(0, m.index - 60)
  return (from > 0 ? "…" : "") + normalized.slice(from, from + maxLen).replace(/\s+\S*$/, "") + "…"
}

/* ---------- Tsiteeritud domeenide klassifikatsioon (konstruktiivne tegevusplaan) ---------- */

export type AiSourceClass = "own" | "platform" | "thirdparty" | "competitor" | "unknown"

/** Meie oma. */
const OWN_DOMAINS = new Set(["spsgrupp.ee"])

/** Platvormid, kus SPS ise saab sisu hallata (GBP, sotsiaal, Wikipedia/Wikidata). */
const PLATFORM_DOMAINS = new Set([
  "google.com", "facebook.com", "linkedin.com", "instagram.com",
  "wikipedia.org", "wikidata.org", "youtube.com", "tiktok.com",
])

/** Kolmandad osapooled, kus SPS-i kajastust SAAB kasvatada (kataloogid, register, meedia, arvustused). */
const THIRD_PARTY_DOMAINS = new Set([
  "ariregister.rik.ee", "inforegister.ee", "firmad.ee", "ettevotteraamat.ee",
  "delfi.ee", "aripaev.ee", "geenius.ee", "err.ee", "postimees.ee", "ohtuleht.ee",
  "tootukassa.ee", "cv.ee", "cvkeskus.ee", "indeed.ee", "bioneer.ee", "taust.ee",
])

/** Konkurentide endi lehed — otse mõjutada EI SAA (tuvastatud Ads'i
 *  negatiivsete nimekirjadest + AI-seire tsitaatidest, nt 12.11.2026 jooks).
 *  SRP Grupp (srpgrupp.ee) on eraldi firma, ära aja kunagi SPS-iga segi. */
const COMPETITOR_DOMAINS = new Set([
  "sol.ee", "iss.ee", "issworld.com", "cleanplanet.ee", "forus.ee", "multiclean.ee",
  "euroclean.ee", "happyclean.ee", "goclean.ee", "cleansmart.ee", "masterclean.ee",
  "kleenest.ee", "lavidaclean.ee", "puhastusmeistrid.ee", "cleanpoint.ee", "cleanstep.ee",
  "globalcleaning.ee", "easyclean.ee", "cleancontrol.ee", "cleaningcenter.ee",
  "anhel.ee", "ecocare.ee", "profpuhastus.ee", "ecolab.com", "ecolab.ee",
  "diversey.com", "wetrok.com", "puhastustiim.ee", "smilecleaning.ee", "castellest.ee",
  "luxpuhastus.ee", "kitclean.ee", "eliitserv.ee", "coralclean.ee", "ihp.ee",
  "srpgrupp.ee", "puhastusteenused.com", "tondipuhastus.ee", "liisupuhastus.ee",
  "kronauer.ee",
])

export function classifyAiSourceDomain(domain: string): AiSourceClass {
  const d = domain.toLowerCase()
  if (OWN_DOMAINS.has(d) || d.endsWith(".spsgrupp.ee")) return "own"
  if (
    PLATFORM_DOMAINS.has(d) ||
    d.endsWith(".google.com") ||
    d.endsWith(".wikipedia.org") ||
    d.endsWith(".linkedin.com") ||
    d.endsWith(".facebook.com")
  ) return "platform"
  if (THIRD_PARTY_DOMAINS.has(d)) return "thirdparty"
  if (COMPETITOR_DOMAINS.has(d)) return "competitor"
  return "unknown"
}

/* ---------- Teenusepakkujad ---------- */

export interface AiProviderAnswer {
  text: string
  citations: string[]
}

interface AiProvider {
  id: string
  envKey: string
  run: (prompt: string) => Promise<AiProviderAnswer>
}

const SYSTEM_HINT =
  "Answer concretely and name specific companies when the question asks for recommendations. Answer in the same language as the question."

async function postJsonWithTimeout<T>(url: string, headers: Record<string, string>, body: unknown, timeoutMs = 90000): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

const PROVIDERS: AiProvider[] = [
  {
    id: "perplexity",
    envKey: "PERPLEXITY_API_KEY",
    run: async (prompt) => {
      const data = await postJsonWithTimeout<{
        choices?: { message?: { content?: string } }[]
        citations?: string[]
      }>(
        "https://api.perplexity.ai/chat/completions",
        { authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}` },
        {
          model: "sonar",
          messages: [
            { role: "system", content: SYSTEM_HINT },
            { role: "user", content: prompt },
          ],
        },
      )
      return {
        text: data.choices?.[0]?.message?.content ?? "",
        citations: data.citations ?? [],
      }
    },
  },
  {
    id: "openai",
    envKey: "OPENAI_API_KEY",
    run: async (prompt) => {
      const data = await postJsonWithTimeout<{
        output?: {
          type: string
          content?: {
            type: string
            text?: string
            annotations?: { type: string; url?: string }[]
          }[]
        }[]
      }>(
        "https://api.openai.com/v1/responses",
        { authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        {
          model: "gpt-4o",
          tools: [{ type: "web_search_preview" }],
          input: [
            { role: "system", content: SYSTEM_HINT },
            { role: "user", content: prompt },
          ],
        },
      )
      const texts: string[] = []
      const citations: string[] = []
      for (const item of data.output ?? []) {
        if (item.type !== "message") continue
        for (const part of item.content ?? []) {
          if (part.type === "output_text" && part.text) {
            texts.push(part.text)
            for (const ann of part.annotations ?? []) {
              if (ann.type === "url_citation" && ann.url) citations.push(ann.url)
            }
          }
        }
      }
      return { text: texts.join("\n"), citations }
    },
  },
  {
    id: "gemini",
    envKey: "GEMINI_API_KEY",
    run: async (prompt) => {
      const data = await postJsonWithTimeout<{
        candidates?: {
          content?: { parts?: { text?: string }[] }
          groundingMetadata?: { groundingChunks?: { web?: { uri?: string } }[] }
        }[]
      }>(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {},
        {
          systemInstruction: { parts: [{ text: SYSTEM_HINT }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
        },
      )
      const cand = data.candidates?.[0]
      return {
        text: (cand?.content?.parts ?? []).map((p) => p.text ?? "").join("\n"),
        citations: (cand?.groundingMetadata?.groundingChunks ?? [])
          .map((c) => c.web?.uri)
          .filter((u): u is string => Boolean(u)),
      }
    },
  },
]

/** Millised teenused on seadistatud (võti keskkonnas olemas). */
export function activeAiProviders(): string[] {
  return PROVIDERS.filter((p) => process.env[p.envKey]).map((p) => p.id)
}

/* ---------- Jooks + koond ---------- */

export interface AiVisibilityPromptRun {
  promptId: string
  locale: string
  prompt: string
  ok: boolean
  error?: string
  spsMentioned?: boolean
  competitors?: string[]
  citationDomains?: string[]
  /** Täisvastus — CLI salvestab faili; snapshot seda EI hoia. */
  answer?: string
}

export interface AiVisibilityProviderRun {
  provider: string
  results: AiVisibilityPromptRun[]
}

export interface AiVisibilityRun {
  generatedAt: string
  providers: AiVisibilityProviderRun[]
}

/** Käivitab kõik seadistatud teenused × 12 päringut. null = ühtegi võtit pole. */
export async function checkAiVisibility(
  onProgress?: (provider: string, promptId: string, sps: boolean | null) => void,
): Promise<AiVisibilityRun | null> {
  const active = PROVIDERS.filter((p) => process.env[p.envKey])
  if (active.length === 0) return null

  const providers: AiVisibilityProviderRun[] = []
  for (const provider of active) {
    const results: AiVisibilityPromptRun[] = []
    for (const p of AI_VISIBILITY_PROMPTS) {
      try {
        const ans = await provider.run(p.text)
        const run: AiVisibilityPromptRun = {
          promptId: p.id,
          locale: p.locale,
          prompt: p.text,
          ok: true,
          spsMentioned: detectSps(ans.text),
          competitors: detectCompetitors(ans.text),
          citationDomains: [...new Set(ans.citations.map(hostnameOf))],
          answer: ans.text,
        }
        results.push(run)
        onProgress?.(provider.id, p.id, run.spsMentioned ?? null)
      } catch (err) {
        results.push({ promptId: p.id, locale: p.locale, prompt: p.text, ok: false, error: String(err).slice(0, 200) })
        onProgress?.(provider.id, p.id, null)
      }
    }
    providers.push({ provider: provider.id, results })
  }
  return { generatedAt: new Date().toISOString(), providers }
}

/** Toorjooks -> kompaktne snapshot'i koond (ilma täisvastusteta). */
export function summarizeAiRun(run: AiVisibilityRun): AiVisibilityData {
  const competitorCount = new Map<string, number>()
  const domainCount = new Map<string, number>()
  const providers = run.providers.map((pr) => {
    const ok = pr.results.filter((r) => r.ok)
    for (const r of ok) {
      for (const c of r.competitors ?? []) competitorCount.set(c, (competitorCount.get(c) ?? 0) + 1)
      for (const d of r.citationDomains ?? []) domainCount.set(d, (domainCount.get(d) ?? 0) + 1)
    }
    return {
      provider: pr.provider,
      asked: ok.length,
      mentioned: ok.filter((r) => r.spsMentioned).length,
      failed: pr.results.length - ok.length,
      prompts: pr.results.map((r) => ({
        id: r.promptId,
        locale: r.locale,
        sps: r.ok ? (r.spsMentioned ?? false) : null,
        competitors: r.competitors ?? [],
        domains: r.citationDomains ?? [],
        ...(r.ok && r.spsMentioned
          ? { snippet: spsMentionSnippet(r.answer ?? "") }
          : {}),
      })),
    }
  })
  return {
    generatedAt: run.generatedAt,
    providers,
    topCompetitors: [...competitorCount.entries()].sort((a, b) => b[1] - a[1]),
    topDomains: [...domainCount.entries()].sort((a, b) => b[1] - a[1]),
  }
}
