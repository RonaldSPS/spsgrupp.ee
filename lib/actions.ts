"use server"

import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/rate-limit"
import { sendEmail, type EmailAttachment } from "@/lib/email"

const DUPE_WINDOW_MS = 8000
const recentHashes = new Map<string, number>()

async function getEmailRecipients(): Promise<string> {
  try {
    if (process.env.DATABASE_URL) {
      const { db } = await import("@/lib/db")
      const { systemSettings } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")
      const rows = await db.select().from(systemSettings).where(eq(systemSettings.key, "email_recipients"))
      if (rows[0]?.value) return rows[0].value
    } else {
      const { promises: fs } = await import("fs")
      const path = await import("path")
      try {
        const raw = await fs.readFile(path.join(process.cwd(), "data", "admin-settings.json"), "utf-8")
        const data = JSON.parse(raw)
        if (data.settings?.email_recipients) return data.settings.email_recipients
      } catch {
        // fallback
      }
    }
  } catch {
    // fallback
  }
  return "info@spsgrupp.ee"
}

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

function validateRequired(value: string, minLen: number, maxLen: number, label: string, copy: ActionCopy): string | null {
  const trimmed = value.trim()
  if (!trimmed) return format(copy.required, { label })
  if (trimmed.length < minLen) return format(copy.tooShort, { label, min: String(minLen) })
  if (trimmed.length > maxLen) return format(copy.tooLong, { label, max: String(maxLen) })
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

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
])

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".pdf"])

const MAX_FILE_SIZE = 10 * 1024 * 1024

const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "application/pdf": [0x25, 0x50, 0x44, 0x46],
}

