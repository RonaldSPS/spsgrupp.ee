/**
 * Server-side storage for contact/career form inquiries.
 * Uses the form_submissions table when DATABASE_URL is set,
 * with data/form-submissions.json as fallback when the DB is missing/unavailable
 * (same pattern as admin-settings.json and the translate-*.ts fallbacks).
 * All functions are fail-safe: storage errors are logged, never thrown,
 * so the user-facing form flow (e-mail) is never interrupted.
 */

export interface FormSubmissionInput {
  form: "contact" | "career"
  locale: string
  name: string
  email: string
  phone: string
  company?: string
  message?: string
  region?: string
  workload?: string
  workTime?: string
  attachmentName?: string
  isSpam?: boolean
  /** URL of the page the form was submitted from. "" when unknown (older rows). */
  pageUrl?: string
  /** Google Ads click id from the hidden form field (contact form only). "" when none. */
  gclid?: string
}

export interface FormSubmission {
  id: number
  form: string
  locale: string
  name: string
  email: string
  phone: string
  company: string
  message: string
  region: string
  workload: string
  workTime: string
  attachmentName: string
  /** Decimal string (e.g. "123.45"), "" when not set. Admin-entered. */
  fee: string
  /** Decimal string (e.g. "123.45"), "" when not set. Admin-entered. */
  profit: string
  notes: string
  isSpam: boolean
  pageUrl: string
  gclid: string
  createdAt: string
}

export interface FormSubmissionFinancials {
  fee?: string | null
  profit?: string | null
  notes?: string
}

export interface FormSubmissionFilter {
  form?: "contact" | "career"
  from?: string
  to?: string
  /** When true, only spam-flagged rows are returned. */
  spamOnly?: boolean
}

const MAX_ROWS = 2000

/** Normalize a stored fee/profit value (numeric string from DB, number from JSON, or missing) to a decimal string. */
function normalizeAmount(value: unknown): string {
  if (value === null || value === undefined || value === "") return ""
  const n = Number(value)
  if (!Number.isFinite(n)) return ""
  return String(Math.round(n * 100) / 100)
}

async function jsonFilePath(): Promise<string> {
  const path = await import("path")
  return path.join(process.cwd(), "data", "form-submissions.json")
}

async function readJsonRows(): Promise<FormSubmission[]> {
  const { promises: fs } = await import("fs")
  try {
    const raw = await fs.readFile(await jsonFilePath(), "utf-8")
    const parsed = JSON.parse(raw)
    const rows = Array.isArray(parsed) ? parsed : parsed?.submissions
    if (!Array.isArray(rows)) return []
    // Tolerate rows written before fee/profit/notes/isSpam/pageUrl/gclid existed.
    return rows.map((row) => ({
      ...row,
      fee: normalizeAmount(row.fee),
      profit: normalizeAmount(row.profit),
      notes: typeof row.notes === "string" ? row.notes : "",
      isSpam: row.isSpam === true,
      pageUrl: typeof row.pageUrl === "string" ? row.pageUrl : "",
      gclid: typeof row.gclid === "string" ? row.gclid : "",
    }))
  } catch {
    return []
  }
}

async function writeJsonRows(rows: FormSubmission[]): Promise<void> {
  const { promises: fs } = await import("fs")
  const path = await import("path")
  const file = await jsonFilePath()
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, JSON.stringify({ submissions: rows }, null, 2), "utf-8")
}

async function insertIntoDb(input: FormSubmissionInput): Promise<void> {
  const { db } = await import("@/lib/db")
  const { formSubmissions } = await import("@/lib/db/schema")
  await db.insert(formSubmissions).values({
    form: input.form,
    locale: input.locale,
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company ?? "",
    message: input.message ?? "",
    region: input.region ?? "",
    workload: input.workload ?? "",
    workTime: input.workTime ?? "",
    attachmentName: input.attachmentName ?? "",
    isSpam: input.isSpam ?? false,
    pageUrl: input.pageUrl ?? "",
    gclid: input.gclid ?? "",
  })
}

