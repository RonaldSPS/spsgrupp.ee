#!/usr/bin/env node
/**
 * Generate data/git-history.json for the weekly report's "Lehekülje arendus"
 * section. Runs automatically before `next build` (prebuild) and `next dev`
 * (predev) — the deployed serverless bundle then carries the git history of
 * everything that is LIVE, and lib/reporting/changes.ts filters the window
 * between two reports.
 *
 * Only deployed (built) commits can appear in the report — undeployed commits
 * are not on the live site and must not be promised to the client.
 *
 * Per commit: hash, committer date, subject and changed files (name-status).
 * For newly added blog posts (wordpress_migration/prepared/posts/post-*.json)
 * the Estonian title is resolved from the JSON on disk, so the report can
 * name the published articles.
 *
 * Never fails the build. If `git log` fails (observed in Vercel build
 * containers), the committed git-history.json is kept AND the deployed
 * commit is synthesized from VERCEL_GIT_COMMIT_SHA/MESSAGE env vars —
 * otherwise the report always misses the newest commit, because the
 * committed file structurally cannot contain the commit it is part of
 * (this exact gap hid the whole 26.10.2026 deploy from the 30.10 report).
 */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const MAX_COMMITS = 300
const MAX_FILES_PER_COMMIT = 30
const OUT_FILE = path.join(process.cwd(), "data", "git-history.json")
const POST_FILE_RE = /^wordpress_migration\/prepared\/posts\/post-\d+\.json$/

/** Read the Estonian title of a prepared blog post JSON (best effort). */
function readPostTitle(relPath) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), relPath), "utf-8")
    const parsed = JSON.parse(raw)
    return typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : null
  } catch {
    return null
  }
}

function main() {
  const SEP = "\x1e" // record separator between commits
  const FIELD = "\x1f" // field separator inside the header line
  const log = execFileSync(
    "git",
    ["log", "--no-merges", `-n`, String(MAX_COMMITS), `--pretty=format:${SEP}%h${FIELD}%H${FIELD}%cI${FIELD}%s`, "--name-status"],
    { encoding: "utf-8", maxBuffer: 32 * 1024 * 1024 },
  )

  const commits = []
  for (const record of log.split(SEP)) {
    const trimmed = record.trim()
    if (!trimmed) continue
    const lines = trimmed.split(/\r?\n/)
    const header = lines[0].split(FIELD)
    if (header.length < 4) continue
    const [short, hash, date, subject] = header
    const files = []
    let filesTruncated = false
    const newPosts = []
    for (const line of lines.slice(1)) {
      if (!line.trim()) continue
      const parts = line.split("\t")
      const status = parts[0]
      // Renames: "R100\told\tnew" — track the new path.
      const filePath = status.startsWith("R") ? parts[2] : parts[1]
      if (!filePath) continue
      if (files.length < MAX_FILES_PER_COMMIT) files.push({ s: status[0], p: filePath })
      else filesTruncated = true
      if (status[0] === "A" && POST_FILE_RE.test(filePath)) {
        newPosts.push(readPostTitle(filePath) ?? path.basename(filePath, ".json"))
      }
    }
    commits.push({ hash: short || hash.slice(0, 7), date, subject, files, ...(filesTruncated ? { filesTruncated: true } : {}), ...(newPosts.length ? { newPosts } : {}) })
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), commits }, null, 1), "utf-8")
  console.log(`git-history: ${commits.length} commits -> ${path.relative(process.cwd(), OUT_FILE)}`)
}

try {
  main()
} catch (error) {
  // Never break the build. On Vercel `git log` can fail in the build container
  // (observed 23.10.2026 — and silently again 26.–30.10.2026, when the weekly
  // report's "Lehekülje arendus" section missed the entire 26.10 deploy commit).
  // The committed git-history.json is the fallback, but it can never contain
  // the commit it is committed in (one-commit lag). Close the gap: synthesize
  // the deployed commit from Vercel's build env vars and merge it on top of
  // the committed file. Date = build time (Vercel builds right after the push).
  console.error("git-history generation failed (non-fatal):", error instanceof Error ? error.message : error)
  try {
    synthesizeDeployedCommit()
  } catch (fallbackError) {
    console.error("git-history VERCEL_GIT_* fallback failed (non-fatal):", fallbackError instanceof Error ? fallbackError.message : fallbackError)
  }
}

/**
 * Vercel build fallback: prepend the deployed commit (from VERCEL_GIT_* env)
 * to the committed git-history.json so the weekly report never misses the
 * deploy's own commit. No file list is available without git — the commit is
 * classified by the report's subject heuristics (classifyCommit falls back to
 * "technical" without files; still far better than silently dropping it).
 */
function synthesizeDeployedCommit() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA
  const message = process.env.VERCEL_GIT_COMMIT_MESSAGE
  if (!sha || !message) return // not a Vercel build — keep previous behaviour
  const short = sha.slice(0, 7)
  const subject = message.split("\n")[0].trim()
  if (!subject) return

  let existing = { generatedAt: "", commits: [] }
  try {
    existing = JSON.parse(fs.readFileSync(OUT_FILE, "utf-8"))
    if (!Array.isArray(existing?.commits)) existing.commits = []
  } catch {
    /* no previous file — start from just this commit */
  }
  if (existing.commits.some((c) => c.hash === short || c.hash === sha)) {
    console.log(`git-history: deployed commit ${short} already present, no fallback needed`)
    return
  }
  const synthetic = { hash: short, date: new Date().toISOString(), subject, files: [], synthetic: true }
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify({ generatedAt: new Date().toISOString(), commits: [synthetic, ...existing.commits] }, null, 1),
    "utf-8",
  )
  console.log(`git-history: git unavailable — prepended deployed commit ${short} from VERCEL_GIT_* (${existing.commits.length} commits kept)`)
}
