/**
 * P26 lihtsustus suurtele otsingugruppidele (kliendi direktiiv 23.10.2026 õhtu):
 *  „Ehitusjärgne + Suurpuhastus" kampaania peata — ehitusjärgne on SPSi kõige
 *  marginaalsem teenus ja ühekordne töö (strateegia: regulaarne hoolduskoristus B2B).
 *  „hoolduskoristus" ei ole otsingusõna — GSC 16 kuu andmetel ~9 näitamist/kuu
 *  (viimased 3 täiskuud), pos ~39. Kampaaniad ei tohi sellele keskenduda.
 *  Märksõnad peavad olema SUURED otsingugrupid (GSC mõõdetud nõudlus):
 *    puhastusteenused ~400/kuu · kontori koristus ~210 · koristusfirma ~200 ·
 *    koristusteenus ~95+ · puhastusfirma ~70. Marginaalsed üksikteenused (trepikoda,
 *    korteriühistu 0/kuu; ehitusjärgne 6/kuu; suurpuhastus 29/kuu ühekordsena) välja.
 *
 * Muudatused (idempotentne, --dry-run toetatud):
 *  1. Kampaania 24356948292 (P26 · Otsing · Ehitusjärgne + Suurpuhastus B2B) → PAUSED.
 *     Sisu (märksõnad, reklaamid, ajalugu) jääb alles — ainult olek muutub.
 *  2. Vabanev €6/päev → „P26 · Otsing · Koristusteenus B2B" (24367981618) eelarve
 *     €8 → €14/päev. P26 kogulagi €17/päev (€14 + DSA €3) jääb täpselt samaks.
 *  3. Grupp „Hoolduskoristus (tuum)" (204066028231) → PAUSED — hoolduskoristus-fookus
 *     maha; grupi muud terminid on kas 0-mahulised (trepikoja/korteriühistu) või kaetud
 *     üldise grupi PHRASE kaudu („koristusteenus ettevõttele" ⊂ „koristusteenus").
 *  4. KÕIK kampaaniad (sh põhikampaania ja kaks vana ENABLED zombi-testkampaaniat —
 *     „JNV002 Max click test" ja „Maximize conversion value test"): ENABLED
 *     märksõnad, mis sisaldavad „hoolduskoristus", → PAUSED (ajalugu säilib;
 *     kliendi direktiiv: ükski kampaania ei tohi sellele keskenduda — see on
 *     üldine grupi nimetus, mitte otsingusõna).
 *  5. Gruppi „Koristusteenus (üldine)" lisatakse GSC-põhiselt „puhastusfirma" +
 *     „puhastusfirmad" PHRASE (~70 näitamist/kuu — kolmas suur grupp, P26-st puudus).
 *
 * Ehitusjärgse katvus: pärast peatust pole tasulist katvust (põhikampaania grupp C6
 * järgi PAUSED ja jääb — teenus on strateegias teisejärguline). DSA-kaevur võib
 * üksikuid päringuid /puhastusteenused/ lehtedele endiselt tuua — see on taotletud
 * odav avastuskanal, mitte sihtmärk.
 *
 * Auth: sama mis ads-p26-setup.ts / ads-p26-refocus.ts.
 */

import { existsSync } from "node:fs"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of require("node:fs").readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
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

const CAMP_EHITUS = "24356948292" // P26 · Otsing · Ehitusjärgne + Suurpuhastus B2B
const CAMP_KORISTUS = "24367981618" // P26 · Otsing · Koristusteenus B2B
const CAMP_DSA = "24361988072" // P26 · Otsing · DSA-kaevur (ei muuda)
const GROUP_HOOLDUS = "204066028231" // Hoolduskoristus (tuum) — kampaanias CAMP_KORISTUS
const NEW_BUDGET_EUR = 14 // €8 + ehitusjärgselt vabanev €6; P26 kogulagi €17 jääb
const GENERAL_GROUP_NAME = "Koristusteenus (üldine)"
const GENERAL_GROUP_ADD_KW = ["puhastusfirma", "puhastusfirmad"] // PHRASE, GSC ~70 näitamist/kuu

/* ---------- Google Ads REST ---------- */

