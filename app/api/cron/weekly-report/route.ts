import { NextResponse } from "next/server"
import { generateWeeklyReport } from "@/lib/reporting/generate"
import { sendReportEmail } from "@/lib/reporting/notify"

/**
 * Weekly marketing report — Vercel Cron every Friday 06:00 UTC (09:00 EEST,
 * see vercel.json). Generates the report, stores it and e-mails it to the
 * `report_email_recipients` admin setting (fallback ronald@outline.ee).
 *
 * Protected by CRON_SECRET like /api/cron/keepalive. `?send=0` generates and
 * stores the report without sending the e-mail (manual testing).
 *
 * Requires env: GCP_SERVICE_ACCOUNT_JSON (or local key file), GA4_PROPERTY_ID,
 * GSC_SITE_URL, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CUSTOMER_ID — plus
 * ANTHROPIC_API_KEY for the LLM narrative (optional, degrades gracefully).
 */

// GA4 + GSC + Ads + DB pulls + the LLM narrative can take 1–3 minutes.
export const maxDuration = 300

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return new Response("Not found", { status: 404 })
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store, max-age=0" },
    })
  }

  const { searchParams } = new URL(request.url)
  const shouldSend = searchParams.get("send") !== "0"

  try {
    const report = await generateWeeklyReport()
    const email = shouldSend
      ? { attempted: true, ...(await sendReportEmail(report)) }
      : { attempted: false }
    return NextResponse.json(
      {
        ok: true,
        reportId: report.id,
        week: `${report.weekStart} → ${report.weekEnd}`,
        insights: report.insights.length,
        narrative: report.narrative ? "llm" : "rules-only",
        dataErrors: report.snapshot.errors,
        email,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    )
  } catch (error) {
    console.error("Weekly report cron failed:", error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Report generation failed" },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } },
    )
  }
}
