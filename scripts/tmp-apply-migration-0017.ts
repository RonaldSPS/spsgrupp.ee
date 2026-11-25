/** TEMP (09.11): rakendab drizzle/0017_case_study_hero_position.sql live-baasi + verifitseerib. */
import postgres from "postgres"
import { readFileSync } from "fs"

async function main() {
  const env = readFileSync(".env.local", "utf8")
  const url = env.match(/DATABASE_URL=(.+)/)?.[1]?.trim()
  if (!url) { console.log("NO DATABASE_URL"); process.exit(1) }
  const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 15 })
  try {
    const migration = readFileSync("drizzle/0017_case_study_hero_position.sql", "utf-8")
    await sql.unsafe(migration)
    console.log("migratsioon rakendatud")
    const cols = await sql`
      select column_name from information_schema.columns
      where table_name = 'case_study_edits' and column_name = 'hero_position'
    `
    console.log("hero_position veerg olemas:", cols.length === 1)
    if (cols.length !== 1) { process.exitCode = 1 }
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
