# I18N Sisuline Pariteedi Inventuur

> Koostatud: 2026-08-04  
> Lähtekeel: ET (Estonian)  
> Sihtkeeled: EN (British English), RU (Venemaa vene keel)  
> Kokku lokaliseeritud staatilisi teid: **36**  
> Tõlkefailide ülataseme nimeruume: **53** (36 service + 17 shared UI)

---

## 1. ARHITEKTUURI ÜLEVAADE

ET lehed renderdavad kõvakodeeritud inline-JSX või `OutdoorServicePage` data-driven komponente.  
EN/RU lehed läbivad catch-all route'i (`app/en/[[...slug]]/page.tsx`, `app/ru/[[...slug]]/page.tsx`), mis:

1. Pöörab lokaliseeritud URL-i ET teeks (`enToEt` / `ruToEt`)
2. Laeb ET lehekomponendi (`getPage()`)
3. Kui nimeruum on olemas, renderdab `<LocalizedContentPage>` JSON-tõlkefailist
4. Kui nimeruumi pole, renderdab ET komponendi otse (nt avaleht, blog)

**Põhiprobleem:** `LocalizedContentPage` generaator renderdab JSON-põhiseid sektsioone, aga ET lehed renderdavad kõvakodeeritud struktuuri. Tulemuseks on erinev sektsioonide arv ja järjestus keelte vahel.

### Lehekoodi klassifikatsioon

| Tüüp | Lehtede arv | Kirjeldus |
|------|-------------|-----------|
| **OutdoorServicePage (data-driven)** | 3 | muruniitmine, kojameheteenus, lehtedekoristamine |
| **Inline-JSX** | 32 | Kõik ülejäänud teenuselehed + erilehed |
| **Avaleht** | 1 | Jagatud komponendid (Hero, Trust, jne) |

### Lühikokkuvõte EN/RU tõlkeolekust

Kõik 36 lokaliseeritud teed omavad tõlkenimeruume nii `en.json` kui `ru.json` failides.  
Mõlemas failis on **53 identse struktuuriga** ülataseme nimeruumi.

**Kriitiline puudus:** Suur osa EN/RU nimeruumidest sisaldab ainult `seo`, `hero`, `services`, `whyUs`, `footerCta` välju — puudu on `problem`, `pricing`, `faq`, `process`, `testimonials`, `stats` sektsioonid, mis ET lehtedel eksisteerivad.

---

## 2. AVALEHT (`/`)

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | `app/page.tsx` → `Home()` | `PageComponent` (ET komponent otse) | `PageComponent` (ET komponent otse) |
| **Hero** | ✅ ET kõvakodeeritud | ✅ `useTranslations("hero")` | ✅ `useTranslations("hero")` |
| **Logos** | ✅ | ✅ (aria-label tõlgitud) | ✅ |
| **Trust** | ✅ Hardcoded `copy` objekt (et/en/ru) | ✅ Hardcoded `copy` objekt | ✅ Hardcoded `copy` objekt |
| **Testimonials** | ✅ Hardcoded `testimonialPools` (et/en/ru) | ✅ Hardcoded `testimonialPools` | ✅ Hardcoded `testimonialPools` |
| **Industries** | ✅ | ✅ `useTranslations("industries")` | ✅ |
| **Services** | ✅ | ✅ `useTranslations("services")` | ✅ |
| **ContactForm** | ✅ | ✅ `useTranslations("contactForm")` | ✅ |
| **FAQ** | ✅ 3 ET FAQ items hardcoded JSON-LD | ✅ FAQ komponent loeb tõlkeid | ✅ |
| **Footer** | ✅ | ✅ `useTranslations("footer")` | ✅ |
| **JSON-LD** | ⚠️ FAQ JSON-LD kõvakodeeritud ET | ❌ Puudub lokaliseeritud FAQ JSON-LD | ❌ Puudub lokaliseeritud FAQ JSON-LD |

