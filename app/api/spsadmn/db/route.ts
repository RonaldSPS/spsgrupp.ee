import { NextResponse } from "next/server"
import { db, resetDbConnection } from "@/lib/db"
import { systemSettings } from "@/lib/db/schema"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse, requireAdminRole } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"

/**
 * Andmebaasi olek + taastamine admin-paneelist.
 * GET  → { configured, projectStatus, dbOk }
 * POST → käivitab Supabase'i projekti restore'i, kui see on pausil.
 *
 * Vajab Verceli keskkonnamuutujaid SUPABASE_ACCESS_TOKEN ja
 * SUPABASE_PROJECT_REF - pausil oleku korral ei saa neid andmebaasist lugeda,
 * seega peavad nad olema serveri env'is.
 */
const SUPABASE_API = "https://api.supabase.com/v1"
const DB_CHECK_TIMEOUT_MS = 4000

function supabaseEnv(): { token: string; ref: string } | null {
  const token = process.env.SUPABASE_ACCESS_TOKEN
  const ref = process.env.SUPABASE_PROJECT_REF
  return token && ref ? { token, ref } : null
}

async function getProjectStatus(token: string, ref: string): Promise<string | null> {
  try {
    const res = await fetch(`${SUPABASE_API}/projects/${ref}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = (await res.json()) as { status?: string }
    return data.status ?? null
  } catch {
    return null
  }
}

async function checkDb(): Promise<boolean> {
  try {
    await Promise.race([
      db.select({ key: systemSettings.key }).from(systemSettings).limit(1),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB check timed out")), DB_CHECK_TIMEOUT_MS)),
    ])
    return true
  } catch {
    // Same reasoning as lib/auth: free the possibly wedged pooled connection.
    void resetDbConnection()
    return false
  }
}

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      const env = supabaseEnv()
      const dbOk = await checkDb()
      const projectStatus = env ? await getProjectStatus(env.token, env.ref) : null
      return NextResponse.json(
        { configured: Boolean(env), projectStatus, dbOk },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      )
    } catch (error) {
      console.error("DB status GET error:", error)
      return noStoreResponse(JSON.stringify({ error: "Oleku laadimine ebaõnnestus" }), 500)
    }
  }, true)
}

export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }
      const roleCheck = await requireAdminRole()
      if (roleCheck) return roleCheck

      const env = supabaseEnv()
      if (!env) {
        return noStoreResponse(
          JSON.stringify({ error: "SUPABASE_ACCESS_TOKEN ja SUPABASE_PROJECT_REF pole Verceli keskkonnamuutujates seadistatud" }),
          500,
        )
      }

      const status = await getProjectStatus(env.token, env.ref)
      if (status === null) {
        return noStoreResponse(JSON.stringify({ error: "Supabase'i staatuse päring ebaõnnestus - kontrolli SUPABASE_ACCESS_TOKEN väärtust" }), 502)
      }
      if (status.startsWith("ACTIVE")) {
        return NextResponse.json(
          { ok: true, status, alreadyActive: true },
          { headers: { "Cache-Control": "no-store, max-age=0" } },
        )
      }

      const res = await fetch(`${SUPABASE_API}/projects/${env.ref}/restore`, {
        method: "POST",
        headers: { Authorization: `Bearer ${env.token}`, "Content-Type": "application/json" },
        cache: "no-store",
      })
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        console.error("Supabase restore failed:", res.status, text.slice(0, 300))
        return noStoreResponse(JSON.stringify({ error: `Supabase'i taastamine ebaõnnestus (HTTP ${res.status})` }), 502)
      }

      return NextResponse.json(
        { ok: true, status: "RESTORING" },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      )
    } catch (error) {
      console.error("DB restore POST error:", error)
      return noStoreResponse(JSON.stringify({ error: "Taastamine ebaõnnestus" }), 500)
    }
  }, true)
}
