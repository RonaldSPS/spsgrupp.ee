import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { blogEdits, blogTranslations } from "@/lib/db/schema"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { sanitizeHtml } from "@/lib/sanitize"
import { getBlogSourceHash, getBlogTranslations, markBlogTranslationsStale } from "@/lib/translate-blog"

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
          const source = {
            title: row.title || "",
            slug: "",
            excerpt: row.excerpt || "",
            contentHtml: row.contentHtml || "",
          }
          posts[id] = {
            ...row,
            active: row.active !== false,
            sourceHash: getBlogSourceHash(source),
            translations: await getBlogTranslations(Number(id)),
          }
        }
        return NextResponse.json({ posts }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      const rows = await db.select().from(blogEdits)
      const translationsByPost: Record<string, unknown[]> = {}
      try {
        const allTranslations = await db.select().from(blogTranslations)
        for (const row of allTranslations) {
          const key = String(row.blogId)
          translationsByPost[key] ??= []
          translationsByPost[key].push({
            language: row.language,
            title: row.title || "",
            slug: row.slug || "",
            excerpt: row.excerpt || "",
            contentHtml: row.contentHtml || "",
            status: row.status,
            sourceHash: row.sourceHash,
            updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
          })
        }
      } catch {
        // table/column may not exist until migration is applied
      }
      const posts: Record<string, unknown> = {}
      for (const row of rows) {
        const source = {
          title: row.title || "",
          slug: "",
          excerpt: row.excerpt || "",
          contentHtml: row.contentHtml || "",
        }
        const hash = getBlogSourceHash(source)
        posts[String(row.id)] = {
          title: row.title,
          slug: row.slug,
          contentHtml: row.contentHtml,
          featuredImage: row.featuredImage,
          excerpt: row.excerpt,
          active: row.active,
          updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
          sourceHash: hash,
          translations: translationsByPost[String(row.id)] || [],
        }
      }
      return NextResponse.json({ posts }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Blog GET error:", error)
      return NextResponse.json({ posts: {} }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
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
        const hash = getBlogSourceHash({
          title: post.title || "",
          slug: "",
          excerpt: post.excerpt || "",
          contentHtml: post.contentHtml || "",
        })
        await markBlogTranslationsStale(postId, hash)
        return NextResponse.json({
          success: true,
          post,
          translations: await getBlogTranslations(postId),
        }, {
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
      const hash = getBlogSourceHash({
        title: post?.title || "",
        slug: "",
        excerpt: post?.excerpt || "",
        contentHtml: post?.contentHtml || "",
      })
      try {
        await markBlogTranslationsStale(postId, hash)
      } catch (error) {
        console.warn(`Could not mark blog translations stale for post ${postId}:`, error)
      }

      // Optional auto-translation can be enabled after the Deepseek account is active.
      if (process.env.AUTO_TRANSLATE_DYNAMIC_CONTENT === "true" && safeFields.title && safeFields.contentHtml) {
        import("@/lib/translate-blog").then(({ translateBlogPost }) =>
          translateBlogPost(postId, safeFields.title!, safeFields.excerpt || "", safeFields.contentHtml!)
        ).catch(err => console.error(`Blog translation failed for post ${postId}:`, err))
      }

      // Fetch existing translations
      let translations: unknown[] = []
      try {
        const transRows = await db.select().from(blogTranslations).where(eq(blogTranslations.blogId, postId))
        translations = transRows.map(t => ({
          language: t.language,
          title: t.title,
          slug: t.slug,
          excerpt: t.excerpt,
          contentHtml: t.contentHtml,
          status: t.status,
        }))
      } catch { /* table may not exist yet */ }

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
        translations,
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
