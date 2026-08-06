# Multi-model migration orchestration instructions

## Purpose

Use multiple coding models to migrate the SPS Grupp website from the current hybrid page architecture to shared, typed page-family templates across ET, EN, and RU.

This document controls how work is assigned, implemented, reviewed, corrected, and accepted. The implementation backlog is maintained in `PAGE_ARCHITECTURE_MIGRATION_TASKS.md`.

The migration is an architectural refactor. It must not unintentionally change:

- public URLs or redirects;
- approved page text or business claims;
- prices or calculation rules;
- visual design or section order;
- forms or submission behaviour;
- metadata, canonicals, `hreflang`, sitemap entries, or JSON-LD;
- desktop or mobile behaviour;
- the minimum visible font size of 15 px.

## Model roles

### Sol High or XHigh — architect and final reviewer

Use for:

- architecture and schema design;
- registry and routing design;
- metadata and structured-data design;
- the first page-family template;
- complex or ambiguous migrations;
- homepage, blog, forms, database-backed pages, and security-sensitive work;
- independent review of worker changes;
- regression diagnosis when a worker cannot resolve a failure;
- removal of the old hybrid architecture;
- final release review.

Sol must not approve its own implementation without a separate review pass. When possible, use a fresh Sol task or agent for review.

### Terra High — integration engineer

Use for:

- implementing an already approved architecture;
- page-family templates after the schema is defined;
- migrations involving several connected components;
- consolidating repeated components;
- resolving moderate TypeScript, routing, or rendering problems;
- integrating worker output into shared registries;
- preparing a migration batch for Sol review.

### Terra Medium — repeatable migration worker

Use for:

- migrating one well-understood page at a time;
- extracting content into an existing typed schema;
- applying an approved page-family template;
- converting repeated inline sections to existing components;
- adding page-specific tests from established examples;
- correcting concrete review findings;
- running and documenting predefined verification commands.

### Luna Medium — optional high-volume worker

Use only where Luna is available in the active Codex surface.

Use for:

- clear, repetitive page migrations after the pilot is approved;
- content transformation into an established schema;
- applying known template variants;
- structured comparison and checklist completion;
- small, explicitly described corrections.

Do not use Luna as the sole agent for:

- designing the architecture;
- inventing a new template or content schema;
- deciding public URLs;
- changing business claims, prices, translations, or form rules;
- diagnosing broad cross-cutting regressions;
- approving a migration batch;
- final release review.

If Luna cannot be spawned in the current environment, use Terra Medium for its assigned work. Luna task packets may also be executed in separate user-created tasks.

## Required execution order

### Stage 0 — establish a safe baseline

Owner: Terra High  
Reviewer: Sol High

- [ ] Inspect and record the current Git status.
- [ ] Do not reset, stash, overwrite, clean, or commit existing user changes without explicit permission.
- [ ] Create a dedicated migration branch or isolated worktree after the user approves the exact method.
- [ ] Record the starting commit and working-tree state.
- [ ] Run lint, TypeScript, tests, production build, localization parity, and SEO checks.
- [ ] Create route, locale, metadata, section-order, and visual baselines.
- [ ] Confirm that the baseline is sufficient to detect regressions.

Acceptance gate: Sol confirms that the baseline is complete and that migration work can be separated from pre-existing changes.

### Stage 1 — architecture design

Owner: Sol High  
Reviewer: separate Sol High or XHigh pass

- [ ] Define stable page IDs.
- [ ] Define the typed content and section schema.
- [ ] Define page-family types and supported variants.
- [ ] Define the authoritative route and SEO registry.
- [ ] Define the relationship between locale content and layout.
- [ ] Define Server and Client Component boundaries.
- [ ] Define runtime content validation.
- [ ] Define the testing and visual-equivalence strategy.
- [ ] Document how unique page sections are supported without duplicating whole pages.
- [ ] Read the relevant local Next.js 16 documentation before proposing APIs or file structure.

