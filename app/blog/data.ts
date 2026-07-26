import { cache } from "react"
import type { BlogPost } from "./posts.generated"
import { blogPosts as _blogPosts } from "./posts.generated"
import { promises as fs } from "fs"
import path from "path"
import { sanitizeHtmlSafe } from "@/lib/sanitize-server"

export type { BlogPost }
export const blogPosts = _blogPosts
const DB_READ_TIMEOUT_MS = 2500

function withReadTimeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(
      () => reject(new Error("Blog database read timed out")),
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

function normalizeImportedContent(raw: string): string {
  return raw
    .replaceAll(
      "Kes on nr.1 koristusteenuste pakkujad maailmas.",
      "Kes on maailma suurimad koristusteenuste pakkujad?",
    )
    .replaceAll("nr.1 koristusteenuste pakkujad", "tuntud koristusteenuste pakkujad")
    .replaceAll("#kysipakkumist", "#pakkumine")
    .replaceAll("pools professionaalsesse", "poolprofessionaalsesse")
    .replaceAll(
      "<h2>Enamikul tavapärastest puhastusvahenditest on negatiivne mõju keskkonnale, sest nad sisaldavad kemikaale, mis võivad põhjustada reostust ja kahjustada loodust. Seetõttu on oluline kaaluda keskkonnasõbralike puhastusvahendite kasutamist.</h3>",
      "<h2>Enamikul tavapärastest puhastusvahenditest on negatiivne mõju keskkonnale, sest need sisaldavad kemikaale, mis võivad põhjustada reostust ja kahjustada loodust. Seetõttu on oluline kaaluda keskkonnasõbralike puhastusvahendite kasutamist.</h2>",
    )
    .replaceAll("<h2>Miks ja kuidas üldse prügi sorteerida!</h3>", "<h2>Miks ja kuidas üldse prügi sorteerida?</h2>")
    .replaceAll("<h2>Milliseid prügi sorteerimislahendusi on pakkuda?</h3>", "<h2>Milliseid prügi sorteerimislahendusi on pakkuda?</h2>")
    .replaceAll("<h2>Aga, kui meie firma ei soovi ise prügi sorteerimisega tegeleda?</h3>", "<h2>Aga kui meie ettevõte ei soovi ise prügi sorteerimisega tegeleda?</h2>")
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
      const rows = await withReadTimeout(db.select().from(blogEdits))
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
  if (!edit) return { ...base, contentHtml: sanitizeHtmlSafe(normalizeImportedContent(base.contentHtml)) }
  return {
    ...base,
    title: edit.title ?? base.title,
    slug: edit.slug ?? base.slug,
    contentHtml: sanitizeHtmlSafe(normalizeImportedContent(edit.contentHtml ?? base.contentHtml)),
    featuredImage: edit.featuredImage ?? base.featuredImage,
    excerpt: cleanExcerpt(edit.excerpt ?? base.excerpt, edit.title ?? base.title),
  }
})

export const getBlogPostsWithEdits = cache(async (): Promise<BlogPost[]> => {
  const edits = await getAdminEdits()
  return blogPosts.flatMap((post) => {
    const edit = edits.posts[String(post.id)]
    if (edit && edit.active === false) return []
    if (!edit) return [{ ...post, contentHtml: sanitizeHtmlSafe(normalizeImportedContent(post.contentHtml)), excerpt: cleanExcerpt(post.excerpt, post.title) }]
    return [{
      ...post,
      title: edit.title ?? post.title,
      slug: edit.slug ?? post.slug,
      contentHtml: sanitizeHtmlSafe(normalizeImportedContent(edit.contentHtml ?? post.contentHtml)),
      featuredImage: edit.featuredImage ?? post.featuredImage,
      excerpt: cleanExcerpt(edit.excerpt ?? post.excerpt, edit.title ?? post.title),
    }]
  })
})

export function getPostBySlug(slug: string): BlogPost | undefined {
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return undefined
  return { ...post, contentHtml: sanitizeHtmlSafe(normalizeImportedContent(post.contentHtml)) }
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.id !== post.id)
    .slice(0, count)
}
