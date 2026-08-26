/**
 * i18n Build-Time Validation
 *
 * Static consistency checks across the public-page registry and locale
 * content. Runs without a server. Fails (exit 1) when:
 *   - registry paths/slugs are duplicated or parents dangle
 *   - page-registry, localized-page-registry or metadata-registry reference
 *     paths missing from lib/pages/registry.ts (or vice versa)
 *   - a registry namespace is missing from en.json or ru.json
 *   - EN and RU namespace key sets diverge (missing sections/items)
 *   - required fields are missing from PageView-consumed namespaces
 *
 * Usage: npm run i18n:validate
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { publicPages, localizedPages } from '../lib/pages/registry'
import { serviceDetailByEtPath } from '../lib/pages/definitions/index'
import enMessages from '../messages/en.json'
import ruMessages from '../messages/ru.json'

const errors: string[] = []
const warnings: string[] = []

function error(message: string) {
  errors.push(message)
}

function warn(message: string) {
  warnings.push(message)
}

/* ---------- 1. Registry integrity ---------- */

const etPaths = new Set<string>()
for (const page of publicPages) {
  if (etPaths.has(page.etPath)) error(`Duplicate etPath in registry: ${page.etPath}`)
  etPaths.add(page.etPath)
}

const enSlugs = new Map<string, string>()
const ruSlugs = new Map<string, string>()
for (const page of localizedPages) {
  if (!page.en || !page.ru) {
    error(`${page.etPath}: localized page missing EN or RU slug`)
    continue
  }
  const enOwner = enSlugs.get(page.en)
  if (enOwner) error(`EN slug '${page.en}' claimed by both ${enOwner} and ${page.etPath}`)
  enSlugs.set(page.en, page.etPath)
  const ruOwner = ruSlugs.get(page.ru)
  if (ruOwner) error(`RU slug '${page.ru}' claimed by both ${ruOwner} and ${page.etPath}`)
  ruSlugs.set(page.ru, page.etPath)
}

for (const page of publicPages) {
  if (page.parent && !etPaths.has(page.parent)) {
    error(`${page.etPath}: parent '${page.parent}' does not exist in registry`)
  }
}

for (const page of publicPages) {
  if (!page.namespace) continue
  if (!(page.namespace in enMessages)) error(`${page.etPath}: namespace '${page.namespace}' missing from messages/en.json`)
  if (!(page.namespace in ruMessages)) error(`${page.etPath}: namespace '${page.namespace}' missing from messages/ru.json`)
}

/* ---------- 2. Cross-registry consistency (text-based, avoids import chains) ---------- */

function extractKeys(filePath: string, pattern: RegExp): string[] {
  const src = readFileSync(join(process.cwd(), filePath), 'utf8')
  const keys: string[] = []
  for (const match of src.matchAll(pattern)) keys.push(match[1])
  return keys
}

const loaderPaths = extractKeys('lib/page-registry.ts', /^  '([^']+)': \{ load:/gm)
for (const path of loaderPaths) {
  if (!etPaths.has(path)) error(`page-registry loader '${path}' missing from lib/pages/registry`)
}
for (const page of publicPages) {
  if (!loaderPaths.includes(page.etPath)) error(`registry page '${page.etPath}' has no loader in page-registry`)
}

const rendererPaths = extractKeys('lib/localized-page-registry.tsx', /^  '([^']+)': \(locale\)/gm)
for (const path of rendererPaths) {
  if (!etPaths.has(path)) error(`localized-page-registry renderer '${path}' missing from lib/pages/registry`)
}

const metadataPaths = extractKeys('lib/metadata-registry.ts', /^  '([^']+)': \{/gm)
for (const path of metadataPaths) {
  if (!etPaths.has(path)) error(`metadata-registry entry '${path}' missing from lib/pages/registry`)
}

/* ---------- 3. EN/RU namespace key-set equivalence ---------- */

type JsonObject = Record<string, unknown>

/**
 * Namespaces actively consumed by PageViews via getLocalizedContent().
 * Divergence here is user-visible breakage → hard error.
 * (kontakt/spsGrupp and the 26 detail namespaces moved to
 * lib/pages/definitions in Tasks 7–9 and were deleted from messages/*.json;
 * definition files are shape-checked in section 5.)
 */
const consumedNamespaces = new Set([
  'koristusteenus',
  'kontoriKoristus',
  'kaubanduspindadeKoristus',
  'tootmishooneteKoristus',
  'koolideKoristamine',
  'careers',
])

function flattenKeys(value: unknown, prefix: string, out: Set<string>) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return
  for (const [key, child] of Object.entries(value as JsonObject)) {
    const path = prefix ? `${prefix}.${key}` : key
    out.add(path)
    flattenKeys(child, path, out)
  }
}