**Hinnang:** Avaleht töötab EN/RU osaliselt (jagatud komponendid loevad tõlkeid), aga:
- Trust ja Testimonials kasutavad hardcoded locale objekte, mitte `useTranslations()`
- FAQ JSON-LD on ainult ET keeles
- services.para1–para4 EN/RU tõlkeid tuleb kontrollida ET-versus

---

## 3. REGULAARNE KORISTUS (Koristusteenus)

### 3.1 `/koristusteenus` — Regulaarse koristuse põhileht

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (394 rida) | `LocalizedContentPage` → `koristusteenus` nimeruum | `LocalizedContentPage` → `koristusteenus` nimeruum |
| **Hero** | ✅ Floating chips + frosted glass h1 + CTA | ✅ Hero tõlgitud JSON-ist | ✅ Hero tõlgitud JSON-ist |
| **Problem** | ✅ Kaheveeruline tekst | ✅ Problem tõlgitud JSON-ist | ✅ Problem tõlgitud JSON-ist |
| **Services** | ✅ 8 kaarti (linkidega alamlehtedele) | ✅ Services tõlgitud JSON-ist | ✅ |
| **WhyUs** | ✅ 4 kaarti + pilt | ✅ WhyUs tõlgitud JSON-ist | ✅ |
| **Pricing** | ✅ `Hinnakalkulaator` + `MaintenancePriceExamples` | ⚠️ JSON-is `pricing.tag/heading/description/note` — komponendid puuduvad | ⚠️ Sama |
| **Process** | ❌ Puudub | ❌ Puudub | ❌ Puudub |
| **FooterCTA** | ✅ | ✅ | ✅ |
| **ContactForm** | ✅ | ✅ | ✅ |
| **FAQ** | ✅ 5 küsimust | ✅ FAQ tõlgitud JSON-ist (q0–q4) | ✅ |
| **Testimonials** | ❌ Puudub | ❌ Puudub | ❌ Puudub |
| **Stats** | ❌ Puudub (floating chips hero-s) | ❌ Puudub | ❌ Puudub |

**⚠️ Hinnaerinevus:** EN/RU ei renderda `Hinnakalkulaator` ega `MaintenancePriceExamples` komponente. See on suurim puudus.

### 3.2 `/koristusteenus/kontori-koristus`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (460 rida) | `LocalizedContentPage` → `kontoriKoristus` | `LocalizedContentPage` → `kontoriKoristus` |
| **Hero** | ✅ | ✅ | ✅ |
| **Problem** | ✅ | ✅ JSON-is `problem.para1Strong/Text` jne | ✅ |
| **Services** | ✅ 8 kaarti | ✅ JSON-is `item0..item6` (7 tk, ET-s 8) | ✅ |
| **WhyUs** | ✅ 4 kaarti + pilt | ✅ | ✅ |
| **Pricing** | ✅ `Hinnakalkulaator` | ⚠️ JSON-is ainult `pricing.tag/heading/description/note` | ⚠️ Sama |
| **Process** | ✅ `Tooprotsess` 5 sammu | ❌ Puudub | ❌ Puudub |
| **Testimonials** | ✅ `TestimonialSlider` | ❌ Puudub | ❌ Puudub |
| **FooterCTA** | ✅ | ✅ | ✅ |
| **ContactForm** | ✅ | ✅ | ✅ |
| **FAQ** | ✅ 5 küsimust | ✅ FAQ tõlgitud JSON-ist | ✅ |

### 3.3 `/koristusteenus/kaubanduspindade-koristus`

Sama muster nagu kontori-koristus (inline JSX ET-s, JSON EN/RU-s). EN/RU puudub: Hinnakalkulaator, Tooprotsess, TestimonialSlider.

### 3.4 `/koristusteenus/tootmishoonete-koristus`

Sama muster. EN/RU puudub: Hinnakalkulaator, Tooprotsess, TestimonialSlider.

### 3.5 `/koolide-koristamine`

Sama muster. EN/RU puudub: Hinnakalkulaator, Tooprotsess, TestimonialSlider.

---

