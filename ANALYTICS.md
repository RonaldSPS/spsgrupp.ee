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
    *before* GTM — only the Ads signals (`ad_storage`/`ad_user_data`/
    `ad_personalization`) are denied until consent; `analytics_storage` and
    functionality/personalization are granted by default (minimal-restriction
    policy, see §6), `wait_for_update: 500`, `ads_data_redaction: true`
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
  `gtag('consent','update',…)` onto the dataLayer, `pushConsentEvent()`
  pushes the consent-funnel events.
- `app/components/analytics/CookieConsentBanner.tsx` — ET/EN/RU banner
  (messages namespace `cookieConsent`). Hidden in SSR HTML; appears after
  hydration only when no stored choice. A stored choice is re-applied on
  every load. Pushes `consent_banner_shown` once per display and
  `consent_accept` / `consent_decline` on click (raw dataLayer pushes, with
  `locale`) so the accept/decline rate is measurable in GA4. GTM wiring:
  one Custom Event trigger with "Use regex matching" on the event name
  `^consent_(banner_shown|accept|decline)$` → one GA4 Event tag whose Event
  Name is the built-in `{{Event}}` variable. Do not rename the events.
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
| `GCP_SERVICE_ACCOUNT_JSON={"type":"service_account",...}` | **Vercel** (weekly report cron) | the same key as a JSON-string env var — approved exception (10.09.2026) to the "key never leaves the machine" rule so the Friday cron can call the APIs |
| `DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL` | **Vercel + local** (weekly report) | LLM narrative provider (default, key already present); falls back to rules-only when unset. Alternative provider: `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` (wins when both are set) |

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
- **Google Ads:** for the GA4-based report — nothing. Cost/click data
  reaches it through the GA4 ↔ Ads link (GA4 Admin → Product links).
  For **direct account access** (impression share, conversion actions,
  search terms, keywords) set up the Google Ads API per §6 — the service
  account is added as a user in the Ads account, same pattern as GA4/GSC.

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
npm run report:analytics          # GA4 + GSC + Ads cost via the GA4 link, last 28 days
npm run report:ads                # direct Ads API: campaigns, impression share,
                                  # conversion actions, search terms (needs §7 setup)
tsx scripts/analytics-report.ts --days=7
tsx scripts/ads-report.ts --days=30
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

## 5b. Weekly marketing report (automated, Fridays)

Every Friday 06:00 UTC (09:00 EEST) Vercel Cron hits `/api/cron/weekly-report/`
(`vercel.json`, CRON_SECRET-protected like keepalive) which:

1. **Collects** the last-7-days vs previous-7-days snapshot
   (`lib/reporting/snapshot.ts`): GA4 (overview/channels/top pages/per-day
   tracking health), GSC (totals, full query sets both weeks, pages), Ads API
   (campaigns with impression share, search terms brand/non-brand, keywords +
   QS), and `form_submissions` aggregates (real inquiries = conversion truth,
   incl. gclid-attributed leads). A failing source lands in `snapshot.errors`
   and never aborts the rest.
2. **Aggregates 22 tracked keyword families** (`lib/reporting/keyword-families.ts`
   — the same märksõnaperekonnad as the manual raportid/ reports, RU/EN/
   ehitusprahi clusters included; position = impression-weighted average).
3. **Rules engine** (`lib/reporting/insights.ts`) produces Estonian findings +
   concrete next actions per area (SEO/Ads/GA4/forms/strategy), using the
   manual reports' conventions (±2 pos = stable, <10 impressions = noise,
   pre-launch baseline 9.0 clicks/day, goal ≥15 inquiries/month).
4. **LLM narrative** (`lib/reporting/llm.ts`, plain fetch, no SDK) writes
   Kokkuvõte / Märkimisväärseimad liikumised / Järgmise nädala prioriteedid /
   Sisu- ja kampaaniasoovitused. Provider: DeepSeek (`DEEPSEEK_API_KEY`,
   model override `DEEPSEEK_MODEL`, default `deepseek-chat`) — or Anthropic
   when `ANTHROPIC_API_KEY` is also set (`ANTHROPIC_MODEL`, default
   `claude-sonnet-4-5`). With no key the report ships rules-only.
   **Number audit** (`lib/reporting/number-audit.ts`): the narrative may only
   contain numbers that appear in the real inputs (digest JSON, full insights,
   system context) — Estonian formatting normalized ("11,6", "1 000 000"),
   1-decimal rounding tolerated. Any invented/derived number discards the
   whole narrative and the report ships rules-only (added 11.09.2026 after
   the "55 % / 85,2 € brand spend" incident, where an insights rule dumped the
   unattributed search-term bucket into "brand" — also fixed: brand share is
   now computed only against attributed spend and needs ≥10 € + ≥30 %).
5. **Stores** in `weekly_reports` (migration `drizzle/0010`, one row per week,
   upsert; JSON fallback `data/weekly-reports.json`) — this is the trend
   memory that powers the admin "Trend" charts.
6. **E-mails** an HTML report (`lib/reporting/notify.ts`, Resend) to the
   `report_email_recipients` admin setting (Seaded → E-posti saajad, fallback
   ronald@outline.ee). `lib/email.ts` gained an optional `html` body.

