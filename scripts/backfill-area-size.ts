import { existsSync, readFileSync } from "node:fs"

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const i = t.indexOf("=")
    if (i > 0 && process.env[t.slice(0, i).trim()] === undefined) process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
}

const AREA_UNIT_RE = /(\d[\d\s.,'′＇`]*)(?:\s*[x×]\s*(\d[\d\s.,'′＇`]*))?\s*(?:m²|m2|m\^2|ruutmeetrit?|ruutm?|кв\.?\s*м|м²|м2|kvm|m 2)/gi

function normalizeDigits(raw: string): string {
  return raw.replace(/[\s'′＇`]/g, "").replace(",", ".")
}

function extractArea(message: string): string | null {
  const found: number[] = []
  let m: RegExpExecArray | null
  while ((m = AREA_UNIT_RE.exec(message)) !== null) {
    const first = normalizeDigits(m[1])
    let value = Number(first)
    if (m[2]) {
      // "10 x 20 m²" -> area = 200
      const second = normalizeDigits(m[2])
      value = Number(first) * Number(second)
    }
    if (Number.isFinite(value) && value > 0 && value < 1_000_000) {
      found.push(Math.round(value))
    }
  }
  if (found.length === 0) return null
  // When multiple areas appear, the largest is usually the total/main cleanable area.
  return String(Math.max(...found))
}

async function main() {
  const apply = process.argv.includes("--apply")
  const { getFormSubmissions, updateFormSubmission } = await import("../lib/form-submissions")
  const rows = (await getFormSubmissions({ form: "contact" })).filter((r) => !r.areaSize)
  console.log(`Found ${rows.length} contact rows without areaSize`)

  let updated = 0
  let skipped = 0
  for (const row of rows) {
    const area = extractArea(row.message)
    if (!area) {
      skipped++
      continue
    }
    if (apply) {
      const ok = await updateFormSubmission(row.id, { areaSize: area })
      if (ok) {
        updated++
        console.log(`#${row.id} → ${area} m²`)
      } else {
        console.error(`#${row.id} failed`)
      }
    } else {
      updated++
      console.log(`#${row.id} would update → ${area} m²: ${row.message.slice(0, 100).replace(/\s+/g, " ")}`)
    }
  }
  console.log(`\n${apply ? "Updated" : "Would update"}: ${updated}, skipped: ${skipped}`)
  if (!apply) {
    console.log("Run with --apply to persist changes.")
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
