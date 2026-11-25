/** TEMP: exact GSC query stats for the keyword report. Run: npx tsx scripts/tmp-kw-gsc-exact.ts */
import { readFileSync } from "node:fs"

const d = JSON.parse(readFileSync("tmp/kw-analysis-data.json", "utf-8"))

const QUERIES = [
  "puhastusteenused", "puhastusteenused tallinnas", "puhastusteenused tallinn",
  "koristusteenus", "koristusteenused", "koristusteenus tallinnas", "koristusteenused tallinnas",
  "koristusfirma", "koristusfirma tallinnas", "koristusfirmad", "koristusfirmad tallinnas",
  "puhastusfirma", "puhastusfirmad", "koristusettevõte", "puhastusettevõte",
  "kontori koristus", "kontorikoristus", "büroo koristus", "kontorite koristus",
  "hoolduskoristus", "äripindade koristus", "kaubanduspindade koristus",
  "trepikoja koristus", "trepikodade koristus", "kojamehe teenus",
  "akende pesu", "akende pesu tallinnas", "aknapesu", "suurpuhastus",
  "ehitusjärgne koristus", "remondijärgne koristus", "põrandate süvapesu", "põrandahooldus",
  "fassaadipesu", "tööstuskoristus", "vaipade puhastus", "desinfitseerimine",
  "ehitusprahi äravedu", "välikoristus", "territooriumi koristus", "heakorrateenus",
  "клининг таллинн", "уборка офисов таллинн", "мойка окон таллинн",
  "cleaning company tallinn", "cleaning services tallinn", "cleaning tallinn",
]

const cur = new Map<string, any>()
for (const r of d.gsc.cur) cur.set((r.keys?.[0] ?? "").toLowerCase(), r)
const prev = new Map<string, any>()
for (const r of d.gsc.prev) prev.set((r.keys?.[0] ?? "").toLowerCase(), r)

console.log("query | cur28 impr | cur28 clicks | cur28 pos | prev28 impr | prev28 pos")
for (const q of QUERIES) {
  const c = cur.get(q)
  const p = prev.get(q)
  console.log(
    `${q} | ${c?.impressions ?? 0} | ${c?.clicks ?? 0} | ${c ? c.position.toFixed(1) : "-"} | ${p?.impressions ?? 0} | ${p ? p.position.toFixed(1) : "-"}`,
  )
}

// also any query containing specific stems, for cluster volumes
console.log("\n## cluster sums (cur28): stem | impr | clicks")
for (const stem of ["hoolduskoristus", "trepikoj", "kojamehe", "büroo", "äripind", "kaubanduspin", "tööstus", "vaip", "desinfitseeri", "suurpuhastus", "fassaad", "lumekoristus", "kontori", "kontorikoristus"]) {
  let impr = 0, clicks = 0
  for (const r of d.gsc.cur) {
    const q = (r.keys?.[0] ?? "").toLowerCase()
    if (q.includes(stem)) { impr += r.impressions; clicks += r.clicks }
  }
  console.log(`${stem} | ${impr} | ${clicks}`)
}
