/**
 * P26 iganädalane hooldus (plaani §3.8): otsingusõnade läbivaatus + negatiivsete
 * täiendamine + DSA URL-välistused. Puudutab AINULT `P26 ·`-prefiksiga
 * kampaaniaid (silt paralleel_2026) — praegust/vana seadistust EI MUUDA.
 *
 *   tsx scripts/ads-p26-hooldus.ts              # ainult raport (otsingusõnad + kulu)
 *   tsx scripts/ads-p26-hooldus.ts --days=14    # pikem aken
 *   tsx scripts/ads-p26-hooldus.ts --apply      # rakendab kureeritud negatiivsed + URL-välistused
 *
 * Negatiivsete loogika (kliendi direktiivid + märksõnaanalüüs 16.09.2026):
 *  - P26 eesmärk on hoolduskoristus B2B + tõestatud B2B eritööd (ehitusjärgne).
 *    B2C/hooajavälised ühekordsed (muruniitmine, lehtede koristamine, vaibapesu)
 *    kulutavad eelarvet eesmärgita — 16.09 analüüs: "vaipade puhastus 320/kuu,
 *    B2C-dominant — mitte eelarvet".
 *  - Negatiivsed on PHRASE-tasemel (tabab sõnavorme, ei blokeeri kokkusattumisi).
 */

import { readFileSync, existsSync } from "node:fs"

/* ---------- env ---------- */
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
const P26_PREFIX = "P26 ·"

const APPLY = process.argv.includes("--apply")
const daysFlag = process.argv.find((a) => a.startsWith("--days="))
const DAYS = daysFlag ? Math.max(1, parseInt(daysFlag.slice(7), 10) || 7) : 7

/* ---------- Kureeritud nimekirjad (muuda SIIN, käivita --apply) ---------- */

/** Eesmärgivõõrad päringuvormid — lisatakse KÕIGILE P26 kampaaniatele (phrase).
 *  Kureeritud 22.10.2026 DSA otsingusõnade esimese läbivaatuse põhjal. */
const NEGATIVE_PHRASES_ALL = [
  // Muruniit / lehtedekoristamine — hooajavälised (kevad–suvi), B2C-ühekordsed (klient 22.10.2026)
  "muruniitmine", "muru niitmine", "muru niitma", "muruniiduk", "muruäärte",
  "lehtede koristamine", "lehtede koristus",
  // Vaibapesu — 16.09 märksõnaanalüüs: B2C-dominant, ühekordne, ei toeta hoolduslepingut (klient 22.10)
  "vaibapesu", "vaipapesu", "vaipade pesu", "vaipade puhastus", "vaiba pesu", "vaiba puhastamine", "vaibapuhastus",
  // Diivan/mööbel/voodipesu — B2C tekstiilipesu
  "diivani puhastus", "diivani puhastamine", "diivani pesu", "mööbli puhastus", "voodipesu", "laundromat", "pesumaja",
  // Keemiline puhastus (tekstiil) — teenust ei pakuta
  "keemiline puhastus",
  // Akende remont/vahetus — teenust ei pakuta (meil on akende PESU)
  "akende remont", "akende vahetus", "aknaremont", "aknatihendite", "plastakende reguleerimine",
  // Teenused, mida ei pakuta
  "korstnapühkija", "majavamm", "rasvapüüduri", "soojusvaheti", "soodaprits",
  // Tooteotsingud (mitte teenus)
  "osonaator", "puhastuslapp", "koristusvahendid", "zep eesti", "puhastusimport",
  // Konkurendi-brändid (strateegia 11.09: ei prioriseerita)
  "sol", "krausberg", "lavida clean", "anhel", "clean planet", "ecocare", "prof puhastus", "workland",
  // Ehitusfirmad (remonditeenused on kolmanda prioritiseerimisega, DSA ei sihti neid lehti)
  "ehitusfirmad",
]

