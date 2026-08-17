import { NextResponse } from "next/server"
import { createAdminToken, setAdminCookie, noStoreResponse, AdminUserStoreUnavailableError } from "@/lib/auth"
import { checkLoginRateLimit, rateLimitResponse } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"

export async function POST(request: Request) {
  const loginCheck = await checkLoginRateLimit(request)
  if (!loginCheck.allowed) return rateLimitResponse(loginCheck.retryAfter)

  if (!verifySameOrigin(request)) {
    return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return noStoreResponse(JSON.stringify({ error: "Invalid content type" }), 400)
  }

  try {
    let body: { email?: string; password?: string }
    try {
      body = await request.json()
    } catch {
      return noStoreResponse(JSON.stringify({ error: "Invalid JSON" }), 400)
    }

    const { email, password } = body
    if (!password || typeof password !== "string") {
      return noStoreResponse(JSON.stringify({ error: "Parool on kohustuslik" }), 400)
    }

    let token: string | null = null
    try {
      token = await createAdminToken(password, email)
    } catch (e) {
      if (e instanceof AdminUserStoreUnavailableError) {
        return noStoreResponse(JSON.stringify({ error: "Andmebaasi ühendus ebaõnnestus. Proovi mõne sekundi pärast uuesti." }), 503)
      }
      console.error("Auth config error:", e)
      return noStoreResponse(JSON.stringify({ error: "Server configuration error" }), 500)
    }

    if (!token) {
      return noStoreResponse(JSON.stringify({ error: "Vale parool või e-mail" }), 401)
    }

    await setAdminCookie(token)
    return NextResponse.json({ success: true }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    })
  } catch (error) {
    console.error("Login error:", error)
    return noStoreResponse(JSON.stringify({ error: "Login failed" }), 500)
  }
}
