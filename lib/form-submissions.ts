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
  createdAt: string
}

export interface FormSubmissionFilter {
  form?: "contact" | "career"
  from?: string
  to?: string
}

const MAX_ROWS = 2000

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
    return Array.isArray(rows) ? rows : []
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
