/** TEMP: print monthly series for core queries from tmp/kw-gsc-16mo.json. Run: npx tsx scripts/tmp-kw-gsc-monthly.ts */
import { readFileSync } from "node:fs"

const d = JSON.parse(readFileSync("tmp/kw-gsc-16mo.json", "utf-8")) as Record<
  string,
  { monthly: Record<string, { impr: number; clicks: number; posW: number }>; totalImpr: number; totalClicks: number }
>

const CORE = [
  "puhastusteenused", "puhastusteenused tallinnas", "puhastusteenused tallinn",
  "koristusteenus", "koristusteenused", "koristusteenus tallinnas", "koristusteenused tallinnas",
  "koristusfirma", "koristusfirmad", "koristusfirmad tallinnas", "puhastusfirma",
  "kontori koristus", "kontorikoristus", "büroo koristus", "hoolduskoristus",
  "kojamehe teenus", "äripindade koristus", "akende pesu", "suurpuhastus",
  "ehitusjärgne koristus", "fassaadipesu", "desinfitseerimine", "välikoristus", "lumekoristus",
  "клининг таллинн",
]

const months = ["2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09(poolik,14p)"]
console.log("query | " + months.join(" | "))
for (const q of CORE) {
  const s = d[q]
  if (!s) {
    console.log(`${q} | 0 | 0 | 0 | 0 | 0 | 0`)
    continue
  }
  const cells = ["2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"].map((m) => String(s.monthly[m]?.impr ?? 0))
  console.log(`${q} | ${cells.join(" | ")}`)
}