## 4. VÄLIKORISTUS (Valikoristus)

### 4.1 `/koristusteenus/valikoristus` — Välikoristuse põhileht

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (485 rida) | `LocalizedContentPage` → `valikoristus` | `LocalizedContentPage` → `valikoristus` |
| **Hero** | ✅ | ✅ | ✅ |
| **Problem** | ✅ | ✅ JSON-is `problem.heading/paragraph1/paragraph2` | ✅ |
| **Services** | ✅ 8 kaarti | ✅ JSON-is `item0..item5` (6 tk, ET-s 8) | ✅ |
| **WhyUs** | ✅ 4 kaarti | ✅ JSON-is `reason0..reason2` (3 tk, ET-s 4) | ✅ |
| **Pricing** | ✅ 4 hinnakaarti | ⚠️ Puudub | ⚠️ Puudub |
| **Stats** | ✅ 3 pseudo-stats kaarti | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ `Tooprotsess` 5 sammu | ❌ Puudub | ❌ Puudub |
| **FAQ** | ✅ 5 küsimust | ❌ Puudub | ❌ Puudub |
| **FooterCTA** | ✅ | ✅ | ✅ |
| **ContactForm** | ✅ | ✅ | ✅ |

**⚠️ Tõsised puudused:** EN/RU puudub pricing, stats, process, FAQ.

### 4.2 `/koristusteenus/valikoristus/muruniitmine`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | `OutdoorServicePage` (data-driven) | `LocalizedContentPage` → `muruniitmine` | `LocalizedContentPage` → `muruniitmine` |
| **Hero** | ✅ | ✅ | ✅ |
| **Problem** | ✅ `problemTitle/Left/Right` | ❌ Puudub JSON-is | ❌ Puudub |
| **Services** | ✅ 6 kaarti | ✅ JSON-is `item0..item5` | ✅ |
| **WhyUs** | ✅ 4 kaarti + pilt | ✅ JSON-is `reason0..reason3` | ✅ |
| **Pricing** | ✅ 3 kaarti (al. 60€, al. 120€, Hooajaleping) | ❌ Puudub | ❌ Puudub |
| **Stats/Planning** | ✅ "Meie numbrid": Alates 2006, 1, Selge → B-tüüpi pseudoarv | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ `Tooprotsess` 5 sammu | ❌ Puudub | ❌ Puudub |
| **FooterCTA** | ✅ | ✅ (JSON-is `footerCta.title/description`) | ✅ |
| **ContactForm** | ✅ | ✅ | ✅ |
| **FAQ** | ✅ 4 küsimust | ❌ Puudub | ❌ Puudub |
| **SeoJsonLd** | ✅ | ⚠️ `LocalizedContentPage` genereerib automaatselt | ⚠️ Sama |

**⚠️ Kriitilised puudused:** EN/RU kasutab teistsugust renderdusmootorit. Puudub: problem, pricing (hinnad!), stats, process, FAQ.

### 4.3 `/koristusteenus/valikoristus/kojameheteenus`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | `OutdoorServicePage` | `LocalizedContentPage` → `kojameheteenus` | `LocalizedContentPage` |
| **Hero** | ✅ | ✅ | ✅ |
| **Problem** | ✅ | ❌ Puudub | ❌ Puudub |
| **Services** | ✅ 6 kaarti | ✅ `item0..item5` | ✅ |
| **WhyUs** | ✅ 4 kaarti | ✅ `reason0..reason3` | ✅ |
| **Pricing** | ✅ 3 kaarti (al. 180€/kuu, al. 350€/kuu, Täisteenus) | ❌ Puudub | ❌ Puudub |
| **Stats** | ✅ "4 hooaega", "1 kontakt", "Alates 2006" → B-tüüpi | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ `Tooprotsess` 5 sammu | ❌ Puudub | ❌ Puudub |
| **FooterCTA** | ✅ | ✅ | ✅ |
| **ContactForm** | ✅ | ✅ | ✅ |
| **FAQ** | ✅ 4 küsimust | ❌ Puudub | ❌ Puudub |

