/* eslint-disable */
// Reproduce the user's career-form test against the LIVE site in a real browser.
// Watches: network failures (Turnstile/GTM), console errors, dataLayer events,
// and the final success/error UI state.
const { chromium } = require("playwright")

const PAGE = "https://spsgrupp.ee/kontakt/"

async function main() {
  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  })
  const page = await browser.newPage()

  const failedRequests = []
  page.on("requestfailed", (req) => {
    failedRequests.push(`${req.url()}  ->  ${req.failure()?.errorText}`)
  })
  const consoleErrors = []
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300))
  })
  page.on("response", (res) => {
    const ct = res.headers()["content-type"] || ""
    if (res.request().method() === "POST" && res.status() >= 400) {
      console.log(`POST ${res.url()} -> ${res.status()} (${ct})`)
    }
  })

  console.log("== open", PAGE)
  await page.goto(PAGE, { waitUntil: "domcontentloaded", timeout: 60000 })
  await page.waitForSelector('input[name="name"]', { timeout: 30000 })

  // Turnstile widget state before submit
  const turnstileInfo = await page.evaluate(() => {
    const div = document.querySelector(".cf-turnstile")
    const token = document.querySelector('input[name="cf-turnstile-response"]')
    const iframes = [...document.querySelectorAll("iframe")].map((f) => f.src).filter((s) => s.includes("cloudflare"))
    return {
      widgetDivPresent: !!div,
      tokenInputPresent: !!token,
      tokenValueLen: token ? token.value.length : -1,
      cloudflareIframes: iframes,
    }
  })
  console.log("turnstile before fill:", JSON.stringify(turnstileInfo))

  // Fill the contact form
  await page.fill('input[name="name"]', "Test Diagnostika")
  await page.fill('input[name="email"]', "test@outline.ee")
  await page.fill('input[name="phone"]', "+3725551234")
  await page.fill('input[name="company"]', "Outline Test")
  await page.fill('textarea[name="message"]', "GTM diagnostika test - palun ignoreerida seda päringut.")
  await page.check('input[name="privacy_consent"]')

  // Wait so the timing trap (3 s) can't trigger, and give Turnstile time.
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(2500)
    const len = await page.evaluate(() => {
      const token = document.querySelector('input[name="cf-turnstile-response"]')
      return token ? token.value.length : -1
    })
    console.log(`turnstile token length after ${(i + 1) * 2.5}s: ${len}`)
    if (len > 0) break
  }

  console.log("== submit")
  await page.click('button[type="submit"]')

  // Wait for the outcome
  const outcome = await page.waitForFunction(
    () => {
      const alert = document.querySelector('[role="alert"]')
      const status = document.querySelector('[role="status"]')
      if (alert && alert.textContent?.trim()) return { kind: "error", text: alert.textContent.trim() }
      if (status && status.textContent?.trim()) return { kind: "success", text: status.textContent.trim() }
      return null
    },
    { timeout: 30000 },
  ).catch(() => null)
  console.log("OUTCOME:", outcome ? JSON.stringify(await outcome.jsonValue()) : "(timeout — no alert/status appeared)")

  await page.waitForTimeout(1500)
  const dataLayer = await page.evaluate(() => (window.dataLayer || []).filter((e) => e && typeof e === "object" && (e.event === "form_submission_success" || e.event === "form_submit")))
  console.log("dataLayer form events:", JSON.stringify(dataLayer))

  console.log("\n== failed requests:")
  for (const f of failedRequests) console.log(" ", f)
  if (!failedRequests.length) console.log("  (none)")
  console.log("== console errors:")
  for (const e of consoleErrors) console.log(" ", e)
  if (!consoleErrors.length) console.log("  (none)")

  await browser.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
