import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { blogEdits } from "@/lib/db/schema"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { sanitizeHtml } from "@/lib/sanitize"

const JSON_PATH = path.join(process.cwd(), "data", "admin-blog-edits.json")

interface AdminEditsJson {
  posts: Record<string, {
    title?: string | null
    slug?: string | null
    contentHtml?: string | null
    featuredImage?: string | null
    excerpt?: string | null
    active?: boolean
    updatedAt?: string
  }>
}

function sanitizeTextField(value: string | undefined): string {
  if (!value) return ""
  return value.slice(0, 50000).replace(/[<>]/g, (c) => c === "<" ? "&lt;" : "&gt;")
}

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!process.env.DATABASE_URL) {
        const data = await readAdminEditsJson()
        const posts: Record<string, unknown> = {}
        for (const [id, row] of Object.entries(data.posts)) {
          posts[id] = {
            ...row,
            active: row.active !== false,
          }
        }
        return NextResponse.json({ posts }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      const rows = await db.select().from(blogEdits)
      const posts: Record<string, unknown> = {}
      for (const row of rows) {
        posts[String(row.id)] = {
          title: row.title,
          slug: row.slug,
          contentHtml: row.contentHtml,
          featuredImage: row.featuredImage,
          excerpt: row.excerpt,
          active: row.active,
          updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
        }
      }
      return NextResponse.json({ posts }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Blog GET error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to load blog posts" }), 500)
    }
  }, true)
}

export async function PUT(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = await request.json()
      const { id, fields } = body as { id: string; fields: Record<string, string | undefined> }
      if (!id) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const postId = parseInt(id, 10)
      if (isNaN(postId)) return noStoreResponse(JSON.stringify({ error: "invalid id" }), 400)

      const safeFields: Record<string, string | null> = { updatedAt: new Date().toISOString() }

      if (fields.title !== undefined) safeFields.title = sanitizeTextField(fields.title)
      if (fields.slug !== undefined) safeFields.slug = sanitizeTextField(fields.slug).replace(/\s+/g, "-")
      if (fields.contentHtml !== undefined) safeFields.contentHtml = sanitizeHtml(fields.contentHtml || "")
      if (fields.featuredImage !== undefined) {
        const img = (fields.featuredImage || "").trim()
        if (img && !img.startsWith("/") && !img.startsWith("https://")) safeFields.featuredImage = ""
        else safeFields.featuredImage = img
      }
      if (fields.excerpt !== undefined) safeFields.excerpt = sanitizeTextField(fields.excerpt)
      if (fields.active !== undefined) safeFields.active = fields.active ? "true" : "false"

      if (!process.env.DATABASE_URL) {
        const data = await readAdminEditsJson()
        const post = {
          title: safeFields.title,
          slug: safeFields.slug,
          contentHtml: safeFields.contentHtml,
          featuredImage: safeFields.featuredImage,
          excerpt: safeFields.excerpt,
          active: safeFields.active === "false" ? false : true,
          updatedAt: new Date().toISOString(),
        }
        data.posts[String(postId)] = post
        await writeAdminEditsJson(data)
        return NextResponse.json({ success: true, post }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      await db.insert(blogEdits)
        .values({
          id: postId,
          title: safeFields.title,
          slug: safeFields.slug,
          contentHtml: safeFields.contentHtml,
          featuredImage: safeFields.featuredImage,
          excerpt: safeFields.excerpt,
          active: safeFields.active === "false" ? false : (safeFields.active === "true" ? true : undefined),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: blogEdits.id,
          set: {
            title: safeFields.title,
            slug: safeFields.slug,
            contentHtml: safeFields.contentHtml,
            featuredImage: safeFields.featuredImage,
            excerpt: safeFields.excerpt,
            active: safeFields.active === "false" ? false : (safeFields.active === "true" ? true : undefined),
            updatedAt: new Date(),
          },
        })

      const saved = await db.select().from(blogEdits).where(eq(blogEdits.id, postId)).limit(1)
      const post = saved[0]

      return NextResponse.json({
        success: true,
        post: post ? {
          title: post.title,
          slug: post.slug,
          contentHtml: post.contentHtml,
          featuredImage: post.featuredImage,
          excerpt: post.excerpt,
          updatedAt: post.updatedAt?.toISOString?.() ?? post.updatedAt,
        } : null,
      }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Blog PUT error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to save blog post" }), 500)
    }
  }, true)
}

export async function DELETE(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const { searchParams } = new URL(request.url)
      const id = searchParams.get("id")
      if (!id) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const postId = parseInt(id, 10)
      if (isNaN(postId)) return noStoreResponse(JSON.stringify({ error: "invalid id" }), 400)

      if (!process.env.DATABASE_URL) {
        const data = await readAdminEditsJson()
        if (data.posts[String(postId)]) {
          data.posts[String(postId)] = {
            active: false,
            updatedAt: new Date().toISOString(),
          }
          await writeAdminEditsJson(data)
        }
        return NextResponse.json({ success: true }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      await db.insert(blogEdits)
        .values({
          id: postId,
          active: false,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: blogEdits.id,
          set: {
            active: false,
            updatedAt: new Date(),
          },
        })

      return NextResponse.json({ success: true }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Blog DELETE error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to delete blog post" }), 500)
    }
  }, true)
}

async function readAdminEditsJson(): Promise<AdminEditsJson> {
  try {
    const raw = await fs.readFile(JSON_PATH, "utf-8")
    const parsed = JSON.parse(raw) as AdminEditsJson
    return { posts: parsed.posts || {} }
  } catch {
    return { posts: {} }
  }
}

async function writeAdminEditsJson(data: AdminEditsJson): Promise<void> {
  await fs.mkdir(path.dirname(JSON_PATH), { recursive: true })
  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8")
}
