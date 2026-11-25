/** TEMP (26.10): rakendab drizzle/0014_submission_sales_fields.sql live-baasi + verifitseerib. */
import postgres from "postgres"
import { readFileSync } from "fs"

async function main() {
  const env = readFileSync(".env.local", "utf8")
  const url = env.match(/DATABASE_URL=(.+)/)?.[1]?.trim()
  if (!url) { console.log("NO DATABASE_URL"); process.exit(1) }
  const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 15 })
  try {
    const migration = readFileSync("drizzle/0014_submission_sales_fields.sql", "utf-8")
    await sql.unsafe(migration)
    console.log("migratsioon rakendatud")
    const cols = await sql`
      select column_name from information_schema.columns
      where table_name = 'form_submissions' and column_name in ('channel','service_kind','sales_status')
      order by column_name
    `
    console.log("veerud:", cols.map((c) => c.column_name).join(", "))
    if (cols.length !== 3) { console.log("✗ PUUDUVAD veerud!"); process.exitCode = 1 }

    /* smoke: käsitsi-rida sisse ja välja (kustutame kohe) */
    const ins = await sql`
      insert into form_submissions (form, locale, name, email, phone, company, message, channel, source, service_kind, sales_status)
      values ('contact', 'et', 'Migratsiooni Test', '', '+372 5000 001', 'Test OÜ', 'smoke-test 0014', 'phone', 'google_ads', 'maintenance', 'new')
      returning id
    `
    const id = ins[0].id as number
    const back = await sql`select channel, service_kind, sales_status from form_submissions where id = ${id}`
    console.log("smoke-rida:", JSON.stringify(back[0]))
    await sql`delete from form_submissions where id = ${id}`
    console.log("smoke-rida kustutatud — OK")
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
