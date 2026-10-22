// One-off: replace the 800 m² contract minimum with 600 m² across site content (ET/EN/RU).
// Exact-phrase replacements only (never blind "800" — RU has "2800 студентами" in a case study).
import { readFileSync, writeFileSync } from "node:fs"

const FILES = [
  "lib/pages/definitions/hoolduskoristus.ts",
  "app/_pages/koristusteenus/kontori-koristus/page.tsx",
  "app/_pages/koristusteenus/kontori-koristus/layout.tsx",
  "lib/metadata-registry.ts",
  "messages/et.json",
  "messages/en.json",
  "messages/ru.json",
  "wordpress_migration/prepared/posts/post-9003.json",
  "wordpress_migration/prepared/posts/post-9004.json",
  "app/(et)/blog/posts.generated.ts",
]

const PAIRS = [
  ["800 m²", "600 m²"],
  ["800 м²", "600 м²"],
  ["alates 960 €", "alates 720 €"],
  ["from €960", "from €720"],
  ["от 960 EUR", "от 720 EUR"],
]

let total = 0
for (const f of FILES) {
  let s = readFileSync(f, "utf-8")
  let n = 0
  for (const [a, b] of PAIRS) {
    const count = s.split(a).length - 1
    if (count > 0) {
      s = s.split(a).join(b)
      n += count
    }
  }
  if (n > 0) {
    writeFileSync(f, s, "utf-8")
    console.log(`${f}: ${n} asendust`)
    total += n
  }
}
console.log(`KOKKU: ${total}`)
// guard: nothing may reference 800 m² anymore
for (const f of FILES) {
  const s = readFileSync(f, "utf-8")
  if (/800\s*(m²|м²)/.test(s)) console.log(`HOIATUS: ${f} sisaldab veel 800 m²`)
}
console.log("guard ok")
