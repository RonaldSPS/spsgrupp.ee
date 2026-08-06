# ARCHITECTURE.md — Structure & Patterns

> **Read before adding any new feature.** Update when introducing a new pattern.

## Rendering & caching (since 2026-08)

The whole marketing site is **prerendered at build time** (SSG) and served from the Vercel CDN:

- **`app/[locale]/`** — single tree for all locale-prefixed marketing pages. Root layout `app/[locale]/layout.tsx` reads the locale via **`next/root-params`** (stable in Next 16.3) — no `headers()` in the layout (that used to force the entire site into dynamic SSR).
- **`app/[locale]/[[...slug]]/page.tsx`** — unified catch-all for ET+EN+RU: `generateStaticParams` for every registry path, `revalidate = 300` (ISR), `dynamicParams` stays on so admin-created job postings render on demand.
- **ET lives at unprefixed URLs.** `proxy.ts` rewrites public ET requests to the internal `/et` prefix (`/kontakt` → `/et/kontakt`). `/blog` and `/spsadmn` are ET-direct in `app/(et)/`; `/api`, `/en`, `/ru` and dotted file paths are excluded. Server actions still read `X-SPS-Locale` (set by the proxy) — `next/root-params` is not available in actions.
- **`app/(et)/`** — ET-only real routes: `blog/` (SSG, `revalidate = 60`), `spsadmn/`. Own root layout, identical shell, locale hardcoded `et`.
- **Page components** live in **`app/_pages/`** (private, non-routing) and are mapped to paths by `lib/page-registry.ts`; ET route metadata is imported from the moved layouts via `lib/et-metadata-registry.ts` (keeps `<head>` bytes identical to the old static routes).
- **Shared root shell:** `app/_shell/root-shell.tsx` (html/body, fonts, I18nProvider, Organization JSON-LD, root metadata) used by both root layouts.
- **`lib/slug-map.ts` `getCurrentEtPath`** strips the internal `/et` prefix so `usePathname`-based active states prerender correctly.

## Page system (ET/EN/RU marketing site)

All 36 public pages render their exact Estonian design in every locale. There is one way to build a page — do not reintroduce per-page locale ternaries or a generic localized-content renderer (the retired `LocalizedContentPage`).

- **`lib/pages/registry.ts`** — single source of truth: every public page's ET path, EN/RU slugs, parent (breadcrumbs), hero image, and (only for messages-driven pages) content namespace. `lib/slug-map.ts` and the hero/namespace maps in `lib/localized-content.ts` derive from it. **Add new pages here first.**
- **Page content lives in `lib/pages/definitions/<slug>.ts`:**
  - 26 detail pages export `serviceDetail: ServiceDetailDefs` — per-locale `{ data, seo, tooprotsess, breadcrumbs }` × et/en/ru (`lib/pages/definitions/index.ts` maps etPath → definition). Note: `seo` feeds the JSON-LD Service schema only; HTML `<title>`/meta descriptions live in `lib/metadata-registry.ts`.
  - kontakt/sps-grupp export fully-resolved per-locale `KontaktPageData`/`SpsGruppPageData` with dedicated templates.
- **Templates:** detail pages are 11-line shells rendering `app/components/templates/ServiceDetailTemplate.tsx` (server component: SeoJsonLd + OutdoorServicePage + Tooprotsess wiring + locale selection). `/koristusteenus` hub, the 4 koristus detail pages and `/tule-meile-toole` are messages-driven PageViews; reviews and job offers are DB-backed (Supabase + JSON fallback in `lib/translate-*.ts`).
- **`messages/en.json` / `ru.json`** = next-intl UI strings + the 6 PageView-consumed namespaces + `privacyPolicy`/`reviews`/`blogOverview`. Page content does NOT belong here.
- **Metadata:** ET from `pageMetadata`; EN/RU from `localizedPageMetadata` (both in `lib/metadata-registry.ts`, checked first). `/tule-meile-toole` still reads `careers.seo` via `getLocalizedSeoMetadata`. Pages with no localized entry use the live-URL inventory / ET metadata (`lib/seo-metadata.ts`).
- **Gates:** `npm run i18n:validate` (registry integrity, namespace key-sets, service-detail definition shapes, ET-leak guard on tooprotsess), `npm run i18n:parity` (rendered structure parity; needs a running server), byte-diff capture/compare against baseline HTML for refactors (`raportid/` + temp scripts).

## Folder structure

```
/
├── app/
│   ├── [locale]/           # Locale-prefixed marketing tree (root layout + unified catch-all)
│   │   ├── layout.tsx      # Root layout, locale via next/root-params
│   │   ├── [[...slug]]/    # ET+EN+RU unified catch-all (SSG + ISR 300s)
│   │   └── not-found.tsx
│   ├── (et)/               # ET-direct routes (root layout, locale "et")
│   │   ├── blog/           # Blog index + [slug] (SSG, revalidate 60)
│   │   └── spsadmn/        # Admin (client-gated)
│   ├── _pages/             # Marketing page components (private, non-routing)
│   ├── _shell/root-shell.tsx  # Shared html/body shell + root metadata
│   ├── components/         # Shared components (Navbar, Footer, SeoJsonLd, templates/)
│   ├── api/                # Route handlers (admin APIs, jobs, image-resize)
│   ├── robots.ts sitemap.ts
│   └── globals.css
├── lib/
│   ├── pages/registry.ts   # Single page registry (paths, slugs, namespaces, heroes)
│   ├── pages/definitions/  # 26 service-detail content definitions
│   ├── page-registry.ts    # etPath -> component import map
│   ├── et-metadata-registry.ts  # etPath -> moved layout metadata imports
│   ├── metadata-registry.ts, metadata-helper.ts, seo-metadata.ts
│   ├── json-ld-generator.ts     # All structured-data builders (+ tests)
│   ├── slug-map.ts, url-utils.ts
│   ├── announcements.ts, testimonials.ts, translate-*.ts  # DB + JSON fallbacks
│   └── db/                 # Drizzle + postgres.js (Supabase)
├── messages/               # et/en/ru.json (next-intl UI strings + PageView namespaces)
├── data/                   # JSON fallbacks (admin-*.json, translation fallbacks)
├── scripts/                # seo-check, i18n-validate/parity, llms + translation sync
├── public/                 # Static assets (incl. generated llms*.txt)
└── proxy.ts                # Locale header, /et rewrites, admin auth gate, security headers
```

