/**
 * AI-seire: kas AI-otsingud (ChatGPT/Gemini/Perplexity) SPS Gruppi soovitavad?
 *
 * Fikseeritud 12 päringut (ET/EN/RU) käivad üle nende AI-teenuste API-de,
 * mille võti on `.env.local`-is olemas (ühtegi pole kohustuslik):
 *   PERPLEXITY_API_KEY  -> Perplexity "sonar" (tagastab ka tsiteeritud allikad)
 *   OPENAI_API_KEY      -> OpenAI Responses API + web_search (annotatsioonid)
 *   GEMINI_API_KEY      -> Gemini 2.5 Flash + google_search grounding
 * Võtme saab: perplexity.ai/settings/api · platform.openai.com · aistudio.google.com
 *
 * Iga päringu kohta logitakse: (1) kas SPS on vastuses, (2) milliseid
 * konkurente mainitakse, (3) MILLISEID ALLIKAID tsiteeritakse — viimane
 * näitab, kuhu off-page tööd teha (kataloogid, listicle'id, arvustused).
 *
 * Kasutus:
 *   npm run report:ai-visibility            # täisjooks (kõik seadistatud teenused)
 *   npx tsx scripts/ai-visibility-check.ts --selftest   # analüsaatorite test ilma API-ta
 *
 * Väljund (raportid/ on gitignore'itud):
 *   raportid/ai-visibility/runs/<timestamp>.json  — toorandmed
 *   raportid/ai-visibility/LOG.md                 — jooksuv kuu-logi (trend)
 * Soovitus: käivita ~1x kuus ja võrdle LOG.md ridu.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs"
import path from "node:path"

/* ---------- env (.env.local is a Next convention; tsx does not load it) ---------- */

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}
loadEnvLocal()

/* ---------- Päringud (fikseeritud — ära muuda, muidu katkeb trend) ---------- */

interface SeirePrompt {
  id: string
  locale: "et" | "en" | "ru"
  text: string
}

