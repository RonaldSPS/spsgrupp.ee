/**
 * Tekstivormingud kliendilugude admin-redaktori jaoks.
 *
 * Faktid ja KKK hoitakse baasandmetes struktureerituna, aga admin redigeerib
 * neid lihtsa tekstivorminguna (ei eelda JSON-oskust):
 *
 *   facts-text: iga rida kujul  "Silt = Väärtus"
 *   faq-text:   plokid eraldatud tühja reaga; plokis "K: küsimus" ja "V: vastus"
 *               (V võib koosneda mitmest reast)
 *
 * Puhtad funktsioonid — kasutatav nii serveris kui admin-kliendis.
 */

export interface CaseStudyFact {
  label: string
  value: string
}

export interface CaseStudyFaq {
  q: string
  a: string
}

export function factsToText(facts: CaseStudyFact[]): string {
  return facts.map((f) => `${f.label} = ${f.value}`).join("\n")
}

export function textToFacts(text: string): CaseStudyFact[] {
  return (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf("=")
      if (idx === -1) return { label: line, value: "" }
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() }
    })
    .filter((f) => f.label && f.value)
    .slice(0, 30)
}

export function faqToText(faq: CaseStudyFaq[]): string {
  return faq.map((item) => `K: ${item.q}\nV: ${item.a}`).join("\n\n")
}

export function textToFaq(text: string): CaseStudyFaq[] {
  const out: CaseStudyFaq[] = []
  for (const block of (text || "").split(/\n\s*\n/)) {
    const lines = block.split("\n")
    let q = ""
    const aLines: string[] = []
    let mode: "none" | "q" | "a" = "none"
    for (const raw of lines) {
      const line = raw.trimEnd()
      if (/^K[:：]\s*/i.test(line)) {
        mode = "q"
        q = line.replace(/^K[:：]\s*/i, "").trim()
      } else if (/^V[:：]\s*/i.test(line)) {
        mode = "a"
        aLines.push(line.replace(/^V[:：]\s*/i, "").trim())
      } else if (mode === "a") {
        aLines.push(line.trim())
      } else if (mode === "q") {
        q += " " + line.trim()
      }
    }
    const a = aLines.join(" ").replace(/\s+/g, " ").trim()
    if (q && a) out.push({ q, a })
  }
  return out.slice(0, 12)
}