### 4.4 `/koristusteenus/valikoristus/lehtedekoristamine`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | `OutdoorServicePage` | `LocalizedContentPage` → `lehtedekoristamine` | `LocalizedContentPage` |
| **Hero** | ✅ | ✅ | ✅ |
| **Problem** | ✅ | ❌ Puudub | ❌ Puudub |
| **Services** | ✅ 6 kaarti | ✅ `item0..item5` | ✅ |
| **WhyUs** | ✅ 4 kaarti | ✅ `reason0..reason3` | ✅ |
| **Pricing** | ✅ 3 kaarti (al. 70€/kord, al. 150€, Suur) | ❌ Puudub | ❌ Puudub |
| **Stats** | ✅ "Personaalne", "3", "1" → B-tüüpi | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ `Tooprotsess` 5 sammu | ❌ Puudub | ❌ Puudub |
| **FooterCTA** | ✅ | ✅ | ✅ |
| **ContactForm** | ✅ | ✅ | ✅ |
| **FAQ** | ✅ 4 küsimust | ❌ Puudub | ❌ Puudub |

### 4.5 `/koristusteenus/valikoristus/akende-pesu`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (603 rida) | `LocalizedContentPage` → `akendePesu` | `LocalizedContentPage` |
| **Hero** | ✅ | ✅ | ✅ |
| **Problem** | ✅ Kaheveeruline | ❌ Puudub | ❌ Puudub |
| **Services** | ✅ 8 kaarti | ✅ `item0..item5` (6 tk) | ✅ |
| **WhyUs** | ✅ 4 kaarti + pilt | ✅ `reason0..reason3` | ✅ |
| **Pricing** | ✅ 3 kaarti (2€/m², 3€/m², 5€/m²) | ❌ Puudub | ❌ Puudub |
| **Planning** | ✅ "Mida lepime enne aknapesu kokku?" 3 kaarti | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ `Tooprotsess` 5 sammu | ❌ Puudub | ❌ Puudub |
| **FooterCTA** | ✅ | ✅ | ✅ |
| **ContactForm** | ✅ | ✅ | ✅ |
| **FAQ** | ✅ 5 küsimust | ❌ Puudub | ❌ Puudub |

**Märkus:** Akende pesu planning-plokk on eeskujuks teiste lehtede serviceInfoBlock'ile.

### 4.6 `/koristusteenus/valikoristus/fassaadipesu`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (614 rida) | `LocalizedContentPage` → `fassaadipesu` | `LocalizedContentPage` |
| **Problem** | ✅ | ❌ Puudub | ❌ Puudub |
| **Services** | ✅ | ✅ `item0..item5` | ✅ |
| **WhyUs** | ✅ | ✅ `reason0..reason3` | ✅ |
| **Pricing** | ✅ 4 kaarti (3–4€/m²) | ❌ Puudub | ❌ Puudub |
| **Planning** | ✅ "Töö ettevalmistus" 3 kaarti | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ | ❌ Puudub | ❌ Puudub |
| **FAQ** | ✅ 5 küsimust | ❌ Puudub | ❌ Puudub |

### 4.7 `/koristusteenus/valikoristus/grafiti-eemaldamine`

Sama muster mis fassaadipesu. EN/RU puudub: problem, pricing (150–450€), planning, process, FAQ.  
Lisaks on ET-s Before/After pildigalerii (3 paari), mis EN/RU-s puudub.

### 4.8 `/koristusteenus/valikoristus/lumekoristus`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (605 rida) | `LocalizedContentPage` → `lumekoristus` | `LocalizedContentPage` |
| **Problem** | ✅ | ❌ Puudub | ❌ Puudub |
| **Services** | ✅ 8 kaarti | ✅ `item0..item5` (6 tk) | ✅ |
| **WhyUs** | ✅ 4 kaarti | ✅ `reason0..reason3` | ✅ |
| **Pricing** | ✅ 3 kaarti (150€/kuu, 300€/kuu, Individuaalne) | ❌ Puudub | ❌ Puudub |
| **Stats** | ✅ "Meie numbrid": Alates 2006, 200+, Kindlustatud → B-tüüpi | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ | ❌ Puudub | ❌ Puudub |
| **FAQ** | ✅ 5 küsimust | ❌ Puudub | ❌ Puudub |

