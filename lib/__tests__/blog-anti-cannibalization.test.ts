import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

/**
 * Blogi kanibaliseerimise tõke (kliendi direktiiv 23.10.2026: ajastatud
 * blogipostitused ei tohi teenuselehti kannibaliseerida — nt 05.10 postitus
 * „Hoolduskoristus – mis see…" varjutas /koristusteenus/hoolduskoristus/
 * teenuselehe GSC-s).
 *
 * Reeglid kehtivad UUTELE postitustele (id >= 9003, GBP-kalendri ajastu):
 *  1. Pealkiri EI TOHI alata teenuselehe tuumikmärksõnaga (nominatiiv +
 *     tühik/koolon/kriips/küsimärk/lõpp) — teenuseleht peab jääma ainsaks
 *     leheks, mis tuumiktermindile „omistab". Infomustrid („Mis on…",
 *     „Kuidas…", „Kui palju maksab…") või sõnavormid (genitiiv
 *     „Lumekoristuse leping") on lubatud.
 *  2. Igal postitusel peab olema teenuselehe-link ESIMESE 500 tähemärgi
 *     sees (intro suunab otsingujõu teenuselehele, mitte ei konkureeri sellega).
 *
 * Klassikalised WP-migratsiooni postitused (id < 9003) on reeglist väljas —
 * need on juba indekseeritud ja nende muutmine pole otstarbekas.
 */

const POSTS_DIR = join(process.cwd(), "wordpress_migration", "prepared", "posts")
const INDEX_PATH = join(process.cwd(), "wordpress_migration", "prepared", "index.json")

/** Teenuselehtede tuumikmärksõnad (nominatiiv), millega pealkiri ei tohi ALATA. */
const HEAD_TERMS = [
  "hoolduskoristus",
  "koristusfirma",
  "kontori koristus",
  "suurpuhastus",
  "lumekoristus",
  "eskalaatorite süvapuhastus",
  "akende pesu",
  "fassaadipesu",
  "koristusteenus",
  "puhastusteenused",
  "ehitusjärgne koristus",
  "kaubanduspindade koristus",
  "trepikodade koristus",
  "põrandate hooldus",
]

/** Teenuselehe/hubi link: avaleht, koristusteenus- või puhastusteenused-puu. */
const SERVICE_LINK_RE = /href="(\/|\/koristusteenus[^"]*|\/puhastusteenused[^"]*)"/

interface PreparedIndex {
  posts: { id: number; migrationStatus?: string; language?: string }[]
}

interface PreparedPost {
  id: number
  title: string
  contentHtml: string
}

function newEraPosts(): PreparedPost[] {
  const index = JSON.parse(readFileSync(INDEX_PATH, "utf8")) as PreparedIndex
  const out: PreparedPost[] = []
  for (const entry of index.posts) {
    if (entry.id < 9003) continue
    if (entry.migrationStatus !== "ready" || entry.language !== "et") continue
    const file = join(POSTS_DIR, `post-${entry.id}.json`)
    if (!existsSync(file)) continue
    out.push(JSON.parse(readFileSync(file, "utf8")) as PreparedPost)
  }
  return out
}

/** Tõsi, kui pealkiri ALGAB tuumikmärksõnaga (nominatiiv + eraldaja/lõpp). */
function startsWithHeadTerm(title: string): string | null {
  const t = title.trim().toLowerCase()
  for (const term of HEAD_TERMS) {
    if (!t.startsWith(term)) continue
    const next = t.charAt(term.length)
    if (next === "" || next === " " || next === ":" || next === "–" || next === "-" || next === "?") return term
  }
  return null
}

const posts = newEraPosts()

test("kanibaliseerimise tõke: vähemalt üks uue ajastu postitus on kontrolli all", () => {
  assert.ok(posts.length > 0, "ühtegi id >= 9003 postitust ei leitud — kas index.json on muutunud?")
})

for (const post of posts) {
  test(`post ${post.id}: pealkiri ei alata teenuselehe tuumikmärksõnaga („${post.title.slice(0, 60)}")`, () => {
    const hit = startsWithHeadTerm(post.title)
    assert.equal(
      hit,
      null,
      `pealkiri algab tuumikmärksõnaga „${hit}" — teenuselehe kannibaliseerimise risk; kasuta infomustrit (nt „Mis on …" / „Kuidas …") või sõnavormi`,
    )
  })

  test(`post ${post.id}: teenuselehe link esimese 500 tähemärgi sees`, () => {
    assert.ok(
      SERVICE_LINK_RE.test(post.contentHtml.slice(0, 500)),
      "intro peab linkima teenuselehele (/koristusteenus/…, /puhastusteenused/… või /) — muidu konkureerib postitus teenuselehega, mitte ei toeta seda",
    )
  })
}
