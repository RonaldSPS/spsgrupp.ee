/**
 * Adsi korrastus 26.10.2026 (kliendi pärast-auditi punktid). Kõik idempotentsed,
 * --dry-run toetatud. Tegevused:
 *
 *  1. „800 m²" eemaldamine põhikampaania (Otsing - Teenused - 2026) 3 aktiivsest
 *     RSA-st (Bränd USP, Kontori koristus, Koristusteenused - B2B) — RSA on
 *     immutable, seega create+remove. Asendustekst: „Äripinnad igas suuruses" /
 *     hind alates 1,20 €/m² (kliendi direktiiv 23.10: üldist m²-miinimumit pole).
 *  2. P26 sitelink-asset „Kontori koristus" kirjeldus „Büroodele alates 800 m²"
 *     → „Büroodele igas suuruses" (asset on mutable, update+updateMask).
 *     Lisaks 8 legacy TEXT-asset'it sisaldavad 800-teksti — v25 ei luba neid
 *     muuta ega kustutada, kuid need on lingimata (ei kajastu kuskil); skript
 *     verifitseerib lingituse ja hoiatab, kui see muutub.
 *  3. DSA-kaevur (24361988072): PAUSE + lai URL CONTAINS /koristusteenus/ +
 *     /puhastusteenused/ sihtimine (kaasas muruniitmine, vaipapesu jt alamlehed)
 *     asendatakse 4 range tuumiklehe tingimusega — kampaania jääb peatatuks,
 *     range kuju on valmis, kui kunagi taaskäivitada.
 *  4. P26 kampaaniate geo-seade PRESENCE_OR_INTEREST → PRESENCE (nagu põhi-
 *     kampaanial; ka peatatud Ehitusjärgne, et taaskäivitus oleks kohe korrektne).
 *  5. Konversioonide korrastus: sekundaarseks (primary_for_goal=false)
 *     - „Vormipäring (gclid offline import)" (topeltarvestuse risk veebivormiga),
 *     - telefoni/e-posti klikkide toimingud (CONTACT; kliendi 01.10 otsus: neid
 *       ei liideta vormipäringutele),
 *     - uinunud GA4 vormi-duplikaadid „Form submit 2025" ja „form_submit 2026"
 *       (0 konversiooni 30p; kui kunagi elavnevad, ei teki topelt).
 *     Ainus primaarne vormitoiming jääb „form_submit_2026 (uus veeb)".
 *
 * Auth: sama mis scripts/ads-baseline-cleanup.ts.
 * Käivita: npx tsx scripts/ads-fixes-2026-10-26.ts [--dry-run]
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

const MAIN_CAMPAIGN_ID = "22548785025" // Otsing - Teenused - 2026
const DSA_CAMPAIGN_ID = "24361988072" // P26 · Otsing · DSA-kaevur
const DSA_AD_GROUP_ID = "201260374556" // DSA teenuselehed
const P26_CAMPAIGN_IDS = ["24367981618", "24361988072", "24356948292"]

/* ---------- 1. RSA asendused ---------- */

interface RsaFix {
  label: string
  adGroupId: string
  oldAdRn: string
  signature: string // kui seda sisaldav (ja 800-vaba) reklaam on juba olemas, create'i ei korrata
  finalUrls: string[]
  path1?: string
  path2?: string
  headlines: string[]
  descriptions: string[]
}

