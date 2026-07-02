import { NextResponse } from "next/server"
import { getActiveAnnouncements } from "@/lib/announcements"

export async function GET() {
  try {
    const announcements = await getActiveAnnouncements()
    const active = announcements
      .map(row => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        location: row.location,
        salary: row.salary,
        salaryUnit: row.salaryUnit,
        salaryDetails: row.salaryDetails,
        workTime: row.workTime,
        publishedDate: row.publishedDate,
        slug: row.slug,
        active: row.active,
      }))
      .sort((a, b) =>
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
