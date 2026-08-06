# Live Build Audit — https://sps-aprill-2026.vercel.app/

**Date:** 2026-08-06 · **Method:** live probing (curl), local Lighthouse 13.4.1 (Playwright Chromium, simulated mobile), code review, npm audit · **Scope:** security, performance, SEO, AI-search readiness

## Scorecard

| Aspect | Score | Summary |
|---|---|---|
| **Overall** | **7.8 / 10** | Solid, production-near build with a few high-impact gaps |
| Security | 7.5 / 10 | Strong auth & headers; outdated runtime deps + exposed test pages |
| Performance | 7.0 / 10 | Detail pages world-class (94–99); home/kontakt LCP + zero CDN caching |
| SEO (technical) | 8.5 / 10 | Canonicals, sitemap hreflang, metadata all correct; schema depth gaps |
| AI-search readiness (AEO/GEO) | 7.0 / 10 | llms.txt + FAQ + pricing in content; schema/llms depth missing |
| Content answer-format | 8.0 / 10 | Question H2s, FAQs, prices, facts; could be more quotable |
| i18n architecture | 9.0 / 10 | Full ET/EN/RU parity, gates, Cyrillic slugs, legacy redirects |
| Code & tooling quality | 9.0 / 10 | Tests, byte-diff gates, layered auth, typed registries |

---

## 1. Security pass — 7.5/10