### 4.9 `/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (626 rida) | `LocalizedContentPage` → `tanavakividePesuJaHooldus` | `LocalizedContentPage` |
| **Problem** | ✅ | ❌ Puudub | ❌ Puudub |
| **Services** | ✅ 8 kaarti | ✅ `item0..item5` (6 tk) | ✅ |
| **WhyUs** | ✅ 4 kaarti | ✅ `reason0..reason3` | ✅ |
| **Pricing** | ✅ 4 kaarti (2.5–3€/m²) | ❌ Puudub | ❌ Puudub |
| **Planning** | ✅ "Hooldusplaan" 3 kaarti (juba korras, pole pseudoarv) | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ | ❌ Puudub | ❌ Puudub |
| **FAQ** | ✅ 5 küsimust | ❌ Puudub | ❌ Puudub |

---

## 5. ERIPUHASTUSTEENUSED

### 5.1 `/puhastusteenused` — Põhileht

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (410 rida) | `LocalizedContentPage` → `puhastusteenused` | `LocalizedContentPage` |
| **Hero** | ✅ (ilma floating chips) | ✅ | ✅ |
| **Problem** | ✅ | ❌ Puudub | ❌ Puudub |
| **Services** | ✅ 8 kaarti (linkidega) | ✅ `item0..item7` | ✅ |
| **WhyUs** | ✅ 4 kaarti | ✅ `reason0..reason3` | ✅ |
| **Pricing** | ✅ 3 kaarti (3€/m², 2.5€/m², 1.5€/m²) | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ | ❌ Puudub | ❌ Puudub |
| **Testimonials** | ✅ `TestimonialSlider` | ❌ Puudub | ❌ Puudub |
| **FAQ** | ✅ 5 küsimust | ❌ Puudub | ❌ Puudub |
| **FooterCTA** | ✅ | ✅ | ✅ |

### 5.2 `/puhastusteenused/ehitusjargne-koristus`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (413 rida) | `LocalizedContentPage` → `ehitusjargneKoristus` | `LocalizedContentPage` |
| **Services** | ✅ | ✅ `item0..item6` (7 tk) | ✅ |
| **WhyUs** | ✅ | ✅ `reason0..reason3` | ✅ |
| **Pricing** | ✅ 4 kaarti (250€–800€) | ✅ JSON-is `pricing.item0..item2` (3 kaarti) | ✅ |
| **Process** | ✅ | ❌ Puudub | ❌ Puudub |
| **FAQ** | ✅ 5 küsimust | ❌ Puudub | ❌ Puudub |
| **Problem** | ✅ | ❌ Puudub | ❌ Puudub |

**⚠️ Probleem:** Võimalikud vanad hinnad EN/RU JSON-is (250€, 450€, 800€). Tuleb kontrollida.

### 5.3–5.7 Eripuhastuse alamlehed

Kõik 5 alamlehte (`eskalaatorite-suvapuhastus`, `desinfitseerimine`, `porandate-hooldus`, `suitsu-ja-tulekahjustuste-puhastamine`, `vaipade-puhastus`) järgivad sama mustrit:

| Väli | ET | EN/RU |
|------|----|-------|
| Hero | ✅ | ✅ |
| Problem | ✅ | ❌ Puudub |
| Services | ✅ | ✅ |
| WhyUs | ✅ | ✅ |
| Pricing | ✅ | ❌ Puudub |
| Process | ✅ | ❌ Puudub |
| FAQ | ✅ | ❌ Puudub |
| FooterCTA | ✅ | ✅ |

---

## 6. REMONDITEENUSED

