/**
 * P26 reklaamide tugevdamine + assetid (plaani §3.4 jätk, 16.10.2026):
 *   1. RSA-d täies mahus: 15 unikaalset pealkirja (märksõna pealkirjades,
 *      B2B-kvalifikaatorid) + 4 kirjeldust — Ad strength "Average" → "Good/Excellent"
 *   2. Kampaania-taseme assetid: sitelinkid (4/kampaania), callout'id,
 *      structured snippet (teenuste kataloog), kõne-asset (662 3328)
 *   3. Pildid: osa konto asset-kirjastusest, osa veebilehe failidest üles laaditud
 *
 * Idempotentne (olemasolevaid ei dubleeri; nimeprefiks „P26 ·").
 * Kasutus: npx tsx scripts/ads-p26-assets.ts [--dry-run]
 */

import { readFileSync, existsSync } from "node:fs"
import { GoogleAuth } from "google-auth-library"

/* ---------- env ---------- */
function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq === -1) continue
    if (process.env[t.slice(0, eq).trim()] === undefined) process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim()
  }
}
loadEnvLocal()

const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"
const ADS_API_VERSION = "v25"
const DRY_RUN = process.argv.includes("--dry-run")
const PREFIX = "P26 · "
const ASSET_PREFIX = "P26 · "

if (!DEVELOPER_TOKEN || !CUSTOMER_ID) {
  console.error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID puuduvad.")
  process.exit(1)
}

/* ---------- tugevdatud RSA tekstid (lõplikud) ---------- */

interface RsaDef {
  adGroupName: string
  finalUrls: string[]
  path1: string
  headlines: string[]
  descriptions: string[]
}

