/**
 * P26 sõnumikatse „Koristaja vahetus / 2027 leping" (kliendi tegevuskava 26.10.2026:
 * „Käivitada piiratud eelarvega teenusepakkuja vahetamise / 2027. aasta lepingu
 * sõnumikatse olemasolevatel sobivatel teenuselehtedel").
 *
 * Teostus: uus reklaamgrupp „Vahetus 2027" olemasolevas P26 · Otsing ·
 * Koristusteenus B2B kampaanias (24367981618) — EI loo uut eelarvet, grupp jagab
 * kampaania olemasolevat €14/päev laagrit (mis kulutab hetkel ~€4/30p) ja
 * grupi CPC-pakkumine on piiratud €2,00-ga. Kampaania geo on PRESENCE (26.10),
 * konversioonieesmärgid kampaania-tasemel (vorm primaarne, CONTACT mitte-biddable).
 * Maandumisleht: /koristusteenus/hoolduskoristus/ (lepinguteenus, hinna-ankur +
 * tasuta ülevaatus). Märksõnad on teadlikult väikese mahuga — see on SÕNUMIkatse,
 * mitte mahukampaania.
 *
 * Idempotentne, --dry-run toetatud. Käivita: npx tsx scripts/ads-p26-vahetus-2027.ts [--dry-run]
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

const CAMPAIGN_ID = "24367981618" // P26 · Otsing · Koristusteenus B2B
const GROUP_NAME = "Vahetus 2027"
const CPC_BID_MICROS = 2_000_000 // €2,00 — piiratud katse

const KEYWORDS = [
  "koristaja vahetamine", "koristusfirma vahetamine", "vaheta koristajat",
  "koristuspartneri vahetus", "koristusleping 2027",
]

/* NB! „ISO 9001 ja 14001" pealkirjana käivitab Ads'i poliitikaskanni
 * PHONE_NUMBER_IN_AD_TEXT valepositiivi (numbriklaster 9001…14001 näeb välja
 * nagu telefoninumber) — verifitseeritud bisektiga 26.10.2026. Seetõttu ISO-d
 * pealkirjades EI ole; „2027" pealkirjad on lubatud ja läbivad. */
const HEADLINES = [
  "Koristuspartneri vahetus 2027", "Vaheta koristusfirmat", "Leping 2027. aastaks",
  "Tasuta objekti ülevaatus", "Hind alates 1,20 €/m² kuus", "Vahetus on kontrollitud",
  "Kindel meeskond objektil", "Objektijuht ja kontroll",
  "Kogemus alates 2006", "Vastus 1 tööpäevaga", "300+ töötajat", "SPS Grupp",
]
const DESCRIPTIONS = [
  "Koristuspartneri vahetus on kontrollitud protsess: ülevaatus, tööplaan, käivitus nädalaga.",
  "Hind alates 1,20 €/m² kuus. Tasuta ülevaatus ja hinnapakkumine 1 tööpäevaga.",
  "Kindel meeskond, objektijuht ja kvaliteedikontroll. Asendus ka puhkuste ajal.",
]

async function getAccessToken(): Promise<string> {
  const { GoogleAuth } = await import("google-auth-library")
  const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes: ["https://www.googleapis.com/auth/adwords"] })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error("access token puudub")
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
    console.log(JSON.stringify(operations, null, 2).slice(0, 2000))
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

