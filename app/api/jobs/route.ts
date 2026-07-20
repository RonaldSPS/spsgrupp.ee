import { NextResponse } from "next/server"
import { applyJobTranslation, getActiveAnnouncements } from "@/lib/announcements"
import { getJobTranslation } from "@/lib/translate-jobs"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const lang = url.searchParams.get("lang")
    const announcements = await getActiveAnnouncements()
    const source = lang === "en" || lang === "ru"
      ? (await Promise.all(announcements.map(async (announcement) => {
          const translation = await getJobTranslation(announcement.id, lang)
          if (!translation || translation.status === "stale") return null
          return applyJobTranslation(announcement, translation)
        }))).filter((announcement) => announcement !== null)
      : announcements
    const active = source
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