const dormantGaps: string[] = []

for (const page of localizedPages) {
  if (!page.namespace || page.namespace === 'privacyPolicy') continue
  const enContent = (enMessages as JsonObject)[page.namespace]
  const ruContent = (ruMessages as JsonObject)[page.namespace]
  if (!enContent || !ruContent) continue

  const enKeys = new Set<string>()
  const ruKeys = new Set<string>()
  flattenKeys(enContent, '', enKeys)
  flattenKeys(ruContent, '', ruKeys)

  const missingInRu = [...enKeys].filter((key) => !ruKeys.has(key))
  const missingInEn = [...ruKeys].filter((key) => !enKeys.has(key))
  const consumed = consumedNamespaces.has(page.namespace)

  for (const key of missingInRu) {
    if (consumed) error(`${page.namespace}: key '${key}' present in en.json but missing from ru.json`)
    else dormantGaps.push(`${page.namespace}.${key} (missing in ru.json)`)
  }
  for (const key of missingInEn) {
    if (consumed) error(`${page.namespace}: key '${key}' present in ru.json but missing from en.json`)
    else dormantGaps.push(`${page.namespace}.${key} (missing in en.json)`)
  }
}

if (dormantGaps.length > 0) {
  warn(`${dormantGaps.length} key(s) diverge in dormant namespaces (not consumed by PageViews today; to be filled from inline data during the Part 2 conversion):`)
  for (const gap of dormantGaps) warn(`  ${gap}`)
}

/* ---------- 4. Required fields in PageView-consumed namespaces ---------- */

type FieldRule = { sections: string[]; whyUsImage?: boolean; testimonials?: number; process?: boolean; stats?: boolean; caseStudy?: boolean; heroBreadcrumbs?: boolean }

const pageViewRules: Record<string, FieldRule> = {
  koristusteenus: { sections: ['hero', 'problem', 'services', 'whyUs', 'pricing', 'footerCta', 'faq'], whyUsImage: true },
  kontoriKoristus: { sections: ['hero', 'problem', 'services', 'whyUs', 'pricing', 'testimonials', 'tooprotsess', 'footerCta', 'faq'], whyUsImage: true, testimonials: 5, process: true, heroBreadcrumbs: true },
  kaubanduspindadeKoristus: { sections: ['hero', 'problem', 'services', 'whyUs', 'pricing', 'testimonials', 'tooprotsess', 'footerCta', 'faq'], whyUsImage: true, testimonials: 3, process: true, heroBreadcrumbs: true },
  tootmishooneteKoristus: { sections: ['hero', 'problem', 'services', 'whyUs', 'pricing', 'testimonials', 'tooprotsess', 'footerCta', 'faq'], whyUsImage: true, testimonials: 3, process: true, heroBreadcrumbs: true },
  koolideKoristamine: { sections: ['hero', 'problem', 'services', 'whyUs', 'pricing', 'testimonials', 'caseStudy', 'tooprotsess', 'footerCta', 'faq'], whyUsImage: true, testimonials: 3, process: true, caseStudy: true, heroBreadcrumbs: true },
  careers: { sections: ['hero', 'services', 'problem', 'stats'], stats: true },
}

const localeFiles: Array<{ locale: 'en' | 'ru'; messages: JsonObject }> = [
  { locale: 'en', messages: enMessages as JsonObject },
  { locale: 'ru', messages: ruMessages as JsonObject },
]

for (const [namespace, rule] of Object.entries(pageViewRules)) {
  for (const { locale, messages } of localeFiles) {
    const content = messages[namespace] as JsonObject | undefined
    if (!content) {
      error(`${locale}/${namespace}: namespace missing (required by a PageView)`)
      continue
    }
    for (const section of rule.sections) {
      if (!(section in content)) error(`${locale}/${namespace}: required section '${section}' missing`)
    }
    if (rule.whyUsImage) {
      const whyUs = content.whyUs as JsonObject | undefined
      if (!whyUs?.image) error(`${locale}/${namespace}: whyUs.image missing (ET design has an image)`)
      if (!whyUs?.imageAlt) error(`${locale}/${namespace}: whyUs.imageAlt missing`)
    }
    if (rule.testimonials) {
      const testimonials = content.testimonials as JsonObject | undefined
      for (let index = 0; index < rule.testimonials; index++) {
        if (!testimonials?.[`item${index}Quote`]) error(`${locale}/${namespace}: testimonials.item${index}Quote missing`)
      }
    }
    if (rule.process) {
      const process = content.tooprotsess as JsonObject | undefined
      if (!process?.title) error(`${locale}/${namespace}: tooprotsess.title missing`)
      for (let index = 0; index < 5; index++) {
        if (!process?.[`step${index}Title`]) error(`${locale}/${namespace}: tooprotsess.step${index}Title missing`)
      }
    }
    if (rule.caseStudy) {
      const caseStudy = content.caseStudy as JsonObject | undefined
      if (!caseStudy?.text) error(`${locale}/${namespace}: caseStudy.text missing`)
    }
    if (rule.heroBreadcrumbs) {
      // PageViews read hero.breadcrumb* with an ET fallback — a missing key
      // leaks Estonian breadcrumb text onto EN/RU pages (parity ET-text flag).
      const hero = content.hero as JsonObject | undefined
      for (const field of ['breadcrumbHome', 'breadcrumbService', 'breadcrumbCurrent']) {
        if (!hero?.[field]) error(`${locale}/${namespace}: hero.${field} missing (ET breadcrumb would leak onto ${locale} page)`)
      }
    }
    if (rule.stats) {
      const stats = content.stats as JsonObject | undefined
      if (!stats?.heading) error(`${locale}/${namespace}: stats.heading missing`)
    }
  }
}

