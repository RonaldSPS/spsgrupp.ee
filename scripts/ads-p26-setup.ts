/**
 * P26 paralleeltest — AI-juhitud Google Ads'i kampaaniate loomine PEATATUNA.
 * Plaan: raportid/google-ads-analuus-ja-paralleelne-test-2026-10-14.md
 *
 * Garantiid (plaani §3.1 ja §3.9):
 *   - praegust seadistust EI muudeta: eraldi eelarved, eraldi märksõnad,
 *     eraldi kampaaniad (prefiks „P26 ·"), uusi konversioonitoiminguid EI looda
 *   - kõik luuakse olekus PAUSED — käivitamine alles pärast kliendi ülevaatust
 *     ja kinnitust (Ads UI-s või eraldi skriptiga)
 *   - eelarvelagi €17/päev kokku (€8 + €6 + €3)
 *   - geo/keel/ajakava ja negatiivsed kopeeritakse praeguselt põhikampaanialt
 *   - GTM-i, veebilehe ja mõõtmise koodi ei puudutata
 *
 * Idempotentne: sama nimega kampaania olemasolul selle alampuu vahele.
 *
 * Kasutus:
 *   npx tsx scripts/ads-p26-setup.ts --dry-run   # trükib kõik operatsioonid, EI saada
 *   npx tsx scripts/ads-p26-setup.ts             # loob kõik PEATATUNA
 *
 * Auth: sama mis scripts/ads-report.ts (teenuskonto .secrets/gcp-analytics.json
 * eelistatult; teenuskontol peab Ads kontol olema „Standard" õigus — read-only
 * kontol mutatsioonid ebaõnnestuvad selge veaga).
 */

import { readFileSync, existsSync } from "node:fs"
import { GoogleAuth } from "google-auth-library"

/* ---------- env (sama muster mis ads-report.ts) ---------- */

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}
loadEnvLocal()

const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET
const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN
const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"
const HAS_OAUTH = Boolean(REFRESH_TOKEN && CLIENT_ID && CLIENT_SECRET)
const ADS_API_VERSION = "v25"

const DRY_RUN = process.argv.includes("--dry-run")

if (!DEVELOPER_TOKEN || !CUSTOMER_ID) {
  console.error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID puuduvad (.env.local).")
  process.exit(1)
}

/* ---------- P26 seadistuse definitsioon (plaani §3.2–3.5) ---------- */

const PREFIX = "P26 · "
const LABEL_NAME = "paralleel_2026"
const MAIN_CAMPAIGN_NAME = "Otsing - Teenused - 2026" // konteksti allikas: geo, keel, ajakava, negatiivsed

interface KeywordDef { text: string; matchType: "EXACT" | "PHRASE" }
interface AdGroupDef {
  name: string
  cpcBidEur: number
  type?: "SEARCH_STANDARD" | "SEARCH_DYNAMIC_ADS"
  keywords?: KeywordDef[]
  /** RSA; DSA grupil kasutatakse description-only dünaamilist reklaami. */
  finalUrls?: string[]
  path1?: string
  path2?: string
  headlines?: string[]
  descriptions?: string[]
  /** DSA: veebilehe sihtimistingimused (igaühest eraldi criterion = OR). */
  urlContains?: string[]
}
interface CampaignDef {
  name: string
  budgetEurPerDay: number
  dsa?: boolean
  adGroups: AdGroupDef[]
  /** Eraldus-negatiivsed (plaani §3.3): DSA-l PHRASE (pole märksõnu, mida kaitsta),
   *  märksõna-kampaaniatel EXACT (et meie oma phrase-märksõnad endid ei blokeeriks). */
  separationNegatives: { text: string; matchType: "EXACT" | "PHRASE" }[]
}

const SEPARATION_TERMS = ["koristusteenus", "koristusteenused", "puhastusteenused", "puhastusteenus", "koristusfirma", "puhastusfirma"]

