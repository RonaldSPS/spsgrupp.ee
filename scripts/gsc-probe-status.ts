/**
 * Probe every URL from tmp/gsc-pages.json against the live site.
 * Records the redirect chain (status + location per hop, manual following).
 * Run: npx tsx scripts/gsc-probe-status.ts
 * Writes: tmp/gsc-pages-status.json
 */
import { readFileSync, writeFileSync } from "node:fs"

interface PageRow {
  page: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface Hop {
  url: string
  status: number
  location?: string
}

async function probe(url: string): Promise<{ hops: Hop[]; finalStatus: number; finalUrl: string; error?: string }> {
  // PROBE_BASE=http://localhost:3100 rewrites the origin for local-build checks
  const base = process.env.PROBE_BASE
  if (base) url = url.replace(/^https?:\/\/[^/]+/, base)
  const hops: Hop[] = []
  let current = url
  for (let i = 0; i < 8; i++) {
    let res: Response
    try {
      res = await fetch(current, {
        method: "GET",
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SPS-SEO-audit/1.0)" },
        signal: AbortSignal.timeout(15000),
      })
    } catch (err) {
      return { hops, finalStatus: -1, finalUrl: current, error: err instanceof Error ? err.message : String(err) }
    }
    const location = res.headers.get("location") ?? undefined
    hops.push({ url: current, status: res.status, location })
    // drain body to free the socket
    await res.arrayBuffer().catch(() => {})
    if (res.status >= 300 && res.status < 400 && location) {
      current = new URL(location, current).toString()
      continue
    }
    return { hops, finalStatus: res.status, finalUrl: current }
  }
  return { hops, finalStatus: -2, finalUrl: current, error: "too many redirects" }
}

async function main() {
  const inFile = process.env.GSC_IN ?? "tmp/gsc-pages.json"
  const data = JSON.parse(readFileSync(inFile, "utf-8")) as { pages: PageRow[] }
  const results: (PageRow & { hops: Hop[]; finalStatus: number; finalUrl: string; error?: string })[] = []
  const CONCURRENCY = 6
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const queue = [...data.pages]
  async function worker() {
    for (;;) {
      const row = queue.shift()
      if (!row) return
      const r = await probe(row.page)
      results.push({ ...row, ...r })
      if (results.length % 25 === 0) console.log(`probed ${results.length}/${data.pages.length}`)
      if (process.env.PROBE_DELAY_MS) await sleep(Number(process.env.PROBE_DELAY_MS))
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  results.sort((a, b) => b.impressions - a.impressions)
  const outFile = process.env.PROBE_OUT ?? "tmp/gsc-pages-status.json"
  writeFileSync(outFile, JSON.stringify(results, null, 1), "utf-8")

  // summary
  const by = (fn: (r: (typeof results)[number]) => boolean) => results.filter(fn)
  const s404 = by((r) => r.finalStatus === 404)
  const s403 = by((r) => r.finalStatus === 403)
  const err = by((r) => r.finalStatus === -1 || r.finalStatus === -2 || r.finalStatus >= 500)
  const redirected = by((r) => r.hops.length > 1 && r.finalStatus === 200)
  const ok = by((r) => r.hops.length === 1 && r.finalStatus === 200)
  console.log(`\n200 direct: ${ok.length}`)
  console.log(`redirect -> 200: ${redirected.length}`)
  console.log(`404: ${s404.length}`)
  console.log(`403 (blocked/rate-limited): ${s403.length}`)
  console.log(`errors/5xx: ${err.length}`)
  console.log("\n=== 404s (by impressions) ===")
  for (const r of s404) console.log(`${r.impressions}\t${r.clicks}\t${decodeURIComponent(r.page)}`)
  console.log("\n=== errors ===")
  for (const r of err) console.log(`${r.finalStatus}\t${r.error ?? ""}\t${decodeURIComponent(r.page)}`)
  console.log("\n=== redirect -> 404 (broken targets) ===")
  for (const r of s404.filter((r) => r.hops.length > 1))
    console.log(`${r.impressions}\t${decodeURIComponent(r.page)}  ->  ${decodeURIComponent(r.finalUrl)}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
