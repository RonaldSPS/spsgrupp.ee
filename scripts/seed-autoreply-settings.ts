/**
 * Seeds the auto-reply ("Automaatvastused") default texts into system_settings
 * so they are visible and editable in /spsadmn/seaded/. Safe to re-run:
 * onConflictDoNothing — existing (admin-edited) values are never overwritten.
 * Requires DATABASE_URL.
 *   npx tsx scripts/seed-autoreply-settings.ts
 */
import { readFileSync } from "node:fs"
import path from "node:path"

// Load .env.local (tsx does not auto-load it)
try {
  const envRaw = readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
  for (const line of envRaw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, "")
  }
} catch {}

import { db } from "../lib/db"
import { systemSettings } from "../lib/db/schema"
import { AUTOREPLY_DEFAULTS, type AutoReplyLocale } from "../lib/autoreply-defaults"

const KINDS = ["contact", "career"] as const
const LOCALES: AutoReplyLocale[] = ["et", "en", "ru"]

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set — cannot seed settings")
    process.exit(1)
  }

  const rows: Array<{ key: string; value: string }> = []
  for (const kind of KINDS) {
    rows.push({ key: `autoreply_${kind}_enabled`, value: "1" })
    for (const locale of LOCALES) {
      rows.push({ key: `autoreply_${kind}_subject_${locale}`, value: AUTOREPLY_DEFAULTS[locale][kind].subject })
      rows.push({ key: `autoreply_${kind}_body_${locale}`, value: AUTOREPLY_DEFAULTS[locale][kind].body })
    }
  }

  await db.insert(systemSettings).values(rows).onConflictDoNothing({ target: systemSettings.key })
  console.log(`Seeded ${rows.length} auto-reply settings (existing values left untouched).`)

  const { inArray } = await import("drizzle-orm")
  const stored = await db
    .select()
    .from(systemSettings)
    .where(inArray(systemSettings.key, rows.map((r) => r.key)))
  for (const row of stored.sort((a, b) => a.key.localeCompare(b.key))) {
    console.log(`  ${row.key} = ${row.value.length} chars`)
  }
  process.exit(0)
}

main().catch((error) => {
  console.error("Seed failed:", error instanceof Error ? error.message : error)
  process.exit(1)
})
