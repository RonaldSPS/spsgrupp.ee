// TEMP: verify ahrefs verification file serving + regression checks on local dev server
const H = "ahrefs_2ae9e0a6a62f9cacfe92ed8b96833c48bf760c6383c595c719c17a0f4a2c7d1b"
const B = process.env.PROBE_BASE ?? "http://localhost:3100"
const cases = [
  ["/" + H + ".html", "token"],
  ["/" + H, "token"],
  ["/", "page"],
  ["/koristusteenus/", "page"],
  ["/hoolduskoristus", "redirect"],
]
let fail = 0
for (const [p, kind] of cases) {
  let cur = B + p
  const hops = []
  let body = ""
  for (let i = 0; i < 5; i++) {
    try {
      const r = await fetch(cur, { redirect: "manual", signal: AbortSignal.timeout(30000) })
      hops.push(r.status)
      const loc = r.headers.get("location")
      const t = await r.text()
      if (r.status >= 300 && r.status < 400 && loc) {
        cur = new URL(loc, cur).toString()
        continue
      }
      body = t
      break
    } catch (e) {
      hops.push("ERR:" + (e instanceof Error ? e.message : String(e)).slice(0, 60))
      break
    }
  }
  let ok
  if (kind === "token") ok = hops[hops.length - 1] === 200 && body.includes("ahrefs-site-verification")
  else if (kind === "redirect") ok = hops[hops.length - 1] === 200 && hops.length > 1
  else ok = hops.length === 1 && hops[0] === 200 && body.length > 1000
  if (!ok) fail++
  console.log(`${ok ? "OK  " : "FAIL"} [${hops.join(">")}] ${p}${kind === "token" ? (body.includes("ahrefs-site-verification") ? " (token OK)" : " (BODY: " + body.slice(0, 100).replace(/\n/g, " ") + ")") : ""}`)
}
console.log(fail === 0 ? "ALL PASS" : fail + " FAILURES")
process.exitCode = fail ? 1 : 0
