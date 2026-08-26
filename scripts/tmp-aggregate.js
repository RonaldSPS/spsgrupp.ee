/* Local aggregation of GSC data (UTF-8 safe). Run: node scripts/tmp-aggregate.js */
const fs = require("fs")
const d = JSON.parse(fs.readFileSync(process.env.TEMP + "/seo-data.json", "utf-8").replace(/^﻿/, ""))

const KWS = [
  "puhastusteenused", "puhastusteenused tallinnas", "koristusteenused", "koristusteenused tallinnas",
  "puhastusfirma", "puhastusfirma tallinnas", "koristusfirma", "koristusfirma tallinnas",
  "kontorikoristus", "kontorite koristus", "kontorikoristus tallinnas", "hoolduskoristus",
  "äripindade koristus", "büroode koristus", "eripuhastustööd", "akende pesu",
  "akende pesu tallinnas", "põrandate süvapesu", "suurpuhastus", "fassaadipesu", "tööstuskoristus",
  // extra
  "kontori koristus", "kontori puhastus", "aknapesu", "akende pesemine", "ehitusjäätmete äravedu",
  "ehitusprahi äravedu", "vaipade pesu", "vaipade puhastus", "trepikoja koristus", "ehitusjärgne koristus",
  "ehitusjärgne puhastus", "lõppuhastus", "puhastusteenus", "koristusteenus", "puhastus tallinn",
  "fassaadi pesu", "põrandate hooldus", "hoolduskoristus tallinnas", "äripindade puhastus",
  "kontorite puhastus", "tolmuvaba koristus", "kliiniline puhastus", "desinfitseerimine",
  "ventilatsioonide puhastus", "välikoristus", "muruniitmine", "lumekoristus",
]

function agg(rows, kw, exact) {
  const m = rows.filter((r) => (exact ? r.q === kw : r.q.includes(kw)))
  let impr = 0, clicks = 0, posSum = 0
  for (const r of m) { impr += r.impressions; clicks += r.clicks; posSum += r.position * r.impressions }
  return impr === 0 ? null : { impr, clicks, pos: posSum / impr, ctr: clicks / impr }
}

const periods = ["july", "prev28", "cur28", "preLaunch", "postLaunch"]
const lines = []
for (const kw of KWS) {
  const fam = {}
  let anyImpr = 0
  for (const p of periods) {
    fam[p] = agg(d.gsc.allQueries[p] || [], kw, false)
    if (fam[p]) anyImpr += fam[p].impr
  }
  if (anyImpr === 0) { lines.push(`${kw} :: NO DATA`); continue }
  // pages for this family (cur28)
  const pageMap = new Map()
  for (const r of (d.gsc.queryPageRows || []).filter((r) => r.q.includes(kw))) {
    const cur = pageMap.get(r.page) ?? { impr: 0, posSum: 0 }
    cur.impr += r.impr; cur.posSum += r.pos * r.impr
    pageMap.set(r.page, cur)
  }
  const pages = [...pageMap.entries()]
    .sort((a, b) => b[1].impr - a[1].impr)
    .slice(0, 3)
    .map(([p, v]) => `${p.replace("https://spsgrupp.ee", "")} (impr ${v.impr}, pos ${(v.posSum / v.impr).toFixed(1)})`)
  lines.push(`${kw} :: ${periods.map((p) => `${p}=${fam[p] ? `i${fam[p].impr} c${fam[p].clicks} p${fam[p].pos.toFixed(1)}` : "-"}`).join(" | ")} :: PAGES: ${pages.join("; ") || "-"}`)
}
fs.writeFileSync(process.env.TEMP + "/families2.txt", lines.join("\n"), "utf-8")
console.log(lines.join("\n"))
