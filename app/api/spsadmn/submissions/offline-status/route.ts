import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { getSubmissionOfflineStatus } from "@/lib/reporting/offline-conversions"

/**
 * POST — batch lookup of offline-conversion upload status per submission.
 *
 * Body: { submissionIds: number[] }
 * Response: { statuses: Record<number, { form?: {...}|null, won?: {...}|null, lastUploadedAt, lastRequestId }> }
 *
 * Only reads the offline_conversion_events table / JSON fallback.
 * Eligibility (has gclid, is contact form, etc.) is decided by the caller.
 */
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

      const body = (await request.json()) as { submissionIds?: number[] }
      const ids = Array.isArray(body.submissionIds) ? body.submissionIds.filter((n) => typeof n === "number") : []
      if (ids.length === 0) {
        return NextResponse.json(
          { statuses: {} },
          { headers: { "Cache-Control": "no-store, max-age=0" } },
        )
      }

      const statuses: Record<number, Awaited<ReturnType<typeof getSubmissionOfflineStatus>>> = {}
      await Promise.all(
        ids.map(async (id) => {
          statuses[id] = await getSubmissionOfflineStatus(id)
        }),
      )

      return NextResponse.json(
        { statuses },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      )
    } catch (error) {
      console.error("Submission offline status POST error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Staatuse lugemine ebaõnnestus" },
        { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } },
      )
    }
  }, true)
}