/** Intenti-negatiivsed (plaani §3.3) — proaktiivselt, PHRASE. */
const INTENT_NEGATIVES: string[] = [
  // B2C kodu/korter (eraisik)
  "kodu koristus", "kodu puhastus", "korteri koristus", "korteri puhastus", "eramaja koristus", "eramu koristus",
  "kolimisjärgne koristus", "kolimisjärgne puhastus", "suvila koristus", "kodukoristus", "kodupuhastus",
  // välistatud teenused
  "vihmaveerenn", "vihmaveerennide puhastus", "rennide puhastus", "renni puhastus",
  "ventilatsiooni puhastus", "ventilatsiooni hooldus",
  "surmajärgne koristus", "surmajärgne puhastus", "lahkunu järel koristus",
  // tööotsijad
  "koristaja töö", "töö koristajana", "tööd otsin", "tööpakkumine", "tööpakkumised", "vakants", "cv", "praktika", "koristaja palk", "tööotsing",
  // piirkonnavälised (sihtpiirkond AINULT Tallinn+Harjumaa)
  "tartu", "tartus", "pärnu", "pärnus", "narva", "valga", "viljandi", "rakvere", "võru", "kuressaare", "haapsalu", "paide", "jõhvi", "kohtla-järve",
  // muu soovimatu (plaani §3.3)
  "tasuta", "kuidas ise", "koolitus", "rent",
]

const kw = (text: string, matchType: "EXACT" | "PHRASE"): KeywordDef => ({ text, matchType })
const both = (text: string): KeywordDef[] => [kw(text, "EXACT"), kw(text, "PHRASE")]

const CAMPAIGNS: CampaignDef[] = [
  {
    name: `${PREFIX}Otsing · Hoolduskoristus B2B`,
    budgetEurPerDay: 8,
    separationNegatives: SEPARATION_TERMS.map((t) => ({ text: t, matchType: "EXACT" as const })),
    adGroups: [
      {
        name: "Hoolduskoristus (tuum)",
        cpcBidEur: 3.5,
        keywords: [
          ...both("hoolduskoristus"),
          kw("regulaarne koristus", "PHRASE"),
          kw("lepinguline koristus", "PHRASE"),
          kw("äripindade koristus", "PHRASE"),
          kw("trepikoja koristus", "PHRASE"),
          kw("trepikodade koristus", "PHRASE"),
          kw("korteriühistu koristus", "PHRASE"),
          ...both("koristusteenus ettevõttele"),
        ],
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
        name: "Kontorikoristus",
        cpcBidEur: 3.0,
        keywords: [
          ...both("kontori koristus"),
          ...both("kontorikoristus"),
          kw("kontori koristusteenus", "PHRASE"),
          kw("büroo koristus", "PHRASE"),
          kw("tootmispindade koristus", "PHRASE"),
        ],
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
    ],
  },
  {
    name: `${PREFIX}Otsing · Ehitusjärgne + Suurpuhastus B2B`,
    budgetEurPerDay: 6,
    separationNegatives: SEPARATION_TERMS.map((t) => ({ text: t, matchType: "EXACT" as const })),
    adGroups: [
      {
        name: "Ehitusjärgne koristus",
        cpcBidEur: 2.5,
        keywords: [
          ...both("ehitusjärgne koristus"),
          ...both("remondijärgne koristus"),
          kw("ehitusjärgne puhastus", "PHRASE"),
        ],
        finalUrls: ["https://spsgrupp.ee/puhastusteenused/ehitusjargne-koristus/"],
        path1: "ehitusjargne",
        /* „vastutuskindlustus"- ja „ISO sertifitseeritud firma" sõnumeid EI kasutata —
         * Google'i poliitika-hinnang lükkas need korduvalt tagasi (16.10.2026 bisektsioon).
         * Märkus: loomise-hetke poliitikaskan ärritub ka suure operatsioonide hulga
         * peale — sama tekstikomplekt võib vahel läbi minna, vahel mitte; seetõttu
         * on --repair idempotentne ja turvaline kordusks. */
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
        name: "Suurpuhastus B2B",
        cpcBidEur: 2.5,
        keywords: [
          ...both("suurpuhastus"),
          kw("kontori suurpuhastus", "PHRASE"),
          kw("äripinna suurpuhastus", "PHRASE"),
        ],
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
    ],
  },
  {
    name: `${PREFIX}Otsing · DSA-kaevur`,
    budgetEurPerDay: 3,
    dsa: true,
    separationNegatives: SEPARATION_TERMS.map((t) => ({ text: t, matchType: "PHRASE" as const })),
    adGroups: [
      {
        name: "DSA teenuselehed",
        cpcBidEur: 1.5,
        type: "SEARCH_DYNAMIC_ADS",
        urlContains: ["/koristusteenus/", "/puhastusteenused/"],
        descriptions: [
          "Koristus- ja puhastusteenused äriklientidele Tallinnas ja Harjumaal. ISO 9001.",
        ],
      },
    ],
  },
]

/* ---------- Google Ads REST abifunktsioonid ---------- */

async function getAccessToken(): Promise<string> {
  if (!HAS_OAUTH) {
    if (!existsSync(KEY_FILE)) {
      throw new Error(`Autentimine puudub: pole OAuth kolmikut ega teenuskonto võtit (${KEY_FILE}). Vt ANALYTICS.md.`)
    }
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
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      refresh_token: REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  })
  const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string }
  if (!data.access_token) throw new Error(`OAuth refresh ebaõnnestus: ${data.error_description ?? data.error}`)
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
  const res = await fetch(
    `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/googleAds:search`,
    { method: "POST", headers: headers(token), body: JSON.stringify({ query }) },
  )
  if (!res.ok) throw new Error(`GAQL ebaõnnestus (${res.status}): ${(await res.text()).slice(0, 500)}`)
  const data = (await res.json()) as { results?: Row[] }
  return data.results ?? []
}

