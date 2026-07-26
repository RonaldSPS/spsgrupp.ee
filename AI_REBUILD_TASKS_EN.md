# AI Work Instructions: Technical Rebuild of the SPS Grupp Website in a Separate Directory

## 0. Purpose of this document

This document is intended to be executed by an AI development agent.

The task is to create a technically improved version of the existing SPS Grupp website in a new, separate directory. The existing design, visible page structure, order of content sections, and user functionality must be preserved. Improvements to the technical architecture, translation management, reliability, SEO signals, URLs, pricing logic, form validation, and verified defects are permitted and required.

This is not a redesign. This is not a change in content strategy. This is not permission to replace the existing website with a new visual template or a new brand language.

## 0.1. Expected capability of the executing model

These instructions assume that the implementation will be carried out by a lower-capability language model. Therefore:

- do not infer missing requirements;
- do not make several logical changes at the same time;
- do not assume that code is correct merely because it compiles;
- do not generalise the result from one page to the entire website;
- do not mark a task complete before all of its checks have passed;
- reproduce the existing visible solution exactly, based on evidence rather than memory or taste;
- use before-and-after evidence in every work cycle.

If a requirement, data source, or intended result is ambiguous:

1. add the question to `MIGRATION_DECISIONS.md`;
2. describe the current situation;
3. describe two possible solutions;
4. identify one option as the reasoned recommendation;
5. stop only the work that depends on that decision;
6. continue with independent tasks;
7. ask the user for approval before implementing a change that affects the visible result, a URL, or business logic.

## 0.2. Maximum scope of one work cycle

One work cycle may change only one of the following:

- one registry;
- one data schema;
- one helper function;
- one shared component;
- one page in one language;
- the metadata logic for one page;
- one URL or redirect rule;
- one pricing rule;
- one validation rule in one form;
- one mobile-layout defect;
- one related group of tests.

The following are prohibited within a single work cycle:

- migrating several service pages at once;
- changing the URL, content, design, and pricing logic at the same time;
- running a project-wide search-and-replace migration;
- deleting an old application path in the same cycle in which the new path was introduced;
- fixing an unrelated defect discovered during verification in the same change;
- modifying files that were not listed at the beginning of the work cycle.

If verification reveals a new, unrelated defect, add it to `REBUILD_BACKLOG.md` as a separate task.

## 0.3. Mandatory work-cycle template

Before modifying code, add the following to `REBUILD_PROGRESS.md`:

```text
Work cycle ID:
Single objective:
Files to be modified:
Files and behaviour that will not be modified:
Source-version evidence:
Expected result:
Verification command:
URLs and viewport widths for visual verification:
Rollback method:
Status: NOT STARTED
```

After the change, complete the same work-cycle entry:

```text
Actual result:
Modified files:
Passed checks:
Failed checks:
Deviations from the expected result:
Did the visual result change: YES/NO
Did the text change: YES/NO
Did a URL or SEO signal change: YES/NO
Is it now safe to remove the old solution: YES/NO
Status: COMPLETE / BLOCKED / REVERTED
```

`COMPLETE` is permitted only when all previously defined checks have passed.

## 0.4. Stop rules for a lower-capability model

Stop the dependent work and ask the user for a decision if:

- it is impossible to determine which of two prices is correct;
- the change would affect a company promise, the scope of a service, or a contractual term;
- the existing language versions make materially different claims;
- natural Russian wording would change the meaning of a claim;
- changing a URL requires choosing between several reasonable canonical solutions;
- the source and target versions look different and no direct technical reason can be found;
- the fix would require adding, removing, or reordering a section;
- a test fails three times for the same reason;
- an unexpected change appears in the source project;
- a required secret, external service, or database cannot be accessed safely.

Do not stop the entire project if only one page or one decision is blocked.

## 0.5. Decision priority

If two instructions appear to conflict, use this priority order:

1. the user's most recent direct instruction;
2. `AGENTS.md`;
3. the prohibitions and acceptance criteria in this file;
4. facts verified in the audit;
5. the rendered source version;
6. the source code;
7. other project documentation;
8. the model's own assumption.

A lower-priority source must not override a higher-priority requirement.

## 0.6. Prohibited vague actions

Convert a vague task into a measurable task before beginning work.

Prohibited:

- “fix SEO”;
- “clean up the translations”;
- “fix responsiveness”;
- “refactor the service pages”;
- “fix the prices”;
- “clean up the code”.

Permitted form:

- “make the office-cleaning ET canonical registry-based and verify the exact URL”;
- “replace the three literal translations identified by the audit on the RU office-cleaning page without changing the claims”;
- “remove the pricing card's horizontal overflow at 390 px without changing the desktop layout”;
- “add a calculator test that confirms the 800 m² lower limit under the current business rule”;
- “remove the old slug map only after searching for every consumer and passing the equivalence test”.

## 1. Mandatory source and target locations

### 1.1. Source project

```text
D:\WORKS\SPS\2026AprillWeb\AprilBuild
```

Treat the source project as an audited reference.

### 1.2. New target project

```text
D:\WORKS\SPS\2026AprillWeb\AprilBuild-Rebuild
```

The target project must be a sibling of the source project, not a subdirectory inside it.

Reasons:

- a nested Next.js project may accidentally fall within the source project's build, Tailwind, TypeScript, or file-discovery scope;
- a sibling directory allows the source and target versions to run in parallel;
- visual and functional regression can be compared between two separate servers;
- the source project does not need to be modified during migration.

## 2. Most important constraints

### 2.1. Do not modify the source project

In the source project, the AI must not:

- modify any source-code file;
- format files;
- run an automatic `--fix` action;
- delete or move files;
- install or update dependencies;
- modify `.env.local`;
- modify the database;
- modify Vercel settings;
- modify the public production website;
- write new logs into the source project when this can be avoided;
- create a commit in the source project;
- clean the source project's working tree.

Existing changes in the source project belong to the user. Do not reset, stash, commit, overwrite, or otherwise alter them.

### 2.2. Do not change the design

Preserve:

- colours;
- fonts;
- font weights;
- a minimum text size of 15 px;
- section backgrounds;
- hero images;
- image placement;
- card design;
- button styles;
- navigation appearance;
- footer appearance;
- existing animations unless they cause an accessibility or reliability defect;
- the overall desktop and mobile visual identity;
- the visual order of page sections.

Permitted design corrections are limited to verified defect fixes:

