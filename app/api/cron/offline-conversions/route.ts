import { NextResponse } from "next/server"
import { uploadOfflineConversions } from "@/lib/reporting/offline-conversions"
import { sendEmail } from "@/lib/email"
import { getReportRecipients } from "@/lib/reporting/store"

/**
 * Daily offline-conversion upload to Google Ads (gclid-based, consent-proof).
 * Replaces the manual CSV flow (scripts/ads-offline-conversions.ts): the daily
 * Vercel Cron uploads the trailing 14-day window of gclid-carrying contact
 * submissions with the admin-entered fee as the conversion value, so Smart
 * Bidding sees REAL inquiries instead of consent-starved browser signals.
 * Google dedupes repeated (transactionId = form-<id>) uploads — no state needed.
 *
 * Failures (and partial errors) are e-mailed to the report recipients so a
 * broken upload never goes unnoticed in the Vercel logs.
 *
 * Protected by CRON_SECRET like the other cron routes (see keepalive).
 */
export const maxDuration = 60

async function notifyFailure(subject: string, detail: string): Promise<void> {
  try {
    const recipients = await getReportRecipients()
    await sendEmail({
      to: recipients,
      subject,
      text:
        `Igapäevane offline-konversioonide import Ads'i ebaõnnestus.\n\n${detail}\n\n` +
        `Kontrolli: Vercel → Logs (cron /api/cron/offline-conversions/) või käivita lokaalselt:\nnpm run report:offline-conversions-upload\n\n` +
        `Kui viga kordub, vaata ANALYTICS.md §6b.`,
    })
  } catch (error) {
    console.error("Offline-conversions failure notification e-mail failed:", error)
  }
}

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
    const summary = await uploadOfflineConversions()
    console.log("Offline conversions uploaded:", JSON.stringify(summary))
    if (summary.errors.length > 0) {
      await notifyFailure(
        "SPS: offline-konversioonide import — osalised vead",
        `Kandidaate: ${summary.candidates}, üles laaditud: ${summary.uploaded}.\nVead:\n${summary.errors.join("\n")}`,
      )
    }
    return NextResponse.json(
      { ok: true, ...summary },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    )
  } catch (error) {
    console.error("Offline conversion upload failed:", error)
    const message = error instanceof Error ? error.message : "upload failed"
    await notifyFailure("SPS: offline-konversioonide import ebaõnnestus", message)
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } },
    )
  }
}
