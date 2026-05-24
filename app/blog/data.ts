export interface BlogPost {
  id: number
  title: string
  slug: string
  date: string
  excerpt: string
  content: string
  image: string
  category: string
  readingTime: number
  author: string
}

const images = [
  "/blog/koristusfirmaSPS.jpg",
  "/blog/Koristamine.jpeg",
  "/blog/puhastusteenused-top.jpg",
  "/blog/Kontori-hoolduskoristus.jpeg",
  "/blog/SPS-puhastusteenused-clean-table.jpg",
  "/blog/SPS_Grupp_koristusteenused_proovitoo.jpg",
  "/blog/vars.jpg",
  "/blog/esca.jpg",
  "/blog/fassaadi.jpg",
]

function pickImage(id: number): string {
  return images[id % images.length]
}

export const blogPosts: BlogPost[] = []

export const categories = [...new Set(blogPosts.map((p) => p.category))].sort()

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category)
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, count)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