- fitting an element that extends outside the viewport;
- removing horizontal overflow;
- correcting unreadable contrast with the smallest possible change;
- correcting broken line wrapping;
- adding a focus style;
- ensuring a minimum 44 × 44 px touch target;
- adding `prefers-reduced-motion` support;
- adding missing alt text or semantic markup.

If a correction would visibly alter the composition, describe it in `MIGRATION_DECISIONS.md` and obtain user approval before implementing it.

### 2.3. Do not change the content structure

Without separate user approval, do not:

- add new marketing sections;
- remove existing content sections;
- change the order of sections;
- change the primary purpose of a page;
- merge different services into one page;
- split one service into several new public pages;
- change the business purpose of CTAs;
- replace the current copy with a new marketing concept;
- change the selection of blog topics.

Permitted content corrections:

- spelling corrections;
- grammar corrections;
- removal of mixed-language text;
- rewriting an obvious literal translation into natural language;
- correcting an incorrect service name;
- correcting an incorrect unit or price format;
- correcting a verified logic error;
- flagging an outdated or contradictory fact as requiring a decision;
- correcting an SEO title without changing the page's meaning;
- correcting a broken link or anchor.

### 2.4. Do not assume business decisions

The AI must not independently decide:

- whether €1.20/m² is the actual current starting price;
- whether the price includes VAT;
- whether 800 m² is an absolute minimum;
- whether the calculator's 10,000 m² upper limit is intentional;
- whether the company started in 2006 or 2007;
- whether the outdoor-cleaning canonical should use the short or long URL;
- whether the telephone field must be required in the contact form;
- whether the work region must be required in the job-application form;
- whether a historical blog post should be removed;
- whether Russian URLs may be renamed in production.

Add these questions to `MIGRATION_DECISIONS.md`, including:

- the current situation;
- the contradiction found;
- the recommended option;
- an alternative;
- the impact;
- the required user decision.

Work may continue in areas that are not blocked by the decision.

## 3. Mandatory reference documents

Read the following documents completely before beginning changes:

```text
D:\WORKS\SPS\2026AprillWeb\AprilBuild\AGENTS.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\ARCHITECTURE.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\DESIGN.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\TRANSLATIONS.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\i18n-plan.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\LIVE_URL_I18N_SEO_TASKS.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\AI_REBUILD_TASKS_EN.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\raportid\veebilehe-sisu-keelte-hindade-vormide-mobiili-ja-seo-audit-2026-07-25.md
```

Before writing Next.js code, read the relevant local guides for the version used by the target project under:

```text
node_modules/next/dist/docs/
```

At minimum:

- App Router project structure;
- Server and Client Components;
- internationalisation;
- metadata;
- sitemap;
- redirects;
- Proxy;
- dynamic routes;
- the testing guides relevant to the chosen tools.

Do not write Next.js APIs from memory when the topic exists in the project's local documentation.

Documentation procedure for a lower-capability model:

1. select only the Next.js topic required for the current work cycle;
2. read the relevant local document completely before changing code;
3. record its exact file path in `REBUILD_PROGRESS.md`;
4. state in one sentence which rule will be applied in the current change;
5. verify that any example matches the project's actual Next.js version and the App Router;
6. do not copy a documentation example blindly; adapt only the necessary part to the existing architecture;
7. if the local documentation and the existing code differ, document the difference before changing code.

It is not necessary to reread every Next.js document at the start of every work cycle. Read the document relevant to that cycle in full and maintain a register of documents already read.

## 4. Workflow and evidence

### 4.1. Divide the work into verifiable stages

At the end of each stage:

- run lint;
- run TypeScript checking or the build;
- run the relevant tests;
- compare the source and target applications;
- update `REBUILD_PROGRESS.md`;
- describe deviations;
- do not proceed if the stage's acceptance criteria are not met.

### 4.2. Control files to create in the new project

Create the following in the target-project root:

```text
REBUILD_PROGRESS.md
MIGRATION_DECISIONS.md
VISUAL_DIFFERENCES.md
CONTENT_CORRECTIONS.md
URL_MIGRATION_MAP.md
TEST_RESULTS.md
```

Their purposes:

- `REBUILD_PROGRESS.md` — completed and pending tasks;
- `MIGRATION_DECISIONS.md` — questions that require a user decision;
- `VISUAL_DIFFERENCES.md` — every permitted or unavoidable visual difference;
- `CONTENT_CORRECTIONS.md` — every text or translation correction in before/after form;
- `URL_MIGRATION_MAP.md` — canonicals and redirects;
- `TEST_RESULTS.md` — results of builds, tests, crawling, and browser checks.

### 4.3. Traceability of changes

Every material change must be justified by at least one of:

- a verified defect in the source project;
- a defect described in the audit;
- a requirement in the local Next.js documentation;
- an accessibility requirement;
- a reliability problem;
- a user-approved decision.

Do not make a change solely because “it looks cleaner”.

## 5. Stage 1 — safe inventory of the source project

### Tasks

- [ ] Verify the absolute path of the source project.
- [ ] Check the source project's Git status.
- [ ] Record a summary of the Git status without changing it.
- [ ] Read `package.json`.
- [ ] Identify the exact Next.js, React, and `next-intl` versions.
- [ ] Identify the Node.js version.
- [ ] List every public App Router route.
- [ ] List every API route.
- [ ] List admin routes.
- [ ] List variant and tool pages that must not be included in the public sitemap.
- [ ] List every `page.tsx`, `layout.tsx`, `route.ts`, `not-found.tsx`, `robots.ts`, and `sitemap.ts` file.
- [ ] List all public images and other static assets.
- [ ] Identify all data sources:
  - JSON;
  - database;
  - Vercel Blob;
  - environment variables;
  - generated TypeScript;
  - WordPress migration data.
- [ ] List all forms and their Server Actions.
- [ ] List all pricing sources.
- [ ] List all language files.
- [ ] List all URL and metadata registries.
- [ ] Identify all duplicate routes.
- [ ] Identify every page that uses `"use client"`.
- [ ] Mark which of them genuinely require browser state or events.
- [ ] Save the inventory in `REBUILD_PROGRESS.md`.

### Verification

- [ ] No source file was modified.
- [ ] Every public route is included in the inventory.
- [ ] Every data source is documented.

## 6. Stage 2 — baseline of the rendered source version

### Objective

Before technical reconstruction, record how the website actually looks and behaves. Copying source code alone is not sufficient.

