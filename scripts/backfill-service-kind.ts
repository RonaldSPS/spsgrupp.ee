import { existsSync, readFileSync } from "node:fs"

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const i = t.indexOf("=")
    if (i > 0 && process.env[t.slice(0, i).trim()] === undefined) process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
}

async function main() {
  const { getFormSubmissions, updateFormSubmission } = await import("../lib/form-submissions")
  const { classifyServiceKindForFilter } = await import("../lib/reporting/forms")

  const rows = await getFormSubmissions({})
  const toUpdate = rows.filter((r) => !r.serviceKind && r.form === "contact")

  console.log(`Found ${toUpdate.length} contact rows without serviceKind`)
  let updated = 0
  for (const row of toUpdate) {
    const kind = classifyServiceKindForFilter(row)
    if (kind === "other" && !row.serviceKind) {
      // still update so job seekers etc. show under "Muu"
    }
    const ok = await updateFormSubmission(row.id, { serviceKind: kind })
    if (ok) {
      updated++
      console.log(`#${row.id} → ${kind}`)
    } else {
      console.error(`#${row.id} failed`)
    }
  }
  console.log(`Updated ${updated} rows`)
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
