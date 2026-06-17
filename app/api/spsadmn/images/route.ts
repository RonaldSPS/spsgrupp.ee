import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import sharp from "sharp"

const PUBLIC_DIR = path.join(process.cwd(), "public")
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"])
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads")

interface ImageInfo {
  url: string
  name: string
  dir: string
  size: number
  modified: string
}

async function scanDir(dir: string, baseUrl: string, base: string): Promise<ImageInfo[]> {
  const results: ImageInfo[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        const sub = await scanDir(fullPath, baseUrl + entry.name + "/", base)
        results.push(...sub)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (ALLOWED_EXT.has(ext)) {
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
  } catch {}
  return results
}

export async function GET() {
  const images = await scanDir(PUBLIC_DIR, "", PUBLIC_DIR)
  const sorted = images.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
  return NextResponse.json({ images: sorted })
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const ext = path.extname(file.name).toLowerCase()
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: "Unsupported file type: " + ext }, { status: 400 })
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  const timestamp = Date.now()
  const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_.-]/g, "_")

  if (ext === ".svg") {
    const fileName = `${timestamp}_${baseName}.svg`
    const filePath = path.join(UPLOAD_DIR, fileName)
    await fs.writeFile(filePath, buffer)
    return NextResponse.json({
      success: true,
      url: `/uploads/${fileName}`,
      name: fileName,
      size: buffer.length,
    })
  }

  const image = sharp(buffer)
  const metadata = await image.metadata()

  const MAX_WIDTH = 1920
  let pipeline = image
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
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
  })
}
