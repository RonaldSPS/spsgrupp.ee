import { and, eq, sql, inArray } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { testimonialTranslations } from "@/lib/db/schema"
import type { Testimonial } from "@/lib/types"
import {
  sourceHash,
  translateJsonWithDeepseek,
  type TranslationLanguage,
} from "@/lib/ai-translation"

export interface TestimonialTranslationResult {
  categoryTitle: string
  quote: string
  shortQuote: string
}

export interface TestimonialTranslationRow extends TestimonialTranslationResult {
  language: string
  status: string
  sourceHash?: string | null
  updatedAt?: Date | string | null
}

const JSON_PATH = path.join(process.cwd(), "data", "admin-testimonial-translations.json")

interface TestimonialTranslationsJson {
  testimonials: Record<string, TestimonialTranslationRow[]>
}

export function getTestimonialTranslationSource(testimonial: Testimonial): TestimonialTranslationResult {
  return {
    categoryTitle: testimonial.categoryTitle || "",
    quote: testimonial.quote || "",
    shortQuote: testimonial.shortQuote || "",
  }
}

export function getTestimonialSourceHash(testimonial: Testimonial): string {
  return sourceHash(getTestimonialTranslationSource(testimonial))
}

export async function translateTestimonial(
  testimonial: Testimonial,
): Promise<{ en: TestimonialTranslationResult; ru: TestimonialTranslationResult; sourceHash: string }> {
  const source = getTestimonialTranslationSource(testimonial)
  const hash = sourceHash(source)

  const [en, ru] = await Promise.all([
    translateTestimonialToLanguage(source, "en"),
    translateTestimonialToLanguage(source, "ru"),
  ])

  await saveTestimonialTranslations(testimonial.id, hash, { en, ru })
  return { en, ru, sourceHash: hash }
}

export async function translateTestimonialToLanguage(
  source: TestimonialTranslationResult,
  language: TranslationLanguage,
): Promise<TestimonialTranslationResult> {
  const translated = await translateJsonWithDeepseek<TestimonialTranslationResult>({
    source,
    targetLanguage: language,
    subject: "testimonial",
    htmlFields: [],
  })

  return {
    categoryTitle: String(translated.categoryTitle || ""),
    quote: String(translated.quote || ""),
    shortQuote: String(translated.shortQuote || ""),
  }
}

export async function saveTestimonialTranslations(
  testimonialId: string,
  hash: string,
  translations: Partial<Record<TranslationLanguage, TestimonialTranslationResult>>,
): Promise<void> {
  if (!process.env.DATABASE_URL) {
    const data = await readTestimonialTranslationsJson()
    const existing = data.testimonials[testimonialId] || []
    const rows = Object.entries(translations).flatMap(([language, translation]) => {
      if (!translation) return []
      return [{
        ...translation,
        language,
        sourceHash: hash,
        status: "auto",
        updatedAt: new Date().toISOString(),
      } satisfies TestimonialTranslationRow]
    })
    const nextByLanguage = new Map(existing.map((row) => [row.language, row]))
    for (const row of rows) nextByLanguage.set(row.language, row)
    data.testimonials[testimonialId] = Array.from(nextByLanguage.values())
    await writeTestimonialTranslationsJson(data)
    return
  }

  const rows = Object.entries(translations).flatMap(([language, translation]) => {
    if (!translation) return []
    return [{
      testimonialId,
      language,
      ...translation,
      sourceHash: hash,
      status: "auto",
    }]
  })

  if (rows.length === 0) return

  try {
    await db.insert(testimonialTranslations).values(rows).onConflictDoUpdate({
      target: [testimonialTranslations.testimonialId, testimonialTranslations.language],
      set: {
        categoryTitle: sql`excluded.category_title`,
        quote: sql`excluded.quote`,
        shortQuote: sql`excluded.short_quote`,
        sourceHash: sql`excluded.source_hash`,
        status: "auto",
        updatedAt: new Date(),
      },
    })
  } catch {
    const data = await readTestimonialTranslationsJson()
    const existing = data.testimonials[testimonialId] || []
    const jsonRows = rows.map((row) => ({
      categoryTitle: row.categoryTitle,
      quote: row.quote,
      shortQuote: row.shortQuote,
      language: row.language,
      sourceHash: hash,
      status: "auto",
      updatedAt: new Date().toISOString(),
    } satisfies TestimonialTranslationRow))
    const nextByLanguage = new Map(existing.map((row) => [row.language, row]))
    for (const row of jsonRows) nextByLanguage.set(row.language, row)
    data.testimonials[testimonialId] = Array.from(nextByLanguage.values())
    await writeTestimonialTranslationsJson(data)
  }
}

