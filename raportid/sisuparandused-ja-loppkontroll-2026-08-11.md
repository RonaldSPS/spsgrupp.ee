# Sisuparandused ja lõppkontroll — 11.08.2026

Klient saatis korrektuuride nimekirja (sps-aprill-2026.vercel.app ülevaade). Kõik punktid tehtud, kontrollitud puhasta `next build` + `next start` (localhost:3001) peal. Testid: `tsc --noEmit` ✓, `eslint` ✓, `npm test` (58/58 + i18n:validate) ✓, `npm run i18n:parity` (36 lehte, sektsioonide pariteet) ✓.

## 1. SPS Grupp / „Kõrged standardid“ (`/sps-grupp/`)

`lib/pages/definitions/sps-grupp.ts` (ET + EN + RU paralleelselt):

| Enne | Pärast |
|---|---|
| Teenuse kvaliteedijuhtimise olemasolu — süsteemne lähenemine kvaliteedile | **Süsteemne kvaliteedijuhtimine** |
| Sissetöötatud usaldusväärne hooldustööde kuluarvestus — täpne ja läbipaistev | **Täpne ja läbipaistev tööde kuluarvestus** |
| Kliendisõbralikud hinnad — konkurentsivõimeline hinnastruktuur | **Konkurentsivõimeline hinnastruktuur** |
| näiteks eur/m² või eur/h | näiteks **€/m² või €/h** |

€-sümbolid parandatud ka lehe KKK hinna-vastustes (et/en/ru). EN: „Systematic quality management“, „Accurate and transparent cost accounting“, „Competitive pricing structure“, „e.g. €/m² or €/h“. RU vastavad tõlked („Системное управление качеством“ jne).

## 2. Tööle kandideerimise leht (`/tule-meile-toole/`)

Ühtne „kandideerimine“ loogika, proovipäev enam põhisõnumis ei figureeri:

- Hero nupp: „Registreeru proovipäevale“ → **„Kandideeri“** (`app/_pages/tule-meile-toole/page.tsx`)
- Vormi pealkiri: „Registreeru proovipäevale“ → **„Täida kandideerimisvorm“** (`messages/et.json` → `careerForm.heading`)
- Vormi alapealkiri: „Täida allolev vorm ja võtame sinuga ühendust, et leppida kokku proovipäev.“ → **„Täida allolev vorm ja võtame sinuga ühendust.“**
- Hüve „Tervisekontroll — Regulaarne tervise jälgimine“ → **„Töötervishoiu tervisekontroll“** (alatekst eemaldatud; tühja alateksti ei renderdata)
- EN/RU koos: EN „Apply“ / „Fill in the application form“ / „Occupational health check“; RU „Подать заявку“ / „Заполните форму заявки“ / „Медицинский осмотр по охране труда“.
- Eemaldatud ka magavatest (mitte-renderdatavatest) `messages/et.json` `careers`-nimruumi proovipäeva-tekstidest kooskõla huvides.

## 3. Kontorikoristuse leht (`/koristusteenus/kontori-koristus/`)

`app/_pages/koristusteenus/kontori-koristus/page.tsx` + `messages/en.json` / `messages/ru.json`:

- Hero-märge: „Kontrollitud personal“ → **„Koolitatud personal“** (EN „Trained staff“, RU „Обученный персонал“)
- Tekstiplokk: „SPS Grupis läbib iga koristaja koolituse just kontorikeskkonna jaoks. Me teame, kuidas käsitleda IT-tehnikat, tundlikke dokumente…“ → **„Meeskond saab objekti eripärale vastava juhendamise. Oskame töötada ruumides, kus asuvad IT-seadmed ja konfidentsiaalsed dokumendid.“** (EN/RU samastatud)
- Teenuste loetelu: selgituse ette lisati kriips — nt „Põrandate igapäevane puhastus ja hooldus **–** kõik põrandatüübid“. Kehtib kõigile selle lehe kaartidele, kõigis keeltes.

Märkus: `/koristusteenus/` ülemlehel on eraldi kaart „Kontrollitud personal — iga töötaja allkirjastab konfidentsiaalsuslepingu“ — see jäeti, sest seal on „kontrollitud“ tähenduses „taustakontrollitud“ ja kontekst on teine.

## 4. Kliendiarvamuste „kordumine“ (`/kontakt/`, `/koristusteenus/kontori-koristus/`, avaleht)

