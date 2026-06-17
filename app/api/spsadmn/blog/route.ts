import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

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
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8")
    return JSON.parse(raw)
  } catch {
    return { posts: {} }
  }
}

async function writeData(data: BlogEdits): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET() {
  const data = await readData()
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, fields } = body as { id: string; fields: Record<string, string> }
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const data = await readData()
  data.posts[id] = {
    ...data.posts[id],
    ...fields,
    updatedAt: new Date().toISOString(),
  }

  await writeData(data)
  return NextResponse.json({ success: true, post: data.posts[id] })
}
