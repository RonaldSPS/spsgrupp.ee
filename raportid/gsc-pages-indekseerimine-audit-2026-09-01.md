# GSC „Pages“ / indekseerimise audit ja 404-de parandused

**Kuupäev:** 01.09.2026 · **Andmeallikad:** GSC Search Analytics API (lehe-tasand), GSC URL Inspection API, live- ja lokaalne HTTP-probe · **Skriptid:** `scripts/gsc-pull-pages.ts`, `scripts/gsc-probe-status.ts`, `scripts/gsc-inspect-index.ts`

---

## 1. Kokkuvõte

| | Enne | Pärast (lokaalne build) |
|---|---|---|
| GSC-i teadaolevad URL-id (16 kk, 302 tk) mis **live 404** | **129** | 0 (kohaliku koodi järgi) |
| Post-launch URL-id (17.–30.08, 186 tk) mis 404 / hangusid | 19 × 404 + 4 timeouti | **186/186 → 200** (130 otse + 56 ümbersuunamisega) |
| 16 kk nimekiri (302) | — | **296/302 → 200**; 6 teadlikult 404 (vanad binaarfailid) |
| 3-hopilisel ümbersuunamisel URL-id | 105 | 10 (ainult `:path*`-wildcardid) |

Kõik kontrollid rohelised: `tsc --noEmit` ✓ · `eslint` ✓ · `npm test` 75/75 ✓ (sh i18n-validatsioon 40 lehte / 28 definitsiooni) · sitemap.xml 146/146 → 200 ✓.

---

## 2. Peamine avastus: RU ümbersuunamised ei töötanud üldse

`next.config.ts`-i `localizedLegacyRedirects` sisaldas 20 kirjet venekeelsetele legacy-URL-idele — **ükski neist ei toiminud**. Põhjus: Next.js-i redirect-matcher jooksutatakse **protsentkodeeritud** pathname'i vastu, seega kirillitsaga source ei matchi kunagi. Kinnitus: live-probe (404) + lokaalne build (404) + kaks olemasolevat RU redirecti, mis olid eranditult `proxy.ts`-sse tõstetud (`LEGACY_RU_REPAIR_REDIRECTS`), töötasid.

**Lahendus:** kõik mitte-ASCII redirectid on nüüd `proxy.ts`-is (`LEGACY_RU_REDIRECTS`, 51 kirjet + `LEGACY_RU_PREFIX_REDIRECTS`), kus pathname dekodeeritakse enne võrdlust. `next.config.ts` jääb ainult ASCII redirectitele.

Erisalp: vana WP slug `/ru/…/mытьe-окон` sisaldab **ladiini** `m` (U+006D) ja `e` (U+0065) kirillitsa sees — võti on proxy.ts-is täpsete koodipunktidega ja kommentaariga markeeritud.

## 3. Leitud ja parandatud probleemid

### 3.1 Katkised ümbersuunamisahelad (308 → 308 → 404)
Wildcard `/valikoristus/:path*` edastas kaks vana slugi kujul, mida uues struktuuris pole:
- `/valikoristus/muru-niitmine/` (283 näitamist/16 kk) → siht 404 · parandatud → `/koristusteenus/valikoristus/muruniitmine/`
- `/valikoristus/tanavakivi-pesu-ja-hooldus/` (217) → siht 404 · parandatud → `…/tanavakivide-pesu-ja-hooldus/`

Eripärased redirectid on nüüd wildcards't **enne** (järjekord loeb).

