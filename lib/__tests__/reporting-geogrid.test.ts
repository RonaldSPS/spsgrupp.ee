import test from "node:test"
import assert from "node:assert/strict"
import { findOwnRank, summarizeRun, normalizeGeoKeyword, GEOGRID_POINTS } from "../reporting/geogrid"

test("findOwnRank leiab meie kirje domeeni järgi (1-põhine koht)", () => {
  const places = [
    { displayName: { text: "Müüja X" }, websiteUri: "https://example.ee/" },
    { displayName: { text: "Keegi Teine" }, websiteUri: "https://spsgrupp.ee/" },
    { displayName: { text: "Kolmas" }, websiteUri: "https://muu.ee" },
  ]
  assert.equal(findOwnRank(places), 2)
})

test("findOwnRank leiab nime järgi, kui domeen puudub", () => {
  const places = [
    { displayName: { text: "Konkurent OÜ" }, websiteUri: "https://a.ee" },
    { displayName: { text: "SPS Grupp OÜ" } },
  ]
  assert.equal(findOwnRank(places), 2)
})

test("findOwnRank tagastab null, kui meid pole (pole top-20)", () => {
  const places = [{ displayName: { text: "SPS Remont" }, websiteUri: "https://spsremont.ee" }]
  assert.equal(findOwnRank(places), null)
  assert.equal(findOwnRank([]), null)
})

test("findOwnRank ei aja segamini sarnase nimega domeene", () => {
  const places = [
    { displayName: { text: "Keegi Teine" }, websiteUri: "https://spsgrupp.ee.evil.example" },
    { displayName: { text: "SPS Grupp OÜ" }, websiteUri: "https://www.spsgrupp.ee/kontakt" },
  ]
  // esimene on võlts domeen — mitte match; teine on päris meie (alamdomeen + tee)
  assert.equal(findOwnRank(places), 2)
})

test("summarizeRun: leidmata punktid loetakse kohaks 21", () => {
  const s = summarizeRun([{ rank: 1 }, { rank: null }, { rank: 10 }])
  assert.equal(s.found, 2)
  assert.equal(s.top3, 1)
  assert.equal(s.top10, 2)
  assert.equal(s.avgRank, (1 + 21 + 10) / 3)
})

test("summarizeRun: kõik leitud top-3", () => {
  const s = summarizeRun([{ rank: 1 }, { rank: 2 }, { rank: 3 }])
  assert.equal(s.found, 3)
  assert.equal(s.top3, 3)
  assert.equal(s.top10, 3)
  assert.equal(s.avgRank, 2)
})

test("normalizeGeoKeyword puhastab ja valideerib sisendi", () => {
  assert.equal(normalizeGeoKeyword("  HooldusKoristus   TALLINN "), "hoolduskoristus tallinn")
  assert.equal(normalizeGeoKeyword("ä"), null) // liiga lühike
  assert.equal(normalizeGeoKeyword("akende pesu; DROP TABLE"), null) // keelatud märgid
  assert.equal(normalizeGeoKeyword(42), null)
  assert.equal(normalizeGeoKeyword("vaipade pesu"), "vaipade pesu")
})

test("geo-grid mõõtepunktid on unikaalsete võtmetega ja Eestis", () => {
  const keys = new Set(GEOGRID_POINTS.map((p) => p.key))
  assert.equal(keys.size, GEOGRID_POINTS.length)
  for (const p of GEOGRID_POINTS) {
    assert.ok(p.lat > 59.2 && p.lat < 59.6, `${p.key} lat väljas`)
    assert.ok(p.lng > 24.4 && p.lng < 25.1, `${p.key} lng väljas`)
    assert.ok(p.label.length > 0)
  }
})