interface MutateResult { resourceName?: string }
let sentOperations = 0

async function mutate(token: string, service: string, operations: unknown[], label: string, opts: { noPartialFailure?: boolean } = {}): Promise<string[]> {
  if (operations.length === 0) return []
  if (DRY_RUN) {
    console.log(`\n--- [dry-run] ${service}:mutate (${operations.length} op) — ${label}`)
    console.log(JSON.stringify(operations, null, 2).slice(0, 4000))
    return operations.map((_, i) => `customers/${CUSTOMER_ID}/dryRun/${service}/${i}`)
  }
  /* Mõned teenused (nt conversionGoalCampaignConfigs) ei aktsepteeri
   * partialFailure välja üldse — saadame ilma selleta. */
  const body = opts.noPartialFailure ? { operations } : { operations, partialFailure: true }
  const res = await fetch(
    `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/${service}:mutate`,
    { method: "POST", headers: headers(token), body: JSON.stringify(body) },
  )
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`${service}:mutate ebaõnnestus (${res.status}) — ${label}: ${text.slice(0, 800)}`)
  }
  const data = JSON.parse(text) as {
    results?: MutateResult[]
    partialFailureError?: { code?: number; message?: string; details?: { errors?: { message?: string }[] }[] }
  }
  if (data.partialFailureError) {
    const details = (data.partialFailureError.details ?? [])
      .flatMap((d) => d.errors ?? [])
      .map((e) => e.message)
      .filter(Boolean)
      .slice(0, 5)
    console.warn(`  ⚠ osaline viga (${label}): ${data.partialFailureError.message} ${details.join(" | ")}`)
  }
  sentOperations += operations.length
  return (data.results ?? []).map((r) => r.resourceName ?? "")
}

/* ---------- põhiloogika ---------- */

/** Kampaania-taseme konversioonieesmärgid (plaani §3.5): optimeeri ainult vormi
 * kategooriat; tel/e-post klikid sekundaarseks. Kampaania-sisene seade —
 * konto vaikimisi eesmärke EI muuda. Need ressursid on singleton'id:
 * seadistatakse UPDATE-operatsiooniga (mitte create). */