const PROMPTS: SeirePrompt[] = [
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

/* ---------- Tuvastus (puhtad funktsioonid — --selftest kontrollib neid) ---------- */

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

function detectSps(answer: string): boolean {
  return SPS_RE.test(answer)
}

function detectCompetitors(answer: string): string[] {
  return COMPETITORS.filter((c) => c.re.test(answer)).map((c) => c.name)
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

/* ---------- Teenusepakkujad ---------- */

interface ProviderAnswer {
  text: string
  citations: string[]
}

interface Provider {
  id: string
  envKey: string
  run: (prompt: string) => Promise<ProviderAnswer>
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

const PROVIDERS: Provider[] = [
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

/* ---------- Jooks ---------- */

interface PromptResult {
  promptId: string
  locale: string
  prompt: string
  provider: string
  ok: boolean
  error?: string
  spsMentioned?: boolean
  competitors?: string[]
  citationDomains?: string[]
  answer?: string
}

async function runAll(): Promise<void> {
  const active = PROVIDERS.filter((p) => process.env[p.envKey])
  if (active.length === 0) {
    console.log("Ühtegi AI API võtit pole .env.local-is. Lisa vähemalt üks ja käivita uuesti:")
    for (const p of PROVIDERS) console.log(`  ${p.envKey}  (${p.id})`)
    console.log("\nPerplexity 'sonar' on soodsaim ja tagastab tsiteeritud allikad kohe kaasa.")
    console.log("Enne võtme lisamist saad analüsaatoreid testida: npx tsx scripts/ai-visibility-check.ts --selftest")
    return
  }

  console.log(`AI-seire: ${PROMPTS.length} päringut × ${active.length} teenust (${active.map((p) => p.id).join(", ")})`)
  const results: PromptResult[] = []
  for (const provider of active) {
    for (const p of PROMPTS) {
      process.stdout.write(`  [${provider.id}] ${p.id} ... `)
      try {
        const ans = await provider.run(p.text)
        results.push({
          promptId: p.id,
          locale: p.locale,
          prompt: p.text,
          provider: provider.id,
          ok: true,
          spsMentioned: detectSps(ans.text),
          competitors: detectCompetitors(ans.text),
          citationDomains: [...new Set(ans.citations.map(hostnameOf))],
          answer: ans.text,
        })
        console.log(results[results.length - 1].spsMentioned ? "SPS ✓" : "—")
      } catch (err) {
        results.push({ promptId: p.id, locale: p.locale, prompt: p.text, provider: provider.id, ok: false, error: String(err).slice(0, 200) })
        console.log(`VIGA: ${String(err).slice(0, 120)}`)
      }
    }
  }

  /* Koond */
  const byProvider = new Map<string, PromptResult[]>()
  for (const r of results) {
    const list = byProvider.get(r.provider) ?? []
    list.push(r)
    byProvider.set(r.provider, list)
  }
  const competitorCount = new Map<string, number>()
  const domainCount = new Map<string, number>()
  for (const r of results) {
    if (!r.ok) continue
    for (const c of r.competitors ?? []) competitorCount.set(c, (competitorCount.get(c) ?? 0) + 1)
    for (const d of r.citationDomains ?? []) domainCount.set(d, (domainCount.get(d) ?? 0) + 1)
  }

  console.log("\n== SPS mainimise määr teenuse kaupa ==")
  for (const [provider, list] of byProvider) {
    const ok = list.filter((r) => r.ok)
    const hits = ok.filter((r) => r.spsMentioned).length
    console.log(`  ${provider}: ${hits}/${ok.length} päringust mainib SPS-i`)
  }
  console.log("\n== Konkurendid (mitu vastust mainib) ==")
  for (const [name, count] of [...competitorCount.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${name}: ${count}`)
  }
  if (competitorCount.size === 0) console.log("  (ühtegi tuntud konkurenti ei mainitud)")
  console.log("\n== Tsiteeritud allikad (domeenid, sageduse järjekorras — siia suuna off-page tööd) ==")
  for (const [domain, count] of [...domainCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`  ${domain}: ${count}`)
  }
  if (domainCount.size === 0) console.log("  (teenused ei tagastanud allikaviiteid)")

  /* Salvestus */
  const dir = path.join("raportid", "ai-visibility")
  mkdirSync(path.join(dir, "runs"), { recursive: true })
  const stamp = new Date().toISOString()
  const runFile = path.join(dir, "runs", `${stamp.replace(/[:.]/g, "-")}.json`)
  writeFileSync(runFile, JSON.stringify({ generatedAt: stamp, prompts: PROMPTS.length, providers: active.map((p) => p.id), results }, null, 2), "utf8")

  const logLines: string[] = []
  logLines.push(`\n## ${stamp.slice(0, 10)} (${active.map((p) => p.id).join(", ")})`)
  for (const [provider, list] of byProvider) {
    const ok = list.filter((r) => r.ok)
    const hits = ok.filter((r) => r.spsMentioned).length
    logLines.push(`- ${provider}: SPS mainitud ${hits}/${ok.length} päringus`)
    for (const r of ok.filter((x) => x.spsMentioned)) logLines.push(`  - ✓ ${r.promptId}`)
  }
  const topComp = [...competitorCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  logLines.push(`- Konkurendid: ${topComp.length > 0 ? topComp.map(([n, c]) => `${n} (${c})`).join(", ") : "—"}`)
  const topDom = [...domainCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
  logLines.push(`- Allikad: ${topDom.length > 0 ? topDom.map(([d, c]) => `${d} (${c})`).join(", ") : "—"}`)
  appendFileSync(path.join(dir, "LOG.md"), logLines.join("\n") + "\n", "utf8")

  console.log(`\nSalvestatud: ${runFile}`)
  console.log(`Logi: ${path.join(dir, "LOG.md")}`)
}

/* ---------- --selftest: analüsaatorite kontroll ilma API-ta ---------- */

function selfTest(): void {
  const cases: { answer: string; expectSps: boolean; expectCompetitors: string[] }[] = [
    {
      answer: "Tallinnas tasub kaaluda SPS Gruppi, SOL Balticsi ja ISS-i — kõik pakuvad regulaarset hoolduskoristust äripindadel.",
      expectSps: true,
      expectCompetitors: ["SOL", "ISS"],
    },
    {
      answer: "Soovitused: Clean Planet, Forus ja Puhastusmeistrid. Hinnad algavad tavaliselt 1,20 €/m² kuus.",
      expectSps: false,
      expectCompetitors: ["Clean Planet", "Forus", "Puhastusmeistrid"],
    },
    {
      answer: "For office cleaning in Tallinn consider SPS Grupp (spsgrupp.ee) or CleanNet-style local firms.",
      expectSps: true,
      expectCompetitors: [],
    },
    {
      answer: "Крупные компании: СОЛ, ISS, а также местные фирмы вроде Happy Clean.",
      expectSps: false,
      expectCompetitors: ["ISS", "Happy Clean"],
    },
  ]
  let failed = 0
  for (const [i, c] of cases.entries()) {
    const sps = detectSps(c.answer)
    const comp = detectCompetitors(c.answer)
    const compOk = c.expectCompetitors.every((e) => comp.includes(e))
    if (sps !== c.expectSps || !compOk) {
      failed++
      console.error(`SELFTEST ${i + 1} FAIL: sps=${sps} (ootus ${c.expectSps}), konkurendid=[${comp.join(", ")}] (ootus sisaldab [${c.expectCompetitors.join(", ")}])`)
    }
  }
  // hostinimede normaliseerimine
  if (hostnameOf("https://www.delfi.ee/artikkel/123?x=1") !== "delfi.ee") {
    failed++
    console.error("SELFTEST hostname FAIL")
  }
  if (failed === 0) console.log(`SELFTEST OK (${cases.length} analüüsi juhtu + hostname normaliseerimine)`)
  else process.exit(1)
}

/* ---------- main ---------- */

if (process.argv.includes("--selftest")) {
  selfTest()
} else {
  runAll().catch((err) => {
    console.error("Fatal error:", err)
    process.exit(2)
  })
}