## Security notes

- CSP (set in `proxy.ts`): `script-src 'self' 'unsafe-inline'` — nonce-based CSP is **not** feasible with Next 16's inline RSC flight scripts (no per-request nonce plumbing); accepted risk, everything else stays strict (`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`).
- Rate limiting (`lib/rate-limit.ts`): Upstash Redis REST when `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` are set (shared across serverless instances), otherwise process-local in-memory; falls back to in-memory on store errors (availability first).
- Admin auth: HMAC token cookie (env `ADMIN_PASSWORD` or DB users), proxy gate + per-route validation; CSV export is formula-injection-escaped; sharp via `serverExternalPackages` (no `eval`).

## Routing rules

- **Server Components by default.** Only add `"use client"` for interactivity, state, browser APIs.
- **Route groups `(name)`** for layout grouping without affecting URLs.
- **Loading + error UI** — every route segment with data fetching needs `loading.tsx` and `error.tsx`.
- **Metadata** — every public page exports `metadata` (title, description, OG image).

## Data fetching patterns

### Reading data (Server Components)
```ts
// In a Server Component
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("table").select()
  if (error) throw error
  return <View data={data} />
}
```

### Mutating data (Server Actions)
```ts
"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createThing(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from("things").insert({ ... })
  if (error) return { error: error.message }
  revalidatePath("/things")
  return { success: true }
}
```

**Rule:** Prefer Server Actions over `/api` routes. Use `/api` only for webhooks, third-party callbacks, or non-form clients.

## Supabase patterns

- **Three clients:** `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/middleware.ts`. Never mix them up.
- **RLS is mandatory** on every table. No exceptions. Test policies before shipping.
- **Generate types:** `npx supabase gen types typescript --local > types/database.ts` after every migration.
- **Migrations only** — never edit schema in the dashboard for prod.

## Auth pattern

- Middleware refreshes the session on every request.
- Server Components read the user via `supabase.auth.getUser()` (never `getSession()` server-side — it doesn't validate the JWT).
- Protect routes by checking `user` in the layout or page; redirect to `/login` if null.

## State management

- **URL state** for anything shareable/bookmarkable (filters, tabs, pagination) — use `nuqs` or searchParams.
- **Server state** lives on the server — re-fetch with `revalidatePath` / `revalidateTag` after mutations.
- **Client state** with `useState` for local UI; only reach for Zustand/Jotai if multiple unrelated components need the same state.
- **Forms:** `react-hook-form` + `zod` for validation. Same zod schema validates on the server.

## Error handling

- Throw in Server Components → caught by `error.tsx`.
- Return `{ error }` from Server Actions → display via toast (`sonner`).
- Never swallow errors silently. Log + surface.

## Performance defaults

- `next/image` for all images (never `<img>` except for tiny inline SVGs).
- `next/font` for fonts (no `<link>` to Google Fonts).
- Dynamic imports for heavy client-only components (charts, editors, maps).
- `loading.tsx` with skeletons, not spinners.

## What goes where (decision tree)

- **Reusable UI primitive?** → `components/ui/` (shadcn) or `components/shared/`
- **Used in one feature only?** → `components/[feature]/`
- **Pure function, no React?** → `lib/`
- **Hook with state?** → `hooks/`
- **Type used in 2+ places?** → `types/`
- **Used in one file?** → keep it inline

## Patterns adopted in this project

> Append here when you introduce a new repeatable pattern. Format:
> `### [Pattern name]` → when to use, code skeleton, why.

### Prerendered locale tree (marketing pages)
Use when: adding any public marketing page.
Skeleton: register in `lib/pages/registry.ts` (etPath + en/ru slugs) → the unified catch-all prerenders it in all locales via `generateStaticParams`; ET metadata from the moved layout export (`lib/et-metadata-registry.ts`), EN/RU from `lib/metadata-registry.ts`.
Why: one registration yields static pages + correct canonical/hreflang in all locales; CDN-served at ~250 ms TTFB.

### DB read with timeout + JSON fallback
Use when: reading Supabase in a page/prerender path.
Skeleton: `withReadTimeout(db.select()...)` (2.5 s) → on error/timeout read `data/admin-*.json` fallback (refresh via `scripts/sync-translation-fallbacks.ts`).
Why: Supabase pooler stalls under parallel build workers / after auto-pause; pages must never hang (>60 s build failure) or render blank.

### Registry-generated surface files
Use when: content that must not drift from the registry (llms.txt, sitemap, hreflang, robots).
Skeleton: `scripts/generate-llms-txt.ts` reads `lib/pages/registry.ts` + definitions and rewrites `public/llms*.txt`.
Why: hand-written copies drift; the generator is the single source of truth.

<!-- Example:
### Optimistic UI for likes
Use when: user-triggered toggle that should feel instant.
Skeleton: `useOptimistic` + Server Action.
Why: avoids round-trip lag, falls back gracefully on error.
-->