Uuritud: tegu on lõputult keriva ribaga (marquee), kus sama komplekt kordub teadlikult — teine koopia on sujuva tsükli jaoks tehniliselt vajalik ja on ekraanilugejatelt peidetud (`aria-hidden` + `inert`). **Kliendi otsus: jäetakse praegu vahele** — muudatusi ei tehtud.

Küll leidis lõppkontroll seonduva tõelise vea: kaardi CTA-link „Soovid sama tulemust? Küsi pakkumist“ oli **kõigil keelte lehtedel eesti keeles** (`TestimonialSlider` ei edastanud lokaliseeritud teksti). Parandatud: `app/components/TestimonialSlider.tsx` kasutab nüüd `useLocale` ja keelekohtaseid CTA-sid (sama loogika nagu `Testimonials.tsx`).

## 5. Tarmo tagasiside (`/sps-grupp/arvamused/` ja mujal)

„Pidev koristuskvaliteedi jälgimine tagab tervislikuma õpikeskkonna ja tervemad lapsed.“ → **„Pidev koristuskvaliteedi jälgimine aitab hoida puhta ja meeldiva õpikeskkonna.“**

Muudetud kõikides esinemistes:
- `app/components/Testimonials.tsx` (avalehe ja kontakti keriva riba andmestik, et/en/ru)
- `app/_pages/koristusteenus/koolide-koristamine/page.tsx` (ET) + `messages/en.json` / `messages/ru.json` (`koolideKoristamine.testimonials.item2`)
- `data/admin-testimonials.json` (arvamuste lehe JSON-varukoopia, quote + shortQuote)
- `data/admin-testimonial-translations.json` (EN/RU tõlked uuendatud + `sourceHash` arvutatud uuesti, et tõlked ei langeks „stale“ staatusesse ja EN/RU arvamuste lehedelt ära ei kaoks)

⚠️ **Oluline järeltegevus:** arvamuste leht loeb andmeid esmajärjekorras **andmebaasist** (Supabase), JSON on vaid varukoopia. Ettevõtte poolt tuleb sama tekst uuendada ka adminnis: `/spsadmn/testimonials` → Tehnikakõrgkooli arendusprorektor Tarmo → uus quote/shortQuote nagu ülal (seejärel `npx tsx scripts/sync-translation-fallbacks.ts`).

## 6. Eripuhastustööde leht (`/puhastusteenused/`)

`lib/pages/definitions/puhastusteenused.ts` (et/en/ru):

- Sissejuhatus: „…tulekahjustuste taastamine ja desinfitseerimine“ → „…**suitsu- ja tulekahjustuste puhastamine** ja desinfitseerimine“
- Probleemiplokk: „tulekahjujärgne taastamine“ → „tulekahjujärgne **puhastus**“
- Teenusekaart: „Pindade ja õhu desinfitseerimine professionaalsete vahenditega.“ → „**Pindade desinfitseerimine** professionaalsete vahenditega.“
- EN: „fire and smoke damage cleaning“, „Surface disinfection…“; RU: „устранение последствий пожара“, „Обработка поверхностей…“

## 7. Remonditeenuste leht (`/remonditeenused-tallinnas/`)

`lib/pages/definitions/remonditeenused-tallinnas.ts` (kliendi valikud):

- Hero-märge „Ärikinnisvara / ja korteriühistud“ → **„Ärikinnisvara / Tallinnas ja Harjumaal“** — nüüd kooskõlas lehe pealkirja ja sissejuhatusega (sihtrühm: ainult ärikinnisvara)
- „Sanitaarremont — WC, vannituba, duširuum — täislahendus.“ → **„Sanitaarremont — WC, vannituba, duširuum.“** (EN/RU samamoodi, ilma „full solution“ / „полное решение“-ta)

## 8. Website-väli vormidel (honeypot)

Kontrollitud Playwrightiga (päris Chromium) 4 lehel (`/kontakt/`, `/tule-meile-toole/`, `/remonditeenused-tallinnas/`, `/koristusteenus/kontori-koristus/`) kahel laiusel (1280px desktop + 390px mobiil): `website_url` väli ja „Website“-silt on **kõikjal nähtamatud** (`hidden` + `aria-hidden` + inline `display:none` + `tabindex="-1"`; computed style ja bounding box = 0). Muudatusi polnud vaja — väli oli juba korrektselt peidetud.

## 9. EN/RU lõppkontroll

Puhasta buildi (`.next` kustutatud) ja `next start` peal:

- **Kõik lehed avanevad:** 37 lehte × 3 keelt = 111 päringut, kõik HTTP 200, õige `<html lang>` igal lehel
- **Menüülingid:** ET/EN/RU avalehe navi + mega-menüü kõik siselingid (39/38/38) läbi klikitud — kõik 200, EN/RU lehtedel pole ühtegi ET-keelde viitavat linki
- **Keeled ei segane:** skann kõikidel EN/RU lehtedel eesti „chrome“-sõnade suhtes (`Küsi pakkumist`, `Avaleht`, `Tule meile tööle`, `Võtame teiega`, `tööpäeva jooksul` jmt) — leiti ja parandati ülaltoodud TestimonialSlider CTA leke; pärast parandust puhas
- **Keelevahetus:** lülitus kasutab `localizePath(currentEtPath, locale)` üle samast registrist — kõik sihtlehed 200 (sama lehe keeleversioon)
- **Vormid õiges keeles:** EN/RU kontakt-, karjääri- ja remondilehtede vormide sildid/nupud/placeholderid kontrollitud (nt „Send Inquiry“, „Отправить запрос“, „Fill in the application form“, „Заполните форму заявки“); ET-sildi lekkeid pole
- `npm run i18n:parity`: 36 lehte, sektsioonide järjekord langeb — OK

## Muudetud failid

```
app/_pages/koristusteenus/kontori-koristus/page.tsx
app/_pages/koristusteenus/koolide-koristamine/page.tsx
app/_pages/tule-meile-toole/page.tsx
app/components/TestimonialSlider.tsx
app/components/Testimonials.tsx
data/admin-testimonial-translations.json
data/admin-testimonials.json
lib/pages/definitions/puhastusteenused.ts
lib/pages/definitions/remonditeenused-tallinnas.ts
lib/pages/definitions/sps-grupp.ts
messages/et.json
messages/en.json
messages/ru.json
```

## Avatud järeletegevused

1. **Andmebaas:** Tarmo arvamuse uus sõnastus tuleb sisestada ka live-andmebaasi adminni kaudu — täpne juhend on allpool jaotises „Juhend: Tarmo arvamuse uuendamine adminnis“.
2. **Kliendiarvamuste keriv riba:** kliendi otsusel hetkel vahele jäetud. Kui hiljem soovitakse kordumisest lahti saada, tuleks kerimine asendada staatilise võre või liikuriga (sujuv lõputu tsükkel ilma duplikaadita pole tehniliselt võimalik).

---

## Juhend: Tarmo arvamuse uuendamine adminnis (~2 min)

Eesmärk: live-sait loeb arvamusi Supabase'i andmebaasist, seega tuleb sama tekst sisestada ka adminni. Admin lihtsalt salvestab DB-sse ja sünkroniseerib JSON-varukoopia automaatselt.

1. Ava `https://spsgrupp.ee/spsadmn` ja logi sisse.
2. Ava vasakult **Arvamused** ning leia nimekirjast rida **„Tehnikakõrgkooli arendusprorektor Tarmo“** (kategooria „Koolide koristamine“) ja klõpsa see avama.
3. Täida väljad uue tekstiga:
   - **Täispikk arvamus:** `Pidev koristuskvaliteedi jälgimine aitab hoida puhta ja meeldiva õpikeskkonna.`
   - **Lühike tsitaat kaardile:** `Pidev koristuskvaliteedi jälgimine aitab hoida puhta ja meeldiva õpikeskkonna.`
4. Klõpsa üleval paremal **Salvesta**. Parema serva kaardil „Tõlked“ muutuvad EN/RU staatuseks `stale` — see on oodatud käitumine.
5. Klõpsa samal kaardil **Tõlgi EN/RU** ja oota, kuni staatused on jälle `auto`. (DeepSeek tõlgib uue eesti teksti; tähendus on sama mis käsitsi kirjutatud varukoopias.)
6. Kontrolli kolme lehte:
   - `/sps-grupp/arvamused/` — Tarmo kaart uue tekstiga
   - `/en/sps-group/reviews/` — EN tõlge uue tekstiga
   - `/ru/группа-sps/отзывы/` — RU tõlge uue tekstiga
7. Arendusmasinas (kus on `.env.local` ja `DATABASE_URL`) jooksuta `npx tsx scripts/sync-translation-fallbacks.ts`, et ka `data/admin-testimonial-translations.json` varukoopia saaks DB-st uued tõlked.