const RSA_DEFS: RsaDef[] = [
  {
    adGroupName: "Hoolduskoristus (tuum)",
    finalUrls: ["https://spsgrupp.ee/koristusteenus/hoolduskoristus/"],
    path1: "hoolduskoristus",
    headlines: [
      "Hoolduskoristus äripindadele", "Hoolduskoristus Tallinnas", "Alates 1,20 €/m² kuus",
      "Lepinguline koristus", "Objektijuht jälgib kvaliteeti", "ISO 9001 ja ISO 14001",
      "Üle 1 000 000 m² hoolduses", "Meid usaldab 50+ kontorit", "Äripinnad alates 800 m²",
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
  {
    adGroupName: "Kontorikoristus",
    finalUrls: ["https://spsgrupp.ee/koristusteenus/kontori-koristus/"],
    path1: "kontorikoristus",
    headlines: [
      "Kontori koristus Tallinnas", "Alates 1,20 €/m² kuus", "Meid usaldab 50+ kontorit",
      "Tasuta audit enne lepingut", "ISO 9001 kvaliteedijuhtimine", "Objektijuht jälgib kvaliteeti",
      "Büroodele alates 800 m²", "Paindlik graafik", "Koolitatud personal",
      "Kogemus alates 2006", "Vastus 1 tööpäevaga", "Küsi tasuta pakkumist",
      "Kontorikoristus ettevõtetele", "Äripindade koristus", "Regulaarne kvaliteedikontroll",
    ],
    descriptions: [
      "Regulaarne kontorikoristus alates 800 m². Hind alates 1,20 €/m² kuus.",
      "Tasuta objekti ülevaatus ja hinnapakkumine 1 tööpäevaga. ISO 9001 kvaliteet.",
      "Paindlik graafik, koolitatud personal ja konfidentsiaalsusleping igal töötajal.",
      "Kontorid ja bürood Tallinnas ja Harjumaal. Miinimum alates 800 m², kindel meeskond.",
    ],
  },
  {
    adGroupName: "Ehitusjärgne koristus",
    finalUrls: ["https://spsgrupp.ee/puhastusteenused/ehitusjargne-koristus/"],
    path1: "ehitusjargne",
    headlines: [
      "Ehitusjärgne koristus", "Remondijärgne koristus", "Tallinn ja Harjumaa",
      "Tasuta hindamine", "Kogemus alates 2006", "Pakkumine 1 tööpäevaga",
      "Küsi tasuta hindamist", "ISO 9001 ja ISO 14001", "Ehitusjärgne puhastus",
      "Objekt üleandmiseks valmis", "Praht ja tolm kaovad", "Kiire reageerimine",
      "Üle 1 000 000 m² hoolduses", "300+ töötajat", "Koristus ja prahi äravedu",
    ],
    descriptions: [
      "Ehitusjärgne koristus äriobjektidele. Tasuta hindamine - pakkumine 1 tööpäevaga.",
      "Kogemus alates 2006 ja ISO 9001/14001 süsteemid. Küsi tasuta hindamist!",
      "Ehitustolm, praht, värvitilgad ja kleebised kaovad. Objekt valmis üleandmiseks.",
      "Kombineeritud teenus koos prahi äraveoga - orienteeruv hind alates 250 € objekti kohta.",
    ],
  },
  {
    adGroupName: "Suurpuhastus B2B",
    finalUrls: ["https://spsgrupp.ee/puhastusteenused/suurpuhastus/"],
    path1: "suurpuhastus",
    headlines: [
      "Suurpuhastus äripindadele", "Suurpuhastus Tallinnas", "Kontori suurpuhastus",
      "Tasuta hindamine", "Pakkumine 1 tööpäevaga", "Põrandate masinapesu",
      "ISO 9001 ja ISO 14001", "Kogemus alates 2006", "Küsi tasuta hindamist",
      "Äripinna suurpuhastus", "Katlakivi eemaldus", "Varjatud alad puhtaks",
      "300+ töötajat", "Vastus 1 tööpäevaga", "Üle 1 000 000 m² hoolduses",
    ],
    descriptions: [
      "Süvapuhastus äripindadele: põrandate masinapesu, katlakivi eemaldus, varjatud alad.",
      "Tasuta hindamine - pakkumine 1 tööpäevaga. ISO 9001, kogemus alates 2006.",
      "Ühekordne põhjalik süvapuhastus kontoritele ja äripindadele Tallinnas ja Harjumaal.",
      "Tasuta ülevaatus kohapeal. Orienteeruv hind alates 1,50 €/m².",
    ],
  },
]

/* ---------- kampaania-taseme assetid ---------- */

const CALLOUTS = ["ISO 9001 ja ISO 14001", "Alates 2006", "300+ töötajat", "Tasuta ülevaatus", "Objektijuhi kontroll", "Vastus 1 tööpäevaga"]

const SNIPPET_VALUES = ["Hoolduskoristus", "Kontorikoristus", "Suurpuhastus", "Ehitusjärgne koristus", "Akende pesu", "Välikoristus"]

interface SitelinkDef { text: string; d1: string; d2: string; url: string }

const SITELINKS_BY_CAMPAIGN: Record<string, SitelinkDef[]> = {
  [`${PREFIX}Otsing · Hoolduskoristus B2B`]: [
    { text: "Hoolduskoristus", d1: "Lepingueline koristus 1–7× nädalas", d2: "Alates 1,20 €/m² kuus", url: "https://spsgrupp.ee/koristusteenus/hoolduskoristus/" },
    { text: "Kontori koristus", d1: "Büroodele alates 800 m²", d2: "Tasuta audit enne lepingut", url: "https://spsgrupp.ee/koristusteenus/kontori-koristus/" },
    { text: "Kaubanduspindade koristus", d1: "Poed, keskused, esindused", d2: "Regulaarne hooldus", url: "https://spsgrupp.ee/koristusteenus/kaubanduspindade-koristus/" },
    { text: "Küsi pakkumist", d1: "Vastus 1 tööpäevaga", d2: "Tasuta objekti ülevaatus", url: "https://spsgrupp.ee/kontakt/" },
  ],
  [`${PREFIX}Otsing · Ehitusjärgne + Suurpuhastus B2B`]: [
    { text: "Ehitusjärgne koristus", d1: "Objekt üleandmiseks valmis", d2: "Tasuta hindamine", url: "https://spsgrupp.ee/puhastusteenused/ehitusjargne-koristus/" },
    { text: "Suurpuhastus", d1: "Süvapuhastus äripindadele", d2: "Alates 1,50 €/m²", url: "https://spsgrupp.ee/puhastusteenused/suurpuhastus/" },
    { text: "Põrandate hooldus", d1: "Süvapesu ja vahatamine", d2: "Alates 1,40 €/m²", url: "https://spsgrupp.ee/puhastusteenused/porandate-hooldus/" },
    { text: "Küsi pakkumist", d1: "Vastus 1 tööpäevaga", d2: "Tasuta hindamine", url: "https://spsgrupp.ee/kontakt/" },
  ],
  [`${PREFIX}Otsing · DSA-kaevur`]: [
    { text: "Puhastusteenused", d1: "Ühekordsed eritööd", d2: "Alates 1 €/m²", url: "https://spsgrupp.ee/puhastusteenused/" },
    { text: "Koristusteenused", d1: "Regulaarne hooldus B2B", d2: "Alates 1,20 €/m² kuus", url: "https://spsgrupp.ee/koristusteenus/" },
    { text: "Hoolduskoristus", d1: "Lepingueline, 1–7× nädalas", d2: "Tasuta ülevaatus", url: "https://spsgrupp.ee/koristusteenus/hoolduskoristus/" },
    { text: "Küsi pakkumist", d1: "Vastus 1 tööpäevaga", d2: "Tasuta ülevaatus", url: "https://spsgrupp.ee/kontakt/" },
  ],
}

/** Üles laetavad pildid (veebilehe failid) + konto asset-kirjastuse valikud kampaania kaupa. */
const IMAGES_BY_CAMPAIGN: Record<string, { uploads: string[]; library: string[] }> = {
  [`${PREFIX}Otsing · Hoolduskoristus B2B`]: {
    uploads: ["public/kontorikoristus1.jpg", "public/kontorikoristus2.jpg"],
    library: ["koristusfirmaSPS-Grupp_1,91 : 1.jpg"],
  },
  [`${PREFIX}Otsing · Ehitusjärgne + Suurpuhastus B2B`]: {
    uploads: ["public/ehitusjargne-koristus-1.jpg", "public/puhastusteenused1.jpg"],
    library: ["ehitusjäargnekoristus3_1.9108.jpg", "ehitusjargnekoristus4.jpg"],
  },
  [`${PREFIX}Otsing · DSA-kaevur`]: {
    uploads: ["public/Koristusteenused-HERO.jpg"],
    library: ["SPSpuhastusteenused.png", "SPSpuhastusteenusedWide500.png"],
  },
}

/* ---------- REST abid ---------- */

async function getAccessToken(): Promise<string> {
  if (!existsSync(KEY_FILE)) throw new Error(`Teenuskonto võtit pole: ${KEY_FILE}`)
  const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes: ["https://www.googleapis.com/auth/adwords"] })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error("Access tokeni loomine ebaõnnestus")
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

type Row = Record<string, Record<string, unknown> | undefined>

async function gaql(token: string, query: string): Promise<Row[]> {
  const res = await fetch(`https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/googleAds:search`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ query }),
  })
  if (!res.ok) throw new Error(`GAQL (${res.status}): ${(await res.text()).slice(0, 400)}`)
  return ((await res.json()) as { results?: Row[] }).results ?? []
}