### Tasks

- [ ] Run the source application on a separate port, preferably `3001`.
- [ ] Do not accidentally use a server from another project as the reference.
- [ ] Read the sitemap.
- [ ] Save the list of sitemap URLs.
- [ ] Open every sitemap URL with a controlled crawler.
- [ ] Record for each URL:
  - status;
  - final URL;
  - redirect;
  - title;
  - description;
  - canonical;
  - `hreflang`;
  - `html lang`;
  - H1 count and text;
  - list of internal links;
  - number of forms;
  - load time.
- [ ] Record timeouts separately; do not automatically classify them as 404.
- [ ] Take screenshots of representative page templates.
- [ ] Take screenshots at:
  - 320 px;
  - 360 px;
  - 390 px;
  - 768 px;
  - 1024 px;
  - 1440 px.
- [ ] At minimum, capture the following pages in all languages:
  - homepage;
  - regular-cleaning main page;
  - office cleaning;
  - post-construction cleaning;
  - outdoor-cleaning main page;
  - one page with a long Russian heading;
  - repair-services main page;
  - contact;
  - careers;
  - blog;
  - reviews;
  - privacy;
  - 404.
- [ ] Record the visible order of sections for each page template.
- [ ] Record navigation behaviour.
- [ ] Record mobile-menu behaviour.
- [ ] Record form field names, labels, and required states.
- [ ] Record calculator outputs at boundary values.

### Verification

- [ ] The baseline is sufficient to prove the target application's visual equivalence later.
- [ ] Baseline files exist only in the target project's test or artefact directory.

## 7. Stage 3 — creation of the target directory and safe copy

### Safety check before creation

- [ ] Resolve the target path to an absolute path.
- [ ] Verify that the target path is exactly:

```text
D:\WORKS\SPS\2026AprillWeb\AprilBuild-Rebuild
```

- [ ] Verify that the target path is not inside the source project.
- [ ] Check whether the target directory already exists.
- [ ] If the target directory contains files, stop and ask the user for instructions.
- [ ] Do not automatically delete or empty an existing target directory.

### Items to copy

- [ ] Copy the application source code.
- [ ] Copy `public`.
- [ ] Copy required `data` files.
- [ ] Copy the Drizzle schema and migrations.
- [ ] Copy required scripts.
- [ ] Copy documentation.
- [ ] Copy `package.json` and the lockfile.
- [ ] Copy TypeScript, ESLint, PostCSS, and Next.js configuration.
- [ ] Copy `.env.local.example`.
- [ ] Copy `.gitignore`.
- [ ] Create a new `AGENTS.md` that includes at least:
  - the requirement to read local Next.js guides;
  - the minimum 15 px font-size requirement;
  - the prohibition against changing the design;
  - the requirement to leave the source project untouched.

### Do not copy

- [ ] Do not copy `.git`.
- [ ] Do not copy `.next`.
- [ ] Do not copy `node_modules`.
- [ ] Do not copy log files.
- [ ] Do not copy build artefacts.
- [ ] Do not copy `tsconfig.tsbuildinfo`.
- [ ] Do not automatically copy the real `.env.local`.
- [ ] Do not copy passwords, keys, or other secrets.
- [ ] Do not copy unnecessary temporary backups.

### Environment

- [ ] Create `.env.local` only from values supplied by the user or values safe for local testing.
- [ ] Do not print environment-variable values in logs.
- [ ] Use a test email destination or block sending until form-testing permission is provided.
- [ ] Do not connect to the production database with write access during migration.

### Verification

- [ ] The target project installs dependencies cleanly.
- [ ] The initial copy builds before architecture changes.
- [ ] The Git status of the source project has not changed.

## 8. Stage 4 — initial startup of the target project

### Tasks

- [ ] Install dependencies according to the lockfile.
- [ ] Run lint.
- [ ] Run TypeScript checking.
- [ ] Run a production build.
- [ ] Run the target application on another port, preferably `3100`.
- [ ] Compare the main pages of the source and target applications.
- [ ] Verify that all public assets load.
- [ ] Verify fonts.
- [ ] Verify CSP.
- [ ] Verify form rendering without real submission.
- [ ] Verify read-only API responses.
- [ ] Document initial differences.

### Stop condition

Do not begin architecture changes if the clean copy does not build or if its rendered result differs from the source version for an unknown reason.

## 9. Stage 5 — baseline automated testing

### Tasks

- [ ] Use a testing solution supported by the documentation for the project's Next.js version.
- [ ] Add Playwright E2E tests.
- [ ] Add unit tests for pure TypeScript functions.
- [ ] Add a route inventory test.
- [ ] Add an internal-link crawler.
- [ ] Add metadata verification.
- [ ] Add visual regression testing.
- [ ] Add a mobile-overflow test.
- [ ] Add a minimum-font-size test.
- [ ] Add a form-field schema test.
- [ ] Add pricing tests.
- [ ] Add translation-schema tests.
- [ ] Add a duplicate-canonical test.
- [ ] Add a mixed-alphabet Russian-slug test.
- [ ] Add a test that every sitemap URL returns 200.

### Minimum test scope

Test every public page template in:

- ET;
- EN;
- RU;
- mobile;
- desktop.

### Verification

- [ ] Tests detect at least the current defects described by the audit.
- [ ] Visual tests do not approve an unreviewed mass change.

## 10. Stage 6 — consolidate the architecture without changing visible output

### Objective

Clarify code responsibilities while preserving the rendered design and the order of content sections.

### Important principle

Do not force every page into one universal template if doing so changes the current DOM, appearance, or section structure. Several typed page templates are allowed.

Recommended templates:

- `home`;
- `regular-cleaning`;
- `special-cleaning`;
- `outdoor-service`;
- `repair-service`;
- `category`;
- `company`;
- `contact`;
- `career`;
- `privacy`;
- `custom`.

### Tasks

Complete the following subcycles in this exact order. Every numbered item is a separate work cycle with the documentation and verification required by section 0.3.

1. [ ] Create only a `Locale` type with the values `et`, `en`, and `ru`; add a type check; do not change routes.
2. [ ] Create only a stable `PageId` type; add a test that prevents duplicate IDs; do not change rendering.
3. [ ] Define only a `PageDefinition` schema with:
   - ID;
   - page type;
   - parent ID;
   - ET URL;
   - EN URL;
   - RU URL;
   - content module;
   - template;
   - form type;
   - sitemap priority;
   - indexing status.
