import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_PATH = path.join(process.cwd(), "data", "admin-toole-announcements.json")

interface Announcement {
  id: string
  title: string
  subtitle: string
  location: string
  salary: number
  salaryUnit: string
  salaryDetails: string
  workTime: string
  publishedDate: string
  slug: string
  active: boolean
}

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8")
    const data = JSON.parse(raw)
    const active = (data.announcements || []).filter((a: Announcement) => a.active)
    active.sort((a: Announcement, b: Announcement) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )
    return NextResponse.json({ announcements: active }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "CDN-Cache-Control": "public, max-age=60",
      },
    })
  } catch {
    return NextResponse.json({ announcements: [] }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    })
  }
}
