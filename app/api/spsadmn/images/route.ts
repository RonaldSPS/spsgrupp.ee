import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import sharp from "sharp"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit, checkRequestSize, sizeLimitResponse } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"

export const runtime = "nodejs"

const PUBLIC_DIR = path.join(process.cwd(), "public")
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads")
const MAX_FILE_SIZE = 10 * 1024 * 1024

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/bmp": ".bmp",
  "image/x-icon": ".ico",
}

interface ImageInfo {
  url: string
  name: string
  dir: string
  size: number
  modified: string
}

async function scanDir(dir: string, baseUrl: string, base: string): Promise<ImageInfo[]> {
  const results: ImageInfo[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === ".next" || entry.name === "node_modules") continue
      const sub = await scanDir(fullPath, baseUrl + entry.name + "/", base)
      results.push(...sub)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (Object.values(MIME_EXT).includes(ext)) {
        const stat = await fs.stat(fullPath)
        results.push({
          url: "/" + baseUrl + entry.name,
          name: entry.name,
          dir: path.relative(base, dir).replace(/\\/g, "/"),
          size: stat.size,
          modified: stat.mtime.toISOString(),
        })
      }
    }
  }
  return results
}

function safeFilename(name: string): string {
  return name
    .replace(/\.\.[\/\\]/g, "")
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .slice(0, 200)
}

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      const images = await scanDir(PUBLIC_DIR, "", PUBLIC_DIR)
      const sorted = images.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
      return NextResponse.json({ images: sorted }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Images GET error:", error)
      return NextResponse.json({ images: [], error: "Failed to scan images" }, {
        status: 500,
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    }
  }, true)
}

export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }
      if (!checkRequestSize(request)) return sizeLimitResponse()

      const formData = await request.formData()
      const file = formData.get("file") as File | null

      if (!file) {
        return noStoreResponse(JSON.stringify({ error: "No file provided" }), 400)
      }

      const mimeType = file.type?.toLowerCase() || ""
      const mimeExt = MIME_EXT[mimeType]

      if (mimeExt) {
        if (file.size > MAX_FILE_SIZE) {
          return noStoreResponse(JSON.stringify({ error: "File too large, max 10MB" }), 400)
        }

        await fs.mkdir(UPLOAD_DIR, { recursive: true })

        const buffer = Buffer.from(await file.arrayBuffer())
        const timestamp = Date.now()
        const baseName = safeFilename(
          (file.name || "image").replace(/\.[^/.]+$/, "")
        )

        const MAX_WIDTH = 1920
        const MAX_HEIGHT = 1920

        const image = sharp(buffer)
        const metadata = await image.metadata()

        let pipeline = image
        const needsResize = (metadata.width && metadata.width > MAX_WIDTH) || (metadata.height && metadata.height > MAX_HEIGHT)
        if (needsResize) {
          pipeline = pipeline.resize({
            width: MAX_WIDTH,
            height: MAX_HEIGHT,
            fit: "inside",
            withoutEnlargement: true,
          })
        }

        const fileName = `${timestamp}_${baseName}.webp`
        const filePath = path.join(UPLOAD_DIR, fileName)

        await pipeline.webp({ quality: 82 }).toFile(filePath)

        const stat = await fs.stat(filePath)

        return NextResponse.json({
          success: true,
          url: `/uploads/${fileName}`,
          name: fileName,
          size: stat.size,
          originalSize: buffer.length,
        }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      const ext = path.extname(file.name).toLowerCase()
      if (ext === ".svg" || mimeType === "image/svg+xml") {
        return noStoreResponse(JSON.stringify({ error: "SVG uploads are not permitted" }), 400)
      }

      return noStoreResponse(JSON.stringify({ error: "Unsupported file type" }), 400)
    } catch (error) {
      console.error("Images POST error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to upload image" }), 500)
    }
  }, true)
}
