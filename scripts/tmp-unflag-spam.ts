/**
 * TEMP (26.10.2026): kahe valepositiivse spämmimärke parandus.
 * #73 (Egor, RU ventilatsiooni-remondi päring) ja #58 (Ljudmila, katuse
 * diagnostika) määrati spämmiks kirillitsa-vokaalide vea tõttu (lib/spam.ts
 * parandatud + regressioonitestid). Mõlemale EI saadetud teavitus- ega
 * automaatvastuse e-kirja — kirja sisu väljastatakse, et saaks käsitsi vastata.
 */
import postgres from "postgres"
import { readFileSync } from "fs"

const IDS = [73, 58]

async function main() {
  const env = readFileSync(".env.local", "utf8")
  const url = env.match(/DATABASE_URL=(.+)/)?.[1]?.trim()
  if (!url) { console.log("NO DATABASE_URL"); process.exit(1) }
  const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 10 })
  try {
    const before = await sql`select id, name, email, is_spam, created_at from form_submissions where id = any(${IDS})`
    console.log("enne:", JSON.stringify(before.map((r) => ({ id: r.id, is_spam: r.is_spam }))))
    const upd = await sql`
      update form_submissions set is_spam = false
      where id = any(${IDS}) and is_spam = true
      returning id
    `
    console.log(`uuendatud: ${upd.length} rida (${upd.map((r) => "#" + r.id).join(", ")})`)
    const after = await sql`select id, is_spam from form_submissions where id = any(${IDS})`
    console.log("pärast:", JSON.stringify(after.map((r) => ({ id: r.id, is_spam: r.is_spam }))))
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
