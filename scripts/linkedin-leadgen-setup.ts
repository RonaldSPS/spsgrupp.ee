/**
 * LinkedIn Lead Gen campaign setup for SPS Grupp — "Tasuta koristuse audit".
 *
 * Creates, ALL IN PAUSED/REVIEW STATE (nothing spends money; the client
 * flips the campaign ACTIVE in Campaign Manager after review):
 *   1. Lead Gen Form    (POST /rest/leadForms, scope rw_ads — Estonian copy
 *      under the en_US locale key: LinkedIn has no et_EE form locale, and
 *      English-locale forms may serve in any campaign)
 *   2. Campaign         (LEAD_GENERATION / STANDARD_UPDATE, $25/day CPM,
 *      geo = Harjumaa (includes Tallinn), matched audience = "SPS audience
 *      List" company upload, status PAUSED)
 *   3. 3 creatives      (POST /rest/adAccounts/{id}/creatives?action=createInline
 *      — creates the dark post inline; a direct POST /rest/posts 403s with
 *      our scopes: partnerApiPostsExternal.CREATE needs w_organization_social.
 *      intendedStatus ACTIVE so ad review completes BEFORE launch; no serving
 *      while the campaign is PAUSED)
 *
 * Creative content = ARTICLE CARD (content.article -> spsgrupp.ee page with a
 * JPG og:image), not an uploaded image. Reason (bisected 11.11.2026): an image
 * uploaded with owner=sponsoredAccount (org-owned upload 403s without
 * w_organization_social) is rejected by createInline with 400
 * INVALID_CONTENT_OWNERSHIP ("contents must be owned by post author") — a
 * catch-22, so image ads are impossible with rw_ads-only. Article cards
 * scrape the target page's OG image (all chosen pages have JPG OG heroes;
 * hoolduskoristus page's OG is webp — LinkedIn's crawler is flaky with webp).
 *
 * leadgenCallToAction.destination takes an **adForm** URN
 * (urn:li:adForm:<id>) — passing urn:li:leadGenForm:<id> makes creative
 * creation 500 (bisected 11.11.2026).
 *
 * Idempotent: created URNs persist in raportid/LinkedIn/leadgen-campaign-state.json
 * (gitignored). Re-running verifies each entity with GET and recreates only
 * what is missing (== --repair behaviour). NOTE: campaigns must be verified
 * via the nested path adAccounts/{id}/adCampaigns/{cid} — top-level
 * GET /rest/adCampaigns/{id} 404s (caused a duplicate campaign once).
 *
 * Usage:
 *   npx tsx scripts/linkedin-leadgen-setup.ts --dry-run   # print payloads only
 *   npx tsx scripts/linkedin-leadgen-setup.ts             # create/verify all
 *   npx tsx scripts/linkedin-leadgen-setup.ts --repair    # same as default
 *
 * BLOCKER (11.11.2026): adCampaigns CREATE 403s with "account not in Account
 * Management list" until the ad account is (re-)mapped in Developer Portal ->
 * app -> Products -> Advertising API -> View ad accounts. leadForms create
 * works without it — enforcement is inconsistent across endpoints.
 *
 * Gotchas encoded here (learned 11.11.2026):
 *   - API version 202511 sunsets 2026-11-16 -> linkedin-api.ts defaults to 202610.
 *   - Custom lead-form questions are ALWAYS required (LinkedIn rule); the
 *     first multiple-choice option is pre-selected by default; every MC
 *     option needs a numeric "id".
 *   - pacingStrategy has no "DAILY" enum (UI drafts carry LIFETIME) — omit it.
 *   - Leads CANNOT be pulled via API with our scopes (needs
 *     r_marketing_leadgen_automation) -> manual CSV download from Campaign
 *     Manager; LinkedIn deletes leads after 90 days.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { linkedInApiRequest } from "./linkedin-api"

const DRY_RUN = process.argv.includes("--dry-run")

// ---- Fixed IDs (see raportid/LinkedIn/README.md) --------------------------
const ACCOUNT = "urn:li:sponsoredAccount:509346657"
const ACCOUNT_ID = "509346657"
const ORG = "urn:li:organization:87991864"
const CAMPAIGN_GROUP = "urn:li:sponsoredCampaignGroup:622040464" // existing "New Campaign Group"
const GEO_HARJUMAA = "urn:li:geo:105126158" // Harjumaa, Estonia (includes Tallinn)
const SEGMENT = "urn:li:adSegment:100315949" // "SPS audience List" company upload, 171 matched
const PRIVACY_URL = "https://spsgrupp.ee/andmekaitsetingimused"
const SITE_URL = "https://spsgrupp.ee/"

const STATE_PATH = "raportid/LinkedIn/leadgen-campaign-state.json"

const CAMPAIGN_NAME = "SPS · Lead Gen · Hoolduskoristus B2B · 2026-11"
const FORM_NAME = "SPS · Tasuta koristuse audit · 2026-11"

// ---- Ad copy ---------------------------------------------------------------
// LANGUAGE GOTCHA (11.11.2026): the original Estonian copy got all 3 creatives
// REJECTED (UNSUPPORTED_LANGUAGE) — Estonian is not one of LinkedIn's ~22
// supported ad languages. Copy below is therefore ENGLISH (compliant), while
// articleUrl points at the ESTONIAN site pages (client decision: Estonian
// landing experience; small residual risk that a reviewer flags the card's
// Estonian og:description — if so, switch articleUrl to the /cleaning-
// services-in-tallinn EN pages). Estonian originals: raportid/LinkedIn/ad-copy-et.md
// (keep for Meta/Google, where Estonian ads are allowed).
interface Concept { key: string; name: string; headline: string; commentary: string; articleUrl: string }
const CONCEPTS: Concept[] = [
  {
    key: "K1",
    name: "SPS LGen 2026-11 · K1 No system",
    headline: "The cleaner comes. But does anything actually change?",
    articleUrl: "https://spsgrupp.ee/koristusteenus/kontori-koristus/", // JPG og:image (office)
    commentary: [
      "Dust settles on cabinet tops.",
      "Washroom supplies run out.",
      "The meeting room still shows yesterday's traces in the morning.",
      "",
      "It doesn't mean there was no cleaner. It means there is no system.",
      "",
      "SPS Grupp helps companies keep commercial premises clean in Tallinn and Harju County – with ISO 9001 and ISO 14001 certified processes.",
      "",
      "Book a free cleaning audit: we visit your premises, assess the current state and give concrete recommendations. No obligations.",
    ].join("\n"),
  },
  {
    key: "K2",
    name: "SPS LGen 2026-11 · K2 Cost optimisation",
    headline: "Paying more for cleaning than you need to?",
    articleUrl: "https://spsgrupp.ee/koristusteenus/kontori-koristus/",
    commentary: [
      "Many companies order cleaning out of habit.",
      "",
      "The frequency is wrong. Work is done where it isn't needed. Critical areas get overlooked.",
      "",
      "SPS Grupp analyses your premises and helps find the optimal cleaning scope – quality often improves while total cost goes down.",
      "",
      "Free cleaning audit in Tallinn and Harju County.",
    ].join("\n"),
  },
  {
    key: "K3",
    name: "SPS LGen 2026-11 · K3 Property managers",
    headline: "Tenants don't complain about the cleaning. They complain about the building.",
    articleUrl: "https://spsgrupp.ee/koristusteenus/", // JPG og:image (hub hero)
    commentary: [
      "Corridors. Lifts. Staircases. Common areas. Washrooms.",
      "",
      "Cleaning quality affects the value of the entire property – and tenant satisfaction.",
      "",
      "SPS Grupp helps property owners and managers keep buildings presentable every day.",
      "",
      "Book a free cleaning audit: we walk through the building and give a concrete assessment.",
    ].join("\n"),
  },
]

// ---- State ----------------------------------------------------------------
interface State {
  formId?: string // numeric; leadForms GET + adForm URN derive from it
  campaignUrn?: string
  creatives?: Record<string, string> // concept key -> creative URN
}
function loadState(): State {
  if (!existsSync(STATE_PATH)) return {}
  return JSON.parse(readFileSync(STATE_PATH, "utf-8"))
}
function saveState(s: State) {
  mkdirSync(dirname(STATE_PATH), { recursive: true })
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2) + "\n", "utf-8")
}

/** GET an entity URN; true if it still exists. */
async function entityExists(urn: string, endpoint: string, id: string): Promise<boolean> {
  try {
    await linkedInApiRequest("GET", `${endpoint}/${encodeURIComponent(id)}`)
    return true
  } catch {
    return false
  }
}
const urnId = (urn: string) => urn.split(":").pop() ?? urn

