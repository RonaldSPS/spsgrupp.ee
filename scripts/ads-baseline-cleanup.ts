/**
 * Põhikampaania "Otsing - Teenused - 2026" puhastus (23.10.2026, nädalaraporti
 * leiud + kliendi kiri 23.10: raha läheb valedele otsingutele — nädala kulu
 * 164 €, 37 klikki, 0 päringut; nt „kodu koristusteenus" 9,39 €, „muru niitmine",
 * „прачечная самообслуживания таллинн", konkurendibrändid).
 *
 * Tegevused (kõik idempotentsed, --dry-run toetatud):
 *  1. PEATAB B2C/välistatud-teenuste/piirkonnavälised/konkurendi-märksõnad
 *     (ajalugu säilib — PAUSED, mitte REMOVED).
 *  2. „koristusteenuse hind" BROAD (48,90 €/nädal, QS 4) → PAUSED; lisab PHRASE
 *     versiooni (päris hinnaküsimused jäävad kaetuks, lai B2C-varjund kaob).
 *  3. „hoolduskoristus tallinn" PHRASE (QS 1/10, 22,32 €/nädal) → PAUSED
 *     (madala-mahuga märksõna; kliendi direktiiv 23.10: kampaaniaid ei ehitata
 *     „hoolduskoristus" märksõnale — seda intenti katavad P26 grupid).
 *  4. Lisab kampaania-taseme phrase-negatiivsed täheldatud raiskude peale
 *     (kodu koristusteenus, muru niitmine, pesumaja/laundromat/прачечная jm).
 *
 * Auth: sama mis scripts/ads-p26-setup.ts (teenuskonto .secrets/gcp-analytics.json
 * või GOOGLE_ADS_REFRESH_TOKEN kolmik).
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
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"
const HAS_OAUTH = Boolean(process.env.GOOGLE_ADS_REFRESH_TOKEN && process.env.GOOGLE_ADS_CLIENT_ID && process.env.GOOGLE_ADS_CLIENT_SECRET)
const ADS_API_VERSION = "v25"
const DRY_RUN = process.argv.includes("--dry-run")

const CAMPAIGN_ID = "22548785025" // Otsing - Teenused - 2026

/** Peatatavad märksõnad (täpne tekstivaste, staatusest sõltumata; REMOVED jääb puutumata). */
const PAUSE_KEYWORDS = new Set([
  // Vaiba/tekstiilipesu — B2C-dominant (16.09 märksõnaanalüüs), ühekordne
  "vaiba keemiline puhastus", "vaipade keemiline puhastus", "vaipade keemiline puhastus tallinn",
  "vaipade puhastus", "vaiba puhastus", "vaiba pesu", "vaibapesu", "vaibapuhastus", "vaipade pesu",
  // Keemiline puhastus (tekstiil) — teenust ei pakuta
  "keemiline puhastus", "keemiline puhastus hinnakiri", "keemiline puhastus tallinn",
  "keemiline puhastus tallinn kesklinn", "keemiline puhastus tallinnas", "keemilise puhastuse hinnakiri",
  "salongi keemiline puhastus tallinn", "salongi puhastus", "jalanõude keemiline puhastus", "istmete keemiline puhastus",
  // Autopesu — teenust ei pakuta
  "auto istmete keemiline puhastus", "auto keemiline puhastus tallinn", "auto puhastus",
  "auto salongi keemiline puhastus", "auto salongi puhastus", "auto salongi puhastus tallinnas", "auto salongi puhastus tartus",
  // Konkurendi-/tarnija-brändid (strateegia 11.09: põhikampaaniast välja)
  "sol", "sol puhastusteenused", "liisu puhastusteenused oü", "clean planet", "ecolab", "multiclean",
  "laverna", "happy clean", "goclean", "go clean", "euroclean", "masterclean", "squeaky clean",
  "squeeky clean", "the clean team", "ecoclean", "ecorun", "cleanpoint", "cleanstep", "cleaning center",
  "global cleaning", "e clean", "iss cleaning", "iss puhastus", "cleansmart", "cleann", "easy clean",
  "niks", "clean control", "krausberg puhastus", "ml puhastus oü", "tuia", "arem", "desinfektor",
  "impuhastus", "wetrok", "diversey", "bacillol", "hagleitner",
  // B2C inglise kodu
  "home cleaning services near me", "housekeepers near me",
  // Piirkonnavälised (sihtpiirkond AINULT Tallinn+Harjumaa)
  "puhastusteenused tartus", "puhastusteenused pärnus",
  // Tooted/tööotsingud (mitte teenus)
  "puhastusvahend", "puhastusvahendid", "puhastusvahendite müük", "puhastaja",
  // Madala mahuga + QS 1/10 (22,32 €/nädal ilma tulemusta) — intenti katab P26
  "hoolduskoristus tallinn",
])

