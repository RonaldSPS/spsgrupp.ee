# TRANSLATIONS.md — Multilingual i18n for SPS Grupp (et / en / ru)

> **Goal:** Full Estonian + Russian + English translation of all content.
> **URLs preserved:** Estonian stays at root with original slugs. EN/RU get `/en/` and `/ru/` prefixes with fully translated slugs.
> **Translations:** AI-generated via Deepseek V4 Pro API (OpenAI-compatible chat endpoint), editable by admin.

---

## Architecture Overview

```
                              ┌─────────────────────────┐
                              │   app/layout.tsx         │
                              │   <html lang={locale}>   │
                              │   Root shell (no i18n)   │
                              └──────────┬──────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
              ▼                          ▼                          ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ app/[[...slug]]/     │  │ app/en/[[...slug]]/  │  │ app/ru/[[...slug]]/  │
│ page.tsx             │  │ page.tsx             │  │ page.tsx             │
│ (Estonian — default) │  │ (English — /en/...)  │  │ (Russian — /ru/...)  │
└──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘
           │                         │                          │
           ▼                         ▼                          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      lib/page-registry.ts                                │
│  Maps Estonian paths → page components + generates metadata per locale   │
└──────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      lib/slug-map.ts                                     │
│  Bidirectional: etPath ↔ enSlug ↔ ruSlug                                │
│  localizePath('/koristusteenus', 'en') → '/en/professional-cleaning'    │
└──────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                   messages/{et,en,ru}.json                               │
│  + scripts/translate.mjs  (bulk AI translation of static strings)        │
│  + lib/translate-blog.ts  (per-post AI translation pipeline)             │
└──────────────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- No `next-intl` needed for routing — catch-all routes + page registry handle locale resolution without middleware
- No cookie-based locale switching — the URL prefix explicitly determines the locale
- Language switcher in Navbar navigates to the localized URL of the current page
- `html[lang]` set per page based on which catch-all rendered

---

## Step 1: Inventory — Map Every Path and Text Source

### 1.1 Complete Page Inventory

Run these commands and document every path:

```powershell
# List all page files
Get-ChildItem -Recurse -Path app -Filter "page.tsx" | ForEach-Object { $_.FullName.Replace((Get-Location).Path + '\app\', '').Replace('\page.tsx', '').Replace('\', '/') }
```

### 1.2 All Text-Bearing Files

Every file that contains user-facing Estonian text — page.tsx, layout.tsx (metadata), component .tsx, and lib/actions.ts (validation messages):

| Category | Files | Notes |
|---|---|---|
| Route pages | ~50 `app/**/page.tsx` | Hardcoded Estonian headings, body text, FAQ data, breadcrumbs |
| Layouts | ~47 `app/**/layout.tsx` | `export const metadata` with ET titles/descriptions |
| Shared components | 22 files in `app/components/` | Navbar, Hero, Services, FAQ, ContactForm, CareerForm, Footer, Trust, Industries, Testimonials, Hinnakalkulaator, Tooprotsess, FooterCTA, SeasonalServicesBlock, TooleAnnouncements, etc. |
| Server actions | `lib/actions.ts` | Validation error messages in Estonian |
| 404 page | `app/not-found.tsx` | Hardcoded Estonian |
| Privacy policy | `app/privaatsus/page.tsx` | Long-form Estonian legal text |
| Blog data | `app/blog/data.ts`, `app/blog/posts.generated.ts` | Blog titles, excerpts, contentHtml |
| Job announcements | `data/admin-toole-announcements.json` + DB | Job titles, descriptions, tasks, benefits |
| JSON-LD | Inline in `app/page.tsx`, `app/kontakt/page.tsx`, all layout.tsx files, `app/components/SeoJsonLd.tsx` | Schema markup with Estonian text |

**Estimated string count:** 2,000–3,000 unique translatable strings across all files.

---

## Step 2: Page Registry + Slug Map

### 2.1 Create `lib/slug-map.ts`

This is the single source of truth for URL translation. Every Estonian path gets an English and Russian equivalent.

```ts
// lib/slug-map.ts

export interface LocalePaths {
  en: string
  ru: string
}

/** Keyed by Estonian path (no trailing slash, root = '/') */
export const localizedPaths: Record<string, LocalePaths> = {
  '/':                                                { en: '/', ru: '/' },
  '/koristusteenus':                                  { en: '/professional-cleaning-services', ru: '/профессиональные-уборочные-услуги' },
  '/koristusteenus/kontori-koristus':                 { en: '/professional-cleaning-services/office-cleaning', ru: '/профессиональные-уборочные-услуги/уборка-офисов' },
  '/koristusteenus/kaubanduspindade-koristus':        { en: '/professional-cleaning-services/commercial-space-cleaning', ru: '/профессиональные-уборочные-услуги/уборка-торговых-помещений' },
  '/koristusteenus/tootmishoonete-koristus':          { en: '/professional-cleaning-services/industrial-facility-cleaning', ru: '/профессиональные-уборочные-услуги/уборка-производственных-помещений' },
  '/koristusteenus/koolide-koristamine':              { en: '/professional-cleaning-services/school-cleaning', ru: '/профессиональные-уборочные-услуги/уборка-школ' },
  '/koristusteenus/valikoristus':                     { en: '/professional-cleaning-services/exterior-cleaning', ru: '/профессиональные-уборочные-услуги/наружная-уборка' },
  '/koristusteenus/valikoristus/akende-pesu':         { en: '/professional-cleaning-services/exterior-cleaning/window-cleaning', ru: '/профессиональные-уборочные-услуги/наружная-уборка/мойка-окон' },
  '/koristusteenus/valikoristus/fassaadipesu':        { en: '/professional-cleaning-services/exterior-cleaning/facade-cleaning', ru: '/профессиональные-уборочные-услуги/наружная-уборка/мойка-фасадов' },
  '/koristusteenus/valikoristus/grafiti-eemaldamine': { en: '/professional-cleaning-services/exterior-cleaning/graffiti-removal', ru: '/профессиональные-уборочные-услуги/наружная-уборка/удаление-граффити' },
  '/koristusteenus/valikoristus/kojameheteenus':      { en: '/professional-cleaning-services/exterior-cleaning/janitor-services', ru: '/профессиональные-уборочные-услуги/наружная-уборка/услуги-дворника' },
  '/koristusteenus/valikoristus/lehtedekoristamine':  { en: '/professional-cleaning-services/exterior-cleaning/leaf-removal', ru: '/профессиональные-уборочные-услуги/наружная-уборка/уборка-листьев' },
  '/koristusteenus/valikoristus/lumekoristus':        { en: '/professional-cleaning-services/exterior-cleaning/snow-removal', ru: '/профессиональные-уборочные-услуги/наружная-уборка/уборка-снега' },
  '/koristusteenus/valikoristus/muruniitmine':        { en: '/professional-cleaning-services/exterior-cleaning/lawn-mowing', ru: '/профессиональные-уборочные-услуги/наружная-уборка/стрижка-газонов' },
  '/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus': { en: '/professional-cleaning-services/exterior-cleaning/paving-stone-cleaning-maintenance', ru: '/профессиональные-уборочные-услуги/наружная-уборка/мойка-и-обслуживание-тротуарной-плитки' },
  '/puhastusteenused':                               { en: '/specialized-cleaning-services', ru: '/специализированные-услуги-по-уборке' },
  '/puhastusteenused/ehitusjargne-koristus':          { en: '/specialized-cleaning-services/post-construction-cleaning', ru: '/специализированные-услуги-по-уборке/уборка-после-строительства' },
  '/puhastusteenused/desinfitseerimine':              { en: '/specialized-cleaning-services/disinfection', ru: '/специализированные-услуги-по-уборке/дезинфекция' },
  '/puhastusteenused/eskalaatorite-suvapuhastus':     { en: '/specialized-cleaning-services/escalator-deep-cleaning', ru: '/специализированные-услуги-по-уборке/глубокая-чистка-эскалаторов' },
  '/puhastusteenused/porandate-hooldus':              { en: '/specialized-cleaning-services/floor-maintenance', ru: '/специализированные-услуги-по-уборке/обслуживание-полов' },
  '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine': { en: '/specialized-cleaning-services/smoke-fire-damage-restoration', ru: '/специализированные-услуги-по-уборке/устранение-последствий-дыма-и-пожара' },
  '/puhastusteenused/vaipade-puhastus':               { en: '/specialized-cleaning-services/carpet-cleaning', ru: '/специализированные-услуги-по-уборке/чистка-ковров' },
  '/remonditeenused-tallinnas':                       { en: '/renovation-services-tallinn', ru: '/ремонтные-услуги-таллинн' },
  '/remonditeenused-tallinnas/elektritood':           { en: '/renovation-services-tallinn/electrical-work', ru: '/ремонтные-услуги-таллинн/электромонтажные-работы' },
  '/remonditeenused-tallinnas/torutood':              { en: '/renovation-services-tallinn/plumbing', ru: '/ремонтные-услуги-таллинн/сантехнические-работы' },
  '/remonditeenused-tallinnas/siseviimistlustood':    { en: '/renovation-services-tallinn/interior-finishing', ru: '/ремонтные-услуги-таллинн/внутренняя-отделка' },
  '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus': { en: '/renovation-services-tallinn/bathroom-renovation', ru: '/ремонтные-услуги-таллинн/ремонт-санузлов' },
  '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus': { en: '/renovation-services-tallinn/ventilation-installation-maintenance', ru: '/ремонтные-услуги-таллинн/монтаж-и-обслуживание-вентиляции' },
  '/remonditeenused-tallinnas/plaatimistood':         { en: '/renovation-services-tallinn/tiling', ru: '/ремонтные-услуги-таллинн/плиточные-работы' },
  '/remonditeenused-tallinnas/katuse-remont':         { en: '/renovation-services-tallinn/roof-repair', ru: '/ремонтные-услуги-таллинн/ремонт-кровли' },
  '/remonditeenused-tallinnas/lammutustood':          { en: '/renovation-services-tallinn/demolition', ru: '/ремонтные-услуги-таллинн/демонтажные-работы' },
  '/remonditeenused-tallinnas/muruniitmine':          { en: '/renovation-services-tallinn/lawn-mowing', ru: '/ремонтные-услуги-таллинн/стрижка-газонов' },
  '/remonditeenused-tallinnas/lehtedekoristamine':    { en: '/renovation-services-tallinn/leaf-removal', ru: '/ремонтные-услуги-таллинн/уборка-листьев' },
  '/remonditeenused-tallinnas/kojameheteenus':        { en: '/renovation-services-tallinn/janitor-services', ru: '/ремонтные-услуги-таллинн/услуги-дворника' },
  '/ehitusprahi-aravedu':                             { en: '/construction-waste-removal', ru: '/вывоз-строительного-мусора' },
  '/kontakt':                                         { en: '/contact', ru: '/контакты' },
  '/sps-grupp':                                       { en: '/about-sps-grupp', ru: '/о-sps-grupp' },
  '/sps-grupp/arvamused':                             { en: '/about-sps-grupp/testimonials', ru: '/о-sps-grupp/отзывы' },
  '/tule-meile-toole':                                { en: '/join-our-team', ru: '/приходите-к-нам-работать' },
  '/privaatsus':                                      { en: '/privacy-policy', ru: '/политика-конфиденциальности' },
  '/blog':                                            { en: '/blog', ru: '/блог' },
  // blog [slug] and tule-meile-toole/[slug] handled dynamically via their own routes
}

// ─── Reverse maps (localized path → Estonian path) ─────────────────────

function buildReverseMap(locale: 'en' | 'ru'): Record<string, string> {
  const map: Record<string, string> = {}
  for (const [etPath, paths] of Object.entries(localizedPaths)) {
    map[paths[locale]] = etPath
  }
  return map
}

export const enToEt = buildReverseMap('en')
export const ruToEt = buildReverseMap('ru')

// ─── URL generation ───────────────────────────────────────────────────

export function localizePath(etPath: string, locale: 'et' | 'en' | 'ru'): string {
  if (locale === 'et') return etPath
  const slug = localizedPaths[etPath]?.[locale]
  if (!slug) return etPath  // fallback: use Estonian slug if no translation (e.g., dynamic blog posts)
  return `/${locale}${slug === '/' ? '' : slug}`
}
```

### 2.2 Create `lib/page-registry.ts`

Every Estonian path maps to a page component + its messages namespace:

```ts
// lib/page-registry.ts
import { lazy, type ComponentType } from 'react'

export interface PageEntry {
  component: ComponentType<{ locale: 'et' | 'en' | 'ru' }>
  namespace: string    // key in messages/{locale}.json
}

// Lazy-load all page components
const registry: Record<string, PageEntry> = {
  '/': {
    component: lazy(() => import('@/content-pages/home/page')),
    namespace: 'home',
  },
  '/koristusteenus': {
    component: lazy(() => import('@/content-pages/koristusteenus/page')),
    namespace: 'koristusteenus',
  },
  '/koristusteenus/kontori-koristus': {
    component: lazy(() => import('@/content-pages/koristusteenus/kontori-koristus/page')),
    namespace: 'kontoriKoristus',
  },
  // ... all ~50 pages ...
}

export function getPage(etPath: string): PageEntry | undefined {
  return registry[etPath]
}

export function getAllPaths(): string[] {
  return Object.keys(registry)
}
```

---

## Step 3: Catch-All Routing (Three Routes)

### 3.1 Estonian (root, no prefix)

```tsx
// app/[[...slug]]/page.tsx
import { notFound } from 'next/navigation'
import { getPage } from '@/lib/page-registry'
import { generateLocalizedMetadata } from '@/lib/seo-metadata'

interface Props { params: Promise<{ slug?: string[] }> }

function resolvePath(slugParts?: string[]): string {
  if (!slugParts || slugParts.length === 0) return '/'
  return '/' + slugParts.join('/')
}

export async function generateMetadata({ params }: Props) {
  const path = resolvePath((await params).slug)
  return generateLocalizedMetadata(path, 'et')
}

export default async function EtPage({ params }: Props) {
  const path = resolvePath((await params).slug)
  const page = getPage(path)
  if (!page) notFound()
  const PageComponent = page.component
  return <PageComponent locale="et" />
}

export async function generateStaticParams() {
  return getAllPaths().map(path => ({
    slug: path === '/' ? undefined : path.split('/').filter(Boolean),
  }))
}
```

### 3.2 English (`/en/...`)

```tsx
// app/en/[[...slug]]/page.tsx
import { notFound } from 'next/navigation'
import { getPage } from '@/lib/page-registry'
import { enToEt, getAllPaths, localizePath } from '@/lib/slug-map'
import { generateLocalizedMetadata } from '@/lib/seo-metadata'

interface Props { params: Promise<{ slug?: string[] }> }

export async function generateMetadata({ params }: Props) {
  const enSlug = resolveEnPath((await params).slug)
  const etPath = enToEt[enSlug]
  if (!etPath) return {}
  return generateLocalizedMetadata(etPath, 'en')
}

export default async function EnPage({ params }: Props) {
  const enSlug = resolveEnPath((await params).slug)
  const etPath = enToEt[enSlug]
  if (!etPath) notFound()
  const page = getPage(etPath)
  if (!page) notFound()
  const PageComponent = page.component
  return <PageComponent locale="en" />
}

function resolveEnPath(slugParts?: string[]): string {
  if (!slugParts || slugParts.length === 0) return '/'
  return '/' + slugParts.join('/')
}

export async function generateStaticParams() {
  return getAllPaths()
    .map(path => localizePath(path, 'en').replace('/en', ''))
    .filter(Boolean)
    .map(slug => ({ slug: slug === '' ? undefined : slug.split('/').filter(Boolean) }))
}
```

### 3.3 Russian (`/ru/...`)

Identical structure to English, using `ruToEt` reverse map and `localizePath(etPath, 'ru')`.

---

## Step 4: Messages Extraction + AI Translation

### 4.1 Structure `messages/et.json`

Namespaced by page/feature. Every hardcoded string from all 50+ pages and 22 components gets extracted here.

```json
{
  "nav": {
    "services": "Teenused",
    "comeToWork": "Tule tööle",
    "spsGrupp": "SPS Grupp",
    "blog": "Blogi",
    "contact": "Kontakt",
    "requestQuote": "Küsi pakkumist",
    "phoneShort": "662 3328",
    "ariaMainMenu": "Peamenüü",
    "ariaOpenMenu": "Ava menüü",
    "ariaCloseMenu": "Sulge menüü"
  },
  "megaMenu": {
    "cleaningServices": "Koristusteenused",
    "indoorCleaning": "Sisekoristus",
    "officeCleaning": "Kontori koristus",
    "commercialCleaning": "Kaubanduspindade koristus",
    "industrialCleaning": "Tootmishoonete koristus",
    "schoolCleaning": "Koolide koristus",
    "outdoorCleaning": "Välikoristus",
    "lawnMowing": "Muru niitmine",
    "leafRemoval": "Lehtede koristamine",
    "janitorService": "Kojamehe teenus",
    "snowRemoval": "Lumekoristus",
    "cleaningServices2": "Puhastusteenused",
    "specialCleaning": "Eripuhastustööd",
    "windowCleaning": "Akende pesu",
    "carpetCleaning": "Vaipade puhastus",
    "floorMaintenance": "Põrandate hooldus",
    "constructionWaste": "Ehitusprahi äravedu",
    "postConstructionCleaning": "Ehitusjärgne koristus",
    "fireDamageCleaning": "Tulekahjustuste eemaldus",
    "escalatorDeepCleaning": "Eskalaatorite süvapuhastus",
    "disinfection": "Desinfitseerimine",
    "pavingCleaning": "Tänavakivide pesu ja hooldus",
    "graffitiRemoval": "Graffiti eemaldamine",
    "facadeCleaning": "Fassaadipesu",
    "renovationServices": "Remonditeenused",
    "electricalWork": "Elektritööd",
    "plumbing": "Torutööd",
    "interiorFinishing": "Siseviimistlustööd",
    "bathroomRenovation": "Sanitaarremont",
    "ventilation": "Ventilatsioonide ehitus",
    "tiling": "Plaatimistööd",
    "roofRepair": "Katuse remont",
    "demolition": "Lammutustööd"
  },
  "hero": {
    "heading1": "Koristusfirma",
    "heading2": "ärikliendile",
    "description": "Koristusfirma SPS Grupp hooldab iga päev üle miljoni m² kontori-, kaubandus- ja tootmispindu Harjumaal.",
    "cta": "Küsi pakkumist",
    "floating1Big": "20+",
    "floating1Small": "aastat kogemust",
    "floating2Big": "ISO 9001",
    "floating2Small": "sertifitseeritud",
    "floating3Big": "Üle miljoni m²",
    "floating3Small": "igapäevaselt",
    "ariaLabel": "Avaleht"
  },
  "services": {
    "heading": "Miks Eesti suurettevõtted valivad SPS Grupi koristusfirmaks?",
    "para1": "Koristusteenuse pakkuja valikul ei ole küsimus ainult hinnas...",
    "para2": "Hea teenus ei sõltu ainult koristajast...",
    "para3": "SPS Grupp on aastaid keskendunud just äriklientidele...",
    "para4": "Kui otsite partnerit, kes hoiab püsivat kvaliteeti..."
  },
  "faq": {
    "sectionTag": "KKK",
    "description": "Vastame kõige levinumatele küsimustele koristusteenuse kohta. Kui teil tekib küsimusi, palun võtke meiega ühendust.",
    "cta": "Küsi pakkumist",
    "items": [
      {
        "q": "Kui sageli peaks äriruume koristama?",
        "a": "Enamikule ettevõtetele soovitame koristust 3–5 korda nädalas. Täpne sagedus sõltub teie äri spetsiifikast, töötajate arvust ja pindalast. Aitame teil leida optimaalse graafiku tasuta konsultatsiooni käigus."
      }
    ]
  },
  "contactForm": {
    "sectionTag": "Küsi pakkumist",
    "heading": "Aitame leida optimaalse lahenduse teie koristusvajadustele",
    "subtitle": "Täitke vorm ja meie spetsialist võtab teiega ühendust 24 tunni jooksul.",
    "nameLabel": "Nimi *",
    "namePlaceholder": "Teie nimi",
    "emailLabel": "E-mail *",
    "emailPlaceholder": "email@ettevõte.ee",
    "phoneLabel": "Telefon *",
    "phonePlaceholder": "+372 5xxx xxx",
    "companyLabel": "Ettevõte",
    "companyPlaceholder": "Ettevõte OÜ",
    "messageLabel": "Lisainfo",
    "messagePlaceholder": "Ruume ruutmeetrites, erisoovitused...",
    "privacyConsent": "Olen tutvunud andmekaitsetingimustega ja nõustun oma andmete töötlemisega päringule vastamise eesmärgil. *",
    "privacyLink": "andmekaitsetingimustega",
    "submitButton": "Saada päring",
    "submitting": "Saadan...",
    "successMessage": "Täname! Teie päring on saadetud. Võtame ühendust 24 tunni jooksul.",
    "footerNote": "Andmed edastatakse krüpteeritult. Vastame üldjuhul 24 tunni jooksul."
  },
  "careerForm": {
    "...": "..."
  },
  "footer": {
    "cleaningServices": "Koristusteenused",
    "indoorCleaning": "Sisekoristus",
    "specialCleaning": "Eripuhastustööd",
    "outdoorCleaning": "Välikoristus",
    "renovationServices": "Remonditeenused",
    "contact": "Kontakt",
    "comeToWork": "Tule meile tööle",
    "privacy": "Privaatsuspoliitika",
    "requestQuote": "Küsi pakkumist",
    "requestQuoteDesc": "Kõige lihtsam on teha pakkumist, kui kirjeldate oma olukorda, mida püüate lahendada. Nii saame pakkuda parimaid võimalusi",
    "comeToWorkDesc": "Meilt leiad turvalise töökoha, kus saata korda suuri tegusid. Kui pead endast ja teistest lugu,",
    "viewJobs": "vaata tööpakkumisi"
  },
  "notFound": {
    "heading": "Lehte ei leitud",
    "description": "Otsitavat lehekülge ei eksisteeri või see on eemaldatud.",
    "backHome": "Tagasi avalehele"
  },
  "validation": {
    "required": "{field} on kohustuslik.",
    "minLength": "{field} peab olema vähemalt {min} tähemärki.",
    "maxLength": "{field} võib olla kuni {max} tähemärki.",
    "invalidEmail": "Palun sisesta kehtiv e-posti aadress.",
    "invalidPhone": "Palun sisesta kehtiv telefoninumber.",
    "privacyRequired": "Andmekaitsetingimustega nõustumine on kohustuslik.",
    "rateLimit": "Liiga palju päringuid. Palun proovi hiljem uuesti.",
    "duplicate": "Päring on juba saadetud. Palun oota enne uuesti proovimist.",
    "sendFailed": "Saatmine ebaõnnestus. Palun proovi hiljem uuesti."
  },
  "metadata": {
    "home": {
      "title": "Koristusfirma Tallinnas | SPS Grupp",
      "description": "20+ aastase kogemusega koristusfirma Tallinnas. Hooldame üle miljoni m² iga päev. ISO 9001 sertifikaat. Küsi tasuta pakkumist!"
    },
    "koristusteenus": {
      "title": "Koristusteenus Tallinnas | SPS Grupp",
      "description": "Regulaarne koristusteenus kontoritele, kaubanduspindadele ja tootmishoonetele Tallinnas. ISO 9001 sertifikaat."
    }
    // ... all page metadata
  }
}
```

### 4.2 Translation Script — `scripts/translate.mjs`

> Uses Deepseek V4 Pro (OpenAI-compatible chat API at `api.deepseek.com/v1`).
> Set `DEEPSEEK_API_KEY` in your `.env.local` before running.

```mjs
#!/usr/bin/env node
/**
 * Translates messages/et.json → messages/en.json, messages/ru.json
 * Uses Deepseek V4 Pro API (OpenAI-compatible chat completions).
 *
 * Usage: DEEPSEEK_API_KEY=sk-... node scripts/translate.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const messagesDir = join(__dirname, '..', 'messages')

const DEEPSEEK_BASE = 'https://api.deepseek.com/v1'

const LANGUAGES = {
  en: 'English',
  ru: 'Russian',
}

const apiKey = process.env.DEEPSEEK_API_KEY
if (!apiKey) {
  console.error('ERROR: DEEPSEEK_API_KEY environment variable is not set.')
  process.exit(1)
}

// Load source (Estonian)
const source = JSON.parse(readFileSync(join(messagesDir, 'et.json'), 'utf8'))

// Load metadata (tracks which keys are already translated)
const metadataPath = join(messagesDir, 'translation-metadata.json')
let metadata = {}
if (existsSync(metadataPath)) {
  metadata = JSON.parse(readFileSync(metadataPath, 'utf8'))
}

/**
 * Find keys that exist in source but are missing or outdated in target.
 */
function findMissingKeys(sourceObj, targetObj, lang, prefix = '') {
  const missing = {}
  for (const [key, value] of Object.entries(sourceObj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const langMeta = metadata[lang]?.[fullKey]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recurse into nested objects
      const targetSub = (targetObj && targetObj[key] && typeof targetObj[key] === 'object') ? targetObj[key] : {}
      const nested = findMissingKeys(value, targetSub, lang, fullKey)
      if (Object.keys(nested).length > 0) {
        missing[key] = nested
      }
    } else if (typeof value === 'string' && value.trim()) {
      // Check if translation exists and hash hasn't changed
      const sourceHash = simpleHash(value)
      if (!targetObj?.[key] || langMeta?.sourceHash !== sourceHash) {
        missing[key] = value
      }
    }
  }
  return missing
}

function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + c
    hash |= 0
  }
  return String(hash)
}