// ---- Payload builders ------------------------------------------------------
function leadFormPayload() {
  const L = (en: string) => ({ localized: { en_US: en } }) // EN copy — ET got rejected (see CONCEPTS gotcha)
  const textQ = (name: string, label: string, required: boolean, predefinedField?: string) => ({
    name,
    question: L(label),
    ...(predefinedField ? { predefinedField } : {}),
    responseRequired: required,
    questionDetails: { textQuestionDetails: { maxResponseLength: 300 } },
  })
  return {
    owner: { sponsoredAccount: ACCOUNT },
    name: FORM_NAME,
    creationLocale: { country: "US", language: "en" },
    state: "PUBLISHED",
    content: {
      headline: L("Free commercial cleaning audit"),
      description: L(
        "Leave your details – SPS Grupp will contact you within 1 business day. No obligations. Serving Tallinn and Harju County.",
      ),
      questions: [
        textQ("firstName", "First name", true, "FIRST_NAME"),
        textQ("lastName", "Last name", true, "LAST_NAME"),
        textQ("email", "Email", true, "EMAIL"),
        textQ("company", "Company", true, "COMPANY_NAME"),
        textQ("jobTitle", "Job title (optional)", false, "JOB_TITLE"),
        textQ("phone", "Phone (optional)", false, "PHONE_NUMBER"),
        textQ("pindala", "Premises size (m²)", true),
        {
          name: "partner",
          question: L("Do you currently have a cleaning partner?"),
          questionDetails: {
            multipleChoiceQuestionDetails: {
              options: [
                { id: 1, text: L("Yes") },
                { id: 2, text: L("No") },
              ],
            },
          },
        },
      ],
      legalInfo: {
        privacyPolicyUrl: PRIVACY_URL,
        legalDisclaimer: L(
          "SPS Grupp uses the submitted data only to contact you. Your data is never shared with third parties. See our privacy policy for details.",
        ),
      },
      postSubmissionInfo: {
        message: L("Thank you! Your request has been sent. We will contact you within 1 business day."),
        callToAction: {
          callToActionLabel: "VISIT_COMPANY_WEBSITE",
          callToActionTarget: { landingPageUrl: SITE_URL },
        },
      },
    },
  }
}

