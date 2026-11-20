import test from "node:test"
import assert from "node:assert/strict"
import { buildInsights } from "../reporting/insights"
import type { GscData, GscQueryPage, KeywordFamilyStat, ReportSnapshot } from "../reporting/types"

function makeGsc(over: Partial<GscData> & { families?: KeywordFamilyStat[]; queryPages?: GscQueryPage[] }): GscData {
  const base: GscData = {
    current: { clicks: 100, impressions: 5000, ctr: 0.02, position: 12, days: 7 },
    previous: { clicks: 90, impressions: 4800, ctr: 0.018, position: 13, days: 7 },
    topQueries: [],
    prevQueries: [],
    topPages: [],
    families: [],
    newQueries: [],
  }
  return { ...base, ...over }
}

function makeSnapshot(gsc: GscData): ReportSnapshot {
  return {
    generatedAt: "2026-11-20T06:00:00.000Z",
    gsc,
  } as unknown as ReportSnapshot
}

function family(over: Partial<KeywordFamilyStat>): KeywordFamilyStat {
  return {
    id: "hoolduskoristus",
    label: "hoolduskoristus",
    current: { impressions: 43, clicks: 0, position: 14.3 },
    previous: { impressions: 40, clicks: 0, position: 22.9 },
    carrier: { page: "https://spsgrupp.ee/blog/mis-on-hoolduskoristus-ja-mida-see-ettevottele-tahendab/", impressions: 43 },
    targetPage: "/koristusteenus/hoolduskoristus",
    carrierMatchesTarget: false,
    ...over,
  }
}

/* Kliendi tagasiside 20.11.2026: raport soovitas hoolduskoristuse puhul ühes
 * kohas tugevdada teenuselehte ja teises sama märksõnaga blogi. Tõus/käeulatus
 * vales lehes peab soovitama ÕIGE lehe tugevdamist, mitte blogi. */
test("seo insights: tõus vales lehes suunab siselingid õigele lehele", () => {
  const f = family({
    current: { impressions: 43, clicks: 0, position: 14.3 },
    previous: { impressions: 40, clicks: 0, position: 22.9 },
  })
  const insights = buildInsights(makeSnapshot(makeGsc({ families: [f] })))
  const riser = insights.find((i) => i.title.includes('tõusis'))
  assert.ok(riser, "tõusu insight peab olema")
  assert.ok(riser!.action.includes('/koristusteenus/hoolduskoristus'), 'tõusu action peab viitama õigele lehele')
  assert.ok(!riser!.action.includes('värskenda maandumislehte'), 'ei tohi soovitada valet maandujat tugevdada')
})

test("seo insights: käeulatuses vales lehes suunab sihtlehele", () => {
  const f = family({
    current: { impressions: 43, clicks: 0, position: 14.3 },
    previous: { impressions: 40, clicks: 0, position: 16.0 },
  })
  const insights = buildInsights(makeSnapshot(makeGsc({ families: [f] })))
  const striking = insights.find((i) => i.title.includes('Käeulatuses'))
  assert.ok(striking, "käeulatuses insight peab olema")
  assert.ok(striking!.action.includes('/koristusteenus/hoolduskoristus'), 'käeulatuses action peab viitama õigele lehele')
  assert.ok(striking!.action.includes('valele lehele'), 'action peab mainima, et maandub valele lehele')
})

test("seo insights: madal CTR õigel lehel annab CTR-rünnaku", () => {
  const f = family({
    id: "kontori-koristus",
    label: "kontori koristus",
    current: { impressions: 134, clicks: 0, position: 6.3 },
    previous: { impressions: 130, clicks: 2, position: 7.0 },
    carrier: { page: "https://spsgrupp.ee/koristusteenus/kontori-koristus/", impressions: 134 },
    targetPage: "/koristusteenus/kontori-koristus",
    carrierMatchesTarget: true,
  })
  const insights = buildInsights(makeSnapshot(makeGsc({ families: [f] })))
  const ctr = insights.find((i) => i.title.includes('Madal CTR'))
  assert.ok(ctr, "CTR insight peab olema")
  assert.ok(ctr!.action.includes('title + meta description'), 'õige lehe puhul soovita title/meta muutmist')
  assert.ok(!ctr!.action.includes('vale leht'), 'õige lehe puhul ära maini vale maandumislehte')
})

test("seo insights: püsivalt vale maandumisleht tekitab warningu", () => {
  const f = family({
    id: "koristusteenused",
    label: "koristusteenused",
    current: { impressions: 83, clicks: 1, position: 27.9 },
    previous: { impressions: 80, clicks: 1, position: 35.8 },
    carrier: { page: "https://spsgrupp.ee/puhastusteenused/", impressions: 83 },
    targetPage: "/koristusteenus",
    carrierMatchesTarget: false,
  })
  const insights = buildInsights(makeSnapshot(makeGsc({ families: [f] })))
  const wrong = insights.find((i) => i.title.includes('maandub valele lehele'))
  assert.ok(wrong, "vale maandumislehe warning peab olema")
  assert.ok(wrong!.action.includes('/koristusteenus'), 'warning peab suunama õigele lehele')
})

test("strategy insights: sisuauk eristab vale maandujat ja nõrka olemasolevat lehte", () => {
  const families: KeywordFamilyStat[] = [
    {
      id: "puhastusteenused",
      label: "puhastusteenused",
      current: { impressions: 72, clicks: 0, position: 22.5 },
      previous: { impressions: 70, clicks: 0, position: 23.0 },
      carrier: { page: "https://spsgrupp.ee/puhastusteenused/", impressions: 72 },
      targetPage: "/puhastusteenused",
      carrierMatchesTarget: true,
    },
    {
      id: "koristusteenused",
      label: "koristusteenused",
      current: { impressions: 83, clicks: 1, position: 27.9 },
      previous: { impressions: 80, clicks: 1, position: 35.8 },
      carrier: { page: "https://spsgrupp.ee/puhastusteenused/", impressions: 83 },
      targetPage: "/koristusteenus",
      carrierMatchesTarget: false,
    },
  ]
  const insights = buildInsights(makeSnapshot(makeGsc({ families })))
  const gap = insights.find((i) => i.title.includes('Sisuauk'))
  assert.ok(gap, "sisuauk insight peab olema")
  assert.ok(gap!.detail.includes('Maandub valele lehele'), 'detail peab ütlema, et üks perekond maandub valele lehele')
  assert.ok(gap!.detail.includes('/koristusteenus'), 'detail peab viitama õigele lehele')
  assert.ok(gap!.detail.includes('Nõrk positsioon'), 'detail peab mainima nõrka olemasolevat lehte')
  assert.ok(/suun/i.test(gap!.action), 'action peab sisaldama suunamist')
  assert.ok(/tugevda/i.test(gap!.action), 'action peab sisaldama tugevdamist')
})
