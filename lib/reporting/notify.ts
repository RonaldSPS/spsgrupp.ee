/**
 * E-mail delivery of a stored weekly report (recipients from the
 * `report_email_recipients` admin setting, fallback ronald@outline.ee).
 * Kept separate from generate.ts because lib/email is "server-only" and
 * cannot be imported by plain-tsx scripts.
 */

import { sendEmail } from "../email"
import { buildReportEmail } from "./email-html"
import { getReportRecipients, markReportEmailSent } from "./store"
import type { StoredReport } from "./types"

export async function sendReportEmail(
  report: StoredReport,
): Promise<{ success: boolean; error?: string; recipients: string }> {
  const recipients = await getReportRecipients()
  const adminUrl = `https://spsgrupp.ee/spsadmn/raportid/${report.id}/`
  const mail = buildReportEmail(report, adminUrl)
  const sent = await sendEmail({ to: recipients, subject: mail.subject, text: mail.text, html: mail.html })
  await markReportEmailSent(report.id, sent.success ? undefined : sent.error ?? "send failed")
  return { success: sent.success, error: sent.error, recipients }
}
