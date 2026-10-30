import test from "node:test"
import assert from "node:assert/strict"
import { buildInsights } from "../reporting/insights"
import type { AdsCampaign, AdsData, ReportSnapshot } from "../reporting/types"

function makeCampaign(over: Partial<AdsCampaign>): AdsCampaign {
  return {
    name: "Kampaania",
    status: "ENABLED",
    cost: 50,
    clicks: 10,
    impressions: 500,
    ctr: 0.02,
    avgCpc: 5,
    conversions: 0,
    allConversions: 0,
    impressionShare: 0.5,
    rankLostIS: 0.1,
    budgetLostIS: 0.5,
    topIS: 0.4,
    absTopIS: 0.2,
    ...over,
  }
}

function makeAds(over: Partial<AdsData>): AdsData {
  return {
    available: true,
    totals: { cost: 100, clicks: 20, impressions: 1000, conversions: 1 },
    brand: { cost: 0, clicks: 0, conversions: 0 },
    nonBrand: { cost: 100, clicks: 20, conversions: 1 },
    topTerms: [],
    keywords: [],
    campaigns: [],
    conversionBreakdown: [],
    ...over,
  }
}

function snapshotWithAds(ads: AdsData): ReportSnapshot {
  return { generatedAt: "2026-10-30T06:00:00.000Z", ads } as unknown as ReportSnapshot
}

/* Peatatud kampaania ei tohi saada eelarve-tõstmise soovitust (30.10.2026:
 * raport soovitas tõsta eelarvet kliendi otsusel PEATATUD P26-kampaaniatele). */
test("ads insights: PEATATUD kampaania budget-lost-IS hoiatust ei teki", () => {
  const ads = makeAds({
    campaigns: [makeCampaign({ name: "P26 · Otsing · DSA-kaevur", status: "PAUSED", budgetLostIS: 0.82 })],
  })
  const insights = buildInsights(snapshotWithAds(ads))
  assert.equal(insights.some((i) => i.title.includes("eelarve tõttu")), false)
})

test("ads insights: ENABLED kampaania saab budget-lost-IS oportuniteedi", () => {
  const ads = makeAds({
    campaigns: [makeCampaign({ name: "Otsing - Teenused - 2026", status: "ENABLED", budgetLostIS: 0.4 })],
  })
  const insights = buildInsights(snapshotWithAds(ads))
  assert.equal(insights.some((i) => i.title.includes("eelarve tõttu")), true)
})

/* Strateegiliste perekondade tuumikterminid ei ole „raiskajad" ka 0-konversioonilise
 * nädalaga (30.10.2026: „koristusteenus tallinnas" 10,42 € lipitati ekslikult). */
test("ads insights: perekonda kuuluvat terminit ei lipitata raiskajaks", () => {
  const ads = makeAds({
    topTerms: [
      { term: "koristusteenus tallinnas", cost: 10.42, clicks: 2, conversions: 0, impressions: 12, campaign: "Otsing - Teenused - 2026" },
      { term: "marula clean", cost: 12.0, clicks: 1, conversions: 0, impressions: 3, campaign: "Otsing - Teenused - 2026" },
    ],
  })
  const insights = buildInsights(snapshotWithAds(ads))
  const wasted = insights.find((i) => i.title.includes("kulutavad raha"))
  assert.ok(wasted, "jääk-termin peaks lipitama")
  assert.ok(wasted!.detail.includes("marula clean"))
  assert.ok(!wasted!.detail.includes("koristusteenus tallinnas"))
})

test("ads insights: ainult perekondade termineid -> raiskamis-hoiatust ei teki", () => {
  const ads = makeAds({
    topTerms: [
      { term: "koristusteenus tallinnas", cost: 10.42, clicks: 2, conversions: 0, impressions: 12, campaign: "Otsing - Teenused - 2026" },
      { term: "kontori koristus", cost: 15.0, clicks: 3, conversions: 0, impressions: 20, campaign: "Otsing - Teenused - 2026" },
    ],
  })
  const insights = buildInsights(snapshotWithAds(ads))
  assert.equal(insights.some((i) => i.title.includes("kulutavad raha")), false)
})
