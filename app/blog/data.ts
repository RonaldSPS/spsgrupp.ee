import { cache } from "react"
import type { BlogPost } from "./posts.generated"
import { blogPosts as _blogPosts } from "./posts.generated"
import { promises as fs } from "fs"
import path from "path"
import { sanitizeHtmlSafe } from "@/lib/sanitize-server"

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
    updatedAt: string
  }>
}

const getAdminEdits = cache(async (): Promise<AdminEdits> => {
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
  return blogPosts.map((post) => {
    const edit = edits.posts[String(post.id)]
    if (!edit) return { ...post, contentHtml: sanitizeHtmlSafe(post.contentHtml), excerpt: cleanExcerpt(post.excerpt, post.title) }
    return {
      ...post,
      title: edit.title ?? post.title,
      slug: edit.slug ?? post.slug,
      contentHtml: sanitizeHtmlSafe(edit.contentHtml ?? post.contentHtml),
      featuredImage: edit.featuredImage ?? post.featuredImage,
      excerpt: cleanExcerpt(edit.excerpt ?? post.excerpt, edit.title ?? post.title),
    }
  })
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