const RSA_FIXES: RsaFix[] = [
  {
    label: "Bränd USP",
    adGroupId: "185210113654",
    oldAdRn: `customers/${CUSTOMER_ID}/adGroupAds/185210113654~827432649354`,
    signature: "Äripinnad igas suuruses",
    finalUrls: ["https://spsgrupp.ee/"],
    path1: "hoolduskoristus",
    headlines: [
      "SPS Grupp - koristuspartner", "Koristusteenused äripindadele", "Koristusleping SPS Grupiga",
      "Hinnakalkulaator. Mis maksab?", "Kindel meeskond teie objektil", "Objektijuht jälgib kvaliteeti",
      "Koristuskogemus alates 2006", "Üle 1 000 000 m² hoolduses", "300+ töötajaga koristuspartner",
      "Koristus teie graafiku järgi", "Asendus ka puhkuste ajal", "Vastutuskindlustusega teenus",
      "Tasuta objekti ülevaatus", "Küsi koristuse hinnapakkumist", "Äripinnad igas suuruses",
    ],
    descriptions: [
      "SPS Grupp: koristuskogemus alates 2006. ISO 9001 ja ISO 14001 juhtimissüsteemid.",
      "Kindel meeskond, objektijuht ja kvaliteedikontroll. Asendus ka haiguste ja puhkuste ajal.",
      "Üle 1 000 000 m² meie hoolduses. Koristus teie töögraafiku järgi, 1–7 korda nädalas.",
      "Äripinnad igas suuruses. Tasuta objekti ülevaatus ja personaalne hinnapakkumine.",
    ],
  },
  {
    label: "Kontori koristus",
    adGroupId: "191381872449",
    oldAdRn: `customers/${CUSTOMER_ID}/adGroupAds/191381872449~783914988933`,
    signature: "50+ kontorit. Büroodele Tallinnas",
    finalUrls: ["https://spsgrupp.ee/koristusteenus/kontori-koristus/"],
    path1: "kontor-koristus",
    headlines: [
      "Puhastusteenused ärikliendile", "Büroo- ja Kontorihooldus", "Puhastusteenused kontorites",
      "Põhjalik kontori puhastus", "Äripindade puhastusteenused", "Kontori koristus - parim hind!",
      "Igapäevane kontori hooldus", "Puhastusfirmad ärikliendile", "Kontori suurpuhastus",
      "Puhastusteenus ärikliendile", "Puhastusteenused ettevõtetele", "Tasuta koristusteenuse analüüs",
      "{Keyword:SPS Grupp aitab}", "Meid usaldab 50+ kontorit",
    ],
    descriptions: [
      "Professionaalne puhastusteenindus Tallinnas. ISO sertifikaadiga. Kiire ja kvaliteetne!",
      "Pakume kontoritele ja äriklientidele parima kvaliteediga puhastusteenust Tallinnas.",
      "Meid usaldab 50+ kontorit. Büroodele Tallinnas alates 1,20 €/m² kuus. Uuri lisa",
      "Vaatame üle teie kontori- ja büroopinna ning teeme pakkumise teie vajadustest lähtuvalt.",
    ],
  },
  {
    label: "Koristusteenused - B2B",
    adGroupId: "201663175140",
    oldAdRn: `customers/${CUSTOMER_ID}/adGroupAds/201663175140~827548890608`,
    signature: "Äripinnad igas suuruses",
    finalUrls: ["https://spsgrupp.ee/koristusteenus/"],
    path1: "koristusteenus",
    path2: "aripindadele",
    headlines: [
      "Koristusteenused Tallinnas", "Koristusteenus äripindadele", "Regulaarne koristusteenus",
      "Kontorite regulaarne koristus", "Kindel personal ja objektijuht", "Hinnakalkulaator. Mis hind on?",
      "Tallinnas ja Harjumaal", "Kontorid ja tootmispinnad", "Kaubanduspindade koristus",
      "Äripinnad igas suuruses", "Lepinguline koristus", "Koolitatud koristusmeeskond",
      "Regulaarne kvaliteedikontroll", "Küsi tasuta hinnapakkumist", "SPS Grupp koristusteenused",
    ],
    descriptions: [
      "Kontorite, kaubandus- ja tootmispindade regulaarne koristus Tallinnas ja Harjumaal.",
      "Teenindame äripindu alates igast m². Küsi objekti vajadustele vastavat hinnapakkumist.",
      "Paindlik graafik, koolitatud meeskond ja objektijuht. Koristus vastavalt tööplaanile.",
      "Vajad ettevõttele regulaarset koristusteenust? Kirjelda objekti ja küsi tasuta pakkumist.",
    ],
  },
]

/* ---------- 2. Sitelink ---------- */

const SITELINK_RN = `customers/${CUSTOMER_ID}/assets/430472490953`
const SITELINK_NEW_D1 = "Büroodele igas suuruses"

/* ---------- 3. DSA ranged sihtimised ---------- */

const DSA_STRICT_URLS = [
  "/koristusteenus/kontori-koristus",
  "/koristusteenus/hoolduskoristus",
  "/koristusteenus/kaubanduspindade-koristus",
  "/koristusteenus/tootmishoonete-koristus",
]

/* ---------- 5. Konversioonid: sekundaarseks ---------- */

