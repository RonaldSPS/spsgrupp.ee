/**
 * TEMP (26.10.2026): kontaktivormi täielik live-test puhtas (värske profiiliga,
 * laiendusteta) päris Chrome'is — nagu kliendi juhistus: spämmifiltrit ega
 * Turnstile'i EI lülitata välja, test läbib kogu ahela.
 *
 * Kontrollib: (1) Turnstile token tekib, (2) saatmine õnnestub UI-s,
 * (3) rida salvestub form_submissions tabelisse, (4) teavitus- ja
 * automaatvastuse e-kirjad on Resendis olemas (või vähemalt vastu võetud).
 *
 * Testrida on filtreeritud raportitest: sõnum algab „See on päringu proov"
 * (isTestSubmission) ja kustutatakse --delete-test-rows mustriga.
 *
 * Käivita: npx tsx scripts/tmp-live-form-test.ts
 */
import { chromium } from "playwright"
import postgres from "postgres"
import { readFileSync, existsSync } from "fs"

const SITE = process.env.TEST_SITE ?? "https://spsgrupp.ee"
const TEST = {
  name: "Test Diagnostika",
  email: "test@outline.ee",
  phone: "+372 5000 0000",
  company: "Outline Test",
  message: "See on päringu proov — kontrollin veebivormi saatmist, salvestumist ja e-kirja kohaletoimetamist (26.10.2026). Palun mitte vastata.",
}

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
  console.log(`Live-vormi test: ${SITE}/kontakt/ (puhas Chrome, headed)`)
  /* Püsiv VÄRSKE profiil (puhas brauser: pole laiendusi ega ajalugu) +
   * automation-flagid maha — muidu Turnstile'i bot-detection jääb tokenit
   * andmata ja vorm failib closed (dokumenteeritud 18.09 gotcha). */
  const profileDir = `.secrets/tmp-formtest-profile-${Date.now()}`
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: "chrome",
    headless: false,
    locale: "et-EE",
    ignoreDefaultArgs: ["--enable-automation"],
    args: ["--disable-blink-features=AutomationControlled"],
  })
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false })
  })
  const page = context.pages()[0] ?? (await context.newPage())

  let uiSuccess = false
  try {
    await page.goto(`${SITE}/kontakt/`, { waitUntil: "domcontentloaded", timeout: 45000 })

    /* Küpsisebänner — keela (vaikegating jääb samaks, bänner ei kata vormi). */
    const bannerBtn = page.locator("text=/^Keeldun$/").first()
    if (await bannerBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await bannerBtn.click()
      console.log("- küpsisebänner: keelatud")
    }

    /* Turnstile widget + tokeni ootamine. */
    const widget = page.locator(".cf-turnstile")
    if ((await widget.count()) > 0) {
      console.log("- Turnstile widget: renderdunud (sitekey olemas)")
      try {
        await page.waitForFunction(
          () => {
            const el = document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null
            return Boolean(el && el.value.length > 10)
          },
          undefined,
          { timeout: 45_000 },
        )
        console.log("- Turnstile token: OLEMAS")
      } catch {
        console.log("- ✗ Turnstile tokenit ei tekkinud 45 s jooksul — bot-detection ei lase läbi; saatmist EI proovita")
        await context.close()
        process.exitCode = 2
        return
      }
    } else {
      console.log("- Turnstile widget puudub (võti pole buildis) — serveris no-op")
    }

    /* Vormi täitmine (inimtempo — timing-trap nõuab >3 s). */
    await page.locator("#form-name").click()
    await page.locator("#form-name").pressSequentially(TEST.name, { delay: 45 })
    await page.locator("#form-email").pressSequentially(TEST.email, { delay: 35 })
    await page.locator("#form-phone").pressSequentially(TEST.phone, { delay: 35 })
    await page.locator("#form-company").pressSequentially(TEST.company, { delay: 35 })
    await page.locator("#form-message").pressSequentially(TEST.message, { delay: 5 })
    /* Privaatsusnõusolek (kohustuslik) — klõps sildi peal. */
    const privacy = page.locator('input[name="privacy_consent"]')
    if ((await privacy.count()) > 0) {
      await privacy.check({ force: true }).catch(async () => {
        await page.locator("label", { has: privacy }).click()
      })
      console.log("- privaatsusnõusolek: märgitud")
    }
    await page.waitForTimeout(1500)
    await page.locator('button[type="submit"]').click()

    const ok = page.locator('p[role="status"]')
    const err = page.locator('p[role="alert"]')
    const race = await Promise.race([
      ok.waitFor({ state: "visible", timeout: 30_000 }).then(() => "ok" as const),
      err.waitFor({ state: "visible", timeout: 30_000 }).then(() => "err" as const),
    ]).catch(() => "timeout" as const)
    if (race === "ok") {
      uiSuccess = true
      console.log(`- UI õnnestus: „${(await ok.textContent())?.trim().slice(0, 80)}"`)
    } else if (race === "err") {
      console.log(`- ✗ UI viga: „${(await err.textContent())?.trim()}"`)
    } else {
      console.log("- ✗ ei õnnestus- ega veateadet 30 s jooksul")
    }
  } finally {
    await context.close()
  }

  if (!uiSuccess) {
    console.log("\nTest ebaõnnestus UI tasemel — DB/Resend kontrolli ei tehta.")
    process.exitCode = 1
    return
  }

  /* DB salvestus */
  const env = readFileSync(".env.local", "utf8")
  const url = env.match(/DATABASE_URL=(.+)/)?.[1]?.trim()
  if (url) {
    const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 10 })
    try {
      const rows = await sql`
        select id, form, is_spam, source, page_url, message, created_at
        from form_submissions
        where email = ${TEST.email} and name = ${TEST.name}
        order by created_at desc limit 1
      `
      if (rows.length === 0) {
        console.log("- ✗ DB: testrida EI salvestunud!")
        process.exitCode = 1
      } else {
        const r = rows[0]
        console.log(`- DB: rida #${r.id} salvestatud (form=${r.form}, spam=${r.is_spam}, src=${r.source || "-"}, ${r.created_at.toISOString()})`)
        console.log(`  page_url=${r.page_url}`)
        if (r.is_spam) { console.log("  ✗ määrati spämmiks — ei tohiks!"); process.exitCode = 1 }
      }
    } finally {
      await sql.end({ timeout: 5 })
    }
  } else {
    console.log("- DATABASE_URL puudub — DB kontroll vahele")
  }

  /* Resend: viimased kirjad */
  const resendKey = process.env.RESEND_API_KEY ?? process.env.Resend_API
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails?limit=10", {
      headers: { Authorization: `Bearer ${resendKey}` },
    })
    if (res.ok) {
      const data = (await res.json()) as { data?: { id: string; to: string[]; subject: string; created_at: string; last_event?: string }[] }
      const cutoff = new Date(Date.now() - 10 * 60_000)
      const recent = (data.data ?? []).filter((e) => new Date(e.created_at) > cutoff)
      console.log(`- Resend: viimase 10 min kirjad (${recent.length}):`)
      for (const e of recent) console.log(`    ${e.created_at} → ${e.to?.join(",")} | ${e.subject} | ${e.last_event ?? "?"}`)
      const notif = recent.find((e) => e.to?.some((t) => t.includes("spsgrupp")))
      const autoreply = recent.find((e) => e.to?.some((t) => t.includes(TEST.email)))
      console.log(`  teavitus-kiri: ${notif ? "OLEMAS" : "? (ei leitud)"}, automaatvastus: ${autoreply ? "OLEMAS" : "? (ei leitud)"}`)
    } else {
      console.log(`- Resend API viga ${res.status}: ${(await res.text()).slice(0, 200)}`)
    }
  } else {
    console.log("- RESEND_API_KEY puudub — e-kirja kontroll vahele")
  }

  console.log("\nPuhastus: npx tsx scripts/check-recent-submissions.ts --delete-test-rows")
  const { rmSync } = await import("fs")
  try { rmSync(profileDir, { recursive: true, force: true }) } catch { /* jäädvustamata */ }
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
