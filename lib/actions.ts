"use server"

import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/rate-limit"
import { sendEmail, type EmailAttachment } from "@/lib/email"
import { saveFormSubmission, hasRecentSubmission } from "@/lib/form-submissions"
import { assessSubmission } from "@/lib/spam"
import { AUTOREPLY_DEFAULTS } from "@/lib/autoreply-defaults"

const DUPE_WINDOW_MS = 8000
const recentHashes = new Map<string, number>()

/** At most one auto-reply per recipient address per this window (per form). */
const AUTOREPLY_COOLDOWN_HOURS = 24

/** Read one admin setting (system_settings / admin-settings.json). Null when unset/empty. */
async function getSettingValue(settingKey: string): Promise<string | null> {
  try {
    if (process.env.DATABASE_URL) {
      const { db } = await import("@/lib/db")
      const { systemSettings } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")
      const rows = await db.select().from(systemSettings).where(eq(systemSettings.key, settingKey))
      if (rows[0]?.value) return rows[0].value
    } else {
      const { promises: fs } = await import("fs")
      const path = await import("path")
      try {
        const raw = await fs.readFile(path.join(process.cwd(), "data", "admin-settings.json"), "utf-8")
        const data = JSON.parse(raw)
        if (data.settings?.[settingKey]) return data.settings[settingKey]
      } catch {
        // fallback
      }
    }
  } catch {
    // fallback
  }
  return null
}

async function getEmailRecipients(settingKey: string, fallback: string): Promise<string> {
  return (await getSettingValue(settingKey)) ?? fallback
}

interface AutoReplyTemplate {
  enabled: boolean
  subject: string
  body: string
}