Acceptance gate: the independent reviewer confirms that the design preserves all current behaviour, avoids an oversized generic component, and can represent the known page families.

### Stage 2 — shared foundations

Owner: Terra High or Sol High  
Reviewer: Sol High

- [ ] Implement the approved types and runtime validation.
- [ ] Implement the central page registry.
- [ ] Implement localized path lookup and reverse lookup.
- [ ] Implement metadata, canonical, `hreflang`, breadcrumb, sitemap, and JSON-LD generation.
- [ ] Implement shared section primitives.
- [ ] Add registry, schema, metadata, and route tests.
- [ ] Do not migrate multiple production pages during this stage.

Acceptance gate: all foundation tests pass and Sol confirms that no existing route or SEO behaviour changed unintentionally.

### Stage 3 — office-cleaning pilot

Owner: Terra High or Sol High  
Reviewer: separate Sol High/XHigh pass

- [ ] Migrate only the office-cleaning page ID.
- [ ] Use one typed definition and one template for ET, EN, and RU.
- [ ] Preserve current content, section order, classes, links, images, pricing, form behaviour, and structured data.
- [ ] Compare all three languages at 390, 768, 1280, and 1440 px.
- [ ] Run the complete project verification suite.
- [ ] Document every difference from the baseline.
- [ ] Do not remove the old implementation until equivalence is proven.

Acceptance gate: Sol independently reviews the code diff and rendered pages and approves the pattern for repeated migrations.

### Specialized test-first task — image-aware content-card placement

Owner for characterization and tests: Terra High  
Owner for placement design: Sol High  
Implementation worker: Terra Medium/High  
Reviewer: separate Sol High pass

- [ ] Complete the inventory, baseline screenshots, placement fixtures, and failing tests defined in `PAGE_ARCHITECTURE_MIGRATION_TASKS.md` before production implementation.
- [ ] Do not ask Luna to design the placement algorithm or image metadata schema.
- [ ] Require a pure deterministic placement function, typed focal/protected-region metadata, a safe fallback, and manual editorial overrides.
- [ ] Reject solutions that depend on post-hydration measurement when server-rendered classes and responsive CSS can produce a stable result.
- [ ] Limit the first implementation to one representative content card.
- [ ] Require Sol approval of unit, overlap, locale-length, breakpoint, and visual-regression results before wider rollout.

Acceptance gate: the pilot avoids the declared protected image region, remains stable through hydration, passes all tested viewports and locales, and preserves existing layouts where metadata is absent.

### Stage 4 — repeatable page migrations

Owner: Luna Medium or Terra Medium  
Integrator: Terra High  
Reviewer: Sol High

Migrate pages in the order defined in `PAGE_ARCHITECTURE_MIGRATION_TASKS.md`:

1. Regular-cleaning pages.
2. Outdoor-cleaning pages.
3. Specialist-cleaning pages.
4. Repair and property-maintenance pages.
5. Core and informational pages.
6. Blog pages.
7. Administration and non-public routes.

Worker rules:

- [ ] Migrate one page per worker task unless the integrator explicitly approves a tightly related pair.
- [ ] Use only the approved schema, template, variants, and registry APIs.
- [ ] Do not invent a new architectural pattern.
- [ ] Do not change business content to fit the schema.
- [ ] Do not change a URL, canonical, price, form rule, or translation without an approved decision.
- [ ] Preserve the page's exact section order.
- [ ] Add or update page-specific tests.
- [ ] Complete the per-page checklist from `PAGE_ARCHITECTURE_MIGRATION_TASKS.md`.
- [ ] Stop and report when the existing languages make materially different claims or structures.

Batch size:

- Default batch: one to three completed pages from one page family.
- Maximum batch before Sol review: five pages.
- Reduce the batch to one page for unusual layouts, pricing, forms, dynamic data, or unresolved visual differences.

