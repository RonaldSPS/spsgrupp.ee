import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { systemSettings } from "@/lib/db/schema"

/**
 * Supabase keep-alive. The free-tier project auto-pauses after ~7 days without
 * database activity, which breaks admin auth (no snapshot file on Vercel) and
 * blanks EN/RU reviews/jobs. Vercel Cron calls this daily (see vercel.json) so
 * the inactivity timer never expires.
 *
 * Protected by CRON_SECRET: Vercel automatically sends
 * `Authorization: Bearer $CRON_SECRET` with cron requests. If CRON_SECRET is
 * not set the endpoint is disabled (404) so it cannot be abused to spam the DB.
 */
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

  try {
    // Any real query resets the Supabase inactivity timer.
    await db.select({ key: systemSettings.key }).from(systemSettings).limit(1)
    return NextResponse.json(
      { ok: true, at: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    )
  } catch (error) {
    console.error("Keepalive DB ping failed:", error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "DB ping failed" },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } },
    )
  }
}