### 6.1 `/remonditeenused-tallinnas` — Põhileht

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (469 rida) | `LocalizedContentPage` → `remonditeenusedTallinnas` | `LocalizedContentPage` |
| **Services** | ✅ 9 kaarti (linkidega) | ✅ `item0..item7` (8 tk) | ✅ |
| **WhyUs** | ✅ 4 kaarti | ✅ `reason0..reason3` | ✅ |
| **Pricing** | ✅ 3 kaarti (al. 150€, al. 800€, Täislahendus) | ❌ Puudub | ❌ Puudub |
| **Stats** | ✅ "Üks kontaktisik", "Selge", "Paindlik" → B-tüüpi | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ | ❌ Puudub | ❌ Puudub |
| **FAQ** | ✅ 5 küsimust | ❌ Puudub | ❌ Puudub |

**⚠️ EN/RU puudub ENITI:** pricing, stats, process, FAQ.

### 6.2–6.9 Remonditeenuste alamlehed

Kõik 8 alamlehte (`elektritood`, `torutood`, `siseviimistlustood`, `sanitaarremont-ja-umberehitus`, `ventilatsioonide-ehitus-ja-hooldus`, `plaatimistood`, `katuse-remont`, `lammutustood`) järgivad sama mustrit:

| Väli | ET | EN/RU |
|------|----|-------|
| Hero | ✅ | ✅ |
| Problem | ✅ (paljudel HTML-sisu) | ❌ Puudub |
| Services | ✅ | ✅ |
| WhyUs | ✅ | ✅ |
| Pricing | ✅ (tabel või tekstiread) | ❌ Puudub |
| Process | ✅ | ❌ Puudub |
| FAQ | ✅ | ❌ Puudub |
| FooterCTA | ✅ | ✅ |

**⚠️ Oluline:** EN/RU remonditeenuste vormid ja metaandmed võivad kirjeldada koristusteenust, mitte remonti.

---

## 7. ETTEVÕTTE-, KONTAKTI- JA KARJÄÄRILEHED

### 7.1 `/sps-grupp`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (426 rida) | `LocalizedContentPage` → `spsGrupp` | `LocalizedContentPage` |
| **Stats** | ✅ A-tüüpi ettevõtte näitajad: 300+, üle 1M m², ISO 9001 | ✅ `stats.stat1Label..stat3Label` | ✅ |
| **Standards** | ✅ 9 kaarti | ✅ `standards` tõlgitud | ✅ |
| **Certificates** | ✅ | ✅ | ✅ |
| **About** | ✅ | ✅ `about` tõlgitud | ✅ |
| **FAQ** | ✅ 13 küsimust | ✅ `faq.q1..q13` tõlgitud | ✅ |
| **Process** | ❌ Puudub | ❌ Puudub | ❌ Puudub |

**⚠️ Hea seis —** EN/RU sisu on suhteliselt täielik. Kontrolli ettevõtte numbreid ja ISO-de tähendust.

### 7.2 `/kontakt`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (518 rida) | `LocalizedContentPage` → `kontakt` | `LocalizedContentPage` |
| **Hero** | ✅ Kontakt-chip'id + CTA | ✅ | ✅ |
| **WhyUs** | ✅ 4 kaarti | ✅ `reason1..reason4` | ✅ |
| **Services** | ✅ 12 teenust + 4 embedded stat kaarti | ✅ `item1..item12` + stats puudub | ✅ |
| **ContactForm** | ✅ | ✅ | ✅ |
| **ServiceArea** | ✅ Piirkondade loend | ✅ `areas` tõlgitud | ✅ |
| **FAQ** | ✅ 7 küsimust | ✅ `faq.q0..q6` | ✅ |

**⚠️ Puudu EN/RU-s:** 4 embedded stat kaarti (300+, Alates 2006, 95%, 1000K m²). Kontrolli ServiceArea kaarti ja ettevõtte kontaktandmeid.