export async function markTestimonialTranslationsStale(testimonialId: string, hash: string): Promise<void> {
  if (!process.env.DATABASE_URL) {
    const data = await readTestimonialTranslationsJson()
    const rows = data.testimonials[testimonialId] || []
    data.testimonials[testimonialId] = rows.map((row) => (
      row.sourceHash && row.sourceHash !== hash ? { ...row, status: "stale" } : row
    ))
    await writeTestimonialTranslationsJson(data)
    return
  }

  try {
    await db.update(testimonialTranslations)
      .set({ status: "stale" })
      .where(and(
        eq(testimonialTranslations.testimonialId, testimonialId),
        sql`${testimonialTranslations.sourceHash} IS DISTINCT FROM ${hash}`,
      ))
  } catch {
    const data = await readTestimonialTranslationsJson()
    const rows = data.testimonials[testimonialId] || []
    data.testimonials[testimonialId] = rows.map((row) => (
      row.sourceHash && row.sourceHash !== hash ? { ...row, status: "stale" } : row
    ))
    await writeTestimonialTranslationsJson(data)
  }
}

export async function getTestimonialTranslationsBulk(
  testimonialIds: string[],
): Promise<Record<string, TestimonialTranslationRow[]>> {
  if (testimonialIds.length === 0) return {}

  if (!process.env.DATABASE_URL) {
    const data = await readTestimonialTranslationsJson()
    const result: Record<string, TestimonialTranslationRow[]> = {}
    for (const id of testimonialIds) {
      if (data.testimonials[id]) result[id] = data.testimonials[id]
    }
    return result
  }

  const rows = await db.select().from(testimonialTranslations)
    .where(inArray(testimonialTranslations.testimonialId, testimonialIds))

  const result: Record<string, TestimonialTranslationRow[]> = {}
  for (const row of rows) {
    result[row.testimonialId] ??= []
    result[row.testimonialId].push(mapTestimonialTranslation(row))
  }
  return result
}

export async function getTestimonialTranslations(testimonialId: string): Promise<TestimonialTranslationRow[]> {
  if (!process.env.DATABASE_URL) {
    const data = await readTestimonialTranslationsJson()
    return data.testimonials[testimonialId] || []
  }

  try {
    const rows = await db.select().from(testimonialTranslations)
      .where(eq(testimonialTranslations.testimonialId, testimonialId))

    return rows.map(mapTestimonialTranslation)
  } catch {
    const data = await readTestimonialTranslationsJson()
    return data.testimonials[testimonialId] || []
  }
}

const DB_READ_TIMEOUT_MS = 2500

function withReadTimeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(
      () => reject(new Error("Testimonial translations database read timed out")),
      DB_READ_TIMEOUT_MS,
    )
    promise.then(
      (value) => {
        clearTimeout(timeoutId)
        resolve(value)
      },
      (error) => {
        clearTimeout(timeoutId)
        reject(error)
      },
    )
  })
}

export async function getTestimonialTranslationsByLanguage(
  language: TranslationLanguage,
): Promise<Array<TestimonialTranslationRow & { testimonialId: string }>> {
  if (!process.env.DATABASE_URL) {
    const data = await readTestimonialTranslationsJson()
    return Object.entries(data.testimonials).flatMap(([testimonialId, rows]) =>
      rows
        .filter((row) => row.language === language)
        .map((row) => ({ ...row, testimonialId })),
    )
  }

  try {
    const rows = await withReadTimeout(
      db.select().from(testimonialTranslations)
        .where(eq(testimonialTranslations.language, language)),
    )

    return rows.map((row) => ({ ...mapTestimonialTranslation(row), testimonialId: row.testimonialId }))
  } catch {
    const data = await readTestimonialTranslationsJson()
    return Object.entries(data.testimonials).flatMap(([testimonialId, rows]) =>
      rows
        .filter((row) => row.language === language)
        .map((row) => ({ ...row, testimonialId })),
    )
  }
}

function mapTestimonialTranslation(row: typeof testimonialTranslations.$inferSelect): TestimonialTranslationRow {
  return {
    language: row.language,
    categoryTitle: row.categoryTitle || "",
    quote: row.quote || "",
    shortQuote: row.shortQuote || "",
    status: row.status,
    sourceHash: row.sourceHash,
    updatedAt: row.updatedAt,
  }
}

async function readTestimonialTranslationsJson(): Promise<TestimonialTranslationsJson> {
  try {
    const raw = await fs.readFile(JSON_PATH, "utf-8")
    const parsed = JSON.parse(raw) as TestimonialTranslationsJson
    return { testimonials: parsed.testimonials || {} }
  } catch {
    return { testimonials: {} }
  }
}

async function writeTestimonialTranslationsJson(data: TestimonialTranslationsJson): Promise<void> {
  await fs.mkdir(path.dirname(JSON_PATH), { recursive: true })
  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8")
}
