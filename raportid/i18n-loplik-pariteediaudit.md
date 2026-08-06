# I18N Loplik Pariteediaudit

> Koostatud: 2026-08-04
> Projekt: ET-EN-RU SISULINE JA VISUAALNE PARITEET

---

## Tehtud muudatused

### FAAS 1 — Andmemudeli parandus
- OutdoorServicePageData.problemLeft: ReactNode muudetud serialiseeritavaks: problemLead: string + problemDescription: string
- Lisatud parentBreadcrumb ja serviceInfoBlock valikulised valjad

### FAAS 2 — data-section atribuudid + pariteediskript
- OutdoorServicePage, LocalizedContentPage ja avaleht said data-section atribuudid
- Loodud scripts/i18n-parity-check.ts, lisatud npm run i18n:parity

### FAAS 3 — ServiceInfoBlock + CompanyStats komponendid
- Loodud app/components/ServiceInfoBlock.tsx
- Loodud app/components/CompanyStats.tsx

### FAAS 4 — Pseudo-stats-plokkide teisendamine
- muruniitmine, kojameheteenus, lehtedekoristamine, lumekoristus, remonditeenused-tallinnas
- Koik "Meie numbrid" plokid asendatud praktiliste kokkulepete plokkidega

### FAAS 5 — Unified localizedPageRegistry
- Loodud lib/localized-page-registry.tsx
- EN ja RU catch-all route'id kontrollivad registrit enne LocalizedContentPage fallback'i

### FAAS 6 — Locale-aware OutdoorServicePage
- OutdoorServicePage aktsepteerib locale prop'i
- Breadcrumb kasutab localizePath(), sektsioonisildid lokaliseeritavad

### FAAS 7–9 — Kolm data-driven lehte View-pattern'ile
- muruniitmine: MuruniitminePageView — ET+EN+RU, registreeritud
- kojameheteenus: KojameheteenusPageView — ET+EN+RU, registreeritud
- lehtedekoristamine: LehtedekoristaminePageView — ET+EN+RU, registreeritud

### FAAS 8 — Avaleht
- Trust.tsx hardcoded copy objekt asendatud useTranslations("trust")
- FAQ komponent genereerib nuud FAQ JSON-LD (locale-aware)
- Home page hardcoded ET FAQ JSON-LD eemaldatud
- data-section atribuudid kogu avalehel

---

## Muudetud failid (20)

| Fail | Muudatus |
|------|----------|
| OutdoorServicePage.tsx | Locale-aware, serialiseeritav problem, serviceInfoBlock, data-section |
| muruniitmine/page.tsx | View pattern, EN+RU data |
| kojameheteenus/page.tsx | View pattern, EN+RU data |
| lehtedekoristamine/page.tsx | View pattern, EN+RU data |
| lumekoristus/page.tsx | Pseudo-stats -> ServiceInfoBlock |
| remonditeenused-tallinnas/page.tsx | Pseudo-stats -> ServiceInfoBlock |
| ServiceInfoBlock.tsx | Uus komponent |
| CompanyStats.tsx | Uus komponent |
| LocalizedContentPage.tsx | data-section atribuudid |
| FAQ.tsx | Locale-aware FAQ JSON-LD |
| Trust.tsx | copy -> useTranslations |
| app/page.tsx | data-section + eemaldatud hardcoded JSON-LD |
| localized-page-registry.tsx | Uus renderdusregister |
| en/[[...slug]]/page.tsx | Registry kontroll |
| ru/[[...slug]]/page.tsx | Registry kontroll |
| messages/et.json | Trust tolkekotmed |
| messages/en.json | Trust tolkekotmed |
| messages/ru.json | Trust tolkekotmed |
| scripts/i18n-parity-check.ts | Uus skript |
| package.json | npm run i18n:parity |

---

## Testide tulemused

- npx tsc --noEmit: 0 errors
- npm test: 38/38 passed, 0 failures

---

## Allesjaanud probleemid

1. Inline-lehed pole View-pattern'il (~35 lehte, kasutavad LocalizedContentPage EN/RU jaoks)
2. Testimonials hardcoded pools (7 arvustust x 3 keelt testimonialPools objektil)
3. data-section atribuudid inline-lehtedel osaliselt puudu
4. EN/RU vaidete audit (kinnitada et LocalizedContentPage lehed ei sisalda ET-s puuduvaid lubadusi)
5. Translation guard (data/translation-hashes.json) tegemata
6. npm run i18n:parity pole rangeks muudetud

---

## Kokkuvote

Kolme OutdoorServicePage data-driven lehe täielik pariteet saavutatud (muruniitmine, kojameheteenus, lehtedekoristamine).
Arhitektuurne alus loodud: locale-aware OutdoorServicePage, ServiceInfoBlock, localizedPageRegistry, i18n:parity script.
Ulejaanud inline-lehed vajavad järkjärgulist migreerimist View-pattern'ile.
