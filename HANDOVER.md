# Handover — SPS Grupp site (2026-08-06, after Task 9 + commit)

Project: `D:\WORKS\SPS\2026AprillWeb\AprilBuild` — Next.js 16 App Router, ET/EN/RU marketing site for SPS Grupp.
Reference docs: `PAGE_FIXING_TASKS.md` (execution plan, Tasks 0–9 all ticked), `PAGE_ARCHITECTURE_MIGRATION_TASKS.md` (owner's long-term plan), "Page system" section of `ARCHITECTURE.md`.

## State: ALL TASKS DONE, committed, everything green

**Committed as `1e3f348`** (208 files) — the full fixing+conversion cycle (Tasks 0–9). Working tree clean except intentionally untracked: `dev-*.log`, `public/happycleaner.jpg`/`happyclient.jpg`, `public/Font/AdobeFnt25.lst` (unreferenced, pre-existing).

Final verification (2026-08-06): `tsc --noEmit` ✓ · `eslint` ✓ · `npm test` 38/38 + `i18n:validate` (zero warnings; 6 PageView namespaces + 26 definitions checked) ✓ · `i18n:parity` 36/36 ✓ · byte-diff 108/108 ✓ (gate: `%LOCALAPPDATA%\Temp\opencode\task8-capture.ts` + `task8-compare.ts` vs `task9-tooprotsess` baseline) · `npm run build` ✓.

## What Task 9 changed beyond the handover plan

1. **Tooprotsess content bug** — was flagged for eskalaatorite only; found on **12 pages** (all puhastusteenused + remonditeenused details with generic ET steps). EN/RU titles + 5 steps translated from ET per approved decision 2. Byte-diff: exactly 24 intended diffs.
2. **Namespace deletion plan corrected** — definitions' `seo` = JSON-LD Service-schema data; JSON namespaces' `seo` = different, richer HTML title/description copy (live on 20 EN/RU fall-through pages). Deleting as originally planned would have downgraded live SEO metadata. Instead: the 20 live blocks moved to `localizedPageMetadata` (values byte-identical, " | SPS Grupp" suffix rule replicated), then 28 namespaces deleted (en.json 212→71 KB, ru 296→110 KB). Byte-diff after deletion: 108/108 identical. `getLocalizedSeoMetadata` now serves careers only; `/kontakt` never had seo (unchanged live-inventory path).
3. **i18n-validate section 5** — all 26 `serviceDetail` defs shape-checked + ET-leak guard (EN/RU tooprotsess title ≠ ET title). Acceptance-tested: clobbering a def fails with page-and-locale-specific errors.
4. New `lib/pages/definitions/index.ts` (etPath → serviceDetail map, used by validate).

## REMAINING

1. **Deploy & production spot-check** all page families on ET/EN/RU (owner action — push/merge + VPS deploy).
2. Optional: `lib/pages/registry.ts` → `page-registry.ts` loader codegen (Task 9 optional item, skipped).

## Gotchas (environment + hard rules)

- Dev server currently running detached on :3000 (`Start-Process`, survives shell exit). `Start-Job` servers die with the shell. Parity/capture scripts need it running.
- Do NOT run `npm run build` while the dev server is live on the same `.next` dir — it killed the dev server once. Either stop dev first, or expect to restart it.
- `npm run build` workers can crash (`3221226505`) with stray node processes — kill strays, retry. Environment issue, not code.
- If `npx tsx` fails: `node node_modules/tsx/dist/cli.mjs <script>`.
- **tsconfig type-checks `raportid/`** — never leave `.ts/.tsx` in backup dirs (backups use `.txt`); tsx can't import page files (`ContactForm → lib/email.ts → server-only`), definitions are safe to import.
- PowerShell mangles inline `node -e` with quotes/regex and shows Cyrillic as `?` in console (file contents are fine — verify with a file-reading tool, not console output).
- Supabase (`spsgrupp-live`) can auto-pause → EN/RU reviews/jobs blank. Restore via Management API (`.env.local`: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`); readers fall back to `data/admin-*-translations.json`.
- Hard rules: min font 15px everywhere; read `node_modules/next/dist/docs/` before Next.js changes (v16 differs from training data); preserve all URLs/slugs incl. RU slugs and `/koolide-koristamine` canonical alias.
