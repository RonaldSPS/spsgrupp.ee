import test from "node:test"
import assert from "node:assert/strict"
import { splitAdsConversions, maintenanceCostLine } from "../reporting/email-html"
import { isTestSubmission } from "../reporting/forms"
import type { FormSubmission } from "../form-submissions"
import type { AdsConversionBreakdown, AdsData, LeadRow } from "../reporting/types"

function makeSubmission(over: Partial<FormSubmission>): FormSubmission {
  return {
    id: 1, form: "contact", locale: "et", name: "", email: "", phone: "", company: "",
    message: "", region: "", workload: "", workTime: "", attachmentName: "",
    fee: "", profit: "", notes: "", isSpam: false, pageUrl: "", gclid: "", source: "",
    createdAt: "2026-09-25T00:00:00.000Z",
    ...over,
  }
}

function makeAds(breakdown: AdsConversionBreakdown[] | undefined, cost = 174.29): AdsData {
  return {
    available: true,
    campaigns: [],
    brand: { cost: 0, clicks: 0, conversions: 0 },
    nonBrand: { cost: 0, clicks: 0, conversions: 0 },
    topTerms: [],
    keywords: [],
    totals: { cost, clicks: 30, impressions: 461, conversions: 4 },
    ...(breakdown === undefined ? {} : { conversionBreakdown: breakdown }),
  }
}

function makeLead(maintenance: LeadRow["maintenance"], viaAds: boolean): LeadRow {
  return {
    id: 1,
    createdAt: "2026-09-30T10:00:00.000Z",
    company: "Test OÜ",
    maintenance,
    viaAds,
    source: viaAds ? "google_ads" : "organic:google",
    pageUrl: "https://spsgrupp.ee/",
    summary: "Sõnum",
  }
}

test("splitAdsConversions eraldab vormi, telefoni/e-posti ja muud konversioonid", () => {
  const split = splitAdsConversions(
    makeAds([
      { name: "form_submit 2026", category: "SUBMIT_LEAD_FORM", conversions: 2 },
      { name: "Email_phone_klik_copy", category: "CONTACT", conversions: 1.5 },
      { name: "Clicks to call", category: "PHONE_CALL_LEAD", conversions: 0.5 },
      { name: "Local actions - Website visits", category: "PAGE_VIEW", conversions: 3 },
    ]),
  )
  assert.equal(split.hasData, true)
  assert.equal(split.form, 2)
  assert.equal(split.contact, 2)
  assert.equal(split.other, 3)
})

test("splitAdsConversions: vana snapshot (breakdown puudub) -> hasData=false", () => {
  const split = splitAdsConversions(makeAds(undefined))
  assert.equal(split.hasData, false)
  assert.equal(split.form, 0)
})

test("splitAdsConversions: null/undefined sisend on turvaline", () => {
  assert.equal(splitAdsConversions(null).hasData, false)
  assert.equal(splitAdsConversions(undefined).hasData, false)
})

test("maintenanceCostLine: Ads-hoolduspäringu maksumus = kulu ÷ päringud", () => {
  const line = maintenanceCostLine(
    [makeLead("yes", true), makeLead("likely", false), makeLead("no", true)],
    makeAds([], 174.29),
  )
  assert.ok(line)
  assert.match(line!, /174,29 €\/päring/)
  assert.match(line!, /1 Adsist tulnud hoolduspäringut/)
  assert.match(line!, /üle kanalite kokku 2\)\./)
})

test("maintenanceCostLine: Ads-hoolduspäringuid pole -> maksumust ei jaga", () => {
  const line = maintenanceCostLine([makeLead("yes", false)], makeAds([], 150))
  assert.ok(line)
  assert.match(line!, /Adsist hoolduskoristuse päringuid sel perioodil ei tulnud/)
  assert.match(line!, /150,00 €/)
  assert.match(line!, /üle kanalite oli hoolduspäringuid 1\./)
})

test("maintenanceCostLine: Ads andmed puuduvad või kulu 0 -> null", () => {
  assert.equal(maintenanceCostLine([makeLead("yes", true)], null), null)
  assert.equal(maintenanceCostLine([makeLead("yes", true)], makeAds([], 0)), null)
})

test("isTestSubmission: kliendi ise deklareeritud proovipäring filtreerub", () => {
  assert.equal(
    isTestSubmission(makeSubmission({ company: "Testin OÜ", name: "Testin", message: "See on päringu proov, kustutage hiljem ära. Vabandan ebamugavuste pärast." })),
    true,
  )
})

test("isTestSubmission: tavaline äripäring, kus esineb sõna „proov“ teises tähenduses, ei filtreeru", () => {
  assert.equal(
    isTestSubmission(makeSubmission({ company: "Karnaluks OÜ", message: "Otsime puhastusteenuse osutajat 3x nädalas 1300m2 kaubanduspinnale." })),
    false,
  )
})