/** DSA kaevur: lehed, mida ei tohi sihtleheks kasutada (eesmärgivõõrad). */
const DSA_EXCLUDED_URLS = [
  "https://spsgrupp.ee/koristusteenus/valikoristus/muruniitmine/",
  "https://spsgrupp.ee/koristusteenus/valikoristus/lehtedekoristamine/",
  "https://spsgrupp.ee/puhastusteenused/vaipade-puhastus/",
  "https://spsgrupp.ee/puhastusteenused/koroonaviiruse-jargne-puhastus/",
]

/* ---------- auth ---------- */
async function getAccessToken(): Promise<string> {
  if (process.env.GOOGLE_ADS_REFRESH_TOKEN && process.env.GOOGLE_ADS_CLIENT_ID) {
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
    const data = (await res.json()) as Record<string, string>
    if (!res.ok || !data.access_token) throw new Error(`OAuth refresh ebaõnnestus: ${data.error_description ?? ""}`)
    return data.access_token
  }
  const { GoogleAuth } = await import("google-auth-library")
  const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes: ["https://www.googleapis.com/auth/adwords"] })
  const client = await auth.getClient()
  const t = await client.getAccessToken()
  if (!t.token) throw new Error("SA token ebaõnnestus")
  return t.token
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
    if (!res.ok) throw new Error(`GAQL ebaõnnestus (${res.status}): ${(await res.text()).slice(0, 500)}\nQ: ${query}`)
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

async function mutate(token: string, service: string, operations: unknown[], label: string): Promise<void> {
  if (operations.length === 0) return
  const res = await fetch(
    `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/${service}:mutate`,
    { method: "POST", headers: headers(token), body: JSON.stringify({ operations, partialFailure: true }) },
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`${service}:mutate ebaõnnestus (${res.status}) — ${label}: ${text.slice(0, 800)}`)
  const data = JSON.parse(text) as { partialFailureError?: { message?: string } }
  if (data.partialFailureError) console.warn(`  ⚠ osaline viga (${label}): ${data.partialFailureError.message}`)
}

const iso = (d: Date) => d.toISOString().slice(0, 10)