function campaignPayload() {
  const start = new Date()
  start.setUTCDate(start.getUTCDate() + 1)
  start.setUTCHours(0, 0, 0, 0)
  return {
    account: ACCOUNT,
    campaignGroup: CAMPAIGN_GROUP,
    name: CAMPAIGN_NAME,
    objectiveType: "LEAD_GENERATION",
    type: "SPONSORED_UPDATES",
    format: "STANDARD_UPDATE",
    associatedEntity: ORG,
    locale: { language: "en", country: "US" }, // LinkedIn has no et_EE campaign locale
    costType: "CPM",
    unitCost: { currencyCode: "USD", amount: "20" }, // manual CPM bid
    dailyBudget: { currencyCode: "USD", amount: "25" }, // ~EUR 750/mo
    // no pacingStrategy — "DAILY" is not a valid enum in 202610 (UI-created
    // drafts carry LIFETIME); omit and let LinkedIn default it.
    runSchedule: { start: start.getTime() },
    status: "PAUSED",
    politicalIntent: "NOT_POLITICAL",
    audienceExpansionEnabled: false,
    offsiteDeliveryEnabled: false, // LinkedIn Audience Network off — EE B2B feed only
    targetingCriteria: {
      include: {
        and: [
          { or: { "urn:li:adTargetingFacet:locations": [GEO_HARJUMAA] } },
          { or: { "urn:li:adTargetingFacet:audienceMatchingSegments": [SEGMENT] } },
        ],
      },
    },
  }
}

/** createInline payload — dark post + creative in one call (see header).
 *  Article card (OG scrape of articleUrl) because uploaded-image ownership
 *  is a catch-22 with rw_ads-only (see header comment). */
function creativeInlinePayload(c: Concept, campaignUrn: string, adFormUrn: string, intendedStatus: "ACTIVE" | "DRAFT") {
  return {
    creative: {
      campaign: campaignUrn,
      intendedStatus, // ACTIVE: review runs now; serving blocked by PAUSED campaign
      name: c.name,
      leadgenCallToAction: { destination: adFormUrn, label: "VIEW_QUOTE" },
      inlineContent: {
        post: {
          adContext: { dscAdAccount: ACCOUNT, dscStatus: "ACTIVE" },
          author: ORG,
          commentary: c.commentary,
          visibility: "PUBLIC",
          lifecycleState: "PUBLISHED",
          isReshareDisabledByAuthor: true,
          content: { article: { source: c.articleUrl, title: c.headline } },
        },
      },
    },
  }
}

