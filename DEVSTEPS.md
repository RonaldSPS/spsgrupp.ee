# i18n — Dev Steps

## Architecture
Each page becomes two files:
- `page.tsx` — server component, calls `getTranslations()`, HTML has real text for SEO
- `_Client.tsx` — client component, receives text as props, renders UI

```
app/koristusteenus/
  page.tsx       ← getTranslations('koristusteenus'), static import
  _Client.tsx    ← 'use client', {text} prop, renders <h1>{text.hero.h1Line1}</h1>
```

## Per-Page Process
1. Read page, find all hardcoded Estonian text → add to `messages/et.json` under namespace
2. Rename `page.tsx` → `_Client.tsx`. Replace text with `{text.hero.key}`. Add `'use client'`.
3. Write new `page.tsx`: server component. `getTranslations(ns)`. Renders `<_Client text={{...}}/>`.
4. Add same keys to `messages/en.json` with English values.
5. Add same keys to `messages/ru.json` with Russian values.
6. `npm run dev`, verify all 3 locales.

## Rules
- Step 1 ALWAYS before step 2 (et.json populated before wiring)
- One page at a time. Verify before moving on.
- Only replace text content. Keep all HTML, CSS, SVGs, JS logic.
- Never translate: phone numbers, emails, URLs, prices, dates, brand names, ISO codes, {template} placeholders.

---

## Phase 1 — Core Pages

[ ] 1. app\page.tsx                                   ns="home"
[ ] 2. app\koristusteenus\page.tsx                     ns="koristusteenus"
[ ] 3. app\kontakt\page.tsx                            ns="kontakt"
[ ] 4. app\sps-grupp\page.tsx                          ns="spsGrupp"
[ ] 5. app\ehitusprahi-aravedu\page.tsx                ns="ehitusprahiAravedu"

## Phase 2 — Koristusteenus Sub-pages

[ ] 6. app\koristusteenus\kontori-koristus\page.tsx     ns="kontoriKoristus"
[ ] 7. app\koristusteenus\kaubanduspindade-koristus\page.tsx  ns="kaubanduspindadeKoristus"
[ ] 8. app\koristusteenus\tootmishoonete-koristus\page.tsx    ns="tootmishooneteKoristus"
[ ] 9. app\koristusteenus\koolide-koristamine\page.tsx   ns="koolideKoristamine"

## Phase 3 — Valikoristus

[ ] 10. app\koristusteenus\valikoristus\page.tsx        ns="valikoristus"
[ ] 11. app\koristusteenus\valikoristus\akende-pesu\page.tsx  ns="akendePesu"
[ ] 12. app\koristusteenus\valikoristus\fassaadipesu\page.tsx  ns="fassaadipesu"
[ ] 13. app\koristusteenus\valikoristus\grafiti-eemaldamine\page.tsx  ns="grafitiEemaldamine"
[ ] 14. app\koristusteenus\valikoristus\kojameheteenus\page.tsx  ns="kojameheteenus"
[ ] 15. app\koristusteenus\valikoristus\lehtedekoristamine\page.tsx  ns="lehtedekoristamine"
[ ] 16. app\koristusteenus\valikoristus\lumekoristus\page.tsx  ns="lumekoristus"
[ ] 17. app\koristusteenus\valikoristus\muruniitmine\page.tsx  ns="muruniitmine"
[ ] 18. app\koristusteenus\valikoristus\tanavakivide-pesu-ja-hooldus\page.tsx  ns="tanavakividePesuJaHooldus"

## Phase 4 — Puhastusteenused

[ ] 19. app\puhastusteenused\page.tsx                   ns="puhastusteenused"
[ ] 20. app\puhastusteenused\ehitusjargne-koristus\page.tsx  ns="ehitusjargneKoristus"
[ ] 21. app\puhastusteenused\desinfitseerimine\page.tsx   ns="desinfitseerimine"
[ ] 22. app\puhastusteenused\eskalaatorite-suvapuhastus\page.tsx  ns="eskalaatoriteSuvapuhastus"
[ ] 23. app\puhastusteenused\porandate-hooldus\page.tsx   ns="porandateHooldus"
[ ] 24. app\puhastusteenused\suitsu-ja-tulekahjustuste-puhastamine\page.tsx  ns="suitsuJaTulekahjustustePuhastamine"
[ ] 25. app\puhastusteenused\vaipade-puhastus\page.tsx    ns="vaipadePuhastus"

## Phase 5 — Remonditeenused

[ ] 26. app\remonditeenused-tallinnas\page.tsx            ns="remonditeenusedTallinnas"
[ ] 27. app\remonditeenused-tallinnas\elektritood\page.tsx  ns="elektritood"
[ ] 28. app\remonditeenused-tallinnas\torutood\page.tsx    ns="torutood"
[ ] 29. app\remonditeenused-tallinnas\siseviimistlustood\page.tsx  ns="siseviimistlustood"
[ ] 30. app\remonditeenused-tallinnas\sanitaarremont-ja-umberehitus\page.tsx  ns="sanitaarremontJaUmberehitus"
[ ] 31. app\remonditeenused-tallinnas\ventilatsioonide-ehitus-ja-hooldus\page.tsx  ns="ventilatsioonideEhitusJaHooldus"
[ ] 32. app\remonditeenused-tallinnas\plaatimistood\page.tsx  ns="plaatimistood"
[ ] 33. app\remonditeenused-tallinnas\katuse-remont\page.tsx  ns="katuseRemont"
[ ] 34. app\remonditeenused-tallinnas\lammutustood\page.tsx   ns="lammutustood"
[ ] 35. app\remonditeenused-tallinnas\muruniitmine\page.tsx   ns="remondiMuruniitmine"
[ ] 36. app\remonditeenused-tallinnas\lehtedekoristamine\page.tsx  ns="remondiLehtedekoristamine"
[ ] 37. app\remonditeenused-tallinnas\kojameheteenus\page.tsx  ns="remondiKojameheteenus"

## Phase 6 — Misc

[ ] 38. app\privaatsus\page.tsx                          ns="privaatsus"
[ ] 39. app\tule-meile-toole\page.tsx                     ns="tuleMeileToole"
[ ] 40. app\blog\page.tsx                                 ns="blogList"
[ ] 41. app\blog\[slug]\page.tsx                          ns="blogPost"
[ ] 42. app\tule-meile-toole\[slug]\page.tsx              ns="jobPost"
[ ] 43. app\sps-grupp\arvamused\page.tsx                  ns="arvamused"
