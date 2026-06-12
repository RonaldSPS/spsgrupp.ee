import type { BlogPost } from "./posts.generated"
import { blogPosts as _blogPosts } from "./posts.generated"

export type { BlogPost }
export const blogPosts = _blogPosts

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.id !== post.id)
    .slice(0, count)
}
