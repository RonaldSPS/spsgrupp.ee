/** Kiirtest: terve nädalaraporti e-kirja renderdus koos GBP-sektsiooniga (mock snapshot). */
import { buildReportEmail } from "../lib/reporting/email-html"

async function main() {
  const mock = {
    id: 999,
    generatedAt: new Date().toISOString(),
    narrative: null,
    insights: [],
    snapshot: {
      generatedAt: new Date().toISOString(),
      period: { start: "2026-10-13", end: "2026-10-19", prevStart: "2026-10-06", prevEnd: "2026-10-12" },
      errors: [],
    },
  } as never
  const mail = await buildReportEmail(mock, "https://spsgrupp.ee/spsadmn/raportid/999/")
  const lines = mail.text.split("\n")
  const i = lines.findIndex((l) => l.includes("SISU JA GBP"))
  console.log(lines.slice(i, i + 8).join("\n"))
  console.log("--- HTML sisaldab sektsiooni:", mail.html.includes("j&#228;rgmise") || mail.html.includes("järgmise"))
  process.exit(0)
}
main()
