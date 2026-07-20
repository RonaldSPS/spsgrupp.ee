# Live URL i18n + SEO implementation tasks

## Non-negotiable rule

The current live `spsgrupp.ee` page URL structure is the source of truth.

- Keep every live Estonian root URL exactly as it is on `spsgrupp.ee`.
- Keep every live English `/en/...` URL exactly as it is on `spsgrupp.ee`.
- Keep every live Russian `/ru/...` URL exactly as it is on `spsgrupp.ee`.
- Do not invent cleaner replacement slugs during the translation work.
- Do not launch changed public page URLs unless the owner explicitly approves a URL migration.
- Use redirects only for old, duplicate, or accidental local URLs. Redirects are not the main migration plan.

The goal is to serve better translated HTML and SEO metadata at the URLs Google and users already know.

## Handoff instructions for a new chat

Before implementing, read these files in order:

1. `AGENTS.md`
2. `LIVE_URL_I18N_SEO_TASKS.md`
3. `i18n-plan.md`
4. `DEVSTEPS.md`
5. `TRANSLATIONS.md`
6. `next.config.ts`
7. `lib/slug-map.ts`
8. `lib/page-registry.ts`
9. `lib/metadata-registry.ts`
10. `lib/seo-metadata.ts`
11. `app/layout.tsx`
12. `app/en/[[...slug]]/page.tsx`
13. `app/ru/[[...slug]]/page.tsx`
14. `app/sitemap.ts`

Important handoff warnings:

- Execute this plan phase by phase.
- Start with Phase 0 and report the live URL inventory before changing routing.
- The current local `lib/slug-map.ts` may not match the live `spsgrupp.ee` URLs. Do not trust it until the live URL inventory is complete.
- Existing local i18n support may be incomplete or partially wrong. Treat it as implementation material to audit, not as the final source of truth.
- The most important requirement is preserving the current live `spsgrupp.ee` public URL structure for static ET/EN/RU pages.
- Admin UI stays one language.
- EN/RU blog URLs may be newly generated because there is no current translated blog URL contract.
- Implement with server-rendered translated HTML and fully translated SEO metadata/schema.
- Do not jump directly into string extraction before the URL contract is verified.

## Scope

In scope:

- Public/customer-facing local development pages.
- Public static service, company, contact, privacy, careers, and related pages.
- Public blog and job content where those pages are intended to be indexed.
- Public metadata, canonical URLs, hreflang, sitemap, JSON-LD, forms, validation messages, and internal navigation.
- Every public SEO-visible element on public pages, including page body text, headings, buttons, links, image alt text, aria labels, form labels/placeholders, error/success messages, metadata, Open Graph/Twitter text, JSON-LD, breadcrumbs, FAQ content, and sitemap alternates.

Out of scope:

- Admin UI translation.
- Admin-only API response localization.
- Internal image tools.
- Experiment pages such as variants.
- Developer-only pages and tooling.

Admin-entered content is only translated when it appears on public pages, for example public blog posts or public job posts.

## Phase 0 - Build the live URL contract

- [ ] Crawl the current live site and export all indexable public page URLs.
  - Include Estonian root pages, `/en/...` pages, `/ru/...` pages, job URLs, privacy/contact/about pages, and service pages.
  - Blog posts currently do not have existing translated live URLs to preserve, so record existing Estonian blog URLs separately from the static live URL contract.
  - Capture status code, canonical URL, title, meta description, H1, detected language, and trailing slash behavior.
- [ ] Save the crawl as `data/live-url-inventory.json` or `data/live-url-inventory.csv`.
- [ ] Cross-check the crawl against:
  - Live sitemap files.
  - Google-indexed URLs found with `site:spsgrupp.ee/en` and `site:spsgrupp.ee/ru`.
  - Current `next.config.ts` redirects.
  - Any Google Search Console export available from the owner.
- [ ] Decide and document the exact canonical trailing slash policy from the live site.
  - If live canonical URLs use trailing slashes, the new site should emit and serve the same canonical shape.
  - If both slash and non-slash variants work, one canonical variant must still match live.
- [ ] Create a route comparison report:
  - `live URL`
  - `current local URL`
  - `matches live?`
  - `required action`
- [ ] Do not edit `lib/slug-map.ts` until the live URL inventory is complete.

## Phase 1 - Lock routing to live URLs

- [ ] Replace or correct `lib/slug-map.ts` so every mapping matches the live URL inventory exactly.
  - Estonian path is the stable content ID.
  - English path must match the live `/en/...` URL.
  - Russian path must match the live `/ru/...` URL.
- [ ] Keep current Estonian root routes in place. Do not move Estonian content under `/et`.
- [ ] Keep `/en/[[...slug]]` and `/ru/[[...slug]]` as translated mirrors, but resolve slugs using the live URL map.
- [ ] Add explicit tests or a script that verifies every live URL returns the intended route.
- [ ] Add explicit tests or a script that verifies no locally generated canonical, sitemap, or internal link points to a non-live replacement URL.
- [ ] Unknown `/en/...` and `/ru/...` paths should return 404 unless they are approved legacy redirects.

