import { and, eq, sql } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { blogTranslations } from "@/lib/db/schema"
import {
  sourceHash,
  translateJsonWithDeepseek,
  type TranslationLanguage,
} from "@/lib/ai-translation"

export interface BlogTranslationResult {
  title: string
  slug: string
  excerpt: string
  contentHtml: string
}

export interface BlogTranslationRow extends BlogTranslationResult {
  language: string
  status: string
  sourceHash?: string | null
  updatedAt?: Date | string | null
}

type BlogTranslationSource = BlogTranslationResult

const JSON_PATH = path.join(process.cwd(), "data", "admin-blog-translations.json")

interface BlogTranslationsJson {
  posts: Record<string, BlogTranslationRow[]>
}

export function getBlogSourceHash(source: BlogTranslationSource): string {
  return sourceHash(source)
}

export async function translateBlogPost(
  blogId: number,
  title: string,
  excerpt: string,
  contentHtml: string,
): Promise<{ en: BlogTranslationResult; ru: BlogTranslationResult; sourceHash: string }> {
  const source = { title, slug: "", excerpt, contentHtml }
  const hash = getBlogSourceHash({ title, slug: "", excerpt, contentHtml })

  const [en, ru] = await Promise.all([
    translateBlogPostToLanguage(source, "en"),
    translateBlogPostToLanguage(source, "ru"),
  ])

  await saveBlogTranslations(blogId, hash, { en, ru })
  return { en, ru, sourceHash: hash }
}

export async function translateBlogPostToLanguage(
  source: BlogTranslationSource,
  language: TranslationLanguage,
): Promise<BlogTranslationResult> {
  const translated = await translateJsonWithDeepseek<BlogTranslationResult>({
    source,
    targetLanguage: language,
    subject: "blog post",
    htmlFields: ["contentHtml"],
  })

  return {
    title: String(translated.title || ""),
    slug: normalizeDynamicSlug(String(translated.slug || translated.title || "")),
    excerpt: String(translated.excerpt || ""),
    contentHtml: String(translated.contentHtml || ""),
  }
}

export async function saveBlogTranslations(
  blogId: number,
  hash: string,
  translations: Partial<Record<TranslationLanguage, BlogTranslationResult>>,
): Promise<void> {
  if (!process.env.DATABASE_URL) {
    const data = await readBlogTranslationsJson()
    const existing = data.posts[String(blogId)] || []
    const rows = Object.entries(translations).flatMap(([language, translation]) => {
      if (!translation) return []
      return [{
        ...translation,
        language,
        sourceHash: hash,
        status: "auto",
        updatedAt: new Date().toISOString(),
      } satisfies BlogTranslationRow]
    })
    const nextByLanguage = new Map(existing.map((row) => [row.language, row]))
    for (const row of rows) nextByLanguage.set(row.language, row)
    data.posts[String(blogId)] = Array.from(nextByLanguage.values())
    await writeBlogTranslationsJson(data)
    return
  }

  const rows = Object.entries(translations).flatMap(([language, translation]) => {
    if (!translation) return []
    return [{
      blogId,
      language,
      ...translation,
      sourceHash: hash,
      status: "auto",
    }]
  })

  if (rows.length === 0) return

  await db.insert(blogTranslations).values(rows).onConflictDoUpdate({
    target: [blogTranslations.blogId, blogTranslations.language],
    set: {
      title: sql`excluded.title`,
      slug: sql`excluded.slug`,
      excerpt: sql`excluded.excerpt`,
      contentHtml: sql`excluded.content_html`,
      sourceHash: sql`excluded.source_hash`,
      status: "auto",
      updatedAt: new Date(),
    },
  })
}

export async function markBlogTranslationsStale(blogId: number, hash: string): Promise<void> {
  if (!process.env.DATABASE_URL) {
    const data = await readBlogTranslationsJson()
    const rows = data.posts[String(blogId)] || []
    data.posts[String(blogId)] = rows.map((row) => (
      row.sourceHash && row.sourceHash !== hash ? { ...row, status: "stale" } : row
    ))
    await writeBlogTranslationsJson(data)
    return
  }

  await db.update(blogTranslations)
    .set({ status: "stale" })
    .where(and(
      eq(blogTranslations.blogId, blogId),
      sql`${blogTranslations.sourceHash} IS DISTINCT FROM ${hash}`,
    ))
}

export async function getBlogTranslation(
  blogId: number,
  language: string,
): Promise<BlogTranslationRow | null> {
  if (!process.env.DATABASE_URL) {
    const data = await readBlogTranslationsJson()
    return data.posts[String(blogId)]?.find((row) => row.language === language) || null
  }

  const rows = await db.select().from(blogTranslations)
    .where(and(
      eq(blogTranslations.blogId, blogId),
      eq(blogTranslations.language, language),
    ))
    .limit(1)

  if (!rows.length) return null
  return mapBlogTranslation(rows[0])
}

export async function getBlogTranslations(blogId: number): Promise<BlogTranslationRow[]> {
  if (!process.env.DATABASE_URL) {
    const data = await readBlogTranslationsJson()
    return data.posts[String(blogId)] || []
  }

  const rows = await db.select().from(blogTranslations)
    .where(eq(blogTranslations.blogId, blogId))

  return rows.map(mapBlogTranslation)
}

export async function getBlogTranslationBySlug(
  language: TranslationLanguage,
  slug: string,
): Promise<(BlogTranslationRow & { blogId: number }) | null> {
  if (!process.env.DATABASE_URL) {
    const data = await readBlogTranslationsJson()
    for (const [blogId, rows] of Object.entries(data.posts)) {
      const row = rows.find((item) => item.language === language && item.slug === slug)
      if (row) return { ...row, blogId: Number(blogId) }
    }
    return null
  }

  const rows = await db.select().from(blogTranslations)
    .where(and(
      eq(blogTranslations.language, language),
      eq(blogTranslations.slug, slug),
    ))
    .limit(1)

  if (!rows.length) return null
  return { ...mapBlogTranslation(rows[0]), blogId: rows[0].blogId }
}

export async function getBlogTranslationsByLanguage(
  language: TranslationLanguage,
): Promise<Array<BlogTranslationRow & { blogId: number }>> {
  if (!process.env.DATABASE_URL) {
    const data = await readBlogTranslationsJson()
    return Object.entries(data.posts).flatMap(([blogId, rows]) =>
      rows
        .filter((row) => row.language === language)
        .map((row) => ({ ...row, blogId: Number(blogId) })),
    )
  }

  const rows = await db.select().from(blogTranslations)
    .where(eq(blogTranslations.language, language))

  return rows.map((row) => ({ ...mapBlogTranslation(row), blogId: row.blogId }))
}

function mapBlogTranslation(row: typeof blogTranslations.$inferSelect): BlogTranslationRow {
  return {
    language: row.language,
    title: row.title || "",
    slug: row.slug || "",
    excerpt: row.excerpt || "",
    contentHtml: row.contentHtml || "",
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

async function readBlogTranslationsJson(): Promise<BlogTranslationsJson> {
  try {
    const raw = await fs.readFile(JSON_PATH, "utf-8")
    const parsed = JSON.parse(raw) as BlogTranslationsJson
    return { posts: parsed.posts || {} }
  } catch {
    return { posts: {} }
  }
}

async function writeBlogTranslationsJson(data: BlogTranslationsJson): Promise<void> {
  await fs.mkdir(path.dirname(JSON_PATH), { recursive: true })
  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8")
}
