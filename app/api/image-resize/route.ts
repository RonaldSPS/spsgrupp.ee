import { NextRequest, NextResponse } from "next/server"
import { mkdir } from "fs/promises"
import path from "path"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit, checkRequestSize, sizeLimitResponse } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"

const imageConfigs: Record<string, { width: number; height: number }[]> = {
  hero: [
    { width: 1920, height: 1080 },
    { width: 1280, height: 720 },
    { width: 640, height: 360 },
  ],
  services: [
    { width: 800, height: 400 },
    { width: 400, height: 200 },
  ],
  trust: [
    { width: 920, height: 460 },
  ],
  industries: [
    { width: 800, height: 460 },
    { width: 1600, height: 920 },
  ],
  testimonials: [
    { width: 400, height: 400 },
  ],
}

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"])

function safeFilename(name: string): string {
  return name
    .replace(/\.\.[\/\\]/g, "")
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .slice(0, 200)
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }
      if (!checkRequestSize(request)) return sizeLimitResponse()

      const formData = await request.formData()
      const file = formData.get("file") as File | null
      const location = formData.get("location") as string | null

      if (!file) {
        return noStoreResponse(JSON.stringify({ error: "No file provided" }), 400)
      }

      const mimeType = file.type?.toLowerCase() || ""
      const ext = path.extname(file.name).toLowerCase()

      if (ext === ".svg" || mimeType === "image/svg+xml") {
        return noStoreResponse(JSON.stringify({ error: "SVG uploads are not permitted" }), 400)
      }

      if (!ALLOWED_MIME.has(mimeType)) {
        return noStoreResponse(JSON.stringify({ error: "Unsupported file type" }), 400)
      }

      if (!location || !imageConfigs[location]) {
        return noStoreResponse(
          JSON.stringify({ error: `Invalid location. Valid options: ${Object.keys(imageConfigs).join(", ")}` }),
          400,
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const sharp = eval("require('sharp')") as typeof import("sharp")

      const configs = imageConfigs[location]
      const results: string[] = []

      for (const config of configs) {
        const baseName = safeFilename(file.name.replace(/\.[^/.]+$/, ""))
        const filename = `${baseName}-${config.width}x${config.height}.webp`
        const outputDir = path.join(process.cwd(), "public", "images", location)
        const outputPath = path.join(outputDir, filename)

        await mkdir(outputDir, { recursive: true })

        await sharp(buffer)
          .resize(config.width, config.height, {
            fit: "cover",
            position: "center",
          })
          .webp({ quality: 80 })
          .toFile(outputPath)

        results.push(`/images/${location}/${filename}`)
      }

      return NextResponse.json(
        { success: true, location, images: results },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      )
    } catch (error) {
      console.error("Image processing error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to process image" }), 500)
    }
  }, true)
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    if (!(await validateAdminRequest())) return unauthorizedResponse()
    return NextResponse.json(
      { locations: Object.keys(imageConfigs), configs: imageConfigs },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    )
  }, true)
}