const DEMOTE_CONVERSION_RNS = [
  `customers/${CUSTOMER_ID}/conversionActions/7795078460`, // Vormipäring (gclid offline import)
  `customers/${CUSTOMER_ID}/conversionActions/7315206922`, // Email_phone_klik_copy (CONTACT, ENABLED, 5 konv/30p)
  `customers/${CUSTOMER_ID}/conversionActions/6456075314`, // Email & phone - Click & copy (CONTACT, ENABLED)
  // NB! „Clicks to call" (828891961, GOOGLE_HOSTED) pole API kaudu muudetav
  // (Mutates are not allowed) — kaetud kampaania-taseme CONTACT=false eesmärgiga (5b).
  `customers/${CUSTOMER_ID}/conversionActions/7319823018`, // Form submit 2025 (GA4, uinunud duplikaat)
  `customers/${CUSTOMER_ID}/conversionActions/7478866508`, // form_submit 2026 (GA4, uinunud duplikaat)
]

/* ---------- 6. Otsinguterminite puhastus (26.10 jääkterminid) ----------
 * Põhikampaania 30p jäkk: „sol puhastusteenused/-teenindus/-teenus", „clean planet oü",
 * „iss koristus" (€1,21); testkampaania 24235989746: „vaibapuhastus tartus",
 * „sol kontor", „vaibakuller" (€4,36). Strateegia 11.09: konkurendi-brändid ja
 * B2C-vaiba on välistatud — phrase-negatiivsed mõlemale aktiivsele otsingukampaaniale. */