/** Auto-reply template for a form + locale: admin settings override the built-in drafts. */
async function getAutoReplyTemplate(
  kind: "contact" | "career",
  locale: ActionLocale,
  copy: ActionCopy,
): Promise<AutoReplyTemplate> {
  const enabledSetting = await getSettingValue(`autoreply_${kind}_enabled`)
  const subject = await getSettingValue(`autoreply_${kind}_subject_${locale}`)
  const body = await getSettingValue(`autoreply_${kind}_body_${locale}`)
  return {
    enabled: enabledSetting !== "0",
    subject: subject ?? (kind === "contact" ? copy.autoReplyContactSubject : copy.autoReplyCareerSubject),
    body: body ?? (kind === "contact" ? copy.autoReplyContactBody : copy.autoReplyCareerBody),
  }
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

/**
 * Source-page URL submitted by the form. Attacker-controlled, so only
 * http(s) or root-relative values are kept (no javascript:/protocol-relative),
 * capped at 500 chars. "" when missing or suspicious.
 */
function sanitizePageUrl(value: string | FormDataEntryValue | null): string {
  if (typeof value !== "string") return ""
  const trimmed = value.trim()
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed.slice(0, 500)
  if (/^https?:\/\//i.test(trimmed)) return trimmed.slice(0, 500)
  return ""
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

async function validateFile(file: File, copy: ActionCopy): Promise<{ valid: boolean; error?: string; attachment?: EmailAttachment }> {
  const name = file.name.toLowerCase()
  const ext = name.lastIndexOf(".") >= 0 ? name.slice(name.lastIndexOf(".")) : ""
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: copy.fileInvalidFormat }
  }

  if (file.size === 0) {
    return { valid: false, error: copy.fileEmpty }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: copy.fileTooLarge }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const mimeType = file.type || ""

  const expectedMagic = Object.entries(MAGIC_BYTES).find(([, magic]) =>
    magic.every((b, i) => buffer[i] === b)
  )

  if (!expectedMagic) {
    return { valid: false, error: copy.fileTypeUnknown }
  }

  const [verifiedType] = expectedMagic

  if (!ALLOWED_MIME_TYPES.has(mimeType) && !ALLOWED_MIME_TYPES.has(verifiedType)) {
    return { valid: false, error: copy.fileInvalidFormat }
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
  /**
   * Set on fake-success responses (honeypot / spam-flagged). The UI still
   * shows the normal success message, but the client must not fire the
   * GTM `form_submit` conversion event for these.
   */
  isSpam?: boolean
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
  fileInvalidFormat: string
  fileEmpty: string
  fileTooLarge: string
  fileTypeUnknown: string
  consentRequired: string
  duplicateContact: string
  duplicateCareer: string
  sendFailed: string
  contactSubject: string
  careerSubject: string
  messageHeading: string
  extraInfoHeading: string
  autoReplyContactSubject: string
  autoReplyContactBody: string
  autoReplyCareerSubject: string
  autoReplyCareerBody: string
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
    fileInvalidFormat: "Failiformaat ei ole lubatud. Lubatud on JPG, PNG ja PDF.",
    fileEmpty: "Fail on tühi.",
    fileTooLarge: "Fail on liiga suur. Maksimaalne suurus on 10 MB.",
    fileTypeUnknown: "Faili tüüpi ei saa kinnitada.",
    consentRequired: "Andmekaitsetingimustega nõustumine on kohustuslik.",
    duplicateContact: "Päring on juba saadetud. Palun oota enne uuesti proovimist.",
    duplicateCareer: "Avaldus on juba saadetud. Palun oota enne uuesti proovimist.",
    sendFailed: "Saatmine ebaõnnestus. Palun proovi hiljem uuesti.",
    contactSubject: "Kontaktivorm",
    careerSubject: "Karjääriavaldus",
    messageHeading: "Teade",
    extraInfoHeading: "Lisainfo",
    autoReplyContactSubject: AUTOREPLY_DEFAULTS.et.contact.subject,
    autoReplyContactBody: AUTOREPLY_DEFAULTS.et.contact.body,
    autoReplyCareerSubject: AUTOREPLY_DEFAULTS.et.career.subject,
    autoReplyCareerBody: AUTOREPLY_DEFAULTS.et.career.body,
    workloadOptions: { full: "Täistööaeg", part: "Osaline tööaeg" },
    workTimeOptions: {
      day: "Päevane tööaeg (8.00–17.00)",
      evening: "Õhtune tööaeg (16.00–00.00)",
      night: "Öine tööaeg (22.00–06.00)",
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
    fileInvalidFormat: "This file format is not allowed. JPG, PNG and PDF files are accepted.",
    fileEmpty: "The file is empty.",
    fileTooLarge: "The file is too large. The maximum size is 10 MB.",
    fileTypeUnknown: "The file type could not be verified.",
    consentRequired: "You must agree to the privacy policy.",
    duplicateContact: "This request has already been sent. Please wait before trying again.",
    duplicateCareer: "This application has already been sent. Please wait before trying again.",
    sendFailed: "Sending failed. Please try again later.",
    contactSubject: "Contact form",
    careerSubject: "Career application",
    messageHeading: "Message",
    extraInfoHeading: "Additional information",
    autoReplyContactSubject: AUTOREPLY_DEFAULTS.en.contact.subject,
    autoReplyContactBody: AUTOREPLY_DEFAULTS.en.contact.body,
    autoReplyCareerSubject: AUTOREPLY_DEFAULTS.en.career.subject,
    autoReplyCareerBody: AUTOREPLY_DEFAULTS.en.career.body,
    workloadOptions: { full: "Full-time", part: "Part-time" },
    workTimeOptions: {
      day: "Day shift (8:00–17:00)",
      evening: "Evening shift (16:00–00:00)",
      night: "Night shift (22:00–06:00)",
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
    fileInvalidFormat: "Этот формат файла не поддерживается. Допустимы JPG, PNG и PDF.",
    fileEmpty: "Файл пуст.",
    fileTooLarge: "Файл слишком большой. Максимальный размер — 10 МБ.",
    fileTypeUnknown: "Не удалось подтвердить тип файла.",
    consentRequired: "Необходимо согласиться с политикой конфиденциальности.",
    duplicateContact: "Этот запрос уже отправлен. Пожалуйста, подождите перед повторной попыткой.",
    duplicateCareer: "Эта заявка уже отправлена. Пожалуйста, подождите перед повторной попыткой.",
    sendFailed: "Не удалось отправить. Пожалуйста, попробуйте позже.",
    contactSubject: "Контактная форма",
    careerSubject: "Заявка на работу",
    messageHeading: "Сообщение",
    extraInfoHeading: "Дополнительная информация",
    autoReplyContactSubject: AUTOREPLY_DEFAULTS.ru.contact.subject,
    autoReplyContactBody: AUTOREPLY_DEFAULTS.ru.contact.body,
    autoReplyCareerSubject: AUTOREPLY_DEFAULTS.ru.career.subject,
    autoReplyCareerBody: AUTOREPLY_DEFAULTS.ru.career.body,
    workloadOptions: { full: "Полная занятость", part: "Частичная занятость" },
    workTimeOptions: {
      day: "Дневная смена (8:00–17:00)",
      evening: "Вечерняя смена (16:00–00:00)",
      night: "Ночная смена (22:00–06:00)",
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

async function getActionLocale(): Promise<ActionLocale> {
  const hdrs = await headers()
  const locale = hdrs.get("x-sps-locale")
  return locale === "en" || locale === "ru" ? locale : "et"
}

async function checkFormRateLimit(): Promise<boolean> {
  const hdrs = await headers()
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const path = hdrs.get("x-invoke-path") || "/api/contact"
  const fakeReq = new Request(`http://localhost${path}`, {
    headers: new Headers([["x-forwarded-for", ip]]),
  })
  const { allowed } = await checkRateLimit(fakeReq, 10, 60_000)
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
    return { success: true, isSpam: true }
  }

  const name = escapeText(formData.get("name"))
  const email = escapeText(formData.get("email"))
  const phone = escapeText(formData.get("phone"))
  const company = escapeText(formData.get("company"))
  const message = escapeText(formData.get("message"))
  const consent = formData.get("privacy_consent")
  const attachmentFile = formData.get("attachment")
  const pageUrl = sanitizePageUrl(formData.get("page_url"))

  const errors: string[] = []

  const nameErr = validateRequired(name, 2, 200, copy.labels.name, copy)
  if (nameErr) errors.push(nameErr)

  if (!email || !validateEmail(email)) errors.push(copy.invalidEmail)

  const phoneErr = validateRequired(phone, 6, 30, copy.labels.phone, copy)
  if (phoneErr) errors.push(phoneErr)
  else if (!validatePhone(phone)) errors.push(copy.invalidPhone)

  const messageErr = validateRequired(message, 10, 5000, copy.labels.message, copy)
  if (messageErr) errors.push(messageErr)

  if (!consent) errors.push(copy.consentRequired)

  let validatedAttachment: EmailAttachment | undefined
  if (attachmentFile instanceof File && attachmentFile.size > 0) {
    const validation = await validateFile(attachmentFile, copy)
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

  const locale = await getActionLocale()

  const spam = assessSubmission({ name, email, message, form: "contact" })
  if (spam.flagged) {
    // Saved for admin review, but no e-mails are sent. The submitter sees a
    // normal success message so spammers get no feedback.
    console.warn(`Spam-flagged contact submission (${spam.reasons.join("; ")}), email: ${email}`)
    await saveFormSubmission({
      form: "contact",
      locale,
      name,
      email,
      phone,
      company,
      message,
      attachmentName: validatedAttachment?.filename ?? "",
      isSpam: true,
      pageUrl,
    })
    return { success: true, isSpam: true }
  }

  // Cool-down check must run BEFORE saving this submission, otherwise the
  // current row would trip it and no auto-reply would ever be sent.
  const autoReplyCoolingDown = await hasRecentSubmission(email, "contact", AUTOREPLY_COOLDOWN_HOURS)

  await saveFormSubmission({
    form: "contact",
    locale,
    name,
    email,
    phone,
    company,
    message,
    attachmentName: validatedAttachment?.filename ?? "",
    pageUrl,
  })

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

  const recipients = await getEmailRecipients("email_recipients", "info@spsgrupp.ee")
  const result = await sendEmail({
    to: recipients,
    subject,
    text: body,
    attachments: validatedAttachment ? [validatedAttachment] : undefined,
  })

  if (!result.success) {
    return { error: copy.sendFailed }
  }

  const autoReply = await getAutoReplyTemplate("contact", locale, copy)
  if (autoReply.enabled && !autoReplyCoolingDown) {
    const replyResult = await sendEmail({
      to: email,
      subject: autoReply.subject,
      text: format(autoReply.body, { name }),
      replyTo: recipients,
    })
    if (!replyResult.success) {
      console.error("Contact auto-reply failed:", replyResult.error)
    }
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
    return { success: true, isSpam: true }
  }

  const name = escapeText(formData.get("name"))
  const email = escapeText(formData.get("email"))
  const phone = escapeText(formData.get("phone"))
  const region = escapeText(formData.get("region"))
  const workload = escapeText(formData.get("workload"))
  const workTime = escapeText(formData.get("work_time"))
  const info = escapeText(formData.get("info"))
  const consent = formData.get("privacy_consent")
  const pageUrl = sanitizePageUrl(formData.get("page_url"))

  const errors: string[] = []

  const nameErr = validateRequired(name, 2, 200, copy.labels.name, copy)
  if (nameErr) errors.push(nameErr)

  if (!email || !validateEmail(email)) errors.push(copy.invalidEmail)

  const phoneErr = validateRequired(phone, 6, 30, copy.labels.phone, copy)
  if (phoneErr) errors.push(phoneErr)
  else if (!validatePhone(phone)) errors.push(copy.invalidPhone)

  const allowedRegions = new Set(["Tallinn", "Harjumaa"])
  const allowedWorkloads = new Set(["full", "part"])
  const allowedWorkTimes = new Set(["day", "evening", "night", "any"])

  if (!allowedRegions.has(region)) errors.push(format(copy.required, { label: copy.labels.region }))
  if (!allowedWorkloads.has(workload)) errors.push(format(copy.required, { label: copy.labels.workload }))
  if (!allowedWorkTimes.has(workTime)) errors.push(format(copy.required, { label: copy.labels.workTime }))

  if (!consent) errors.push(copy.consentRequired)

  if (errors.length > 0) {
    return { error: errors.join(" "), fields: { name, email, phone, region, workload, workTime, info } }
  }

  const submissionData = `${name}|${email}|${phone}|${region}|${workload}|${workTime}|${info}`
  if (checkDuplicate("career", submissionData)) {
    return { error: copy.duplicateCareer }
  }

  const locale = await getActionLocale()

  const spam = assessSubmission({ name, email, message: info, form: "career" })
  if (spam.flagged) {
    // Saved for admin review, but no e-mails are sent. The submitter sees a
    // normal success message so spammers get no feedback.
    console.warn(`Spam-flagged career submission (${spam.reasons.join("; ")}), email: ${email}`)
    await saveFormSubmission({
      form: "career",
      locale,
      name,
      email,
      phone,
      region,
      workload,
      workTime,
      message: info,
      isSpam: true,
      pageUrl,
    })
    return { success: true, isSpam: true }
  }

  // Cool-down check must run BEFORE saving this submission, otherwise the
  // current row would trip it and no auto-reply would ever be sent.
  const autoReplyCoolingDown = await hasRecentSubmission(email, "career", AUTOREPLY_COOLDOWN_HOURS)

  await saveFormSubmission({
    form: "career",
    locale,
    name,
    email,
    phone,
    region,
    workload,
    workTime,
    message: info,
    pageUrl,
  })

  const subject = `${copy.careerSubject}: ${name}`
  const body = [
    `${copy.labels.name}: ${name}`,
    `${copy.labels.email}: ${email}`,
    `${copy.labels.phone}: ${phone}`,
    `${copy.labels.region}: ${region || "-"}`,
    `${copy.labels.workload}: ${copy.workloadOptions[workload] || workload || "-"}`,
    `${copy.labels.workTime}: ${copy.workTimeOptions[workTime] || workTime || "-"}`,
    ``,
    `${copy.extraInfoHeading}:`,
    info || "-",
  ].join("\n")

  const careerRecipients = await getEmailRecipients("career_email_recipients", "personal@spsgrupp.ee")
  const result = await sendEmail({
    to: careerRecipients,
    subject,
    text: body,
  })

  if (!result.success) {
    return { error: copy.sendFailed }
  }

  const autoReply = await getAutoReplyTemplate("career", locale, copy)
  if (autoReply.enabled && !autoReplyCoolingDown) {
    const replyResult = await sendEmail({
      to: email,
      subject: autoReply.subject,
      text: format(autoReply.body, { name }),
      replyTo: careerRecipients,
    })
    if (!replyResult.success) {
      console.error("Career auto-reply failed:", replyResult.error)
    }
  }

  return { success: true }
}
