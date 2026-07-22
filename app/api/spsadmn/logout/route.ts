import { clearAdminCookie, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      await clearAdminCookie()
      return noStoreResponse(JSON.stringify({ success: true }), 200)
    } catch (error) {
      console.error("Logout error:", error)
      return noStoreResponse(JSON.stringify({ error: "Logout failed" }), 500)
    }
  }, true)
}
