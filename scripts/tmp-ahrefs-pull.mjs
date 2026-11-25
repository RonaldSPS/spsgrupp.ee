// TEMP: pull Ahrefs all-backlinks report and analyze link-target health.
// Saves raw JSON to tmp/ahrefs-backlinks.json, prints per-link target status
// (ahrefs crawl-time) + probes every target against the live site (today).
import { readFileSync, existsSync, writeFileSync } from "node:fs"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq === -1) continue
    const k = t.slice(0, eq).trim()
    const v = t.slice(eq + 1).trim()
    if (k && process.env[k] === undefined) process.env[k] = v
  }
}
loadEnvLocal()

const TOKEN = process.env.AHREFS_API_TOKEN
if (!TOKEN) throw new Error("AHREFS_API_TOKEN not set")

const LIMIT = process.env.AHREFS_LIMIT ?? "50"
const url =
  "https://api.ahrefs.com/v3/site-explorer/all-backlinks?history=live&limit=" +
  LIMIT +
  "&order_by=traffic%3Adesc%2Curl_rating_source%3Adesc&select=url_from%2Clink_group_count%2Ctitle%2Clanguages%2Cpowered_by%2Clink_type%2Credirect_code%2Cfirst_seen_link%2Clost_reason%2Cdrop_reason%2Chttp_code%2Cdiscovered_status%2Csource_page_author%2Cis_dofollow%2Cis_nofollow%2Cis_ugc%2Cis_sponsored%2Cis_content%2Cdomain_rating_source%2Ctraffic_domain%2Cis_root_source%2Cis_spam%2Croot_name_source%2Ctraffic%2Cpositions%2Clinked_domains_source_page%2Clinks_external%2Cpage_type_source%2Cpage_category_source%2Curl_rating_source%2Clast_visited%2Crefdomains_source%2Csnippet_left%2Canchor%2Csnippet_right%2Curl_to%2Cjs_crawl%2Chttp_crawl%2Credirect_kind%2Curl_redirect%2Cbroken_redirect_source%2Cbroken_redirect_new_target%2Cbroken_redirect_reason%2Clast_seen&target=spsgrupp.ee%2F"

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" },
  signal: AbortSignal.timeout(60000),
})
if (!res.ok) {
  console.error(`ahrefs -> ${res.status}: ${(await res.text()).slice(0, 400)}`)
  process.exit(1)
}
const data = await res.json()
const links = data.links ?? data.backlinks ?? []
writeFileSync("tmp/ahrefs-backlinks.json", JSON.stringify(data, null, 1))
console.log(`pulled ${links.length} backlinks (limit ${LIMIT}) -> tmp/ahrefs-backlinks.json`)

async function probe(u) {
  let cur = u
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

console.log("\nDR  traf  follow  ahrefs_http  live_now  anchor -> url_to")
for (const l of links) {
  const target = l.url_to
  let live = "?"
  try {
    const p = await probe(target)
    live = p.hops.length > 1 ? `${p.hops.join(">")}=>${new URL(p.final).pathname}` : String(p.status)
  } catch (e) {
    live = "ERR"
  }
  const anchor = (l.anchor ?? "").slice(0, 28)
  const to = target.replace("https://spsgrupp.ee", "").replace("https://www.spsgrupp.ee", "") || "/"
  console.log(
    `${String(l.domain_rating_source ?? "").padStart(3)} ${String(Math.round(l.traffic ?? 0)).padStart(5)} ${l.is_dofollow ? "follow " : "nofollow"} ${String(l.http_code ?? "-").padStart(5)}      ${live.padEnd(44)} ${anchor} -> ${to.slice(0, 60)}`,
  )
  await new Promise((r) => setTimeout(r, 250))
}
