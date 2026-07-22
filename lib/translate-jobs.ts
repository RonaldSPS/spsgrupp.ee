import { and, eq, sql, inArray } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { jobTranslations } from "@/lib/db/schema"
import type { Announcement } from "@/lib/types"
import {
  sourceHash,
  translateJsonWithDeepseek,
  type TranslationLanguage,
} from "@/lib/ai-translation"

export interface JobTranslationResult {
  title: string
  subtitle: string
  companyDescription: string
  tasks: string
  requirements: string
  benefits: string
  location: string
  salaryDetails: string
  workTime: string
  workTimeDetails: string
  contactRole: string
  slug: string
}

export interface JobTranslationRow extends JobTranslationResult {
  language: string
  status: string
  sourceHash?: string | null
  updatedAt?: Date | string | null
}

const JSON_PATH = path.join(process.cwd(), "data", "admin-job-translations.json")

interface JobTranslationsJson {
  jobs: Record<string, JobTranslationRow[]>
}

export function getJobTranslationSource(job: Announcement): JobTranslationResult {
  return {
    title: job.title || "",
    subtitle: job.subtitle || "",
    companyDescription: job.companyDescription || "",
    tasks: job.tasks || "",
    requirements: job.requirements || "",
    benefits: job.benefits || "",
    location: job.location || "",
    salaryDetails: job.salaryDetails || "",
    workTime: job.workTime || "",
    workTimeDetails: job.workTimeDetails || "",
    contactRole: job.contactRole || "",
    slug: job.slug || "",
  }
}

export function getJobSourceHash(job: Announcement): string {
  return sourceHash(getJobTranslationSource(job))
}

export async function translateJobOffer(
  job: Announcement,
): Promise<{ en: JobTranslationResult; ru: JobTranslationResult; sourceHash: string }> {
  const source = getJobTranslationSource(job)
  const hash = sourceHash(source)

  const [en, ru] = await Promise.all([
    translateJobOfferToLanguage(source, "en"),
    translateJobOfferToLanguage(source, "ru"),
  ])

  await saveJobTranslations(job.id, hash, { en, ru })
  return { en, ru, sourceHash: hash }
}

export async function translateJobOfferToLanguage(
  source: JobTranslationResult,
  language: TranslationLanguage,
): Promise<JobTranslationResult> {
  const translated = await translateJsonWithDeepseek<JobTranslationResult>({
    source,
    targetLanguage: language,
    subject: "job offer",
    htmlFields: ["companyDescription", "tasks", "requirements", "benefits"],
  })

  return {
    title: String(translated.title || ""),
    subtitle: String(translated.subtitle || ""),
    companyDescription: String(translated.companyDescription || ""),
    tasks: String(translated.tasks || ""),
    requirements: String(translated.requirements || ""),
    benefits: String(translated.benefits || ""),
    location: String(translated.location || ""),
    salaryDetails: String(translated.salaryDetails || ""),
    workTime: String(translated.workTime || ""),
    workTimeDetails: String(translated.workTimeDetails || ""),
    contactRole: String(translated.contactRole || ""),
    slug: normalizeDynamicSlug(String(translated.slug || translated.title || "")),
  }
}

export async function saveJobTranslations(
  jobId: string,
  hash: string,
  translations: Partial<Record<TranslationLanguage, JobTranslationResult>>,
): Promise<void> {
  if (!process.env.DATABASE_URL) {
    const data = await readJobTranslationsJson()
    const existing = data.jobs[jobId] || []
    const rows = Object.entries(translations).flatMap(([language, translation]) => {
      if (!translation) return []
      return [{
        ...translation,
        language,
        sourceHash: hash,
        status: "auto",
        updatedAt: new Date().toISOString(),
      } satisfies JobTranslationRow]
    })
    const nextByLanguage = new Map(existing.map((row) => [row.language, row]))
    for (const row of rows) nextByLanguage.set(row.language, row)
    data.jobs[jobId] = Array.from(nextByLanguage.values())
    await writeJobTranslationsJson(data)
    return
  }

  const rows = Object.entries(translations).flatMap(([language, translation]) => {
    if (!translation) return []
    return [{
      jobId,
      language,
      ...translation,
      sourceHash: hash,
      status: "auto",
    }]
  })

  if (rows.length === 0) return

  await db.insert(jobTranslations).values(rows).onConflictDoUpdate({
    target: [jobTranslations.jobId, jobTranslations.language],
    set: {
      title: sql`excluded.title`,
      subtitle: sql`excluded.subtitle`,
      companyDescription: sql`excluded.company_description`,
      tasks: sql`excluded.tasks`,
      requirements: sql`excluded.requirements`,
      benefits: sql`excluded.benefits`,
      location: sql`excluded.location`,
      salaryDetails: sql`excluded.salary_details`,
      workTime: sql`excluded.work_time`,
      workTimeDetails: sql`excluded.work_time_details`,
      contactRole: sql`excluded.contact_role`,
      slug: sql`excluded.slug`,
      sourceHash: sql`excluded.source_hash`,
      status: "auto",
      updatedAt: new Date(),
    },
  })
}