4. [ ] Add runtime validation or an explicit test that detects a missing locale URL, invalid parent ID, and duplicate URL.
5. [ ] Add only the office-cleaning page family to the new registry: its category, service page, and three locale URLs.
6. [ ] Add an equivalence test comparing the new office-cleaning registry values with the existing data sources.
7. [ ] Create the route resolver only as a pure function; test ET, EN, RU, an unknown URL, and duplicate detection; do not connect it to a route yet.
8. [ ] Create a pure function for finding a language URL; test all six language-switch directions on the office-cleaning page.
9. [ ] Create a pure parent-hierarchy function; test the service → category → homepage chain and cycle detection.
10. [ ] Create a pure canonical resolver; verify each locale's self-canonical.
11. [ ] Create a pure `hreflang` alternatives function; verify `et`, `en`, `ru`, and the agreed `x-default`.
12. [ ] Create a pure breadcrumb function; verify text, order, and locale URLs.
13. [ ] Connect the new registry only to office-cleaning metadata generation; compare title, description, canonical, and alternatives.
14. [ ] Connect the new registry only to the office-cleaning sitemap entry; verify that the old and new paths do not create a duplicate.
15. [ ] Connect the office-cleaning route to the new resolver while preserving the same rendered DOM, content, and URL.
16. [ ] Run visual and functional regression checks for office cleaning in ET, EN, and RU.
17. [ ] Present the pilot result to the user. Do not migrate another page before the pilot's technical solution has been reviewed.

After the pilot, migrate each subsequent registry entry separately using this 13-step check:

1. [ ] assign one stable page ID;
2. [ ] define the page type and parent ID;
3. [ ] enter the exact existing ET, EN, and RU URLs;
4. [ ] verify the actual response of all three URLs in the source version;
5. [ ] define the content module and template without changing section order;
6. [ ] define the form type, sitemap priority, and indexing status;
7. [ ] run schema and duplicate tests;
8. [ ] run the equivalence test between the old and new data sources;
9. [ ] verify route resolution, language switching, and parent hierarchy;
10. [ ] verify canonical, `hreflang`, breadcrumb, and sitemap;
11. [ ] compare ET, EN, and RU rendering on desktop;
12. [ ] compare ET, EN, and RU rendering on mobile;
13. [ ] mark the old registry entry as removable only when a code search finds no remaining old consumers.

Consolidate `page-registry`, `slug-map`, `localized-content`, and the metadata registry only one page at a time. Do not remove the old registry before all of its consumers have been migrated and the temporary equivalence tests pass.

### Server/client boundary

- [ ] Keep static page sections as Server Components.
- [ ] Do not add `"use client"` to a whole page merely because one child component is interactive.
- [ ] Isolate only the following as client components:
  - calculator;
  - FAQ accordion;
  - form;
  - mobile menu;
  - interactive carousel;
  - another section that genuinely requires browser state.
- [ ] Check hydration after every boundary change.

### Verification

- [ ] The visual difference between source and target pages remains within the permitted tolerance.
- [ ] The number and order of sections do not change.
- [ ] Text does not change during this stage.
- [ ] URLs do not change during this stage.

## 11. Stage 7 — organise content sources

### Objective

Avoid a situation in which Estonian content exists in JSX, a second Estonian copy exists in JSON, and EN/RU use a third path.

### Tasks

- [ ] Separate short UI text from long page content.
- [ ] Keep the following in `next-intl` messages:
  - navigation;
  - form labels;
  - buttons;
  - validation;
  - general UI messages;
  - shared footer text.
- [ ] Move long service content into typed content modules.
- [ ] Create ET, EN, and RU content with the same schema for every page.
- [ ] Preserve the currently visible ET content as the source of truth.
- [ ] Do not automatically treat English service blocks in `et.json` as valid ET content.
- [ ] Compare each ET content module with the rendered Estonian source page.
- [ ] Preserve every existing content section.
- [ ] Preserve section order.
- [ ] Preserve images and alt text, correcting only verified defects.
- [ ] Replace `item0Title`-style structures with real arrays only when rendering remains identical.
- [ ] Avoid storing raw HTML in JSON strings.
- [ ] If rich text is unavoidable, use a restricted and safe renderer.
- [ ] Remove `dangerouslySetInnerHTML` where content can be structured.
- [ ] Add a report of unused translation keys.
- [ ] Add a missing-translation test.
- [ ] Add a test for unjustifiably identical long ET/EN values.

### Pilot

- [ ] Migrate one service first, preferably office cleaning.
- [ ] Compare ET, EN, and RU rendering.
- [ ] Confirm that the design did not change.
- [ ] Confirm that the section order did not change.
- [ ] Migrate the remaining services only after the pilot succeeds.

## 12. Stage 8 — URLs, canonicals, redirects, and hierarchy

### Tasks

- [ ] Create `URL_MIGRATION_MAP.md`.
- [ ] List all currently functioning URLs for every content item.
- [ ] Record the current canonical.
- [ ] Record the recommended canonical.
- [ ] Mark choices that require user approval.
- [ ] Resolve the duplicate short and long outdoor-service URLs.
- [ ] Resolve the reverse-direction snow-cleaning redirect.
- [ ] Correct internal links so that they point directly to final URLs.
- [ ] Do not leave internal links behind an intermediate 308.
- [ ] Generate canonical URLs from the central registry.
- [ ] Generate `hreflang` from the central registry.
- [ ] Generate the sitemap from the central registry.
- [ ] Generate breadcrumbs from parent relationships in the central registry.
- [ ] Add a visible semantic breadcrumb only where one exists in the current design or where its addition has user approval.
- [ ] Add JSON-LD breadcrumbs without changing the visible design.
- [ ] Correct Russian slugs only after user approval.
- [ ] Add a single 308 from each old Russian slug to the corresponding new one.
- [ ] Preserve required query parameters in redirects.
- [ ] Avoid redirect chains and loops.
- [ ] Verify that `redirects` runs before Proxy logic according to the documentation for the installed Next.js version.

### Verification

- [ ] Every content item has exactly one canonical.
- [ ] No canonical redirects.
- [ ] The sitemap contains only canonical URLs.
- [ ] Every sitemap URL returns 200 directly.
- [ ] `hreflang` relationships are reciprocal.
- [ ] Language switching preserves the same Page ID.
- [ ] The parent–child relationship is machine-readable.

