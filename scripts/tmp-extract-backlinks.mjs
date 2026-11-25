// TEMP: extract spsgrupp.ee links from a saved HTML file and probe them live
import { readFileSync } from "node:fs"

const html = readFileSync(process.argv[2], "utf-8")
const re = /https?:\/\/(?:www\.)?spsgrupp\.ee[^"'\\<\s]*/g
const found = new Set((html.match(re) ?? []).map((u) => u.replace(/&amp;.*$/, "")))
const urls = [...found].map((u) => decodeURIComponent(u))
console.log("spsgrupp.ee links found:", urls.length)
for (const u of urls) console.log("  LINK:", u)

for (const u of urls) {
  let cur = u
  const chain = []
  for (let i = 0; i < 6; i++) {
    try {
      const r = await fetch(cur, {
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SPS-SEO-audit/1.0)" },
        signal: AbortSignal.timeout(15000),
      })
      chain.push(r.status)
      const loc = r.headers.get("location")
      await r.arrayBuffer().catch(() => {})
      if (r.status >= 300 && r.status < 400 && loc) {
        cur = new URL(loc, cur).toString()
        continue
      }
      break
    } catch (e) {
      chain.push("ERR:" + (e instanceof Error ? e.message : String(e)))
      break
    }
  }
  console.log(chain.join(">"), "=>", cur)
  await new Promise((r) => setTimeout(r, 400))
}
