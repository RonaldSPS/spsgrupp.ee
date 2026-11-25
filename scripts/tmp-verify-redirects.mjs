// TEMP: verify the 2026-09-30 legacy-redirect block against a local dev server.
// Run: node scripts/tmp-verify-redirects.mjs
const BASE = process.env.PROBE_BASE ?? "http://localhost:3100"

const CASES = [
  // [path, expected final path after redirects]
  ["/teenused/eripuhastustood/ehitusjargne-koristus-ja-puhastus", "/puhastusteenused/ehitusjargne-koristus/"],
  ["/teenused/hoolduskoristus/tootmishoonete-koristus", "/koristusteenus/tootmishoonete-koristus/"],
  ["/teenused/midagi-uut", "/koristusteenus/"], // wildcard fallback
  ["/eripuhastustood/vaipade-puhastus", "/puhastusteenused/vaipade-puhastus/"],
  ["/puhastusteenused/eripuhastustood/ehitusjargne-koristus-ja-puhastus", "/puhastusteenused/ehitusjargne-koristus/"],
  ["/puhastusteenused/hoolduskoristus/kontori-koristus-koristusteenused-buroos-ja-kontoris", "/koristusteenus/kontori-koristus/"],
  ["/hoolduskoristus", "/koristusteenus/hoolduskoristus/"],
  ["/koristusfirma", "/"],
  ["/lao-ja-tootmishoonete-koritus", "/koristusteenus/tootmishoonete-koristus/"],
  ["/blog/2011/10/19/hoolduskoristus-kontoris", "/blog/"],
  ["/blog/2011/11/11/“5-nouannet-kui-valida-kontorisse-vaipkatet”", "/blog/"], // curly quotes - encoded-path wildcard
  ["/blog/tag/aknapesu", "/blog/"],
  ["/2017/10", "/blog/"],
  ["/valikoristus/muru-hooldus", "/koristusteenus/valikoristus/"], // was 308>308>404
  ["/koristusteenused/kontori-koristus-koristusteenused-buroos-ja-kontoris", "/koristusteenus/kontori-koristus/"], // was 308>308>308>404
  ["/ru/новости", "/ru/"],
  ["/ru/повышает-ли-фирма-по-уборке-цены", "/blog/miks-puhastusteenuste-hinnad-tousevad/"],
  ["/ru/faq-items/если-в-нашей-компании-возникают-особы", "/ru/"],
  ["/en/private-cleaning-services-for-business-clients-professional-cleaning-services-in-harjumaa-estonia/deep-cleaning-of-escalators", "/en/specialist-cleaning-services/escalator-deep-cleaning/"],
  ["/soovin-pakkumist", "/kontakt/"],
  ["/sps-grupp-partnerina/koostoopartnerid", "/sps-grupp/"],
  // regressions: must serve directly, no redirect
  ["/koristusteenus/kontori-koristus/", "DIRECT"],
  ["/blog/kaheksa-kusimust-enne-koristuslepingu-solmimist/", "DIRECT"],
  ["/sps-grupp/", "DIRECT"],
  ["/kontorikoristus", "/koristusteenus/kontori-koristus/"], // pre-existing rule still works
]

let fail = 0
for (const [path, expected] of CASES) {
  let cur = BASE + path
  const hops = []
  let finalUrl = cur
  for (let i = 0; i < 6; i++) {
    try {
      const r = await fetch(cur, { redirect: "manual", signal: AbortSignal.timeout(20000) })
      hops.push(r.status)
      const loc = r.headers.get("location")
      await r.arrayBuffer().catch(() => {})
      if (r.status >= 300 && r.status < 400 && loc) {
        cur = new URL(loc, cur).toString()
        finalUrl = cur
        continue
      }
      finalUrl = cur
      break
    } catch (e) {
      hops.push("ERR")
      finalUrl = "ERR " + (e instanceof Error ? e.message : String(e))
      break
    }
  }
  const finalPath = finalUrl.startsWith(BASE) ? finalUrl.slice(BASE.length) : finalUrl
  const lastStatus = hops[hops.length - 1]
  let ok
  if (expected === "DIRECT") ok = hops.length === 1 && lastStatus === 200
  else ok = lastStatus === 200 && (finalPath === expected || finalPath === expected.slice(0, -1))
  if (!ok) fail++
  console.log(`${ok ? "OK  " : "FAIL"} [${hops.join(">")}] ${decodeURIComponent(path)} -> ${decodeURIComponent(finalPath)}${ok ? "" : `  (expected ${expected})`}`)
}
console.log(fail === 0 ? "\nALL PASS" : `\n${fail} FAILURES`)
process.exitCode = fail === 0 ? 0 : 1
