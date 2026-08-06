<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Global style rules
- Minimum font size: 15px (`text-[15px]`). No text on any page may be smaller than this, ever.

# Project: SPS Grupp ET/EN/RU marketing site (Next.js 16 App Router)

- **Page architecture:** one-pattern system — see the "Page system" section of `ARCHITECTURE.md`. Single page registry: `lib/pages/registry.ts`; per-page content: `lib/pages/definitions/`; 26 detail pages = shells → `app/components/templates/ServiceDetailTemplate.tsx`.
- **Commands:** `npm run dev` · `npm run lint` · `npx tsc --noEmit` · `npm test` (includes `i18n:validate`) · `npm run i18n:parity` (needs a running server) · `npm run build`.
- **Preserve every public URL/slug** (incl. RU slugs and `/koolide-koristamine`), all metadata/canonicals/hreflang, and rendered byte output on refactors (byte-diff gate).
- **Gotchas:** `tsconfig` type-checks `raportid/` (no stray `.ts/.tsx` backups there); long-running dev servers must be started detached (`Start-Process`), not `Start-Job` (jobs die with the shell); `npm run build` workers can crash with stray node processes — kill strays and retry; Supabase (`spsgrupp-live`) auto-pauses (EN/RU reviews/jobs go blank; JSON fallbacks in `lib/translate-*.ts`).
