# Analytics, Ads & Search Console — connection guide

Everything needed to understand, reproduce, or re-connect the SPS Grupp
tracking stack. Written for humans and AI assistants alike — follow it
step by step in a fresh chat/session and the whole system can be rebuilt.

## 1. What is connected

| Platform | ID / property | Role |
|---|---|---|
| Google Tag Manager | container `GTM-KP5VZH9Q` | single tag hub, loaded by the site |
| Google Analytics 4 | measurement `G-KE6ZB0WXL9`, property ID `328729351` | traffic + events; tag fires inside GTM |
| Google Ads | conversion ID `AW-944834915` | Google Tag + Conversion Linker fire inside GTM |
| Search Console | URL-prefix property `https://spsgrupp.ee/` | organic search data |
| Google Cloud service account | `sps-analytics-reader@spsgrupp.iam.gserviceaccount.com` | read-only API access for reporting |

GA4 and Ads tags are **not** in the site code — they live in the GTM
container. The site only loads the container and pushes events to the
`dataLayer`; everything else is configured in the GTM web UI.

## 2. How the site loads tracking (code map)

- `app/_shell/root-shell.tsx` — reads `NEXT_PUBLIC_GTM_ID`; when set:
  - renders the Consent Mode v2 defaults inline script (`CONSENT_DEFAULT_SNIPPET`)
    *before* GTM — all storage denied except `security_storage`,
    `wait_for_update: 500`, `ads_data_redaction: true`
  - renders `<GoogleTagManager gtmId=…>` from `@next/third-parties/google`
    (loads after hydration via next/script)
  - renders `<CookieConsentBanner />`
- `proxy.ts` `buildCspHeader()` — the site-wide Content-Security-Policy
  whitelists the Google tag hosts (`googletagmanager.com` in script-src,
  `google-analytics.com`/`g.doubleclick.net`/… in img-src + connect-src).
  **Do not remove these** — a plain `script-src 'self'` blocks gtm.js and all
  collect calls (this silently killed all tracking 17–24.08.2026).
- `app/components/analytics/consent.ts` — consent storage key
  (`localStorage["sps_consent"]`), `applyConsent()` pushes
  `gtag('consent','update',…)` onto the dataLayer.
- `app/components/analytics/CookieConsentBanner.tsx` — ET/EN/RU banner
  (messages namespace `cookieConsent`). Hidden in SSR HTML; appears after
  hydration only when no stored choice. A stored "granted" is re-applied on
  every load.
- `app/components/ContactForm.tsx` + `app/components/CareerForm.tsx` — on
  real (non-spam) success push TWO events with identical payloads:
  1. `form_submission_success` via `pushFormSubmissionSuccess()`
     (`app/components/analytics/form-conversion.ts`) — a hardcoded raw
     `window.dataLayer.push()` with zero dependencies, fired FIRST. This is
     the stable conversion signal: **do not rename the event or change its
     payload** — conversions have been lost several times to technical
     changes, and GTM conversion triggers should bind to this event.
  2. `form_submit` via `sendGTMEvent` (`@next/third-parties`) — kept for the
     existing GA4 "päring" tag + triggers.
  Payload for both:
  `{ event, form_id: "contact"|"career", page_path, locale, user_data: { email } }`.
  `lib/actions.ts` returns `isSpam: true` on honeypot/spam fake-successes so
  spam never becomes a conversion. `user_data.email` feeds GTM's Enhanced
  Conversions tag (hashed client-side by GTM).
- `app/components/analytics/gclid.ts` + hidden `gclid` field in
  **ContactForm only** — Google Ads click id, read from the landing URL
  param or the `_gcl_aw` cookie (written by GTM's Conversion Linker; absent
  when ads consent is denied). Stored in `form_submissions.gclid`
  (migration `drizzle/0009_submission_gclid.sql`), shown under the "Leht"
  cell in `/spsadmn/paringud`, added to the notification email + CSV export.

## 3. Environment variables

Local: `.env.local` (git-ignored). Production: Vercel project env.
Public IDs are not secrets (they appear in page source).

| Var | Where needed | Purpose |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID=GTM-KP5VZH9Q` | **Vercel + local** | enables GTM, consent defaults, banner, form events. If unset, everything tracking-related is skipped. |
| `GA4_MEASUREMENT_ID=G-KE6ZB0WXL9` | informational | site stream id (the GA4 tag itself is configured in GTM) |
| `GA4_PROPERTY_ID=328729351` | local (reporting) | GA4 Data API target |
| `GOOGLE_ADS_ID=AW-944834915` | informational | Ads account tag id (configured in GTM) |
| `GSC_SITE_URL=https://spsgrupp.ee/` | local (reporting) | Search Console API target (must match the property exactly) |
| `GOOGLE_APPLICATION_CREDENTIALS=.secrets/gcp-analytics.json` | local (reporting) | path to the service-account JSON key |

`.secrets/` is git-ignored. Never commit the key.

## 4. Rebuilding from scratch (full checklist)

### 4.1 Site code
Already done in this repo — see §2. In a fresh project:
1. `npm install @next/third-parties`
2. Add consent-defaults inline script + `GoogleTagManager` to the root layout
   (copy from `app/_shell/root-shell.tsx` and `app/components/analytics/`).
3. Add the consent banner (copy `CookieConsentBanner.tsx` + `consent.ts`,
   add a `cookieConsent` messages namespace per locale).
4. Push `form_submit` events from forms (see §2) and add the hidden gclid
   field (`gclid.ts`).

