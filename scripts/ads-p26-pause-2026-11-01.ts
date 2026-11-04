/**
 * P26 täielik peatus (01.11.2026, kliendi otsus pärast SEO/Ads-spetsialisti
 * vastust 23.10 põhikampaania auditi dokumendile):
 *
 *  - „P26 · Otsing · Koristusteenus B2B" (24367981618, €14/päev) → PAUSED.
 *    Kaks teist P26 kampaaniat (Ehitusjärgne+Suurpuhastus, DSA-kaevur) on juba PAUSED.
 *  - Põhjus: spetsialist stabiliseerib põhikampaaniat ≥14 päeva max-click
 *    50/50 testiga; P26 ja põhikampaania vahel on 13 kattuvat
 *    märksõna+vastetüübi kombot (otsjoni-müra mõlema mõõtmisele) ja P26 pole
 *    tõestanud paremust (viim 14p ~€64, 32 klikki, 0 konv). Testi eeldus
 *    „stabiilne baas" puudub akna jooksul.
 *  - Struktuur, sildid (paralleel_2026), reklaamid ja ajalugu jäävad alles —
 *    taaskäivitus on üks lülitus. Ülevaatus koos spetsialistiga ~17.11.2026
 *    (enne algselt planeeritud 11.12 otsust).
 *  - Kinnitatud 01.11.2026: ehitusjärgse koristuse null-katvus JÄÄB
 *    (kliendi 23.10 otsus „marginaalseim teenus" kehtib).
 *
 * Idempotentne; --dry-run toetatud. Auth nagu scripts/ads-p26-setup.ts.
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
const DRY_RUN = process.argv.includes("--dry-run")

const P26_PREFIX = "P26 ·"

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

async function main() {
  if (!DEVELOPER_TOKEN || !CUSTOMER_ID) throw new Error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID puuduvad")
  const token = await getAccessToken()
  console.log(`${DRY_RUN ? "[DRY-RUN] " : ""}P26 täielik peatus 01.11.2026`)

  const camps = await gaql(
    token,
    `SELECT campaign.id, campaign.name, campaign.status, campaign.resource_name
     FROM campaign WHERE campaign.status != 'REMOVED'`,
  )
  const p26 = camps
    .map((r) => {
      const c = g(r, "campaign")
      return { id: s(c, "id"), name: s(c, "name"), status: s(c, "status").toUpperCase(), rn: s(c, "resource_name") }
    })
    .filter((c) => c.name.startsWith(P26_PREFIX))

  console.log("\nP26 kampaaniad enne:")
  for (const c of p26) console.log(`  ${c.id}  ${c.status.padEnd(8)}  ${c.name}`)

  const ops = p26
    .filter((c) => c.status === "ENABLED")
    .map((c) => ({ update: { resourceName: c.rn, status: "PAUSED" }, updateMask: "status" }))

  console.log(`\nPeatatakse: ${ops.length} kampaaniat`)
  for (const c of p26.filter((x) => x.status === "ENABLED")) console.log(`  → ${c.name}`)

  if (ops.length > 0) {
    if (DRY_RUN) {
      console.log("\n[dry-run] mutate jäetakse vahele.")
    } else {
      const res = await fetch(
        `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/campaigns:mutate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "developer-token": DEVELOPER_TOKEN!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ operations: ops, partialFailure: true }),
        },
      )
      const text = await res.text()
      if (!res.ok) throw new Error(`campaigns:mutate ebaõnnestus (${res.status}): ${text.slice(0, 800)}`)
      const data = JSON.parse(text) as { partialFailureError?: { message?: string } }
      if (data.partialFailureError) throw new Error(`Osaline viga: ${data.partialFailureError.message}`)
      console.log("  ✓ peatatud")
    }
  }

  if (!DRY_RUN) {
    const after = await gaql(
      token,
      `SELECT campaign.name, campaign.status FROM campaign WHERE campaign.status != 'REMOVED'`,
    )
    console.log("\nP26 kampaaniad pärast:")
    for (const r of after) {
      const c = g(r, "campaign")
      if (s(c, "name").startsWith(P26_PREFIX)) console.log(`  ${s(c, "status").padEnd(8)}  ${s(c, "name")}`)
    }
  }
  console.log("\nValmis.")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