const NEGATIVE_TARGETS: { campaignId: string; label: string }[] = [
  { campaignId: MAIN_CAMPAIGN_ID, label: "Otsing - Teenused - 2026" },
  { campaignId: "24235989746", label: "Otsing - Teenused - 2026 Maximize conversion value test" },
]
const NEW_JUNK_NEGATIVES = [
  "sol", "clean planet", "iss koristus", "iss puhastus",
  "vaibakuller", "vaibapuhastus", "vaibapesu", "vaipade puhastus", "vaiba puhastamine",
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
    console.log(JSON.stringify(operations, null, 2).slice(0, 2500))
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
  console.log(`${DRY_RUN ? "[DRY-RUN] " : ""}Adsi korrastus 26.10.2026 (customer ${CUSTOMER_ID})`)

  /* 1) RSA 800-tekstide asendus */
  console.log("\n== 1. RSA 800-tekstide asendused ==")
  const adRows = await gaql(
    token,
    `SELECT ad_group.id, ad_group_ad.resource_name, ad_group_ad.status,
            ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.ad.responsive_search_ad.descriptions
     FROM ad_group_ad
     WHERE campaign.id = ${MAIN_CAMPAIGN_ID} AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
       AND ad_group_ad.status != 'REMOVED'`,
  )
  for (const fix of RSA_FIXES) {
    for (const h of fix.headlines) if (h.replace(/\{Keyword:[^}]*\}/, "").length > 30 && !h.startsWith("{Keyword")) throw new Error(`Pealkiri üle 30 märgi: "${h}"`)
    for (const d of fix.descriptions) if (d.length > 90) throw new Error(`Kirjeldus üle 90 märgi (${d.length}): "${d}"`)
    if (fix.descriptions.join(" ").includes("800") || fix.headlines.join(" ").includes("800")) throw new Error(`Asendus sisaldab 800: ${fix.label}`)

    const groupAds = adRows.filter((r) => String(r.adGroup?.id ?? "") === fix.adGroupId)
    const oldAd = groupAds.find((r) => String(r.adGroupAd?.resourceName ?? "") === fix.oldAdRn)
    if (!oldAd) {
      console.log(`- ${fix.label}: vana reklaami pole (juba tehtud) — vaatan, kas asendus eksisteerib`)
      const hasReplacement = groupAds.some((r) => JSON.stringify(r.adGroupAd?.ad ?? {}).includes(fix.signature))
      console.log(`  ${hasReplacement ? "asendus olemas, OK" : "⚠ ASENDUST EI LEITUD — kontrolli käsitsi"}`)
      continue
    }
    const oldBlob = JSON.stringify(oldAd.adGroupAd?.ad ?? {})
    if (!oldBlob.includes("800")) {
      console.log(`- ${fix.label}: vana reklaam ei sisalda enam 800 — jätka käsitsi kontroll`)
      continue
    }
    const already = groupAds.some((r) => {
      const rn = String(r.adGroupAd?.resourceName ?? "")
      return rn !== fix.oldAdRn && JSON.stringify(r.adGroupAd?.ad ?? {}).includes(fix.signature)
    })
    if (!already) {
      const created = await mutate(token, "adGroupAds", [{
        create: {
          adGroup: `customers/${CUSTOMER_ID}/adGroups/${fix.adGroupId}`,
          status: "ENABLED",
          ad: {
            finalUrls: fix.finalUrls,
            responsiveSearchAd: {
              headlines: fix.headlines.map((text) => ({ text })),
              descriptions: fix.descriptions.map((text) => ({ text })),
              ...(fix.path1 ? { path1: fix.path1 } : {}),
              ...(fix.path2 ? { path2: fix.path2 } : {}),
            },
          },
        },
      }], `RSA asendus ${fix.label}`)
      console.log(`- ${fix.label}: uus RSA loodud ${DRY_RUN ? "(dry-run)" : created[0] ?? ""}`)
    } else {
      console.log(`- ${fix.label}: asendus juba olemas — eemaldan ainult vana`)
    }
    await mutate(token, "adGroupAds", [{ remove: fix.oldAdRn }], `vana RSA eemaldus ${fix.label}`)
    console.log(`  vana reklaam eemaldatud (${fix.oldAdRn})`)
  }

  /* 2) Sitelink 800-kirjelduse parandus */
  console.log("\n== 2. Sitelink-asseti 800-parandus ==")
  const assetRows = await gaql(
    token,
    `SELECT asset.resource_name, asset.sitelink_asset.description1 FROM asset
     WHERE asset.resource_name = '${SITELINK_RN}'`,
  )
  const curD1 = String(assetRows[0]?.asset?.sitelinkAsset?.description1 ?? "")
  if (curD1.includes("800")) {
    await mutate(token, "assets", [{
      update: { resourceName: SITELINK_RN, sitelinkAsset: { description1: SITELINK_NEW_D1 } },
      updateMask: "sitelink_asset.description1",
    }], "sitelink 800-parandus")
    console.log(`- sitelink d1: „${curD1}" → „${SITELINK_NEW_D1}"`)
  } else {
    console.log(`- sitelink d1 juba korras („${curD1}")`)
  }

  /* 2b) TEXT-asset'id (legacy/PMax-i vara). v25 piirangud: text_asset.text pole
   * muudetav („cannot be modified by UPDATE") ja assets:mutate ei toeta remove'u.
   * Seega ainus ohutusventiil on lingitus — kontrollitud 26.10: kõik 8 on
   * LINGIMATA (pole campaign/customer/ad_group linke) ega saa kuskil kajastuda.
   * Siin ainult verifitseerime lingituse ja hoiatame, kui keegi on need vahepeal
   * kampaania külge pannud (siis tuleb link eemaldada Ads UI-s). */
  const textAssets = await gaql(
    token,
    `SELECT asset.resource_name, asset.text_asset.text FROM asset WHERE asset.type = 'TEXT'`,
  )
  const bad800 = textAssets.filter((r) => String(r.asset?.textAsset?.text ?? "").includes("800"))
  if (bad800.length === 0) {
    console.log("- 800-TEXT asset'e pole")
  } else {
    const rns = bad800.map((r) => `'${String(r.asset.resourceName)}'`).join(",")
    const links = await gaql(
      token,
      `SELECT campaign.name, campaign.status FROM campaign_asset WHERE campaign_asset.asset IN (${rns})`,
    )
    const active = links.filter((r) => String(r.campaign?.status) === "ENABLED")
    if (active.length > 0) {
      console.log(`- ⚠ ${active.length} 800-TEXT asset'i on lingitud AKTIIVSE kampaania külge — eemalda link Ads UI-s:`)
      for (const r of active) console.log(`    ${r.campaign?.name}`)
    } else {
      console.log(`- ${bad800.length} legacy 800-TEXT asset'i on lingimata (v25 ei luba muuta ega kustutada) — ei kajastu kuskil, OK`)
    }
  }

  /* 3) DSA-kaevur: pause + ranged URL-sihtimised */
  console.log("\n== 3. DSA-kaevur ==")
  const dsaCamp = await gaql(token, `SELECT campaign.status FROM campaign WHERE campaign.id = ${DSA_CAMPAIGN_ID}`)
  const dsaStatus = String(dsaCamp[0]?.campaign?.status ?? "")
  if (dsaStatus !== "PAUSED") {
    await mutate(token, "campaigns", [{
      update: { resourceName: `customers/${CUSTOMER_ID}/campaigns/${DSA_CAMPAIGN_ID}`, status: "PAUSED" },
      updateMask: "status",
    }], "DSA-kaevur PAUSE")
    console.log(`- DSA-kaevur PEATATUD (oli ${dsaStatus})`)
  } else {
    console.log("- DSA-kaevur juba PEATATUD")
  }
  const wpRows = await gaql(
    token,
    `SELECT ad_group_criterion.resource_name, ad_group_criterion.negative, ad_group_criterion.status
     FROM ad_group_criterion
     WHERE campaign.id = ${DSA_CAMPAIGN_ID} AND ad_group_criterion.type = 'WEBPAGE'
       AND ad_group_criterion.status != 'REMOVED'`,
  )
  /* v25 GAQL ei luba webpage-tingimuste sisu lugeda — idempotentsus on arvupõhine
   * (sama muster kui ads-p26-hooldus.ts): algne lai seadistus oli TÄPSELT 2
   * positiivset (CONTAINS /koristusteenus/ ja /puhastusteenused/); pärast vahetust
   * on 4 range positiivset. 2 → vaheta; 4 → valmis; muu → käsitsi kontroll. */
  const positiveRows = wpRows.filter((r) => r.adGroupCriterion?.negative === false)
  const positiveCount = positiveRows.length
  if (positiveCount === DSA_STRICT_URLS.length) {
    console.log(`- ranged URL-tingimused juba olemas (${positiveCount})`)
  } else if (positiveCount !== 2) {
    console.log(`  ⚠ positiivseid URL-tingimusi ${positiveCount} (oodatud 2 laia või ${DSA_STRICT_URLS.length} ranget) — kontrolli käsitsi, ei muuda`)
  } else {
    await mutate(token, "adGroupCriteria", positiveRows.map((r: Row) => ({ remove: String(r.adGroupCriterion.resourceName) })), "DSA laiade URL-tingimuste eemaldus")
    console.log(`- eemaldatud laiad positiivsed URL-tingimused: ${positiveCount}`)
    await mutate(token, "adGroupCriteria", DSA_STRICT_URLS.map((u) => ({
      create: {
        adGroup: `customers/${CUSTOMER_ID}/adGroups/${DSA_AD_GROUP_ID}`,
        status: "ENABLED",
        webpage: {
          criterionName: `Teenuseleht: ${u.split("/").pop()}`,
          conditions: [{ operand: "URL", operator: "CONTAINS", argument: u }],
        },
      },
    })), "DSA ranged URL-tingimused")
    console.log(`- lisatud ranged URL-tingimused: ${DSA_STRICT_URLS.join(", ")}`)
  }

  /* 4) P26 geo → PRESENCE */
  console.log("\n== 4. P26 geo-seade ==")
  const campRows = await gaql(
    token,
    `SELECT campaign.id, campaign.name, campaign.geo_target_type_setting.positive_geo_target_type
     FROM campaign WHERE campaign.id IN (${P26_CAMPAIGN_IDS.join(",")})`,
  )
  for (const r of campRows) {
    const c = r.campaign ?? {}
    const cur = String(c.geoTargetTypeSetting?.positiveGeoTargetType ?? "")
    if (cur === "PRESENCE") {
      console.log(`- ${c.name}: juba PRESENCE`)
      continue
    }
    await mutate(token, "campaigns", [{
      update: {
        resourceName: `customers/${CUSTOMER_ID}/campaigns/${c.id}`,
        geoTargetTypeSetting: { positiveGeoTargetType: "PRESENCE", negativeGeoTargetType: "PRESENCE" },
      },
      updateMask: "geo_target_type_setting.positive_geo_target_type,geo_target_type_setting.negative_geo_target_type",
    }], `geo-seade ${c.name}`)
    console.log(`- ${c.name}: ${cur} → PRESENCE (ka negative=PRESENCE)`)
  }

  /* 5) Konversioonide korrastus */
  console.log("\n== 5. Konversioonitoimingud sekundaarseks ==")
  const caRows = await gaql(
    token,
    `SELECT conversion_action.resource_name, conversion_action.name, conversion_action.primary_for_goal, conversion_action.status
     FROM conversion_action`,
  )
  const byRn = new Map(caRows.map((r) => [String(r.conversionAction?.resourceName ?? ""), r.conversionAction]))
  const demoteOps: unknown[] = []
  for (const rn of DEMOTE_CONVERSION_RNS) {
    const a = byRn.get(rn)
    if (!a) { console.log(`- ⚠ ${rn} ei leitud`); continue }
    if (a.primaryForGoal === false) { console.log(`- ${a.name}: juba sekundaarne`); continue }
    demoteOps.push({ update: { resourceName: rn, primaryForGoal: false }, updateMask: "primary_for_goal" })
    console.log(`- ${a.name} [${a.status}]: primary → secondary`)
  }
  await mutate(token, "conversionActions", demoteOps, "konversioonide korrastus")

  /* 5b) „Clicks to call" on Google-hostitud toiming, mida API ei luba muuta
   * (Mutates are not allowed). Sama tulemuse saab kampaania-taseme CONTACT
   * eesmärgiga biddable=false (muster scripts/ads-p26-setup.ts järgi) — siis
   * tel/e-post/eelkõneklikid ei lähe nende kampaaniate „Konversioonid" arvu.
   * Kehtib ka tulevastele CONTACT-toimingutele nendes kampaaniates. */
  console.log("\n== 5b. CONTACT kampaania-tasemel mitte-biddable'ks ==")
  for (const campId of [MAIN_CAMPAIGN_ID, "24235989746"]) {
    const goalRn = `customers/${CUSTOMER_ID}/campaignConversionGoals/${campId}~CONTACT~WEBSITE`
    if (DRY_RUN) {
      console.log(`--- [dry-run] campaignConversionGoals update ${goalRn} biddable=false`)
      continue
    }
    try {
      const res = await fetch(
        `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/campaignConversionGoals:mutate`,
        { method: "POST", headers: headers(token), body: JSON.stringify({ operations: [{ update: { resourceName: goalRn, biddable: false }, updateMask: "biddable" }] }) },
      )
      const text = await res.text()
      if (!res.ok) throw new Error(text.slice(0, 300))
      console.log(`- kampaania ${campId}: CONTACT biddable=false`)
    } catch (e) {
      console.warn(`  ⚠ CONTACT-eesmärk kampaaniale ${campId} ebaõnnestus: ${(e as Error).message.slice(0, 200)}`)
      console.warn('    Varuvariant: Ads UI → Eesmärgid → kampaania seadetes „Clicks to call" maha primaarsetest.')
    }
  }

  console.log("\nValmis. Primaarseks vormitoiminguks jääb „form_submit_2026 (uus veeb)\".")
  console.log("Kontrolli: npm run report:ads; Ads UI → Eesmärgid → Konversioonid.")

  /* 6) Otsinguterminite jäkk-negatiivsed (põhi + test kampaania) */
  console.log("\n== 6. Jäkk-negatiivsed (põhi + test) ==")
  for (const target of NEGATIVE_TARGETS) {
    const negRows = await gaql(
      token,
      `SELECT campaign_criterion.keyword.text, campaign_criterion.keyword.match_type FROM campaign_criterion
       WHERE campaign.id = ${target.campaignId} AND campaign_criterion.negative = TRUE`,
    )
    const have = new Set(
      negRows.map((r) => {
        const kw = (r.campaignCriterion ?? {}) as Record<string, any>
        return `${String(kw.keyword?.text ?? "").toLowerCase().trim()}|${String(kw.keyword?.matchType ?? "").toUpperCase()}`
      }),
    )
    const ops = NEW_JUNK_NEGATIVES.filter((n) => !have.has(`${n}|PHRASE`)).map((text) => ({
      create: { campaign: `customers/${CUSTOMER_ID}/campaigns/${target.campaignId}`, negative: true, keyword: { text, matchType: "PHRASE" } },
    }))
    console.log(`- ${target.label}: lisatakse ${ops.length}/${NEW_JUNK_NEGATIVES.length}`)
    await mutate(token, "campaignCriteria", ops, `jäkk-negatiivsed ${target.label}`)
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