## Phase 2 - Server-render translated page HTML

- [ ] Translate the entire public site page content into Estonian, English, and Russian.
  - Include all headings, paragraphs, card text, service lists, CTA buttons, badges, labels, testimonials, FAQ text, breadcrumbs, image alt text, aria labels, form labels, placeholders, validation messages, success/error states, and footer/header text.
  - Do not leave mixed-language public pages except for intentional brand names, addresses, phone numbers, emails, ISO names, legal references, prices, dates, and other non-translatable factual values.
- [ ] Convert each hardcoded Estonian page body to locale-aware server-rendered content.
- [ ] Prefer Server Components for text-heavy sections so Google receives real translated HTML in the initial response.
- [ ] Use Client Components only where interactivity is required, such as menus, forms, animation triggers, calculators, or browser-only behavior.
- [ ] Avoid a pattern where the page body is empty until client-side JavaScript hydrates.
- [ ] For each page, extract visible text into `messages/et.json`, then translate the same keys into `messages/en.json` and `messages/ru.json`.
- [ ] Pass the active locale explicitly from the route layer to reused page modules.
- [ ] Use server-side translation calls with an explicit locale for page content and metadata.
- [ ] Keep HTML structure semantic:
  - One clear H1 per page.
  - Logical H2/H3 hierarchy.
  - Real anchors for links.
  - Real lists for service lists and FAQ lists.
  - Image `alt` text translated where appropriate.
- [ ] Preserve the global minimum font-size rule: no text below `15px`.

## Phase 3 - Localize metadata and structured data

- [ ] Translate every public page's SEO elements for all three languages.
  - `title`
  - `description`
  - `keywords` where still used
  - Open Graph title, description, locale, URL, and image alt text
  - Twitter title and description
  - Canonical URL
  - Hreflang alternates
  - Robots directives where page-specific directives exist
  - Breadcrumb metadata
  - FAQ metadata
  - Service/product/organization/local-business schema text
- [ ] Translate page title and meta description for every locale.
- [ ] Replace the current Estonian-only metadata registry with locale-aware metadata.
- [ ] For each page, generate:
  - Locale-specific `title`.
  - Locale-specific `description`.
  - Locale-specific Open Graph title and description.
  - Locale-specific Twitter metadata.
  - Canonical URL matching the live URL for that locale.
  - `hreflang` alternates for `et`, `en`, and `ru`.
- [ ] Add `x-default` hreflang if the final SEO strategy wants root Estonian as default.
- [ ] Translate JSON-LD visible text:
  - FAQ questions and answers.
  - Breadcrumb names.
  - Service names and descriptions.
  - Organization descriptions where language-specific text is used.
- [ ] Keep factual fields unchanged:
  - Company name.
  - Registry code.
  - VAT number.
  - Phone numbers.
  - Email addresses.
  - ISO names.
  - Addresses unless the live site intentionally localizes them.
- [ ] Validate rendered structured data with a rich-results compatible workflow.

## Phase 4 - Fix document language

- [ ] Fix `<html lang>` so rendered documents use:
  - `et` for root Estonian URLs.
  - `en` for `/en/...` URLs.
  - `ru` for `/ru/...` URLs.
- [ ] Do this without changing public URLs.
- [ ] Evaluate route groups or another Next-supported layout strategy if the current root layout prevents correct per-locale `<html lang>`.
- [ ] Verify the final rendered HTML source, not only React props or client state.

## Phase 5 - Localize internal links without changing URL contract

- [ ] Translate all public navigation and link-adjacent text.
  - Header navigation labels.
  - Mega menu labels.
  - Footer headings and links.
  - Breadcrumb labels.
  - CTA labels.
  - Related-service card labels.
  - Form privacy/consent text.
- [ ] Update Navbar links to point to the current locale's live URL mapping.
- [ ] Update Footer links to point to the current locale's live URL mapping.
- [ ] Update page body links, CTA links, breadcrumb links, card links, and related-service links.
- [ ] Keep anchors such as `#pakkumine` intact, but attach them to the localized page URL when linking across pages.
- [ ] Keep phone, email, map, Facebook, and other external URLs unchanged unless the live site already uses localized variants.
- [ ] Language switcher behavior:
  - From an Estonian URL, EN/RU buttons go to the exact corresponding live EN/RU URL.
  - From an English URL, ET/RU buttons go to the exact corresponding live ET/RU URL.
  - From a Russian URL, ET/EN buttons go to the exact corresponding live ET/EN URL.
  - If no translated equivalent exists, use the closest approved parent page or hide/disable that language option for that page.

## Phase 6 - Sitemap, robots, and redirects

- [ ] Generate sitemap entries for all approved live URLs in all locales.
- [ ] Include sitemap alternates for each static page:
  - `et`
  - `en`
  - `ru`
  - optional `x-default`
