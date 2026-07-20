import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { getAllAnnouncements } from "@/lib/announcements"
import { getJobTranslations, translateJobOffer } from "@/lib/translate-jobs"

export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = await request.json()
      const id = String(body?.id || "")
      if (!id) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const announcements = await getAllAnnouncements()
      const announcement = announcements.find((item) => item.id === id)
      if (!announcement) return noStoreResponse(JSON.stringify({ error: "job offer not found" }), 404)
      if (!announcement.title) return noStoreResponse(JSON.stringify({ error: "job title is required before translation" }), 400)

      const result = await translateJobOffer(announcement)
      const translations = await getJobTranslations(id)

      return NextResponse.json({ success: true, result, translations }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Job translate error:", error)
      return noStoreResponse(JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to translate job offer",
      }), 500)
    }
  }, true)
}
