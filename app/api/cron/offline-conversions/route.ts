import { NextResponse } from "next/server"
import { uploadOfflineConversions } from "@/lib/reporting/offline-conversions"
import { sendEmail } from "@/lib/email"
import { getReportRecipients } from "@/lib/reporting/store"

/**
 * Daily offline-conversion upload to Google Ads (gclid + recorded Ads consent).
 * Replaces the manual CSV flow (scripts/ads-offline-conversions.ts): the daily
 * Vercel Cron uploads the trailing 60-day window of gclid-carrying contact
 * submissions with ads_consent = 'granted' and the admin-entered fee as the
 * conversion value, so Smart Bidding sees REAL inquiries instead of
 * consent-starved browser signals.
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
    console.log(
      "Offline conversions uploaded:",
      `form=${summary.uploaded}/${summary.candidates} (errors: ${summary.formResults?.errors ?? 0}), ` +
        `won=${summary.wonUploaded}/${summary.wonCandidates} (errors: ${summary.wonResults?.errors ?? 0}), ` +
        `requestId=${summary.requestId ?? "n/a"}`,
    )
    if (summary.formResults && summary.formResults.errors > 0) {
      console.error("Form conversion errors:", summary.formResults.details)
    }
    if (summary.wonResults && summary.wonResults.errors > 0) {
      console.error("Won conversion errors:", summary.wonResults.details)
    }
    if (summary.errors.length > 0) {
      await notifyFailure(
        "SPS: offline-konversioonide import — osalised vead",
        `Vormipäringud: ${summary.candidates} kandidaati, ${summary.uploaded} üles laaditud, ` +
          `${summary.formResults?.errors ?? 0} viga.\n` +
          `Võidetud lepingud: ${summary.wonCandidates} kandidaati, ${summary.wonUploaded} üles laaditud, ` +
          `${summary.wonResults?.errors ?? 0} viga.\n` +
          `Request ID: ${summary.requestId ?? "teadmata"}\n` +
          `Esimed vead:\n${summary.errors.slice(0, 20).join("\n")}`,
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