Admin UI: `/spsadmn/raportid/` (list + "Genereeri raport kohe" →
`POST /api/spsadmn/reports`, `{sendEmail:false}` default) and
`/spsadmn/raportid/[id]/` (scorecards, trends, narrative, insights, keyword
family table with ▲/■/▼, top queries, Ads campaigns, forms).

Local run: `npm run report:weekly` (generation only — e-mail is a
server-only path; test delivery via the deployed cron route with `?send=0`).

Vercel env needed by the cron (all present as of 10.09.2026):
`GCP_SERVICE_ACCOUNT_JSON`, `GA4_PROPERTY_ID`, `GSC_SITE_URL`,
`GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID`, `DEEPSEEK_API_KEY`,
`CRON_SECRET` + `Resend_API` (pre-existing).

## 6. Google Ads API (direct account access)

The GA4-link report (§5) only sees cost/clicks/impressions. Direct account
data — impression share (and WHY share is lost: budget vs rank/ad-quality),
the actual conversion-action list (explains UI "conversions" vs real form
submits), search terms (brand vs non-brand split) — comes from the Google
Ads API. Setup below reflects the state as of 09.2026.

**Access model (2026 change).** API access levels now live on the *Google
Cloud project* ("cloud-managed access levels"): Test → Explorer (production
reads, ~2.9k ops/day) → Basic (15k ops/day) → Standard. They are managed on
the Google Ads API page in the Cloud console (APIs & Services → Enabled
APIs → Google Ads API); the Ads UI API Center shows a "no longer managed
here" notice. The developer token is still sent with requests but is no
longer the gating credential — and the first API call permanently pairs a
token with the Cloud project, so always use credentials from the `spsgrupp`
project.

One-time setup (all completed 09.2026):

1. **Manager account + developer token.** The API Center exists only in
   *manager* accounts — a regular client account (ours: `3967281610`) never
   shows it. Create a free manager account
   (https://ads.google.com/home/tools/manager-accounts/), link the client
   account (manager: Accounts → + → Link existing account; accept in the
   client under Admin → Access and security → Managers), then open
   https://ads.google.com/aw/apicenter and complete the API Access form to
   get the 22-char developer token.
2. **Cloud project `spsgrupp`:** enable the Google Ads API
   (https://console.cloud.google.com/apis/library/googleads.googleapis.com).
3. **Access level upgrade.** Fresh projects start at TEST — production
   calls fail with `CLOUD_PROJECT_NOT_APPROVED_FOR_PRODUCTION`. Apply for
   Explorer on the Google Ads API page in the Cloud console (approved
   within minutes). Brand verification of the OAuth consent screen
   (Audience: External + In production; Branding filled → Verify → Publish)
   accelerates any later Basic review.
4. **Auth — service account (what the script uses).** Add
   `sps-analytics-reader@spsgrupp.iam.gserviceaccount.com` as a user in the
   Ads account (Admin → Access and security → Users; currently Standard,
   Read only would suffice). `scripts/ads-report.ts` mints access tokens
   from `.secrets/gcp-analytics.json` with the `adwords` scope — no OAuth
   consent flow needed. (Fallback: user OAuth — Desktop-app OAuth client in
   `spsgrupp` with the `adwords` scope on the consent screen, then
   `npm run setup:ads-auth`. Google now requires 2SV — and from 08.2026
   passkeys — for minting new refresh tokens, another reason the SA path is
   primary.)
5. `.env.local` (git-ignored, already set):
   ```
   GOOGLE_ADS_DEVELOPER_TOKEN=...        # from the manager account's API Center
   GOOGLE_ADS_CUSTOMER_ID=3967281610     # 10 digits, no dashes
   GOOGLE_ADS_CLIENT_ID / GOOGLE_ADS_CLIENT_SECRET / GOOGLE_ADS_REFRESH_TOKEN
                                         # OAuth fallback path only
   # GOOGLE_ADS_LOGIN_CUSTOMER_ID unset — the SA has direct account access
   ```
6. Run: `npm run report:ads` (optionally `--days=30`).

Read-only: the scripts only call `googleAds:search` — nothing in the
account is modified. Script notes: uses Ads API `v25` (a 404 *HTML* error
means the version was sunset — bump `ADS_API_VERSION`); the REST API
returns camelCase keys, normalized to snake_case by `snakeKeys()`;
`conversion_action.counting_method` no longer exists in v25.

## 7. Consent & privacy notes

- Minimal-restriction policy (owner decision 03.09.2026): only the signals
  Google's EU User Consent Policy requires consent for are gated —
  `ad_storage`, `ad_user_data`, `ad_personalization` are denied by default
  for everyone and granted only on banner accept. Granting those by default
  would breach Google's terms for EEA traffic — do not do it.
  `analytics_storage`, `functionality_storage` and `personalization_storage`
  are GRANTED by default (and stay granted even on decline), so GA4 audience
  measurement is not affected by the banner. This is "advanced" consent
  mode: denied ads consent still sends cookieless pings, which power Ads
  conversion modeling — the most measurement Google allows without consent.
  Banner accept → ads signals granted; decline → ads stay denied. Choice in
  `localStorage["sps_consent"]` (`granted`/`denied`).
- With denied ads consent, `_gcl_aw` is not written and the gclid form field
  stays empty — expected.
- The banner markup never appears in SSR HTML (hydration-safe via
  `useSyncExternalStore`), so SSG byte output is unaffected by it.