async function translateBatch(missingObj, targetLang) {
  const langName = LANGUAGES[targetLang]
  const jsonStr = JSON.stringify(missingObj, null, 2)

  const response = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 16384,
      temperature: 0.1,
      messages: [{
        role: 'system',
        content: 'You are a professional translator. Translate JSON values from Estonian to the target language. Return ONLY valid JSON with the same keys, no markdown or explanations.'
      }, {
        role: 'user',
        content: `Translate the following JSON values from Estonian to ${langName}.

CRITICAL RULES:
1. Keep ALL JSON keys exactly as-is — NEVER translate keys
2. Translate ONLY the string values (the text after the colon)
3. Keep brand names unchanged: SPS Grupp, SPS Grupp OÜ
4. Keep phone numbers, emails, URLs unchanged
5. Keep template placeholders like {field}, {min}, {max} unchanged
6. Keep emoji characters unchanged
7. Keep HTML tags in values (<strong>, <a href="...">, etc.) intact — only translate text between tags
8. Keep technical abbreviations: ISO, HEPA, SKU, m²
9. For Russian, use NATURAL Cyrillic — do NOT transliterate
10. For Russian, use formal Вы (not ты) for customer-facing text
11. Keep Estonian legal references (EU regulations, Estonian law) — translate descriptions but keep regulation numbers
12. Return ONLY valid JSON — no markdown, no backticks, no explanations

JSON to translate:
${jsonStr}`
      }]
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Deepseek API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = data.choices[0].message.content

  // Extract JSON from response (handle code blocks)
  let jsonText = text
  const codeBlock = text.match(/```(?:json)?\n?([\s\S]+?)\n?```/)
  if (codeBlock) jsonText = codeBlock[1].trim()
  else {
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}')
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonText = text.slice(jsonStart, jsonEnd + 1)
    }
  }

  return JSON.parse(jsonText)
}