async function getAccessToken(): Promise<string> {
  if (!HAS_OAUTH) {
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

async function mutate(token: string, service: string, operations: unknown[], label: string): Promise<string[]> {
  if (operations.length === 0) return []
  if (DRY_RUN) {
    console.log(`\n--- [dry-run] ${service}:mutate (${operations.length} op) — ${label}`)
    console.log(JSON.stringify(operations, null, 2).slice(0, 3500))
    return []
  }
  const res = await fetch(
    `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/${service}:mutate`,
    { method: "POST", headers: headers(token), body: JSON.stringify({ operations, partialFailure: true }) },
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`${service}:mutate ebaõnnestus (${res.status}) — ${label}: ${text.slice(0, 800)}`)
  const data = JSON.parse(text) as { results?: { resourceName?: string }[]; partialFailureError?: { message?: string } }
  if (data.partialFailureError) console.warn(`  ⚠ osaline viga (${label}): ${data.partialFailureError.message}`)
  return (data.results ?? []).map((r) => r.resourceName ?? "")
}

/* ---------- põhivoog ---------- */

async function main() {
  if (!DEVELOPER_TOKEN || !CUSTOMER_ID) throw new Error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID puuduvad")
  const token = await getAccessToken()
  console.log(`${DRY_RUN ? "[DRY-RUN] " : ""}P26 lihtsustus suurtele otsingugruppidele (konto ${CUSTOMER_ID})`)

  /* 1) Ehitusjärgne + Suurpuhastus → PAUSED */
  const campRows = await gaql(
    token,
    `SELECT campaign.name, campaign.status FROM campaign WHERE campaign.id = ${CAMP_EHITUS}`,
  )
  const camp = campRows[0]?.campaign ?? {}
  console.log(`1) „${camp.name}" olek: ${camp.status}`)
  if (camp.status !== "PAUSED" && camp.status !== "REMOVED") {
    await mutate(
      token,
      "campaigns",
      [{ update: { resourceName: `customers/${CUSTOMER_ID}/campaigns/${CAMP_EHITUS}`, status: "PAUSED" }, updateMask: "status" }],
      "ehitusjargse kampaania peatus",
    )
    console.log("   → PAUSED")
  } else {
    console.log("   juba peatatud")
  }

  /* 2) Koristusteenus B2B eelarve €8 → €14 */
  const budgetRows = await gaql(
    token,
    `SELECT campaign.name, campaign_budget.resource_name, campaign_budget.amount_micros FROM campaign WHERE campaign.id = ${CAMP_KORISTUS}`,
  )
  const budgetRn = String(budgetRows[0]?.campaignBudget?.resourceName ?? "")
  const curMicros = Number(budgetRows[0]?.campaignBudget?.amountMicros ?? budgetRows[0]?.campaignBudget?.amount_micros ?? 0)
  const targetMicros = NEW_BUDGET_EUR * 1_000_000
  console.log(`2) Koristusteenus B2B eelarve: €${(curMicros / 1_000_000).toFixed(2)}/päev`)
  if (budgetRn && curMicros !== targetMicros) {
    await mutate(
      token,
      "campaignBudgets",
      [{ update: { resourceName: budgetRn, amountMicros: String(targetMicros) }, updateMask: "amountMicros" }],
      "eelarve €8 → €14",
    )
    console.log(`   → €${NEW_BUDGET_EUR}/päev`)
  } else {
    console.log(`   juba €${NEW_BUDGET_EUR}/päev`)
  }

  /* 3) Grupp „Hoolduskoristus (tuum)" → PAUSED */
  const groupRows = await gaql(
    token,
    `SELECT ad_group.name, ad_group.status FROM ad_group WHERE ad_group.id = ${GROUP_HOOLDUS}`,
  )
  const grp = groupRows[0]?.adGroup ?? {}
  console.log(`3) grupp „${grp.name}" olek: ${grp.status}`)
  if (grp.status === "ENABLED") {
    await mutate(
      token,
      "adGroups",
      [{ update: { resourceName: `customers/${CUSTOMER_ID}/adGroups/${GROUP_HOOLDUS}`, status: "PAUSED" }, updateMask: "status" }],
      "hoolduskoristus-grupi peatus",
    )
    console.log("   → PAUSED")
  } else {
    console.log("   juba peatatud")
  }

  /* 4) KÕIK ENABLED kampaaniad: „hoolduskoristus*" ENABLED märksõnad → PAUSED
   * (põhikampaania + vanad zombi-testkampaaniad; peatatud kampaaniad/grupid vahele —
   *  nende märksõnad ei esita nagunii) */
  const kwRows = await gaql(
    token,
    `SELECT campaign.name, ad_group.name, ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type
     FROM ad_group_criterion
     WHERE campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED'
       AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status = 'ENABLED'`,
  )
  const hooldusKws = kwRows.filter((r) => {
    const c = (r.adGroupCriterion ?? {}) as Record<string, unknown>
    const kw = (c.keyword ?? {}) as Record<string, unknown>
    return String(kw.text ?? "").toLowerCase().includes("hoolduskoristus")
  })
  console.log(`4) ENABLED kampaaniates „hoolduskoristus*" märksõnu: ${hooldusKws.length}`)
  for (const r of hooldusKws) {
    const c = (r.adGroupCriterion ?? {}) as Record<string, unknown>
    const kw = (c.keyword ?? {}) as Record<string, unknown>
    console.log(`   - ${r.campaign?.name} > ${r.adGroup?.name} > „${kw.text}" [${kw.matchType ?? kw.match_type}]`)
  }
  await mutate(
    token,
    "adGroupCriteria",
    hooldusKws.map((r) => ({
      update: {
        resourceName: String(((r.adGroupCriterion ?? {}) as Record<string, unknown>).resourceName ?? ""),
        status: "PAUSED",
      },
      updateMask: "status",
    })),
    "hoolduskoristus-märksõnade peatus (kõik ENABLED kampaaniad)",
  )

  /* 5) Üldise grupi täiendus: puhastusfirma + puhastusfirmad (GSC ~70 näitamist/kuu) */
  const genRows = await gaql(
    token,
    `SELECT ad_group.resource_name, ad_group.name FROM ad_group WHERE campaign.id = ${CAMP_KORISTUS} AND ad_group.status != 'REMOVED'`,
  )
  const genRn = genRows.find((g) => String(g.adGroup?.name ?? "") === GENERAL_GROUP_NAME)?.adGroup?.resourceName as string | undefined
  if (!genRn) {
    console.warn(`5) ⚠ gruppi „${GENERAL_GROUP_NAME}" ei leitud — lisa märksõnad käsitsi`)
  } else {
    const critRows = await gaql(
      token,
      `SELECT ad_group_criterion.keyword.text FROM ad_group_criterion WHERE ad_group.resource_name = '${genRn}' AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED'`,
    )
    const have = new Set(
      critRows.map((r) => String(((((r.adGroupCriterion ?? {}) as Record<string, unknown>).keyword ?? {}) as Record<string, unknown>).text ?? "").toLowerCase().trim()),
    )
    const addOps = GENERAL_GROUP_ADD_KW.filter((k) => !have.has(k)).map((text) => ({
      create: { adGroup: genRn, status: "ENABLED", keyword: { text, matchType: "PHRASE" } },
    }))
    console.log(`5) „${GENERAL_GROUP_NAME}": lisatakse ${addOps.length}/${GENERAL_GROUP_ADD_KW.length} märksõna (${GENERAL_GROUP_ADD_KW.join(", ")})`)
    await mutate(token, "adGroupCriteria", addOps, "puhastusfirma-märksõnade lisus")
  }

  /* Kontroll: P26 kampaaniate lõppseis + kogulagi */
  const finalRows = await gaql(
    token,
    `SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros FROM campaign
     WHERE campaign.id IN (${CAMP_EHITUS}, ${CAMP_KORISTUS}, ${CAMP_DSA})`,
  )
  console.log("\n=== P26 lõppseis ===")
  let totalMicros = 0
  for (const r of finalRows) {
    const c = r.campaign ?? {}
    const b = r.campaignBudget ?? {}
    const micros = Number(b.amountMicros ?? b.amount_micros ?? 0)
    if (String(c.status) === "ENABLED") totalMicros += micros
    console.log(` ${c.id}  ${String(c.status ?? "").padEnd(8)}  €${(micros / 1_000_000).toFixed(0)}/päev  ${c.name}`)
  }
  console.log(` ENABLED kampaaniate kogulagi: €${(totalMicros / 1_000_000).toFixed(0)}/päev (peab olema ≤ €17)`)

  console.log("\nValmis. Kontrolli Ads UI-s: kampaania olekud, eelarved, üldise grupi märksõnad.")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
