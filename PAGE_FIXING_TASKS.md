# SPS Grupp — Site Fixing + Conversion Tasks

Right-sized execution plan derived from `PAGE_ARCHITECTURE_MIGRATION_TASKS.md`, targeting the actual defects first, then converging the working pages as low-risk cleanup.

## Objective

**Part 1 (Fixing):** Eliminate the generic `LocalizedContentPage` rendering path so every public page renders its exact Estonian design in all three locales; restore and harden DB-backed EN/RU content (reviews, job offers).

**Part 2 (Conversion):** Fold the 28 already-working PageViews into the same unified content/template system as a low-risk cleanup.

## Preservation constraints (apply to every task)

- every public URL and redirect;
- the current visual design and section order;
- all approved text, prices, forms, images, and business claims;
- metadata, canonicals, `hreflang`, sitemap entries, and JSON-LD;
- the minimum visible font size of 15 px;
- current desktop and mobile behaviour unless correcting a verified defect.

## Approved decisions

1. Task file kept separate from `PAGE_ARCHITECTURE_MIGRATION_TASKS.md` (that doc remains the long-term reference).
2. Missing EN/RU content (careers stats/benefits/chips, page-specific testimonial quotes) is translated from the ET source text, matching the tone of existing translations.
3. Page-specific testimonials are migrated into namespaces for full ET fidelity.
4. Conversion-phase store: typed TS definitions under `lib/pages/definitions/`; `messages/*.json` remains for next-intl UI strings.
5. Supabase unpausing handled by owner; DB verified working 2026-08-05.

---

## PART 1 — FIXING

### Task 0 — Supabase recovery and DB-backed translations — ✅ DONE (2026-08-05)

- [x] Supabase project `spsgrupp-live` ACTIVE; reviews and job listings render on EN/RU in production (owner restored).
- [x] Hardened `lib/translate-jobs.ts` readers (`getJobTranslationsByLanguage`, `getJobTranslationsBulk`, `getJobTranslations`, `getJobTranslationBySlug`) with try/catch JSON fallback — mirrors `lib/translate-testimonials.ts`.
- [x] Hardened `saveJobTranslations` and `markJobTranslationsStale` with the same JSON fallback.
- [x] Verified `/api/jobs?lang=en|ru` returns translated items in production.

### Task 1 — Freeze baseline — ✅ DONE

