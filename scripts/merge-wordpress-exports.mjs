import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const root = process.argv[2] || "wordpress_migration"
const newerRoot = join(root, "newer")
const olderRoot = join(root, "older")
const preparedRoot = join(root, "prepared")

function readPosts(directory) {
  return readdirSync(join(directory, "posts"))
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(join(directory, "posts", name), "utf8")))
}

function languageFor(post) {
  return /[\u0400-\u04ff]/.test(`${post.title} ${post.contentHtml}`) ? "ru" : "et"
}

const newerPosts = readPosts(newerRoot)
const olderPosts = readPosts(olderRoot)
const newerById = new Map(newerPosts.map((post) => [post.id, post]))
const olderById = new Map(olderPosts.map((post) => [post.id, post]))
const newerOnly = newerPosts.filter((post) => !olderById.has(post.id))
const olderOnly = olderPosts.filter((post) => !newerById.has(post.id))
const shared = newerPosts.filter((post) => olderById.has(post.id))

const merged = [...newerPosts, ...olderOnly]
  .map((post) => ({
    ...post,
    language: languageFor(post),
    migrationStatus: post.contentStatus === "image-only" ? "excluded-image-only" : "ready",
  }))
  .sort((a, b) => b.date.localeCompare(a.date))

const changedShared = shared.map((newer) => {
  const older = olderById.get(newer.id)
  const changes = []
  if (newer.title !== older.title) changes.push("title")
  if (newer.slug !== older.slug) changes.push("slug")
  if (newer.featuredImage !== older.featuredImage) changes.push("featuredImage")
  if (newer.contentHtml !== older.contentHtml) changes.push("content")
  return { id: newer.id, title: newer.title, changes }
}).filter((post) => post.changes.length)

if (existsSync(preparedRoot)) rmSync(preparedRoot, { recursive: true, force: true })
mkdirSync(join(preparedRoot, "posts"), { recursive: true })
cpSync(join(olderRoot, "media"), join(preparedRoot, "media"), { recursive: true })
cpSync(join(newerRoot, "media"), join(preparedRoot, "media"), { recursive: true, force: true })

for (const post of merged) {
  writeFileSync(join(preparedRoot, "posts", `post-${post.id}.json`), `${JSON.stringify(post, null, 2)}\n`)
}

const report = {
  strategy: "Use the May 22, 2023 version for shared IDs and retain posts found only in the January 11, 2022 backup.",
  totals: {
    older: olderPosts.length,
    newer: newerPosts.length,
    shared: shared.length,
    newerOnly: newerOnly.length,
    olderOnly: olderOnly.length,
    prepared: merged.length,
  },
  featuredImages: {
    wordpress: merged.filter((post) => post.featuredImageSource === "wordpress").length,
    inferred: merged.filter((post) => post.featuredImageSource === "first-content-image").length,
    missing: merged.filter((post) => !post.featuredImage).map((post) => post.id),
  },
  content: {
    ready: merged.filter((post) => post.migrationStatus === "ready").length,
    excludedImageOnly: merged.filter((post) => post.migrationStatus === "excluded-image-only").map((post) => post.id),
    shortcodeRemainders: merged.filter((post) => /\[\/?[A-Za-z][^\]]*\]/.test(post.contentHtml)).map((post) => post.id),
    quoteFormRemainders: merged.filter((post) => /contact-form-7|K[üu]si hinnapakkumist|Kirjelda oma soove helistades/i.test(post.contentHtml)).map((post) => post.id),
    missingMedia: merged.filter((post) => post.missingMedia.length).map((post) => ({ id: post.id, paths: post.missingMedia })),
  },
  languages: {
    et: merged.filter((post) => post.language === "et").length,
    ru: merged.filter((post) => post.language === "ru").map((post) => post.id),
  },
  olderOnly: olderOnly.map(({ id, title }) => ({ id, title })),
  newerOnly: newerOnly.map(({ id, title }) => ({ id, title })),
  changedShared,
  posts: merged.map(({ id, title, slug, date, language, featuredImage, featuredImageSource, contentStatus, migrationStatus }) => ({
    id, title, slug, date, language, featuredImage, featuredImageSource, contentStatus, migrationStatus,
  })),
}

writeFileSync(join(preparedRoot, "index.json"), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report))
