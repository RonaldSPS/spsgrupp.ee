/**
 * Read-only verifitseerimine 01.11.2026: SEO-spetsialisti vastus vs
 * 23.10.2026 põhikampaania audit (google-ads-pohikampaania-puudused-ja-parandusplaan).
 *
 * Kontrollib:
 *  1. Põhikampaania (22548785025) pakkumisstrateegia ja olek (A1).
 *  2. Kas „konkurendi/tarnija" märksõnad on POSITIIVSED või negatiivsed (C1).
 *  3. Kas „ise/tasuta/müük…" on positiivsed märksõnad (C2).
 *  4. Kas kodu/korteri märksõnad on positiivsed „Kontori koristus" grupis (C3).
 *  5. AD_IMAGE assetid kampaania- vs grupi-tasemel (E2).
 *  6. Jagatud negatiivsete nimekirjade sidumine (F1).
 *  7. P26 vs põhikampaania ENABLED-positiivsete märksõnade kattuvus (C7).
 *  8. P26 metrikad 22.–28.10 ja viimased 14 päeva (C7 tõend).
 *
 * EI MUUDA MIDAGI — ainult GAQL SELECT-päringud.
 */

import { readFileSync, existsSync } from "node:fs"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq === -1) continue
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim()
    if (k && process.env[k] === undefined) process.env[k] = v
  }
}
loadEnvLocal()

const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"
const HAS_OAUTH = Boolean(process.env.GOOGLE_ADS_REFRESH_TOKEN && process.env.GOOGLE_ADS_CLIENT_ID && process.env.GOOGLE_ADS_CLIENT_SECRET)
const ADS_API_VERSION = "v25"

const MAIN_CAMPAIGN_ID = "22548785025" // Otsing - Teenused - 2026

/** Konkurendi-/tarnija-brändid (C1 tõend + 23.10 puhastuse nimekiri). */
const COMPETITOR_TOKENS = [
  "sol", "kendra", "ecolab", "multiclean", "laverna", "dussmann", "moppi", "wiseclean",
  "puhastusmeistrid", "clean planet", "happy clean", "goclean", "go clean", "euroclean",
  "masterclean", "squeaky clean", "squeeky clean", "the clean team", "ecoclean", "ecorun",
  "cleanpoint", "cleanstep", "cleaning center", "global cleaning", "e clean", "iss cleaning",
  "iss puhastus", "cleansmart", "cleann", "easy clean", "clean control", "krausberg puhastus",
  "wetrok", "diversey", "bacillol", "hagleitner", "impuhastus", "liisu puhastusteenused",
]

/** C2: negatiiv-intent sõnad, mida audit nimetas positiivseteks PHRASE-märksõnadeks. */
const C2_WORDS = new Set(["ise", "tasuta", "müük", "foorum", "blogi", "koolitus", "tööpakkumine", "juhend", "kasutatud", "artikkel", "kuidas"])

/** C3: B2C kodu/korteri märksõnad, mida audit nimetas „Kontori koristus" grupi positiivseteks. */
const C3_WORDS = new Set([
  "korteri koristus", "korteri koristus tallinn", "korteri suurpuhastus", "korterite puhastus",
  "kodukoristus tallinn", "kodukoristus tallinnas", "kodukoristusteenus", "kodukoristuse hind",
  "kodu koristaja", "koristaja koju", "kodu koristusteenus", "korteri puhastusteenus",
  "korteri puhastus", "korterite koristus",
])

type Row = Record<string, Record<string, unknown> | undefined>

async function getAccessToken(): Promise<string> {
  if (!HAS_OAUTH) {
    if (!existsSync(KEY_FILE)) throw new Error(`Autentimine puudub: ${KEY_FILE} puudub ja OAuth kolmikut pole.`)
    const { GoogleAuth } = await import("google-auth-library")
    const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes: ["https://www.googleapis.com/auth/adwords"] })
    const client = await auth.getClient()
    const token = await client.getAccessToken()
    if (!token.token) throw new Error("Teenuskonto access tokeni loomine ebaõnnestus")
    return token.token
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  })
  const data = (await res.json()) as { access_token?: string; error_description?: string }
  if (!data.access_token) throw new Error(`OAuth refresh ebaõnnestus: ${data.error_description ?? ""}`)
  return data.access_token
}

async function gaql(token: string, query: string): Promise<Row[]> {
  const rows: Row[] = []
  let pageToken: string | undefined
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": DEVELOPER_TOKEN!,
    "Content-Type": "application/json",
  }
  do {
    const res = await fetch(
      `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/googleAds:search`,
      { method: "POST", headers: h, body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }) },
    )
    if (!res.ok) throw new Error(`GAQL ebaõnnestus (${res.status}): ${(await res.text()).slice(0, 500)}`)
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

function g(row: Row, key: string): Record<string, unknown> {
  return (row[key] ?? {}) as Record<string, unknown>
}
function s(obj: Record<string, unknown>, key: string): string {
  const v = obj[key] ?? obj[key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())]
  return v === undefined || v === null ? "" : String(v)
}
function isCompetitor(text: string): boolean {
  return COMPETITOR_TOKENS.some((t) => text === t || text.startsWith(t + " ") || text.endsWith(" " + t) || text.includes(" " + t + " "))
}

