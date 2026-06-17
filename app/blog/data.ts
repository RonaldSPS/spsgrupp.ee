import type { BlogPost } from "./posts.generated"
import { blogPosts as _blogPosts } from "./posts.generated"
import { promises as fs } from "fs"
import path from "path"

export type { BlogPost }
export const blogPosts = _blogPosts

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

async function getAdminEdits(): Promise<AdminEdits> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "admin-blog-edits.json"),
      "utf-8"
    )
    return JSON.parse(raw)
  } catch {
    return { posts: {} }
  }
}

export async function getPostBySlugWithEdits(slug: string): Promise<BlogPost | undefined> {
  const base = blogPosts.find((p) => p.slug === slug)
  if (!base) return undefined
  const edits = await getAdminEdits()
  const edit = edits.posts[String(base.id)]
  if (!edit) return base
  return {
    ...base,
    title: edit.title ?? base.title,
    slug: edit.slug ?? base.slug,
    contentHtml: edit.contentHtml ?? base.contentHtml,
    featuredImage: edit.featuredImage ?? base.featuredImage,
    excerpt: edit.excerpt ?? base.excerpt,
  }
}

export async function getBlogPostsWithEdits(): Promise<BlogPost[]> {
  const edits = await getAdminEdits()
  return blogPosts.map((post) => {
    const edit = edits.posts[String(post.id)]
    if (!edit) return post
    return {
      ...post,
      title: edit.title ?? post.title,
      slug: edit.slug ?? post.slug,
      contentHtml: edit.contentHtml ?? post.contentHtml,
      featuredImage: edit.featuredImage ?? post.featuredImage,
      excerpt: edit.excerpt ?? post.excerpt,
    }
  })
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.id !== post.id)
    .slice(0, count)
}