## 13. Stage 9 — Estonian content review

### Tasks for every page

- [ ] Read the complete rendered page.
- [ ] Compare the old and new visible text.
- [ ] Preserve the approved meaning and section structure.
- [ ] Correct only:
  - spelling mistakes;
  - declension errors;
  - punctuation;
  - inconsistent terminology;
  - verified factual contradictions;
  - incorrect price or unit formatting.
- [ ] Document every correction in `CONTENT_CORRECTIONS.md`.
- [ ] Flag the contradiction concerning the age of the company for a decision.
- [ ] Flag the 2006/2007 contradiction for a decision.
- [ ] Flag the service-area contradiction for a decision.
- [ ] Flag the meaning of the 800 m² limit for a decision.
- [ ] Verify consistent Estonian use of “grafiti/graffiti”.
- [ ] Review every CTA.
- [ ] Review every FAQ answer.
- [ ] Review titles and descriptions.

### Verification

- [ ] An Estonian page contains no English content passages.
- [ ] UI words are in Estonian.
- [ ] Company facts do not contradict one another.

## 14. Stage 10 — English content review

### Tasks for every page

- [ ] Read the complete page in English.
- [ ] Preserve the same meaning and section structure.
- [ ] Correct grammar.
- [ ] Correct literal Estonian sentence structure.
- [ ] Standardise service terminology.
- [ ] Correct `plating` if the actual service is `tiling`.
- [ ] Correct `plastering` if the actual service is tiling.
- [ ] Verify the meanings of `cleaning`, `maintenance`, `sanitation`, `specialist cleaning`, and `grounds maintenance`.
- [ ] Review titles.
- [ ] Review meta descriptions.
- [ ] Review CTAs.
- [ ] Review currency and unit formatting.
- [ ] Verify that an English title is not in Estonian.
- [ ] Document every content change.

### Verification

- [ ] The English text reads like original B2B English.
- [ ] Its meaning matches the Estonian source version.
- [ ] The page structure has not changed.

## 15. Stage 11 — dedicated Russian content review

### Principle

Do not approve Russian text based only on machine translation or keyword checks. Read it in the context of the complete page.

### Tasks for every page

- [ ] Read the complete page in Russian.
- [ ] Preserve the same meaning and section structure.
- [ ] Write the H1 as one complete Russian phrase.
- [ ] Do not automatically concatenate English `title + subtitle` fields.
- [ ] Correct declension.
- [ ] Correct word order.
- [ ] Correct terminology.
- [ ] Remove literal English constructions.
- [ ] Replace `Большой сайт` with wording that refers to a large facility.
- [ ] Correct `Пользовательский` when it is intended to mean a custom price.
- [ ] Correct `цитата` when it is intended to mean a quotation or price offer.
- [ ] Correct `профилактическая уборка` when regular maintenance cleaning is intended.
- [ ] Correct `площадь пола` when the area of premises is intended.
- [ ] Correct the duplicated `с` in the contact-page H1.
- [ ] Correct the incorrect `Интерьеры` title on the outdoor-services main page.
- [ ] Correct Russian-page titles that remain in Estonian.
- [ ] Remove `№1 в Эстонии` or obtain approval for it.
- [ ] Use the Russian unit `м²`.
- [ ] Use consistent Russian decimal formatting.
- [ ] Verify grammatically neutral use of the company name.
- [ ] Verify that CTAs sound natural.
- [ ] Review form text.
- [ ] Review server error messages.
- [ ] Document every before/after correction.
- [ ] Where possible, obtain final approval from a native Russian B2B editor.

### Verification

- [ ] Russian pages contain no Estonian marketing copy.
- [ ] Russian pages contain no accidental English service content.
- [ ] Each H1 is a grammatically complete phrase.
- [ ] Each title describes the correct service.
- [ ] URLs are neither truncated nor mixed-alphabet.

## 16. Stage 12 — technical organisation of pricing

### Tasks

- [ ] Inventory every price in:
  - TypeScript constants;
  - JSON;
  - JSX;
  - FAQ;
  - pricing cards;
  - calculator;
  - structured data.
- [ ] Create a numeric pricing model for every priced service.
- [ ] Store numbers as data, not translated text.
- [ ] Use `Intl.NumberFormat`.
- [ ] Use the correct decimal separator for each locale.
- [ ] Keep `currency: EUR`.
- [ ] Add an explicit VAT status after the user's decision.
- [ ] Preserve the current calculator design.
- [ ] Preserve the calculator's current location on the page.
- [ ] Correct calculation logic without changing the design.
- [ ] Tell the user when a result is only an indicative minimum price.
- [ ] Do not present a single-input calculator as an exact quotation when price depends on frequency and facility type.
- [ ] Flag business rules that cannot be established from the code.
- [ ] Resolve the post-construction-cleaning contradiction:
  - up to 200 m² / €350;
  - 200–1,000 m² / €800;
  - €1.5–3.0/m².
- [ ] Remove the overlap in area ranges after the business rule is approved.
- [ ] Add “starting from” when a price is not fixed.
- [ ] Test:
  - minimum;
  - maximum;
  - step;
  - value below the boundary;
  - value above the boundary;
  - non-linear or invalid input.

### Verification

- [ ] Every example calculation is mathematically correct.
- [ ] No FAQ or pricing card contradicts the model.
- [ ] ET, EN, and RU show the same numeric value in the correct locale format.

## 17. Stage 13 — technical correction of forms

### General requirements

- [ ] Preserve the current visual appearance of the forms.
- [ ] Preserve the current position of each form.
- [ ] Preserve existing fields unless the user decides otherwise.
- [ ] Do not send a real request during migration testing without permission.
- [ ] Use a test inbox or mocked transport.

### Contact form

- [ ] Verify client-side `required` attributes.
- [ ] Verify server validation.
- [ ] Verify name length.
- [ ] Verify email.
- [ ] Verify telephone.
- [ ] Verify consent.
- [ ] Verify file extension.
- [ ] Verify MIME type.
- [ ] Verify magic bytes.
- [ ] Verify file size.
- [ ] Verify rate limiting.
- [ ] Verify duplicate submission handling.
- [ ] Verify every error message in all three languages.
- [ ] Verify that the privacy link points directly to its final URL.
- [ ] Decide with the user whether telephone and description must be required.

### Job-application form

