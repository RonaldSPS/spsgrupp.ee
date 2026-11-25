// TEMP: inspect how the Geenius article references the koristajavahetus image
import { writeFileSync } from "node:fs"

const u = "https://geenius.delfi.ee/artikkel/120475063/koristaja-vahetus-kas-sellel-on-pointi"
const r = await fetch(u, { signal: AbortSignal.timeout(30000), headers: { "User-Agent": "Mozilla/5.0" } })
const html = await r.text()
writeFileSync("tmp/geenius-article.html", html)
console.log("article status:", r.status, "| bytes:", html.length)

const re = /[^\s"'<>]*koristaj[^\s"'<>]*/gi
const found = new Set(html.match(re) ?? [])
console.log("koristaj* refs:")
for (const f of [...found].slice(0, 25)) console.log(" ", f.slice(0, 180))

// any img src pointing to spsgrupp.ee at all?
const imgs = new Set(html.match(/https?:\/\/(?:www\.)?spsgrupp\.ee[^\s"'<>]*/g) ?? [])
console.log("spsgrupp.ee refs in article:")
for (const f of [...imgs].slice(0, 25)) console.log(" ", f.slice(0, 180))
