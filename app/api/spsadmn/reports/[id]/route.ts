import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse, requireAdminRole } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { getWeeklyReport } from "@/lib/reporting/store"
import { sendReportEmail } from "@/lib/reporting/notify"

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

/** POST — resend the report e-mail to the configured recipients. */
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }
      const roleCheck = await requireAdminRole()
      if (roleCheck) return roleCheck

      const { id } = await context.params
      const report = await getWeeklyReport(Number(id))
      if (!report) return noStoreResponse(JSON.stringify({ error: "Raportit ei leitud" }), 404)

      const email = await sendReportEmail(report)
      return NextResponse.json({ email }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Report resend error:", error)
      return noStoreResponse(JSON.stringify({ error: "E-kirja saatmine ebaõnnestus" }), 500)
    }
  }, true)
}
