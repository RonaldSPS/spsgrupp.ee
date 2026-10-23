/**
 * P26 strateegia ümberhindamine (kliendi direktiiv 23.10.2026):
 *  „hoolduskoristus" märksõnale ei saa kampaaniat üles ehitada — seda ei otsita.
 *  Maht on sõnadel: koristusteenus, puhastusteenused, kontori koristus jms.
 *
 * Nädala andmed (15.–21.10): P26 „Hoolduskoristus B2B" sai 38 näitamist ja 0 klikki
 * (rank-lost IS 41 %) — kampaania oli ehitatud madala otsingumahuga tuumiksõnadele.
 *
 * Muudatused (kampaania 24367981618, idempotentne, --dry-run toetatud):
 *  1. Kampaania ümber: „P26 · Otsing · Hoolduskoristus B2B" → „P26 · Otsing · Koristusteenus B2B".
 *  2. Eemaldab eraldus-negatiivsed (koristusteenus/koristusteenused/puhastusteenused/
 *     puhastusteenus/koristusfirma/puhastusfirma EXACT) SELLELT kampaanialt — need
 *     sundisid P26 nulli-mahuga terminitele. Põhikampaania jääb puutumata; sama konto
 *     kaudu võistlevad oksjonil parem reklaamikoht (ei topelttasu).
 *  3. Uus grupp „Koristusteenus (üldine)": tegeliku mahuga PHRASE-märksõnad
 *     (koristusteenus, koristusteenused, puhastusteenused, koristusfirma + tallinn-variantid),
 *     B2B-kvalifitseeritud RSA → sihtleht /koristusteenus/ (FAMILY_TARGET_PAGES hub).
 *  4. Pakkumiste tõus (rank-lost IS 41 %): Kontorikoristus 3,0→5,0 €,
 *     Hoolduskoristus (tuum) 3,5→4,5 €, uus grupp 4,5 €. Eelarve jääb €8/päev.
 *  5. RSA-tekstidest „alates 800 m²" välja (kliendi direktiiv 23.10: üldist
 *     miinimumpiirangut pole — ka väiksem objekt on tasuv). RSA on v25-s immutable:
 *     luuakse uus reklaam ja vana eemaldatakse.
 *
 * Auth: sama mis ads-p26-setup.ts.
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

const CAMPAIGN_ID = "24367981618"
const CAMPAIGN_RN = `customers/${CUSTOMER_ID}/campaigns/${CAMPAIGN_ID}`
const OLD_NAME = "P26 · Otsing · Hoolduskoristus B2B"
const NEW_NAME = "P26 · Otsing · Koristusteenus B2B"

const SEPARATION_NEGATIVES = ["koristusteenus", "koristusteenused", "puhastusteenused", "puhastusteenus", "koristusfirma", "puhastusfirma"]

const GROUP_KONTORI = { id: "201355358539", newBidEur: 5.0 }
const GROUP_HOOLDUS = { id: "204066028231", newBidEur: 4.5 }
const NEW_GROUP = { name: "Koristusteenus (üldine)", bidEur: 4.5 }

const NEW_GROUP_KEYWORDS = [
  "koristusteenus", "koristusteenused", "puhastusteenused", "koristusfirma",
  "koristusfirma tallinnas", "koristusteenus tallinn", "koristusteenused tallinnas", "puhastusteenused tallinnas",
]

const NEW_GROUP_AD = {
  finalUrls: ["https://spsgrupp.ee/koristusteenus/"],
  path1: "koristusteenus",
  path2: "",
  headlines: [
    "Koristusteenus ettevõtetele", "Koristusteenused Tallinnas", "Alates 1,20 €/m² kuus",
    "Lepinguline koristus B2B", "ISO 9001 ja ISO 14001", "Üle 1 000 000 m² hoolduses",
    "Meid usaldab 200+ klienti", "Kindel meeskond igal objektil", "Tasuta objekti ülevaatus",
    "Kogemus alates 2006", "Vastus 1 tööpäevaga", "Küsi tasuta pakkumist",
    "Koristus 1–7× nädalas", "Objektijuht jälgib kvaliteeti", "Kontorid, kaubandus, tootmine",
  ],
  descriptions: [
    "Koristus- ja puhastusteenused ettevõtetele Tallinnas ja Harjumaal. Tasuta ülevaatus.",
    "Regulaarne lepinguline koristus: kindel meeskond, objektijuht ja kvaliteedikontroll.",
    "Hind alates 1,20 €/m² kuus. Hinnapakkumine 1 tööpäevaga. ISO 9001 ja 14001.",
    "300+ töötajat ja kogemus alates 2006. Teenindame igas suuruses äripindu.",
  ],
}

/** 800 m² välja — RSA immutable v25-s: create + remove. */
const RSA_SWAPS: { groupRn: string; oldAdId: string; headlines: string[]; descriptions: string[]; finalUrls: string[]; path1: string }[] = [
  {
    groupRn: `customers/${CUSTOMER_ID}/adGroups/${GROUP_KONTORI.id}`,
    oldAdId: "828367153178",
    finalUrls: ["https://spsgrupp.ee/koristusteenus/kontori-koristus/"],
    path1: "kontorikoristus",
    headlines: [
      "Kontori koristus Tallinnas", "Alates 1,20 €/m² kuus", "Meid usaldab 50+ kontorit",
      "Tasuta audit enne lepingut", "ISO 9001 kvaliteedijuhtimine", "Objektijuht jälgib kvaliteeti",
      "Igas suuruses büroodele", "Paindlik graafik", "Koolitatud personal",
      "Kogemus alates 2006", "Vastus 1 tööpäevaga", "Küsi tasuta pakkumist",
      "Kontorikoristus ettevõtetele", "Äripindade koristus", "Regulaarne kvaliteedikontroll",
    ],
    descriptions: [
      "Regulaarne kontorikoristus igas suuruses büroodes. Hind alates 1,20 €/m² kuus.",
      "Tasuta objekti ülevaatus ja hinnapakkumine 1 tööpäevaga. ISO 9001 kvaliteet.",
      "Paindlik graafik, koolitatud personal ja konfidentsiaalsusleping igal töötajal.",
      "Kontorid ja bürood Tallinnas ja Harjumaal. Kindel meeskond igal objektil.",
    ],
  },
  {
    groupRn: `customers/${CUSTOMER_ID}/adGroups/${GROUP_HOOLDUS.id}`,
    oldAdId: "828241436055",
    finalUrls: ["https://spsgrupp.ee/koristusteenus/hoolduskoristus/"],
    path1: "hoolduskoristus",
    headlines: [
      "Hoolduskoristus äripindadele", "Hoolduskoristus Tallinnas", "Alates 1,20 €/m² kuus",
      "Lepinguline koristus", "Objektijuht jälgib kvaliteeti", "ISO 9001 ja ISO 14001",
      "Üle 1 000 000 m² hoolduses", "Meid usaldab 50+ kontorit", "Äripinnad igas suuruses",
      "Kindel meeskond igal objektil", "Tasuta objekti ülevaatus", "Kogemus alates 2006",
      "Vastus 1 tööpäevaga", "Küsi tasuta pakkumist", "Koristus 1–7× nädalas",
    ],
    descriptions: [
      "Lepingueline hoolduskoristus kontoritele ja äripindadele Tallinnas ja Harjumaal.",
      "Kindel meeskond, objektijuht ja regulaarne kvaliteedikontroll. ISO 9001 ja 14001.",
      "Hind alates 1,20 €/m² kuus. Tasuta ülevaatus ja hinnapakkumine 1 tööpäevaga.",
      "Koristus 1–7× nädalas kokkulepitud graafikus - asendus alati tagatud.",
    ],
  },
]

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
  for (const ad of [...RSA_SWAPS, NEW_GROUP_AD]) {
    for (const h of ad.headlines) if (h.length > 30) throw new Error(`Pealkiri üle 30 märgi (${h.length}): „${h}"`)
    for (const d of ad.descriptions) if (d.length > 90) throw new Error(`Kirjeldus üle 90 märgi (${d.length}): „${d}"`)
  }
  const token = await getAccessToken()
  console.log(`${DRY_RUN ? "[DRY-RUN] " : ""}P26 ümberfokus (campaign ${CAMPAIGN_ID})`)

  /* 1) ümbernimetus */
  const camp = await gaql(token, `SELECT campaign.name FROM campaign WHERE campaign.id = ${CAMPAIGN_ID}`)
  const curName = String(camp[0]?.campaign?.name ?? "")
  if (curName === OLD_NAME) {
    await mutate(token, "campaigns", [{ update: { resourceName: CAMPAIGN_RN, name: NEW_NAME }, updateMask: "name" }], "kampaania ümbernimetus")
    console.log(`1) ümber nimetatud: „${NEW_NAME}"`)
  } else {
    console.log(`1) nimi juba korras („${curName}")`)
  }

  /* 2) eraldus-negatiivsete eemaldamine (ainult sellelt kampaanialt) */
  const negRows = await gaql(
    token,
    `SELECT campaign_criterion.resource_name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
     FROM campaign_criterion WHERE campaign.id = ${CAMPAIGN_ID} AND campaign_criterion.negative = TRUE`,
  )
  const removeOps = negRows
    .filter((r) => {
      const c = r.campaignCriterion ?? {}
      const kw = (c.keyword ?? {}) as Record<string, unknown>
      const text = String(kw.text ?? "").toLowerCase().trim()
      const mt = String(kw.matchType ?? kw.match_type ?? "").toUpperCase()
      return mt === "EXACT" && SEPARATION_NEGATIVES.includes(text)
    })
    .map((r) => ({ remove: String((r.campaignCriterion as Record<string, unknown>)?.resourceName ?? "") }))
  console.log(`2) eemaldan eraldus-negatiivsed: ${removeOps.length} / ${SEPARATION_NEGATIVES.length}`)
  await mutate(token, "campaignCriteria", removeOps, "eraldus-negatiivsete eemaldus")

  /* 3) pakkumiste tõus */
  const bidOps = [GROUP_KONTORI, GROUP_HOOLDUS].map((g) => ({
    update: { resourceName: `customers/${CUSTOMER_ID}/adGroups/${g.id}`, cpcBidMicros: String(Math.round(g.newBidEur * 1_000_000)) },
    updateMask: "cpcBidMicros",
  }))
  console.log(`3) pakkumised: Kontorikoristus → €${GROUP_KONTORI.newBidEur}, Hoolduskoristus (tuum) → €${GROUP_HOOLDUS.newBidEur}`)
  await mutate(token, "adGroups", bidOps, "pakkumiste tõus")

  /* 4) uus grupp „Koristusteenus (üldine)" */
  const groupRows = await gaql(token, `SELECT ad_group.resource_name, ad_group.name FROM ad_group WHERE campaign.id = ${CAMPAIGN_ID}`)
  let newGroupRn = groupRows.find((g) => String(g.adGroup?.name ?? "") === NEW_GROUP.name)?.adGroup?.resourceName as string | undefined
  if (!newGroupRn) {
    const created = await mutate(token, "adGroups", [
      { create: { campaign: CAMPAIGN_RN, name: NEW_GROUP.name, status: "ENABLED", type: "SEARCH_STANDARD", cpcBidMicros: String(Math.round(NEW_GROUP.bidEur * 1_000_000)) } },
    ], `grupp „${NEW_GROUP.name}"`)
    newGroupRn = created[0] || `customers/${CUSTOMER_ID}/adGroups/dryRun`
    console.log(`4) grupp loodud: ${NEW_GROUP.name} (bid €${NEW_GROUP.bidEur})`)
  } else {
    console.log(`4) grupp „${NEW_GROUP.name}" juba olemas`)
  }

  if (newGroupRn && !newGroupRn.includes("dryRun")) {
    const critRows = await gaql(token, `SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type FROM ad_group_criterion WHERE ad_group.resource_name = '${newGroupRn}' AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED'`)
    const haveKw = new Set(critRows.map((r) => String((((r.adGroupCriterion ?? {}) as Record<string, unknown>).keyword as Record<string, unknown>)?.text ?? "").toLowerCase().trim()))
    const kwOps = NEW_GROUP_KEYWORDS.filter((k) => !haveKw.has(k.toLowerCase())).map((text) => ({
      create: { adGroup: newGroupRn, status: "ENABLED", keyword: { text, matchType: "PHRASE" } },
    }))
    console.log(`   märksõnu lisatakse: ${kwOps.length} / ${NEW_GROUP_KEYWORDS.length}`)
    await mutate(token, "adGroupCriteria", kwOps, "üldise grupi märksõnad")

    const adRows = await gaql(token, `SELECT ad_group_ad.ad.id, ad_group_ad.status FROM ad_group_ad WHERE ad_group.resource_name = '${newGroupRn}' AND ad_group_ad.status != 'REMOVED'`)
    if (adRows.length === 0) {
      await mutate(token, "adGroupAds", [
        {
          create: {
            adGroup: newGroupRn,
            status: "ENABLED",
            ad: {
              finalUrls: NEW_GROUP_AD.finalUrls,
              responsiveSearchAd: {
                headlines: NEW_GROUP_AD.headlines.map((text) => ({ text })),
                descriptions: NEW_GROUP_AD.descriptions.map((text) => ({ text })),
                path1: NEW_GROUP_AD.path1,
                path2: NEW_GROUP_AD.path2,
              },
            },
          },
        },
      ], "üldise grupi RSA")
      console.log("   RSA loodud")
    } else {
      console.log("   RSA juba olemas")
    }
  }

  /* 5) RSA 800 m² swap: uus sisu + vana remove */
  for (const swap of RSA_SWAPS) {
    const adRows = await gaql(token, `SELECT ad_group_ad.resource_name, ad_group_ad.ad.id, ad_group_ad.status, ad_group_ad.ad.responsive_search_ad.headlines FROM ad_group_ad WHERE ad_group.resource_name = '${swap.groupRn}' AND ad_group_ad.status != 'REMOVED'`)
    const oldRn = `${swap.groupRn.replace("adGroups", "adGroupAds")}~${swap.oldAdId}`
    const oldAlive = adRows.some((r) => String(r.adGroupAd?.resourceName ?? "") === oldRn)
    const newAlive = adRows.some((r) => {
      const heads = (((r.adGroupAd?.ad as Record<string, unknown>)?.responsiveSearchAd as Record<string, unknown>)?.headlines ?? []) as { text?: string }[]
      return heads.some((h) => h.text === "Igas suuruses büroodele" || h.text === "Äripinnad igas suuruses")
    })
    if (!newAlive) {
      await mutate(token, "adGroupAds", [
        {
          create: {
            adGroup: swap.groupRn,
            status: "ENABLED",
            ad: {
              finalUrls: swap.finalUrls,
              responsiveSearchAd: {
                headlines: swap.headlines.map((text) => ({ text })),
                descriptions: swap.descriptions.map((text) => ({ text })),
                path1: swap.path1,
                path2: "",
              },
            },
          },
        },
      ], `RSA ilma 800 m²-ta (grupp ${swap.groupRn.split("/").pop()})`)
      console.log(`5) uus RSA loodud (grupp ${swap.groupRn.split("/").pop()})`)
    } else {
      console.log(`5) uus RSA juba olemas (grupp ${swap.groupRn.split("/").pop()})`)
    }
    if (oldAlive) {
      await mutate(token, "adGroupAds", [{ remove: oldRn }], `vana 800 m² RSA eemaldus (${swap.oldAdId})`)
      console.log(`   vana reklaam ${swap.oldAdId} eemaldatud`)
    } else {
      console.log(`   vana reklaam ${swap.oldAdId} juba eemaldatud`)
    }
  }

  console.log("\nValmis. Kontrolli Ads UI-s: kampaania nimi, grupi märksõnad, reklaamid.")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
