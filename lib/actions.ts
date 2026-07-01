"use server"

import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/rate-limit"
import { sendEmail } from "@/lib/email"

const DUPE_WINDOW_MS = 8000
const recentHashes = new Map<string, number>()

function escapeText(input: string | FormDataEntryValue | null): string {
  if (input === null || input === undefined) return ""
  const s = typeof input === "string" ? input : ""
  return s.replace(/[&<>"'`\\]/g, (c) => {
    switch (c) {
      case "&": return "\uFF06"
      case "<": return "\uFF1C"
      case ">": return "\uFF1E"
      case '"': return "\uFF02"
      case "'": return "\uFF07"
      case "`": return "\uFF40"
      case "\\": return "\uFF3C"
      default: return c
    }
  })
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]+/g, "")
  return /^\+?\d{6,20}$/.test(cleaned)
}

function validateRequired(value: string, minLen: number, maxLen: number, label: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return `${label} on kohustuslik.`
  if (trimmed.length < minLen) return `${label} peab olema vähemalt ${minLen} tähemärki.`
  if (trimmed.length > maxLen) return `${label} võib olla kuni ${maxLen} tähemärki.`
  return null
}

function hashSubmission(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const c = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + c
    hash |= 0
  }
  return String(hash)
}

function checkDuplicate(prefix: string, data: string): boolean {
  const key = prefix + ":" + hashSubmission(prefix + data)
  const now = Date.now()
  const existing = recentHashes.get(key)
  if (existing && now - existing < DUPE_WINDOW_MS) return true
  for (const [k, t] of recentHashes) {
    if (now - t > DUPE_WINDOW_MS * 2) recentHashes.delete(k)
  }
  recentHashes.set(key, now)
  return false
}

interface FormState {
  success?: boolean
  error?: string
  fields?: Record<string, string>
}

async function checkFormRateLimit(): Promise<boolean> {
  const hdrs = await headers()
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const path = hdrs.get("x-invoke-path") || "/api/contact"
  const fakeReq = new Request(`http://localhost${path}`, {
    headers: new Headers([["x-forwarded-for", ip]]),
  })
  const { allowed } = checkRateLimit(fakeReq, 10, 60_000)
  return allowed
}

export async function submitContactForm(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await checkFormRateLimit())) {
    return { error: "Liiga palju päringuid. Palun proovi hiljem uuesti." }
  }

  const honeypot = formData.get("website_url")
  if (honeypot) {
    return { success: true }
  }

  const name = escapeText(formData.get("name"))
  const email = escapeText(formData.get("email"))
  const phone = escapeText(formData.get("phone"))
  const company = escapeText(formData.get("company"))
  const message = escapeText(formData.get("message"))
  const consent = formData.get("privacy_consent")

  const errors: string[] = []

  const nameErr = validateRequired(name, 2, 200, "Nimi")
  if (nameErr) errors.push(nameErr)

  if (!email || !validateEmail(email)) errors.push("Palun sisesta kehtiv e-posti aadress.")

  const phoneErr = validateRequired(phone, 6, 30, "Telefon")
  if (phoneErr) errors.push(phoneErr)
  else if (!validatePhone(phone)) errors.push("Palun sisesta kehtiv telefoninumber.")

  if (!consent) errors.push("Andmekaitsetingimustega nõustumine on kohustuslik.")

  if (errors.length > 0) {
    return { error: errors.join(" "), fields: { name, email, phone, company, message } }
  }

  const submissionData = `${name}|${email}|${phone}|${company}|${message}`
  if (checkDuplicate("contact", submissionData)) {
    return { error: "Päring on juba saadetud. Palun oota enne uuesti proovimist." }
  }

  const subject = `Kontaktivorm: ${name}${company ? " / " + company : ""}`
  const body = [
    `Nimi: ${name}`,
    `E-post: ${email}`,
    `Telefon: ${phone}`,
    `Ettevõte: ${company || "-"}`,
    ``,
    `Teade:`,
    message || "-",
  ].join("\n")

  const result = await sendEmail({
    to: "info@spsgrupp.ee",
    subject,
    text: body,
  })

  if (!result.success) {
    return { error: "Saatmine ebaõnnestus. Palun proovi hiljem uuesti." }
  }

  return { success: true }
}

export async function submitCareerForm(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await checkFormRateLimit())) {
    return { error: "Liiga palju päringuid. Palun proovi hiljem uuesti." }
  }

  const honeypot = formData.get("website_url")
  if (honeypot) {
    return { success: true }
  }

  const email = escapeText(formData.get("email"))
  const phone = escapeText(formData.get("phone"))
  const region = escapeText(formData.get("region"))
  const workload = escapeText(formData.get("workload"))
  const workTime = escapeText(formData.get("work_time"))
  const info = escapeText(formData.get("info"))
  const consent = formData.get("privacy_consent")

  const errors: string[] = []

  if (!email || !validateEmail(email)) errors.push("Palun sisesta kehtiv e-posti aadress.")

  const phoneErr = validateRequired(phone, 6, 30, "Telefon")
  if (phoneErr) errors.push(phoneErr)
  else if (!validatePhone(phone)) errors.push("Palun sisesta kehtiv telefoninumber.")

  if (!consent) errors.push("Andmekaitsetingimustega nõustumine on kohustuslik.")

  if (errors.length > 0) {
    return { error: errors.join(" "), fields: { email, phone, region, workload, workTime, info } }
  }

  const submissionData = `${email}|${phone}|${region}|${workload}|${workTime}|${info}`
  if (checkDuplicate("career", submissionData)) {
    return { error: "Avaldus on juba saadetud. Palun oota enne uuesti proovimist." }
  }

  const subject = `Karjääriavaldus: ${email}`
  const body = [
    `E-post: ${email}`,
    `Telefon: ${phone}`,
    `Piirkond: ${region || "-"}`,
    `Töökoormus: ${workload || "-"}`,
    `Tööaeg: ${workTime || "-"}`,
    ``,
    `Lisainfo:`,
    info || "-",
  ].join("\n")

  const result = await sendEmail({
    to: "personal@spsgrupp.ee",
    subject,
    text: body,
  })

  if (!result.success) {
    return { error: "Saatmine ebaõnnestus. Palun proovi hiljem uuesti." }
  }

  return { success: true }
}
