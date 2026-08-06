<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Global style rules
- Minimum font size: 15px (`text-[15px]`). No text on any page may be smaller than this, ever.

# Project: SPS Grupp ET/EN/RU marketing site (Next.js 16 App Router)

- **Rendering:** whole site is SSG+ISR (see "Rendering & caching" in `ARCHITECTURE.md`): unified `app/[locale]/[[...slug]]` catch-all with `next/root-params`, proxy rewrites ET URLs to internal `/et`, marketing components live in `app/_pages/`, ET metadata in `lib/et-metadata-registry.ts`. Server actions still read `X-SPS-Locale` from the proxy header.
- **Page architecture:** one-pattern system — see the "Page system" section of `ARCHITECTURE.md`. Single page registry: `lib/pages/registry.ts`; per-page content: `lib/pages/definitions/`; 26 detail pages = shells → `app/components/templates/ServiceDetailTemplate.tsx`.
- **Commands:** `npm run dev` · `npm run lint` · `npx tsc --noEmit` · `npm test` (includes `i18n:validate`) · `npm run i18n:parity` (needs a running server) · `npm run build` · `npx tsx scripts/generate-llms-txt.ts` (after registry/price changes) · `npx tsx scripts/sync-translation-fallbacks.ts` (after translation changes in admin).
- **Preserve every public URL/slug** (incl. RU slugs and `/koolide-koristamine`), all metadata/canonicals/hreflang, and rendered byte output on refactors (byte-diff gate).
- **Gotchas:** `tsconfig` type-checks `raportid/` (no stray `.ts/.tsx` backups there); long-running dev servers must be started detached (`Start-Process`), not `Start-Job` (jobs die with the shell); `npm run build` workers can crash with stray node processes — kill strays and retry; **incremental builds lie** — before any gate (byte-diff, deploy) delete `.next` and rebuild clean (stale prerender files and turbopack cache produce mixed old/new output); **kill old `next start` servers before starting a new one** (EADDRINUSE + serving a stale build against an overwritten `.next` = confusing 500s); Supabase pooler stalls under parallel build workers — all page-path DB reads have 2.5 s timeouts + JSON fallbacks (`data/admin-*.json`); `spsgrupp-live` auto-pauses (EN/RU reviews/jobs go blank — restore via Supabase API, then re-run `scripts/sync-translation-fallbacks.ts`).
- **Admin & forms:** `/spsadmn/` = blog, tööle, testimonials, paringud, seaded. Contact/career submissions are stored in `form_submissions` (migration `drizzle/0005_form_submissions.sql` must be applied to live DB) via `lib/form-submissions.ts`; JSON fallback `data/form-submissions.json` when DB unset/unavailable. List + CSV export at `/api/spsadmn/submissions[/export]` (formula-injection-escaped).