// ---- Steps -----------------------------------------------------------------
/** Returns the adForm URN used as leadgenCallToAction.destination. */
async function ensureForm(state: State): Promise<string> {
  if (state.formId && (await entityExists(state.formId, "leadForms", state.formId))) {
    console.log(`= form OK    urn:li:adForm:${state.formId}`)
    return `urn:li:adForm:${state.formId}`
  }
  const payload = leadFormPayload()
  if (DRY_RUN) {
    console.log(`  DRY: POST leadForms\n${JSON.stringify(payload, null, 2)}`)
    return "urn:li:adForm:DRYRUN"
  }
  const res = await linkedInApiRequest("POST", "leadForms", { json: payload })
  const id = (res.restliId ?? "").split(":").pop() ?? ""
  console.log(`+ form       urn:li:adForm:${id}`)
  state.formId = id
  saveState(state)
  return `urn:li:adForm:${id}`
}

async function ensureCampaign(state: State): Promise<string> {
  // Verify via the NESTED path — top-level GET /rest/adCampaigns/{id} 404s.
  if (state.campaignUrn && (await entityExists(state.campaignUrn, `adAccounts/${ACCOUNT_ID}/adCampaigns`, urnId(state.campaignUrn)))) {
    console.log(`= campaign OK ${state.campaignUrn}`)
    return state.campaignUrn
  }
  const payload = campaignPayload()
  if (DRY_RUN) {
    console.log(`  DRY: POST adAccounts/${ACCOUNT_ID}/adCampaigns\n${JSON.stringify(payload, null, 2)}`)
    return "urn:li:sponsoredCampaign:DRYRUN"
  }
  const res = await linkedInApiRequest("POST", `adAccounts/${ACCOUNT_ID}/adCampaigns`, { json: payload })
  const urn = `urn:li:sponsoredCampaign:${res.restliId}`
  console.log(`+ campaign   ${urn}  (PAUSED, $25/day CPM bid $20)`)
  state.campaignUrn = urn
  saveState(state)
  return urn
}

async function ensureCreative(state: State, c: Concept, campaignUrn: string, adFormUrn: string): Promise<void> {
  state.creatives ??= {}
  const existing = state.creatives[c.key]
  // Verify via the NESTED account path — top-level GET /rest/creatives/{urn}
  // 404s (same trap as campaigns; caused a duplicate creative set once).
  // Also re-check intendedStatus: CANCELED creatives still GET 200 ("retrievable
  // if the underlying posts are valid") and must NOT count as existing.
  if (existing) {
    try {
      const res = await linkedInApiRequest("GET", `adAccounts/${ACCOUNT_ID}/creatives/${encodeURIComponent(existing)}`)
      if (res.json?.intendedStatus && res.json.intendedStatus !== "CANCELED") {
        console.log(`= creative OK ${c.key} ${existing}`)
        return
      }
      console.log(`  creative ${c.key} was ${res.json?.intendedStatus ?? "gone"} — recreating`)
    } catch { /* missing -> recreate */ }
  }
  if (DRY_RUN) {
    console.log(`  DRY: POST adAccounts/${ACCOUNT_ID}/creatives?action=createInline (${c.key})\n${JSON.stringify(creativeInlinePayload(c, campaignUrn, adFormUrn, "ACTIVE"), null, 2)}`)
    return
  }
  let res
  try {
    res = await linkedInApiRequest("POST", `adAccounts/${ACCOUNT_ID}/creatives?action=createInline`, {
      json: creativeInlinePayload(c, campaignUrn, adFormUrn, "ACTIVE"),
    })
  } catch (err) {
    // Fallback: ACTIVE triggers instant review plumbing; if LinkedIn 500s on
    // it, create as DRAFT instead (client flips ACTIVE in Campaign Manager).
    console.log(`  ACTIVE create failed (${err instanceof Error ? err.message.slice(0, 120) : err}) — retrying as DRAFT`)
    res = await linkedInApiRequest("POST", `adAccounts/${ACCOUNT_ID}/creatives?action=createInline`, {
      json: creativeInlinePayload(c, campaignUrn, adFormUrn, "DRAFT"),
    })
  }
  const rawId = res.restliId ?? res.json?.value?.creative ?? ""
  const urn = rawId.startsWith("urn:") ? rawId : `urn:li:sponsoredCreative:${rawId}`
  console.log(`+ creative   ${c.key} ${urn}`)
  state.creatives[c.key] = urn
  saveState(state)
}

async function main() {
  console.log(`LinkedIn Lead Gen setup — ${DRY_RUN ? "DRY RUN" : "LIVE"} — account ${ACCOUNT_ID}\n`)
  const state = loadState()
  const adFormUrn = await ensureForm(state)
  const campaignUrn = await ensureCampaign(state)
  for (const c of CONCEPTS) {
    await ensureCreative(state, c, campaignUrn, adFormUrn)
  }
  console.log("\nDone. State ->", STATE_PATH)
  console.log("To launch: Campaign Manager -> set campaign ACTIVE (creatives are pre-reviewed).")
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
