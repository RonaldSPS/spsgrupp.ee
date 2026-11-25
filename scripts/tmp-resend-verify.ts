/** TEMP (26.10): Resend API — viimaste päris-päringute e-kirjade kohaletoimetamine. */
import { readFileSync, existsSync } from "fs"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq === -1) continue
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim()
    if (k && process.env[k] === undefined) process.env[k] = v
  }
}
loadEnvLocal()

async function main() {
  const key = process.env.RESEND_API_KEY ?? process.env.Resend_API
  if (!key) { console.log("RESEND_API_KEY puudub"); process.exit(1) }
  const res = await fetch("https://api.resend.com/emails?limit=25", { headers: { Authorization: `Bearer ${key}` } })
  if (!res.ok) { console.log(`Resend API ${res.status}: ${(await res.text()).slice(0, 300)}`); process.exit(1) }
  const data = (await res.json()) as { data?: { id: string; to: string[]; from: string; subject: string; created_at: string; last_event?: string }[] }
  const emails = data.data ?? []
  console.log(`Resend: viimased ${emails.length} kirja:`)
  for (const e of emails) {
    console.log(`- ${e.created_at} → ${e.to?.join(", ")} | ${e.subject?.slice(0, 70)} | event=${e.last_event ?? "?"}`)
  }
  // Kontroll: 18.10 Oliver Heliste (#71) ja 26.10 career (#74) kirjad
  const oliver = emails.filter((e) => e.subject?.includes("Oliver") || e.to?.some((t) => t.includes("diil.ai")))
  const career = emails.filter((e) => e.subject?.includes("Nazmus") || e.to?.some((t) => t.includes("siamahmed")))
  console.log(`\n#71 (18.10 kontakt, Oliver): ${oliver.length} kirja — ${oliver.map((e) => e.last_event).join(", ") || "-"}`)
  console.log(`#74 (26.10 career): ${career.length} kirja — ${career.map((e) => e.last_event).join(", ") || "-"}`)
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