async function setupConversionGoals(token: string, campaignRn: string, name: string): Promise<void> {
  const campaignId = campaignRn.split("/").pop()
  try {
    await mutate(token, "conversionGoalCampaignConfigs", [
      {
        update: { resourceName: `customers/${CUSTOMER_ID}/conversionGoalCampaignConfigs/${campaignId}`, goalConfigLevel: "CAMPAIGN" },
        updateMask: "goalConfigLevel",
      },
    ], `conversion-goal config ${name}`, { noPartialFailure: true })
    /* Iga kategooria eraldi päringuna — pole-masinavara kategooriaid (nt
     * PHONE_CALL_LEAD~WEBSITE pole veebipäritoluna olemas, kontol on CALL_FROM_ADS)
     * ei tohi ülejäänuid kaasa võtta. */
    const goal = (category: string, biddable: boolean) => ({
      update: { resourceName: `customers/${CUSTOMER_ID}/campaignConversionGoals/${campaignId}~${category}~WEBSITE`, biddable },
      updateMask: "biddable",
    })
    let ok = 0
    for (const [cat, biddable] of [["SUBMIT_LEAD_FORM", true], ["CONTACT", false]] as [string, boolean][]) {
      try {
        await mutate(token, "campaignConversionGoals", [goal(cat, biddable)], `goal ${cat} ${name}`, { noPartialFailure: true })
        ok++
      } catch (e) {
        console.warn(`  ⚠ goal ${cat} (${name}): ${(e as Error).message.slice(0, 160)}`)
      }
    }
    if (ok > 0) console.log(`  konversioonieesmärgid: vorm primaarne (SUBMIT_LEAD_FORM), tel/e-post sekundaarne (CONTACT=false)`)
  } catch (e) {
    console.warn(`  ⚠ konversioonieesmärkide seadistus ebaõnnestus — sea Ads UI-s käsitsi (kampaania → eesmärgid): ${(e as Error).message.slice(0, 300)}`)
  }
}

/** Loob reklaamgrupi sisu: märksõnad, DSA sihtimistingimused, reklaam(id). Jagatud põhivoo ja --repair vahel. */
async function populateAdGroup(token: string, c: CampaignDef, g: AdGroupDef, agRn: string, opts: { keywords: boolean; ads: boolean }): Promise<void> {
  if (opts.keywords && g.keywords && g.keywords.length > 0) {
    await mutate(
      token,
      "adGroupCriteria",
      g.keywords.map((k) => ({
        create: { adGroup: agRn, status: "ENABLED", keyword: { text: k.text, matchType: k.matchType } },
      })),
      `märksõnad ${g.name} (${g.keywords.length})`,
    )
    console.log(`    märksõnad: ${g.keywords.length}`)
  }
  if (opts.keywords && g.urlContains && g.urlContains.length > 0) {
    await mutate(
      token,
      "adGroupCriteria",
      g.urlContains.map((arg) => ({
        create: {
          adGroup: agRn,
          status: "ENABLED",
          webpage: {
            criterionName: `Teenuselehed: ${arg}`,
            conditions: [{ operand: "URL", operator: "CONTAINS", argument: arg }],
          },
        },
      })),
      `DSA sihtimine ${g.name}`,
    )
    console.log(`    DSA url-tingimused: ${g.urlContains.join(" OR ")}`)
  }
  if (!opts.ads) return
  for (const h of g.headlines ?? []) {
    if (h.length > 30) throw new Error(`Pealkiri üle 30 märgi (${h.length}): „${h}"`)
  }
  for (const d of g.descriptions ?? []) {
    if (d.length > 90) throw new Error(`Kirjeldus üle 90 märgi (${d.length}): „${d}"`)
  }
  if (c.dsa) {
    await mutate(token, "adGroupAds", [
      {
        create: {
          adGroup: agRn,
          status: "ENABLED",
          ad: { expandedDynamicSearchAd: { description: g.descriptions?.[0] ?? "" } },
        },
      },
    ], `DSA reklaam ${g.name}`)
    console.log(`    DSA reklaam (kirjeldus)`)
  } else {
    await mutate(token, "adGroupAds", [
      {
        create: {
          adGroup: agRn,
          status: "ENABLED",
          ad: {
            finalUrls: g.finalUrls,
            responsiveSearchAd: {
              headlines: (g.headlines ?? []).map((text) => ({ text })),
              descriptions: (g.descriptions ?? []).map((text) => ({ text })),
              path1: g.path1 ?? "",
              path2: g.path2 ?? "",
            },
          },
        },
      },
    ], `RSA ${g.name}`)
    console.log(`    RSA: ${g.headlines?.length} pealkirja, ${g.descriptions?.length} kirjeldust → ${g.finalUrls?.[0]}`)
  }
}

/** --repair: täiendab olemasolevaid P26 kampaaniaid puuduvate osadega
 * (nt ebaõnnestunud reklaam/DSA-kriteerium/konversioonieesmärgid) ilma
 * midagi dubleerimata. Kontrollib olemasolu taseme kaupa. */
