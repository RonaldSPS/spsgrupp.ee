# ARCHITECTURE.md — Structure & Patterns

> **Read before adding any new feature.** Update when introducing a new pattern.

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
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public pages (landing, pricing, etc.)
│   ├── (app)/              # Authenticated app pages
│   ├── api/                # Route handlers (only when needed — prefer Server Actions)
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Tailwind + CSS vars only
├── components/
│   ├── ui/                 # shadcn/ui primitives — do not edit by hand
│   ├── shared/             # Reused across features
│   └── [feature]/          # Feature-scoped components
├── lib/
│   ├── supabase/           # Server + browser + middleware clients
│   ├── utils.ts            # cn(), formatters, small helpers
│   └── [domain].ts         # Domain logic (e.g. pricing.ts, dates.ts)
├── hooks/                  # Custom React hooks (client-only)
├── types/                  # Shared TS types (DB types auto-generated)
├── supabase/
│   ├── migrations/         # SQL migrations, timestamped
│   └── seed.sql            # Local dev seed data
├── public/                 # Static assets
└── [root configs]
```

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

<!-- Example:
### Optimistic UI for likes
Use when: user-triggered toggle that should feel instant.
Skeleton: `useOptimistic` + Server Action.
Why: avoids round-trip lag, falls back gracefully on error.
-->
