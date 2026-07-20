import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { testimonials } from "@/lib/db/schema"
import type { Testimonial } from "@/lib/types"
import type { TranslationLanguage } from "@/lib/ai-translation"
import {
  getTestimonialTranslationsByLanguage,
  type TestimonialTranslationRow,
} from "@/lib/translate-testimonials"

export interface TestimonialCategoryGroup {
  title: string
  href: string
  testimonials: Testimonial[]
}

const JSON_PATH = path.join(process.cwd(), "data", "admin-testimonials.json")

interface TestimonialsJson {
  testimonials: Testimonial[]
}

async function jsonFileExists(): Promise<boolean> {
  try {
    await fs.access(JSON_PATH)
    return true
  } catch {
    return false
  }
}

export async function getTestimonialsFromDb(): Promise<Testimonial[]> {
  const rows = await db.select().from(testimonials)
  return rows as unknown as Testimonial[]
}

export async function getTestimonialsFromJson(): Promise<Testimonial[]> {
  const raw = await fs.readFile(JSON_PATH, "utf-8")
  const data = JSON.parse(raw) as TestimonialsJson
  return (data.testimonials || []) as Testimonial[]
}

export async function saveTestimonialsToJson(items: Testimonial[]): Promise<void> {
  await fs.mkdir(path.dirname(JSON_PATH), { recursive: true })
  await fs.writeFile(JSON_PATH, JSON.stringify({ testimonials: items }, null, 2), "utf-8")
}

async function withDbOrJson<T>(
  dbFn: () => Promise<T>,
  jsonFn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await dbFn()
  } catch {
    try {
      if (await jsonFileExists()) return await jsonFn()
    } catch {
      // JSON also failed
    }
    return fallback
  }
}

function sortTestimonials(items: Testimonial[]): Testimonial[] {
  return [...items].sort((a, b) => {
    const order = (a.sortOrder || 0) - (b.sortOrder || 0)
    if (order !== 0) return order
    return a.author.localeCompare(b.author)
  })
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return withDbOrJson(
    async () => {
      const rows = await getTestimonialsFromDb()
      if (rows.length > 0) return sortTestimonials(rows)
      if (await jsonFileExists()) return sortTestimonials(await getTestimonialsFromJson())
      return []
    },
    async () => sortTestimonials(await getTestimonialsFromJson()),
    [],
  )
}

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const all = await getAllTestimonials()
  return all.filter((item) => item.active)
}

export async function getTestimonial(id: string): Promise<Testimonial | undefined> {
  const all = await getAllTestimonials()
  return all.find((item) => item.id === id)
}

export async function getTestimonialsForLocale(locale: "et" | TranslationLanguage): Promise<Testimonial[]> {
  const items = await getActiveTestimonials()
  if (locale === "et") return items

  const translations = await getTestimonialTranslationsByLanguage(locale)
  const byId = new Map(translations.map((translation) => [translation.testimonialId, translation]))

  return items.flatMap((item) => {
    const translation = byId.get(item.id)
    if (!translation || translation.status === "stale") return []
    return [applyTestimonialTranslation(item, translation)]
  })
}

export function groupTestimonials(items: Testimonial[]): TestimonialCategoryGroup[] {
  const groups = new Map<string, TestimonialCategoryGroup>()
  for (const item of items) {
    const key = `${item.categoryTitle}__${item.categoryHref}`
    if (!groups.has(key)) {
      groups.set(key, { title: item.categoryTitle, href: item.categoryHref, testimonials: [] })
    }
    groups.get(key)!.testimonials.push(item)
  }
  return Array.from(groups.values())
}

export function applyTestimonialTranslation(
  source: Testimonial,
  translation: TestimonialTranslationRow,
): Testimonial {
  return {
    ...source,
    categoryTitle: translation.categoryTitle || source.categoryTitle,
    quote: translation.quote || source.quote,
    shortQuote: translation.shortQuote || source.shortQuote,
  }
}

export async function upsertTestimonial(
  id: string,
  fields: Partial<Testimonial>,
  defaultsProvider: () => Omit<Testimonial, "id">,
): Promise<Testimonial | null> {
  const now = new Date()

  return withDbOrJson(
    async () => {
      const existing = await db.select()
        .from(testimonials)
        .where(eq(testimonials.id, id))
        .limit(1)

      if (existing.length > 0) {
        await db.update(testimonials).set({ ...fields, updatedAt: now } as any)
          .where(eq(testimonials.id, id))
      } else {
        const defaults = defaultsProvider()
        await db.insert(testimonials).values({
          ...defaults, id, ...fields, createdAt: now, updatedAt: now,
        } as any)
      }

      const saved = await db.select()
        .from(testimonials)
        .where(eq(testimonials.id, id))
        .limit(1)

      syncDbToJson().catch(() => {})
      return (saved[0] as unknown as Testimonial) ?? null
    },
    async () => {
      const all = await getTestimonialsFromJson()
      const idx = all.findIndex((item) => item.id === id)
      const defaults = defaultsProvider()
      const updatedAt = new Date().toISOString()
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...fields, updatedAt }
      } else {
        all.push({ id, ...defaults, ...fields, createdAt: updatedAt, updatedAt } as Testimonial)
      }
      await saveTestimonialsToJson(sortTestimonials(all))
      return all.find((item) => item.id === id) ?? null
    },
    null,
  )
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  return withDbOrJson(
    async () => {
      await db.delete(testimonials).where(eq(testimonials.id, id))
      syncDbToJson().catch(() => {})
      return true
    },
    async () => {
      const all = await getTestimonialsFromJson()
      await saveTestimonialsToJson(all.filter((item) => item.id !== id))
      return true
    },
    false,
  )
}

export async function syncDbToJson(): Promise<void> {
  try {
    const rows = await db.select().from(testimonials)
    await saveTestimonialsToJson(sortTestimonials(rows as unknown as Testimonial[]))
  } catch {
    // Non-critical
  }
}

export { JSON_PATH }
