/**
 * Syncs DB translations into the JSON fallback files used by lib/translate-*.ts
 * when the database is unreachable (Supabase pause / pooler exhaustion):
 *   data/admin-testimonial-translations.json
 *   data/admin-job-translations.json
 * Run after translations change in the admin. Requires DATABASE_URL.
 *   npx tsx scripts/sync-translation-fallbacks.ts
 */
import { promises as fs, readFileSync } from "node:fs"
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
import { testimonialTranslations, jobTranslations } from "../lib/db/schema"

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set — nothing to sync from")
    process.exit(1)
  }

  const testimonialRows = await db.select().from(testimonialTranslations)
  const testimonials: Record<string, unknown[]> = {}
  for (const row of testimonialRows) {
    const entry = {
      language: row.language,
      categoryTitle: row.categoryTitle || "",
      quote: row.quote || "",
      shortQuote: row.shortQuote || "",
      status: row.status,
      sourceHash: row.sourceHash,
      updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
    }
    ;(testimonials[row.testimonialId] ??= []).push(entry)
  }

  const jobRows = await db.select().from(jobTranslations)
  const jobs: Record<string, unknown[]> = {}
  for (const row of jobRows) {
    const entry = {
      language: row.language,
      title: row.title || "",
      subtitle: row.subtitle || "",
      companyDescription: row.companyDescription || "",
      tasks: row.tasks || "",
      requirements: row.requirements || "",
      benefits: row.benefits || "",
      location: row.location || "",
      salaryDetails: row.salaryDetails || "",
      workTime: row.workTime || "",
      status: row.status,
      sourceHash: row.sourceHash,
      slug: row.slug,
      updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
    }
    ;(jobs[row.jobId] ??= []).push(entry)
  }

  const tPath = path.join(process.cwd(), "data", "admin-testimonial-translations.json")
  const jPath = path.join(process.cwd(), "data", "admin-job-translations.json")
  await fs.writeFile(tPath, JSON.stringify({ testimonials }, null, 2), "utf-8")
  await fs.writeFile(jPath, JSON.stringify({ jobs }, null, 2), "utf-8")
  console.log(`synced ${testimonialRows.length} testimonial translations (${Object.keys(testimonials).length} testimonials)`)
  console.log(`synced ${jobRows.length} job translations (${Object.keys(jobs).length} jobs)`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
