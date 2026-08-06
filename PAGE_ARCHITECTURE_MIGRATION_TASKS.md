# SPS Grupp page architecture migration tasks

## Objective

Migrate every public ET, EN, and RU page from the current hybrid implementation to shared, typed page-family templates and locale content definitions.

The migration must preserve:

- every public URL and redirect;
- the current visual design and section order;
- all approved text, prices, forms, images, and business claims;
- metadata, canonicals, `hreflang`, sitemap entries, and JSON-LD;
- the minimum visible font size of 15 px;
- current desktop and mobile behaviour unless correcting a verified defect.

This is an architecture migration, not a redesign or copywriting project.

## Target architecture

- [ ] One central public-page registry maps the canonical ET page ID to all ET, EN, and RU paths.
- [ ] Every registry entry declares its page family, content source, metadata source, images, and optional capabilities.
- [ ] ET, EN, and RU use the same React template for the same page ID.
- [ ] Locale files contain content only; they do not contain layout or styling decisions.
- [ ] Page templates use explicit TypeScript types instead of `Record<string, unknown>` and inferred numbered keys.
- [ ] Repeated sections use typed reusable components.
- [ ] Exceptional sections are supported as typed optional blocks or approved page-family variants.
- [ ] Metadata, breadcrumbs, canonicals, alternate-language links, sitemap data, and JSON-LD derive from the same registry entry.
- [ ] Route files remain thin server components.
- [ ] Client components are limited to elements that require browser interaction.

Suggested structure:

```text
lib/pages/
  registry.ts
  types.ts
  metadata.ts
  validation.ts
  definitions/
    home.ts
    regular-cleaning.ts
    specialist-cleaning.ts
    outdoor-cleaning.ts
    repair-services.ts
    company.ts
    contact.ts
    careers.ts

app/components/page-templates/
  MarketingPageTemplate.tsx
  ServiceHubTemplate.tsx
  ServiceDetailTemplate.tsx
  CompanyPageTemplate.tsx
  ContactPageTemplate.tsx
  CareerPageTemplate.tsx
  LegalPageTemplate.tsx
```

The final naming may change during the pilot, but the separation between registry, typed content, templates, and interactive components must remain.

## Phase 0 — freeze the current behaviour

