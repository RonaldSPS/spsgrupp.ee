import "server-only"

export interface EmailAttachment {
  filename: string
  content: Buffer
  contentType: string
}

function getApiKey(): string {
  const key = process.env.RESEND_API_KEY || process.env.Resend_API
  if (!key) {
    throw new Error("Resend configuration is incomplete. Set RESEND_API_KEY.")
  }
  return key
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM || "SPS Grupp <info@spsgrupp.ee>"
}

export async function sendEmail(params: {
  to: string
  subject: string
  text: string
  attachments?: EmailAttachment[]
  replyTo?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: params.to.split(",").map((addr) => addr.trim()).filter(Boolean),
        subject: params.subject,
        text: params.text,
        reply_to: params.replyTo
          ? params.replyTo.split(",").map((addr) => addr.trim()).filter(Boolean)
          : undefined,
        attachments: params.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content.toString("base64"),
          content_type: att.contentType,
        })),
      }),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => "")
      return { success: false, error: `Resend API ${response.status}: ${body}` }
    }
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error"
    return { success: false, error: message }
  }
}
