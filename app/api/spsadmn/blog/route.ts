import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { sanitizeHtml } from "@/lib/sanitize"

const DATA_PATH = path.join(process.cwd(), "data", "admin-blog-edits.json")

interface BlogEdits {
  posts: Record<string, {
    title?: string
    slug?: string
    contentHtml?: string
    featuredImage?: string
    excerpt?: string
    updatedAt: string
  }>
}

async function readData(): Promise<BlogEdits> {
  const raw = await fs.readFile(DATA_PATH, "utf-8")
  return JSON.parse(raw)
}

async function writeData(data: BlogEdits): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8")
}

function sanitizeTextField(value: string | undefined): string {
  if (!value) return ""
  return value.slice(0, 50000).replace(/[<>]/g, (c) => c === "<" ? "&lt;" : "&gt;")
}

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      const data = await readData()
      return NextResponse.json(data, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch {
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

      const data = await readData()

      const safeFields: Record<string, string> = {}

      if (fields.title !== undefined) safeFields.title = sanitizeTextField(fields.title)
      if (fields.slug !== undefined) safeFields.slug = sanitizeTextField(fields.slug).replace(/\s+/g, "-")
      if (fields.contentHtml !== undefined) safeFields.contentHtml = sanitizeHtml(fields.contentHtml || "")
      if (fields.featuredImage !== undefined) {
        const img = (fields.featuredImage || "").trim()
        if (img && !img.startsWith("/") && !img.startsWith("https://")) safeFields.featuredImage = ""
        else safeFields.featuredImage = img
      }
      if (fields.excerpt !== undefined) safeFields.excerpt = sanitizeTextField(fields.excerpt)

      safeFields.updatedAt = new Date().toISOString()

      data.posts[id] = {
        ...data.posts[id],
        ...safeFields,
      }

      await writeData(data)
      return NextResponse.json({ success: true, post: data.posts[id] }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Blog PUT error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to save blog post" }), 500)
    }
  }, true)
}