### 7.3 `/tule-meile-toole`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (250 rida) | `LocalizedContentPage` → `careers` | `LocalizedContentPage` |
| **Hero** | ✅ Floating chips | ✅ | ✅ |
| **Recruitment** | ✅ | ✅ `problem.paragraph1/2` | ✅ |
| **Benefits** | ✅ 8 kaarti | ❌ Puudub (JSON-is ainult hero+services+problem) | ❌ Puudub |
| **Stats** | ✅ A-tüüpi: 300+, Alates 2006, ISO 9001, ISO 14001 | ❌ Puudub | ❌ Puudub |
| **TooleAnnouncements** | ✅ | ✅ (dünaamiline) | ✅ (dünaamiline) |
| **CareerForm** | ✅ | ✅ | ✅ |
| **FAQ** | ❌ Puudub | ❌ Puudub | ❌ Puudub |

**⚠️ Puudu EN/RU-s:** Benefits (8 kaarti), Stats (4 ettevõtte näitajat).

### 7.4 `/ehitusprahi-aravedu`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | Inline JSX (425 rida) | `LocalizedContentPage` → `ehitusprahiAravedu` | `LocalizedContentPage` |
| **Services** | ✅ 9 kaarti | ✅ `item0..item3` (4 tk) | ✅ |
| **WhyUs** | ✅ | ✅ `reason0..reason2` (3 tk) | ✅ |
| **Pricing** | ✅ 3 kaarti (30-50€/tonn, 60-80€/tonn, Ohtlikud) | ❌ Puudub | ❌ Puudub |
| **Process** | ✅ | ❌ Puudub | ❌ Puudub |
| **FAQ** | ✅ 5 küsimust | ❌ Puudub | ❌ Puudub |

### 7.5 `/andmekaitsetingimused`

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | `PrivacyPolicyPage` | `PrivacyPolicyPage locale="en"` | `PrivacyPolicyPage locale="ru"` |
| **Sisu** | ✅ ET kõvakodeeritud | ✅ JSON-is `privacyPolicy` tõlgitud | ✅ |

**⚠️ Hea seis —** Privaatsustingimused on täielikult tõlgitud.

---

## 8. BLOGI

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | `BlogArchive()` (ET kõvakodeeritud) | `PageComponent` — ET komponent otse (pole `contentNamespace`) | `PageComponent` — ET komponent otse |
| **Sisu** | 16 ET blogipostitust | ❌ Kuvab ET sisu EN URL-il | ❌ Kuvab ET sisu RU URL-il |
| **Keelevalik** | ✅ | ⚠️ Blogil pole EN/RU tõlget — ei tohiks kuvada EN/RU keelevalikut | ⚠️ Sama |

---

## 9. DÜNAAMILISED TÖÖKUULUTUSED

| Väli | ET | EN | RU |
|------|----|----|-----|
| **Komponent** | `DynamicJobOffer` | `DynamicJobOffer locale="en"` | `DynamicJobOffer locale="ru"` |
| **Tõlge** | ✅ ET originaal | ⚠️ AI-tõlge (`getTranslatedAnnouncementBySlug`) | ⚠️ AI-tõlge |
| **Hreflang** | ✅ | ⚠️ Kui tõlge puudub, ära lisa hreflang'i | ⚠️ Sama |

---

## 10. STATS-PLOKKIDE KLASSIFIKATSIOON

### A-tüüp: Kontrollitud ettevõtte põhinäitajad (SÄILITA)

| Leht | Stats sisu |
|------|-----------|
| `/sps-grupp` | 300+ töötajat, üle 1 000 000 m², ISO 9001 |
| `/tule-meile-toole` | 300+ töötajat, Alates 2006, ISO 9001, ISO 14001 |
| `/kontakt` (embedded) | 300+, Alates 2006, 95% rahulolu, 1000K m² |

### B-tüüp: Teenuselehe väheväärtuslik pseudoarv (ASENDA serviceInfoBlock'iga)

