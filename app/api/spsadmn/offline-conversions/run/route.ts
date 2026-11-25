import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { uploadOfflineConversions } from "@/lib/reporting/offline-conversions"

/**
 * POST — run the offline-conversion upload manually from the admin UI.
 *
 * Body: { dryRun?: boolean }
 *   dryRun=true  → only counts candidates, no data sent to Google.
 *   dryRun=false → real upload to Google Ads (same path as daily cron).
 *
 * Returns the full upload summary; on dry-run the result is NOT persisted.
 */
export const maxDuration = 60

export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return NextResponse.json(
          { error: "Invalid origin" },
          { status: 403, headers: { "Cache-Control": "no-store, max-age=0" } },
        )
      }

      let dryRun = false
      try {
        const body = (await request.json()) as { dryRun?: boolean }
        dryRun = body.dryRun === true
      } catch {
        // empty body = real upload
      }

      const summary = await uploadOfflineConversions({ dryRun })
      return NextResponse.json(
        {
          ...summary,
          formConversionActionId: summary.actionResourceName?.split("/").pop() ?? null,
          wonConversionActionId: summary.wonActionResourceName?.split("/").pop() ?? null,
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      )
    } catch (error) {
      console.error("Offline conversions run POST error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Üleslaadimine ebaõnnestus" },
        { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } },
      )
    }
  }, true)
}