/** „koristusteenuse hind": BROAD maha, PHRASE asemele (samasse „Bränd USP" gruppi). */
const PRICE_KEYWORD_BROAD_RN = "customers/3967281610/adGroupCriteria/185210113654~444433606538"
const PRICE_KEYWORD_AD_GROUP_RN = "customers/3967281610/adGroups/185210113654"
const PRICE_KEYWORD_TEXT = "koristusteenuse hind"

/** Uued kampaania-taseme phrase-negatiivsed (täheldatud raiskud 15.–21.10). */
const NEW_NEGATIVES = [
  "kodu koristusteenus", "kodu koristamine", "kodu puhastusteenus",
  "muru niitmine", "muruniitmine", "muru niitmise",
  "pesumaja", "laundromat", "прачечная",
]

/* ---------- Google Ads REST ---------- */

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

function headers(token: string): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": DEVELOPER_TOKEN!,
    "Content-Type": "application/json",
  }
  if (LOGIN_CUSTOMER_ID) h["login-customer-id"] = LOGIN_CUSTOMER_ID
  return h
}

type Row = Record<string, Record<string, unknown> | undefined>

async function gaql(token: string, query: string): Promise<Row[]> {
  const rows: Row[] = []
  let pageToken: string | undefined
  do {
    const res = await fetch(
      `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/googleAds:search`,
      { method: "POST", headers: headers(token), body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }) },
    )
    if (!res.ok) throw new Error(`GAQL ebaõnnestus (${res.status}): ${(await res.text()).slice(0, 500)}`)
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

async function mutate(token: string, service: string, operations: unknown[], label: string): Promise<void> {
  if (operations.length === 0) return
  if (DRY_RUN) {
    console.log(`\n--- [dry-run] ${service}:mutate (${operations.length} op) — ${label}`)
    console.log(JSON.stringify(operations, null, 2).slice(0, 3000))
    return
  }
  const res = await fetch(
    `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/${service}:mutate`,
    { method: "POST", headers: headers(token), body: JSON.stringify({ operations, partialFailure: true }) },
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`${service}:mutate ebaõnnestus (${res.status}) — ${label}: ${text.slice(0, 800)}`)
  const data = JSON.parse(text) as { partialFailureError?: { message?: string } }
  if (data.partialFailureError) console.warn(`  ⚠ osaline viga (${label}): ${data.partialFailureError.message}`)
}

/* ---------- põhivoog ---------- */

