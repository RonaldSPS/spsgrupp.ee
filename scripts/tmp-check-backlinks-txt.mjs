// TEMP: extract every spsgrupp.ee target URL from the Ahrefs backlinks dump and
// probe each against the live site. Writes tmp/backlinks-check.json.
import { readFileSync, writeFileSync } from "node:fs"

const raw = readFileSync("D:/WORKS/SPS/backlinks.txt", "utf-8")

// find spsgrupp.ee URLs (stop at whitespace / quote / & )
const matches = [...raw.matchAll(/https?:\/\/(?:www\.)?spsgrupp\.ee[^\s"&)\\]*/g)]
const urls = new Map() // cleaned url -> count of occurrences
for (const m of matches) {
  let u = m[0].replace(/[&\\]+$/, "").replace(/\/+$/, (s) => s)
  if (!urls.has(u)) urls.set(u, 0)
  urls.set(u, urls.get(u) + 1)
}
// normalize: strip trailing slash for dedup of probing (keep one canonical form)
const list = [...urls.keys()]
console.log(`unique spsgrupp.ee URLs in dump: ${list.length}`)

async function probe(url) {
  let cur = url
  const hops = []
  for (let i = 0; i < 8; i++) {
    const r = await fetch(cur, {
      redirect: "manual",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SPS-SEO-audit/1.0)" },
      signal: AbortSignal.timeout(15000),
    })
    hops.push(r.status)
    const loc = r.headers.get("location")
    await r.arrayBuffer().catch(() => {})
    if (r.status >= 300 && r.status < 400 && loc) {
      cur = new URL(loc, cur).toString()
      continue
    }
    return { status: r.status, hops, final: cur }
  }
  return { status: -2, hops, final: cur }
}

const results = []
const queue = [...list]
const CONCURRENCY = 3
async function worker() {
  for (;;) {
    const u = queue.shift()
    if (!u) return
    try {
      const p = await probe(u)
      results.push({ url: u, occurrences: urls.get(u), ...p })
    } catch (e) {
      results.push({ url: u, occurrences: urls.get(u), status: -1, hops: [], final: "", error: e.message })
    }
    await new Promise((r) => setTimeout(r, 250))
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

results.sort((a, b) => a.status - b.status || b.occurrences - a.occurrences)
writeFileSync("tmp/backlinks-check.json", JSON.stringify(results, null, 1))

const fails = results.filter((r) => r.status !== 200)
console.log(`\n=== PROBLEMS (${fails.length}) ===`)
for (const r of fails) console.log(`${r.status} [${r.hops.join(">")}] x${r.occurrences} ${decodeURIComponent(r.url)}`)
const redirected = results.filter((r) => r.status === 200 && r.hops.length > 1)
console.log(`\n=== OK via redirect (${redirected.length}) ===`)
for (const r of redirected) console.log(`[${r.hops.join(">")}] ${decodeURIComponent(r.url)}  ->  ${decodeURIComponent(r.final.replace("https://spsgrupp.ee", ""))}`)
const direct = results.filter((r) => r.status === 200 && r.hops.length === 1)
console.log(`\n=== OK direct 200 (${direct.length}) ===`)
for (const r of direct) console.log(`[200] ${decodeURIComponent(r.url)}`)
console.log(`\nTOTAL: ${results.length} | direct ${direct.length} | redirect ${redirected.length} | problems ${fails.length}`)