- [ ] Document the missing name-field problem.
- [ ] Document the absence of CV upload.
- [ ] Document that region is not required.
- [ ] Document that working time is not required.
- [ ] Document the default full-time selection.
- [ ] Add or change fields only after user approval because this changes the visible form.
- [ ] Regardless of the visible-form decision, validate permitted values on the server.
- [ ] Check unknown `region`, `workload`, and `work_time` values.
- [ ] Verify localised email content.

### Verification

- [ ] Browser and server validation do not contradict one another.
- [ ] A page in one language never displays a server error in another language.
- [ ] No test sends a real customer request.

## 18. Stage 14 — blog and review-page reliability

### Tasks

- [ ] Reproduce the `/blog/` timeout in a controlled environment.
- [ ] Reproduce the `/sps-grupp/arvamused/` timeout.
- [ ] Identify which database query is waiting.
- [ ] Add a bounded query timeout.
- [ ] Add a fast, deterministic fallback.
- [ ] Do not wait indefinitely before using the fallback after a database network failure.
- [ ] Use static content as the primary source if it matches current business logic.
- [ ] Merge database changes only if the database responds within the agreed time.
- [ ] Log fallback use without secrets or personal data.
- [ ] Add a test that disconnects the database.
- [ ] Require both blog and reviews pages to respond using the fallback.
- [ ] Clean invalid blog HTML.
- [ ] Correct an opening `<h2>` closed with `</h3>`.
- [ ] Replace the `#kysipakkumist` fragment with the current form ID.
- [ ] Point internal links to canonical URLs.
- [ ] Review old `http://` links.
- [ ] Do not substantively rewrite historical articles.
- [ ] Clearly date historical prices and salary information if approved by the user.

### Verification

- [ ] The blog responds during a database failure.
- [ ] The reviews page responds during a database failure.
- [ ] The fallback does not change the page design.
- [ ] Invalid imported HTML does not break the DOM.

## 19. Stage 15 — mobile and accessibility defect correction

### Tasks

- [ ] Test every page template at 320 px.
- [ ] Test at 360 px.
- [ ] Test at 390 px.
- [ ] Test at 430 px.
- [ ] Test at 768 px.
- [ ] Test at 1024 px.
- [ ] Test at 1440 px.
- [ ] Measure `documentElement.scrollWidth`.
- [ ] Identify the actual element causing overflow.
- [ ] Do not use global `overflow-x: hidden` as the sole fix.
- [ ] Correct the effect of the decorative 800 px element.
- [ ] Correct mobile overflow on the post-construction-cleaning page.
- [ ] Correct mobile overflow on the Russian homepage.
- [ ] Correct the hero telephone button extending outside the viewport at 320 px.
- [ ] Preserve the button's visual style.
- [ ] If necessary, allow the CTA row to wrap consistently with the existing design.
- [ ] Verify wrapping of long Russian words.
- [ ] Verify the mobile menu.
- [ ] Verify file inputs.
- [ ] Verify pricing cards.
- [ ] Verify the footer.
- [ ] Verify carousels.
- [ ] Verify hero contrast.
- [ ] Make only a minimal overlay change if contrast does not meet the requirement.
- [ ] Verify a minimum 15 px font size.
- [ ] Verify minimum 44 × 44 px touch targets.
- [ ] Add a visible keyboard focus style.
- [ ] Verify heading hierarchy.
- [ ] Verify `aria-label`, `aria-live`, and form errors.
- [ ] Add reduced-motion support.

### Verification

- [ ] No page scrolls horizontally.
- [ ] No interactive element is partially outside the viewport.
- [ ] The design is unchanged except for documented defect corrections.

## 20. Stage 16 — SEO and structured data

### Tasks

- [ ] Generate title from the central content source.
- [ ] Generate description from the central content source.
- [ ] Generate canonical from the central registry.
- [ ] Generate Open Graph metadata.
- [ ] Generate Twitter metadata.
- [ ] Generate `hreflang`.
- [ ] Generate `x-default`.
- [ ] Generate the sitemap.
- [ ] Generate robots rules.
- [ ] Generate Service JSON-LD.
- [ ] Generate Organization JSON-LD.
- [ ] Generate BreadcrumbList JSON-LD.
- [ ] Generate FAQ JSON-LD only when the same FAQ is visible on the page.
- [ ] Avoid duplicate JSON-LD blocks.
- [ ] Correct the CSP nonce hydration mismatch.
- [ ] Do not generate different nonce attributes on the server and client.
- [ ] Verify `noindex` for admin, image-tool, and variant pages.
- [ ] Verify that these pages are absent from the sitemap.
- [ ] Verify one H1 per page.
- [ ] Verify title language.
- [ ] Verify description language.
- [ ] Verify structured-data URLs.

### Verification

- [ ] Metadata matches visible content.
- [ ] No Russian page has an Estonian title.
- [ ] No title describes the wrong service.
- [ ] Canonical and sitemap use the same URL.

## 21. Stage 17 — performance and security

### Performance

- [ ] Measure HTML response time for both source and target applications.
- [ ] Measure the JavaScript bundle.
- [ ] Measure Core Web Vitals.
- [ ] Remove unjustified Client Component boundaries.
- [ ] Optimise images without visibly reducing quality.
- [ ] Use correct `sizes` values.
- [ ] Avoid layout shift.
- [ ] Preserve fonts.
- [ ] Verify font preloading.
- [ ] Avoid hydrating the same content twice.
- [ ] Verify the CPU cost of animations.

### Security

- [ ] Preserve or strengthen CSP.
- [ ] Preserve `X-Content-Type-Options`.
- [ ] Preserve `X-Frame-Options` or the equivalent CSP.
- [ ] Preserve Referrer Policy.
- [ ] Preserve Permissions Policy.
- [ ] Verify admin authentication.
- [ ] Verify CSRF protection.
- [ ] Verify rate limiting in a multi-instance context.
- [ ] Do not rely solely on process memory when a function must operate across serverless instances.
- [ ] Verify file uploads.
- [ ] Verify email sanitisation.
- [ ] Do not log personal data from forms.
- [ ] Verify database-query timeouts.

### Verification

- [ ] The target application is not slower than the source version without a documented reason.
- [ ] Security headers are present in the production build.

## 22. Stage 18 — complete regression verification

### Build

- [ ] `npm run lint`
- [ ] TypeScript
- [ ] `npm run build`
- [ ] start the production server

### URLs