async function validateFile(file: File): Promise<{ valid: boolean; error?: string; attachment?: EmailAttachment }> {
  const name = file.name.toLowerCase()
  const ext = name.lastIndexOf(".") >= 0 ? name.slice(name.lastIndexOf(".")) : ""
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: "Failiformaat ei ole lubatud. Lubatud on JPG, PNG ja PDF." }
  }

  if (file.size === 0) {
    return { valid: false, error: "Fail on tühi." }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Fail on liiga suur. Maksimaalne suurus on 10 MB." }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const mimeType = file.type || ""

  const expectedMagic = Object.entries(MAGIC_BYTES).find(([, magic]) =>
    magic.every((b, i) => buffer[i] === b)
  )

  if (!expectedMagic) {
    return { valid: false, error: "Faili tüüpi ei saa kinnitada." }
  }

  const [verifiedType] = expectedMagic

  if (!ALLOWED_MIME_TYPES.has(mimeType) && !ALLOWED_MIME_TYPES.has(verifiedType)) {
    return { valid: false, error: "Failiformaat ei ole lubatud. Lubatud on JPG, PNG ja PDF." }
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  return {
    valid: true,
    attachment: {
      filename: safeName,
      content: buffer,
      contentType: verifiedType,
    },
  }
}

interface FormState {
  success?: boolean
  error?: string
  fields?: Record<string, string>
}

type ActionLocale = "et" | "en" | "ru"

interface ActionCopy {
  labels: Record<string, string>
  required: string
  tooShort: string
  tooLong: string
  tooManyRequests: string
  invalidEmail: string
  invalidPhone: string
  consentRequired: string
  duplicateContact: string
  duplicateCareer: string
  sendFailed: string
  contactSubject: string
  careerSubject: string
  messageHeading: string
  extraInfoHeading: string
  workloadOptions: Record<string, string>
  workTimeOptions: Record<string, string>
}

const actionCopies: Record<ActionLocale, ActionCopy> = {
  et: {
    labels: {
      name: "Nimi",
      email: "E-post",
      phone: "Telefon",
      company: "Ettevõte",
      message: "Teade",
      region: "Piirkond",
      workload: "Töökoormus",
      workTime: "Tööaeg",
    },
    required: "{label} on kohustuslik.",
    tooShort: "{label} peab olema vähemalt {min} tähemärki.",
    tooLong: "{label} võib olla kuni {max} tähemärki.",
    tooManyRequests: "Liiga palju päringuid. Palun proovi hiljem uuesti.",
    invalidEmail: "Palun sisesta kehtiv e-posti aadress.",
    invalidPhone: "Palun sisesta kehtiv telefoninumber.",
    consentRequired: "Andmekaitsetingimustega nõustumine on kohustuslik.",
    duplicateContact: "Päring on juba saadetud. Palun oota enne uuesti proovimist.",
    duplicateCareer: "Avaldus on juba saadetud. Palun oota enne uuesti proovimist.",
    sendFailed: "Saatmine ebaõnnestus. Palun proovi hiljem uuesti.",
    contactSubject: "Kontaktivorm",
    careerSubject: "Karjääriavaldus",
    messageHeading: "Teade",
    extraInfoHeading: "Lisainfo",
    workloadOptions: { full: "Täistööaeg", part: "Osaline tööaeg" },
    workTimeOptions: {
      day: "Päevane tööaeg (8-17)",
      evening: "Õhtune tööaeg (16-00)",
      night: "Öine tööaeg (22-06)",
      any: "Sobivad kõik tööajad",
    },
  },
  en: {
    labels: {
      name: "Name",
      email: "E-mail",
      phone: "Phone",
      company: "Company",
      message: "Message",
      region: "Region",
      workload: "Workload",
      workTime: "Working hours",
    },
    required: "{label} is required.",
    tooShort: "{label} must be at least {min} characters.",
    tooLong: "{label} can be up to {max} characters.",
    tooManyRequests: "Too many requests. Please try again later.",
    invalidEmail: "Please enter a valid e-mail address.",
    invalidPhone: "Please enter a valid phone number.",
    consentRequired: "You must agree to the privacy policy.",
    duplicateContact: "This request has already been sent. Please wait before trying again.",
    duplicateCareer: "This application has already been sent. Please wait before trying again.",
    sendFailed: "Sending failed. Please try again later.",
    contactSubject: "Contact form",
    careerSubject: "Career application",
    messageHeading: "Message",
    extraInfoHeading: "Additional information",
    workloadOptions: { full: "Full-time", part: "Part-time" },
    workTimeOptions: {
      day: "Day shift (8-17)",
      evening: "Evening shift (16-00)",
      night: "Night shift (22-06)",
      any: "Any working hours",
    },
  },
  ru: {
    labels: {
      name: "Имя",
      email: "E-mail",
      phone: "Телефон",
      company: "Компания",
      message: "Сообщение",
      region: "Регион",
      workload: "Занятость",
      workTime: "Рабочее время",
    },
    required: "Поле «{label}» обязательно.",
    tooShort: "Поле «{label}» должно содержать не менее {min} символов.",
    tooLong: "Поле «{label}» может содержать не более {max} символов.",
    tooManyRequests: "Слишком много запросов. Пожалуйста, попробуйте позже.",
    invalidEmail: "Пожалуйста, введите корректный e-mail адрес.",
    invalidPhone: "Пожалуйста, введите корректный номер телефона.",
    consentRequired: "Необходимо согласиться с политикой конфиденциальности.",
    duplicateContact: "Этот запрос уже отправлен. Пожалуйста, подождите перед повторной попыткой.",
    duplicateCareer: "Эта заявка уже отправлена. Пожалуйста, подождите перед повторной попыткой.",
    sendFailed: "Не удалось отправить. Пожалуйста, попробуйте позже.",
    contactSubject: "Контактная форма",
    careerSubject: "Заявка на работу",
    messageHeading: "Сообщение",
    extraInfoHeading: "Дополнительная информация",
    workloadOptions: { full: "Полная занятость", part: "Частичная занятость" },
    workTimeOptions: {
      day: "Дневная смена (8-17)",
      evening: "Вечерняя смена (16-00)",
      night: "Ночная смена (22-06)",
      any: "Подходит любое время",
    },
  },
}

function format(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, value), template)
}