### 3.2 Puudunud ET/EN redirectid (uued `next.config.ts`-is)
- `/koristusteenused/:path*` → `/koristusteenus/:path*` (3 URL-i, kokku 1827 näitamist/16 kk: tootmishoonete, kaubanduspindade, kontori-koristus)
- `/puhastusteenused/ehitusprahi-aravedu` → `/ehitusprahi-aravedu/` (340 näitamist)
- `/puhastusteenused/suitsukahjustuste-ja-tulekahjustuste-puhastamine` → `…/suitsu-ja-tulekahjustuste-puhastamine/`
- `/remonditeenused-tallinnas/siseviimistlus` → `…/siseviimistlustood/`
- `/herokontakt` ja `/tanan` → `/kontakt/`; `/sps-grupp-2` → `/sps-grupp/`
- 7 kustutatud `/sps-grupp/*` alamlehte → `/sps-grupp/` (ettevotte-juhtimine, iso-sertifikaadid, koostoopartnerid, kliendi-rahulolu, kvaliteedi-ja-keskkonnapoliitika, ressursijuhtimine, toode-teostus). **`/sps-grupp/arvamused` jääb töötavaks leheks — wildcardi ei lisatud, et seda mitte varjutada.**
- 22 vana WP blogiposti, mis elasid juure tasemel → `/blog/…` (olemasolev postitus) või lähim teenuseleht (nt `/kuidas-poranda-eest-oigesti-hoolt-kanda/` — 1310 näitamist! — → `/puhastusteenused/porandate-hooldus/`, `/kontori-puhastamine-ja-selle-olulisus/` — 658 — → `/koristusteenus/kontori-koristus/`)
- WP artefaktid: `/category/*`, `/uudised*`, `/feed`, `/2025/*` → `/blog/`; `/faq-items/*` → teemade kaupa (`/koristusteenus/`, `/puhastusteenused/`, `/kontakt/`, `/sps-grupp/`); `/faq_category/*` → vastavad hubid; `/elementor-6122`, `/testing`, `/sps-404` → `/`
- Vanad EN blogi-kategooria URL-id (`professional-exterior-decoration-…`, `private-cleaning-services-…`, 9 tk) → vastavad EN teenuselehed; `/en/removal-of-construction-waste` → `/en/construction-waste-removal/` (708 näitamist); `/en/sample-page` → `/en/`
- Vanad RU URL-põlvkonnad (proxy.ts-is): `/ru/услуги-по-уборке*`, `/ru/специальные-работы-по-уборке/*`, `/ru/уборка-территорий-делает-каждую-комп/*`, `/ru/запросите-предложение`, `/ru/приходите-к-нам-на-работу`, `/ru/офис`, `/ru/sps-grupp-услуги-по-уборке-и-поддерживанию`, `/ru/category/*` jpt — kokku ~30 uut kirjet

