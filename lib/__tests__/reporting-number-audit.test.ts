import test from "node:test"
import assert from "node:assert/strict"
import { extractNumbers, auditNarrativeNumbers } from "../reporting/number-audit"

test("extractNumbers parses Estonian formatting", () => {
  const vals = extractNumbers("Orgaanilised klikid tõusid 9,7-lt 11,6-le klikile päevas (+19 %), näitamised 362-lt 448-le.")
    .map((n) => n.value)
  assert.deepEqual(vals, [9.7, 11.6, 19, 362, 448])
})

test("extractNumbers handles thousands spaces and euro units", () => {
  const vals = extractNumbers("Kulu oli 1 000 000 € aastas ja 155,7 € nädalas.").map((n) => n.value)
  assert.deepEqual(vals, [1000000, 155.7])
})

test("extractNumbers skips dates and markdown list markers", () => {
  const text = "1. Kontrolli 17.08.2026 seisu.\n2. Vaata 2026-09-01 aruannet.\n3. Tee 3 asja."
  const nums = extractNumbers(text)
  // Only the bare mid-sentence "3" survives, and it is not audit-relevant.
  assert.deepEqual(nums.map((n) => n.value), [3])
  assert.equal(nums[0].risky, false)
})

test("bare small integers are not risky", () => {
  const [n] = extractNumbers("Nimekirjas on 3 punkti ja top 5.")
  assert.equal(n.risky, false)
})

test("audit passes numbers that exist in the sources", () => {
  const sources = [JSON.stringify({ clicksPerDay: 11.6, prevClicksPerDay: 9.7, budgetLostIS: 41.7 })]
  const narrative = "Klikid tõusid 9,7-lt 11,6-le päevas ja kampaania kaotab 41,7 % nähtavusest eelarve tõttu."
  assert.deepEqual(auditNarrativeNumbers(narrative, sources), [])
})

test("audit tolerates faithful rounding (41.7 -> 42)", () => {
  const sources = [JSON.stringify({ budgetLostIS: 41.7 })]
  assert.deepEqual(auditNarrativeNumbers("Nähtavuse kaotus on 42 %.", sources), [])
})

test("audit flags an invented euro figure (the 85,2 EUR incident)", () => {
  const sources = [JSON.stringify({ cost: 155.7, brandCost: 5.1, nonBrandCost: 70.5 })]
  const violations = auditNarrativeNumbers("55 % eelarvest (85,2 € 155,7 €-st) läks brändipäringutele.", sources)
  assert.ok(violations.includes("85,2"))
  assert.ok(violations.includes("55"))
  assert.ok(!violations.includes("155,7"))
})

test("audit flags a self-computed growth percentage", () => {
  const sources = [JSON.stringify({ clicksPerDay: 11.6, prevClicksPerDay: 9.7 })]
  const violations = auditNarrativeNumbers("Klikid kasvasid +19 %.", sources)
  assert.deepEqual(violations, ["+19"])
})

test("unit-bound integers are audited even when small", () => {
  const sources = [JSON.stringify({ conversions: 2 })]
  const violations = auditNarrativeNumbers("Tuli 5 konversiooni, kuluga 12 €.", sources)
  assert.ok(violations.includes("12"))
})