async function getActionCopy(): Promise<ActionCopy> {
  const hdrs = await headers()
  const locale = hdrs.get("x-sps-locale")
  if (locale === "en" || locale === "ru") return actionCopies[locale]
  return actionCopies.et
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
  const copy = await getActionCopy()
  if (!(await checkFormRateLimit())) {
    return { error: copy.tooManyRequests }
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
  const attachmentFile = formData.get("attachment")

  const errors: string[] = []

  const nameErr = validateRequired(name, 2, 200, copy.labels.name, copy)
  if (nameErr) errors.push(nameErr)

  if (!email || !validateEmail(email)) errors.push(copy.invalidEmail)

  const phoneErr = validateRequired(phone, 6, 30, copy.labels.phone, copy)
  if (phoneErr) errors.push(phoneErr)
  else if (!validatePhone(phone)) errors.push(copy.invalidPhone)

  if (!consent) errors.push(copy.consentRequired)

  let validatedAttachment: EmailAttachment | undefined
  if (attachmentFile instanceof File && attachmentFile.size > 0) {
    const validation = await validateFile(attachmentFile)
    if (!validation.valid) {
      errors.push(validation.error!)
    } else {
      validatedAttachment = validation.attachment
    }
  }

  if (errors.length > 0) {
    return { error: errors.join(" "), fields: { name, email, phone, company, message } }
  }

  const submissionData = `${name}|${email}|${phone}|${company}|${message}`
  if (checkDuplicate("contact", submissionData)) {
    return { error: copy.duplicateContact }
  }

  const subject = `${copy.contactSubject}: ${name}${company ? " / " + company : ""}`
  const body = [
    `${copy.labels.name}: ${name}`,
    `${copy.labels.email}: ${email}`,
    `${copy.labels.phone}: ${phone}`,
    `${copy.labels.company}: ${company || "-"}`,
    ``,
    `${copy.messageHeading}:`,
    message || "-",
  ].join("\n")

  const recipients = await getEmailRecipients()
  const result = await sendEmail({
    to: recipients,
    subject,
    text: body,
    attachments: validatedAttachment ? [validatedAttachment] : undefined,
  })

  if (!result.success) {
    return { error: copy.sendFailed }
  }

  return { success: true }
}

export async function submitCareerForm(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const copy = await getActionCopy()
  if (!(await checkFormRateLimit())) {
    return { error: copy.tooManyRequests }
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

  if (!email || !validateEmail(email)) errors.push(copy.invalidEmail)

  const phoneErr = validateRequired(phone, 6, 30, copy.labels.phone, copy)
  if (phoneErr) errors.push(phoneErr)
  else if (!validatePhone(phone)) errors.push(copy.invalidPhone)

  if (!consent) errors.push(copy.consentRequired)

  if (errors.length > 0) {
    return { error: errors.join(" "), fields: { email, phone, region, workload, workTime, info } }
  }

  const submissionData = `${email}|${phone}|${region}|${workload}|${workTime}|${info}`
  if (checkDuplicate("career", submissionData)) {
    return { error: copy.duplicateCareer }
  }

  const subject = `${copy.careerSubject}: ${email}`
  const body = [
    `${copy.labels.email}: ${email}`,
    `${copy.labels.phone}: ${phone}`,
    `${copy.labels.region}: ${region || "-"}`,
    `${copy.labels.workload}: ${copy.workloadOptions[workload] || workload || "-"}`,
    `${copy.labels.workTime}: ${copy.workTimeOptions[workTime] || workTime || "-"}`,
    ``,
    `${copy.extraInfoHeading}:`,
    info || "-",
  ].join("\n")

  const result = await sendEmail({
    to: "personal@spsgrupp.ee",
    subject,
    text: body,
  })

  if (!result.success) {
    return { error: copy.sendFailed }
  }

  return { success: true }
}
