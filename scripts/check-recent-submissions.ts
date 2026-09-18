import postgres from "postgres"
import { readFileSync } from "fs"

async function main() {
  const env = readFileSync(".env.local", "utf8")
  const url = env.match(/DATABASE_URL=(.+)/)?.[1]?.trim()
  if (!url) { console.log("NO DATABASE_URL"); process.exit(1) }

  const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 10 })
  try {
    const rows = await sql`
      select id, form, locale, name, email, is_spam, page_url, source, created_at
      from form_submissions
      order by created_at desc
      limit 15
    `
    if (rows.length === 0) console.log("(tühi — ühtegi rida pole)")
    for (const r of rows) {
      console.log(`${r.created_at.toISOString()}  #${r.id}  ${r.form}  spam=${r.is_spam}  ${r.name} <${r.email}>  src=${r.source || "-"}  url=${r.page_url || "-"}`)
    }

    const stats = await sql`
      select form, is_spam, count(*)::int as n, max(created_at) as latest
      from form_submissions
      group by form, is_spam
      order by form, is_spam
    `
    console.log("---")
    for (const s of stats) {
      console.log(`${s.form}  spam=${s.is_spam}  count=${s.n}  latest=${s.latest.toISOString()}`)
    }

    // Clean up the live form test row sent during this diagnostic session.
    if (process.argv.includes("--delete-test-rows")) {
      const del = await sql`
        delete from form_submissions
        where name = 'Test Diagnostika' and email = 'test@outline.ee'
        returning id
      `
      console.log(`--- kustutatud test-ridasid: ${del.length}`)
    }
  } finally {
    await sql.end()
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