async function repair(token: string): Promise<void> {
  console.log("== P26 --repair: täiendan puuduvad osad olemasolevatele kampaaniatele ==")
  for (const c of CAMPAIGNS) {
    const campRows = await gaql(
      token,
      `SELECT campaign.resource_name, campaign.name FROM campaign WHERE campaign.name = '${c.name.replace(/'/g, "\\'")}'`,
    )
    const campaignRn = String(campRows[0]?.campaign?.resource_name ?? campRows[0]?.campaign?.resourceName ?? "")
    if (!campaignRn) {
      console.log(`„${c.name}" — puudub, käivita põhivoog (ilma --repair) loomiseks.`)
      continue
    }
    console.log(`\n=== „${c.name}" — kontrollin gruppe ===`)
    const agRows = await gaql(
      token,
      `SELECT ad_group.resource_name, ad_group.name FROM ad_group WHERE campaign.resource_name = '${campaignRn}'`,
    )
    for (const g of c.adGroups) {
      const agRow = agRows.find((r) => String(r.ad_group?.name ?? r.adGroup?.name ?? "") === g.name)
      const agRn = String(agRow?.ad_group?.resource_name ?? agRow?.ad_group?.resourceName ?? agRow?.adGroup?.resource_name ?? agRow?.adGroup?.resourceName ?? "")
      if (!agRn) {
        console.log(`  grupp „${g.name}" puudub — loon...`)
        const [newAgRn] = await mutate(token, "adGroups", [
          {
            create: {
              name: g.name,
              campaign: campaignRn,
              status: "ENABLED",
              type: g.type ?? "SEARCH_STANDARD",
              cpcBidMicros: String(Math.round(g.cpcBidEur * 1_000_000)),
            },
          },
        ], `grupp ${g.name}`)
        await populateAdGroup(token, c, g, newAgRn, { keywords: true, ads: true })
        continue
      }
      const critRows = await gaql(
        token,
        `SELECT ad_group_criterion.criterion_id FROM ad_group_criterion WHERE ad_group.resource_name = '${agRn}' AND ad_group_criterion.status != 'REMOVED'`,
      )
      const adRows = await gaql(token, `SELECT ad_group_ad.ad.id FROM ad_group_ad WHERE ad_group.resource_name = '${agRn}' AND ad_group_ad.status != 'REMOVED'`)
      const needKeywords = critRows.length === 0
      const needAds = adRows.length === 0
      console.log(`  grupp „${g.name}": kriteeriume ${critRows.length}, reklaame ${adRows.length}${needKeywords || needAds ? " — täiendan" : " — korras"}`)
      if (needKeywords || needAds) await populateAdGroup(token, c, g, agRn, { keywords: needKeywords, ads: needAds })
    }
    await setupConversionGoals(token, campaignRn, c.name)
  }
}