/* ---------- 5. Service-detail definition files (lib/pages/definitions) ---------- */

const DEFINITION_COUNT = 28
const definitionEntries = Object.entries(serviceDetailByEtPath)
if (definitionEntries.length !== DEFINITION_COUNT) {
  error(`definitions index has ${definitionEntries.length} entries, expected ${DEFINITION_COUNT}`)
}

for (const [etPath, defs] of definitionEntries) {
  if (!etPaths.has(etPath)) error(`definitions index '${etPath}' missing from lib/pages/registry`)
  for (const locale of ['et', 'en', 'ru'] as const) {
    const d = defs[locale]
    if (!d) {
      error(`${etPath} (${locale}): serviceDetail locale missing`)
      continue
    }
    if (!d.data || typeof d.data !== 'object') error(`${etPath} (${locale}): data missing`)
    if (!d.seo || typeof d.seo.serviceName !== 'string' || typeof d.seo.serviceDescription !== 'string') {
      error(`${etPath} (${locale}): seo.serviceName/serviceDescription missing or not strings`)
    }
    const tp = d.tooprotsess
    if (!tp || typeof tp.title !== 'string' || !tp.title || typeof tp.intro !== 'string' || !Array.isArray(tp.steps) || tp.steps.length < 1) {
      error(`${etPath} (${locale}): tooprotsess title/intro/steps missing`)
    } else {
      tp.steps.forEach((step, index) => {
        if (!Array.isArray(step) || typeof step[0] !== 'string' || !step[0] || typeof step[1] !== 'string') {
          error(`${etPath} (${locale}): tooprotsess step ${index} malformed ([title, desc] expected)`)
        }
      })
    }
    if (!Array.isArray(d.breadcrumbs) || d.breadcrumbs.length < 1) {
      error(`${etPath} (${locale}): breadcrumbs missing`)
    } else {
      d.breadcrumbs.forEach((bc, index) => {
        if (!bc || typeof bc.name !== 'string' || !bc.name || typeof bc.etPath !== 'string') {
          error(`${etPath} (${locale}): breadcrumb ${index} malformed ({name, etPath} expected)`)
        }
      })
    }
  }
  // ET-leak guard: an untranslated EN/RU tooprotsess kept the ET title/steps in
  // the past (rendered Estonian on /en// /ru/ pages; the parity 7-word detector
  // cannot see these short strings). Identical titles across locales are never
  // legitimate for the "Kuidas SPS …?" title pattern.
  const { et, en, ru } = defs
  if (et && en && ru) {
    if (en.tooprotsess.title === et.tooprotsess.title) error(`${etPath}: EN tooprotsess title identical to ET (untranslated)`)
    if (ru.tooprotsess.title === et.tooprotsess.title) error(`${etPath}: RU tooprotsess title identical to ET (untranslated)`)
    const stepCount = et.tooprotsess.steps.length
    if (en.tooprotsess.steps.length !== stepCount || ru.tooprotsess.steps.length !== stepCount) {
      error(`${etPath}: tooprotsess step count diverges across locales`)
    }
  }
}

/* ---------- Report ---------- */

if (warnings.length > 0) {
  console.log('Warnings:')
  for (const message of warnings) console.log(`  ⚠ ${message}`)
}

if (errors.length > 0) {
  console.error(`\ni18n validation FAILED with ${errors.length} error(s):`)
  for (const message of errors) console.error(`  ✗ ${message}`)
  process.exit(1)
}

console.log(`i18n validation passed: ${publicPages.length} pages (${localizedPages.length} localized), ${Object.keys(pageViewRules).length} PageView namespaces + ${definitionEntries.length} service-detail definitions checked.`)
