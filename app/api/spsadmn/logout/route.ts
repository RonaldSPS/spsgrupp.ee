import { clearAdminCookie, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    await clearAdminCookie()
    return noStoreResponse(JSON.stringify({ success: true }), 200)
  }, true)
}