function deepMerge(target, source) {
  const result = { ...target }
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value) &&
        typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], value)
    } else {
      result[key] = value
    }
  }
  return result
}

function updateMetadata(lang, sourceObj, metadataObj) {
  if (!metadataObj[lang]) metadataObj[lang] = {}
  for (const [key, value] of Object.entries(sourceObj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      updateMetadata(lang, value, metadataObj)
    } else if (typeof value === 'string') {
      const langMeta = metadataObj[lang]
      const flatKey = `${lang}.${key}` // simplified — full path tracking in production
    }
  }
  return metadataObj
}

async function main() {
  for (const lang of Object.keys(LANGUAGES)) {
    console.log(`\n=== Translating to ${LANGUAGES[lang]} (${lang}) ===`)
    
    const targetPath = join(messagesDir, `${lang}.json`)
    const existing = existsSync(targetPath)
      ? JSON.parse(readFileSync(targetPath, 'utf8'))
      : {}
    
    const missing = findMissingKeys(source, existing, lang)
    const missingCount = countStrings(missing)
    
    if (missingCount === 0) {
      console.log(`  No missing translations. Skipping.`)
      continue
    }
    
    console.log(`  Found ${missingCount} strings to translate...`)
    
    // Split into batches of ~50 top-level keys to avoid token limits
    const entries = Object.entries(missing)
    const batchSize = 50
    const translated = {}
    
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = Object.fromEntries(entries.slice(i, i + batchSize))
      console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(entries.length / batchSize)}...`)
      
      const result = await translateBatch(batch, lang)
      Object.assign(translated, result)
    }
    
    // Merge with existing translations
    const merged = deepMerge(existing, translated)
    writeFileSync(targetPath, JSON.stringify(merged, null, 2) + '\n', 'utf8')
    console.log(`  ✓ Wrote ${targetPath}`)
  }
  
  // Update metadata
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n', 'utf8')
  console.log('\n✓ Translation complete.')
}

function countStrings(obj) {
  let count = 0
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      count += countStrings(value)
    } else if (typeof value === 'string') {
      count++
    }
  }
  return count
}

main().catch(err => {
  console.error('Translation failed:', err)
  process.exit(1)
})
```

Add to `package.json`:
```json
"scripts": {
  "translate": "node scripts/translate.mjs"
}
```

### 4.3 Translation Workflow

```bash
# 1. Extract all Estonian strings → messages/et.json (manual step, see Step 5)
# 2. Run AI translation
DEEPSEEK_API_KEY=sk-... npm run translate
# 3. Review translations (check for brand name preservation, tone, accuracy)
# 4. Commit messages/{en,ru}.json
```

---

## Step 5: Component i18n Wiring (Execute in Order)

### 5.1 Shared Components (do first — used everywhere)

| # | File | Changes |
|---|---|---|
| 1 | `Navbar.tsx` | Replace all `label` strings with `t('nav.xxx')`, mega menu items, aria labels. Make language switcher buttons call `switchLocale()` |
| 2 | `Footer.tsx` | Replace all labels in nav/mega menu/contact section |
| 3 | `FooterCTA.tsx` | Replace title, description, CTA button text |
| 4 | `ContactForm.tsx` | Replace ALL labels, placeholders, validation messages, success text, privacy text, submit button |
| 5 | `CareerForm.tsx` | Same as ContactForm but for career fields |
| 6 | `FAQ.tsx` | Replace FAQ items, section description, CTA |
| 7 | `Hero.tsx` | Replace heading, description, CTA, floating chips |
| 8 | `Services.tsx` | Replace all paragraph text |
| 9 | `Testimonials.tsx` | Replace section tag, heading, "view all" button |
| 10 | `Industries.tsx` | Replace all industry titles/subtitles/badges/descriptions |
| 11 | `Trust.tsx` | Replace all text |
| 12 | `Tooprotsess.tsx` | Replace section tag, title, intro, step titles/texts |
| 13 | `Hinnakalkulaator.tsx` | Replace all labels, options, result text |
| 14 | `SeasonalServicesBlock.tsx` | Replace all text |
| 15 | `TooleAnnouncements.tsx` | Replace all text |
| 16 | `Logos.tsx` | Replace any alt text/labels |
| 17 | `TestimonialCards.tsx` | Replace any text |

### 5.2 Route Pages

Each page keeps its component logic but reads ALL text from translations:

```tsx
// content-pages/koristusteenus/kontori-koristus/page.tsx
'use client'
import { useTranslations } from './use-translations' // or pass locale from the catch-all
import Navbar from '@/app/components/Navbar'
// ... etc.

export default function KontoriKoristusPage({ locale }: { locale: 'et' | 'en' | 'ru' }) {
  const t = useTranslations(locale, 'kontoriKoristus')
  
  return (
    <>
      <SeoJsonLd
        serviceName={t('seo.serviceName')}
        serviceDescription={t('seo.serviceDescription')}
        // ...
        faq={(t.raw('faq') as any[]).map(f => ({ question: f.q, answer: f.a }))}
      />
      <Navbar locale={locale} />
      <main>
        <section aria-label={t('hero.ariaLabel')}>
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.description')}</p>
          <a href="#pakkumine">{t('hero.cta')}</a>
        </section>
        {/* ... */}
      </main>
      <Footer locale={locale} />
    </>
  )
}
```

### 5.3 Translation Provider

Create a lightweight provider that passes `locale` and `messages` through React context. No need for `next-intl` if we want to keep it simple. Or install `next-intl` and use its provider pattern (recommended — it handles pluralization, ICU messages, and date formatting).

**Recommended approach**: Install and use `next-intl` for its provider, `useTranslations`, and `getTranslations`:

```bash
npm install next-intl
```

```tsx
// lib/i18n-provider.tsx
'use client'
import { NextIntlClientProvider } from 'next-intl'
import etMessages from '@/messages/et.json'
import enMessages from '@/messages/en.json'
import ruMessages from '@/messages/ru.json'

const messagesMap = { et: etMessages, en: enMessages, ru: ruMessages }

export function I18nProvider({ locale, children }: { locale: string; children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale] || etMessages}>
      {children}
    </NextIntlClientProvider>
  )
}
```

Each catch-all page wraps its content in this provider:

```tsx
export default async function EtPage({ params }: Props) {
  const path = resolvePath((await params).slug)
  const page = getPage(path)
  if (!page) notFound()
  return (
    <I18nProvider locale="et">
      <page.component locale="et" />
    </I18nProvider>
  )
}
```

---

## Step 6: Blog Auto-Translation System

### 6.1 Database Migration

Create the translations table:

```sql
-- Run in Neon SQL editor or via Drizzle migration
CREATE TABLE IF NOT EXISTS blog_translations (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'ru')),
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  content_html TEXT,
  status TEXT NOT NULL DEFAULT 'auto' CHECK (status IN ('auto', 'edited')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(blog_id, language)
);
```

### 6.2 Drizzle Schema

```ts
// lib/db/schema.ts — add to existing exports

import { pgTable, serial, integer, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"

export const blogTranslations = pgTable("blog_translations", {
  id: serial("id").primaryKey(),
  blogId: integer("blog_id").notNull(),
  language: text("language").notNull(),
  title: text("title"),
  slug: text("slug"),
  excerpt: text("excerpt"),
  contentHtml: text("content_html"),
  status: text("status").notNull().default("auto"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  unique: uniqueIndex("blog_trans_blog_lang_idx").on(table.blogId, table.language),
}))
```

### 6.3 Translation API Integration

> Uses Deepseek V4 Pro via the OpenAI-compatible chat endpoint.

```ts
// lib/translate-blog.ts
import { db } from '@/lib/db'
import { blogTranslations } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

const DEEPSEEK_BASE = 'https://api.deepseek.com/v1'

const LANG_NAMES: Record<string, string> = { en: 'English', ru: 'Russian' }

interface TranslationResult {
  title: string
  slug: string
  excerpt: string
  contentHtml: string
}

export async function translateBlogPost(
  blogId: number,
  title: string,
  excerpt: string,
  contentHtml: string
): Promise<{ en: TranslationResult; ru: TranslationResult }> {
  const [en, ru] = await Promise.all([
    callDeepseek(title, excerpt, contentHtml, 'en'),
    callDeepseek(title, excerpt, contentHtml, 'ru'),
  ])

  // Save to DB
  const rows = [
    { blogId, language: 'en', ...en, status: 'auto' },
    { blogId, language: 'ru', ...ru, status: 'auto' },
  ]

  await db.insert(blogTranslations).values(rows).onConflictDoUpdate({
    target: [blogTranslations.blogId, blogTranslations.language],
    set: {
      title: sql`excluded.title`,
      slug: sql`excluded.slug`,
      excerpt: sql`excluded.excerpt`,
      contentHtml: sql`excluded.content_html`,
      status: 'auto',
      updatedAt: new Date(),
    },
  })

  return { en, ru }
}

async function callDeepseek(
  title: string,
  excerpt: string,
  contentHtml: string,
  lang: string
): Promise<TranslationResult> {
  const langName = LANG_NAMES[lang]

  const response = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 8192,
      temperature: 0.1,
      messages: [{
        role: 'system',
        content: 'You are a professional translator. Translate blog content from Estonian to the target language. Return ONLY a JSON object with the specified keys, no explanations.'
      }, {
        role: 'user',
        content: `Translate this Estonian blog post to ${langName}. It is for a professional cleaning company (SPS Grupp).

Return a JSON object with these exact keys: title, slug, excerpt, contentHtml

SLUG RULES:
- Translate the title to ${langName}, convert to URL-friendly format (lowercase, hyphens)
- For Russian: use CYRILLIC characters in the slug, NOT transliteration
- Example: "Kontori koristuse juhend" → EN: "office-cleaning-guide" → RU: "руководство-по-уборке-офиса"
- No trailing slash

CONTENT RULES:
- PRESERVE ALL HTML tags, attributes, and structure EXACTLY (<h2>, <p>, <ul>, <li>, <a href="...">, <img src="...">, etc.)
- Translate ONLY the visible text between/inside tags
- Keep ALL link URLs (href attributes) unchanged
- Keep ALL image URLs (src attributes) unchanged
- Keep brand names: SPS Grupp, SPS Grupp OÜ
- Keep technical certifications: ISO 9001, ISO 14001
- Keep numbers, dates, phone numbers, prices unchanged
- Maintain professional but approachable tone
- For Russian: use formal Вы (not ты)

Title: ${title}
Excerpt: ${excerpt}
Content HTML: ${contentHtml.slice(0, 6000)}`
      }]
    })
  })

  if (!response.ok) {
    throw new Error(`Deepseek API error ${response.status}: ${await response.text()}`)
  }

  const data = await response.json()
  const text = data.choices[0].message.content
  const jsonStart = text.indexOf('{')
  const jsonEnd = text.lastIndexOf('}')
  return JSON.parse(text.slice(jsonStart, jsonEnd + 1))
}

export async function getBlogTranslation(blogId: number, language: string): Promise<TranslationResult | null> {
  const rows = await db.select().from(blogTranslations)
    .where(and(eq(blogTranslations.blogId, blogId), eq(blogTranslations.language, language)))
    .limit(1)
  if (!rows.length) return null
  return {
    title: rows[0].title || '',
    slug: rows[0].slug || '',
    excerpt: rows[0].excerpt || '',
    contentHtml: rows[0].contentHtml || '',
  }
}
```

### 6.4 Admin API Modification

In `app/api/spsadmn/blog/route.ts`, after the existing PUT save logic, add:

```ts
// After existing save logic (~line 100)...
// Trigger AI translation
if (safeFields.title && safeFields.contentHtml) {
  translateBlogPost(postId, safeFields.title, safeFields.excerpt || '', safeFields.contentHtml)
    .catch(err => console.error(`Blog translation failed for post ${postId}:`, err))
}

// Return translations alongside the post
const translations = await db.select().from(blogTranslations)
  .where(eq(blogTranslations.blogId, postId))

return NextResponse.json({
  success: true,
  post: post ? { /* existing fields */ } : null,
  translations: translations.map(t => ({
    language: t.language,
    title: t.title,
    slug: t.slug,
    excerpt: t.excerpt,
    contentHtml: t.contentHtml,
    status: t.status,
  })),
})
```

### 6.5 Blog Serving (Data Layer)

Modify `app/blog/data.ts` to be locale-aware:

```ts
// Add locale parameter
export const getPostBySlugWithEdits = cache(async (slug: string, locale: string = 'et') => {
  const base = blogPosts.find((p) => p.slug === slug)
  if (!base) return undefined

  if (locale === 'et') {
    const edits = await getAdminEdits()
    // existing ET logic...
    return /* Estonian post */
  }

  // For EN/RU: try translated version, fall back to Estonian
  const translation = await getBlogTranslation(base.id, locale)
  if (!translation) {
    return { ...base, contentHtml: sanitizeHtmlSafe(base.contentHtml), translationMissing: true }
  }

  return {
    ...base,
    title: translation.title,
    excerpt: translation.excerpt,
    contentHtml: sanitizeHtmlSafe(translation.contentHtml),
    slug: translation.slug || base.slug, // use translated slug if available
  }
})
```

### 6.6 Blog Routes

```
app/blog/[slug]/page.tsx           ← Estonian blog posts
app/en/blog/[slug]/page.tsx        ← English blog posts
app/ru/blog/[slug]/page.tsx        ← Russian blog posts
```

EN/RU blog routes resolve the slug against `blogTranslations` (or fall back to Estonian post ID/slug lookup) and render the same `BlogPostPage` component with the appropriate locale.

---

## Step 7: SEO & Metadata

### 7.1 Shared Metadata Generator

```ts
// lib/seo-metadata.ts
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { localizePath } from '@/lib/slug-map'

const LOCALE_MAP: Record<string, string> = {
  et: 'et_EE',
  en: 'en_US',
  ru: 'ru_RU',
}

export async function generateLocalizedMetadata(
  etPath: string,
  locale: string,
  namespace: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `metadata.${namespace}` })
  const baseUrl = 'https://spsgrupp.ee'

  const title = t('title')
  const description = t('description')
  const url = locale === 'et' ? `${baseUrl}${etPath}` : `${baseUrl}${localizePath(etPath, locale as 'en' | 'ru')}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        et: `${baseUrl}${etPath}`,
        en: `${baseUrl}${localizePath(etPath, 'en')}`,
        ru: `${baseUrl}${localizePath(etPath, 'ru')}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'SPS Grupp',
      locale: LOCALE_MAP[locale] || 'et_EE',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}
```

### 7.2 Sitemap

Modify `app/sitemap.ts` to generate entries for all three locales:

```ts
// Inside sitemap() function, for each page:
const pagePaths = getAllPaths()
for (const etPath of pagePaths) {
  const etDate = await getEditorialDate(etPath, ...filePathsFor(etPath))

  // Estonian entry
  entries.push({
    url: `${BASE_URL}${etPath}`,
    lastModified: etDate,
    changeFrequency: 'weekly',
    priority: getPriority(etPath),
    alternates: {
      languages: {
        et: `${BASE_URL}${etPath}`,
        en: `${BASE_URL}${localizePath(etPath, 'en')}`,
        ru: `${BASE_URL}${localizePath(etPath, 'ru')}`,
      },
    },
  })

  // English entry
  entries.push({
    url: `${BASE_URL}${localizePath(etPath, 'en')}`,
    lastModified: etDate,
    changeFrequency: 'weekly',
    priority: getPriority(etPath),
    alternates: { /* same languages map */ },
  })

  // Russian entry
  entries.push({
    url: `${BASE_URL}${localizePath(etPath, 'ru')}`,
    lastModified: etDate,
    changeFrequency: 'weekly',
    priority: getPriority(etPath),
    alternates: { /* same languages map */ },
  })
}

// Blog posts per locale
for (const post of blogPosts) {
  // ET, EN, RU entries using blogTranslations slugs where available
}
```

### 7.3 `next.config.ts` — Keep All Existing Redirects

No changes needed. All existing redirects are for Estonian legacy URLs and remain valid. They don't apply to `/en/` or `/ru/` paths.

---

## Step 8: Language Switcher (Navbar)

The existing ET | EN | RU buttons in the Navbar become functional:

```tsx
// In Navbar.tsx — language switcher section
import { usePathname } from 'next/navigation'
import { localizePath } from '@/lib/slug-map'

// ...

const pathname = usePathname()
const currentEtPath = getCurrentEtPath(pathname) // reverse-resolve from enToEt or ruToEt, or use pathname directly if ET

function switchLanguage(newLocale: 'et' | 'en' | 'ru') {
  const targetPath = localizePath(currentEtPath, newLocale)
  router.push(targetPath)
}

// Render buttons:
<button onClick={() => switchLanguage('et')} aria-current={locale === 'et' ? 'page' : undefined}>ET</button>
<button onClick={() => switchLanguage('en')} aria-current={locale === 'en' ? 'page' : undefined}>EN</button>
<button onClick={() => switchLanguage('ru')} aria-current={locale === 'ru' ? 'page' : undefined}>RU</button>
```

---

## Step 9: Forms & Server Actions

### 9.1 Validation Messages — `lib/actions.ts`

Replace hardcoded Estonian error strings with locale-aware messages:

```ts
// lib/actions.ts
import { getTranslations } from 'next-intl/server'

// Add locale parameter to validation functions
function validateRequired(value: string, minLen: number, maxLen: number, fieldKey: string, t: any): string | null {
  const trimmed = value.trim()
  if (!trimmed) return t('required', { field: t(`fields.${fieldKey}`) })
  if (trimmed.length < minLen) return t('minLength', { field: t(`fields.${fieldKey}`), min: minLen })
  if (trimmed.length > maxLen) return t('maxLength', { field: t(`fields.${fieldKey}`), max: maxLen })
  return null
}

// Pass locale through form data or headers
export async function submitContactForm(_prevState: FormState, formData: FormData): Promise<FormState> {
  const locale = (formData.get('locale') as string) || 'et'
  const t = await getTranslations({ locale, namespace: 'validation' })
  
  // ... validation uses t('required'), t('invalidEmail'), etc.
}
```

### 9.2 Add Locale to Form Data

```tsx
// In ContactForm.tsx — add hidden locale field
<form action={formAction}>
  <input type="hidden" name="locale" value={locale} />
  {/* ... rest of form ... */}
</form>
```

---

## Step 10: Build & Verify

### 10.1 TypeScript Setup

Declare message types:

```ts
// lib/i18n-types.ts
import etMessages from '@/messages/et.json'

export type Messages = typeof etMessages
export type MessageNamespace = keyof Messages
```

### 10.2 Build Verification

```bash
npm run build   # catches type errors, missing imports, broken routes
npm run lint    # ESLint compliance
```

### 10.3 Manual Verification Checklist

- [ ] Homepage renders in all 3 languages
- [ ] Navigate to every service page in all 3 languages
- [ ] Language switcher correctly preserves the current page
- [ ] All forms submit and show correct locale validation errors
- [ ] Blog list renders with locale-appropriate post titles/excerpts
- [ ] Individual blog posts show translated content (or ET fallback)
- [ ] Admin blog save triggers translation
- [ ] Admin can view/edit EN/RU translations
- [ ] Sitemap returns all 3 locales with correct hreflang
- [ ] `<html lang>` is correct per locale
- [ ] Canonical URLs are correct per locale
- [ ] OG metadata is locale-appropriate
- [ ] JSON-LD schemas contain translated text
- [ ] 404 page renders in correct language
- [ ] Privacy policy renders in correct language
- [ ] All pages meet min 15px font size rule (unchanged)
- [ ] No broken Estonian URLs (redirects from `next.config.ts` still work)
- [ ] EN/RU slugs are accessible and returning 200

---

## Quick Reference: Key Commands

```bash
# Translate static messages (run after adding/editing et.json)
DEEPSEEK_API_KEY=sk-... npm run translate

# Build check
npm run build

# Lint
npm run lint

# Dev server (test all 3 locales)
npm run dev
# Then visit: http://localhost:3000/ (ET)
#             http://localhost:3000/en/ (EN)
#             http://localhost:3000/ru/ (RU)
```

---

## File Map — What Gets Created / Modified

| File | Action | Purpose |
|---|---|---|
| `messages/et.json` | **NEW** | Source of truth — all Estonian strings |
| `messages/en.json` | **NEW** | English translations |
| `messages/ru.json` | **NEW** | Russian translations |
| `scripts/translate.mjs` | **NEW** | AI translation script |
| `lib/slug-map.ts` | **NEW** | Bidirectional et↔en/ru path mapping |
| `lib/page-registry.ts` | **NEW** | Path → page component mapping |
| `lib/seo-metadata.ts` | **NEW** | Locale-aware metadata generator |
| `lib/translate-blog.ts` | **NEW** | Blog post AI translation |
| `lib/db/schema.ts` | MODIFY | Add `blogTranslations` table |
| `app/[[...slug]]/page.tsx` | **NEW** | Estonian catch-all route |
| `app/en/[[...slug]]/page.tsx` | **NEW** | English catch-all route |
| `app/ru/[[...slug]]/page.tsx` | **NEW** | Russian catch-all route |
| `content-pages/**/page.tsx` | **NEW** | All page components (moved from `app/`) |
| `app/components/Navbar.tsx` | MODIFY | Language switcher + i18n strings |
| `app/components/*.tsx` | MODIFY | All 22 components → i18n |
| `app/layout.tsx` | MODIFY | Dynamic `<html lang>` |
| `app/not-found.tsx` | MODIFY | Locale-aware 404 |
| `app/sitemap.ts` | MODIFY | Multi-locale sitemap |
| `app/blog/**` | MODIFY | Locale-aware blog serving |
| `app/api/spsadmn/blog/route.ts` | MODIFY | Auto-translation on save |
| `lib/actions.ts` | MODIFY | Locale-aware validation messages |
| `package.json` | MODIFY | Add `translate` script, add `next-intl` dependency |

---

## Execution Order (Do NOT skip or reorder)

1. `npm install next-intl`
2. Create `lib/slug-map.ts` (all path mappings)
3. Create `lib/page-registry.ts` (all page components)
4. Create `content-pages/` directory, move all ~50 page components in
5. Create `app/[[...slug]]/page.tsx` + `app/en/[[...slug]]/page.tsx` + `app/ru/[[...slug]]/page.tsx`
6. Build and verify routing works (pages render in ET before any translation)
7. Extract all strings → `messages/et.json`
8. Create `scripts/translate.mjs`, run first translation → `en.json`, `ru.json`
9. Wire `next-intl` provider into catch-all routes
10. Convert components one by one (Navbar first, then Hero, Footer, forms, etc.)
11. Update `lib/actions.ts` for locale-aware validation
12. Add `blogTranslations` table (Drizzle schema + DB migration)
13. Create `lib/translate-blog.ts`
14. Update `app/api/spsadmn/blog/route.ts`
15. Update `app/blog/data.ts` + blog routes for locale-aware serving
16. Create `lib/seo-metadata.ts`, wire into all layouts and catch-all metadata
17. Update `app/sitemap.ts` for multi-locale
18. Update `app/layout.tsx` for dynamic `html[lang]`
19. Update `app/not-found.tsx` for locale-aware 404
20. Full `npm run build` + `npm run lint` — fix all issues
21. Manual QA (all 3 locales, all pages, forms, blog, admin)
