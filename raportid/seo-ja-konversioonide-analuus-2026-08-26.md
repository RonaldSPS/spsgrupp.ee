# SPS Grupp — konversioonide ja SEO positsioonide analüüs

**Kuupäev:** 26.08.2026 · **Koostaja:** Ronald Kask · **Andmeallikad:** GA4 Data API, Google Search Console API, spsgrupp.ee päringute andmebaas, Ads'i kulud GA4↔Ads lingi kaudu

---

## 1. Konversioonide lahknevuste analüüs (juuli 2026)

### 1.1 Kust numbrid tegelikult tulevad

Juuli GA4 sündmuste tabel (vana leht, vana GTM-konteiner `GTM-N3RTJR`):

| Sündmus | Arv | Märgitud võtmesündmuseks |
|---|---|---|
| `form_submit` | **101** | **jah — kõik 101** |
| `generate_lead` | 101 (dubleerib form_submit'i) | ei |
| `Email_phone_klik_copy` (e-posti/telefoni klikid ja kopeerimised) | 90 | **jah — 42** |
| **Võtmesündmusi kokku** | | **143** |

Nüüd on aritmeetika täpne:

- **"143 konversiooni"** = GA4 võtmesündmused kokku = 101 vormi saatmine + 42 e-posti/telefoni klikki. **42 neist ei ole üldse päringud** — keegi klõpsas telefoninumbrit või kopeeris e-posti aadressi.
- **"101 veebivormi täitmist"** = `form_submit` sündmuste arv. Tegelikult oli juulis **22 päris saatmist** (9 kontakti + 13 töölejõud — vt 1.3 tabel). 101 sündmust = topelt-tagid + spämm + testid + tõrgete korduvad lausumised.
- **"GA4-s 60 konversiooni"** = GA4 võtmesündmused **Paid Search kanalis** (juuli: Paid Search = 60; Organic = 64; AI Assistant = 8; Direct = 5; Referral = 4; Video = 2 — summa 143). Kolleegi vaadatud "GA4 konversioonid" oli tõenäoliselt kanalile filtreeritud vaade.
- **"Adsis 26 konversiooni"** = Google Ads'i **enda konversiooniarvestus** (Ads'i oma conversion action + Ads'i attribuutsioon).

### 1.2 Miks Ads (26) ja GA4 (60) erinevad >2x — põhjendatud

Põhjused on metoodilised, mitte vead (v.a. üks, vt allpool):

1. **Erinev mõõtmise ulatus.** GA4 "60" sisaldab paid-sessioonides tehtud e-posti/telefoni klikke (osake neist 42-st langeb paid-kanalisse). Ads'i 26 luges tõenäoliselt ainult konkreetset vormi-konversiooni.
2. **Erinev attribuutsum mudel.** GA4: last-non-direct-click sessiooni tasemel. Ads: oma klikipõhine attribuutsum, konversiooniaken (vaikimisi 30 p) ja rist-seade modelleerimine. Sama inimene võib GA4-s olla "paid", Ads'is "mitte" ja vastupidi.
3. **Lugemisreeglid ("every" vs "one").** Kui üks kasutaja saatis vormi + klõpsas e-posti + helistas, loeb GA4 kuni 3 võtmesündmust; Ads loeb tüüpiliselt 1.
4. **Consent Mode.** Kui `ad_storage` on keelatud, Ads kasutab modelleerimist (modeling) — GA4 modelleerib omamoodi. Erinevad katvusastmed.
5. **Vana konteineri topeltmaardlus.** Vana leht märgis `form_submit` **ja** e-posti/telefoni klikid konversioonideks — see täis GA4 arve. See on ainus tegelik seadistusviga ja see on uuel lehel **juba parandatud** (vt 1.4).

**Järeldus: kolleegi kahtlus on põhjendatud — "143" ei ole tulemusnumber ega sobi eelarve aluseks.** Tegelik müügipäringute arv on alati olnud loetav ainult postkastist; GA4/Ads numbrid olid segu päringutest, klikkidest, spämmist ja tööavaldustest.

### 1.3 Mis on tegelik müügipäringute arv?

Tegelik aasta põhineb inbox'ist koostatud aruandel (kuni uue lehe avaldamiseni 18.08):

| Kuu | Kontaktid | Töölejõud | Kokku |
|---|---|---|---|
| Jaanuar | 6 | 8 | 14 |
| Veebruar | 10 | 6 | 16 |
| Märts | 17 | 2 | 19 |
| Aprill | 10 | 6 | 16 |
| Mai | 7 | 8 | 15 |
| Juuni | 10 | 13 | 23 |
| Juuli | **9** | **13** | **22** |
| August (kuni 18.08) | 5 | 1 | 6 |
| **Kokku** | **74** | **47** | **121** |

**Juuli tõsisuhe on nüüd täpne: 9 tegelikku müügipäringut vs GA4 "101 vormitäitmist" vs Ads "26 konversiooni".** GA4 `form_submit` lausus ~4,6× päris saatmistest (9+13=22) — allikad: topelt-tagid vana konteineri seadistuses, spämmrobotite postitused (vanal lehel polnud spämmifiltrit), testid ja tõrgete korral korduvad lausumised. Seega mitte ükski kolmest arvust (143 / 60 / 26) ei kirjeldanud tegelikku tulemust.

Lisamärkus: juuli Paid Search kanali 60 GA4-võtmesündmust vs 9 tegelikku päringut (sh. Ads'i enda 26) — ka see kinnitab, et eelarve otsuse aluseks sobib ainult päringute tabel/postkasti arv.

**August 2026 (1.–26.08, uue lehe andmebaas): 17 saatmist kokku → 14 päris kontaktpäringut + 1 tööavaldus + 2 spämmi.** Uue lehe Päringute tabel on edaspidi "ground truth".

### 1.4 Mida uus leht parandab (juba live)

- Konversioonisündmus `form_submission_success` lausub **ainult reaalsel õnnestumisel** (mitte honeypot/spämm/testid).
- Tööavaldused on Ads'i lead-konversioonitest **blokeeritud** (GTM "tööotsija trigger").
- Spämmisadestik (4 kihti: honeypot, ajalõks, Turnstile, sisuanalüüs) hoiab robotsaadetised konversioonidest eemal.
- **Admin → Päringud** tabel = tegelike päringute arv igal perioodil (koos Tasu/Kasum väljadega).
- ⚠️ **17.–24.08 oli tracking katki** (CSP blokeeris GTM-i — GA4 sai nädalaga vaid 74 page_view'd tavalise ~350 asemel, form-sündmused 0). Parandatud 24.08. See tähendab: augusti GA4/Ads numbreid ei saa võrrelda juuliga 1:1.

**Soovitus aruandluseks:** raporteeri "konversioonidena" ainult (a) Päringute tabeli kontaktivormi ridu ja (b) Ads'i oma conversion action'i. GA4 võtmesündmusi kasuta suundumuste vaatluseks, mitte tulemusnumbrina.

---

## 2. Orgaanilise otsingu positsioonid (GSC)

**Perioodid:** `cur28` = 28.07–24.08 · `prev28` = 30.06–27.07 · `enne uut lehte` = 20.07–16.08 (28 p) · `pärast uut lehte` = 17.–24.08 (8 p — väike valim!). Uus leht läheb avalikuks ~17.08.2026. Märkus: täpsed igakuised otsingumahud vajavad Ads Keyword Plannerit (praegune ligipääs seda ei kata); allpool "nõudlus" on hinnang GSC näitamiste põhjal (meie näitamised ≈ alampiir kogumahust).

### 2.1 Küsitud märksõnad (sugupere = fraas + lähedased variantid)

| Märksõna | Näitamised 28p | Klikid | Positsioon | Δ pos vs eelmine 28p | Pos enne → pärast uut lehte | Nõudlus | Meie leht |
|---|---|---|---|---|---|---|---|
| puhastusteenused | 183 | 0 | **7,8** | 7,8 → 7,8 (■) | 7,5 → 7,6 (■) | kõrge | /puhastusteenused/ ✓ |
| puhastusteenused tallinnas | 39 | 0 | 11,0 | 10,7 → 11,0 (■) | 10,4 → 12,2 (▼) | keskmine | /puhastusteenused/ ✓ |
| koristusteenused | 65 | 0 | 33,4 | 24,5 → 33,4 (▼) | 34,6 → 18,7 (▲*) | keskmine | vale leht: /puhastusteenused/ pos 69! |
| koristusteenused tallinnas | 45 | 0 | 21,4 | 16,3 → 21,4 (▼) | 20,2 → 18,7 (■) | keskmine | hajutatud 3 lehe vahel |
| puhastusfirma | 110 | 0 | 31,6 | 31,0 → 31,6 (■) | 32,5 → 28,7 (▲*) | kõrge | hajutatud: / pos 25 + /puhastusteenused/ pos 39 |
| puhastusfirma tallinnas | 0 | – | – | – | – | väike fraas | – |
| koristusfirma | 242 | 1 | **8,5** | 8,7 → 8,5 (■) | 8,3 → 11,2 (▼ ⚠️) | kõrge | / ✓ (avaleht) |
| koristusfirma tallinnas | 0 | – | – | – | – | väike fraas | – |
| kontorikoristus | 14 | 0 | 6,9 | 9,0 → 6,9 (▲) | 7,1 → 6,5 (■) | väike | /koristusteenus/kontori-koristus/ ✓ |
| kontorite koristus | 0 | – | – | – | – | vt "kontori koristus" | ✓ |
| kontorikoristus tallinnas | 0 | – | – | – | – | väike | ✓ |
| hoolduskoristus | 17 | 0 | **57,4** | 4,0 → 57,4 (▼▼) | 51,9 → 67,0 (▼) | keskmine | **❌ eraldi lehte pole** (hälbib kontori-koristus lehele) |
| äripindade koristus | 6 | 0 | 32,2 | 29,3 → 32,2 (■) | 31,3 → 32,0 (■) | keskmine | osaline: kaubanduspindade-koristus |
| büroode koristus | 0 | – | – | – | – | vt "kontori koristus" | ✓ (sünonüüm) |
| eripuhastustööd | 3 | 0 | 19,3 | 21,3 → 19,3 (▲) | 19,3 → – | väike | /puhastusteenused/ (hub) ✓ |
| akende pesu | 281 | 0 | 36,0 | 40,2 → 36,0 (▲) | 41,5 → **25,4 (▲▲)** | kõrge | ✓ aga vana + uus URL võistlevad |
| akende pesu tallinnas | 7 | 0 | 11,9 | 31,5 → 11,9 (▲▲) | 27,0 → **9,3 (▲▲)** | keskmine | ✓ uus leht tõuseb |
| põrandate süvapesu | 0 | – | – | – | – | keskmine | **❌ pole** (põrandate-hooldus pos 9,9 on lähim) |
| suurpuhastus | 14 | 0 | 18,6 | 16,5 → 18,6 (■) | 16,2 → 21,0 (▼) | keskmine | **❌ ainult blogipostitus** |
| fassaadipesu | 6 | 0 | 33,0 | 24,0 → 33,0 (▼) | 33,0 → – | väike-kesk. | ✓ /valikoristus/fassaadipesu/ |
| tööstuskoristus | 0 | – | – | – | – | väike | osaline: tootmishoonete-koristus |

\* post-launch periood on vaid 8 päeva — väike valim, suund on olulisem kui number.

### 2.2 Lisaks leitud olulised märksõnad (reaalse mahuga GSC-s)

| Märksõna | Näitamised 28p | Klikid | Pos | Leht | Märkus |
|---|---|---|---|---|---|
| **kontori koristus** | **390** | 1 | **3,0** | /koristusteenus/kontori-koristus/ ✓ | meie tugevaim — aga CTR 0,3%! |
| **ehitusjäätmete äravedu** | 249 | 2 | 11,2 | /ehitusprahi-aravedu/ ✓ | suur maht, leht 2 ääres |
| **ehitusprahi äravedu** | 236 | 1 | 9,4 | /ehitusprahi-aravedu/ ✓ | suur maht |
| puhastusteenus (ainsus) | 191 | 0 | 10,2 | /puhastusteenused/ ✓ | |
| koristusteenus (ainsus) | 156 | 0 | 24,3 | kontori-koristus leht ⚠️ | hub peaks olema /koristusteenus/ |
| **клининг таллинн** (RU) | 160 | 3 | 13,5 | RU lehed ✓ | suur RU maht — potentsiaal |
| lammutustööd | 149 | 7 | 6,3 | /remonditeenused-tallinnas/lammutustood/ ✓ | toob klikke! |
| betoonitööd | 75 | 7 | 7,3 | ✓ | toob klikke! |
| вывоз мусора таллинн (RU) | 99 | 1 | 9,7 | RU äravedu leht ✓ | |
| вывоз строительного мусора (RU) | 27 | 3 | 3,4 | ✓ | |
| мойка окон таллинн (RU) | 27 | 2 | 10,9 | RU akende pesu ✓ | |
| lumekoristus | 62 | 0 | 31,1 | ✓ (hooajaline, talvel kõrge) | vana+uus URL võistlevad |
| vaipade puhastus | 49 | 0 | 40,2 | /puhastusteenused/vaipade-puhastus/ ✓ | leht nõrk |
| välikoristus | 39 | 0 | 20,8 | /valikoristus/ ✓ | |
| desinfitseerimine | 32 | 0 | 26,2 | koroonaviiruse-jargne-puhastus ✓ | lehe nimi on vananenud ("koroonaviiruse-järgne") |
| kontori puhastus | 9 | 0 | 5,1 | ✓ | |
| muruniitmine | 5 | 0 | 6,8 | ✓ | |

### 2.3 Kas nähtavus on pärast uut lehte paranenud või langenud? (17.–24.08 vs 20.07–16.08)

**Kokku:** klikke 62 vs 251 (päevas 7,8 vs 9,0 → **−13 %**), näitamisi 2 565 vs 10 702 (päevas 321 vs 382 → **−16 %**), keskmine positsioon **13,2 vs 14,1 → veidi parem**, CTR 2,42 % vs 2,35 % → veidi parem.

- **Paranenud:** akende pesu (41,5→25,4), akende pesu tallinnas (27,0→9,3), koristusteenused (34,6→18,7), puhastusfirma (32,5→28,7).
- **Langenud (jälgida!):** koristusfirma 8,3→11,2, kontori koristus 3,4→5,1 (endiselt pos 4), hoolduskoristus 51,9→67.
- Hüpotees: väike langus on tüüpiline migratsioonijärgne raputamine + hooajaline augusti vaikus; klikkide päevamaht −13 % 8 päeva valimil pole veel statistiliselt otsustatav. **Järeldus: katastroofi pole, mõned märksõnad tõusevad selgelt, koristusfirma-dip vajab 2–3 nädala jälgimist.**

---

## 3. Kes on meist eespool + alamlehe tugevus

Indikatiivne (otsingu-API tulemused, mitte garanteeritud SERP-järjestus; GSC positsioon on täpne mõõt):

| Märksõna (meie pos) | Eespool olevad konkurendid | Alamleht piisav? |
|---|---|---|
| kontori koristus (3) | kohalikud + kaartpakk; kohati Lux Puhastus, kontorikoristus.com | ✓ tugev leht — aga title/meta ei müü (CTR 0,3%) |
| puhastusteenused (7,8) | PuhastusMeistrid, Tarkpuhastus, IM Puhastus, Lux Puhastus, Aadli, Heldris | ✓ hub olemas; vajab sisendatud "Tallinnas" katvust |
| koristusfirma (8,5) | koristusfirma.ee, Lux Puhastus, AKO, Eliitserv, Unikoristus, Prism | ✓ avaleht — hoida silma peal (dip) |
| puhastusfirma (31,6) | samad + kataloogid | ⚠️ hajutatud: avaleht vs /puhastusteenused/ — konsolideeri signaal |
| koristusteenused (33,4) | samad | ❌ Google valib meil vale lehe (/puhastusteenused/ pos 69); /koristusteenus/ hub vajab sõna "koristusteenused" sisu |
| akende pesu (36→25 ▲) | Aknapesu OÜ, Lux, IM Puhastus, Forus, kontorikoristus.com, Expertpuhastus, Heakorrapartner | ✓ uus leht tugev ja tõuseb; ootab vana URL-i konsolideerumist |
| hoolduskoristus (57) | Lux (185 €/kuu kalkulaator!), Clean-D, Spotless, hoolduskoristus.eu, kontorikoristus.com, Heldris, IHP, Staar | ❌ **eraldi lehte pole** — suurim sisulünk |
| suurpuhastus (18,6) | PuhastusMeistrid, Prism, Tarkpuhastus | ❌ ainult blogipost — vaja teenuselehte |
| ehitusjäätmete/prahi äravedu (10–11) | prügifirmad (Ragn-Sells jt), kataloogid | ✓ leht olemas, vajab sisu laiendust (mahud, hinnad, konteinerid) |
| fassaadipesu (33) | Aknapesu OÜ, Forus jt | ✓ leht olemas, vajab tugevdust |
| vaipade puhastus (40) | tekstiilipesu spetsialistid | ⚠️ leht olemas, nõrk (B2B fookus?) |
| клининг таллинн (13,5) | RU konkurendid | ✓ RU lehed olemas, vajavad optimeerimist |

---

## 4. Tegevusplaan

> **Olek 26.08:** punktid 1, 4, 5 ja 6 on juba teostatud — vt jaotis 5 "Teostatud tööd". Allpool algne kava koos tähtaegadega.

### Kohe ära teha (nädal 1: 27.–29.08)

1. **CTR-rünnak (suurim tasuvus, null uut sisu).** Meie positsioonid on palju paremad kui CTR — pos 3 leht saab 0,3 % klike. Kirjuta ümber title + meta description järgmistele lehtedele (järjekorras): `/koristusteenus/kontori-koristus/` (390 näitamist/28p!), `/` , `/puhastusteenused/`, `/ehitusprahi-aravedu/`, `/koristusteenus/`. Must eristaja: "300+ töötajat · 1 000 000 m² hoolduses · ISO 9001/14001 · alates 2006 · tasuta objekti ülevaatus · vastus 1 tööpäevaga". Eesmärk: CTR ≥ 3 % pos 3–8 märksõnadel → orgaanilised päringud võivad **topelduda ilma positsiooni muutmata**.
2. **Aruandluse kokkulepe:** tulemusnumber = Päringute tabel (DB) + Ads'i oma konversioon; GA4 võtmesündmused = ainult suundumus. (Dokumenteeri ja jaga kolleegiga.)
3. **GSC jälgimise järjehoidja:** kontrolli 01.09 ja 08.09, et vana URL-id (nt /valikoristus/akende-pesu/) kaovad GSC-st (308 redirect on olemas — konsolideerumine võtab 2–4 nädalat) ja "koristusfirma" positsioon taastub.

### 1–2 nädalat (kuni 05.09 — kolleegi soovitud tähtaja jooksul)

4. **Uus teenuseleht: `/hoolduskoristus/`** (või /koristusteenus/hoolduskoristus/) — B2B, hinnakalkulaatori-tüüpi sisu nagu Lux'il (näidishinnad alates X €/kuu, m²-põhine loogika), teenuse ulatus, sagedused, klienditüübid. Märksõnad: hoolduskoristus, äripindade hoolduskoristus, regulaarne koristus. **Suurim positsiooniline lünk (57 → eesmärk top 10).**
5. **Uus teenuseleht: suurpuhastus** (hetkel ainult blogipost) — linkida blogist teenuselehele.
6. **/koristusteenus/ hub'i sisu täiendus** sõnadega "koristusteenused", "koristusteenused Tallinnas", "koristusfirma" — et Google valiks selle lehe, mitte /puhastusteenused/.

### 2–4 nädalat (kuni ~19.09)

7. **Lehed:** trepikoja koristus / korteriühistute koristus (koristusfirma.ee domineerib sellega), põrandate süvapesu (või laienda põrandate-hooldus lehte süvapesu sektsiooniga + FAQ), ehitusprahi äravedu lehe laiendus (konteinerite suurused, hinnad, "ehitusjäätmete äravedu" fraas pealkirjadesse).
8. **RU lehtede optimeerimine** (клининг таллинн 160 näitamist pos 13,5 — top 5 realistlik).
9. **Siselingid märksõna-ankrutega** hub-lehtedelt alamlehtedele + blogipostitustest teenuselehtedele.
10. **Desinfitseerimise lehe ümbernimetamine** ("koroonaviiruse-järgne" on vananenud raamistus; säilita URL, uuenda sisu).

### Pidev

11. **Google Business Profile + arvustused** (kaardipakk on ärilistel märksõnadel esimene) — kogu süsteemne arvustuste voog (admin testimoniaalide süsteem on valmis).
12. **Linkide hankimine:** kliendi-case'id (üle 200 kliendi — logo-sein + lood), Äripäeva TOP-udisloo taaskasutus.
13. **Iganädalane GSC kontroll:** positsioonid + vana URL konsolideerumine; `npm run report:analytics` + GSC märksõnatõmbamise skript (`scripts/tmp-seo-analysis.ts` — kustutada või vormistada, korduvkasutatav).

### Rollid ja tähtajad

| Ülesanne | Kes | Millal |
|---|---|---|
| Title/meta CTR-pakk 5 lehele | Ronald (rakendan koodi) | 28.08 |
| Aruandluse definitsioonide kokkulepe kolleegiga | Ronald + kolleeg | 27.08 |
| /hoolduskoristus/ leht (sisu + teostus) | Ronald koostab, kinnitus | 02.09 |
| Suurpuhastuse leht | Ronald | 04.09 |
| /koristusteenus/ hub'i täiendus | Ronald | 05.09 |
| Trepikojad / põrandad / äravedu laiendused | Ronald | 12.–19.09 |
| RU optimeerimine | Ronald | 19.09 |
| GSC jälgimine | Ronald | 01.09, 08.09, edasi iganädalaselt |

---

## 5. Teostatud tööd (26.08.2026, samal päeval)

Järgmised tegevuskava punktid on **juba tehtud** (koodis, lokaliseeritud ET/EN/RU, testid rohelised — `tsc`, `eslint`, `npm test` (sh i18n-validatsioon 40 lehte / 28 definitsiooni), lehtede renderdus kontrollitud kõigis keeltes):

1. **CTR-pakk teostatud** — uued title + meta description järgmistel lehtedel (ET + EN + RU):
   - `/` — kirjeldus kannab nüüd 300+ töötajat · 1 000 000+ m² · 200+ klienti · ISO · tasuta ülevaatus · vastus 1 tööpäevaga
   - `/koristusteenus/kontori-koristus/` — "Kontori koristus Tallinnas — alates 1,20 €/m² | SPS Grupp" + 50+ kontori / tasuta audit / 1 tööpäev
   - `/koristusteenus/` — "Koristusteenused Tallinnas — kontorid, kaubandus, tootmine | SPS Grupp"
   - `/puhastusteenused/` — "Puhastusteenused Tallinnas — eritööd äriklientidele | SPS Grupp"
   - `/ehitusprahi-aravedu/` — "Ehitusprahi äravedu Tallinnas — kiire pakkumine | SPS Grupp"
2. **Uus teenuseleht `/koristusteenus/hoolduskoristus/`** (EN `/en/cleaning-services-in-tallinn/regular-cleaning/`, RU `…/регулярная-уборка/`) — täis B2B-leht: teenuse sisu (6 kaarti), miks-meie, hinnakujundus (alates 1,20 €/m² kuus), koristusplaani kokkulepped, 5 KKK, tööprotsess, JSON-LD + canonical/hreflang. See suleb suurima sisulünga (hoolduskoristus pos 57 → eesmärk top 10). Leht on lisatud menüüsse (Sisekoristus) ja footeri linkidesse.
   - **Kanibaliseerimise vält:** `/koristusteenus/` hub sihib üldpäringuid ("koristusteenused", "koristusfirma"), hoolduskoristuse leht spetsiifilist ("hoolduskoristus", "regulaarne koristus äripindadele"). Hub'i teenuste nimekirjas on nüüd ankur-lingiga "Hoolduskoristus" (ET/EN/RU), mis suunab päringu signaali alamlehele — kaks lehte ei konkureeri, vaid toetavad teineteist (hub ↔ leht lingitavad mõlemal suunal).
3. **Uus teenuseleht `/puhastusteenused/suurpuhastus/`** (EN `/specialist-cleaning-services/deep-cleaning/`, RU `…/генеральная-уборка/`) — suurpuhastusel oli varem vaid blogipost; nüüd on päris teenuseleht, samuti menüüs ja footeris.
4. **`/koristusteenus/` hub'i märksõnakatvus** — H1 nüüd "Koristusteenused äripindadele" (mitte ainsus), why-us pealkiri kannab "koristusfirmaks Tallinnas"; serviceName/description JSON-LD jaoks samuti mitmus. Eesmärk: "koristusteenused" päring peaks valima selle lehe, mitte /puhastusteenused/.
5. **Siselingid** — kontori-koristus lehe "Vaata lisaks" plokis lingid uutele hoolduskoristuse ja suurpuhastuse lehtedele.
6. **Registrid/sitemap/llms.txt** — uued lehed on kõigis registrites, sitemap.xml-s ja llms.txt-is (kõigis kolmes keeles).

**Mõõtmine edasi:** järgmine GSC kontroll 01.09 ja 08.09 — jälgida (a) "kontori koristus" CTR-i (praegu 0,3 % → eesmärk ≥3 %), (b) "koristusfirma" positsiooni taastumist, (c) vana URL-ide kadumist GSC-st, (d) uute lehtede indekseerumist ja positsioone ("hoolduskoristus", "suurpuhastus").

---

### Lisa: andmete tõmbamise tehniline märkus

Kõik arvud on tõmmatud Google'i ametlikest API-dest (teenuskonto `gcp-analytics.json`, read-only). Käivitatavad skriptid: `scripts/tmp-seo-analysis.ts` (GA4+GSC+DB tõmmang), `scripts/tmp-aggregate.js` (märksõnapered). Google Ads'i **kontopoolsed** konversiooniandmed (26) tulevad Ads'i UI-st — Ads API ligipääsu teenuskontol pole; kui tahame ka Ads'i poole automatiseerida, tuleb seadistada Ads API developer token (või piisab UI kokkulepitud definitsioonist).
