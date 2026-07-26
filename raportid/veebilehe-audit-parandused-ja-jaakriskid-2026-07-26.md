# SPS Grupi veebilehe audit, parandused ja jääkriskid

Kuupäev: 26.07.2026  
Projekt: `D:\WORKS\SPS\2026AprillWeb\AprilBuild`  
Kontrollitud lokaalne rakendus: `http://localhost:3001`

## Kokkuvõte

Audit hõlmas saidikaardi 140 URL-i, eesti-, inglise- ja venekeelseid lehti, vorme, hinnatekste ja -arvutusi, siselinke, URL-hierarhiat, metaandmeid ning 320, 360, 390 ja 768 px mobiili- ja tahvelvaateid.

Olulisemad tehnilised ja sisulised vead parandati. Production-build läbib kompileerimise, TypeScripti kontrolli ja 69 staatilise lehe genereerimise. Kõik 140 saidikaardi URL-i andsid süsteemse kontrolli ajal HTTP 200 ning neil olid olemas õige `lang`, pealkiri, H1 ja canonical.

Leht on pärast parandusi oluliselt järjepidevam, kuid enne avaldamist vajavad ärilist või emakeelse toimetaja kinnitust teenuste tegelikud hinnad ja osa venekeelsest müügitekstist. Vene URL-ide vana, kohati kärbitud struktuur on eraldi SEO-tehniline võlg.

## Tehtud parandused

### Jalus

- Jaluse logo suurendati desktopis mõõdule 288 × 50 px.
- 320 px vaates kuvatakse logo proportsionaalselt ligikaudu 224 × 39 px.
- Jaluse paigutus lülitub kuueveeruliseks alles suurel ekraanil, et 768 px tahvelvaates ei surutaks vene pikki linke liiga kitsastesse veergudesse.
- Logo alternatiivtekst ja autoriõiguse märk on korrektses UTF-8 kujus.

### Keeled ja sisu

- Parandati inglise ja vene arvustuste lehtede eestikeelsed tiitlid.
- Parandati inglise ja vene kojameheteenuse, lehekoristuse ja muruniitmise vales keeles tiitlid.
- Parandati plaatimistööde inglise ja vene tiitlid, mis kirjeldasid ekslikult krohvimist.
- Parandati ingliskeelne `Profesional` → `Professional`.
- Parandati ingliskeelne `graffity` → `graffiti`.
- Parandati vene välialade põhilehe ekslik „interjööride“ tähendus.
- Lokaliseeritud lehtede H1 moodustatakse nüüd teenuse nimest või loetavalt eraldatud pealkirjaosadest; enam ei liideta turunduslauseid üheks sõnavahedeta H1-ks.
- Vene kontaktilehe H1 muudeti loomulikuks: „Свяжитесь с SPS Grupp“.
- ET, EN ja RU vormide väljad, kohatäitjad, valikud, nõusolekud ning veateadete alusloogika on keelepõhised.

### Vormid

- Kontaktivorm kontrolliti kõigis kolmes keeles.
- Kandideerimisvorm kontrolliti kõigis kolmes keeles.
- Kandideerimisvormile lisati puudunud kohustuslik nimeväli.
- Nimeväli lisati ka serveripoolsesse valideerimisse, duplikaadikontrolli ja e-kirja sisusse.
- Kohustuslikud väljad on nimi, e-post, telefon ja privaatsusnõusolek.
- Vorme ei saadetud päriselt välja, et mitte tekitada ettevõttele testkirju ega võltsavaldusi. Seetõttu tuleb SMTP ja lõpliku adressaadini jõudmine teha eraldi kontrollitud testiga.

### Hinnad ja arvutused

- Hoolduskoristuse keskne valem on `pindala × 1,20 €/m² kuus`.
- Teenindusvahemik on 800–10 000 m².
- Kontrollitud näited:
  - 800 m² → 960 €/kuu;
  - 1 500 m² → 1 800 €/kuu;
  - 5 000 m² → 6 000 €/kuu;
  - 10 000 m² → 12 000 €/kuu.
- Sama valemit kasutavad hoolduskoristuse näidiskaardid ja kalkulaator.
- Alla 800 m² ja üle 10 000 m² väärtused ei lähe arvutusse.
- Desinfitseerimise lehelt eemaldati hoolduskoristuse kalkulaator, sest 1,20 €/m² kuuhind ei sobinud desinfitseerimise ühekordse töö konteksti.
- Ehitusjärgse koristuse kaardid ja ruutmeetrihinna kirjeldus viidi omavahel kooskõlla varasema parandusringi käigus.

Äriline piirang: audit saab kinnitada matemaatika ja lehesisese kooskõla, kuid mitte seda, kas näiteks torutööde, ventilatsiooni, aknapesu või jäätmeveo avaldatud alghinnad vastavad SPS Grupi tänasele hinnakirjale. Need arvud peab kinnitama hinnastamise eest vastutav inimene.

### Mobiil ja responsive

- Kontrolllaiused: 320, 360, 390 ja 768 px.
- Kontrollitud olid eri lehemallid: kontakt, karjäär, sise- ja välikoristuse teenuselehed ning EN/RU lokaliseeritud lehed.
- Vormiväljad mahtusid ekraanile ja nähtava teksti fondisuurus ei langenud alla 15 px.
- 320 px vaates üle serva ulatunud hero CTA-nupud laotuvad nüüd täislaiuses üksteise alla.
- Pikk leivapururada võib kitsal ekraanil mitmele reale murduda.
- 768 px vene jaluse linkide ülevool eemaldati jaluse murdepunkti muutmisega.
- Dekoratiivsed 800 px taustaringid jäävad teadlikult hero `overflow: hidden` ala sisse ega tekita dokumendi horisontaalset kerimist.