interface KwRow { group: string; groupStatus: string; status: string; negative: boolean; text: string; match: string }

async function getKeywords(token: string, campaignId: string): Promise<KwRow[]> {
  const rows = await gaql(
    token,
    `SELECT ad_group.name, ad_group.status, ad_group_criterion.status, ad_group_criterion.negative, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type
     FROM ad_group_criterion
     WHERE campaign.id = ${campaignId} AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED'`,
  )
  return rows.map((r) => {
    const c = g(r, "adGroupCriterion")
    const kw = g(c as never as Row, "keyword")
    const ag = g(r, "adGroup")
    return {
      group: s(ag, "name"),
      groupStatus: s(ag, "status").toUpperCase(),
      status: s(c, "status").toUpperCase(),
      negative: s(c, "negative").toLowerCase() === "true",
      text: s(kw, "text").toLowerCase().trim(),
      match: s(kw, "match_type").toUpperCase(),
    }
  })
}

async function main() {
  if (!DEVELOPER_TOKEN || !CUSTOMER_ID) throw new Error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID puuduvad")
  const token = await getAccessToken()
  console.log("READ-ONLY verifitseerimine — midagi ei muudeta.\n")

  /* 1) Kampaaniad + pakkumisstrateegia */
  const camps = await gaql(
    token,
    `SELECT campaign.id, campaign.name, campaign.status, campaign.bidding_strategy_type, campaign_budget.amount_micros
     FROM campaign WHERE campaign.status != 'REMOVED'`,
  )
  console.log("=== 1) Kampaaniad ===")
  const p26Ids: string[] = []
  for (const r of camps) {
    const c = g(r, "campaign")
    const b = g(r, "campaignBudget")
    const id = s(c, "id"), name = s(c, "name")
    if (name.startsWith("P26")) p26Ids.push(id)
    const eur = (Number(s(b, "amount_micros") || 0) / 1e6).toFixed(2)
    console.log(`  ${id}  ${s(c, "status").padEnd(8)}  ${s(c, "bidding_strategy_type").padEnd(22)}  €${eur}/päev  ${name}`)
  }

  /* 2–4) Põhikampaania märksõnad: positiivsed vs negatiivsed */
  const kws = await getKeywords(token, MAIN_CAMPAIGN_ID)
  const pos = kws.filter((k) => !k.negative)
  const neg = kws.filter((k) => k.negative)
  const posEnabled = pos.filter((k) => k.status === "ENABLED")
  const posEnabledActiveGroup = posEnabled.filter((k) => k.groupStatus === "ENABLED")
  console.log("\n=== 2) Põhikampaania märksõnad (grupi-tase) ===")
  console.log(`  kokku (mitte REMOVED): ${kws.length}  |  positiivsed: ${pos.length}  |  grupi-taseme negatiivsed: ${neg.length}`)
  console.log(`  positiivsed ENABLED: ${posEnabled.length}  |  neist ENABLED gruppides: ${posEnabledActiveGroup.length}`)

  const compPos = posEnabled.filter((k) => isCompetitor(k.text))
  const compNeg = neg.filter((k) => isCompetitor(k.text))
  console.log(`\n  C1 — konkurendi/tarnija-märksõnad:`)
  console.log(`    POSITIIVSED ENABLED: ${compPos.length}${compPos.length ? "  <<< auditi väide kinnituks" : "  (spetsialistil õigus — junk on välistused)"}`)
  for (const k of compPos.slice(0, 30)) console.log(`      ${k.text} [${k.match}] (${k.group})`)
  console.log(`    grupi-taseme NEGATIIVSED (mitte REMOVED): ${compNeg.length}`)

  const c2Pos = posEnabled.filter((k) => C2_WORDS.has(k.text))
  console.log(`\n  C2 — „ise/tasuta/müük…" POSITIIVSED ENABLED: ${c2Pos.length}${c2Pos.length ? "  <<< auditi väide kinnituks" : "  (spetsialistil õigus)"}`)
  for (const k of c2Pos) console.log(`      ${k.text} [${k.match}] (${k.group})`)

  const c3Pos = posEnabled.filter((k) => C3_WORDS.has(k.text))
  console.log(`\n  C3 — kodu/korter POSITIIVSED ENABLED: ${c3Pos.length}${c3Pos.length ? "  <<< auditi väide kinnituks" : "  (spetsialistil õigus)"}`)
  for (const k of c3Pos) console.log(`      ${k.text} [${k.match}] (${k.group})`)

  /* kampaania-taseme negatiivsed */
  const campNeg = await gaql(
    token,
    `SELECT campaign_criterion.resource_name FROM campaign_criterion
     WHERE campaign.id = ${MAIN_CAMPAIGN_ID} AND campaign_criterion.negative = TRUE AND campaign_criterion.status != 'REMOVED'`,
  )
  console.log(`\n  Kampaania-taseme negatiivsed (mitte REMOVED): ${campNeg.length}`)

  /* 5) AD_IMAGE assetid */
  console.log("\n=== 5) AD_IMAGE assetid (E2) ===")
  const campAssets = await gaql(
    token,
    `SELECT campaign.id, campaign_asset.field_type, campaign_asset.status FROM campaign_asset
     WHERE campaign.id = ${MAIN_CAMPAIGN_ID} AND campaign_asset.status != 'REMOVED'`,
  )
  const byField = new Map<string, number>()
  for (const r of campAssets) {
    const a = g(r, "campaignAsset")
    const key = `${s(a, "field_type")}/${s(a, "status")}`
    byField.set(key, (byField.get(key) ?? 0) + 1)
  }
  console.log("  kampaania-tase: " + ([...byField.entries()].map(([k, v]) => `${k}=${v}`).join(", ") || "—"))
  const groupAssets = await gaql(
    token,
    `SELECT campaign.id, ad_group.name, ad_group.status, ad_group_asset.field_type, ad_group_asset.status FROM ad_group_asset
     WHERE campaign.id = ${MAIN_CAMPAIGN_ID} AND ad_group_asset.status != 'REMOVED'`,
  )
  const imgGroups = new Map<string, number>()
  for (const r of groupAssets) {
    const a = g(r, "adGroupAsset")
    if (s(a, "field_type") !== "AD_IMAGE") continue
    const key = `${s(g(r, "adGroup"), "name")} [grupp ${s(g(r, "adGroup"), "status")}]/${s(a, "status")}`
    imgGroups.set(key, (imgGroups.get(key) ?? 0) + 1)
  }
  console.log("  grupi-taseme AD_IMAGE: " + ([...imgGroups.entries()].map(([k, v]) => `${k}=${v}`).join(", ") || "—"))

  /* 6) Jagatud nimekirjad (F1) */
  console.log("\n=== 6) Jagatud negatiivsete nimekirjad (F1) ===")
  const sharedAll = await gaql(token, `SELECT shared_set.id, shared_set.name, shared_set.type FROM shared_set WHERE shared_set.status != 'REMOVED'`)
  for (const r of sharedAll) console.log(`  konto nimekiri: ${s(g(r, "sharedSet"), "name")} (${s(g(r, "sharedSet"), "type")})`)
  const linked = await gaql(token, `SELECT campaign.id, shared_set.name, campaign_shared_set.status FROM campaign_shared_set WHERE campaign.id = ${MAIN_CAMPAIGN_ID}`)
  console.log(`  põhikampaaniale seotud: ${linked.length ? linked.map((r) => s(g(r, "sharedSet"), "name")).join(", ") : "0 (auditil õigus — sidumata)"}`)

  /* 7) Kattuvus P26-ga (C7) */
  console.log("\n=== 7) Kattuvus P26-ga (C7) ===")
  const mainLive = new Set(posEnabledActiveGroup.map((k) => `${k.text}|${k.match}`))
  const p26Live = new Map<string, string>()
  for (const pid of p26Ids) {
    const pk = await getKeywords(token, pid)
    for (const k of pk) {
      if (k.negative || k.status !== "ENABLED" || k.groupStatus !== "ENABLED") continue
      p26Live.set(`${k.text}|${k.match}`, `${k.text} [${k.match}] (P26 grupp: ${k.group})`)
    }
  }
  const overlap = [...mainLive].filter((key) => p26Live.has(key))
  console.log(`  põhikampaania live (ENABLED positiivne ENABLED grupis): ${mainLive.size}`)
  console.log(`  P26 live: ${p26Live.size}`)
  console.log(`  kattuvad text|match kombod: ${overlap.length}`)
  for (const key of overlap) console.log(`      ${key.split("|")[0]} [${key.split("|")[1]}]`)

  /* 8) P26 metrikad */
  console.log("\n=== 8) P26 metrikad ===")
  const m1 = await gaql(
    token,
    `SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
     FROM campaign WHERE segments.date BETWEEN '2026-10-22' AND '2026-10-28'`,
  )
  for (const r of m1) {
    const name = s(g(r, "campaign"), "name")
    if (!name.startsWith("P26")) continue
    const m = g(r, "metrics")
    console.log(`  22.–28.10  ${name}: imp ${s(m, "impressions")}, klikid ${s(m, "clicks")}, kulu €${(Number(s(m, "cost_micros") || 0) / 1e6).toFixed(2)}, konv ${s(m, "conversions")}`)
  }
  const m2 = await gaql(
    token,
    `SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
     FROM campaign WHERE segments.date DURING LAST_14_DAYS`,
  )
  for (const r of m2) {
    const name = s(g(r, "campaign"), "name")
    if (!name.startsWith("P26")) continue
    const m = g(r, "metrics")
    console.log(`  viim 14p    ${name}: imp ${s(m, "impressions")}, klikid ${s(m, "clicks")}, kulu €${(Number(s(m, "cost_micros") || 0) / 1e6).toFixed(2)}, konv ${s(m, "conversions")}`)
  }

  console.log("\nValmis — kontos midagi ei muudetud.")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