async function main() {
  const token = await getAccessToken()

  // P26 kampaaniad
  const campaigns = await gaql(token, `
    SELECT campaign.id, campaign.name, campaign.status FROM campaign
    WHERE campaign.status = 'ENABLED'
  `)
  const p26 = campaigns.filter((c) => String(c.campaign?.name ?? "").startsWith(P26_PREFIX))
  if (p26.length === 0) { console.log("P26 kampaaniaid ei leitud!"); return }
  console.log(`P26 kampaaniad (${p26.length}):`)
  for (const c of p26) console.log(`  ${c.campaign.id}  ${c.campaign.name}`)
  const ids = p26.map((c) => c.campaign.id).join(", ")

  // Otsingusõnade raport
  const to = new Date(Date.now() - 2 * 86_400_000) // Ads viivitus ~2p
  const from = new Date(to.getTime() - (DAYS - 1) * 86_400_000)
  console.log(`\n=== Otsingusõnad ${iso(from)} → ${iso(to)} (P26, kõik) ===`)
  const terms = await gaql(token, `
    SELECT campaign.name, ad_group.name, search_term_view.search_term,
           metrics.cost_micros, metrics.clicks, metrics.impressions
    FROM search_term_view
    WHERE campaign.id IN (${ids})
      AND segments.date BETWEEN '${iso(from)}' AND '${iso(to)}'
    ORDER BY metrics.cost_micros DESC
  `)
  if (terms.length === 0) console.log("(otsingusõnu aknas pole)")
  let totalCost = 0
  for (const t of terms) {
    const cost = Number(t.metrics?.costMicros ?? 0) / 1e6
    totalCost += cost
    console.log(
      `  ${String(t.campaign?.name).replace(P26_PREFIX + " ", "").padEnd(36)} "${t.searchTermView?.searchTerm}"  €${cost.toFixed(2)}  clicks=${t.metrics?.clicks ?? 0} impr=${t.metrics?.impressions ?? 0}`,
    )
  }
  console.log(`  KOKKU kulu aknas: €${totalCost.toFixed(2)} (${terms.length} terminit)`)

  // Olemasolevad negatiivsed (et ei dubleeriks)
  const existing = await gaql(token, `
    SELECT campaign.id, campaign.name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
    FROM campaign_criterion
    WHERE campaign.id IN (${ids}) AND campaign_criterion.negative = TRUE
      AND campaign_criterion.type = 'KEYWORD'
  `)
  const existingSet = new Set(existing.map((e) => `${e.campaign.id}::${String(e.campaignCriterion?.keyword?.text ?? "").toLowerCase()}`))

  if (!APPLY) {
    console.log(`\n[raport-režiim] --apply rakendaks:`)
    console.log(`  ${NEGATIVE_PHRASES_ALL.length} phrase-negatiivset × ${p26.length} kampaaniat`)
    console.log(`  ${DSA_EXCLUDED_URLS.length} DSA URL-välistust`)
    console.log(`  (negatiivseid juba olemas: ${existingSet.size} kirjet)`)
    return
  }

  // 1) Negatiivsed märksõnad kõigile P26 kampaaniatele (phrase)
  for (const c of p26) {
    const ops = NEGATIVE_PHRASES_ALL
      .filter((kw) => !existingSet.has(`${c.campaign.id}::${kw.toLowerCase()}`))
      .map((kw) => ({
        create: {
          campaign: `customers/${CUSTOMER_ID}/campaigns/${c.campaign.id}`,
          negative: true,
          keyword: { text: kw, matchType: "PHRASE" },
        },
      }))
    await mutate(token, "campaignCriteria", ops, `negatiivsed → ${c.campaign.name}`)
    console.log(`  ✓ ${c.campaign.name}: +${ops.length} negatiivset (kokku neil juba ${existing.filter((e) => e.campaign.id === c.campaign.id).length})`)
  }

  // 2) DSA URL-välistused (negatiivsed webpage-kriteeriumid)
  const dsa = p26.find((c) => String(c.campaign.name).includes("DSA"))
  if (dsa) {
    const groups = await gaql(token, `
      SELECT ad_group.id, ad_group.name FROM ad_group
      WHERE campaign.id = ${dsa.campaign.id} AND ad_group.status = 'ENABLED'
    `)
    const existingExcl = await gaql(token, `
      SELECT ad_group.id, ad_group_criterion.criterion_id
      FROM ad_group_criterion
      WHERE campaign.id = ${dsa.campaign.id} AND ad_group_criterion.negative = TRUE
        AND ad_group_criterion.type = 'WEBPAGE'
    `)
    /* v25 ei luba GAQL-is webpage.page_url välja valida — piisab, kui teame,
     * et negatiivsed WEBPAGE-kriteeriumid on juba olemas (idempotentsus:
     * esimene rakendus loob kõik 4, järgmised jooksud vaatavad arvu). */
    const exclCountByGroup = new Map<string, number>()
    for (const e of existingExcl) {
      const gid = String(e.adGroup?.id)
      exclCountByGroup.set(gid, (exclCountByGroup.get(gid) ?? 0) + 1)
    }
    for (const g of groups) {
      const have = exclCountByGroup.get(String(g.adGroup.id)) ?? 0
      if (have >= DSA_EXCLUDED_URLS.length) {
        console.log(`  ✓ DSA grupp ${g.adGroup.id} (${g.adGroup.name}): ${have} URL-välistust juba olemas — vahele`)
        continue
      }
      const ops = DSA_EXCLUDED_URLS.map((u) => ({
        create: {
          adGroup: `customers/${CUSTOMER_ID}/adGroups/${g.adGroup.id}`,
          negative: true,
          // v25 gotcha: WebpageInfo nõuab criterionName + conditions (mitte pageUrl)
          webpage: {
            criterionName: `Välistus: ${new URL(u).pathname.replace(/\/$/, "").split("/").pop()}`,
            conditions: [{ operand: "URL", operator: "EQUALS", argument: u }],
          },
        },
      }))
      await mutate(token, "adGroupCriteria", ops, `DSA URL-välistused → grupp ${g.adGroup.id}`)
      console.log(`  ✓ DSA grupp ${g.adGroup.id} (${g.adGroup.name}): +${ops.length} URL-välistust`)
    }
  }

  console.log("\nValmis. Muudatused on nähtavad Ads UI → Change history ja kajastuvad reede raportis.")
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
