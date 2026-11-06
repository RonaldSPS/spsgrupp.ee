/**
 * Uued kampaania-taseme PHRASE-negatiivsed (nädalaraporti 06.11.2026
 * „kulutab ilma konversioonideta" nimekiri + kliendi otsus). Idempotentne,
 * --dry-run toetatud.
 *
 * Lisatakse KÕIGILE aktiivsetele (ENABLED) SEARCH-kampaaniatele, mis pole
 * P26-testkampaaniad (prefiks „P26 ·" — need on 01.11.2026 seisuga PEATATUD,
 * vt scripts/ads-p26-pause-2026-11-01.ts).
 *
 * Negatiivsed (kulutanud, ei konverteerinud — 30p kulu sulgudes):
 *   - peokaunistused (tallinn) 6,5 € — B2C üritustekaunistus
 *   - rendiise (ee) 5,9 € — sõiduki-/rendipäringud
 *   - auto puhastusvahendid 5,4 € — B2C autopuhastus
 *   - fairy puhastuslapid 4,6 € — tooteotsing
 *   - becky 4,6 € — tootebränd (puhastuslapid)
 *   - krausberg (ee) 3,6 € — köögitehnika bränd
 *   - kodukoristusteenus 5,3 € (1 konv) — TEADLIK OTSUS: konverteerib, aga on
 *     B2C (kodu/korter), põhieesmärgi (B2B hoolduslepingud) järgi kuulub välja.
 *     Lisaks sõnajärjevariant „kodu koristusteenus".
 *
 * Auth: sama mis scripts/ads-fixes-2026-10-26.ts.
 * Käivita: npx tsx scripts/ads-negatives-2026-11-06.ts [--dry-run]
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
const ADS_API_VERSION = "v25"
const DRY_RUN = process.argv.includes("--dry-run")

const P26_PREFIX = "P26 ·"

const NEW_NEGATIVES = [
  "peokaunistused",
  "rendiise",
  "auto puhastusvahendid",
  "fairy puhastuslapid",
  "becky",
  "krausberg",
  "kodukoristusteenus",
  "kodu koristusteenus",
]

/* ---------- Google Ads REST ---------- */

async function getAccessToken(): Promise<string> {
  const { GoogleAuth } = await import("google-auth-library")
  const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes: ["https://www.googleapis.com/auth/adwords"] })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error("Teenuskonto access tokeni loomine ebaõnnestus")
  return token.token
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

type Row = Record<string, any>

async function gaql(token: string, query: string): Promise<Row[]> {
  const rows: Row[] = []
  let pageToken: string | undefined
  do {
    const res = await fetch(
      `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/googleAds:search`,
      { method: "POST", headers: headers(token), body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }) },
    )
    if (!res.ok) throw new Error(`GAQL ${res.status}: ${(await res.text()).slice(0, 500)}`)
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

async function mutate(token: string, service: string, operations: unknown[], label: string): Promise<string[]> {
  if (operations.length === 0) return []
  if (DRY_RUN) {
    console.log(`--- [dry-run] ${service}:mutate (${operations.length} op) — ${label}`)
    return []
  }
  const res = await fetch(
    `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/${service}:mutate`,
    { method: "POST", headers: headers(token), body: JSON.stringify({ operations, partialFailure: true }) },
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`${service}:mutate ebaõnnestus (${res.status}) — ${label}: ${text.slice(0, 800)}`)
  const data = JSON.parse(text) as { results?: { resourceName?: string }[]; partialFailureError?: { message?: string } }
  if (data.partialFailureError) throw new Error(`${service}:mutate osaline viga — ${label}: ${data.partialFailureError.message}`)
  return (data.results ?? []).map((r) => String(r.resourceName ?? ""))
}

/* ---------- põhivoog ---------- */

async function main() {
  if (!DEVELOPER_TOKEN || !CUSTOMER_ID) throw new Error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID puuduvad")
  const token = await getAccessToken()
  console.log(`${DRY_RUN ? "[DRY-RUN] " : ""}Negatiivsed 06.11.2026 (customer ${CUSTOMER_ID})`)

  /* Aktiivsed otsingukampaaniad (P26-testkampaaniad jätame välja — peatatud). */
  const camps = await gaql(
    token,
    `SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type
     FROM campaign
     WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'`,
  )
  const targets = camps
    .map((r) => ({ id: String(r.campaign?.id ?? ""), name: String(r.campaign?.name ?? "") }))
    .filter((c) => c.id && !c.name.startsWith(P26_PREFIX))
  console.log(`Sihtkampaaniad (${targets.length}): ${targets.map((c) => c.name).join(" · ")}`)

  for (const target of targets) {
    const negRows = await gaql(
      token,
      `SELECT campaign_criterion.keyword.text, campaign_criterion.keyword.match_type FROM campaign_criterion
       WHERE campaign.id = ${target.id} AND campaign_criterion.negative = TRUE`,
    )
    const have = new Set(
      negRows.map((r) => {
        const kw = (r.campaignCriterion ?? {}) as Record<string, any>
        return `${String(kw.keyword?.text ?? "").toLowerCase().trim()}|${String(kw.keyword?.matchType ?? "").toUpperCase()}`
      }),
    )
    const ops = NEW_NEGATIVES.filter((n) => !have.has(`${n}|PHRASE`)).map((text) => ({
      create: { campaign: `customers/${CUSTOMER_ID}/campaigns/${target.id}`, negative: true, keyword: { text, matchType: "PHRASE" } },
    }))
    console.log(`- ${target.name}: lisatakse ${ops.length}/${NEW_NEGATIVES.length}${ops.length ? ` (${ops.map((o: any) => o.create.keyword.text).join(", ")})` : ""}`)
    await mutate(token, "campaignCriteria", ops, `negatiivsed ${target.name}`)
  }

  console.log("\nValmis. Kontrolli: npm run report:ads")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
