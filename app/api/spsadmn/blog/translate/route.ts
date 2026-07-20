import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { blogEdits } from "@/lib/db/schema"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { blogPosts } from "@/app/blog/posts.generated"
import { getBlogTranslations, translateBlogPost } from "@/lib/translate-blog"

export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = await request.json()
      const id = Number(body?.id)
      if (!Number.isFinite(id)) return noStoreResponse(JSON.stringify({ error: "valid id required" }), 400)

      const base = blogPosts.find((post) => post.id === id)
      const edit = process.env.DATABASE_URL
        ? (await db.select().from(blogEdits).where(eq(blogEdits.id, id)).limit(1))[0]
        : await getJsonBlogEdit(id)
      const title = edit?.title || base?.title || ""
      const excerpt = edit?.excerpt || base?.excerpt || ""
      const contentHtml = edit?.contentHtml || base?.contentHtml || ""

      if (!title || !contentHtml) {
        return noStoreResponse(JSON.stringify({ error: "post title and content are required before translation" }), 400)
      }

      const result = await translateBlogPost(id, title, excerpt, contentHtml)
      const translations = await getBlogTranslations(id)

      return NextResponse.json({ success: true, result, translations }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Blog translate error:", error)
      return noStoreResponse(JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to translate blog post",
      }), 500)
    }
  }, true)
}

async function getJsonBlogEdit(id: number): Promise<{
  title?: string
  excerpt?: string
  contentHtml?: string
} | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "admin-blog-edits.json"), "utf-8")
    const parsed = JSON.parse(raw) as {
      posts?: Record<string, { title?: string; excerpt?: string; contentHtml?: string }>
    }
    return parsed.posts?.[String(id)] || null
  } catch {
    return null
  }
}
