/**
 * TEMP: parse the Keyword Planner "keyword ideas / historical metrics" export
 * (UTF-16 TSV or UTF-8 CSV, ET/EN headers) and print per-keyword avg monthly
 * searches for merging into the report. Run:
 *   npx tsx scripts/tmp-kw-planner-merge.ts "C:\path\to\keyword ideas.csv"
 */
import { readFileSync } from "node:fs"

const path = process.argv[2]
if (!path) {
  console.error("usage: npx tsx scripts/tmp-kw-planner-merge.ts <csv-path>")
  process.exit(1)
}

// Google Ads UI exports are often UTF-16LE TSV with BOM
let text: string
const buf = readFileSync(path)
if (buf[0] === 0xff && buf[1] === 0xfe) text = buf.toString("utf16le")
else if (buf[0] === 0xfe && buf[1] === 0xff) text = Buffer.from(buf.subarray(2).swap16()).toString("utf16le")
else text = buf.toString("utf-8")
text = text.replace(/^﻿/, "")

const lines = text.split(/\r?\n/).filter((l) => l.trim())
const delim = lines[0].includes("\t") ? "\t" : ","
const header = lines[0].split(delim).map((h) => h.trim().toLowerCase())

console.log("header:", JSON.stringify(header))

const kwIdx = header.findIndex((h) => h === "keyword" || h.includes("märksõna") || h.includes("marksona"))
const volIdx = header.findIndex(
  (h) => (h.includes("monthly") && h.includes("search")) || h.includes("kuuotsing") || h.includes("kuu otsing") || h.includes("avg. monthly"),
)
const compIdx = header.findIndex((h) => h === "competition" || h.includes("konkurents"))
const bidLowIdx = header.findIndex((h) => h.includes("low range") || h.includes("madalaim"))
const bidHighIdx = header.findIndex((h) => h.includes("high range") || h.includes("kõrgeim"))

if (kwIdx === -1 || volIdx === -1) {
  console.error("Could not find keyword/volume columns. Dumping all columns of first 3 rows:")
  for (const l of lines.slice(0, 3)) console.error(l.split(delim).join(" | "))
  process.exit(1)
}

const out: { kw: string; vol: string; comp: string; bidLow: string; bidHigh: string }[] = []
for (const line of lines.slice(1)) {
  const cols = line.split(delim).map((c) => c.trim().replace(/^"|"$/g, ""))
  const kw = cols[kwIdx]
  if (!kw) continue
  out.push({
    kw,
    vol: cols[volIdx] ?? "",
    comp: compIdx >= 0 ? cols[compIdx] : "",
    bidLow: bidLowIdx >= 0 ? cols[bidLowIdx] : "",
    bidHigh: bidHighIdx >= 0 ? cols[bidHighIdx] : "",
  })
}

// numeric-aware sort by volume desc ("1K–10K" ranges or "480" exact)
const volNum = (v: string) => {
  const m = v.replace(/\s/g, "").replace("–", "-")
  const range = m.match(/^(\d+(?:\.\d+)?)(K?)-?(\d+(?:\.\d+)?)(K?)$/i)
  if (range) {
    const lo = parseFloat(range[1]) * (range[2].toUpperCase() === "K" ? 1000 : 1)
    const hi = parseFloat(range[3]) * (range[4].toUpperCase() === "K" ? 1000 : 1)
    return (lo + hi) / 2
  }
  const n = parseFloat(m.replace(/K$/i, "000"))
  return Number.isFinite(n) ? n : 0
}

console.log("\nkeyword | avg monthly searches | competition | bid low | bid high")
for (const r of out.sort((a, b) => volNum(b.vol) - volNum(a.vol))) {
  console.log(`${r.kw} | ${r.vol} | ${r.comp} | ${r.bidLow} | ${r.bidHigh}`)
}
console.log(`\nrows: ${out.length}`)