async function main() {
  if (!DEVELOPER_TOKEN || !CUSTOMER_ID) throw new Error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID puuduvad")
  const token = await getAccessToken()
  console.log(`${DRY_RUN ? "[DRY-RUN] " : ""}Põhikampaania puhastus (campaign ${CAMPAIGN_ID})`)

  /* 1) Peata nimekirja märksõnad */
  const kwRows = await gaql(
    token,
    `SELECT ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status
     FROM ad_group_criterion
     WHERE campaign.id = ${CAMPAIGN_ID} AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED' AND ad_group_criterion.negative = FALSE`,
  )
  const pauseOps: unknown[] = []
  const seen = new Set<string>()
  for (const r of kwRows) {
    const c = r.adGroupCriterion ?? {}
    const kw = (c.keyword ?? {}) as Record<string, unknown>
    const text = String(kw.text ?? "").toLowerCase().trim()
    if (!PAUSE_KEYWORDS.has(text)) continue
    const rn = String(c.resourceName ?? c.resource_name ?? "")
    if (!rn || seen.has(rn)) continue
    seen.add(rn)
    if (String(c.status) === "PAUSED") continue
    pauseOps.push({ update: { resourceName: rn, status: "PAUSED" }, updateMask: "status" })
  }
  console.log(`\n1) märksõnu peatatakse: ${pauseOps.length}`)
  if (DRY_RUN) {
    const texts = kwRows
      .filter((r) => pauseOps.some((op) => (op as { update: { resourceName: string } }).update.resourceName === String((r.adGroupCriterion as Record<string, unknown>)?.resourceName ?? "")))
      .map((r) => {
        const c = r.adGroupCriterion as Record<string, unknown>
        const kw = (c.keyword ?? {}) as Record<string, unknown>
        return `${kw.text} [${kw.matchType ?? kw.match_type}]`
      })
    console.log(texts.join("\n"))
  }
  await mutate(token, "adGroupCriteria", pauseOps, "B2C/konkurent/piirkond märksõnade peatus")

  /* 2) koristusteenuse hind: BROAD peatu + PHRASE lisa (kui pole) */
  const broadRow = kwRows.find((r) => String((r.adGroupCriterion as Record<string, unknown>)?.resourceName ?? "") === PRICE_KEYWORD_BROAD_RN)
  const ops2: unknown[] = []
  if (broadRow && String((broadRow.adGroupCriterion as Record<string, unknown>)?.status) !== "PAUSED") {
    ops2.push({ update: { resourceName: PRICE_KEYWORD_BROAD_RN, status: "PAUSED" }, updateMask: "status" })
  }
  const hasPhrase = kwRows.some((r) => {
    const c = r.adGroupCriterion ?? {}
    const kw = (c.keyword ?? {}) as Record<string, unknown>
    return String(kw.text ?? "").toLowerCase().trim() === PRICE_KEYWORD_TEXT && String(kw.match_type ?? kw.matchType ?? "").toUpperCase() === "PHRASE" && String(c.status) !== "REMOVED"
  })
  if (!hasPhrase) {
    ops2.push({ create: { adGroup: PRICE_KEYWORD_AD_GROUP_RN, status: "ENABLED", keyword: { text: PRICE_KEYWORD_TEXT, matchType: "PHRASE" } } })
  }
  console.log(`2) „${PRICE_KEYWORD_TEXT}": BROAD peatus (${ops2.length > 0 && broadRow ? "jah" : "juba"}), PHRASE lisatakse: ${hasPhrase ? "olemas" : "jah"}`)
  await mutate(token, "adGroupCriteria", ops2, "koristusteenuse hind BROAD→PHRASE")

  /* 3) uued phrase-negatiivsed */
  const negRows = await gaql(
    token,
    `SELECT campaign_criterion.keyword.text, campaign_criterion.keyword.match_type FROM campaign_criterion
     WHERE campaign.id = ${CAMPAIGN_ID} AND campaign_criterion.negative = TRUE`,
  )
  const haveNeg = new Set(
    negRows.map((r) => {
      const kw = ((r.campaignCriterion ?? {}) as Record<string, unknown>).keyword as Record<string, unknown> | undefined
      return `${String(kw?.text ?? "").toLowerCase().trim()}|${String(kw?.match_type ?? kw?.matchType ?? "").toUpperCase()}`
    }),
  )
  const negOps = NEW_NEGATIVES.filter((n) => !haveNeg.has(`${n.toLowerCase()}|PHRASE`)).map((text) => ({
    create: { campaign: `customers/${CUSTOMER_ID}/campaigns/${CAMPAIGN_ID}`, negative: true, keyword: { text, matchType: "PHRASE" } },
  }))
  console.log(`3) uusi phrase-negatiivseid: ${negOps.length} / ${NEW_NEGATIVES.length}`)
  await mutate(token, "campaignCriteria", negOps, "uued negatiivsed")

  console.log("\nValmis. Kontrolli: npm run report:ads või Ads UI → märksõnad/negatiivsed.")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
