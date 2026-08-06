/**
 * i18n Parity Check Script
 *
 * Crawls localized ET/EN/RU pages from a running local server and compares:
 *   - data-section order and counts
 *   - pricing card counts
 *   - process step counts
 *   - FAQ item counts
 *   - CTA presence
 *   - Form presence
 *   - Basic HTML validation (lang, title, H1, canonical, hreflang, JSON-LD)
 *
 * Usage:
 *   npm run i18n:parity [-- --base-url=http://localhost:3000] [--strict]
 *
 * Exit code: 0 (pass) or 1 (fail in strict mode)
 * Output: writes raportid/i18n-parity-report.md
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const DEFAULT_BASE_URL = 'http://localhost:3000'
const ALL_LOCALES = ['et', 'en', 'ru'] as const
type Locale = (typeof ALL_LOCALES)[number]

interface PageCheck {
  etPath: string
  enPath: string
  ruPath: string
  status: Record<Locale, number | null>
  htmlLang: Record<Locale, string | null>
  title: Record<Locale, string | null>
  h1: Record<Locale, string | null>
  canonical: Record<Locale, string | null>
  hreflangOk: Record<Locale, boolean>
  jsonLdPresent: Record<Locale, boolean>
  sectionOrder: Record<Locale, string[]>
  sectionMatches: boolean
  pricingCardCount: Record<Locale, number>
  processStepCount: Record<Locale, number>
  faqCount: Record<Locale, number>
  hasCta: Record<Locale, boolean>
  hasForm: Record<Locale, boolean>
  pricingTexts: Record<Locale, string[]>
  hasEtTextOnNonEtPage: Record<Locale, boolean>
  errors: Record<Locale, string[]>
}

const etPaths = [
  '/',
  '/koristusteenus',
  '/koristusteenus/kontori-koristus',
  '/koristusteenus/kaubanduspindade-koristus',
  '/koristusteenus/tootmishoonete-koristus',
  '/koolide-koristamine',
  '/koristusteenus/valikoristus',
  '/koristusteenus/valikoristus/akende-pesu',
  '/koristusteenus/valikoristus/fassaadipesu',
  '/koristusteenus/valikoristus/grafiti-eemaldamine',
  '/koristusteenus/valikoristus/kojameheteenus',
  '/koristusteenus/valikoristus/lehtedekoristamine',
  '/koristusteenus/valikoristus/lumekoristus',
  '/koristusteenus/valikoristus/muruniitmine',
  '/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus',
  '/puhastusteenused',
  '/puhastusteenused/ehitusjargne-koristus',
  '/puhastusteenused/eskalaatorite-suvapuhastus',
  '/puhastusteenused/koroonaviiruse-jargne-puhastus',
  '/puhastusteenused/porandate-hooldus',
  '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine',
  '/puhastusteenused/vaipade-puhastus',
  '/remonditeenused-tallinnas',
  '/remonditeenused-tallinnas/elektritood',
  '/remonditeenused-tallinnas/torutood',
  '/remonditeenused-tallinnas/siseviimistlustood',
  '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus',
  '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus',
  '/remonditeenused-tallinnas/plaatimistood',
  '/remonditeenused-tallinnas/katuse-remont',
  '/remonditeenused-tallinnas/lammutustood',
  '/sps-grupp',
  '/kontakt',
  '/tule-meile-toole',
  '/ehitusprahi-aravedu',
  '/andmekaitsetingimused',
]

// Slug map is derived from lib/pages/registry via lib/slug-map — single
// source of truth. Do not hardcode localized paths in this script.
import { localizedPaths } from '../lib/slug-map'

interface Args {
  baseUrl: string
  strict: boolean
}

function parseArgs(): Args {
  const args = process.argv.slice(2)
  let baseUrl = DEFAULT_BASE_URL
  let strict = false
  for (const arg of args) {
    if (arg.startsWith('--base-url=')) {
      baseUrl = arg.slice('--base-url='.length)
    } else if (arg === '--strict') {
      strict = true
    }
  }
  return { baseUrl, strict }
}

async function fetchPage(url: string): Promise<{ text: string; status: number }> {
  try {
    const response = await fetch(url, { headers: { 'x-sps-locale': 'et' } })
    return { text: await response.text(), status: response.status }
  } catch {
    return { text: '', status: 0 }
  }
}

function extractHtmlLang(html: string): string | null {
  const m = html.match(/<html[^>]*lang="([^"]*)"/)
  return m ? m[1] : null
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title>([^<]*)<\/title>/)
  return m ? m[1].trim() : null
}

function extractH1(html: string): string | null {
  // H1s may contain nested markup (<br>, <span>) — match across tags and
  // strip inner elements to recover the visible text.
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
  if (!m) return null
  const text = m[1]
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return text || null
}

function extractCanonical(html: string): string | null {
  const m = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)
  return m ? m[1] : null
}

function extractHreflangs(html: string): string[] {
  const re = /<link[^>]*rel="alternate"[^>]*hreflang="([^"]*)"[^>]*href="([^"]*)"/g
  const results: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    results.push(m[1])
  }
  return results
}

function extractHreflangOk(html: string): boolean {
  const hreflangs = extractHreflangs(html)
  return hreflangs.length >= 2 && hreflangs.includes('en') && hreflangs.includes('ru')
}

function extractJsonLdPresent(html: string): boolean {
  return html.includes('application/ld+json')
}

function extractDataSections(html: string): string[] {
  const re = /data-section="([^"]*)"/g
  const sections: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    sections.push(m[1])
  }
  return sections
}

function extractPricingCards(html: string): number {
  const sections = extractDataSections(html)
  if (!sections.includes('pricing')) return 0
  // Count pricing card elements in the pricing section
  const pricingSectionMatch = html.match(/data-section="pricing"[^>]*>([\s\S]*?)(?=<section[^>]*data-section=|<footer|$)/)
  if (!pricingSectionMatch) return 0
  const pricingBlock = pricingSectionMatch[0]
  const cardMatches = pricingBlock.match(/rounded-lg|rounded-2xl/g)
  return cardMatches ? cardMatches.length : 0
}

function extractProcessSteps(html: string): number {
  if (!html.includes('data-section="process"')) return 0
  const sectionRegex = /<span[^>]*>\d+[^<]*<\/span>/g
  const matches = html.match(sectionRegex)
  return matches ? matches.length : 0
}

function extractFaqCount(html: string): number {
  if (!html.includes('data-section="faq"')) return 0
  const faqSectionMatch = html.match(/data-section="faq"[^>]*>([\s\S]*?)(?=<section[^>]*data-section=|<footer|$)/)
  if (!faqSectionMatch) return 0
  const block = faqSectionMatch[0]
  const h3Matches = block.match(/<h3[^>]*>/g)
  return h3Matches ? h3Matches.length : 0
}

function extractHasCta(html: string): boolean {
  return html.includes('data-section="footer-cta"')
}

function extractHasForm(html: string): boolean {
  return html.includes('data-section="contact-form"') || html.includes('data-section="career-form"')
}

function extractPricingTexts(html: string): string[] {
  if (!html.includes('data-section="pricing"')) return []
  const pricingSectionMatch = html.match(/data-section="pricing"[^>]*>([\s\S]*?)(?=<section[^>]*data-section=|<footer|$)/)
  if (!pricingSectionMatch) return []
  const block = pricingSectionMatch[0]
  // Extract price values like "2 €" "3,5 €" etc.
  const priceRe = /(\d+[\s,.]*\d*\s*[€$]?\/?\s*m²)/g
  return [...new Set(block.match(priceRe) || [])]
}

function extractHasEtText(html: string, locale: Locale): boolean {
  if (locale === 'et') return false
  // Check visible text only — strip script/style contents (the serialized
  // RSC payload contains JSON field names like "breadcrumbAvaleht").
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
  const etPatterns = ['Avaleht', 'Koristusteenus', 'Välikoristus', 'Teenuse sisu', 'Miks meie', 'Meie numbrid', 'Hind']
  return etPatterns.some((p) => new RegExp(`>[^<]*\\b${p}\\b[^<]*<`).test(visible))
}

async function checkPage(etPath: string, baseUrl: string): Promise<PageCheck> {
  const urls: Record<Locale, string> = {
    et: `${baseUrl}${etPath === '/' ? '' : etPath}`,
    en: `${baseUrl}/en${etPath === '/' ? '' : (localizedPaths[etPath]?.en || etPath)}`,
    ru: `${baseUrl}/ru${etPath === '/' ? '' : (localizedPaths[etPath]?.ru || etPath)}`,
  }

  const html: Record<Locale, string> = { et: '', en: '', ru: '' }
  const status: Record<Locale, number | null> = { et: null, en: null, ru: null }
  const errors: Record<Locale, string[]> = { et: [], en: [], ru: [] }

  for (const locale of ALL_LOCALES) {
    const result = await fetchPage(urls[locale])
    html[locale] = result.text
    status[locale] = result.status
    if (result.status !== 200) {
      errors[locale].push(`HTTP ${result.status}`)
    }
  }

  const result: PageCheck = {
    etPath,
    enPath: urls.en,
    ruPath: urls.ru,
    status,
    htmlLang: { et: extractHtmlLang(html.et), en: extractHtmlLang(html.en), ru: extractHtmlLang(html.ru) },
    title: { et: extractTitle(html.et), en: extractTitle(html.en), ru: extractTitle(html.ru) },
    h1: { et: extractH1(html.et), en: extractH1(html.en), ru: extractH1(html.ru) },
    canonical: { et: extractCanonical(html.et), en: extractCanonical(html.en), ru: extractCanonical(html.ru) },
    hreflangOk: {
      et: extractHreflangOk(html.et),
      en: extractHreflangOk(html.en),
      ru: extractHreflangOk(html.ru),
    },
    jsonLdPresent: {
      et: extractJsonLdPresent(html.et),
      en: extractJsonLdPresent(html.en),
      ru: extractJsonLdPresent(html.ru),
    },
    sectionOrder: {
      et: extractDataSections(html.et),
      en: extractDataSections(html.en),
      ru: extractDataSections(html.ru),
    },
    sectionMatches: false,
    pricingCardCount: {
      et: extractPricingCards(html.et),
      en: extractPricingCards(html.en),
      ru: extractPricingCards(html.ru),
    },
    processStepCount: {
      et: extractProcessSteps(html.et),
      en: extractProcessSteps(html.en),
      ru: extractProcessSteps(html.ru),
    },
    faqCount: {
      et: extractFaqCount(html.et),
      en: extractFaqCount(html.en),
      ru: extractFaqCount(html.ru),
    },
    hasCta: {
      et: extractHasCta(html.et),
      en: extractHasCta(html.en),
      ru: extractHasCta(html.ru),
    },
    hasForm: {
      et: extractHasForm(html.et),
      en: extractHasForm(html.en),
      ru: extractHasForm(html.ru),
    },
    pricingTexts: {
      et: extractPricingTexts(html.et),
      en: extractPricingTexts(html.en),
      ru: extractPricingTexts(html.ru),
    },
    hasEtTextOnNonEtPage: {
      et: false,
      en: extractHasEtText(html.en, 'en'),
      ru: extractHasEtText(html.ru, 'ru'),
    },
    errors,
  }

  // Compare section order
  const etSections = result.sectionOrder.et.join('|')
  const enSections = result.sectionOrder.en.join('|')
  const ruSections = result.sectionOrder.ru.join('|')
  result.sectionMatches = (etSections === enSections && etSections === ruSections)

  // Validate html lang
  for (const locale of ALL_LOCALES) {
    const expectedLangs: Record<Locale, string[]> = { et: ['et'], en: ['en', 'en-GB'], ru: ['ru', 'ru-RU'] }
    if (result.htmlLang[locale] && !expectedLangs[locale].includes(result.htmlLang[locale] as string)) {
      errors[locale].push(`html lang mismatch: got "${result.htmlLang[locale]}", expected "${expectedLangs[locale].join('/')}"`)
    }
    if (!result.title[locale]) errors[locale].push('No title')
    if (!result.h1[locale]) errors[locale].push('No H1')
    if (!result.jsonLdPresent[locale]) errors[locale].push('No JSON-LD')
  }

  return result
}

function writeReport(results: PageCheck[]): string {
  const lines: string[] = []
  lines.push('# i18n Parity Report')
  lines.push('')
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push(`Pages checked: ${results.length}`)
  lines.push('')

  const sectionMismatches = results.filter((r) => !r.sectionMatches)
  const pricingMismatches = results.filter(
    (r) => r.pricingCardCount.et !== r.pricingCardCount.en || r.pricingCardCount.et !== r.pricingCardCount.ru
  )
  const processMismatches = results.filter(
    (r) => r.processStepCount.et !== r.processStepCount.en || r.processStepCount.et !== r.processStepCount.ru
  )
  const faqMismatches = results.filter(
    (r) => r.faqCount.et !== r.faqCount.en || r.faqCount.et !== r.faqCount.ru
  )
  const etTextPages = results.filter((r) => r.hasEtTextOnNonEtPage.en || r.hasEtTextOnNonEtPage.ru)
  const pagesWithErrors = results.filter((r) =>
    r.errors.et.length + r.errors.en.length + r.errors.ru.length > 0
  )

  lines.push('## Summary')
  lines.push('')
  lines.push(`| Metric | Count |`)
  lines.push(`|--------|-------|`)
  lines.push(`| Pages with section order mismatch | ${sectionMismatches.length} |`)
  lines.push(`| Pages with pricing card mismatch | ${pricingMismatches.length} |`)
  lines.push(`| Pages with process step mismatch | ${processMismatches.length} |`)
  lines.push(`| Pages with FAQ count mismatch | ${faqMismatches.length} |`)
  lines.push(`| Pages with ET text on non-ET pages | ${etTextPages.length} |`)
  lines.push(`| Pages with errors | ${pagesWithErrors.length} |`)
  lines.push('')

  lines.push('## Per-Page Details')
  lines.push('')
  lines.push('| ET Path | EN OK | RU OK | Sections OK | Pricing OK | FAQ OK | Process OK | ET Text | Errors |')
  lines.push('|---------|-------|-------|-------------|------------|--------|------------|---------|--------|')

  for (const r of results) {
    const enOk = r.status.en === 200 ? '✓' : '✗'
    const ruOk = r.status.ru === 200 ? '✓' : '✗'
    const sectionsOk = r.sectionMatches ? '✓' : '✗'
    const pricingOk = r.pricingCardCount.et === r.pricingCardCount.en && r.pricingCardCount.et === r.pricingCardCount.ru ? '✓' : '✗'
    const faqOk = r.faqCount.et === r.faqCount.en && r.faqCount.et === r.faqCount.ru ? '✓' : '✗'
    const processOk = r.processStepCount.et === r.processStepCount.en && r.processStepCount.et === r.processStepCount.ru ? '✓' : '✗'
    const etText = r.hasEtTextOnNonEtPage.en || r.hasEtTextOnNonEtPage.ru ? '✗' : '✓'
    const errorStr = [...new Set([...r.errors.et, ...r.errors.en, ...r.errors.ru])].join('; ').slice(0, 80)

    lines.push(`| ${r.etPath} | ${enOk} | ${ruOk} | ${sectionsOk} | ${pricingOk} | ${faqOk} | ${processOk} | ${etText} | ${errorStr || '-'} |`)
  }

  lines.push('')

  if (sectionMismatches.length > 0) {
    lines.push('## Section Order Mismatches')
    lines.push('')
    for (const r of sectionMismatches) {
      lines.push(`### ${r.etPath}`)
      lines.push(`- ET sections: [${r.sectionOrder.et.join(', ')}]`)
      lines.push(`- EN sections: [${r.sectionOrder.en.join(', ')}]`)
      lines.push(`- RU sections: [${r.sectionOrder.ru.join(', ')}]`)
      lines.push('')
    }
  }

  if (etTextPages.length > 0) {
    lines.push('## Pages with ET text on non-ET locale pages')
    lines.push('')
    for (const r of etTextPages) {
      lines.push(`- ${r.etPath} (EN: ${r.hasEtTextOnNonEtPage.en}, RU: ${r.hasEtTextOnNonEtPage.ru})`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

async function main() {
  const args = parseArgs()
  console.log(`i18n Parity Check`)
  console.log(`Base URL: ${args.baseUrl}`)
  console.log(`Mode: ${args.strict ? 'STRICT' : 'non-blocking'}`)
  console.log(`Pages to check: ${etPaths.length}`)
  console.log('')

  const results: PageCheck[] = []
  for (let i = 0; i < etPaths.length; i++) {
    const etPath = etPaths[i]
    process.stdout.write(`[${i + 1}/${etPaths.length}] ${etPath} ... `)
    const result = await checkPage(etPath, args.baseUrl)
    results.push(result)
    const ok = result.sectionMatches ? 'OK' : 'MISMATCH'
    console.log(ok)
  }

  const report = writeReport(results)
  mkdirSync('raportid', { recursive: true })
  writeFileSync(join('raportid', 'i18n-parity-report.md'), report, 'utf-8')
  console.log(`\nReport written to raportid/i18n-parity-report.md`)

  const sectionMismatches = results.filter((r) => !r.sectionMatches)
  if (args.strict && sectionMismatches.length > 0) {
    console.error(`FAIL: ${sectionMismatches.length} pages have section order mismatches`)
    process.exit(1)
  }

  console.log(sectionMismatches.length === 0 ? 'All pages have matching section order!' : `${sectionMismatches.length} pages have section order mismatches`)

  if (!args.strict) {
    console.log('(non-blocking mode — exiting 0)')
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(2)
})