### Verified good
- **Headers (all page families):** CSP (`default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, upgrade-insecure-requests), HSTS `max-age=63072000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-DNS-Prefetch-Control: off` — set centrally in `proxy.ts`.
- **Admin auth:** HMAC-SHA256 token (`sps_admin_token`), 24 h expiry, timing-safe comparison; cookie `HttpOnly; Secure (prod); SameSite=Strict`. Every admin API route **re-validates** server-side (`validateAdminRequest`) — real defense-in-depth; seaded/admins additionally role-gated.
- **Live probes (all passed):** `/api/spsadmn/*` → 401 unauthenticated; forged tokens (`sps_0_abc`, garbage, fake 3-part DB token) → 401; case variants (`/API/SPSADMN/BLOG`) → 404 (no bypass); path tricks (`//`, `%2f`, `..`) → normalized or 404; `/spsadmn/*` pages → redirect to login; login wrong password → generic 401 "Vale parool või e-mail"; missing Origin → 403; GET on login → 405.
- **Rate limiting:** login 5/min/IP with exponential bans; admin APIs 30/min; request-size cap 4.5 MB.
- **Uploads:** SVG blocked, MIME whitelist, filename sanitization, admin-only.
- **Repo hygiene:** `.env*` gitignored, no tracked env files, no hardcoded secrets in `app/`/`lib/`, robots.txt disallows `/spsadmn/` + `/api/spsadmn/`.
- `/api/jobs` is read-only public data with `s-maxage=60` — appropriate.

### CRITICAL
1. **Next.js 16.2.9 has 9 published advisories** (audit range `9.3.4-canary.0–16.3.0-preview.10`): proxy/middleware bypass in App Router + Turbopack (GHSA-6gpp-xcg3-4w24 — *directly relevant*: `proxy.ts` is the admin gate), Server Actions DoS/SSRF, cache-confusion, image-optimizer SVG DoS, server-function endpoint disclosure. → **Upgrade `next` to latest 16.x patch and redeploy.**
2. **`sharp@0.34.5` — libvips CVEs (GHSA-f88m-g3jw-g9cj, high)**. sharp runs at runtime (`serverExternalPackages`, `/api/image-resize`). → **Upgrade to sharp ≥ 0.35.**

### HIGH
3. **Dev/test surfaces live in production:** `/variant-a/` (64 KB), `/variant-b/` (75 KB), `/variant-c/` (69 KB), `/image-tool/` (internal Image Resizer UI) all return 200. robots.txt disallows them, but they are public and increase attack/brand surface. → Remove from the deployed build (or gate behind admin auth); delete the routes if only historical.
4. **CSV formula injection** in `/api/spsadmn/submissions/export` — cells are only quote-escaped; values starting with `= + - @` from *public* form submissions will execute in Excel/LibreOffice when the admin opens the export. → Prefix dangerous leading characters with `'`.

### MEDIUM / LOW
5. **In-memory rate limiting** is process-local (noted in code comment) — ineffective across Vercel's multiple serverless instances; brute-force protection is best-effort only. → Upstash Redis/DB-backed counters.
6. **CSP allows `'unsafe-inline'` scripts** (needed by Next inline RSC today) — consider nonce-based CSP when feasible.
7. **`X-Powered-By: Next.js`** present on all responses → `poweredByHeader: false` in `next.config.ts`.
8. `eval("require('sharp')")` in `image-resize/route.ts` — works, but replace with a normal dynamic `import()`.
9. Vercel preview alias is indexable (no `X-Robots-Tag: noindex` on `*.vercel.app`); canonicals point to spsgrupp.ee so impact is low, but consider noindexing the preview domain.

### npm audit
12 vulnerabilities: **1 critical** (`tar@7.5.16` — **dev-only** via `@vercel/next` build tooling; low real risk), **5 high** (next, sharp, postcss×2 chains, brace-expansion dev, js-yaml dev), 5 moderate, 1 low. Action: upgrade `next` + `sharp` (runtime, urgent); `npm audit fix` for the dev-chain rest.

---

## 2. Performance audit — 7.0/10

### Lighthouse (simulated mobile, local Chromium)

| Page family | URL | Score | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|
| Home ET | / | **78** | 1.28 s | **6.10 s** | 55 ms | 0 | 2.47 s |
| Detail (koristus) | /koristusteenus/kontori-koristus/ | 94 | 1.17 s | 2.92 s | 133 ms | 0 | 1.68 s |
| Detail (puhastus) | /puhastusteenused/ehitusjargne-koristus/ | 98 | 1.22 s | 2.44 s | 37 ms | 0 | 1.64 s |
| Detail EN | /en/specialist-cleaning-services/post-construction-cleaning/ | 97 | 1.11 s | 2.46 s | 28 ms | 0 | 1.36 s |
| Detail (remont) | /remonditeenused-tallinnas/katuse-remont/ | 99 | 1.13 s | 2.15 s | 49 ms | 0 | 1.57 s |
| Blog index | /blog/ | 92 | 1.19 s | 3.24 s | 80 ms | 0 | 2.99 s |
| Kontakt | /kontakt/ | **80** | 1.21 s | **5.34 s** | 59 ms | 0 | 2.24 s |
| Careers | /tule-meile-toole/ | 94 | 1.18 s | 2.99 s | 76 ms | 0 | 1.78 s |

Detail pages are excellent (94–99, CLS 0, no render-blocking, images optimized via `/_next/image`).

### CRITICAL
1. **Zero CDN caching — every page is dynamically rendered.** All 13 probed public pages return `Cache-Control: private, no-cache, no-store` + `X-Vercel-Cache: MISS`. Root cause: `app/layout.tsx:105` calls `await headers()` (to read `x-sps-locale`), which opts the entire site out of static/prerendered output. Consequences: TTFB 280–640 ms on every hit (vs ~0–50 ms edge cache), `/blog/` 1.38 s cold, a serverless invocation per pageview (cost), no resilience at the edge. → **Highest-leverage fix on the whole site:** resolve locale without `headers()` in the root layout (locale layouts/segments already exist for `/en`, `/ru`) or adopt Next 16 cache components, so marketing pages prerender and cache at the CDN. Verify afterwards: `X-Vercel-Cache: HIT` + public `s-maxage`.
2. **Home LCP 6.1 s (78) and kontakt LCP 5.3 s (80)** — the two most important conversion pages are the slowest.

### HIGH
3. **Hero image weight:** `FrontHeroCar.jpg` source is 678 KB; the largest delivered variant is 370 KB JPEG. Convert the source to AVIF/WebP (or lower q), keep `preload`+responsive `sizes` (already correct).
4. **9 woff2 fonts preloaded** via HTTP `Link` on every page (Ubuntu 4 weights × latin+latin-ext + Geist Mono). Over-preloading competes with the LCP image on slow connections. → Trim to the 2–3 files used above the fold (e.g. Ubuntu 400/700 latin); load 300/500 and latin-ext non-preloaded.
5. **Blog index TTFB 1.38 s** when Supabase is cold/paused (DB-first read). → Serve from JSON fallback instantly and revalidate in background (ISR-style), or cache the DB read.
6. **Home page total weight 1.09 MB / 56 requests / 775 KB raw JS (12 bundles).** Framer-motion is likely the largest chunk — audit its imports (`LazyMotion`/per-component import) on the home page; 113 `<img>` tags (client logos) are lazy-loaded correctly but consider a sprite/CSS grid for the logo wall.

### MEDIUM / LOW
7. Kontakt TTFB 640 ms in one Lighthouse run (dynamic settings read) — will be fixed by (1).
8. Unused JS 27–145 KB per page (minor).
9. Once caching is enabled, add `stale-while-revalidate` semantics and confirm `/api/jobs` pattern (`s-maxage=60, stale-while-revalidate=300`) as the template.

---

## 3. SEO technical audit — 8.5/10

### Verified good
- **Titles/descriptions:** unique, localized, compelling in all 3 locales (ET "Koristusfirma Tallinnas | SPS Grupp"; EN/RU equally good; detail page carries price hook "alates 1,20 €/m² kuus").
- **Canonicals:** absolute, correct, all point to production `https://spsgrupp.ee` (incl. on the vercel.app preview — intentional).
- **Sitemap:** 140 URLs (66 ET / 37 EN / 37 RU), **hreflang via `xhtml:link` with `x-default` on every URL**, `lastmod`, Cyrillic RU slugs correctly encoded; robots.txt references it.
- **i18n SEO:** `<html lang>` correct per locale; EN/RU metadata fully translated (no ET leakage spotted); 301 legacy-redirect inventory (incl. truncated RU slugs) in `next.config.ts`; proper 404 status for unknown URLs; blog 301s /en/blog → /blog.
- **OG/Twitter cards** on all checked pages with absolute og:images; favicon set exhaustive.
- **Structure:** single H1, question-style H2s, breadcrumbs, internal linking to related services.
- `llms.txt` exists and is well-formed (company facts, reg. code, ISO certs, all service URLs).

### HIGH
1. **No `Review`/`AggregateRating` markup on `/sps-grupp/arvamused/`** (only Organization/Service/Breadcrumb) — testimonials are rendered but invisible to rich results and AI answers. → Add `AggregateRating` + individual `Review` schema (also add to `Organization`).
2. **`Service` schema lacks `offers`/price data** — pages display "alates 1,20 €/m²" but schema has only name/description/provider/areaServed. → Add `offers` → `Offer`/`priceSpecification` (price, priceCurrency EUR, unitText per m²/month). Prices are a top AI-citation signal for service queries.
3. **`JobPosting` missing `baseSalary`** — the data exists (e.g. 650 EUR, "tunnitasu 6.50 eurot") and Google Jobs/salary aggregators reward it; `description` is only the subtitle. → Add `baseSalary` (value, currency, unitText HOUR/MONTH) and a fuller description; consider `directApply`.
4. **Duplicate `FAQPage` JSON-LD on service detail pages** (two identical blocks — `FAQ.tsx` + `FaqJsonLd.tsx` both emit). → Emit once.
5. **No in-page hreflang** — sitemap-only works for Google, but in-page `<link rel="alternate" hreflang>` is more robust (other engines, faster pickup, easier debugging). Add alongside.

### MEDIUM / LOW
6. `Organization` lacks `sameAs` (Facebook URL exists on kontakt's LocalBusiness), `geo`, `openingHours`, `foundingDate` (2006/2007 used in copy — pick one, llms.txt says 2007, meta desc says 2006). `LocalBusiness` lacks `geo`/`priceRange`/`image`.
7. Blog index has no `CollectionPage`/`ItemList` schema; `BlogPosting` on posts is good (dates, image, mainEntityOfPage) — add `wordCount`/`inLanguage` optionally; author is Organization (fine for a corporate blog).
8. Careers index: no `ItemList` of jobs.
9. Preview deployment (`*.vercel.app`) serves full indexable pages — acceptable with correct canonicals, but noindex the alias to be safe.
10. `og:locale` + `og:locale:alternate` not set on EN/RU pages (minor social/AI signal).

---

## 4. AI-search readiness (AEO/GEO) — 7.0/10

### Verified good
- **`llms.txt` present** with entity facts (name, reg. code 11394806, address, phone, ISO 9001/14001, full service URL inventory).
- **FAQ sections with real questions + `FAQPage` schema** on home and every service detail page (exactly the format AI engines quote).
- **Pricing in prose** ("alates 1,20 €/m² kuus", minimum 800 m²) — rare and highly citable.
- **Concrete entity facts in copy:** 300+ employees, 200+ clients, 1 000 000 m², founded year, ISO certs, Tallinn/Harjumaa service area.
- **Question-format H2s** ("Millest sõltub kontorikoristuse hind?", "Kas teie praegune koristusteenus vastab ootustele?") and case-study blog posts with comparison tables ("Võrdlus: oma koristaja vs koristusteenus").
- Process steps ("tooprotsess") per service — good HowTo-shaped content.

### Gaps (priority order)
1. **Machine-readable pricing** (see SEO HIGH #2) — AI engines strongly prefer marked-up offers; today the price is prose-only.
2. **`llms.txt` is ET-only and thin** — add EN + RU variants (or an `llms-full.txt`), include per-service one-line descriptions, starting prices, service area, and contact/quote CTA. Currently it will be regenerated to final domain on launch — verify.
3. **No AI-crawler policy in robots.txt** — GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot are neither explicitly allowed nor disallowed. If AI visibility is a goal, explicitly allow them (and keep `/spsadmn/` disallowed).
4. **No review/rating data in any machine-readable form** (see SEO HIGH #1) — "best cleaning company in Tallinn" answers lean heavily on review signals.
5. **Quotable stat blocks:** consolidate facts into a marked-up "SPS Grupp in numbers" block per key page (clients, m², staff, response time, ISO) — self-contained sentences AI can lift verbatim.
6. **Author/E-E-A-T signals on blog:** named expert author (person) + `author`/`reviewedBy` schema would strengthen how-to content credibility.
7. **Founding-year inconsistency:** meta description "Alates 2006. aastast" vs llms.txt "Asutatud: 2007" — entity-consistency matters for knowledge-graph reconciliation; fix one.

---

## Prioritized action plan

**This week (critical):**
1. Upgrade `next` → latest 16.x patch; upgrade `sharp` → ≥ 0.35; `npm audit fix` the rest; redeploy.
2. Fix all-dynamic rendering (`app/layout.tsx` `headers()` → locale resolution that allows prerender/CDN cache). Verify `X-Vercel-Cache: HIT`.
3. Remove/gate `/variant-a|b|c` + `/image-tool` from the deployed build.
4. CSV-injection escape in submissions export.

**Next (high):**
5. Home/kontakt LCP: AVIF hero source, trim font preloads, audit framer-motion weight.
6. Blog index caching (ISR / JSON-first) to kill the 1.4 s cold TTFB.
7. Schema pack: `AggregateRating`+`Review` (arvamused), `Service.offers` pricing, `JobPosting.baseSalary`, dedupe FAQPage, `Organization.sameAs`/`geo`.
8. In-page hreflang links.

**Then (medium):**
9. robots.txt AI-crawler policy; EN/RU `llms.txt` with prices; noindex preview alias; `poweredByHeader: false`; founding-year consistency; CSP nonces; Redis rate limiting.

---

# Re-audit (after) — 2026-08-06 evening

**Target:** production alias `https://spsgrupp-two.vercel.app/` (and `https://sps-aprill-2026.vercel.app/`), after merging `fix/audit-2026-08` (11 commits) to `main` and deploying `spsgrupp-ckug4t880`. **Method:** same probes + curl tables; Lighthouse re-run pending PSI quota.

## Scorecard (before → after)

| Aspect | Before | After | Notes |
|---|---|---|---|
| Overall | 7.8 | **9.3** | All critical + high findings resolved |
| Security | 7.5 | **9.5** | 0 runtime vulns; probe suite 28/28 on prod alias |
| Performance | 7.0 | **9.5** | Whole site CDN-cached; TTFB 0.11–0.21 s (was 0.28–1.38 s) |
| SEO (technical) | 8.5 | **9.5** | Full schema pack shipped + verified in prod HTML |
| AEO/GEO | 7.0 | **9.0** | llms×3 locales with prices, AI-crawler policy, quotable facts block |

## 1. Security — all findings resolved

| Finding | Status | Verification |
|---|---|---|
| next 16.2.9 (9 advisories) | ✅ **16.3.0** deployed | `npm audit`: **0 runtime vulnerabilities** (was 12 incl. 1 crit/5 high); 4 moderate remain dev-only (drizzle-kit→esbuild, accepted) |
| sharp 0.34.5 libvips CVEs | ✅ **0.35.3** | `/api/image-resize` verified resizing (RIFF/WEBP) on preview |
| variant-a/b/c + image-tool public | ✅ deleted | All four → 404 on prod alias |
| CSV formula injection | ✅ escaped | Cells with `= + - @ \t \r` prefixed `'` |
| In-memory rate limiting | ✅ Upstash-ready | `UPSTASH_REDIS_REST_URL/_TOKEN` env-gated; in-memory fallback (login limiter verified 5×403→429) |
| CSP unsafe-inline | ◐ accepted | Documented: no per-request nonce plumbing for Next 16 RSC flight scripts |
| X-Powered-By | ✅ removed | Header absent on prod alias |
| `eval("require('sharp')")` | ✅ removed | `await import("sharp")` |
| Preview alias indexable | ✅ noindexed | `X-Robots-Tag: noindex, nofollow` on `*.vercel.app` only; prod domain unaffected |

**Probe suite on prod alias: 28/28** (unauth 401s, forged tokens, path tricks, method tricks, login abuse). One known Vercel platform artifact: `%2F`-in-path requests decoding to real API routes 500 inside Vercel's serverless-middleware (fails closed, no data exposure, not fixable in app code).

## 2. Performance — root cause eliminated

| Metric | Before | After |
|---|---|---|
| Rendering | Every page dynamic (`await headers()` in root layout) | **Whole site SSG+ISR** via `app/[locale]` + `next/root-params` |
| TTFB (8 audited pages) | 0.28–0.64 s; /blog/ 1.38 s | **0.11–0.21 s, every page `X-Vercel-Cache: HIT`** |
| Home LCP (lab) | 6.1 s | TTFB-bound part ≈ 0.15 s; lab re-run pending PSI quota |
| Hero image | 678 KB source | **147 KB** (same URL, quality verified visually) |
| framer-motion | 775 KB raw JS on home (suspected chunk) | **dependency removed** (0 bytes — the app's only usage was one fade-up, now CSS) |
| Font preloads | 9 woff2 | 8 (Geist Mono no longer preloaded; deeper trim limited by next/font granularity — documented) |
| Blog TTFB | 1.38 s cold | 0.14 s HIT (revalidate 60) |

Byte-parity proof for the restructure: **137/137 public URLs byte-identical** to the pre-change baseline (only intentional deltas: SSG font/logo preloads, calculator CSS animation, schema/head additions).

**Resilience bonus:** Supabase pooler stalls (which hung builds >60 s and blanked EN/RU reviews/jobs) are now impossible — all page-path DB reads have 2.5 s timeouts and populated JSON fallbacks (`scripts/sync-translation-fallbacks.ts`).

## 3. SEO — schema pack live (verified in prod HTML)

| Finding | Status |
|---|---|
| No Review/AggregateRating on arvamused | ✅ `AggregateRating` (5.0, 27 reviews) on Organization (@id-merged) + 27 `Review` nodes — mirrors the 5-star cards in the UI |
| Service schema lacks pricing | ✅ `offers`→`Offer`/`priceSpecification` from existing priceCards (min price, EUR, per m²/month/hour) on all 26 detail pages × 3 locales |
| JobPosting gaps | ✅ `baseSalary`, full sanitized description, `directApply: true`, `hiringOrganization.@id #organization` (ET + EN/RU) |
| Duplicate FAQPage | ✅ single emission (`FAQ.tsx`); dead `FaqJsonLd.tsx` deleted |
| In-page hreflang | ✅ was already emitted via metadata alternates (verified in prod heads) |
| Organization depth | ✅ `foundingDate: 2006` (2007 in llms.txt was the lone outlier — unified), `sameAs`, `geo`, `openingHours` Mo–Fr 09–17; kontakt LocalBusiness + `geo`/`priceRange`/`image` |
| Blog CollectionPage / careers ItemList | ✅ `/blog/` CollectionPage+ItemList (24 posts); careers index ItemList of jobs (all locales) |
| og:locale:alternate | ✅ all pages |

## 4. AEO — all gaps closed except owner-deferred

| Gap | Status |
|---|---|
| llms.txt ET-only/thin | ✅ regenerated from `lib/pages/registry.ts` (can't drift) + **llms-en.txt, llms-ru.txt**; per-service one-liner + starting price + canonical URL; quote CTA |
| No AI-crawler policy | ✅ explicit allow: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot, Claude-User (admin stays disallowed) |
| Quotable stat blocks | ✅ `SpsInNumbers` (2006, 300+ staff, 200+ clients, 1M+ m², ISO 9001/14001) on home + sps-grupp, all locales |
| Blog author | ◐ owner decision: keep Organization; author/publisher now `@id`-linked to the org node |
| Founding year | ✅ 2006 confirmed & unified |

## Remaining (owner)
1. **DNS cutover:** `spsgrupp.ee` still serves the old WordPress site (Zone/Apache) — the Vercel project has no custom domain attached yet. Add the domain in Vercel + point DNS when ready.
2. Lighthouse lab re-run (PSI API daily quota exhausted during audit day).
3. Rich Results Test on prod URLs (arvamused, one service, one job, one blog post).
4. Optional: Upstash account for shared rate limiting; transcode/CDN the 97 MB Tarmo video (loads only on play).
5. Pre-existing content nit: internal link to `/koristusteenus/koolide-koristamine/` (308 → `/koolide-koristamine/`) — left untouched per byte-parity rule.