- [ ] Record the current Git state without modifying or cleaning user changes.
- [ ] Export the current canonical page and locale-path inventory.
- [ ] Classify every public page by page family and special features.
- [ ] Record the current section order for every page ID.
- [ ] Record pages containing calculators, pricing, forms, FAQs, testimonials, job data, or database content.
- [ ] Add an automated assertion that every public page ID has ET, EN, and RU paths where translations currently exist.
- [ ] Add an automated assertion that no two page IDs claim the same localized path.
- [ ] Add characterization tests for existing slug mapping and canonical generation.
- [ ] Save representative desktop and mobile screenshots for every page family.
- [ ] Confirm that `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, and `npm run seo:check` pass before migration.

## Phase 1 — define the typed content system

- [ ] Read the relevant App Router, Server/Client Component, metadata, dynamic-route, and internationalization guides in `node_modules/next/dist/docs/` before implementation.
- [ ] Create a stable `PageId` type independent of translated slugs.
- [ ] Create a `Locale = 'et' | 'en' | 'ru'` type used consistently by pages, metadata, forms, and navigation.
- [ ] Define shared field types for hero, breadcrumbs, CTA, cards, FAQ, pricing, process, trust, testimonials, forms, and footer CTA.
- [ ] Define discriminated unions for supported section types.
- [ ] Define typed page-family models for hubs, service details, company pages, contact, careers, legal, blog index, and blog posts.
- [ ] Model optional sections explicitly; do not infer them from missing numbered JSON keys.
- [ ] Create runtime validation for content definitions so malformed locale content fails during development/build.
- [ ] Add schema-equivalence tests requiring ET, EN, and RU definitions for a page to have compatible section types and order.
- [ ] Keep locale-specific text lengths and optional editorial variations possible without allowing structural drift.

## Phase 2 — centralize routing and SEO

- [ ] Replace overlapping slug, page, localized-page, and metadata registries with one authoritative public-page registry.
- [ ] Store canonical ET path and localized EN/RU paths in the same page entry.
- [ ] Generate forward and reverse localized-path lookup maps from that registry.
- [ ] Generate language-switcher destinations from page ID rather than string manipulation.
- [ ] Generate canonical and `hreflang` values from the registry.
- [ ] Generate breadcrumbs from declared parent page IDs.
- [ ] Generate sitemap entries from the registry.
- [ ] Generate route metadata from typed localized content.
- [ ] Generate Service, BreadcrumbList, FAQ, and Organization JSON-LD from the same content used visibly on the page.
- [ ] Add tests for path uniqueness, parent validity, canonical consistency, alternate-language completeness, and sitemap coverage.
- [ ] Preserve every current public URL; create a reviewed redirect entry before changing any path.

## Phase 3 — build reusable page templates

- [ ] Extract a shared page shell containing navigation, main landmark, footer CTA rules, form placement, and footer.
- [ ] Create a typed shared hero supporting the currently used visual variants.
- [ ] Create reusable section-heading, prose, card-grid, image/content, pricing, process, FAQ, trust, testimonial, and CTA sections.
- [ ] Preserve existing CSS classes and DOM structure where required for visual equivalence.
- [ ] Move inline repeated SVGs into reusable icon components or structured icon identifiers.
- [ ] Move repeated inline style objects into shared variants without changing their computed styles.
- [ ] Keep interactive widgets such as FAQ toggles, sliders, tabs, menu, calculator, and forms as focused Client Components.
- [ ] Keep templates and static content as Server Components wherever possible.
- [ ] Support approved page-specific sections through typed slots; do not copy an entire page to handle one unique section.
- [ ] Add component tests for every section variant.

## Phase 4 — pilot migration

Use office cleaning as the first complete pilot because it exercises service content, pricing, FAQs, forms, metadata, and all three languages.

- [ ] Create the typed office-cleaning definition for ET, EN, and RU.
- [ ] Render all three locales with one `ServiceDetailTemplate`.
- [ ] Preserve the exact section order, content, classes, links, images, and form behaviour.
- [ ] Replace the old ET inline implementation only after the shared implementation passes all checks.
- [ ] Verify ET, EN, and RU at 390, 768, 1280, and 1440 px.
- [ ] Compare screenshots against the frozen baseline.
- [ ] Verify metadata, canonical, `hreflang`, breadcrumbs, JSON-LD, internal links, and language switching.
- [ ] Verify that no displayed text is below 15 px.
- [ ] Run the complete verification suite.
- [ ] Review the pilot architecture before migrating another page.

## Test-first task — image-aware placement for content cards

Create a reusable, deterministic system that positions content cards over or beside images without covering the image's important subject or focal area. Testing and expected-placement fixtures must be completed before implementation begins.

### Define and characterize the behaviour first

- [ ] Inventory every current component and page where a content card overlaps, floats over, or is positioned relative to an image.
- [ ] Capture representative baseline screenshots at 390, 768, 1280, and 1440 px before changing placement behaviour.
- [ ] Record the current card position, image crop, `object-position`, text length, and breakpoint behaviour for each representative case.
- [ ] Define the supported placement outputs, such as left, right, top-left, top-right, bottom-left, bottom-right, and separate-column placement.
- [ ] Define typed image-composition inputs: focal point, protected subject region, preferred crop, preferred card side, and optional manual placement override.
- [ ] Decide whether image-composition data belongs in the page definition, an image-asset registry, or both; document one authoritative source.
- [ ] Require a manual override for images whose composition cannot be represented reliably by the automatic rules.

### Write tests before implementation

- [ ] Add unit tests for a pure placement function before creating the production implementation.
- [ ] Add fixtures covering subjects on the left, right, center, top, and bottom of an image.
- [ ] Add fixtures covering wide, portrait, square, and unusually cropped images.
- [ ] Add tests for missing focal metadata and verify that the result uses a safe, documented fallback.
- [ ] Add tests proving that an explicit manual placement override wins over automatic placement.
- [ ] Add tests for long ET, EN, and RU card content so text length cannot move the card into a protected image region.
- [ ] Add breakpoint tests proving that desktop placement does not leak into an unsuitable mobile layout.
- [ ] Add visual-regression fixtures for representative cards at 390, 768, 1280, and 1440 px.
- [ ] Add an assertion that the card and protected subject region do not overlap beyond the approved tolerance.
- [ ] Add assertions for no horizontal overflow, no clipped CTA, no layout shift caused by client-side repositioning, and no visible text below 15 px.
- [ ] Confirm that the new tests fail for the intended missing behaviour before implementation begins.

### Implement only after test approval

- [ ] Implement the placement decision as a pure typed function with no dependency on browser measurements.
- [ ] Add typed focal-point and protected-region metadata to the approved content or image schema.
- [ ] Create reusable placement variants in the relevant image/content-card component.
- [ ] Prefer server-rendered classes and CSS breakpoints; do not reposition cards after hydration unless no deterministic alternative exists.
- [ ] Preserve image aspect ratio, responsive `sizes`, lazy-loading behaviour, alt text, and current visual quality.
- [ ] Use the safe fallback when metadata is absent or invalid.
- [ ] Preserve manual placement overrides for editorial control.
- [ ] Apply the system to one representative pilot card only.
- [ ] Compare the pilot against every pre-implementation screenshot and approved expected-placement fixture.
- [ ] Review the pilot with Sol High before enabling the system for additional page families.

### Acceptance criteria

- [ ] All unit, breakpoint, locale-length, overlap, overflow, and visual-regression tests pass.
- [ ] The card avoids the declared protected subject region at every tested desktop and tablet width.
- [ ] Mobile uses the approved safe layout and does not rely on desktop overlay placement.
- [ ] Placement is stable during server rendering and hydration.
- [ ] Editors can override the automatic result through typed page or image metadata.
- [ ] Existing pages without image-composition metadata retain their current layout or the documented safe fallback.
- [ ] No automatic placement is rolled out beyond the pilot until its visual review is approved.

## Phase 5 — migrate regular-cleaning pages

- [ ] Regular-cleaning hub: `/koristusteenus/`.
- [ ] Office cleaning: `/koristusteenus/kontori-koristus/` — pilot.
- [ ] Retail-space cleaning: `/koristusteenus/kaubanduspindade-koristus/`.
- [ ] Industrial-building cleaning: `/koristusteenus/tootmishoonete-koristus/`.
- [ ] School cleaning: `/koristusteenus/koolide-koristamine/` and its current canonical aliases.
- [ ] Confirm that shared maintenance-pricing rules are imported from one pricing module.
- [ ] Remove the obsolete regular-cleaning `_template` page only after confirming it has no route or import consumers.

## Phase 6 — migrate outdoor-cleaning pages

- [ ] Outdoor-cleaning hub: `/koristusteenus/valikoristus/`.
- [ ] Window cleaning: `/koristusteenus/valikoristus/akende-pesu/`.
- [ ] Facade washing: `/koristusteenus/valikoristus/fassaadipesu/`.
- [ ] Graffiti removal: `/koristusteenus/valikoristus/grafiti-eemaldamine/`.
- [ ] Caretaker service: `/koristusteenus/valikoristus/kojameheteenus/`.
- [ ] Leaf clearing: `/koristusteenus/valikoristus/lehtedekoristamine/`.
- [ ] Snow clearing: `/koristusteenus/valikoristus/lumekoristus/`.
- [ ] Lawn mowing: `/koristusteenus/valikoristus/muruniitmine/`.
- [ ] Paving-stone washing and maintenance: `/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus/`.
- [ ] Fold the existing `OutdoorServicePage` and three-entry localized page registry into the new typed page-family system.
- [ ] Preserve reviewed legacy redirects and do not rename Russian slugs during this architecture migration.

## Phase 7 — migrate specialist-cleaning pages

- [ ] Specialist-cleaning hub: `/puhastusteenused/`.
- [ ] Post-construction cleaning: `/puhastusteenused/ehitusjargne-koristus/`.
- [ ] Disinfection: `/puhastusteenused/desinfitseerimine/` and its current canonical mapping.
- [ ] Escalator deep cleaning: `/puhastusteenused/eskalaatorite-suvapuhastus/`.
- [ ] Floor maintenance: `/puhastusteenused/porandate-hooldus/`.
- [ ] Smoke and fire-damage cleaning: `/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine/`.
- [ ] Carpet cleaning: `/puhastusteenused/vaipade-puhastus/`.
- [ ] Model one-time and recurring pricing as separate typed pricing variants.
- [ ] Verify that the maintenance calculator cannot appear on services where its pricing model does not apply.

## Phase 8 — migrate repair and property-maintenance pages

- [ ] Repair-services hub: `/remonditeenused-tallinnas/`.
- [ ] Electrical work.
- [ ] Plumbing.
- [ ] Interior finishing.
- [ ] Sanitary renovation and reconstruction.
- [ ] Ventilation construction and maintenance.
- [ ] Tiling.
- [ ] Roof repair.
- [ ] Demolition.
- [ ] Construction-waste removal: `/ehitusprahi-aravedu/`.
- [ ] Resolve duplicate lawn, leaf, and caretaker concepts by assigning one page ID per canonical service and treating other paths as declared aliases where appropriate.
- [ ] Do not merge pages with materially different business content merely because their titles are similar.

## Phase 9 — migrate core and informational pages

- [ ] Homepage.
- [ ] SPS Grupp company page.
- [ ] Testimonials/reviews page.
- [ ] Contact page.
- [ ] Careers landing page.
- [ ] Dynamic job-offer page.
- [ ] Privacy/legal page.
- [ ] Add a dedicated typed template for each genuinely different page family rather than forcing these pages through the service template.
- [ ] Preserve database-backed testimonials and job data behind typed server-side adapters.

## Phase 10 — migrate blog pages

- [ ] Define a typed blog-post model independent of the original imported storage format.
- [ ] Keep blog content outside the service-page translation schema.
- [ ] Create one shared blog-index template.
- [ ] Create one shared blog-post template.
- [ ] Define locale and fallback behaviour explicitly for posts that do not exist in all languages.
- [ ] Sanitize imported HTML through one documented pipeline.
- [ ] Generate metadata, canonical, structured data, and internal links from the blog model.
- [ ] Preserve all existing indexed post URLs and approved redirects.

## Phase 11 — normalize administration and non-public routes

These routes do not need the ET/EN/RU marketing-page template, but their architecture should be made consistent separately.

- [ ] Create shared admin layout, navigation, form, list, empty-state, loading, and error components.
- [ ] Keep admin data access and mutations behind typed server functions/actions.
- [ ] Verify authentication and authorization for every `/spsadmn` route.
- [ ] Keep `/variant-a`, `/variant-b`, `/variant-c`, `/image-tool`, and internal templates out of the public registry and sitemap.
- [ ] Decide whether development-only routes should remain, be access-restricted, or be removed in a separate approved change.

## Per-page migration checklist

Complete this checklist for every page ID before marking it migrated:

- [ ] Current ET, EN, and RU routes recorded.
- [ ] Current section order recorded.
- [ ] Current content sources recorded.
- [ ] Current metadata and JSON-LD sources recorded.
- [ ] Typed page definition created.
- [ ] All locale definitions pass runtime and TypeScript validation.
- [ ] All locales render with the same page-family template.
- [ ] Unique sections use typed variants or slots.
- [ ] Old page implementation has no remaining route or import consumers.
- [ ] ET visual comparison passed.
- [ ] EN visual comparison passed.
- [ ] RU visual comparison passed.
- [ ] 390 px mobile comparison passed.
- [ ] 768 px tablet comparison passed.
- [ ] 1280/1440 px desktop comparison passed.
- [ ] No horizontal overflow.
- [ ] No visible text below 15 px.
- [ ] Keyboard navigation and focus states passed.
- [ ] Form or calculator behaviour passed where applicable.
- [ ] Metadata, canonical, `hreflang`, breadcrumbs, and JSON-LD passed.
- [ ] Language switching preserves the page ID.
- [ ] Sitemap and internal-link checks passed.
- [ ] Old implementation removed only after equivalence was proven.

## Phase 12 — remove the hybrid architecture

- [ ] Confirm every public page ID is registered in the new registry.
- [ ] Confirm no public ET page contains a full duplicated localized layout.
- [ ] Confirm EN/RU catch-all routes resolve exclusively through the new registry.
- [ ] Remove `LocalizedContentPage` after its last consumer is migrated.
- [ ] Remove the old localized page registry after its last consumer is migrated.
- [ ] Remove obsolete page and metadata registries only after consumer searches and tests pass.
- [ ] Remove unused translation namespaces and duplicated English values from `messages/et.json`.
- [ ] Remove unused imports, components, images, and helpers identified by the migration.
- [ ] Update `ARCHITECTURE.md`, `DESIGN.md`, and localization documentation to describe the final system.

## Final verification

- [ ] `npm run lint` passes.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm test` passes.
- [ ] `npm run i18n:parity` passes.
- [ ] `npm run build` passes.
- [ ] `npm run seo:check` reports zero critical issues, errors, and warnings.
- [ ] Every sitemap URL returns 200 without an unintended redirect.
- [ ] Every legacy URL has the approved redirect behaviour.
- [ ] All ET pages display Estonian content.
- [ ] All EN pages display English content.
- [ ] All RU pages display reviewed Russian content.
- [ ] All language switches preserve the same page ID.
- [ ] All forms pass controlled validation and test-delivery checks.
- [ ] All prices and business claims have owner approval.
- [ ] Representative visual-regression checks pass at 390, 768, 1280, and 1440 px.
- [ ] The production preview passes a manual smoke test before deployment.

## Definition of done

The migration is complete when every public page is produced from one typed page definition and one shared page-family template across ET, EN, and RU; no public URL, approved content, design, pricing behaviour, or SEO signal has changed unintentionally; the old hybrid renderers are removed; and the complete verification suite passes.
