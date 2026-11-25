// TEMP: list live blog posts from posts.generated.ts (structure: id, title, slug, date)
import { readFileSync } from "node:fs"

const s = readFileSync("app/(et)/blog/posts.generated.ts", "utf-8")
const re = /"id":\s*(\d+),\s*"title":\s*"((?:[^"\\]|\\.)*)",\s*"slug":\s*"([^"]+)",\s*"date":\s*"([^"]+)"/g
let m
const posts = []
while ((m = re.exec(s))) posts.push({ id: m[1], title: m[2], slug: m[3], date: m[4] })
console.log("LIVE posts:", posts.length)
for (const p of posts) console.log(`${p.date.slice(0, 10)} | ${p.slug} | ${p.title.slice(0, 85)}`)

// For the two debated topics, show which posts carry them + their internal links
const topics = [
  ["koristusfirma valimine / valik", /koristusfirma valim|usaldusväärs\w* koristusfirm|valida koristusfirm/i],
  ["hinnakiri / hind", /hinnakiri|kui palju maksab|orienteeruvad hinnad/i],
]
for (const [label, rx] of topics) {
  console.log(`\n=== ${label} ===`)
  const chunks = s.split(/\n  \},\n  \{/)
  for (const c of chunks) {
    const sm = c.match(/"slug":\s*"([^"]+)"/)
    const tm = c.match(/"title":\s*"((?:[^"\\]|\\.)*)"/)
    if (!sm) continue
    if (rx.test(c)) {
      const h2s = [...c.matchAll(/<h2>([^<]{0,90})/g)].map((h) => h[1]).slice(0, 8)
      console.log(`- ${sm[1]} | ${tm ? tm[1].slice(0, 70) : ""}`)
      for (const h of h2s) console.log(`    H2: ${h}`)
    }
  }
}
