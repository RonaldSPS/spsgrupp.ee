import "server-only"
import { createTransport } from "nodemailer"
import type { Transporter } from "nodemailer"

function getTransporter(): Transporter {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP configuration is incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.")
  }

  return createTransport({
    host,
    port: parseInt(port, 10),
    secure: port === "465",
    auth: { user, pass },
  })
}

function getFromAddress(): string {
  return process.env.SMTP_FROM || process.env.SMTP_USER || ""
}

export async function sendEmail(params: {
  to: string
  subject: string
  text: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getTransporter()
    const from = getFromAddress()
    await transporter.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
    })
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error"
    return { success: false, error: message }
  }
}