Acceptance gate: Terra integrates the batch, then Sol reviews the actual combined diff and representative rendered pages.

### Stage 5 — complex pages

Owner: Sol High  
Reviewer: separate Sol High/XHigh pass

Always treat these as complex unless the pilot proves otherwise:

- homepage;
- blog index and blog posts;
- contact and career forms;
- dynamic job-offer pages;
- database-backed testimonials;
- admin authentication and mutations;
- page aliases with similar service names;
- pages with calculators or special pricing;
- pages whose ET, EN, and RU section structures currently differ.

Acceptance gate: independent review covers architecture, functionality, security, localization, SEO, and visual equivalence.

### Stage 6 — remove the hybrid architecture

Owner: Terra High  
Reviewer: Sol High/XHigh

- [ ] Prove that every public page ID uses the new typed system.
- [ ] Search for every consumer of the old renderers and registries.
- [ ] Remove `LocalizedContentPage` only after its last consumer is migrated.
- [ ] Remove the old localized page registry only after its last consumer is migrated.
- [ ] Remove obsolete metadata, path, and page registries only after generated replacements are verified.
- [ ] Remove unused translation namespaces and duplicated content.
- [ ] Remove obsolete templates and components only after import and route checks pass.
- [ ] Update architecture and localization documentation.

Acceptance gate: Sol confirms that no public route depends on the removed system and the complete verification suite passes.

### Stage 7 — final release review

Owner: Sol High or XHigh

- [ ] Review the complete migration diff from the baseline commit.
- [ ] Verify every public page and language in the route inventory.
- [ ] Run lint, TypeScript, unit tests, localization parity, production build, and SEO crawl.
- [ ] Run representative visual regression checks at 390, 768, 1280, and 1440 px.
- [ ] Verify mobile overflow and the 15 px minimum font requirement.
- [ ] Verify language switching, metadata, canonicals, `hreflang`, sitemap, breadcrumbs, and JSON-LD.
- [ ] Verify forms using approved test transport only.
- [ ] Verify calculators and owner-approved pricing rules.
- [ ] Verify that no development or admin page entered the public sitemap.
- [ ] Produce a release report listing passed checks, known differences, unresolved decisions, rollback instructions, and deployment smoke tests.

Acceptance gate: no production deployment until the user approves the release report.

## Agent task packet

Every worker assignment must include all fields below:

```text
TASK ID:
MODEL AND EFFORT:
ROLE: worker / integrator / reviewer

SINGLE OBJECTIVE:
PAGE ID OR COMPONENT:
PAGE FAMILY:

FILES ALLOWED TO CHANGE:
FILES THAT MUST NOT CHANGE:
SHARED FILE OWNERSHIP:

ET URL:
EN URL:
RU URL:

CURRENT CONTENT SOURCE:
TARGET DEFINITION:
TARGET TEMPLATE:
APPROVED VARIANTS:

INVARIANTS:
- URLs and redirects
- text and business claims
- prices
- section order
- visual design and classes
- form behaviour
- metadata and structured data
- minimum 15 px visible text

REQUIRED LOCAL NEXT.JS DOCUMENTATION:
REQUIRED TESTS:
REQUIRED VIEWPORTS:
VERIFICATION COMMANDS:

STOP CONDITIONS:
EXPECTED DELIVERABLE:
```

Assignments without these fields must be clarified before code changes begin.

## Reviewer task packet

Every independent review must include:

```text
REVIEW ID:
REVIEW MODEL AND EFFORT:
BASELINE COMMIT:
CHANGES OR COMMIT TO REVIEW:
PAGE IDS AND URLS IN SCOPE:

REVIEW:
- architecture compliance
- unauthorized scope changes
- TypeScript safety
- Server/Client Component boundaries
- content parity
- visual parity
- mobile behaviour
- accessibility and 15 px minimum font
- URL and language-switching behaviour
- metadata and structured data
- pricing and forms
- tests and missing coverage

REQUIRED COMMANDS:
REQUIRED BROWSER CHECKS:

OUTPUT:
- findings ordered by severity
- exact file and line references
- required corrections
- acceptance or rejection
```

