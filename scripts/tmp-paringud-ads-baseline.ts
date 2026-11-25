/**
 * TEMP (analüüs 14.10.2026): päringute (paringud) baasjoon Google Ads
 * paralleelse seadistuse planeerimiseks.
 *  - 90p aken 2026-07-15 → 2026-10-12 (sama mis Ads digest)
 *  - päris kontaktpäringud: mitte-spämm − testid − tööotsingud
 *  - Adsist tulnud päringud (source=google_ads või gclid) + hoolduskoristuse klass
 *  - gclid-päringute nädalad pärast 25.09 (offline-importi kontroll)
 * Klassifikatsiooni regexid on 1:1 koopiad lib/reporting/forms.ts seisuga 14.10.2026
 * (tmp-skript, et lib-i ei muudetaks).
 * Käivita: npx tsx scripts/tmp-paringud-ads-baseline.ts
 */
import postgres from "postgres"
import { readFileSync } from "node:fs"

/* --- 1:1 koopiad lib/reporting/forms.ts (14.10.2026) --- */
const MAINTENANCE_SIGNAL =
  /(\d+\s*[x×]|korda?|korduvalt)\s*(nädalas|ndalas|kuus|kuu\b|kvartalis|kvartali|aastas)|regulaar\w*|hooldus\w*|leping\w*|igapäev\w*|püsiv\w*|pideva?t|graafik\w*|nädalas|ndalas/i
const ONEOFF_SIGNAL =
  /ühekord\w*|ehitusjärg\w*|remondijärg\w*|kolimisjärg\w*|suurpuhast\w*|akende?\s+(pesu|pesemine|puhastus)|vaip\w*|diivan\w*|mööbl\w*|lammut\w*|ehitusprahi|jäätme\w*|ventilatsiooni|gra?ffiti?|lum\w+\s*koristus|süvapesu|süvapuhastus|põhjalik\w*\s+\w*(puhastus|koristus)|tänavakiv\w*|asfal\w*|sammal\w*|samblik\w*|survepesu|kõrgsurve\w*|fassaad\w*|kõnnitee\w*|muruniit\w*|muru\s*niit\w*|heki?\w*\s*(lõik|korrast)\w*/i
const PREMISES_SIGNAL =
  /kontor\w*|büroo\w*|äripind\w*|äriruum\w*|kaubandus\w*|kauplus\w*|laos?\b|lao\w*|tootmis\w*|tootmishoone\w*|restoran\w*|kohvik\w*|hoone\w*|trepi\w*|ühistu\w*|korteriühistu\w*|ruum\w*|põrand\w*|\bwc\b|tualet\w*|saal\w*/i
const TEST_ACTOR = /outline/i
const TEST_MESSAGE = /^\s*(test|testing|testimine|testimaks)\b|päringu?\s+proov\b/i
const JOB_BOARD_REFERRAL =
  /^referral:(www\.)?(tootukassa\.ee|cv\.ee|cvkeskus\.ee|cvonline\.|indeed\.|monster\.|goworkabit\.|tööportaal)/i
const JOB_TITLE_MESSAGE =
  /^\s*(housekeeping|cleaner|cleaning\s*(lady|man|person)|koristaja\p{L}*|puhastaja\p{L}*|valvekoristaja\p{L}*|kojamees|hooldaja\p{L}*|уборщик\p{L}*|уборщиц\p{L}*)\s*[.!]?\s*$/iu
const JOB_INTENT_MESSAGE =
  /tööd\s+otsi|otsin\s+tööd|tööotsing|tööle\s+asum|vabu?\s+töökoh\w*|looking\s+for\s+(a\s+)?(job|work)|seeking\s+(a\s+)?(job|work)|job\s+application|ищу\s+работу|нужна\s+работу/i

type Row = {
  id: number
  form: string
  company: string
  name: string
  email: string
  message: string
  is_spam: boolean
  source: string
  gclid: string
  fee: string | null
  profit: string | null
  created_at: Date
}
const isTest = (r: Row) => TEST_ACTOR.test(r.company) || TEST_ACTOR.test(r.name) || TEST_ACTOR.test(r.email) || TEST_MESSAGE.test(r.message)
const isJobSeeker = (r: Row) =>
  r.form === "contact" && (JOB_BOARD_REFERRAL.test(r.source) || JOB_TITLE_MESSAGE.test(r.message) || JOB_INTENT_MESSAGE.test(r.message))
const classify = (r: Row): "yes" | "likely" | "no" => {
  if (MAINTENANCE_SIGNAL.test(r.message)) return "yes"
  if (ONEOFF_SIGNAL.test(r.message)) return "no"
  if (r.company.trim() && PREMISES_SIGNAL.test(r.message)) return "likely"
  return "no"
}