### 4.2 Google Cloud service account (for reporting)
1. https://console.cloud.google.com/ → sign in with the Google account that
   owns GA4/GSC.
2. Project picker → **New Project** → name e.g. `sps-analytics` → Create;
   select the project.
3. Enable two APIs (open each link → **Enable**):
   - https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com
   - https://console.cloud.google.com/apis/library/searchconsole.googleapis.com
4. https://console.cloud.google.com/iam-admin/serviceaccounts/create →
   name `sps-analytics-reader` → Create and continue → **skip both grant
   steps** (no project role needed) → Done.
5. Copy the service-account email (`…@….iam.gserviceaccount.com`).
6. Open the account → **Keys** → Add key → Create new key → **JSON** →
   save the file as `.secrets/gcp-analytics.json` in the repo root.

### 4.3 Grant the service account read access
- **GA4:** https://analytics.google.com/ → ⚙ Admin → Property column
  (property must be ID `328729351`) → **Property access management** →
  ⊕ Add users → paste the service-account email → role **Viewer** → Add.
- **GSC:** https://search.google.com/search-console → property selector →
  `https://spsgrupp.ee/` → **Settings** → **Users and permissions** →
  Add user → same email → **Restricted** → Add.
- **Google Ads:** nothing. Cost/click data reaches the report through the
  GA4 ↔ Ads link (GA4 Admin → Product links). Only if search-term-level Ads
  data is ever needed would the Google Ads API (developer token + OAuth) be
  required.

### 4.4 Vercel
Project → Settings → Environment Variables → add
`NEXT_PUBLIC_GTM_ID=GTM-KP5VZH9Q` (Production + Preview) → redeploy.
The reporting env vars are **local-only** — the service-account key must
never leave the machine.

### 4.5 GTM container (configured in the GTM web UI, not in code)
Existing container `GTM-KP5VZH9Q` already contains: Google Tag
`G-KE6ZB0WXL9` (All Pages), Google Tag `AW-944834915` + Conversion Linker
(Initialization), GA4 event tags (tel/email/copy/outbound clicks), and the
`form_submit` custom-event trigger feeding the "päring" GA4 event +
Enhanced Conversions. When creating a *new* container, replicate at least:
- Google Tag (GA4 measurement ID) — All Pages
- Google Tag (Ads ID) + Conversion Linker — Initialization, All Pages
- Custom Event trigger `form_submit` → GA4 Event tag (name `päring`), with a
  blocking trigger "tööotsija Trigger" = Custom Event `form_submit` where
  dataLayer `form_id = career` (job applications don't count as leads; fixed
  2026-08-24 from the old URL-based `/tule-meile-toole/` exception that only
  covered ET)
- Custom Event trigger `form_submission_success` → Google Ads conversion
  tag, with the equivalent career blocker (Custom Event
  `form_submission_success` where dataLayer `form_id = career`). The site
  pushes this event with a hardcoded raw `dataLayer.push()` (see §2) so the
  Ads conversion survives any refactor of the analytics stack — bind
  conversion tags to THIS event, not `form_submit`.
- Ads User-provided Data (Enhanced Conversions) tag on the form events,
  reading `user_data.email` from the dataLayer via
  "DLV - Kliendi Email Variable" (must read `user_data.email`, NOT the old
  `customerEmail`). Both form events carry `user_data.email`.
- Removed 2026-08-24 (WordPress leftovers): "User email hash Tag" (jQuery
  `submit_success` listener — threw `jQuery is not defined` on every page),
  "chtml listner Tag" (CF7 `wpcf7mailsent` listener), test AjaxComplete
  tag/trigger, cf7submission + aitäh + tel-copy-5 triggers, and an unused
  constant pointing at the old GA4 property `G-F68B7T28B6`. Kept:
  "kopeerimise Tag" (cHTML copy listener) — Email/Tel copy tags depend on its
  `textCopied` dataLayer event.

## 5. Reporting (traffic analysis)

```bash
npm run report:analytics          # last 28 days vs previous 28
tsx scripts/analytics-report.ts --days=7
```

Output digest: GA4 overview (sessions/users/new users/engagement/key events
with period-over-period deltas), sessions by channel, top pages, Google Ads
cost/clicks/impressions/key events per campaign (via the GA4 link), GSC
totals, top queries, top pages.

Implementation: `scripts/analytics-report.ts` — plain REST via fetch,
auth via `google-auth-library` (scopes `analytics.readonly` +
`webmasters.readonly`). GA4 Data API `runReport`; GSC
`searchAnalytics/query`.

### Troubleshooting
| Symptom | Cause / fix |
|---|---|
| `Service-account key not found` | §4.2 step 6 — file must be at `.secrets/gcp-analytics.json` |
| GA4 `403 PERMISSION_DENIED` | §4.3 GA4 step — wrong property, or grant not propagated yet (wait 2–3 min) |
| GSC `403` | service account added to a different GSC property than `GSC_SITE_URL` (URL-prefix vs domain property are different objects) |
| Ads section says "no data" | GA4 ↔ Ads not linked, or no active campaigns in the period |

## 6. Consent & privacy notes

- Consent Mode v2 defaults: everything denied except `security_storage`.
  Banner accept → all storages granted; decline → stays denied. Choice in
  `localStorage["sps_consent"]` (`granted`/`denied`).
- With denied consent, GA4/Ads still receive cookieless pings (modeling),
  `_gcl_aw` is not written, and the gclid form field stays empty — expected.
- The banner markup never appears in SSR HTML (hydration-safe via
  `useSyncExternalStore`), so SSG byte output is unaffected by it.