async function appendToJson(input: FormSubmissionInput): Promise<void> {
  const rows = await readJsonRows()
  const nextId = rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1
  rows.push({
    id: nextId,
    form: input.form,
    locale: input.locale,
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company ?? "",
    message: input.message ?? "",
    region: input.region ?? "",
    workload: input.workload ?? "",
    workTime: input.workTime ?? "",
    attachmentName: input.attachmentName ?? "",
    fee: "",
    profit: "",
    notes: "",
    isSpam: input.isSpam ?? false,
    pageUrl: input.pageUrl ?? "",
    gclid: input.gclid ?? "",
    createdAt: new Date().toISOString(),
  })
  await writeJsonRows(rows)
}

export async function saveFormSubmission(input: FormSubmissionInput): Promise<void> {
  try {
    if (process.env.DATABASE_URL) {
      try {
        await insertIntoDb(input)
        return
      } catch (error) {
        console.error("DB insert failed, falling back to JSON storage:", error)
      }
    }
    await appendToJson(input)
  } catch (error) {
    console.error("Failed to store form submission:", error)
  }
}

function fromDate(from: string): Date {
  return new Date(`${from}T00:00:00`)
}

function toDate(to: string): Date {
  return new Date(`${to}T23:59:59.999`)
}

function matchesFilter(row: FormSubmission, filter: FormSubmissionFilter): boolean {
  if (filter.form && row.form !== filter.form) return false
  if (filter.spamOnly && !row.isSpam) return false
  const time = new Date(row.createdAt).getTime()
  if (Number.isNaN(time)) return false
  if (filter.from && time < fromDate(filter.from).getTime()) return false
  if (filter.to && time > toDate(filter.to).getTime()) return false
  return true
}

async function readFromDb(filter: FormSubmissionFilter): Promise<FormSubmission[]> {
  const { db } = await import("@/lib/db")
  const { formSubmissions } = await import("@/lib/db/schema")
  const { and, desc, eq, gte, lte } = await import("drizzle-orm")

  const conditions = []
  if (filter.form) conditions.push(eq(formSubmissions.form, filter.form))
  if (filter.spamOnly) conditions.push(eq(formSubmissions.isSpam, true))
  if (filter.from) conditions.push(gte(formSubmissions.createdAt, fromDate(filter.from)))
  if (filter.to) conditions.push(lte(formSubmissions.createdAt, toDate(filter.to)))

  const rows = await db
    .select()
    .from(formSubmissions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(formSubmissions.createdAt))
    .limit(MAX_ROWS)

  return rows.map((row) => ({
    id: row.id,
    form: row.form,
    locale: row.locale,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    message: row.message,
    region: row.region,
    workload: row.workload,
    workTime: row.workTime,
    attachmentName: row.attachmentName,
    fee: normalizeAmount(row.fee),
    profit: normalizeAmount(row.profit),
    notes: row.notes ?? "",
    isSpam: row.isSpam ?? false,
    pageUrl: row.pageUrl ?? "",
    gclid: row.gclid ?? "",
    createdAt: row.createdAt.toISOString(),
  }))
}

async function readFromJson(filter: FormSubmissionFilter): Promise<FormSubmission[]> {
  const rows = await readJsonRows()
  return rows
    .filter((row) => matchesFilter(row, filter))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, MAX_ROWS)
}

export async function getFormSubmissions(filter: FormSubmissionFilter): Promise<FormSubmission[]> {
  if (process.env.DATABASE_URL) {
    try {
      return await readFromDb(filter)
    } catch (error) {
      console.error("DB read failed, falling back to JSON storage:", error)
    }
  }
  return readFromJson(filter)
}

async function updateInDb(id: number, data: FormSubmissionFinancials): Promise<void> {
  const { db } = await import("@/lib/db")
  const { formSubmissions } = await import("@/lib/db/schema")
  const { eq } = await import("drizzle-orm")
  const set: Record<string, string | null> = {}
  if (data.fee !== undefined) set.fee = normalizeAmount(data.fee) || null
  if (data.profit !== undefined) set.profit = normalizeAmount(data.profit) || null
  if (data.notes !== undefined) set.notes = data.notes
  if (Object.keys(set).length === 0) return
  await db.update(formSubmissions).set(set).where(eq(formSubmissions.id, id))
}