### 3.3 Redirect-ahelate lühendamine
Kõik fikseeritud sihtpunktid said kaldkriipsu lõppu (`trailingSlash: true` kanooniline vorm) — varem oli 105 URL-i 3-hopilised (redirect → slash-308 → 200), nüüd 10 (ainult `:path*` wildcardid; tühja capture'i puhul annaks lõpu-kaldkriips `//`, seega jäetud teadlikult). Proxy RU redirectid on 1-hopilised.

### 3.4 Tööpakkumiste lehtede hangumine (Supabase paus)
`getAnnouncementBySlug()` tegi DB-päringu ilma read-timeoutita — pausitud Supabase'i korral hangus leht >15 s (ka crawleritele). Parandatud: `withReadTimeout` (2,5 s) + JSON-fallback, sama muster nagu mujal. Tööpakkumiste URL-idele staatilisi redirecteid **ei** tehtud — need on DB-dünaamilised ja redirect varjutaks taasavatud kuulutuse.

## 4. Teadlikult 404-ks jäetud (6 URL-i)

| URL | Näitamisi 16 kk | Põhjus |
|---|---|---|
| `/wp-content/uploads/2017/10/20160912_7_89_1.pdf` | 49 / 0 klikki | 2016 a riigihanke PDF, 22 MB — taastamine tooks repo/deploy'i 44 MB ballasti; 404 on korrektne signaal, GSC eemaldab indeksist |
| `/wp-content/uploads/2017/10/20140904_7_71_1.pdf` | 3 | sama (2014 a) |
| `/wp-content/plugins/phastpress/…` ×3 | 6 | WP plugina sisemised URL-id, junk |
| `/wp-content/uploads/2025/04/SPSpuhastusteenusedSQ.webp` | 1 | vana pildifail |

## 5. URL Inspection API — indekseerimise seis (post-launch 186 URL-i)

| coverageState | Arv | Märkus |
|---|---|---|
| Submitted and indexed | 167 | kogu praegune sisu indekseeritud |
| Page with redirect | 15 | Google juba teab redirecteid (valikoristus/*, EN legacy, blog slash-normandid) — konsolideeruvad iseenesest |
| Not found (404) | 4 | kõik 4 on nüüd 308-kaantega kaetud (vt allpool) |

**Indeksis 404-na olevad URL-id** (roomatud 01.09, enne parandusi) — kõik said redirecti:
- `/ru/профессиональная-внешняя-отделка-в-т/профессиональная-чистка-фасадов-пов/` (8 näitamist, 1 klikk) → `/ru/уборка-и-обслуживание-территорий/мойка-фасадов/`
- `/ru/услуги-по-ремонту-в-таллинне/pipeworks/` (11) → `…/сантехнические-работы/`
- `/ru/услуги-по-ремонту-в-таллинне/покрытие/` (1) → `…/укладка-плитки/`
- `/ru/частные-клининговые-услуги-для-бизне/послестроительная-уборка-в-харьюмаа/` (2) → `/ru/клининговые-услуги-для-бизнеса/послестроительная-уборка/`

## 6. GSC UI "Pages" vaade — seletus (35× "Not found (404)", 59× "Page with redirect")

**"Page with redirect" (59) on korras ja oodatud** — Google ei indekseeri ümbersuunavaid URL-e, vaid nende sihtlehti. URL Inspection API kinnitus: kõik kontrollitud näidised on `NEUTRAL / Page with redirect` ja `userCanonical == googleCanonical` (kanooniline siht õige, konflikte pole). Nimekirjas on (a) lõpu-kaldkriipsuta varianid elavatest lehtedest (nt `/puhastusteenused` → `/puhastusteenused/` — Google testib alati mõlemat vormi), (b) legacy URL-id, mis 308-suunavad uutele lehtedele. Tegevus: pole vaja midagi teha ega "Validate" vajutada; kirjed kaovad, kui Google konsolideerimise lõpetab.

**"Not found (404)" (35)** — legacy URL-id, mis roomiku viimasel visiidil 404 andsid. Käesoleva auditi parandused katavad need (vt jaotised 3.1–3.2): pärast deploy'd vajuta GSC-is **"Validate Fix"** — Google roomab URL-id uuesti, näeb 308 ja liigutab need "Page with redirect" alla (siht lehele konsolideerudes).

**Siselingid on puhtad.** Kohaliku build'i täisroomik (kõik 146 sitemapi URL-i) leidis null katkist linki ja null kaldkriipsuta siselist linki. Ainsaks leidiks oli `/sps-grupp/arvamused/` lehel üks vananenud teenuselink `/koristusteenus/koolide-koristamine/` (308) — allikas: **live-andmebaasi** `testimonials.category_href` (JSON-fallback oli juba korrektne). Parandatud DB-s (3 rida → `/koolide-koristamine`); leht võtab muudatuse ISR-i järgmisel uuendusel. GSC `referringUrls` väljad näitasid vanu linke ka lehtedelt, kus neid enam pole (nt `/puhastusteenused/` → `pehme-moobli-puhastus`) — need on Google'i vahemälus vanad krawlli-versioonid ja kaovad järgmiste roomikutega.

## 6. Jälgimine

- **01.09 / 08.09 / 15.09:** GSC „Pages“ raportis peaks „Not found“ arv langema ja redirect-sihted konsolideeruma. Korda vajadusel: `npx tsx scripts/gsc-pull-pages.ts` → `PROBE_BASE=… npx tsx scripts/gsc-probe-status.ts`.
- Live-keskkond oli auditi ajal Verceli botikaitse tõttu osaliselt mõõtmata (Security Checkpoint pärast esimest probe-lainet) — verifikatsioon tehtud puhta lokaalse production-build'i vastu, mis on deploy-koodi täpne peegel. Pärast deploy'd tasub 10 suurima-klikiga legacy-URL-i live'das kohapeal üle proovida.
- Uued lehed (`/koristusteenus/hoolduskoristus/`, `/puhastusteenused/suurpuhastus/`) on indekseeritud (`Submitted and indexed`).

## 7. Muudatused koodis

| Fail | Muudatus |
|---|---|
| `proxy.ts` | `LEGACY_RU_REDIRECTS` (51 kirjet, dekodeeritud matching) + `LEGACY_RU_PREFIX_REDIRECTS`; endine 2-kirjeline repair-map liidetud |
| `next.config.ts` | RU kirjetest puhtaks (ei matchinudki), +~50 ASCII redirectit (ET/EN legacy, blogi-juurslugid, WP artefaktid); kõik fikseeritud sihted kaldkriipsuga |
| `lib/announcements.ts` | `getAnnouncementBySlug` sai 2,5 s read-timeouti (Supabase-pausi hangumise fix) |
| `AGENTS.md` | kirillitsa-redirecti gotcha + uued GSC skriptid dokumenteeritud |
| `.gitignore` | `/tmp/` lisatud (probe/GSC tööfailid) |
| `scripts/` | +`gsc-pull-pages.ts`, +`gsc-probe-status.ts`, +`gsc-inspect-index.ts` |
