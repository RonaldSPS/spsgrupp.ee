import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { uploadOfflineConversions } from "@/lib/reporting/offline-conversions"

/**
 * GET — dry-run summary of the next offline-conversion upload.
 *
 * Shows how many form and won-contract conversions would be sent, the
 * resolved Google Ads conversion action resource names, and the product
 * destination IDs (the numeric conversion action IDs are the last segment).
 * No data is actually uploaded.
 */
export const maxDuration = 60

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: { "Cache-Control": "no-store, max-age=0" } })
      }

      const summary = await uploadOfflineConversions({ dryRun: true })
      return NextResponse.json(
        {
          ...summary,
          formConversionActionId: summary.actionResourceName?.split("/").pop() ?? null,
          wonConversionActionId: summary.wonActionResourceName?.split("/").pop() ?? null,
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      )
    } catch (error) {
      console.error("Offline conversions status GET error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Staatuse lugemine ebaõnnestus" },
        { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } },
      )
    }
  }, true)
}