- [ ] Include translated blog/job URLs only if they exist and are intended to be indexed.
- [ ] Ensure sitemap URLs use the live canonical URL shape.
- [ ] Keep admin, API, image tool, and experiment pages disallowed/noindexed as appropriate.
- [ ] Add redirects only for:
  - Existing legacy URLs already known on the current site.
  - Local development slugs that accidentally shipped or are likely to be requested.
  - Duplicate slash/non-slash variants if needed to enforce the live canonical shape.
- [ ] Do not redirect live `/en` or `/ru` URLs to newly invented slugs.

## Phase 7 - Blog and job translation

- [ ] Inventory live blog and job URLs separately from static service pages.
- [ ] Preserve existing live job URLs where they are public/indexable.
- [ ] Preserve existing Estonian blog URLs.
- [ ] Since blog posts do not currently have live translated EN/RU URLs to preserve, allow new translated blog slugs to be generated for EN/RU.
- [ ] For blog posts:
  - ET blog posts stay at `/blog/[estonian-slug]`.
  - EN blog translations may use API-generated or editor-approved slugs at `/en/blog/[translated-slug]`.
  - RU blog translations may use API-generated or editor-approved slugs at `/ru/blog/[translated-slug]`.
  - Store translated title, slug, excerpt, content HTML, meta title, meta description, JSON-LD text, and status.
  - Mark API-created translations as `auto` until reviewed.
  - Allow admins/editors to override translated slugs before or after publishing.
  - Include translated blog posts in EN/RU sitemap only when translation exists and is intended to be indexed.
  - Add hreflang between ET/EN/RU blog versions once translations exist.
  - If a translation API key is missing or translation fails, do not publish broken mixed-language EN/RU blog pages.
  - Do not auto-generate a translated public slug that conflicts with an existing route.
- [ ] For job posts:
  - Preserve live URLs for active and historically indexable job pages where required.
  - Translate visible job content and metadata if the page is indexable.
  - Noindex expired jobs if that is the chosen SEO policy.

## Phase 7A - Blog auto-translation workflow

- [ ] Configure the translation provider through an environment variable such as `DEEPSEEK_API_KEY`.
- [ ] On Estonian blog save/create, trigger EN and RU translation when an API key is present.
- [ ] Save translations separately from the Estonian source.
- [ ] Preserve HTML tags, attributes, image URLs, link URLs, phone numbers, emails, prices, dates, brand names, and ISO names during translation.
- [ ] Generate translated slugs for EN/RU because no existing translated blog URL contract currently exists.
- [ ] Store translation status:
  - `auto` for API-generated content.
  - `edited` for manually reviewed/changed content.
  - `failed` or equivalent for failed translation attempts.
- [ ] Show translation status in the admin workflow if practical, but admin UI itself does not need to be multilingual.
- [ ] Do not block saving the Estonian post if translation fails.
- [ ] Log translation failures clearly for retry.
- [ ] Provide a way to retry translation for a single post and locale.

## Phase 8 - Verification checklist

- [ ] Run `npm run build`.
- [ ] Run `npm run lint`.
- [ ] Run a URL parity test against the live URL inventory:
  - Every live ET URL returns 200 or the same intended status.
  - Every live EN URL returns 200 or the same intended status.
  - Every live RU URL returns 200 or the same intended status.
  - No live indexable URL is missing.
- [ ] Fetch rendered HTML with JavaScript disabled or via raw HTTP and confirm:
  - Translated H1/body text is present in the HTML response.
  - Metadata is present and localized.
  - Canonical URL is correct.
  - Hreflang alternates are correct.
  - JSON-LD is present and localized.
  - `<html lang>` is correct.
- [ ] Crawl the local production build and check:
  - No broken internal links.
  - No internal links to non-live replacement slugs.
  - No accidental `/et` URLs.
  - No unexpected 3xx chains.
  - No duplicate canonicals across different language pages.
- [ ] Compare top pages against the live crawl before launch.
- [ ] After launch, monitor:
  - Google Search Console indexing.
  - 404s.
  - Redirect hits.
  - Sitemap discovery.
  - Canonical selection.

## Acceptance criteria

- [ ] Public page URL structure matches the current live `spsgrupp.ee` site.
- [ ] Estonian remains at root.
- [ ] English remains under the exact live `/en/...` URLs.
- [ ] Russian remains under the exact live `/ru/...` URLs.
- [ ] Static public pages preserve live URLs exactly; new translated blog URLs may be generated because there is no current live translated blog URL contract.
- [ ] Every public page is fully translated in visible body content and SEO-visible non-body elements.
- [ ] Page content is available as server-rendered HTML in the initial response.
- [ ] Metadata, canonical URLs, hreflang, sitemap, and JSON-LD are localized and point to live-equivalent URLs.
- [ ] Internal navigation respects the active locale and never points users or crawlers to unapproved replacement slugs.
- [ ] Redirects are minimal and only support preservation, not a broad URL migration.
- [ ] Admin UI remains one language and is not part of the public i18n scope.