A reviewer must inspect the actual diff and rendered result. A worker summary is not sufficient evidence.

## Shared-file ownership and parallel work

All agents share the same filesystem. Parallel edits can overwrite or combine unpredictably.

- [ ] Only one agent at a time may edit the central registry, shared types, metadata generator, slug map, global styles, navigation, footer, or shared templates.
- [ ] The integrator owns shared-file edits during migration batches.
- [ ] Workers should create or modify page-local definition modules and page-specific tests whenever possible.
- [ ] Workers must not reformat unrelated files.
- [ ] Before each assignment, list allowed files explicitly.
- [ ] Parallel agents may perform read-only audits, test analysis, screenshot comparison, or migrations with disjoint page-local files.
- [ ] Do not run parallel automated rewrites against overlapping directories.
- [ ] If an unexpected external edit appears, stop work on the overlapping file and notify the integrator.

## Review severity

- **Critical:** broken build, route loss, data loss risk, security regression, form misdelivery, or incorrect pricing logic. The batch is rejected.
- **High:** wrong language, URL, canonical, `hreflang`, content claim, section order, or major visual regression. The batch is rejected.
- **Medium:** maintainability defect, missing test, accessibility regression, mobile defect, or inconsistent template use. Correct before acceptance unless explicitly deferred.
- **Low:** non-functional cleanup or documentation issue. May be scheduled separately if it does not hide a broader problem.

## Correction loop

1. Reviewer records exact findings with files and evidence.
2. Integrator assigns each correction to the original worker or an appropriate stronger model.
3. The correction task changes only the finding's scope.
4. The failed check is rerun first.
5. The full batch checks are rerun after the focused check passes.
6. The same reviewer or an equivalent higher model performs re-review.
7. A batch may be accepted only after all Critical and High findings and all non-deferred Medium findings are resolved.

Escalate from Luna Medium to Terra High or Sol High when:

- the same failure recurs twice;
- the required change crosses page-family boundaries;
- ET, EN, and RU differ structurally or semantically;
- the worker proposes a new schema or template variant;
- the change touches routing, metadata generation, pricing, forms, authentication, database access, or global styles;
- visual equivalence cannot be established confidently.

## Mandatory verification commands

Run focused checks during individual tasks and the full set at review gates:

```powershell
npm run lint
npx tsc --noEmit
npm test
npm run i18n:parity
npm run build
npm run seo:check
```

Do not run `npm run seo:check` before a successful production build exists.

Browser checks must cover the affected ET, EN, and RU URLs at the required widths and verify:

- section order;
- visible content;
- navigation and language switching;
- forms or calculators where present;
- horizontal overflow;
- text size;
- console errors from the current page load;
- metadata and structured data where applicable.

## Decisions requiring user approval

Agents must not decide these independently:

- changing a public URL or redirect;
- changing a canonical URL;
- adding, removing, merging, splitting, or reordering visible sections;
- changing a business claim, price, unit, limit, or included service;
- materially rewriting ET, EN, or RU copy;
- changing form requiredness, recipients, consent, or submission behaviour;
- changing the visible design beyond correcting a verified defect;
- removing a public page;
- deploying to production.

Record blocked decisions with the current behaviour, options, recommendation, impact, and affected pages. Continue with unrelated work.

## Completion criteria

The orchestration is complete only when:

- every public page has passed its migration checklist;
- ET, EN, and RU use the same typed page-family implementation for each page ID;
- the old hybrid renderers and registries have no remaining consumers and are removed;
- all required automated and browser checks pass;
- Sol High/XHigh has completed the final independent review;
- the release report identifies no unresolved Critical or High findings;
- the user has approved any intentional changes and the production release.
