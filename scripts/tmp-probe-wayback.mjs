// TEMP: probe every Wayback-archived spsgrupp.ee URL against the live site.
// Finds legacy URLs that still 404 (incl. ones invisible to GSC searchAnalytics).
// Run: node scripts/tmp-probe-wayback.mjs
import { readFileSync, writeFileSync } from "node:fs"

const raw = readFileSync("tmp/wayback-urls.txt", "utf-8").trim().split("\n")
const SKIP = [/^\/wp-content\//, /^\/wp-includes\//, /^\/wp-json/, /^\/xmlrpc/, /^\/feed/, /\.(css|js|png|jpe?g|gif|svg|webp|pdf|ico|xml|txt|woff2?|ttf|eot)(\?|$)/i, /^\/wp-admin/]

const paths = new Map() // decoded path -> example original
for (const line of raw) {
  let u
  try {
    u = new URL(line.trim())
  } catch {
    continue
  }
  let p = decodeURIComponent(u.pathname)
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1)
  if (!p || p === "") p = "/"
  if (SKIP.some((re) => re.test(p))) continue
  if (!paths.has(p)) paths.set(p, line.trim())
}
console.log(`unique content paths to probe: ${paths.size}`)

async function probe(path) {
  let cur = "https://spsgrupp.ee" + (path === "/" ? "/" : path)
  const hops = []
  for (let i = 0; i < 6; i++) {
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
const queue = [...paths.keys()]
const CONCURRENCY = 3
async function worker() {
  for (;;) {
    const p = queue.shift()
    if (p === undefined) return
    try {
      const r = await probe(p)
      results.push({ path: p, ...r })
    } catch (e) {
      results.push({ path: p, status: -1, hops: [], final: "", error: e instanceof Error ? e.message : String(e) })
    }
    if (results.length % 50 === 0) console.log(`probed ${results.length}/${paths.size}`)
    await new Promise((r) => setTimeout(r, 250))
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

// retry pass for 403s (WAF rate-limit) with slower pacing
const blocked = results.filter((r) => r.status === 403)
if (blocked.length) {
  console.log(`retrying ${blocked.length} WAF-blocked (403) URLs slowly...`)
  for (const r of blocked) {
    await new Promise((res) => setTimeout(res, 1500))
    try {
      const rr = await probe(r.path)
      Object.assign(r, rr)
    } catch {}
  }
}

const by = {}
for (const r of results) by[r.status] = (by[r.status] ?? 0) + 1
console.log("\nstatus counts:", by)

const fourOhFour = results.filter((r) => r.status === 404).sort((a, b) => a.path.localeCompare(b.path))
console.log(`\n=== 404 (${fourOhFour.length}) ===`)
for (const r of fourOhFour) console.log(`${r.hops.join(">")}  ${r.path}`)

writeFileSync("tmp/wayback-probe.json", JSON.stringify(results, null, 1))
console.log("\nwrote tmp/wayback-probe.json")
