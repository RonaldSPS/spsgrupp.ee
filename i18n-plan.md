# Translation Dev Steps — SPS Grupp i18n (et / en / ru)

## Architecture: Server-Component Wrapper
Each page becomes two files: a server component (page.tsx) that calls `getTranslations()` server-side, and a client component (`_Client.tsx`) that receives text as props. The HTML already contains translated text — no JS needed for SEO.

```
app/koristusteenus/
  page.tsx          ← SERVER: getTranslations('koristusteenus'), passes props
  _Client.tsx       ← CLIENT: receives {text}, renders <h1>{text.hero.title}</h1>
```

## Per-Page Process (6 steps, do in order)
1. **Extract** all hardcoded Estonian strings → add to `messages/et.json` under page namespace
2. **Create** `_Client.tsx` — copy old page, replace text with `{text.namespace.key}`, add `'use client'`
3. **Rewrite** `page.tsx` — server component, `getTranslations()`, passes text as props
4. **Translate** English → add same keys to `messages/en.json`
5. **Translate** Russian → add same keys to `messages/ru.json`
6. **Verify** — `npm run dev`, test `/page` (ET), `/en/slug` (EN), `/ru/slug` (RU)

## Page Files to Convert (43 total, 6 phases)

### Phase 1 — Core (5 pages)
```
 1. app\page.tsx
 2. app\koristusteenus\page.tsx
 3. app\kontakt\page.tsx
 4. app\sps-grupp\page.tsx
 5. app\ehitusprahi-aravedu\page.tsx
```
### Phase 2 — Koristusteenus sub (4 pages)
```
 6. app\koristusteenus\kontori-koristus\page.tsx
 7. app\koristusteenus\kaubanduspindade-koristus\page.tsx
 8. app\koristusteenus\tootmishoonete-koristus\page.tsx
 9. app\koristusteenus\koolide-koristamine\page.tsx
```
### Phase 3 — Valikoristus (9 pages)
```
10. app\koristusteenus\valikoristus\page.tsx
11. app\koristusteenus\valikoristus\akende-pesu\page.tsx
12. app\koristusteenus\valikoristus\fassaadipesu\page.tsx
13. app\koristusteenus\valikoristus\grafiti-eemaldamine\page.tsx
14. app\koristusteenus\valikoristus\kojameheteenus\page.tsx
15. app\koristusteenus\valikoristus\lehtedekoristamine\page.tsx
16. app\koristusteenus\valikoristus\lumekoristus\page.tsx
17. app\koristusteenus\valikoristus\muruniitmine\page.tsx
18. app\koristusteenus\valikoristus\tanavakivide-pesu-ja-hooldus\page.tsx
```
### Phase 4 — Puhastusteenused (7 pages)
```
19. app\puhastusteenused\page.tsx
20. app\puhastusteenused\ehitusjargne-koristus\page.tsx
21. app\puhastusteenused\desinfitseerimine\page.tsx
22. app\puhastusteenused\eskalaatorite-suvapuhastus\page.tsx
23. app\puhastusteenused\porandate-hooldus\page.tsx
24. app\puhastusteenused\suitsu-ja-tulekahjustuste-puhastamine\page.tsx
25. app\puhastusteenused\vaipade-puhastus\page.tsx
```
### Phase 5 — Remonditeenused (12 pages)
```
26. app\remonditeenused-tallinnas\page.tsx
27. app\remonditeenused-tallinnas\elektritood\page.tsx
28. app\remonditeenused-tallinnas\torutood\page.tsx
29. app\remonditeenused-tallinnas\siseviimistlustood\page.tsx
30. app\remonditeenused-tallinnas\sanitaarremont-ja-umberehitus\page.tsx
31. app\remonditeenused-tallinnas\ventilatsioonide-ehitus-ja-hooldus\page.tsx
32. app\remonditeenused-tallinnas\plaatimistood\page.tsx
33. app\remonditeenused-tallinnas\katuse-remont\page.tsx
34. app\remonditeenused-tallinnas\lammutustood\page.tsx
35. app\remonditeenused-tallinnas\muruniitmine\page.tsx
36. app\remonditeenused-tallinnas\lehtedekoristamine\page.tsx
37. app\remonditeenused-tallinnas\kojameheteenus\page.tsx
```
### Phase 6 — Misc (6 pages)
```
38. app\privaatsus\page.tsx
39. app\tule-meile-toole\page.tsx
40. app\blog\page.tsx
41. app\blog\[slug]\page.tsx
42. app\tule-meile-toole\[slug]\page.tsx
43. app\sps-grupp\arvamused\page.tsx
```

## Supporting Files (already built, do not change)
```
lib\i18n-provider.tsx          — NextIntlClientProvider wrapper
lib\slug-map.ts                — ET↔EN/RU path translation
lib\page-registry.ts           — ET path → component mapping
lib\seo-metadata.ts            — localized metadata generator
lib\metadata-registry.ts       — page title/description pairs
app\layout.tsx                 — root layout, I18nProvider(locale="et")
app\en\layout.tsx              — I18nProvider(locale="en")
app\en\[[...slug]]\page.tsx    — English catch-all route
app\ru\layout.tsx              — I18nProvider(locale="ru")
app\ru\[[...slug]]\page.tsx    — Russian catch-all route
messages\et.json               — Estonian source strings
messages\en.json               — English translations
messages\ru.json               — Russian translations
```

## Rules
- Step 1 ALWAYS before Step 2 (et.json populated before wiring, prevents raw key paths in UI)
- One page at a time — finish all 6 steps, verify, then move to next
- Keep HTML, CSS, SVGs, JS logic untouched — only replace text content
- Phone numbers, emails, URLs, prices, dates, brand names, ISO codes NEVER translated
- Template placeholders `{field}`, `{min}`, `{max}` NEVER translated