async function main() {
  if (!DEVELOPER_TOKEN || !CUSTOMER_ID) throw new Error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID puuduvad")
  for (const h of HEADLINES) if (h.length > 30) throw new Error(`Pealkiri üle 30 märgi (${h.length}): "${h}"`)
  for (const d of DESCRIPTIONS) if (d.length > 90) throw new Error(`Kirjeldus üle 90 märgi (${d.length}): "${d}"`)

  const token = await getAccessToken()
  console.log(`${DRY_RUN ? "[DRY-RUN] " : ""}P26 Vahetus-2027 sõnumikatse (kampaania ${CAMPAIGN_ID})`)

  /* Kampaania peab olema P26 ja olemas */
  const camp = await gaql(token, `SELECT campaign.name, campaign.status FROM campaign WHERE campaign.id = ${CAMPAIGN_ID}`)
  if (camp.length === 0) throw new Error(`Kampaaniat ${CAMPAIGN_ID} ei leitud`)
  console.log(`- kampaania: ${camp[0].campaign.name} [${camp[0].campaign.status}]`)

  /* Grupp olemas? */
  const groups = await gaql(
    token,
    `SELECT ad_group.resource_name, ad_group.name, ad_group.status FROM ad_group
     WHERE campaign.id = ${CAMPAIGN_ID} AND ad_group.status != 'REMOVED'`,
  )
  let groupRn = groups.find((r) => String(r.adGroup?.name) === GROUP_NAME)?.adGroup?.resourceName as string | undefined

  if (!groupRn) {
    const [created] = await mutate(token, "adGroups", [{
      create: {
        campaign: `customers/${CUSTOMER_ID}/campaigns/${CAMPAIGN_ID}`,
        name: GROUP_NAME,
        status: "ENABLED",
        type: "SEARCH_STANDARD",
        cpcBidMicros: CPC_BID_MICROS,
      },
    }], `grupp ${GROUP_NAME}`)
    groupRn = created
    console.log(`- grupp loodud: ${groupRn ?? "(dry-run)"} (CPC €2,00)`)
  } else {
    console.log(`- grupp juba olemas: ${groupRn}`)
  }

  if (DRY_RUN) {
    console.log(`--- [dry-run] lisaks ${KEYWORDS.length} PHRASE märksõna + 1 RSA → https://spsgrupp.ee/koristusteenus/hoolduskoristus/`)
    console.log(`    märksõnad: ${KEYWORDS.join(", ")}`)
    return
  }
  if (!groupRn) throw new Error("grupi resource_name puudub")

  /* Märksõnad (idempotentsus: olemasolevate tekstide kaupa) */
  const kwRows = await gaql(
    token,
    `SELECT ad_group_criterion.keyword.text FROM ad_group_criterion
     WHERE ad_group.resource_name = '${groupRn}' AND ad_group_criterion.type = 'KEYWORD'
       AND ad_group_criterion.status != 'REMOVED' AND ad_group_criterion.negative = FALSE`,
  )
  const have = new Set(kwRows.map((r) => String(r.adGroupCriterion?.keyword?.text ?? "").toLowerCase().trim()))
  const kwOps = KEYWORDS.filter((k) => !have.has(k.toLowerCase())).map((text) => ({
    create: { adGroup: groupRn, status: "ENABLED", keyword: { text, matchType: "PHRASE" } },
  }))
  await mutate(token, "adGroupCriteria", kwOps, "Vahetus 2027 märksõnad")
  console.log(`- märksõnu lisatud: ${kwOps.length}/${KEYWORDS.length}`)

  /* RSA */
  const adRows = await gaql(
    token,
    `SELECT ad_group_ad.resource_name FROM ad_group_ad
     WHERE ad_group.resource_name = '${groupRn}' AND ad_group_ad.status != 'REMOVED'`,
  )
  if (adRows.length === 0) {
    await mutate(token, "adGroupAds", [{
      create: {
        adGroup: groupRn,
        status: "ENABLED",
        ad: {
          finalUrls: ["https://spsgrupp.ee/koristusteenus/hoolduskoristus/"],
          responsiveSearchAd: {
            headlines: HEADLINES.map((text) => ({ text })),
            descriptions: DESCRIPTIONS.map((text) => ({ text })),
            path1: "hoolduskoristus",
          },
        },
      },
    }], "Vahetus 2027 RSA")
    console.log("- RSA loodud → /koristusteenus/hoolduskoristus/")
  } else {
    console.log("- RSA juba olemas")
  }

  console.log("\nValmis. Katse on kohe nähtav (kampaania ENABLED), kuid jagab olemasolevat €14/päev P26 laagrit.")
  console.log("Jälgi: iganädalane npm run hooldus:p26 (otsingusõnad) + nädalaraporti P26 tabel.")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
