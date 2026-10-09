import test from "node:test"
import assert from "node:assert/strict"
import { formsWindow } from "../reporting/forms"
import type { ReportPeriod } from "../reporting/types"

/* Tavaline reedene periood (weeklyPeriod 09.10.2026 genereerimisel). */
const PERIOD: ReportPeriod = {
  start: "2026-10-01",
  end: "2026-10-07",
  prevStart: "2026-09-24",
  prevEnd: "2026-09-30",
}

test("formsWindow: aken ulatub genereerimispäevani (kliendi palve 09.10.2026)", () => {
  const w = formsWindow(PERIOD, new Date("2026-10-09T06:00:00.000Z"))
  assert.equal(w.start, "2026-10-01")
  assert.equal(w.end, "2026-10-09")
})

test("formsWindow: eelmine aken on sama pikk ja lõpeb vahetult enne käesolevat", () => {
  const w = formsWindow(PERIOD, new Date("2026-10-09T06:00:00.000Z"))
  // käesolev 01.10–09.10 = 9 päeva → eelmine 22.09–30.09 = 9 päeva
  assert.equal(w.prevStart, "2026-09-22")
  assert.equal(w.prevEnd, "2026-09-30")
})

test("formsWindow: ilma genereerimisajata jääb perioodi lõpp (tagasiühilduvus)", () => {
  const w = formsWindow(PERIOD)
  assert.deepEqual(w, {
    start: "2026-10-01",
    end: "2026-10-07",
    prevStart: "2026-09-24",
    prevEnd: "2026-09-30",
  })
})

test("formsWindow: genereerimine perioodi keskel annab lühema akna", () => {
  const w = formsWindow(PERIOD, new Date("2026-10-03T12:00:00.000Z"))
  assert.deepEqual(w, {
    start: "2026-10-01",
    end: "2026-10-03",
    prevStart: "2026-09-28",
    prevEnd: "2026-09-30",
  })
})