async function mutate(token: string, service: string, operations: unknown[], label: string): Promise<string[]> {
  if (operations.length === 0) return []
  if (DRY_RUN) {
    console.log(`--- [dry-run] ${service}:mutate (${operations.length} op) — ${label}`)
    console.log(JSON.stringify(operations, null, 2).slice(0, 2500))
    return operations.map((_, i) => `dryRun/${service}/${i}`)
  }
  const res = await fetch(`https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/${service}:mutate`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ operations, partialFailure: true }),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${service}:mutate (${res.status}) — ${label}: ${text.slice(0, 600)}`)
  const data = JSON.parse(text) as { results?: { resourceName?: string }[]; partialFailureError?: { message?: string } }
  if (data.partialFailureError) {
    const results = data.results ?? []
    if (results.length === 0) throw new Error(`${label}: ${data.partialFailureError.message}`)
    console.warn(`  ⚠ osaline viga (${label}): ${data.partialFailureError.message}`)
  }
  return (data.results ?? []).map((r) => r.resourceName ?? "")
}

/* ---------- põhiloogika ---------- */

async function main() {
  console.log(DRY_RUN ? "== P26 assetid — DRY RUN ==" : "== P26 assetid + RSA tugevdamine ==")
  const token = await getAccessToken()

  /* 1. RSA tugevdamine (update in place; fallback create+remove) */
  const adRows = await gaql(
    token,
    `SELECT ad_group.name, ad_group_ad.resource_name, ad_group_ad.ad.responsive_search_ad.headlines FROM ad_group_ad WHERE campaign.name LIKE '${PREFIX}%' AND ad_group_ad.status != 'REMOVED' AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'`,
  )
  for (const def of RSA_DEFS) {
    for (const h of def.headlines) if (h.length > 30) throw new Error(`Pealkiri >30 (${h.length}): ${h}`)
    for (const d of def.descriptions) if (d.length > 90) throw new Error(`Kirjeldus >90 (${d.length}): ${d}`)
    const row = adRows.find((r) => String((r.ad_group ?? r.adGroup)?.name ?? "") === def.adGroupName)
    const rn = String((row?.ad_group_ad ?? row?.adGroupAd)?.resource_name ?? (row?.ad_group_ad ?? row?.adGroupAd)?.resourceName ?? "")
    if (!rn) {
      console.warn(`⚠ „${def.adGroupName}" RSA-d ei leitud — jätan vahele`)
      continue
    }
    const existing = ((row?.ad_group_ad ?? row?.adGroupAd)?.ad as Record<string, unknown> | undefined)
    const rsa = (existing?.responsiveSearchAd ?? existing?.responsive_search_ad ?? {}) as { headlines?: { text?: string }[]; descriptions?: { text?: string }[] }
    const sameHeadlines = (rsa.headlines?.length ?? 0) === def.headlines.length && (rsa.descriptions?.length ?? 0) === def.descriptions.length
    if (sameHeadlines) {
      console.log(`„${def.adGroupName}": juba ${def.headlines.length} pealkirja + ${def.descriptions.length} kirjeldust — vahele`)
      continue
    }
    /* RSA on v25-s immutable (update ei rakendu) — loon uue ja eemaldan vana.
     * Kui loomine ebaõnnestub (nt poliitikaskani kõikumine), jääb vana alles. */
    const adGroupRn = rn.split("~")[0]?.replace("adGroupAds", "adGroups") ?? ""
    const [newRn] = await mutate(token, "adGroupAds", [
      {
        create: {
          adGroup: adGroupRn,
          status: "ENABLED",
          ad: {
            finalUrls: def.finalUrls,
            responsiveSearchAd: {
              headlines: def.headlines.map((text) => ({ text })),
              descriptions: def.descriptions.map((text) => ({ text })),
              path1: def.path1,
              path2: "",
            },
          },
        },
      },
    ], `RSA create ${def.adGroupName}`)
    await mutate(token, "adGroupAds", [{ remove: rn }], `vana RSA remove ${def.adGroupName}`)
    console.log(`„${def.adGroupName}": uus RSA (${newRn}) — ${def.headlines.length} pealkirja, ${def.descriptions.length} kirjeldust; vana eemaldatud`)
  }

  /* 2. Olemasolevad assetid (nime järgi dedup) + kampaania lingid */
  const assetRows = await gaql(token, `SELECT asset.resource_name, asset.name, asset.type FROM asset WHERE asset.type IN ('SITELINK','CALLOUT','STRUCTURED_SNIPPET','IMAGE','CALL')`)
  const byName = new Map<string, string>()
  for (const r of assetRows) {
    const a = r.asset ?? {}
    byName.set(`${String(a.type)}::${String(a.name ?? "")}`, String(a.resource_name ?? a.resourceName ?? ""))
  }
  const campaignRows = await gaql(token, `SELECT campaign.name, campaign.resource_name FROM campaign WHERE campaign.name LIKE '${PREFIX}%'`)
  const campaignRn = new Map(campaignRows.map((r) => [String(r.campaign?.name ?? ""), String(r.campaign?.resource_name ?? r.campaign?.resourceName ?? "")]))
  const linkRows = await gaql(token, `SELECT campaign.name, campaign_asset.field_type, campaign_asset.asset FROM campaign_asset WHERE campaign.name LIKE '${PREFIX}%'`)
  const linked = new Set(linkRows.map((r) => `${String(r.campaign?.name)}::${String((r.campaign_asset ?? r.campaignAsset)?.field_type ?? (r.campaign_asset ?? r.campaignAsset)?.fieldType)}::${String((r.campaign_asset ?? r.campaignAsset)?.asset)}`))

  const linkOps: Record<string, unknown>[] = []
  const queueLink = (campaign: string, fieldType: string, assetRn: string) => {
    if (!assetRn || linked.has(`${campaign}::${fieldType}::${assetRn}`)) return
    const crn = campaignRn.get(campaign)
    if (!crn) return
    linkOps.push({ create: { campaign: crn, asset: assetRn, fieldType } })
    linked.add(`${campaign}::${fieldType}::${assetRn}`)
  }

  /* 2a. Callout'id (jagatud) */
  const calloutRns: string[] = []
  for (const text of CALLOUTS) {
    const key = `CALLOUT::${ASSET_PREFIX}${text}`
    let rn = byName.get(key)
    if (!rn) {
      ;[rn] = await mutate(token, "assets", [{ create: { name: `${ASSET_PREFIX}${text}`, type: "CALLOUT", calloutAsset: { calloutText: text } } }], `callout ${text}`)
      if (rn) byName.set(key, rn)
    }
    if (rn) calloutRns.push(rn)
  }
  for (const campaign of campaignRn.keys()) for (const rn of calloutRns) queueLink(campaign, "CALLOUT", rn)
  console.log(`Callout'id: ${calloutRns.length} × ${campaignRn.size} kampaaniat`)

  /* 2b. Structured snippet (jagatud) */
  const snKey = `STRUCTURED_SNIPPET::${ASSET_PREFIX}Teenuste kataloog`
  let snRn = byName.get(snKey)
  if (!snRn) {
    ;[snRn] = await mutate(token, "assets", [
      { create: { name: `${ASSET_PREFIX}Teenuste kataloog`, type: "STRUCTURED_SNIPPET", structuredSnippetAsset: { header: "Service catalog", values: SNIPPET_VALUES } } },
    ], "structured snippet")
  }
  if (snRn) for (const campaign of campaignRn.keys()) queueLink(campaign, "STRUCTURED_SNIPPET", snRn)
  console.log(`Structured snippet: ${snRn ? "OK" : "VIGA"}`)

  /* 2c. Kõne-asset (jagatud) */
  const callKey = `CALL::${ASSET_PREFIX}662 3328`
  let callRn = byName.get(callKey)
  if (!callRn) {
    ;[callRn] = await mutate(token, "assets", [
      {
        create: {
          name: `${ASSET_PREFIX}662 3328`,
          type: "CALL",
          callAsset: { phoneNumber: "+3726623328", countryCode: "EE", callConversionReportingState: "USE_ACCOUNT_LEVEL_CALL_CONVERSION_ACTION" },
        },
      },
    ], "call asset")
  }
  if (callRn) for (const campaign of campaignRn.keys()) queueLink(campaign, "CALL", callRn)
  console.log(`Kõne-asset: ${callRn ? "OK" : "VIGA"}`)

  /* 2d. Sitelinkid (kampaania-kohtsedsed) */
  for (const [campaign, links] of Object.entries(SITELINKS_BY_CAMPAIGN)) {
    for (const l of links) {
      const key = `SITELINK::${ASSET_PREFIX}${l.text} · ${campaign.slice(PREFIX.length)}`
      let rn = byName.get(key)
      if (!rn) {
        ;[rn] = await mutate(token, "assets", [
          {
            create: {
              name: `${ASSET_PREFIX}${l.text} · ${campaign.slice(PREFIX.length)}`,
              type: "SITELINK",
              /* v25: URL-id on asset'i TIPPTASEMEL (asset.final_urls),
               * mitte sitelink_asset sees (seal neid enam pole). */
              finalUrls: [l.url],
              sitelinkAsset: { linkText: l.text, description1: l.d1, description2: l.d2 },
            },
          },
        ], `sitelink ${l.text}`)
        if (rn) byName.set(key, rn)
      }
      if (rn) queueLink(campaign, "SITELINK", rn)
    }
    console.log(`Sitelinkid „${campaign}": ${links.length}`)
  }

  /* 2e. Pildid (upload + kirjastus) */
  const libByName = new Map<string, string>()
  for (const r of assetRows) {
    const a = r.asset ?? {}
    if (String(a.type) === "IMAGE") libByName.set(String(a.name ?? ""), String(a.resource_name ?? a.resourceName ?? ""))
  }
  for (const [campaign, imgs] of Object.entries(IMAGES_BY_CAMPAIGN)) {
    for (const file of imgs.uploads) {
      const name = `${ASSET_PREFIX}${file.split("/").pop()}`
      const key = `IMAGE::${name}`
      let rn = byName.get(key)
      if (!rn) {
        if (!existsSync(file)) {
          console.warn(`  ⚠ fail puudub: ${file}`)
          continue
        }
        const data = readFileSync(file).toString("base64")
        ;[rn] = await mutate(token, "assets", [{ create: { name, type: "IMAGE", imageAsset: { data } } }], `image upload ${file}`)
        if (rn) byName.set(key, rn)
      }
      if (rn) queueLink(campaign, "AD_IMAGE", rn)
    }
    for (const libName of imgs.library) {
      const rn = libByName.get(libName)
      if (!rn) {
        console.warn(`  ⚠ kirjastuse pilti ei leitud: ${libName}`)
        continue
      }
      queueLink(campaign, "AD_IMAGE", rn)
    }
    console.log(`Pildid „${campaign}": ${imgs.uploads.length} upload + ${imgs.library.length} kirjastus`)
  }

  /* 2f. Kõik lingid */
  if (linkOps.length > 0) {
    await mutate(token, "campaignAssets", linkOps, `campaign_asset lingid (${linkOps.length})`)
    console.log(`Lingid loodud: ${linkOps.length}`)
  } else {
    console.log("Kõik lingid juba olemas.")
  }

  console.log(`\nValmis. Kontrolli Ads UI-s: Extensions/Assets + RSA „Ad strength“ (peaks liikuma → Good/Excellent).`)
}

main().catch((e) => {
  console.error(`VIGA: ${(e as Error).message}`)
  process.exit(1)
})
