import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse, requireAdminRole } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { listWeeklyReports, deleteWeeklyReports } from "@/lib/reporting/store"
import { generateWeeklyReport } from "@/lib/reporting/generate"
import { sendReportEmail } from "@/lib/reporting/notify"

/** Report generation pulls ~10 API calls + optional LLM narrative. */
export const maxDuration = 300

/** GET — list stored weekly reports (light summaries), newest first. */
export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      const reports = await listWeeklyReports()
      const summaries = reports.map((r) => {
        const s = r.snapshot
        return {
          id: r.id,
          weekStart: r.weekStart,
          weekEnd: r.weekEnd,
          createdAt: r.createdAt,
          emailSentAt: r.emailSentAt,
          emailError: r.emailError,
          hasNarrative: Boolean(r.narrative),
          insightsCount: r.insights.length,
          stats: {
            gscClicksPerDay: s.gsc ? Math.round((s.gsc.current.clicks / s.gsc.current.days) * 10) / 10 : null,
            gscImpressionsPerDay: s.gsc ? Math.round(s.gsc.current.impressions / s.gsc.current.days) : null,
            sessions: s.ga4 ? Math.round(s.ga4.current.sessions) : null,
            adsCost: s.ads?.available ? Math.round(s.ads.totals.cost * 100) / 100 : null,
            contacts: s.forms ? s.forms.current.contact : null,
            career: s.forms ? s.forms.current.career : null,
          },
        }
      })
      return NextResponse.json({ reports: summaries }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Reports GET error:", error)
      return noStoreResponse(JSON.stringify({ error: "Raportite laadimine ebaõnnestus" }), 500)
    }
  }, true)
}

/** POST — generate a report now. Body: { sendEmail?: boolean } (default false). */
export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }
      const roleCheck = await requireAdminRole()
      if (roleCheck) return roleCheck

      let sendEmailFlag = false
      try {
        const body = (await request.json()) as { sendEmail?: boolean }
        sendEmailFlag = body.sendEmail === true
      } catch {
        // empty body is fine
      }

      const report = await generateWeeklyReport()
      const email = sendEmailFlag
        ? { attempted: true, ...(await sendReportEmail(report)) }
        : { attempted: false }
      return NextResponse.json({ report, email }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Reports POST error:", error)
      return noStoreResponse(
        JSON.stringify({ error: error instanceof Error ? error.message : "Raporti genereerimine ebaõnnestus" }),
        500,
      )
    }
  }, true)
}

/** DELETE — remove stored reports. Body: { ids: number[] }. */
export async function DELETE(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }
      const roleCheck = await requireAdminRole()
      if (roleCheck) return roleCheck

      const body = (await request.json().catch(() => null)) as { ids?: unknown } | null
      const ids = Array.isArray(body?.ids)
        ? body!.ids.map(Number).filter((n) => Number.isInteger(n) && n > 0)
        : []
      if (ids.length === 0 || ids.length > 200) {
        return noStoreResponse(JSON.stringify({ error: "Invalid ids" }), 400)
      }

      const deleted = await deleteWeeklyReports(ids)
      return NextResponse.json({ success: true, deleted }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Reports DELETE error:", error)
      return noStoreResponse(JSON.stringify({ error: "Raporti kustutamine ebaõnnestus" }), 500)
    }
  }, true)
}