export async function markJobTranslationsStale(jobId: string, hash: string): Promise<void> {
  if (!process.env.DATABASE_URL) {
    const data = await readJobTranslationsJson()
    const rows = data.jobs[jobId] || []
    data.jobs[jobId] = rows.map((row) => (
      row.sourceHash && row.sourceHash !== hash ? { ...row, status: "stale" } : row
    ))
    await writeJobTranslationsJson(data)
    return
  }

  await db.update(jobTranslations)
    .set({ status: "stale" })
    .where(and(
      eq(jobTranslations.jobId, jobId),
      sql`${jobTranslations.sourceHash} IS DISTINCT FROM ${hash}`,
    ))
}

export async function getJobTranslationsByLanguage(
  language: string,
): Promise<Array<JobTranslationRow & { jobId: string }>> {
  if (!process.env.DATABASE_URL) {
    const data = await readJobTranslationsJson()
    return Object.entries(data.jobs).flatMap(([jobId, rows]) =>
      rows
        .filter((row) => row.language === language)
        .map((row) => ({ ...row, jobId })),
    )
  }

  const rows = await db.select().from(jobTranslations)
    .where(eq(jobTranslations.language, language))

  return rows.map((row) => ({ ...mapJobTranslation(row), jobId: row.jobId }))
}

export async function getJobTranslation(jobId: string, language: string): Promise<JobTranslationRow | null> {
  if (!process.env.DATABASE_URL) {
    const data = await readJobTranslationsJson()
    return data.jobs[jobId]?.find((row) => row.language === language) || null
  }

  const rows = await db.select().from(jobTranslations)
    .where(and(
      eq(jobTranslations.jobId, jobId),
      eq(jobTranslations.language, language),
    ))
    .limit(1)

  if (!rows.length) return null
  return mapJobTranslation(rows[0])
}

export async function getJobTranslationsBulk(
  jobIds: string[],
): Promise<Record<string, JobTranslationRow[]>> {
  if (jobIds.length === 0) return {}

  if (!process.env.DATABASE_URL) {
    const data = await readJobTranslationsJson()
    const result: Record<string, JobTranslationRow[]> = {}
    for (const id of jobIds) {
      if (data.jobs[id]) result[id] = data.jobs[id]
    }
    return result
  }

  const rows = await db.select().from(jobTranslations)
    .where(inArray(jobTranslations.jobId, jobIds))

  const result: Record<string, JobTranslationRow[]> = {}
  for (const row of rows) {
    result[row.jobId] ??= []
    result[row.jobId].push(mapJobTranslation(row))
  }
  return result
}

export async function getJobTranslations(jobId: string): Promise<JobTranslationRow[]> {
  if (!process.env.DATABASE_URL) {
    const data = await readJobTranslationsJson()
    return data.jobs[jobId] || []
  }

  const rows = await db.select().from(jobTranslations)
    .where(eq(jobTranslations.jobId, jobId))

  return rows.map(mapJobTranslation)
}

export async function getJobTranslationBySlug(
  language: TranslationLanguage,
  slug: string,
): Promise<(JobTranslationRow & { jobId: string }) | null> {
  if (!process.env.DATABASE_URL) {
    const data = await readJobTranslationsJson()
    for (const [jobId, rows] of Object.entries(data.jobs)) {
      const row = rows.find((item) => item.language === language && item.slug === slug)
      if (row) return { ...row, jobId }
    }
    return null
  }

  const rows = await db.select().from(jobTranslations)
    .where(and(
      eq(jobTranslations.language, language),
      eq(jobTranslations.slug, slug),
    ))
    .limit(1)

  if (!rows.length) return null
  return { ...mapJobTranslation(rows[0]), jobId: rows[0].jobId }
}

function mapJobTranslation(row: typeof jobTranslations.$inferSelect): JobTranslationRow {
  return {
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
    workTimeDetails: row.workTimeDetails || "",
    contactRole: row.contactRole || "",
    slug: row.slug || "",
    status: row.status,
    sourceHash: row.sourceHash,
    updatedAt: row.updatedAt,
  }
}

function normalizeDynamicSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"’`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180)
}

async function readJobTranslationsJson(): Promise<JobTranslationsJson> {
  try {
    const raw = await fs.readFile(JSON_PATH, "utf-8")
    const parsed = JSON.parse(raw) as JobTranslationsJson
    return { jobs: parsed.jobs || {} }
  } catch {
    return { jobs: {} }
  }
}

async function writeJobTranslationsJson(data: JobTranslationsJson): Promise<void> {
  await fs.mkdir(path.dirname(JSON_PATH), { recursive: true })
  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8")
}