async function main() {
  const env = readFileSync(".env.local", "utf8")
  const url = env.match(/DATABASE_URL=(.+)/)?.[1]?.trim()
  if (!url) {
    console.log("NO DATABASE_URL")
    process.exit(1)
  }
  const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 10 })
  try {
    const rows = (await sql`
      select id, form, company, name, email, message, is_spam, source, gclid, fee, profit, created_at
      from form_submissions
      where created_at >= '2026-07-15' and created_at < '2026-10-13'
      order by created_at
    `) as Row[]

    const spam = rows.filter((r) => r.is_spam)
    const contact = rows.filter((r) => r.form === "contact" && !r.is_spam)
    const tests = contact.filter(isTest)
    const jobSeekers = contact.filter((r) => !isTest(r) && isJobSeeker(r))
    const real = contact.filter((r) => !isTest(r) && !isJobSeeker(r))
    const career = rows.filter((r) => r.form === "career" && !r.is_spam)
    const viaAds = real.filter((r) => r.source === "google_ads" || r.gclid)
    const withGclid = real.filter((r) => r.gclid)

    console.log(`# Päringute baas 15.07–12.10.2026`)
    console.log(`Kokku ridu: ${rows.length} (spämm: ${spam.length})`)
    console.log(`Kontaktivorm (mitte-spämm): ${contact.length}  — testid: ${tests.length}, tööotsingud: ${jobSeekers.length}`)
    console.log(`PÄRIS kontaktpäringud: ${real.length}`)
    console.log(`Töövorm (mitte-spämm): ${career.length}`)
    console.log(``)
    console.log(`## Päris päringud allika järgi`)
    const bySource = new Map<string, number>()
    for (const r of real) bySource.set(r.source || "(teadmata)", (bySource.get(r.source || "(teadmata)") ?? 0) + 1)
    for (const [s, n] of [...bySource.entries()].sort((a, b) => b[1] - a[1])) console.log(`- ${s}: ${n}`)
    console.log(``)
    console.log(`## Adsist tulnud päris päringud (source=google_ads või gclid): ${viaAds.length}`)
    const cls = { yes: 0, likely: 0, no: 0 }
    for (const r of viaAds) cls[classify(r)] += 1
    console.log(`- hoolduskoristus JAH: ${cls.yes} · TÕENÄOLINE: ${cls.likely} · EI: ${cls.no}`)
    console.log(`- neist gclid-ga: ${withGclid.length}`)
    let feeSum = 0
    let feeN = 0
    for (const r of viaAds) {
      const f = Number(r.fee)
      if (Number.isFinite(f) && r.fee !== null) {
        feeSum += f
        feeN += 1
      }
    }
    console.log(`- Tasu täidetud ${feeN} päringul, kokku €${feeSum.toFixed(2)}`)
    console.log(``)
    console.log(`## Kõik päris päringud hoolduskoristuse klassi järgi`)
    const clsAll = { yes: 0, likely: 0, no: 0 }
    for (const r of real) clsAll[classify(r)] += 1
    console.log(`- JAH: ${clsAll.yes} · TÕENÄOLINE: ${clsAll.likely} · EI: ${clsAll.no}`)
    console.log(``)
    console.log(`## Ads-päringute loend (id · kuupäev · klass · gclid · allikas · firma · sõnumi algus)`)
    for (const r of viaAds) {
      const msg = r.message.replace(/\s+/g, " ").slice(0, 90)
      console.log(`- #${r.id} ${r.created_at.toISOString().slice(0, 10)} ${classify(r).toUpperCase()} gclid=${r.gclid ? "jah" : "ei"} src=${r.source || "-"} ${r.company || "-"}: ${msg}`)
    }
    console.log(``)
    console.log(`## gclid-päringud nädalate kaupa alates 25.09 (offline-import läks live 25.09)`)
    const g2 = (await sql`
      select date_trunc('week', created_at) as week, count(*)::int as n
      from form_submissions
      where form = 'contact' and is_spam = false and gclid <> '' and created_at >= '2026-09-25'
      group by 1 order by 1
    `) as { week: Date; n: number }[]
    for (const w of g2) console.log(`- nädal ${w.week.toISOString().slice(0, 10)}: ${w.n}`)
    const totalGclidAllTime = await sql`select count(*)::int as n from form_submissions where form='contact' and is_spam=false and gclid <> ''`
    console.log(`gclid-päringuid KOKKU (kõik ajad): ${totalGclidAllTime[0].n}`)
  } finally {
    await sql.end()
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
