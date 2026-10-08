import test from "node:test"
import assert from "node:assert/strict"
import {
  buildSiteChanges,
  classifyCommit,
  cleanSubject,
  filterCommits,
  summarizeSiteChanges,
} from "../reporting/changes"
import type { GitHistoryCommit } from "../reporting/changes"

function makeCommit(over: Partial<GitHistoryCommit>): GitHistoryCommit {
  return {
    hash: "abc1234",
    date: "2026-10-06T10:00:00+03:00",
    subject: "feat(content): näidis",
    files: [{ s: "M", p: "lib/reporting/generate.ts" }],
    ...over,
  }
}

/* ---------- filterCommits: aken (since, until] ---------- */

test("filterCommits: since on välja jäetud, until kaasa arvatud", () => {
  const commits = [
    makeCommit({ hash: "a", date: "2026-10-03T06:00:00+03:00" }), // == since -> välja
    makeCommit({ hash: "b", date: "2026-10-05T12:00:00+03:00" }),
    makeCommit({ hash: "c", date: "2026-10-10T06:00:00+03:00" }), // == until -> sees
    makeCommit({ hash: "d", date: "2026-10-10T06:00:01+03:00" }), // > until -> välja
  ]
  const out = filterCommits(commits, "2026-10-03T06:00:00+03:00", "2026-10-10T06:00:00+03:00")
  assert.deepEqual(out.map((c) => c.hash), ["b", "c"])
})

/* ---------- classifyCommit: blog > content > seo > technical ---------- */

test("classifyCommit: prepared/posts + blogi generated failid -> blog", () => {
  assert.equal(
    classifyCommit(makeCommit({ files: [{ s: "A", p: "wordpress_migration/prepared/posts/post-9003.json" }] })),
    "blog",
  )
  assert.equal(classifyCommit(makeCommit({ files: [{ s: "M", p: "app/(et)/blog/posts.generated.ts" }] })), "blog")
})

test("classifyCommit: lehe definitsioonid, messages ja komponendid -> content", () => {
  assert.equal(classifyCommit(makeCommit({ files: [{ s: "M", p: "lib/pages/definitions/hoolduskoristus.ts" }] })), "content")
  assert.equal(classifyCommit(makeCommit({ files: [{ s: "M", p: "messages/et.json" }] })), "content")
  assert.equal(classifyCommit(makeCommit({ files: [{ s: "M", p: "app/components/templates/ServiceDetailTemplate.tsx" }] })), "content")
})

test("classifyCommit: proxy/next.config/sitemap -> seo", () => {
  assert.equal(classifyCommit(makeCommit({ files: [{ s: "M", p: "proxy.ts" }] })), "seo")
  assert.equal(classifyCommit(makeCommit({ files: [{ s: "M", p: "next.config.ts" }] })), "seo")
  assert.equal(classifyCommit(makeCommit({ files: [{ s: "M", p: "app/sitemap.ts" }] })), "seo")
})

test("classifyCommit: blog võidab contenti üle (posts.generated + messages samas commitis)", () => {
  assert.equal(
    classifyCommit(makeCommit({ files: [
      { s: "M", p: "app/(et)/blog/posts.generated.ts" },
      { s: "M", p: "messages/et.json" },
    ] })),
    "blog",
  )
})

test("classifyCommit: ülejäänud (nt reporting/sisu-tehnika) -> technical", () => {
  assert.equal(classifyCommit(makeCommit({ files: [{ s: "M", p: "lib/reporting/insights.ts" }] })), "technical")
  assert.equal(classifyCommit(makeCommit({ files: [{ s: "M", p: "scripts/i18n-validate.ts" }] })), "technical")
})

/* ---------- cleanSubject ---------- */

test("cleanSubject: eemaldab conventional-commit prefixi ja kapitaliseerib", () => {
  assert.equal(cleanSubject("feat(seo): avalehe H1/H2 geo-fookus"), "Avalehe H1/H2 geo-fookus")
  assert.equal(cleanSubject("fix(forms): päringu allika jälgimine"), "Päringu allika jälgimine")
})

test("cleanSubject: lõikab pika selgituse em-dash'i järel ära", () => {
  assert.equal(cleanSubject("feat(blog): kaks oktoobri artiklit — pikk selgitus detailidega"), "Kaks oktoobri artiklit")
})

test("cleanSubject: prefixita subject jääb alles, kapitaliseerituna", () => {
  assert.equal(cleanSubject("uuendatud hinnainfo"), "Uuendatud hinnainfo")
})

/* ---------- buildSiteChanges ---------- */

test("buildSiteChanges: grupid, count'id ja uute postituste dedupe", () => {
  const commits = [
    makeCommit({
      hash: "a",
      subject: "feat(blog): kaks artiklit — detailid",
      files: [{ s: "A", p: "wordpress_migration/prepared/posts/post-9003.json" }],
      newPosts: ["Mis on hoolduskoristus?"],
    }),
    makeCommit({
      hash: "b",
      subject: "feat(blog): sama postitus teisest harust",
      files: [{ s: "A", p: "wordpress_migration/prepared/posts/post-9003.json" }],
      newPosts: ["Mis on hoolduskoristus?"],
    }),
    makeCommit({ hash: "c", subject: "feat(content): hinnainfo uuendatud", files: [{ s: "M", p: "lib/pages/definitions/kontori-koristus.ts" }] }),
    makeCommit({ hash: "d", subject: "fix(ads): offline import", files: [{ s: "M", p: "lib/reporting/offline-conversions.ts" }] }),
  ]
  const out = buildSiteChanges(commits, "2026-10-01T00:00:00+03:00", "2026-10-08T00:00:00+03:00")
  assert.equal(out.commits, 4)
  assert.deepEqual(out.newBlogPosts, ["Mis on hoolduskoristus?"])
  assert.deepEqual(
    out.groups.map((g) => [g.key, g.count]),
    [["blog", 2], ["content", 1], ["technical", 1]],
  )
})

test("buildSiteChanges: tühi aken -> 0 commiti ja tühjad grupid", () => {
  const out = buildSiteChanges([], "2026-10-01T00:00:00+03:00", "2026-10-08T00:00:00+03:00")
  assert.equal(out.commits, 0)
  assert.deepEqual(out.groups, [])
  assert.deepEqual(out.newBlogPosts, [])
})

/* ---------- summarizeSiteChanges: ilma LLM-võtmeta null ---------- */

test("summarizeSiteChanges: ilma ANTHROPIC/DEEPSEEK võtmeta tagastab null", async () => {
  const prevAnthropic = process.env.ANTHROPIC_API_KEY
  const prevDeepseek = process.env.DEEPSEEK_API_KEY
  delete process.env.ANTHROPIC_API_KEY
  delete process.env.DEEPSEEK_API_KEY
  try {
    const changes = buildSiteChanges([makeCommit({})], "2026-10-01T00:00:00+03:00", "2026-10-08T00:00:00+03:00")
    assert.equal(await summarizeSiteChanges(changes), null)
  } finally {
    if (prevAnthropic !== undefined) process.env.ANTHROPIC_API_KEY = prevAnthropic
    if (prevDeepseek !== undefined) process.env.DEEPSEEK_API_KEY = prevDeepseek
  }
})
