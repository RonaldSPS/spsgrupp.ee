const fs = require("fs")
const path = require("path")
const env = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
const dbUrl = env.match(/^DATABASE_URL=(.+)$/m)[1].trim()
const postgres = require("postgres")

async function main() {
  const sql = postgres(dbUrl, { max: 1 })
  const rows = await sql`SELECT id, slug, hero_image, active, updated_at FROM case_study_edits`
  console.log(JSON.stringify(rows, null, 1))
  await sql.end()
}

main().catch((e) => { console.error("ERR", e.message); process.exit(1) })
