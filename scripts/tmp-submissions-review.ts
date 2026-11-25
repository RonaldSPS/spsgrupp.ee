/** TEMP (26.10): spämmiks märgitut + kahtlaste kontaktiridade sisu kontroll. */
import postgres from "postgres"
import { readFileSync } from "fs"

async function main() {
  const env = readFileSync(".env.local", "utf8")
  const url = env.match(/DATABASE_URL=(.+)/)?.[1]?.trim()
  if (!url) { console.log("NO DATABASE_URL"); process.exit(1) }
  const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 10 })
  try {
    console.log("== Kõik spam=true read ==")
    const spam = await sql`
      select id, form, name, email, message, page_url, source, created_at
      from form_submissions where is_spam = true order by created_at desc
    `
    for (const r of spam) {
      console.log(`\n#${r.id} ${r.form} ${r.created_at.toISOString()} ${r.name} <${r.email}>`)
      console.log(`  url=${r.page_url ?? "-"} src=${r.source || "-"}`)
      console.log(`  message: ${String(r.message ?? "").slice(0, 400)}`)
    }

    console.log("\n\n== Kahtlased contact-read (tööotsija-muster?) #59,#67,#70 + viimased 10 kontakti ==")
    const sus = await sql`
      select id, name, email, message, page_url, source, created_at
      from form_submissions
      where form = 'contact' and is_spam = false
      order by created_at desc limit 12
    `
    for (const r of sus) {
      console.log(`\n#${r.id} ${r.created_at.toISOString()} ${r.name} <${r.email}>`)
      console.log(`  message: ${String(r.message ?? "").slice(0, 300)}`)
    }
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