- [ ] Every canonical URL returns 200.
- [ ] Every legacy URL redirects with one 308.
- [ ] There are no redirect loops.
- [ ] There are no accidental 404s.

### Languages

- [ ] Every ET page is in Estonian.
- [ ] Every EN page is in English.
- [ ] Every RU page is in Russian.
- [ ] Language switching preserves the same page.
- [ ] Form errors are in the correct language.
- [ ] Metadata is in the correct language.

### Prices

- [ ] Every example is mathematically correct.
- [ ] Every unit is appropriate for the locale.
- [ ] Every price comes from an approved rule.

### Forms

- [ ] Empty form.
- [ ] Invalid email.
- [ ] Invalid telephone.
- [ ] Missing consent.
- [ ] Permitted attachment.
- [ ] Prohibited attachment.
- [ ] Oversized attachment.
- [ ] Duplicate submission.
- [ ] Rate limit.
- [ ] Successful submission through test transport.

### Mobile

- [ ] 320 px.
- [ ] 360 px.
- [ ] 390 px.
- [ ] 430 px.
- [ ] 768 px.
- [ ] No overflow.
- [ ] No hidden CTA.
- [ ] No text below 15 px.

### SEO

- [ ] One H1.
- [ ] Title.
- [ ] Description.
- [ ] Canonical.
- [ ] `hreflang`.
- [ ] `x-default`.
- [ ] Breadcrumb.
- [ ] JSON-LD.
- [ ] Sitemap.
- [ ] Robots.

### Visual comparison

- [ ] Compare every reference screenshot.
- [ ] Document every difference.
- [ ] Reject accidental differences.
- [ ] Obtain approval for intentional visible differences.

## 23. Stage 19 — final handover to the user

### Tasks

- [ ] Update `REBUILD_PROGRESS.md`.
- [ ] Update `MIGRATION_DECISIONS.md`.
- [ ] Update `VISUAL_DIFFERENCES.md`.
- [ ] Update `CONTENT_CORRECTIONS.md`.
- [ ] Update `URL_MIGRATION_MAP.md`.
- [ ] Update `TEST_RESULTS.md`.
- [ ] Create the final page inventory.
- [ ] Create a list of unresolved questions.
- [ ] Create production-migration instructions.
- [ ] Create rollback instructions.
- [ ] Do not point the domain to the target application without separate user permission.
- [ ] Do not deploy to production without separate user permission.
- [ ] Do not delete the source project after completion.

## 24. Recommended implementation order by page group

After approval of the technical pilot:

1. Shared homepage components.
2. Regular-cleaning main page.
3. Office cleaning.
4. Retail-space cleaning.
5. Industrial-building cleaning.
6. School cleaning.
7. Cleaning-services main page.
8. Post-construction cleaning.
9. Escalators.
10. Disinfection.
11. Floors.
12. Fire and smoke damage.
13. Carpets.
14. Outdoor-cleaning main page.
15. Windows.
16. Façade.
17. Graffiti.
18. Caretaker service.
19. Leaves.
20. Snow.
21. Lawn.
22. Paving stones.
23. Repair-services main page.
24. Electrical work.
25. Plumbing.
26. Interior finishing.
27. Sanitary repairs.
28. Ventilation.
29. Tiling.
30. Roof repair.
31. Demolition.
32. Construction-waste removal.
33. SPS Grupp.
34. Reviews.
35. Contact.
36. Careers and vacancies.
37. Privacy.
38. Blog and blog posts.
39. 404 and system pages.

After every page group, run the ET/EN/RU and mobile regression tests for that group.

## 25. Definition of done

The rebuild is complete only when every condition below is met:

- [ ] The source project is untouched.
- [ ] The target project is in a separate sibling directory.
- [ ] The design is preserved.
- [ ] The order of content sections is preserved.
- [ ] Every verified content defect is corrected or documented.
- [ ] Every language uses a verifiable content model.
- [ ] Estonian content does not depend on an unused English copy in `et.json`.
- [ ] Russian content is natural and grammatically correct.
- [ ] Every content item has exactly one canonical URL.
- [ ] Sitemap URLs return 200 directly.
- [ ] Pricing logic is mathematically and substantively consistent.
- [ ] Forms validate the same business rules in the browser and on the server.
- [ ] Blog and reviews do not wait indefinitely during a database failure.
- [ ] There is no horizontal overflow between 320 and 1440 px.
- [ ] No text is smaller than 15 px.
- [ ] Build and lint pass.
- [ ] Automated tests pass.
- [ ] Every visible difference is documented and approved.
- [ ] A production migration and rollback plan exists.

## 26. Prohibited shortcuts

The AI must not:

- perform an automated project-wide search-and-replace migration without page-by-page verification;
- replace the existing design with a new UI kit;
- change colours or fonts to make them “more modern”;
- use global `overflow-x: hidden` to conceal all mobile defects;
- turn the entire application into a Client Component;
- place all content in one enormous JSON file;
- place all content in one enormous React component;
- leave ET, EN, and RU on different architectures;
- generate Russian text and treat machine translation as final;
- decide prices based on assumptions;
- change a canonical URL without a redirect plan;
- permit the same content on two self-canonical URLs;
- test real form submission without permission;
- copy secrets into the new directory;
- deploy to production without permission;
- delete the old application.

## 27. The AI's first concrete work cycle

The AI must begin with exactly these steps:

1. Read every document named in section 3.
2. Check the Git status of the source project without changing it.
3. Create an inventory of routes and data sources.
4. Check whether the target directory exists.
5. If the target directory is empty or absent, create it safely.
6. Copy only the files permitted by section 7.
7. Create the target project's control files.
8. Install dependencies according to the lockfile.
9. Run lint and build on the unchanged copy.
10. Run the source and target applications on different ports.
11. Create a visual and technical baseline comparison.
12. Document every difference.
13. Create the technical design for the central registry and content schema.
14. Migrate only the office-cleaning pilot.
15. Verify the pilot for ET, EN, RU, mobile, SEO, pricing, and forms.
16. Present the pilot results to the user before mass migration.

Do not begin mass migration until the pilot's technical solution has been reviewed and the user has approved every decision affecting visible output or business logic.

## 28. Mandatory task order for a lower-capability model

Do not begin the next group before meeting the acceptance criteria of the previous group.

### Group A — read-only review and inventory

