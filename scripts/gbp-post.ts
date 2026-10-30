/**
 * GBP postitus brauseri-automaatikaga (GBP API projektil on 429-kvoot —
 * seetõttu käib haldus püsiva Chrome'i profiiliga, vt AGENTS.md).
 *
 *   npx tsx scripts/gbp-post.ts --check              # ainult olek + screenshot
 *   npx tsx scripts/gbp-post.ts --publish            # avaldab kalendri JÄRGMISE nädala postituse
 *   npx tsx scripts/gbp-post.ts --publish --week=2026-11-02
 *
 * Turvameetmed: enne avaldamist tehakse igast sammust screenshot tmp/gbp-*.png
 * ja kontrollitakse, et valitud asukoht on SPS Grupp (konto haldab ka võrsaid
 * profiile). Photo jääb vahele, kui kalendris pole faili rada (foto tuleb
 * kliendilt). --publish nõuab, et profiil oleks sisse logitud.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs"
import path from "node:path"

const PROFILE_DIR = path.join(process.cwd(), ".secrets", "gbp-profile")
const SHOTS = path.join(process.cwd(), "tmp")
const GBP_LOCATION_ID = "79940120818315771" // SPS Grupp (AGENTS.md)

const args = process.argv.slice(2)
const MODE = args.includes("--publish") ? "publish" : args.includes("--explore") ? "explore" : "check"
const weekArg = args.find((a) => a.startsWith("--week="))?.split("=")[1]

interface GbpCalendarWeek {
  weekStart: string
  theme: string
  post?: { text: string; ctaUrl?: string; photoIdea?: string }
}

function pickWeek(): GbpCalendarWeek {
  const cal = JSON.parse(readFileSync("data/gbp-calendar.json", "utf8"))
  const weeks: GbpCalendarWeek[] = cal.weeks
  if (weekArg) {
    const w = weeks.find((w) => w.weekStart === weekArg)
    if (!w) throw new Error(`Nädalat ${weekArg} pole kalendris`)
    return w
  }
  // Järgmine nädal (raporti loogika: reedeti postitatakse järgmise nädala oma)
  const now = new Date()
  const day = now.getDay() === 0 ? 7 : now.getDay()
  const nextMonday = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + (8 - day)))
  const iso = nextMonday.toISOString().slice(0, 10)
  const w = weeks.find((w) => w.weekStart === iso)
  if (!w) throw new Error(`Järgmist nädalat (${iso}) pole kalendris`)
  return w
}

async function main() {
  const { chromium } = await import("playwright-core")
  mkdirSync(SHOTS, { recursive: true })
  if (!existsSync(PROFILE_DIR)) throw new Error(".secrets/gbp-profile puudub — käsitsi sisselogimine on tegemata")

  const week = pickWeek()
  console.log(`Režiim: ${MODE}; kalendrinädal ${week.weekStart} — „${week.theme}"`)

  const ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: "chrome",
    headless: false,
    viewport: { width: 1366, height: 900 },
    locale: "et-EE",
    args: ["--disable-blink-features=AutomationControlled"],
  })
  const page = ctx.pages()[0] ?? (await ctx.newPage())

  // Avame esmalt kontojõ armatuurlaua — sealt leiame SPS Grupi asukoha
  await page.goto("https://business.google.com/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  })
  await page.waitForTimeout(6000)
  await page.screenshot({ path: path.join(SHOTS, "gbp-01-opened.png"), fullPage: true })
  console.log("URL peale avamist:", page.url())

  if (/accounts\.google\.com|signin/i.test(page.url())) {
    console.error("PROFIIL POLE SISSE LOGITUD — ava brauser käsitsi, logi sisse, ja jooksuta uuesti.")
    await page.screenshot({ path: path.join(SHOTS, "gbp-login-needed.png") })
    await ctx.close()
    process.exit(2)
  }

  if (MODE === "check" || MODE === "explore") {
    // Ava SPS GRUPP OÜ rida (konto haldab ka võrseid profiile — vali täpse nimega)
    const row = page.getByText("SPS GRUPP", { exact: false }).first()
    await row.waitFor({ timeout: 20000 })
    await row.click()
    await page.waitForTimeout(6000)
    await page.screenshot({ path: path.join(SHOTS, "gbp-02-business.png"), fullPage: true })
    // Ava „Postitused" vaade
    const postsBtn = page.getByRole("button", { name: /^Postitused$/ }).first()
    if (await postsBtn.isVisible().catch(() => false)) {
      await postsBtn.click()
      await page.waitForTimeout(5000)
      await page.screenshot({ path: path.join(SHOTS, "gbp-03-posts.png"), fullPage: false })
      console.log("Postituste vaade avatud.")
    } else {
      console.log('„Postitused" nuppu ei leitud — vaata gbp-02-business.png')
    }
    console.log("CHECK OK — SPS avatud. URL:", page.url())
    await ctx.close()
    return
  }

  /* ---------- publish ---------- */
  const post = week.post
  if (!post?.text) throw new Error("Sellel nädalal pole kalendris postitusteksti")

  // Ava SPS GRUPP OÜ (konto haldab ka võrseid profiile — vali täpse nimega)
  const row = page.getByText("SPS GRUPP", { exact: false }).first()
  await row.waitFor({ timeout: 20000 })
  await row.click()
  await page.waitForTimeout(6000)

  // „Postitused" → uuenduste paneel on iframe (/local/business/<id>/promote/updates)
  const postsBtn = page.getByRole("button", { name: /^Postitused$/ }).first()
  await postsBtn.waitFor({ timeout: 20000 })
  await postsBtn.click()
  await page.waitForTimeout(6000)
  await page.screenshot({ path: path.join(SHOTS, "gbp-03-posts.png"), fullPage: false })

  const bizFrame = page.frames().find((f) => f.url().includes(`/local/business/${GBP_LOCATION_ID}/`))
  if (!bizFrame) {
    console.error("TURVAPEATUS: SPS äri-freimi ei leitud — EI avalda. Freimid:", page.frames().map((f) => f.url().slice(0, 100)))
    await ctx.close()
    process.exit(4)
  }

  const createBtn = bizFrame.getByRole("button", { name: /lisa postitus/i }).first()
  await createBtn.waitFor({ timeout: 20000 })
  await createBtn.click()
  await page.waitForTimeout(4000)
  await page.screenshot({ path: path.join(SHOTS, "gbp-04-dialog.png") })

  // Tekstiväli (uuenduse dialoogis on textarea — samuti freimi sees)
  const textbox = bizFrame.locator("textarea").first()
  await textbox.waitFor({ timeout: 15000 })
  await textbox.fill(post.text)
  await page.waitForTimeout(800)

  // CTA-nupp lingiga („+ Nupp" → „Lisateave" + link)
  if (post.ctaUrl) {
    const addBtn = bizFrame.getByRole("button", { name: /^(\+?\s*)?nupp$/i }).first()
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click()
      await page.waitForTimeout(1500)
      const learnMore = bizFrame.getByText(/lisateave|küsi pakkumist/i).first()
      if (await learnMore.isVisible().catch(() => false)) await learnMore.click()
      await page.waitForTimeout(1000)
      const linkField = bizFrame.locator('input[type="url"], input[placeholder*="http"], input[aria-label*="link" i], input[aria-label*="URL" i]').first()
      if (await linkField.isVisible().catch(() => false)) {
        await linkField.fill(post.ctaUrl)
        await page.waitForTimeout(500)
      }
    }
  }
  await page.screenshot({ path: path.join(SHOTS, "gbp-05-filled.png") })

  // Turvakontroll: tekst peab päriselt väljas olema — tühja postitust ei avaldata
  const fieldValue = await textbox.inputValue().catch(() => "")
  if (!fieldValue.includes(post.text.slice(0, 40))) {
    console.error("TURVAPEATUS: tekstiväli ei sisalda postitusteksti — EI avalda. Vaata tmp/gbp-05-filled.png")
    await ctx.close()
    process.exit(3)
  }

  console.log("Tekst + CTA täidetud (verifitseeritud). Avaldan 15 s pärast — katkesta Ctrl+C, kui midagi on vale.")
  await page.waitForTimeout(15000)

  const publishBtn = bizFrame.getByRole("button", { name: /^postitus$/i }).first()
  await publishBtn.waitFor({ timeout: 15000 })
  await publishBtn.click()
  await page.waitForTimeout(8000)
  await page.screenshot({ path: path.join(SHOTS, "gbp-06-published.png") })
  console.log("AVALDATUD (kontrolli tmp/gbp-06-published.png). URL:", page.url())
  await ctx.close()
}

main().catch((e) => {
  console.error("GBP postituse viga:", e instanceof Error ? e.message : e)
  process.exit(1)
})
