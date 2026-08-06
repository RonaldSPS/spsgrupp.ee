# Handover — SPS Grupp site (2026-08-06, after Task 8)

Project: `D:\WORKS\SPS\2026AprillWeb\AprilBuild` — Next.js 16 App Router, ET/EN/RU marketing site for SPS Grupp.
Reference docs: `PAGE_FIXING_TASKS.md` (execution plan, Tasks 0–8 ticked), `PAGE_ARCHITECTURE_MIGRATION_TASKS.md` (owner's long-term plan).

## State: conversion is DONE, everything green

**All 36 public pages (×3 locales) render byte-identical output to before the refactor.** Tasks 0–8 of the fixing+conversion cycle are complete:

- `LocalizedContentPage` flattening eliminated; every page renders its exact ET design in all locales.
- `lib/pages/registry.ts` = single page/path/namespace/hero registry; slug-map and localized-content derive from it.
- 26 detail pages = 11-line shells → `app/components/templates/ServiceDetailTemplate.tsx` (server component; SeoJsonLd + OutdoorServicePage + Tooprotsess wiring, locale selection, `OutdoorServicePageData` type source). Content lives in `lib/pages/definitions/<slug>.ts` as per-locale `serviceDetail` (`{ data, seo, tooprotsess, breadcrumbs }` × et/en/ru).
- kontakt/sps-grupp = dedicated templates + `KontaktPageData`/`SpsGruppPageData` definitions. 6 messages-driven PageViews (`/koristusteenus` hub, 4 koristus details, careers) + DB-backed reviews/jobs unchanged.

**Verified 2026-08-06:** `tsc --noEmit` ✓ · `eslint` ✓ · `npm test` 38/38 + `i18n:validate` ✓ · `i18n:parity` 36/36 all metrics 0 ✓ · `npm run build` ✓ · byte-diff 108/108 ✓ (gate: `%LOCALAPPDATA%\Temp\opencode\task8-capture.ts` + `task8-compare.ts` — strips dev-server flight payloads, which renumber on any module-graph change; everything user-visible stays compared).

## REMAINING (in order)

1. **⚠️ Owner decision needed — eskalaatorite-suvapuhastus EN/RU tooprotsess is in ESTONIAN.** Real content bug, pre-existing; preserved byte-for-byte into `lib/pages/definitions/eskalaatorite-suvapuhastus.ts` (`serviceDetail.en/ru.tooprotsess` hold ET title/steps). Parity can't see it (7-word ET detector). Translate EN+RU title/intro/5 steps when owner supplies text; do NOT silently translate.
2. **Task 9 — cleanup & docs** (no rendering changes expected; same byte-diff gate applies):
   - Delete the 26+2 dormant JSON namespaces from `messages/en.json`/`ru.json` AFTER rewiring `getLocalizedSeoMetadata` (`lib/localized-content.ts:40`) to read `serviceDetail[locale].seo` from definitions for those pages (identical `{serviceName, serviceDescription}` shape — mechanical). Keep all namespaces consumed by the 6 messages-driven PageViews. Then `i18n:validate`'s 174 dormant-namespace warnings go away with the namespaces.
   - Extend `scripts/i18n-validate.ts` to definition files: assert all 26 export `serviceDetail` with 3-locale shape (data/seo/tooprotsess/breadcrumbs present, steps length ≥ 1).
   - Update `ARCHITECTURE.md`, `DESIGN.md`, `AGENTS.md` to the final one-pattern system.
   - Optional: generate `lib/pages/registry.ts` → `page-registry.ts` loaders.
3. **Commit `lib/pages/` + template** — still untracked (`??` in git status); the whole cycle is uncommitted. Pre-mutation backups: `raportid/task8-backup/`, `raportid/definitions-backup/` (as `.txt` — see gotchas). Committing soon gives a diff safety net before Task 9 deletions.
4. **Deploy & production spot-check** all page families on ET/EN/RU after merge.

## Gotchas (environment + hard rules)

- Dev server running on :3000 (this session). Parity needs a running server: `Start-Job -ScriptBlock { Set-Location <repo>; npm start }`, then `npm run i18n:parity`.
- `npm run build` workers can crash (`3221226505`) with stray node processes — kill strays, retry. Environment issue, not code.
- If `npx tsx` fails ("Could not determine Node.js install directory"): `node node_modules/tsx/dist/cli.mjs <script>`.
- **tsconfig type-checks `raportid/`** — never leave `.ts/.tsx` in backup dirs (rename to `.txt`); tsx can't import page files (`ContactForm → lib/email.ts → server-only`), parse them as text/AST instead.
- Supabase (`spsgrupp-live`) can auto-pause → EN/RU reviews/jobs blank. Restore via Management API (`.env.local`: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`); readers fall back to `data/admin-*-translations.json`.
- Hard rules: min font 15px everywhere; read `node_modules/next/dist/docs/` before Next.js changes (v16 differs from training data); preserve all URLs/slugs incl. RU slugs and `/koolide-koristamine` canonical alias.
