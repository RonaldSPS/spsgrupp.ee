import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { getWeeklyReport } from "@/lib/reporting/store"

/** GET — one stored report with the full snapshot. */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      const { id } = await context.params
      const report = await getWeeklyReport(Number(id))
      if (!report) return noStoreResponse(JSON.stringify({ error: "Raportit ei leitud" }), 404)
      return NextResponse.json({ report }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Report GET error:", error)
      return noStoreResponse(JSON.stringify({ error: "Raporti laadimine ebaõnnestus" }), 500)
    }
  }, true)
}
