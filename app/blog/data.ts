import { cache } from "react"
import type { BlogPost } from "./posts.generated"
import { blogPosts as _blogPosts } from "./posts.generated"
import { promises as fs } from "fs"
import path from "path"
import { sanitizeHtmlSafe } from "@/lib/sanitize-server"
import { getBlogTranslationBySlug, getBlogTranslationsByLanguage } from "@/lib/translate-blog"
import type { TranslationLanguage } from "@/lib/ai-translation"

export type { BlogPost }
export const blogPosts = _blogPosts

function cleanExcerpt(raw: string, title: string): string {
  let text = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  if (text.length < 20 || text.startsWith("Keskkonnasõbralikud pu") || text.includes("Vaata lisaks >>")) {
    text = title + ". Loe lähemalt SPS Grupi blogist."
  }
  if (text.length > 160) {
    text = text.slice(0, 157).replace(/\s+\S*$/, "") + "..."
  }
  return text
}

interface AdminEdits {
  posts: Record<string, {
    title?: string
    slug?: string
    contentHtml?: string
    featuredImage?: string
    excerpt?: string
    active?: boolean
    updatedAt: string
  }>
}

const getAdminEdits = cache(async (): Promise<AdminEdits> => {
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { blogEdits } = await import("@/lib/db/schema")
      const rows = await db.select().from(blogEdits)
      const posts: AdminEdits["posts"] = {}
      for (const row of rows) {
        posts[String(row.id)] = {
          title: row.title ?? undefined,
          slug: row.slug ?? undefined,
          contentHtml: row.contentHtml ?? undefined,
          featuredImage: row.featuredImage ?? undefined,
          excerpt: row.excerpt ?? undefined,
          active: row.active,
          updatedAt: row.updatedAt?.toISOString?.() ?? String(row.updatedAt ?? ""),
        }
      }
      return { posts }
    } catch {
      // fall through to JSON file fallback
    }
  }

  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "admin-blog-edits.json"),
      "utf-8"
    )
    return JSON.parse(raw)
  } catch {
    return { posts: {} }
  }
})

export const getPostBySlugWithEdits = cache(async (slug: string): Promise<BlogPost | undefined> => {
  const base = blogPosts.find((p) => p.slug === slug)
  if (!base) return undefined
  const edits = await getAdminEdits()
  const edit = edits.posts[String(base.id)]
  if (!edit) return { ...base, contentHtml: sanitizeHtmlSafe(base.contentHtml) }
  return {
    ...base,
    title: edit.title ?? base.title,
    slug: edit.slug ?? base.slug,
    contentHtml: sanitizeHtmlSafe(edit.contentHtml ?? base.contentHtml),
    featuredImage: edit.featuredImage ?? base.featuredImage,
    excerpt: cleanExcerpt(edit.excerpt ?? base.excerpt, edit.title ?? base.title),
  }
})

export const getBlogPostsWithEdits = cache(async (): Promise<BlogPost[]> => {
  const edits = await getAdminEdits()
  return blogPosts.flatMap((post) => {
    const edit = edits.posts[String(post.id)]
    if (edit && edit.active === false) return []
    if (!edit) return [{ ...post, contentHtml: sanitizeHtmlSafe(post.contentHtml), excerpt: cleanExcerpt(post.excerpt, post.title) }]
    return [{
      ...post,
      title: edit.title ?? post.title,
      slug: edit.slug ?? post.slug,
      contentHtml: sanitizeHtmlSafe(edit.contentHtml ?? post.contentHtml),
      featuredImage: edit.featuredImage ?? post.featuredImage,
      excerpt: cleanExcerpt(edit.excerpt ?? post.excerpt, edit.title ?? post.title),
    }]
  })
})

export const getTranslatedPostBySlug = cache(async (
  language: TranslationLanguage,
  slug: string,
): Promise<BlogPost | undefined> => {
  try {
    const translation = await getBlogTranslationBySlug(language, slug)
    if (!translation || translation.status === "stale") return undefined

    const base = blogPosts.find((post) => post.id === translation.blogId)
    if (!base) return undefined

    return {
      ...base,
      title: translation.title,
      slug: translation.slug,
      excerpt: cleanExcerpt(translation.excerpt, translation.title),
      contentHtml: sanitizeHtmlSafe(translation.contentHtml),
    }
  } catch {
    return undefined
  }
})

export const getTranslatedBlogPosts = cache(async (
  language: TranslationLanguage,
): Promise<BlogPost[]> => {
  try {
    const rows = (await getBlogTranslationsByLanguage(language))
      .filter((translation) => translation.status === "auto")
    const byId = new Map(rows.map((row) => [row.blogId, row]))

    const edits = await getAdminEdits()

    return blogPosts.flatMap((post) => {
      const edit = edits.posts[String(post.id)]
      if (edit && edit.active === false) return []

      const translation = byId.get(post.id)
      if (!translation?.slug || !translation.title || !translation.contentHtml) return []
      return [{
        ...post,
        title: translation.title,
        slug: translation.slug,
        excerpt: cleanExcerpt(translation.excerpt || "", translation.title),
        contentHtml: sanitizeHtmlSafe(translation.contentHtml),
      }]
    })
  } catch {
    return []
  }
})

export function getPostBySlug(slug: string): BlogPost | undefined {
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return undefined
  return { ...post, contentHtml: sanitizeHtmlSafe(post.contentHtml) }
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.id !== post.id)
    .slice(0, count)
}
