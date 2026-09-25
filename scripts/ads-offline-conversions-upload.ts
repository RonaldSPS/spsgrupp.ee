/**
 * Local runner for the automated offline-conversion upload (same code path as
 * the daily Vercel Cron at app/api/cron/offline-conversions).
 *
 * Usage:
 *   npm run report:offline-conversions-upload              # upload last 14 days
 *   npm run report:offline-conversions-upload -- --dry-run # print plan, no upload
 *   npx tsx scripts/ads-offline-conversions-upload.ts --since=2026-09-01
 *   npx tsx scripts/ads-offline-conversions-upload.ts --days=30
 *
 * See lib/reporting/offline-conversions.ts for auth/action notes.
 */

import { readFileSync, existsSync } from "node:fs"

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const i = t.indexOf("=")
    if (i > 0 && process.env[t.slice(0, i).trim()] === undefined) process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
}

const sinceFlag = process.argv.find((a) => a.startsWith("--since="))
const daysFlag = process.argv.find((a) => a.startsWith("--days="))
const dryRun = process.argv.includes("--dry-run")

const sinceDays = sinceFlag
  ? Math.max(1, Math.round((Date.now() - new Date(`${sinceFlag.slice(8)}T00:00:00Z`).getTime()) / 86_400_000))
  : daysFlag
    ? Math.max(1, parseInt(daysFlag.slice(7), 10) || 14)
    : 14

async function main() {
  const { uploadOfflineConversions } = await import("../lib/reporting/offline-conversions")
  const summary = await uploadOfflineConversions({ sinceDays, dryRun })
  console.log(JSON.stringify(summary, null, 2))
  if (dryRun) {
    console.log("\n(dry-run — midagi ei laaditud üles)")
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
