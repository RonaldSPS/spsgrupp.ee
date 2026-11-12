/**
 * AI-seire CLI (käsitsi jooks, nt 1x kuus): kas AI-otsingud SPS-i soovitavad?
 *
 * Tuum on jagatud nädalaraportiga: lib/reporting/ai-visibility.ts (päringud,
 * teenused, tuvastus). See skript lisab: .env.local laadimine, konsooliväljund
 * ja toorandmete salvestus faili (raportid/ on gitignore'itud):
 *   raportid/ai-visibility/runs/<timestamp>.json  — toorandmed (täisvastused)
 *   raportid/ai-visibility/LOG.md                 — jooksuv kuu-logi (trend)
 *
 * Kasutus:
 *   npm run report:ai-visibility                        # täisjooks
 *   npx tsx scripts/ai-visibility-check.ts --selftest   # analüsaatorite test
 *
 * Märkus: nädalaraport (Vercel cron) käivitab sama kontrolli automaatselt,
 * kui vähemalt üks AI API võti on env'is — see skript on süvitsi vaatamiseks
 * (täisvastused ja tsitaadid failis).
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

import {
  AI_VISIBILITY_PROMPTS,
  activeAiProviders,
  checkAiVisibility,
  classifyAiSourceDomain,
  detectCompetitors,
  detectSps,
  hostnameOf,
  spsMentionSnippet,
  summarizeAiRun,
} from "../lib/reporting/ai-visibility"

/* ---------- Jooks ---------- */

async function runAll(): Promise<void> {
  const active = activeAiProviders()
  if (active.length === 0) {
    console.log("Ühtegi AI API võtit pole .env.local-is. Lisa vähemalt üks ja käivita uuesti:")
    console.log("  PERPLEXITY_API_KEY  (perplexity — soodsaim, tagastab tsiteeritud allikad)")
    console.log("  OPENAI_API_KEY  (openai)")
    console.log("  GEMINI_API_KEY  (gemini)")
    console.log("\nEnne võtme lisamist saad analüsaatoreid testida: npx tsx scripts/ai-visibility-check.ts --selftest")
    return
  }

  console.log(`AI-seire: ${AI_VISIBILITY_PROMPTS.length} päringut × ${active.length} teenust (${active.join(", ")})`)
  const run = await checkAiVisibility((provider, promptId, sps) => {
    console.log(`  [${provider}] ${promptId} ... ${sps === null ? "VIGA" : sps ? "SPS ✓" : "—"}`)
  })
  if (!run) return
  const summary = summarizeAiRun(run)

  console.log("\n== SPS mainimise määr teenuse kaupa ==")
  for (const p of summary.providers) {
    console.log(`  ${p.provider}: ${p.mentioned}/${p.asked} päringust mainib SPS-i${p.failed > 0 ? ` (${p.failed} ebaõnnestus)` : ""}`)
  }
  console.log("\n== Konkurendid (mitu vastust mainib) ==")
  for (const [name, count] of summary.topCompetitors) console.log(`  ${name}: ${count}`)
  if (summary.topCompetitors.length === 0) console.log("  (ühtegi tuntud konkurenti ei mainitud)")
  console.log("\n== Tsiteeritud allikad (domeenid, sageduse järjekorras — siia suuna off-page tööd) ==")
  for (const [domain, count] of summary.topDomains.slice(0, 20)) console.log(`  ${domain}: ${count}`)
  if (summary.topDomains.length === 0) console.log("  (teenused ei tagastanud allikaviiteid)")

  /* Salvestus */
  const dir = path.join("raportid", "ai-visibility")
  mkdirSync(path.join(dir, "runs"), { recursive: true })
  const stamp = run.generatedAt
  const runFile = path.join(dir, "runs", `${stamp.replace(/[:.]/g, "-")}.json`)
  writeFileSync(runFile, JSON.stringify({ ...run, promptsTotal: AI_VISIBILITY_PROMPTS.length }, null, 2), "utf8")

  const logLines: string[] = []
  logLines.push(`\n## ${stamp.slice(0, 10)} (${active.join(", ")})`)
  for (const p of summary.providers) {
    logLines.push(`- ${p.provider}: SPS mainitud ${p.mentioned}/${p.asked} päringus`)
    for (const pr of p.prompts.filter((x) => x.sps === true)) logLines.push(`  - ✓ ${pr.id}`)
  }
  logLines.push(`- Konkurendid: ${summary.topCompetitors.length > 0 ? summary.topCompetitors.slice(0, 8).map(([n, c]) => `${n} (${c})`).join(", ") : "—"}`)
  logLines.push(`- Allikad: ${summary.topDomains.length > 0 ? summary.topDomains.slice(0, 10).map(([d, c]) => `${d} (${c})`).join(", ") : "—"}`)
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
  if (hostnameOf("https://www.delfi.ee/artikkel/123?x=1") !== "delfi.ee") {
    failed++
    console.error("SELFTEST hostname FAIL")
  }
  // kontekstinipp: leiab SPS-mainimise lause
  const snip = spsMentionSnippet("Esmalt SOL. Teiseks tasub kaaluda SPS Gruppi, kes teenindab kontoreid Tallinnas. Kolmandaks ISS.")
  if (!snip || !/SPS/.test(snip) || snip.includes("Esmalt SOL")) {
    failed++
    console.error(`SELFTEST snippet FAIL: ${JSON.stringify(snip)}`)
  }
  // domeeni klassifikatsioon: oma/platvorm/kolmas/konkurent/tundmatu
  const cls: [string, string][] = [
    ["spsgrupp.ee", "own"],
    ["google.com", "platform"],
    ["ariregister.rik.ee", "thirdparty"],
    ["smilecleaning.ee", "competitor"],
    ["ihp.ee", "competitor"],
    ["puhastusteenused.com", "competitor"],
    ["srpgrupp.ee", "competitor"],
    ["mingi-tundmatu.ee", "unknown"],
  ]
  for (const [domain, expected] of cls) {
    const got = classifyAiSourceDomain(domain)
    if (got !== expected) {
      failed++
      console.error(`SELFTEST classify FAIL: ${domain} -> ${got} (ootus ${expected})`)
    }
  }
  if (failed === 0) console.log(`SELFTEST OK (${cases.length} analüüsi juhtu + hostname + snippet + ${cls.length} domeeni klassifikatsiooni)`)
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