1. [ ] Read the principal project instructions named in section 3.
2. [ ] Identify and document the source project's Git state.
3. [ ] Identify every route file.
4. [ ] Identify every page registry, slug map, and metadata source.
5. [ ] Identify the ET, EN, and RU content sources.
6. [ ] Identify every pricing rule and calculation function.
7. [ ] Identify every form, schema, and submission endpoint.
8. [ ] Identify every sitemap, robots, canonical, `hreflang`, and redirect generator.
9. [ ] Save the results in `SOURCE_INVENTORY.md`.

Acceptance: the inventory includes the exact file path and responsibility of every identified item. Application code is not modified in this group.

### Group B — safe creation of the new directory

1. [ ] Verify the exact absolute target-directory path.
2. [ ] Verify that the target directory is not inside the source project.
3. [ ] If the directory already contains files, stop copying and document the file list.
4. [ ] Create an empty target directory only if it does not exist.
5. [ ] Copy only the files permitted by section 7.
6. [ ] Do not copy `.env*`, `.next`, `node_modules`, logs, caches, or secrets.
7. [ ] Verify the copied file list.
8. [ ] Install dependencies according to the lockfile.
9. [ ] Run lint, type checking, and build on the unchanged copy.

Acceptance: the target project compiles and the Git state of the source project is exactly unchanged.

### Group C — baseline comparison of source and target

1. [ ] Run source and target applications on separate ports.
2. [ ] Check the same URL in both applications.
3. [ ] Take matching screenshots in ET, EN, and RU.
4. [ ] Use at least 390, 768, 1280, and 1440 px widths.
5. [ ] Record HTTP status, metadata, links, form state, and horizontal-overflow result.
6. [ ] Document every difference before refactoring.

Acceptance: the unchanged copy has zero visible differences, or the reason for every difference is documented.

### Group D — tests before refactoring

1. [ ] Add a route and locale inventory test.
2. [ ] Add a duplicate-URL test.
3. [ ] Add baseline comparison for canonical and `hreflang`.
4. [ ] Add sitemap and redirect tests.
5. [ ] Add characterisation tests for current pricing behaviour.
6. [ ] Add characterisation tests for current form validation.
7. [ ] Add an ET, EN, and RU visual baseline for office cleaning.

Acceptance: tests confirm current behaviour and detect the known defects named in the audit. A test covering a known defect may fail before the fix only when it is marked as an expected failure with an audit reference.

### Group E — office-cleaning pilot only

Complete the 17 subcycles in section 10 one at a time. After each subcycle:

1. [ ] run the unit-specific test;
2. [ ] run every registry and route test;
3. [ ] run lint;
4. [ ] run type checking;
5. [ ] inspect affected URLs in a browser;
6. [ ] update `REBUILD_PROGRESS.md`;
7. [ ] perform a separate diff review.

Acceptance: the ET, EN, and RU office-cleaning pages preserve their appearance, content structure, functions, and URLs; the new technical path passes every test.

### Group F — user approval before mass migration

Present to the user:

- files modified in the pilot;
- an architecture description;
- automated-check results;
- visual-comparison results;
- every visible difference;
- every content, URL, pricing, and form decision;
- the migration plan for the next single page.

Mass migration may begin only after pilot review. Separate user approval is always required for changing visible design, section order, a business claim, a price, or a public URL.

## 29. Page-by-page verification card

Copy the following card into `REBUILD_PROGRESS.md` for every page and locale. Do not leave any field blank; enter `NOT APPLICABLE` with a reason where appropriate.

```text
PAGE VERIFICATION CARD

Page ID:
Page type:
Parent ID:

ET URL:
EN URL:
RU URL:

Old route file:
Old ET content source:
Old EN content source:
Old RU content source:
Old metadata source:
New registry entry:
New content module:
Template used:

ET title before:
ET title after:
EN title before:
EN title after:
RU title before:
RU title after:

ET H1 before/after:
EN H1 before/after:
RU H1 before/after:

ET canonical:
EN canonical:
RU canonical:
x-default:
hreflang values:

Section order before:
Section order after:

Viewport widths checked:
- 390 px:
- 768 px:
- 1280 px:
- 1440 px:

Internal links checked:
Language switching checked:
Breadcrumb checked:
Form checked:
Prices and units checked:
JSON-LD checked:
Sitemap checked:
Redirects checked:

Did text change: YES/NO
If yes, exact change and reason:
Did the visual result change: YES/NO
If yes, exact change and evidence:
Did a URL change: YES/NO
If yes, redirect and user approval:

Unit-specific test:
Registry test:
Route test:
Lint:
Type check:
Build:
Browser check:

Status: NOT STARTED / IN PROGRESS / BLOCKED / COMPLETE
```

## 30. File-change verification card

Before saving each file, answer every question:

1. Was this file listed among the files to be modified at the start of the work cycle?
2. Does the change serve only the single objective of this cycle?
3. Can the same result be achieved with a smaller change?
4. Did an existing public API or component prop interface change?
5. Did the rendered DOM, classes, or section order change?
6. Did any ET, EN, or RU text change?
7. Did metadata, a URL, canonical, `hreflang`, or sitemap change?
8. Did a pricing formula, unit, minimum, maximum, or rounding rule change?
9. Did form requiredness, validation, or submission behaviour change?
10. Which test proves that the change is correct?

If the answer to questions 4–9 is `YES` and that change was not the objective of the work cycle, do not save it. Revert only your own unfinished change in that file and create a separate task.

## 31. Error-handling verification card

If a test, build, or browser check fails:

1. [ ] record the exact command;
2. [ ] record the complete error or the path to the stored error output;
3. [ ] identify the first project-owned file and line referenced by the error;
4. [ ] check whether the same error occurs in the unchanged source version;
5. [ ] review the diff from the latest work cycle;
6. [ ] state one direct hypothesis for the cause;
7. [ ] make only the smallest change that tests that hypothesis;
8. [ ] rerun the failed check first;
9. [ ] after it passes, run the full verification set for the work cycle;
10. [ ] document the cause and solution in `REBUILD_PROGRESS.md`.

The following are prohibited as ways of removing an error:

- deleting the test;
- weakening an assertion without a verified requirement change;
- excluding the defective page from the test list;
- changing a TypeScript or ESLint rule merely to bypass the error;
- adding an unjustified `any`, `@ts-ignore`, or lint-disable;
- hiding a runtime error in an empty `catch` block;
- replacing an invalid dynamic value with an arbitrary hardcoded value;
- performing an unrelated mass refactor.
