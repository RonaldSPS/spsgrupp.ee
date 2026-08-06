import { NextResponse } from "next/server"
import { applyJobTranslation, getActiveAnnouncements } from "@/lib/announcements"
import { getJobTranslationsByLanguage } from "@/lib/translate-jobs"
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit"

export async function GET(request: Request) {
  const { allowed, retryAfter } = await checkRateLimit(request, 120)
  if (!allowed) return rateLimitResponse(retryAfter)

  try {
    const url = new URL(request.url)
    const lang = url.searchParams.get("lang")
    const announcements = await getActiveAnnouncements()

    const source = lang === "en" || lang === "ru"
      ? await (async () => {
          const translations = await getJobTranslationsByLanguage(lang)
          const byId = new Map(translations.map((t) => [t.jobId, t]))
          return announcements.flatMap((announcement) => {
            const translation = byId.get(announcement.id)
            if (!translation || translation.status === "stale") return []
            return [applyJobTranslation(announcement, translation)]
          })
        })()
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
  } catch (error) {
    console.error("Jobs GET error:", error)
    return NextResponse.json({ announcements: [], error: "Failed to load jobs" }, {
      status: 500,
      headers: { "Cache-Control": "no-store, max-age=0" },
    })
  }
}