### Lingid, hierarhia ja SEO

- Välikoristuse canonical-hierarhia on nüüd:
  - `/koristusteenus/valikoristus/`;
  - selle all aknapesu, fassaadipesu, graffiti eemaldamine, kojameheteenus, lehekoristus, lumekoristus, muruniitmine ja tänavakivide hooldus.
- Vana `/valikoristus/...` suunatakse püsivalt uude hierarhiasse.
- Navigatsioon, jalus ja usaldusplokid viitavad uutele canonical-URL-idele.
- Koolikoristuse link ja structured data viitavad nüüd otse `/koolide-koristamine/`, mitte ümbersuunatavale alamteele.
- Desinfitseerimise link, canonical ja structured data viitavad nüüd otse `/puhastusteenused/koroonaviiruse-jargne-puhastus/`.
- Sisemised lokaliseeritud lingid genereeritakse lõpuslashiga, et vältida tarbetuid 308 ümbersuunamisi.
- Kõigil 140 saidikaardi lehel tuvastati `lang`, title, H1 ja canonical.
- Saidikaart ei sisalda enam vana välikoristuse URL-i.

## Jääkriskid ja soovitatud järeltegevused

### 1. Vene URL-id

Mitmed olemasolevad vene slug’id on kärbitud või sisaldavad kirillitsa ja ladina segamärke, näiteks `pipeworks` ning segatähtedega aknapesu slug. Lehe sisu toimib, kuid URL ei ole inimesele ega otsingumootorile ideaalne.

Soovitus: koostada kõigile vene teenustele lühikesed loomulikud slug’id ja lisada vanadelt URL-idelt üks-ühele 308 suunamised. Seda ei tohiks teha ilma täieliku migratsioonitabelita, sest olemasolevate indekseeritud URL-ide hooletu muutmine kahjustaks SEO-d.

### 2. Vene keele emakeelne toimetus

Peamised vales keeles ja semantiliselt valed pealkirjad parandati, kuid mahukas vene müügitekst on masintõlke taustaga. Emakeelne toimetaja peaks kontrollima käänamist, teenindusvaldkonna termineid, viisakustaset ja loomulikkust.

### 3. `messages/et.json` arhitektuur

Eesti sõnumifail sisaldab suurt hulka ingliskeelsete teenusetekstidega identseid väärtusi. Need ei ole praegu eestikeelsete põhilehtede nähtav sisu, sest ET teenuselehed kasutavad eraldi Reacti komponente. See on siiski regressioonirisk: tulevane üldkomponendile üleviimine võiks need ingliskeelsed tekstid kasutajale nähtavaks teha.

Soovitus: kas täita ET nimeruumid päris eestikeelse sisuga või eemaldada kasutamata dubleeritud teenusenimeruumid pärast sõltuvuste kontrolli.

### 4. Blogi vanad siselingid

Mõnes ajaloolises blogipostituses on vanad URL-id. Need jõuavad püsisuunamise kaudu õigesse kohta, kuid SEO seisukohalt on parem muuta postituste HTML-is lingid otse canonical-URL-idele.

### 5. Koormuse all dünaamilised lehed

Paralleelne kogu saidi süvaläbimine tekitas arendusserveris ja hiljem väga pika production-linkide stressikontrolli käigus mõne blogi- ja töökuulutuse päringu timeout’i. Tavalises järjestikuses kontrollis ning production-buildis viga ei ilmnenud. Enne avaldamist tasub teha eraldi koormus- ja andmebaasiühenduste test.

### 6. Väline funktsionaalne kontroll

Audit ei saatnud vorme, ei muutnud andmebaasi ega kontrollinud väliste saitide (Facebook, Google Maps, taust.ee) tegelikku sihtsisu. Need vajavad turvalist käsitsi smoke-testi avaldamiskeskkonnas.

## Kontrollide tulemused

| Kontroll | Tulemus |
|---|---|
| Saidikaardi URL-id | 140/140 HTTP 200 süsteemse läbimise ajal |
| `lang`, title, H1, canonical | olemas 140/140 saidikaardi URL-il |
| Mobiililaiused | 320, 360, 390 ja 768 px kontrollitud |
| Minimaalne nähtav fondisuurus | kontrollitud vaadetes vähemalt 15 px |
| Kontaktivorm | ET/EN/RU väljad ja kohustuslikkus kontrollitud |
| Kandideerimisvorm | ET/EN/RU väljad ja kohustuslikkus kontrollitud |
| Hoolduskoristuse valem | matemaatiliselt korrektne ja tsentraliseeritud |
| TypeScript | `npx tsc --noEmit` läbitud |
| ESLint | 0 viga; 5 olemasolevat unused-disable hoiatust abiskriptides |
| Production-build | läbitud |

## Lõpphinnang

Kriitilised kasutajale nähtavad keele-, URL-, vormi-, hinna- ja mobiilivead on parandatud. Avaldamise eel on kõige olulisemad ülejäänud tööd vene emakeelne sisutoimetus, vene slug’ide kontrollitud SEO-migratsioon, äriliste hindade omaniku kinnitus ning vormide üks päris testsaadetis kontrollitud adressaadile.