async function main() {
  if (process.argv.includes("--repair")) {
    const token = await getAccessToken()
    await repair(token)
    console.log(`\nRepair valmis. Saadetud operatsioone: ${sentOperations}.`)
    return
  }
  console.log(DRY_RUN ? "== P26 seadistus — DRY RUN (midagi ei saadeta) ==" : "== P26 seadistus — LOON kampaaniad PEATATUNA ==")
  const token = await getAccessToken()

  /* 0. Olemasolev seis (idempotentsus) */
  const existingRows = await gaql(
    token,
    `SELECT campaign.name, campaign.status FROM campaign WHERE campaign.name LIKE '${PREFIX}%'`,
  )
  const existing = new Set(existingRows.map((r) => String(r.campaign?.name ?? "")))
  if (existing.size > 0) console.log(`Olemasolevad P26 kampaaniad: ${[...existing].join(" | ")}`)

  /* 1. Kontekst põhikampaanialt: geo, keel, ajakava, negatiivsed */
  console.log(`\nLoon konteksti põhikampaaniast „${MAIN_CAMPAIGN_NAME}"…`)
  const critRows = await gaql(
    token,
    `SELECT campaign_criterion.type, campaign_criterion.negative,
            campaign_criterion.location.geo_target_constant,
            campaign_criterion.language.language_constant,
            campaign_criterion.keyword.text, campaign_criterion.keyword.match_type,
            campaign_criterion.ad_schedule.day_of_week, campaign_criterion.ad_schedule.start_hour,
            campaign_criterion.ad_schedule.start_minute, campaign_criterion.ad_schedule.end_hour,
            campaign_criterion.ad_schedule.end_minute
     FROM campaign_criterion
     WHERE campaign.name = '${MAIN_CAMPAIGN_NAME}' AND campaign.status != 'REMOVED'`,
  )
  const geoTargets: string[] = []
  const languages: string[] = []
  const negatives: { text: string; matchType: string }[] = []
  const schedules: Record<string, unknown>[] = []
  for (const r of critRows) {
    const c = r.campaign_criterion ?? r.campaignCriterion ?? {}
    /* REST tagastab enum-väärtused UPPER_SNAKE kujul ("LOCATION") — teisendust pole vaja. */
    const type = String(c.type ?? "")
    if (type === "LOCATION" && c.location) geoTargets.push(String((c.location as Record<string, unknown>).geo_target_constant ?? (c.location as Record<string, unknown>).geoTargetConstant))
    if (type === "LANGUAGE" && c.language) languages.push(String((c.language as Record<string, unknown>).language_constant ?? (c.language as Record<string, unknown>).languageConstant))
    if (type === "KEYWORD" && (c.negative === true || String(c.negative) === "true")) {
      const k = (c.keyword ?? {}) as Record<string, unknown>
      negatives.push({ text: String(k.text ?? ""), matchType: String(k.match_type ?? k.matchType ?? "PHRASE").toUpperCase() })
    }
    if (type === "AD_SCHEDULE" && c.ad_schedule) schedules.push(c.ad_schedule as Record<string, unknown>)
    if (type === "AD_SCHEDULE" && c.adSchedule) schedules.push(c.adSchedule as Record<string, unknown>)
  }
  console.log(`  geo: ${geoTargets.length} · keel: ${languages.length} · negatiivsed: ${negatives.length} · ajakava: ${schedules.length}`)
  if (geoTargets.length === 0) console.warn("  ⚠ geo-sihtimist ei leitud — kontrolli käsitsi Ads UI-st!")
  if (languages.length === 0) console.warn("  ⚠ keelesihtimist ei leitud — kontrolli käsitsi Ads UI-st!")

  /* 2. Silt */
  const labelRows = await gaql(token, `SELECT label.resource_name, label.name FROM label WHERE label.name = '${LABEL_NAME}'`)
  let labelRn = String(labelRows[0]?.label?.resource_name ?? labelRows[0]?.label?.resourceName ?? "")
  if (!labelRn) {
    ;[labelRn] = await mutate(token, "labels", [{ create: { name: LABEL_NAME } }], "silt")
    console.log(`Silt loodud: ${labelRn}`)
  } else {
    console.log(`Silt olemas: ${labelRn}`)
  }

  /* 3. Kampaaniad */
  for (const c of CAMPAIGNS) {
    if (existing.has(c.name)) {
      console.log(`\n=== „${c.name}" — juba olemas, JÄTAN VAHELE ===`)
      continue
    }
    console.log(`\n=== „${c.name}" (eelarve €${c.budgetEurPerDay}/päev, PAUSED) ===`)

    const [budgetRn] = await mutate(token, "campaignBudgets", [
      {
        create: {
          name: `${c.name} · eelarve`,
          amountMicros: String(Math.round(c.budgetEurPerDay * 1_000_000)),
          deliveryMethod: "STANDARD",
          explicitlyShared: false,
        },
      },
    ], `eelarve ${c.name}`)

    const campaignOp: Record<string, unknown> = {
      name: c.name,
      status: "PAUSED",
      advertisingChannelType: "SEARCH",
      campaignBudget: budgetRn,
      manualCpc: { enhancedCpcEnabled: false },
      networkSettings: {
        targetGoogleSearch: true,
        targetSearchNetwork: false,
        targetContentNetwork: false,
        targetPartnerSearchNetwork: false,
      },
      containsEuPoliticalAdvertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
    }
    if (c.dsa) campaignOp.dynamicSearchAdsSetting = { domainName: "spsgrupp.ee", languageCode: "et" }
    const [campaignRn] = await mutate(token, "campaigns", [{ create: campaignOp }], `kampaania ${c.name}`)
    console.log(`  kampaania: ${campaignRn}`)

    /* sihtimine: geo + keel + ajakava + silt */
    const critOps: Record<string, unknown>[] = []
    for (const gtc of geoTargets) critOps.push({ create: { campaign: campaignRn, location: { geoTargetConstant: gtc } } })
    for (const lc of languages) critOps.push({ create: { campaign: campaignRn, language: { languageConstant: lc } } })
    for (const s of schedules) critOps.push({ create: { campaign: campaignRn, adSchedule: s } })
    await mutate(token, "campaignCriteria", critOps, `sihtimine ${c.name}`)

    if (!DRY_RUN && labelRn) {
      await mutate(token, "campaignLabels", [{ create: { campaign: campaignRn, label: labelRn } }], `silt ${c.name}`)
    }

    /* negatiivsed: põhikampaania omad + intenti + eraldus */
    const negOps: Record<string, unknown>[] = []
    for (const n of negatives) {
      if (!n.text) continue
      negOps.push({ create: { campaign: campaignRn, negative: true, keyword: { text: n.text, matchType: n.matchType || "PHRASE" } } })
    }
    for (const t of INTENT_NEGATIVES) {
      negOps.push({ create: { campaign: campaignRn, negative: true, keyword: { text: t, matchType: "PHRASE" } } })
    }
    for (const n of c.separationNegatives) {
      negOps.push({ create: { campaign: campaignRn, negative: true, keyword: { text: n.text, matchType: n.matchType } } })
    }
    await mutate(token, "campaignCriteria", negOps, `negatiivsed ${c.name} (${negOps.length})`)
    console.log(`  negatiivsed: ${negOps.length} (põhikampaania ${negatives.length} + intenti ${INTENT_NEGATIVES.length} + eraldus ${c.separationNegatives.length})`)

    /* reklaamgrupid + märksõnad + reklaamid */
    for (const g of c.adGroups) {
      const [agRn] = await mutate(token, "adGroups", [
        {
          create: {
            name: g.name,
            campaign: campaignRn,
            status: "ENABLED",
            type: g.type ?? "SEARCH_STANDARD",
            cpcBidMicros: String(Math.round(g.cpcBidEur * 1_000_000)),
          },
        },
      ], `grupp ${g.name}`)
      console.log(`  grupp „${g.name}" (CPC €${g.cpcBidEur}): ${agRn}`)
      await populateAdGroup(token, c, g, agRn, { keywords: true, ads: true })
    }

    await setupConversionGoals(token, campaignRn, c.name)
  }

  /* 4. Kokkuvõte kliendi ülevaatuseks (plaani §3.1.5) */
  console.log(`\n================= KOKKUVÕTE =================`)
  console.log(DRY_RUN ? "DRY RUN — midagi ei saadetud. Tõeliseks loomiseks käivita ilma --dry-run liputa." : `Valmis. Saadetud operatsioone: ${sentOperations}.`)
  console.log(`Kampaaniad (KÕIK PEATATUD — käivitamine alles kliendi kinnitusega):`)
  for (const c of CAMPAIGNS) {
    console.log(`  · ${c.name} — €${c.budgetEurPerDay}/päev, ${c.adGroups.length} gruppi`)
    for (const g of c.adGroups) {
      console.log(`      - ${g.name}: CPC €${g.cpcBidEur}${g.keywords ? `, ${g.keywords.length} märksõna` : ""}${g.urlContains ? `, DSA: ${g.urlContains.join(" OR ")}` : ""}${g.finalUrls ? ` → ${g.finalUrls[0]}` : ""}`)
    }
  }
  console.log(`Eelarvelagi kokku: €17/päev ≈ €520/kuu. Praegust seadistust EI MUUDETUD.`)
  console.log(`Järgmised sammud: (1) vaata kampaaniad Ads UI-s üle (filter: silt „${LABEL_NAME}"),`)
  console.log(`  (2) kliendi kinnitus, (3) lülita kampaaniad ENABLED, (4) esimene iganädalane hooldus.`)
}

main().catch((e) => {
  console.error(`VIGA: ${(e as Error).message}`)
  process.exit(1)
})