| Leht | Praegune pseudo-stats |
|------|----------------------|
| `/koristusteenus/valikoristus/muruniitmine` | "Alates 2006 / kogemust", "1 / kindel kontaktisik", "Selge / kokkulepitud graafik" |
| `/koristusteenus/valikoristus/kojameheteenus` | "4 / hooaega kaetud", "1 / kontakt ja leping", "Alates 2006 / kogemust" |
| `/koristusteenus/valikoristus/lehtedekoristamine` | "Personaalne / vajaduspõhine pakkumine", "3 / põhitööd", "1 / partner kogu välialale" |
| `/koristusteenus/valikoristus/lumekoristus` | "Alates 2006 / kogemust", "200+ / teenindatud objekti", "Kindlustatud / teenus" |
| `/remonditeenused-tallinnas` | "Üks / kontaktisik", "Selge / tööde ulatus ja ajakava", "Paindlik / oma meeskond" |

### Juba korras (planning-plokk olemas, stats puudub)

| Leht | Planning-ploki sisu |
|------|---------------------|
| `/koristusteenus/valikoristus/akende-pesu` | "Mida lepime enne aknapesu kokku?" (Pesuplaan) |
| `/koristusteenus/valikoristus/fassaadipesu` | "Töö ettevalmistus" 3 kaarti |
| `/koristusteenus/valikoristus/grafiti-eemaldamine` | "Töö ettevalmistus" 3 kaarti |
| `/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus` | "Hooldusplaan" 3 kaarti |

### Stats puudub täielikult

| Leht |
|------|
| `/koristusteenus`, `/koristusteenus/kontori-koristus`, `/koristusteenus/kaubanduspindade-koristus`, `/koristusteenus/tootmishoonete-koristus`, `/koolide-koristamine` |
| `/puhastusteenused`, kõik `/puhastusteenused/*` alamlehed |
| `/remonditeenused-tallinnas/elektritood`, `/remonditeenused-tallinnas/torutood`, jne (kõik peale põhilehe) |
| `/ehitusprahi-aravedu` |

---

## 11. EN/RU-st LEITUD ET-S PUUDUVAD VÄITED (TULEB EEMALDADA)

Järgmised väited tuleb EN/RU JSON-idest kontrollida ja eemaldada, kui need ET-s puuduvad:

- "Tasuta konsultatsioon" / "Free consultation" / "Бесплатная консультация"
- "Digitaalne tööülesannete jälgimine" / "Digital task tracking"
- "Vastutuskindlustus" / "Liability insurance"
- Konkreetsed reageerimisajad (nt "24h response", "1-hour response")
- 24/7 lubadused
- Garantiid (nt "100% satisfaction guarantee", "1-5 year warranty")
- "Litsentseeritud oma meeskond" / "Licensed in-house team"
- "Sertifitseeritud oma meeskond" / "Certified in-house team"
- "1000+ objekti"
- "Kogu projekt ühest kohast" / "Turnkey project"
- Vanad hinna näited EN/RU JSON-is (250€, 450€, 800€, 7500€)

---

## 12. KOKKUVÕTE PARITEEDI PUUDUSTEST

| Kategooria | ET lehtede arv | EN/RU puuduvad sektsioonid |
|------------|---------------|---------------------------|
| **Avaleht** | 1 | FAQ JSON-LD, Trust/Testimonials locale-aware |
| **Regulaarne koristus** | 5 | Hinnakalkulaator, Tooprotsess, TestimonialSlider |
| **Välikoristus** | 9 | Problem, Pricing, Stats/Planning, Process, FAQ — enamikul |
| **Eripuhastus** | 7 | Problem, Pricing, Process, FAQ — enamikul |
| **Remont** | 9 | Pricing, Problem, Process, FAQ — kõigil |
| **Ettevõte/kontakt/karjäär** | 5 | Benefits (careers), Stats (kontakt, careers), Process |
| **Blog** | 1 | Terve leht on ET keeles EN/RU URL-il |
| **Töökuulutused** | dünaamiline | AI-tõlked, hreflang-i loogika |

**Kokku:** 36 lokaliseeritud teed + avaleht + blog + dünaamilised.