async function updateInJson(id: number, data: FormSubmissionFinancials): Promise<boolean> {
  const rows = await readJsonRows()
  const row = rows.find((r) => Number(r.id) === id)
  if (!row) return false
  if (data.fee !== undefined) row.fee = normalizeAmount(data.fee)
  if (data.profit !== undefined) row.profit = normalizeAmount(data.profit)
  if (data.notes !== undefined) row.notes = data.notes
  await writeJsonRows(rows)
  return true
}

/**
 * Update admin-entered financial fields (Tasu/Kasum/Märkused) on a submission.
 * Returns false when the row does not exist or storage fails.
 */
export async function updateFormSubmission(id: number, data: FormSubmissionFinancials): Promise<boolean> {
  try {
    if (process.env.DATABASE_URL) {
      try {
        await updateInDb(id, data)
        return true
      } catch (error) {
        console.error("DB update failed, falling back to JSON storage:", error)
      }
    }
    return await updateInJson(id, data)
  } catch (error) {
    console.error("Failed to update form submission:", error)
    return false
  }
}

async function deleteFromDb(ids: number[]): Promise<void> {
  const { db } = await import("@/lib/db")
  const { formSubmissions } = await import("@/lib/db/schema")
  const { inArray } = await import("drizzle-orm")
  await db.delete(formSubmissions).where(inArray(formSubmissions.id, ids))
}

async function deleteFromJson(ids: number[]): Promise<void> {
  const doomed = new Set(ids.map(Number))
  const rows = await readJsonRows()
  await writeJsonRows(rows.filter((row) => !doomed.has(Number(row.id))))
}

/**
 * Delete submissions by id (admin "Kustuta valitud"). Unknown ids are ignored.
 * Returns false only when storage fails entirely.
 */
export async function deleteFormSubmissions(ids: number[]): Promise<boolean> {
  try {
    if (process.env.DATABASE_URL) {
      try {
        await deleteFromDb(ids)
        return true
      } catch (error) {
        console.error("DB delete failed, falling back to JSON storage:", error)
      }
    }
    await deleteFromJson(ids)
    return true
  } catch (error) {
    console.error("Failed to delete form submissions:", error)
    return false
  }
}

/**
 * Auto-reply cool-down ledger: has this e-mail address submitted this form
 * within the last `withinHours` hours? Used to send at most one auto-reply
 * per address per window. Call BEFORE saving the current submission.
 * Fails closed (returns true) when storage is unreachable, so an outage
 * suppresses auto-replies instead of multiplying them.
 */
export async function hasRecentSubmission(
  email: string,
  form: "contact" | "career",
  withinHours: number,
): Promise<boolean> {
  const emailLower = email.trim().toLowerCase()
  if (!emailLower) return true
  const threshold = new Date(Date.now() - withinHours * 3600_000)

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { formSubmissions } = await import("@/lib/db/schema")
      const { and, eq, gte, sql } = await import("drizzle-orm")
      const rows = await db
        .select({ id: formSubmissions.id })
        .from(formSubmissions)
        .where(and(
          eq(formSubmissions.form, form),
          gte(formSubmissions.createdAt, threshold),
          sql`lower(${formSubmissions.email}) = ${emailLower}`,
        ))
        .limit(1)
      return rows.length > 0
    } catch (error) {
      console.error("DB recent-submission check failed, falling back to JSON storage:", error)
    }
  }

  try {
    const rows = await readJsonRows()
    const thresholdMs = threshold.getTime()
    return rows.some((row) =>
      row.form === form
      && row.email.trim().toLowerCase() === emailLower
      && new Date(row.createdAt).getTime() >= thresholdMs
    )
  } catch {
    return true
  }
}