- [x] `npm run i18n:parity` executed after migration: **all 36 pages green**, matching section order across ET/EN/RU, zero ET text on non-ET pages (`raportid/i18n-parity-report.md`).
- [x] Gate confirmed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build` all pass.

### Task 2 — Migrate the 6 generic pages to registry PageViews — ✅ DONE

Pattern (proven on kontakt/sps-grupp): ET content stays hardcoded in the page file as source of truth; `PageView({ locale })` export renders the exact ET JSX; EN/RU text mapped from existing `messages/*.json` namespace via `getLocalizedContent()`; register in `lib/localized-page-registry.tsx`.

- [x] `/koristusteenus/kontori-koristus` → `KontoriKoristusPageView` (pilot). EN/RU namespaces aligned: 9 services, 5 whyUs reasons, 5 testimonials, services links, hero chips.
- [x] `/koristusteenus/kaubanduspindade-koristus` → `KaubanduspindadeKoristusPageView`. Aligned: 8 services, 4 reasons, 3 testimonials, chips.
- [x] `/koristusteenus/tootmishoonete-koristus` → `TootmishooneteKoristusPageView`. Aligned: 9 services, 4 reasons, 3 testimonials, chips (ISO 14001).
- [x] `/koolide-koristamine` → `KoolideKoristaminePageView`. Aligned: 9 services, 4 reasons, 3 testimonials + caseStudy + video section.
- [x] `/koristusteenus` (hub) → `KoristusteenusPageView` with linked service cards, `MaintenancePriceExamples` + calculator, bottom-positioned chips.
- [x] `/tule-meile-toole` → `TuleMeileToolePageView`. Careers namespace expanded: seo, 3 hero chips, 8 benefits, stats section (4 stats + `/tuletoole-2.jpg`), recruitment process.
- [x] Preserved per-page extras: `SeoJsonLd`, `Hinnakalkulaator locale`, `TooleAnnouncements locale`, `localizePath` breadcrumbs/links.
- [x] Acceptance met: i18n:parity zero structural divergence on all pages.

### Task 3 — Retire LocalizedContentPage — ✅ DONE

- [x] Confirmed zero consumers (`privacyPolicy` uses `PrivacyPolicyPage`; all former consumers registry-rendered).
- [x] Removed `app/components/LocalizedContentPage.tsx` and both catch-all imports/branches.
- [x] Kept all `messages/*.json` namespaces (feed PageViews + `getLocalizedSeoMetadata`).
- [x] Full verification suite + build pass.

### Task 4 — Consolidate the five registries into one — ✅ DONE

- [x] Created `lib/pages/registry.ts`: one entry per page declaring ET path, EN/RU slugs, parent, content namespace, hero image, `localized` flag (blog excluded from localization by design).
- [x] `lib/slug-map.ts` now derives `localizedPaths` from the registry (identical public API; `localizePath`, `getCurrentEtPath`, reverse maps unchanged).
- [x] `lib/localized-content.ts` derives `contentNamespacesByPath` and `heroImagesByPath` from the registry.
- [x] `page-registry.ts` (loaders), `localized-page-registry.tsx` (renderers), `metadata-registry.ts` (titles/descriptions) remain as wiring/data files — consistency now enforced by `i18n:validate`.
- [x] Removed 5 stale metadata entries (legacy deleted pages: torutood-2, remonditeenused muruniitmine/lehtedekoristamine/kojameheteenus, /privaatsus).
- [x] Verified derived maps byte-identical (37/36/35 entries); all 38 unit tests + build pass; every public URL preserved.

### Task 5 — Build-time content validation — ✅ DONE

- [x] Created `scripts/i18n-validate.ts` (no server needed): registry integrity (unique paths/slugs, valid parents), cross-registry consistency (loaders/renderers/metadata ↔ registry), EN/RU namespace key-set equivalence (strict for the 8 PageView-consumed namespaces, warnings for dormant ones), required fields per PageView namespace (`whyUs.image`, testimonials, tooprotsess steps, caseStudy, stats).
- [x] Wired as `npm run i18n:validate`; also runs inside `npm test`.
- [x] Acceptance met: removing an EN field or whyUs image fails the run with a page-and-field-specific error.
- [x] Documented 174 pre-existing RU gaps in dormant namespaces as warnings — backlog for Part 2 Task 6 (will be filled from inline `ruD` data during conversion).

---

## PART 2 — CONVERSION (only after Part 1 is verified in production)

### Task 6 — Unify content definitions for the 26 OutdoorServicePage pages — ✅ DONE (2026-08-05, data move; wiring helper deferred to Task 8)

- [x] Move each page's inline `etD/enD/ruD` into typed definition files under `lib/pages/definitions/` — pure data move, no text changes.
- [ ] Move inline tooprotsess title/intro/steps into the same definitions. → rolled into Task 8 (template helper)
- [ ] Replace per-page locale ternaries and `SeoJsonLd`/`Tooprotsess` wiring with one template helper. → rolled into Task 8
- [x] Migrate in family batches (valikoristus 9 → puhastusteenused 7 → remonditeenused 9 → ehitusprahi 1); visual comparison + `i18n:parity` per batch before the next.

### Task 7 — Fold kontakt/sps-grupp into the definition format — ✅ DONE (2026-08-06)

- [x] Move EN/RU mapping logic from page files into typed definitions in the same store. `lib/pages/definitions/kontakt.ts` + `sps-grupp.ts` export fully-resolved `et/en/ru: KontaktPageData/SpsGruppPageData` (generated by replaying the pages' own mapping logic); `etText`/`localizedText`/`asRecord`/`numberedStrings`/`derived` and the `getLocalizedContent` imports deleted from both page files. `messages/*.json` kontakt/spsGrupp namespaces kept for now (still read by `getLocalizedSeoMetadata`; removal is Task 9).
- [x] Keep their dedicated templates (genuinely distinct page families). JSX untouched; verified byte-identical rendered HTML for all 6 URLs (et/en/ru × kontakt/sps-grupp) before/after, plus tsc/eslint/i18n:validate/i18n:parity green.

### Task 8 — Formalize page-family templates — ✅ DONE (2026-08-06)

- [x] Promoted `OutdoorServicePage` → typed `ServiceDetailTemplate` (`app/components/templates/ServiceDetailTemplate.tsx`): absorbs `SeoJsonLd` + `OutdoorServicePage` + `Tooprotsess` wiring and the locale selection. All 26 detail pages (incl. valikoristus/puhastusteenused/remonditeenused hubs, which are OutdoorServicePage pages) converted to 11-line shells; `/koristusteenus` hub, `/tule-meile-toole`, kontakt/sps-grupp stay dedicated PageViews as planned.
- [x] `OutdoorServicePageData`/`ServiceInfoBlockData` types moved to the template (single source); tooprotsess title/intro/steps + seo serviceName/serviceDescription + JSON-LD breadcrumbs moved from page files into `lib/pages/definitions/*` as a per-locale `serviceDetail` export (`ServiceDetailDefs`). Breadcrumbs stored per-page per-locale (not a shared map) — extraction measured real per-page variance (ET "Välikoristus" vs "Valikoristus", lowercase hub labels, leading-slash etPath variants) that a shared map could not reproduce byte-identically.
- [x] Templates stay server components; interactive widgets (FAQ, slider, calculator, forms, menu) remain client components.
- [x] Migrated in family batches (valikoristus 9 → puhastusteenused 7 → remonditeenused 9 → ehitusprahi 1) via an AST extraction script (TypeScript compiler API, no text regex on content); per batch: re-capture all 36 pages × 3 locales and byte-compare against baseline — **108/108 identical after every batch**, plus tsc/eslint/i18n:validate/i18n:parity green. Final: `npm test` (38 tests) + `npm run build` green.

### Task 9 — Final cleanup and docs — ✅ DONE (2026-08-06)

- [x] **Content bug fixed first:** EN/RU `tooprotsess` (title + 5 steps) was in Estonian on 12 detail pages (eskalaatorite-suvapuhastus, desinfitseerimine, porandate-hooldus, suitsu-ja-tulekahjustuste-puhastamine + all 8 remonditeenused detail pages). Translated from the ET source per approved decision 2, intros were already translated. Verified: byte-diff vs Task 8 baseline showed exactly the 24 intended page diffs (12 × en/ru), nothing else.
- [x] Deleted the 26+2 dormant JSON namespaces from `messages/en.json`/`ru.json` (212→71 KB, 296→110 KB). ⚠️ Plan correction vs handover: the definitions' `seo` blocks are the JSON-LD Service-schema data (live on all locales) and did NOT match the JSON namespaces' richer `seo` copy (live HTML titles/descriptions on 20 EN/RU fall-through pages). The 20 live blocks were moved to `localizedPageMetadata` (`lib/metadata-registry.ts`, values byte-identical, suffix rule replicated); definitions' `seo` untouched. `/tule-meile-toole` keeps reading `careers.seo` via `getLocalizedSeoMetadata`; `/kontakt` had no seo (unchanged live-inventory path). Byte-diff after deletion: **108/108 identical**.
- [x] Registry slimmed: `namespace` field removed from the 28 definition-backed entries; `getLocalizedSeoMetadata` now serves careers only; dead helpers/imports already eliminated in Tasks 6–8 (byte-diff proven).
- [x] Extended Task 5 validation to definition files (`scripts/i18n-validate.ts` section 5): all 26 `serviceDetail` defs shape-checked per locale (data/seo/tooprotsess/breadcrumbs, steps ≥ 1, well-formed), plus an ET-leak guard (EN/RU tooprotsess title ≠ ET title; step-count parity) — acceptance-tested by clobbering a file: fails with page-and-locale-specific errors. New `lib/pages/definitions/index.ts` maps etPath → definition.
- [x] Updated `ARCHITECTURE.md` (real page-system section), `DESIGN.md` (15px floor; removed sub-15px type rows), `AGENTS.md` (project commands/architecture/gotchas).
- [x] Final gates: tsc ✓ · eslint ✓ · 38/38 tests + i18n:validate (zero warnings) ✓ · i18n:parity 36/36 ✓ · byte-diff 108/108 ✓ · `npm run build` ✓.

---

## Per-page migration checklist

- [ ] ET/EN/RU routes and section order recorded (Task 1 baseline).
- [ ] EN/RU namespace gaps filled (testimonials, items, sections).
- [ ] PageView renders exact ET JSX; ET visual comparison passed.
- [ ] EN/RU visual comparison passed at 390/768/1280/1440 px.
- [ ] No horizontal overflow; no visible text below 15 px.
- [ ] Metadata, canonical, `hreflang`, breadcrumbs, JSON-LD passed.
- [ ] Language switching preserves the page.
- [ ] Old rendering path has no remaining consumers for this page.

## Final verification (both parts)

- [ ] `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run i18n:validate`, `npm run i18n:parity`, `npm run build`, `npm run seo:check` — all pass.
- [ ] Every sitemap URL returns 200; EN/RU spot-check of every page family in production; language switching preserves the page everywhere.
