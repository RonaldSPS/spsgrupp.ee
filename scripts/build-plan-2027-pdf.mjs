import { chromium } from "playwright"
import { pathToFileURL } from "url"
import { resolve } from "path"

const src = resolve("raportid/turunduse-tegevusplaan-2027-2026-10-21.html")
const out = resolve("raportid/turunduse-tegevusplaan-2027-2026-10-21.pdf")

async function launch() {
  try {
    return await chromium.launch({ channel: "chrome" })
  } catch {
    return await chromium.launch()
  }
}

const browser = await launch()
try {
  const page = await browser.newPage()
  await page.goto(pathToFileURL(src).href, { waitUntil: "networkidle" })
  await page.pdf({
    path: out,
    format: "A4",
    printBackground: true,
    margin: { top: "16mm", bottom: "16mm", left: "12mm", right: "12mm" },
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-family:'Segoe UI',Arial,sans-serif;font-size:7.5pt;color:#8fa4b8;width:100%;padding:0 12mm;display:flex;justify-content:space-between"><span>SPS GRUPP — TURUNDUSE TEGEVUSPLAAN 2027</span><span>Outline · 21.10.2026</span></div>`,
    footerTemplate: `<div style="font-family:'Segoe UI',Arial,sans-serif;font-size:7.5pt;color:#8fa4b8;width:100%;padding:0 12mm;display:flex;justify-content:space-between"><span>Konfidentsiaalne</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  })
  console.log("PDF OK:", out)
} finally {
  await browser.close()
}
