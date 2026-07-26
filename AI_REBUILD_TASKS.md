# AI tööjuhis: SPS Grupi veebilehe tehniline ümberehitus eraldi kataloogi

## 0. Dokumendi eesmärk

See dokument on täitmiseks AI-arendusagendile.

Ülesanne on luua SPS Grupi olemasolevast veebilehest eraldi uues kataloogis tehniliselt korrastatud versioon. Olemasolev disain, lehtede nähtav ülesehitus, sisusektsioonide järjestus ja kasutaja funktsionaalsus tuleb säilitada. Lubatud ja nõutud on tehnilise arhitektuuri, tõlkehalduse, töökindluse, SEO-signaalide, URL-ide, hinnaloogika, vormivalideerimise ning tõendatud vigade parandamine.

See ei ole redesign. See ei ole sisustrateegia muutmine. See ei ole võimalus asendada olemasolev leht uue visuaalse malli või uue brändikeelega.

## 0.1. Täitva mudeli eeldatav võimekus

Juhend on kirjutatud eeldusel, et teostaja on madalama võimekusega keelemudel. Seetõttu:

- ära eelda puuduvaid nõudeid;
- ära tee mitut loogilist muudatust korraga;
- ära loe kompileeruvat koodi automaatselt õigeks;
- ära üldista ühe lehe tulemust kogu saidile;
- ära nimeta ülesannet valmis enne kõigi selle kontrollide läbimist;
- kopeeri olemasolevat nähtavat lahendust täpselt, mitte mälu ega maitse järgi;
- kasuta igas tsüklis enne–pärast tõendusmaterjali.

Kui nõue, andmeallikas või soovitud tulemus pole üheselt arusaadav:

1. lisa küsimus faili `MIGRATION_DECISIONS.md`;
2. kirjelda olemasolev olukord;
3. kirjelda kaks võimalikku lahendust;
4. märgi üks variant põhjendatud soovituseks;
5. peata ainult sellest otsusest sõltuv töö;
6. jätka sõltumatute ülesannetega;
7. küsi kasutajalt kinnitust enne nähtavat, URL-i või äriloogikat muutvat lahendust.

## 0.2. Ühe töötsükli maksimaalne ulatus

Üks töötsükkel võib muuta ainult üht järgnevat:

- üht registrit;
- üht andmeskeemi;
- üht abifunktsiooni;
- üht jagatud komponenti;
- üht lehte ühes keeles;
- ühe lehe metadata loogikat;
- üht URL-i või redirect-reeglit;
- üht hinnareeglit;
- ühe vormi üht valideerimisreeglit;
- üht mobiilse ülevaate viga;
- üht seotud testide rühma.

Ühes töötsüklis on keelatud:

- migreerida korraga mitut teenuselehte;
- muuta samal ajal URL-i, sisu, disaini ja hinnaloogikat;
- teha kogu projekti massilist otsi-asenda toimingut;
- kustutada vana rakendustee samas tsüklis, kus uus tee alles lisati;
- parandada kontrolli käigus avastatud sõltumatut viga samas muudatuses;
- muuta faile, mida töötsükli alguses ei loetletud.

Kui kontroll avastab uue sõltumatu vea, lisa see `REBUILD_BACKLOG.md` faili eraldi ülesandena.

## 0.3. Kohustuslik töötsükli mall

Enne koodi muutmist lisa faili `REBUILD_PROGRESS.md`:

```text
Töötsükli ID:
Üks eesmärk:
Muudetavad failid:
Failid ja käitumine, mida ei muudeta:
Lähteversiooni tõendusmaterjal:
Oodatav tulemus:
Kontrollkäsk:
Visuaalselt kontrollitavad URL-id ja vaatelaiused:
Tagasipööramise viis:
Olek: ALUSTAMATA
```

Pärast muudatust täida sama töötsükli juures:

```text
Tegelik tulemus:
Muudetud failid:
Läbitud kontrollid:
Ebaõnnestunud kontrollid:
Kõrvalekalded oodatud tulemusest:
Kas visuaal muutus: JAH/EI
Kas tekst muutus: JAH/EI
Kas URL või SEO-signaal muutus: JAH/EI
Kas vana lahenduse eemaldamine on nüüd ohutu: JAH/EI
Olek: VALMIS / BLOKEERITUD / TAGASI PÖÖRATUD
```

`VALMIS` on lubatud ainult siis, kui kõik eelnevalt kirjeldatud kontrollid on edukad.

## 0.4. Madalama mudeli peatumisreeglid

Peata sõltuv töö ja küsi kasutajalt otsus, kui:

- pole võimalik kindlaks teha, milline kahest hinnast on õige;
- muudatus mõjutaks ettevõtte lubadust, teenuse ulatust või lepingutingimust;
- olemasolevad keeleversioonid ütlevad sisuliselt erinevaid asju;
- korrektne vene sõnastus muudaks väite tähendust;
- URL-i muutmine vajab valikut mitme mõistliku canonical-lahenduse vahel;
- lähte- ja sihtversiooni visuaal erinevad, kuid otsest tehnilist põhjust ei leita;
- paranduseks oleks vaja sektsiooni lisada, eemaldada või ümber paigutada;
- test ebaõnnestub kolm korda sama põhjusega;
- lähteprojektis tekib ootamatu muudatus;
- vajalik saladus, väline teenus või andmebaas pole turvaliselt kättesaadav.

Ära peata kogu projekti, kui blokeeritud on ainult üks leht või üks otsus.

## 0.5. Otsustusprioriteet

Kui kaks juhist näivad vastuolulised, kasuta järgmist prioriteeti:

1. kasutaja viimane otsene korraldus;
2. `AGENTS.md`;
3. selle faili keelud ja vastuvõtukriteeriumid;
4. auditis tõendatud faktid;
5. renderdatud lähteversioon;
6. lähtekood;
7. muud projektidokumendid;
8. mudeli enda oletus.

Madalama prioriteediga allikas ei tohi kõrgema prioriteediga nõuet tühistada.

## 0.6. Keelatud ebamäärased tegevused

Ebamäärane ülesanne tuleb enne töö alustamist teisendada mõõdetavaks ülesandeks.

Keelatud:

- „paranda SEO”;
- „korrasta tõlked”;
- „tee responsive korda”;
- „refaktoreeri teenuselehed”;
- „paranda hinnad”;
- „puhasta kood”.

Lubatud kuju:

- „muuda kontorikoristuse ET canonical registripõhiseks ja kontrolli täpset URL-i”;
- „asenda kontorikoristuse RU lehel kolm auditis nimetatud otsetõlget, muutmata väidete sisu”;
- „eemalda 390 px vaates hinnakaardi horisontaalne ülevool, muutmata desktopi paigutust”;
- „lisa kalkulaatorile test, mis kinnitab 800 m² alampiiri praeguse ärireegli järgi”;
- „eemalda vana slug-map alles pärast kõigi tarbijate otsingut ja vastavustesti”.

## 1. Kohustuslikud lähte- ja sihtkohad

### 1.1. Lähteprojekt

```text
D:\WORKS\SPS\2026AprillWeb\AprilBuild
```

Lähteprojekti tuleb käsitleda auditeeritava referentsina.

### 1.2. Uus sihtprojekt

```text
D:\WORKS\SPS\2026AprillWeb\AprilBuild-Rebuild
```

Sihtprojekt peab olema lähteprojekti kõrvalkataloog, mitte lähteprojekti alamkataloog.

Põhjus:

- pesastatud Next.js projekt võib sattuda lähteprojekti buildi, Tailwindi, TypeScripti või failide avastamise ulatusse;
- kõrvalkataloog võimaldab lähte- ja sihtversiooni paralleelselt käivitada;
- visuaalset ja funktsionaalset regressiooni saab võrrelda kahe eraldi serveri vahel;
- lähteprojekti ei ole vaja migratsiooni ajal muuta.

## 2. Kõige olulisemad piirangud

### 2.1. Lähteprojekti ei tohi muuta

AI ei tohi lähteprojektis:

- muuta ühtegi lähtekoodifaili;
- vormindada faile;
- käivitada automaatset `--fix` toimingut;
- kustutada või teisaldada faile;
- installida ega uuendada sõltuvusi;
- muuta `.env.local` faili;
- muuta andmebaasi;
- muuta Verceli seadeid;
- muuta avalikku produktsioonilehte;
- kirjutada uusi logisid lähteprojekti, kui seda saab vältida;
- teha commit’i lähteprojekti;
- puhastada lähteprojekti tööpuud.

Lähteprojektis juba olevad muudatused kuuluvad kasutajale. Neid ei tohi lähtestada, stash’ida, commit’ida ega üle kirjutada.

### 2.2. Disaini ei tohi muuta

Säilitada tuleb:

- värvid;
- fondid;
- fondikaalud;
- minimaalselt 15 px tekst;
- sektsioonide taustad;
- hero-pildid;
- piltide paigutus;
- kaardikujundus;
- nupustiilid;
- navigatsiooni visuaal;
- jaluse visuaal;
- olemasolevad animatsioonid, kui need ei põhjusta ligipääsetavus- või töökindlusviga;
- desktopi ja mobiili üldine visuaalne identiteet;
- lehtede visuaalne sektsioonide järjekord.

Lubatud disainiparandused on ainult tõendatud veaparandused:

- ekraanilt välja mineva elemendi mahutamine;
- horisontaalse ülevoolu eemaldamine;
- loetamatu kontrasti parandamine võimalikult väikese muudatusega;
- vigase reamurdmise parandamine;
- fookusstiili lisamine;
- vähemalt 44 × 44 px puuteala tagamine;
- `prefers-reduced-motion` toe lisamine;
- puuduva alt-teksti või semantilise märgistuse lisamine.

Kui parandus muudaks nähtavalt kompositsiooni, peab AI selle enne teostamist kirjeldama failis `MIGRATION_DECISIONS.md` ja küsima kasutaja kinnitust.

### 2.3. Sisu ülesehitust ei tohi muuta

Ilma eraldi kasutaja kinnitamiseta ei tohi:

- lisada uusi turundussektsioone;
- eemaldada olemasolevaid sisusektsioone;
- muuta sektsioonide järjestust;
- muuta lehe põhieesmärki;
- ühendada eri teenuseid üheks leheks;
- jagada ühte teenust mitmeks uueks avalikuks leheks;
- muuta CTA-de ärilist eesmärki;
- asendada olemasolevat teksti uue turunduskontseptsiooniga;
- muuta blogi teemade valikut.

Lubatud sisumuudatused:

- õigekirja parandamine;
- grammatika parandamine;
- segakeele eemaldamine;
- ilmse otsetõlke loomulikuks muutmine;
- vale teenusenimetuse parandamine;
- vigase ühiku või hinnavormingu parandamine;
- tõendatud loogikavea parandamine;
- aegunud või vastuolulise fakti märkimine otsust vajavaks;
- SEO title’i parandamine nii, et lehe tähendus ei muutu;
- vigase lingi või anchor’i parandamine.

### 2.4. Äriotsuseid ei tohi oletada

AI ei tohi iseseisvalt otsustada:

- kas 1,20 €/m² on tegelik kehtiv alghind;
- kas hind sisaldab käibemaksu;
- kas 800 m² on absoluutne miinimum;
- kas 10 000 m² kalkulaatori ülempiir on teadlik;
- kas ettevõte alustas 2006. või 2007. aastal;
- kas välikoristuse canonical peab olema lühike või pikk URL;
- kas telefon peab kontaktivormis olema kohustuslik;
- kas tööpiirkond peab kandideerimisvormis olema kohustuslik;
- kas ajalooline blogipostitus tuleb eemaldada;
- kas venekeelsed URL-id võib produktsioonis ümber nimetada.

Need küsimused tuleb lisada `MIGRATION_DECISIONS.md` faili koos:

- praeguse olukorraga;
- leitud vastuoluga;
- soovitatud variandiga;
- alternatiiviga;
- mõjuga;
- vajaliku kasutaja otsusega.

Töö võib jätkuda osades, mida otsus ei blokeeri.

## 3. Kohustuslikud referentsdokumendid

Enne muudatuste alustamist tuleb täielikult läbi lugeda:

```text
D:\WORKS\SPS\2026AprillWeb\AprilBuild\AGENTS.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\ARCHITECTURE.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\DESIGN.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\TRANSLATIONS.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\i18n-plan.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\LIVE_URL_I18N_SEO_TASKS.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\AI_REBUILD_TASKS.md
D:\WORKS\SPS\2026AprillWeb\AprilBuild\raportid\veebilehe-sisu-keelte-hindade-vormide-mobiili-ja-seo-audit-2026-07-25.md
```

Enne Next.js koodi kirjutamist tuleb lugeda sihtprojektis kasutatava versiooni vastavad kohalikud juhendid kataloogist:

```text
node_modules/next/dist/docs/
```

Vähemalt:

- App Routeri projektistruktuur;
- Server ja Client Components;
- internationalization;
- metadata;
- sitemap;
- redirects;
- Proxy;
- dynamic routes;
- kasutatavad testimisjuhendid.

Next.js API-sid ei tohi kirjutada mälust, kui projekti kohalikes juhendites on vastav teema olemas.

Madalama mudeli dokumentatsiooni kasutamise kord:

1. vali ainult käesoleva töötsükli jaoks vajalik Next.js teema;
2. loe vastav kohalik dokument enne koodi muutmist lõpuni;
3. kirjuta `REBUILD_PROGRESS.md` faili loetud dokumendi täpne failitee;
4. kirjuta ühe lausega, millist reeglit käesolevas muudatuses rakendad;
5. kontrolli, et näide vastab projekti tegelikule Next.js versioonile ja App Routerile;
6. ära kopeeri dokumentatsiooni näidet pimesi, vaid sobita ainult vajalik osa olemasolevasse arhitektuuri;
7. kui kohalik dokumentatsioon ja olemasolev kood erinevad, dokumenteeri erinevus enne koodi muutmist.

Kõiki Next.js dokumente ei pea iga töötsükli alguses uuesti lugema. Lugeda tuleb tervikuna selle töötsükli teemat puudutav dokument ning säilitada loetud dokumentide register.

## 4. Töökorraldus ja tõendusmaterjal

### 4.1. Töö tuleb jagada kontrollitavateks etappideks

Iga etapi lõpus:

- käivita lint;
- käivita TypeScript või build;
- käivita asjakohased testid;
- võrdle lähte- ja sihtrakendust;
- uuenda `REBUILD_PROGRESS.md`;
- kirjelda kõrvalekalded;
- ära liigu edasi, kui etapi vastuvõtukriteeriumid ei ole täidetud.

### 4.2. Uues projektis loodavad juhtfailid

Sihtprojekti juurkausta tuleb luua:

```text
REBUILD_PROGRESS.md
MIGRATION_DECISIONS.md
VISUAL_DIFFERENCES.md
CONTENT_CORRECTIONS.md
URL_MIGRATION_MAP.md
TEST_RESULTS.md
```

Nende eesmärgid:

- `REBUILD_PROGRESS.md` — tehtud ja tegemata ülesanded;
- `MIGRATION_DECISIONS.md` — kasutaja otsust vajavad küsimused;
- `VISUAL_DIFFERENCES.md` — kõik lubatud või vältimatud visuaalsed erinevused;
- `CONTENT_CORRECTIONS.md` — iga teksti- või tõlkeparandus enne/pärast kujul;
- `URL_MIGRATION_MAP.md` — canonical’id ja redirect’id;
- `TEST_RESULTS.md` — buildi, testide, crawler’i ja brauserikontrollide tulemused.

### 4.3. Muudatuste jälgitavus

Iga oluline muudatus peab vastama vähemalt ühele põhjusele:

- lähteprojektis tõendatud viga;
- auditis kirjeldatud viga;
- Next.js kohaliku dokumentatsiooni nõue;
- ligipääsetavusnõue;
- töökindluse probleem;
- kasutaja kinnitatud otsus.

Ära tee muudatust ainult põhjendusega “see tundub puhtam”.

## 5. Etapp 1 — lähteprojekti turvaline inventuur

### Ülesanded

- [ ] Kontrolli lähteprojekti absoluutset asukohta.
- [ ] Kontrolli lähteprojekti Git staatust.
- [ ] Salvesta Git staatuse kokkuvõte, kuid ära muuda seda.
- [ ] Loe `package.json`.
- [ ] Tuvasta täpne Next.js, Reacti ja `next-intl` versioon.
- [ ] Tuvasta Node.js versioon.
- [ ] Loetle kõik avalikud App Routeri route’id.
- [ ] Loetle kõik API route’id.
- [ ] Loetle admin-route’id.
- [ ] Loetle variandi- ja tööriistalehed, mida ei tohi avalikku sitemap’i lisada.
- [ ] Loetle kõik `page.tsx`, `layout.tsx`, `route.ts`, `not-found.tsx`, `robots.ts` ja `sitemap.ts` failid.
- [ ] Loetle kõik avalikud pildid ja muud staatilised varad.
- [ ] Tuvasta kõik andmeallikad:
  - JSON;
  - andmebaas;
  - Vercel Blob;
  - keskkonnamuutujad;
  - genereeritud TypeScript;
  - WordPressi migratsiooniandmed.
- [ ] Loetle kõik vormid ja nende Server Actions.
- [ ] Loetle kõik hinnastuse allikad.
- [ ] Loetle kõik keelefailid.
- [ ] Loetle kõik URL-i- ja metadata registrid.
- [ ] Tuvasta kõik dubleeruvad route’id.
- [ ] Tuvasta kõik lehed, mis kasutavad `"use client"`.
- [ ] Märgi, millised neist vajavad tegelikult brauseri olekut või sündmusi.
- [ ] Salvesta inventuur `REBUILD_PROGRESS.md` faili.

### Kontroll

- [ ] Ühtegi lähtefaili ei ole muudetud.
- [ ] Kõik avalikud route’id on inventuuris.
- [ ] Kõik andmeallikad on dokumenteeritud.

## 6. Etapp 2 — renderdatud lähteversiooni baasjoon

### Eesmärk

Enne tehnilist ümbertegemist tuleb fikseerida, kuidas leht tegelikult välja näeb ja töötab. Ainult lähtekoodi kopeerimisest ei piisa.

### Ülesanded

- [ ] Käivita lähterakendus eraldi pordil, soovituslikult `3001`.
- [ ] Ära kasuta mõne teise projekti serverit ekslikult referentsina.
- [ ] Loe sitemap.
- [ ] Salvesta sitemap’i URL-ide loend.
- [ ] Ava kõik sitemap’i URL-id kontrollitud crawler’iga.
- [ ] Salvesta iga URL-i:
  - staatus;
  - lõplik URL;
  - redirect;
  - title;
  - description;
  - canonical;
  - `hreflang`;
  - `html lang`;
  - H1-de arv ja tekst;
  - siselinkide loend;
  - vormide arv;
  - laadimisaeg.
- [ ] Märgi timeout’id eraldi, mitte automaatselt 404-ks.
- [ ] Tee representatiivsetest lehemallidest ekraanipildid.
- [ ] Tee ekraanipildid laiustel:
  - 320 px;
  - 360 px;
  - 390 px;
  - 768 px;
  - 1024 px;
  - 1440 px.
- [ ] Tee vähemalt järgmiste lehtede pildid kõigis keeltes:
  - avaleht;
  - regulaarse koristuse põhileht;
  - kontorikoristus;
  - ehitusjärgne koristus;
  - välikoristuse põhileht;
  - üks pika vene pealkirjaga leht;
  - remonditeenuste põhileht;
  - kontakt;
  - karjäär;
  - blogi;
  - arvustused;
  - privaatsus;
  - 404.
- [ ] Salvesta nähtavate sektsioonide järjekord iga lehemalli kohta.
- [ ] Salvesta navigeerimise käitumine.
- [ ] Salvesta mobiilimenüü käitumine.
- [ ] Salvesta vormiväljade nimed, label’id ja kohustuslikkus.
- [ ] Salvesta kalkulaatori väljundid piirväärtustel.

### Kontroll

- [ ] Baasjoon on piisav, et sihtrakenduse visuaalset võrdsust hiljem tõendada.
- [ ] Baasjoone failid asuvad ainult sihtprojekti testide või artefaktide kataloogis.

## 7. Etapp 3 — sihtkataloogi loomine ja ohutu koopia

### Turvakontroll enne loomist

- [ ] Lahenda sihttee absoluutseks teeks.
- [ ] Kontrolli, et sihttee oleks täpselt:

```text
D:\WORKS\SPS\2026AprillWeb\AprilBuild-Rebuild
```

- [ ] Kontrolli, et sihttee ei oleks lähteprojekti sees.
- [ ] Kontrolli, kas sihtkataloog juba eksisteerib.
- [ ] Kui sihtkataloog sisaldab faile, peatu ja küsi kasutajalt juhiseid.
- [ ] Ära kustuta ega tühjenda olemasolevat sihtkataloogi automaatselt.

### Kopeeritavad osad

- [ ] Kopeeri rakenduse lähtekood.
- [ ] Kopeeri `public`.
- [ ] Kopeeri vajalikud `data` failid.
- [ ] Kopeeri Drizzle’i skeem ja migratsioonid.
- [ ] Kopeeri vajalikud skriptid.
- [ ] Kopeeri dokumentatsioon.
- [ ] Kopeeri `package.json` ja lukufail.
- [ ] Kopeeri TypeScripti, ESLinti, PostCSS-i ja Next.js konfiguratsioon.
- [ ] Kopeeri `.env.local.example`.
- [ ] Kopeeri `.gitignore`.
- [ ] Loo uus `AGENTS.md`, mis sisaldab vähemalt:
  - Next.js kohalike juhendite lugemise nõuet;
  - minimaalselt 15 px kirjasuuruse nõuet;
  - disaini muutmise keeldu;
  - lähteprojekti puutumatuse nõuet.

### Mitte kopeerida

- [ ] Ära kopeeri `.git`.
- [ ] Ära kopeeri `.next`.
- [ ] Ära kopeeri `node_modules`.
- [ ] Ära kopeeri logifaile.
- [ ] Ära kopeeri buildi artefakte.
- [ ] Ära kopeeri `tsconfig.tsbuildinfo`.
- [ ] Ära kopeeri päris `.env.local` faili automaatselt.
- [ ] Ära kopeeri paroole, võtmeid ega muid saladusi.
- [ ] Ära kopeeri mittevajalikke ajutisi varukoopiaid.

### Keskkond

- [ ] Loo `.env.local` ainult kasutaja antud või turvalistest lokaalse testimise väärtustest.
- [ ] Ära kuva keskkonnamuutujate väärtusi logides.
- [ ] Kasuta test-e-posti või blokeeritud saatmist, kuni vormitestideks antakse luba.
- [ ] Ära ühenda migratsiooni käigus tootmisandmebaasiga kirjutamisõiguses.

### Kontroll

- [ ] Sihtprojekt installib sõltuvused puhtalt.
- [ ] Esialgne koopia buildib enne arhitektuurimuudatusi.
- [ ] Lähteprojekti Git staatus ei ole muutunud.

## 8. Etapp 4 — sihtprojekti esialgne käivitamine

### Ülesanded

- [ ] Paigalda sõltuvused lukufaili järgi.
- [ ] Käivita lint.
- [ ] Käivita TypeScripti kontroll.
- [ ] Käivita tootmisbuild.
- [ ] Käivita sihtrakendus teisel pordil, soovituslikult `3100`.
- [ ] Võrdle lähte- ja sihtrakenduse põhilehti.
- [ ] Kontrolli kõigi avalike varade laadimist.
- [ ] Kontrolli fonte.
- [ ] Kontrolli CSP-d.
- [ ] Kontrolli vormide renderdust ilma päris saatmiseta.
- [ ] Kontrolli API-de read-only vastuseid.
- [ ] Dokumenteeri esialgsed erinevused.

### Stop-tingimus

Ära alusta arhitektuuri muutmist, kui puhas koopia ei buildi või selle renderdus erineb lähteversioonist teadmata põhjusel.

## 9. Etapp 5 — automaattestide baasraamistik

### Ülesanded

- [ ] Kasuta projekti Next.js versiooni dokumentatsioonis toetatud testilahendust.
- [ ] Lisa Playwright E2E testid.
- [ ] Lisa üksused TypeScripti puhaste funktsioonide testimiseks.
- [ ] Lisa route’ide inventuuritest.
- [ ] Lisa siselinkide crawler.
- [ ] Lisa metadata kontroll.
- [ ] Lisa visuaalsete regressioonide test.
- [ ] Lisa mobiilse ülevoolu test.
- [ ] Lisa minimaalse kirjasuuruse test.
- [ ] Lisa vormiväljade skeemi test.
- [ ] Lisa hinnastuse test.
- [ ] Lisa tõlkeskeemi test.
- [ ] Lisa dubleeruvate canonical’ide test.
- [ ] Lisa segatähestikuga vene slugide test.
- [ ] Lisa sitemap’i 200-vastuste test.

### Testide minimaalne ulatus

Iga avalik lehemall tuleb testida:

- ET;
- EN;
- RU;
- mobiil;
- desktop.

### Kontroll

- [ ] Testid tuvastavad vähemalt auditis kirjeldatud praegused vead.
- [ ] Visuaalne test ei kiida heaks kontrollimata massmuudatust.

## 10. Etapp 6 — arhitektuuri konsolideerimine ilma nähtavat väljundit muutmata

### Eesmärk

Korrastada koodi vastutused nii, et renderdatud disain ja sisusektsioonide järjestus ei muutuks.

### Oluline põhimõte

Ära suru kõiki lehti ühte universaalsesse malli, kui see muudab praegust DOM-i, visuaali või sektsioonide struktuuri. Lubatud on mitu tüübitud lehemalli.

Soovituslikud mallid:

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

### Ülesanded

Tee järgmised alamtsüklid täpselt selles järjekorras. Iga nummerdatud rida on eraldi töötsükkel koos punktis 0.3 nõutud dokumentatsiooni ja kontrolliga.

1. [ ] Loo ainult `Locale` tüüp väärtustega `et`, `en`, `ru`; lisa tüübikontroll; ära muuda route’e.
2. [ ] Loo ainult püsiv `PageId` tüüp; lisa test, mis välistab duplikaat-ID-d; ära muuda renderdust.
3. [ ] Defineeri ainult `PageDefinition` skeem järgmiste väljadega:
   - ID;
   - lehe tüüp;
   - parent ID;
   - ET URL;
   - EN URL;
   - RU URL;
   - sisumoodul;
   - template;
   - vormitüüp;
   - sitemap’i prioriteet;
   - indekseerimise olek.
4. [ ] Lisa skeemile runtime-valideerimine või selge test, mis tuvastab puuduva locale’i URL-i, vigase parent ID ja duplikaat-URL-i.
5. [ ] Lisa uude registrisse ainult kontorikoristuse leheperekond: selle kategooria, teenuseleht ja kolm locale’i URL-i.
6. [ ] Lisa vastavustest, mis võrdleb kontorikoristuse uusi registriväärtusi olemasolevate andmeallikatega.
7. [ ] Loo route’i lahendaja ainult puhta funktsioonina; testi ET, EN, RU, tundmatut URL-i ja duplikaadi tuvastamist; ära ühenda seda veel route’iga.
8. [ ] Loo keele URL-i leidmise puhas funktsioon; testi kõik kuus keelevahetuse suunda kontorikoristuse lehel.
9. [ ] Loo parent-hierarhia puhas funktsioon; testi teenus → kategooria → avaleht ahelat ja tsükli tuvastamist.
10. [ ] Loo canonical’i leidmise puhas funktsioon; kontrolli iga locale’i self-canonical’i.
11. [ ] Loo `hreflang` alternatiivide puhas funktsioon; kontrolli `et`, `en`, `ru` ja kokkulepitud `x-default` väärtust.
12. [ ] Loo breadcrumb’ide puhas funktsioon; kontrolli teksti, järjekorda ja locale’i URL-e.
13. [ ] Ühenda uus register ainult kontorikoristuse metadata genereerimisega; võrdle title’it, description’it, canonical’i ja alternatiive.
14. [ ] Ühenda uus register ainult kontorikoristuse sitemap’i kirjega; kontrolli, et vana ja uus tee ei tekita duplikaati.
15. [ ] Ühenda kontorikoristuse route uue lahendajaga, säilitades sama renderdatud DOM-i, sisu ja URL-i.
16. [ ] Tee kontorikoristuse ET, EN ja RU visuaalne ning funktsionaalne regressioonikontroll.
17. [ ] Esita piloodi tulemus kasutajale. Ära migreeri järgmist lehte enne piloodi tehnilise lahenduse kontrollimist.

Pärast pilooti migreeri iga järgmine registrikirje eraldi järgmise 13-sammulise kontrolliga:

1. [ ] määra üks püsiv lehe ID;
2. [ ] määra lehe tüüp ja parent ID;
3. [ ] sisesta ET, EN ja RU täpsed olemasolevad URL-id;
4. [ ] kontrolli kõigi kolme URL-i tegelikku vastust lähteversioonis;
5. [ ] määra sisumoodul ja template ilma sektsioonide järjekorda muutmata;
6. [ ] määra vormitüüp, sitemap’i prioriteet ja indekseerimise olek;
7. [ ] käivita skeemi- ja duplikaaditest;
8. [ ] käivita vana ja uue andmeallika vastavustest;
9. [ ] kontrolli route, keelevahetus ja parent-hierarhia;
10. [ ] kontrolli canonical, `hreflang`, breadcrumb ja sitemap;
11. [ ] võrdle ET, EN ja RU renderdust desktopis;
12. [ ] võrdle ET, EN ja RU renderdust mobiilis;
13. [ ] märgi vana registrikirje eemaldatavaks alles siis, kui koodiotsing ei leia ühtki vana tarbijat.

Konsolideeri `page-registry`, `slug-map`, `localized-content` ja metadata registry ainult lehekaupa. Vana registrit ei tohi eemaldada enne, kui kõik selle tarbijad on migreeritud ja ajutised vastavustestid läbivad.

### Serveri ja kliendi piir

- [ ] Hoia staatilised leheosad Server Components’ina.
- [ ] Ära lisa `"use client"` terviklikule lehele ainult ühe interaktiivse alamkomponendi tõttu.
- [ ] Eralda kliendikomponentideks ainult:
  - kalkulaator;
  - FAQ akordion;
  - vorm;
  - mobiilimenüü;
  - interaktiivne karussell;
  - muu tegelikult brauseri olekut vajav osa.
- [ ] Kontrolli pärast iga piiri muutmist hydration’i.

### Kontroll

- [ ] Lähte- ja sihtlehtede visuaalne erinevus jääb lubatud tolerantsi.
- [ ] Sektsioonide arv ja järjestus ei muutu.
- [ ] Tekstid ei muutu selles etapis.
- [ ] URL-id ei muutu selles etapis.

## 11. Etapp 7 — sisuallikate korrastamine

### Eesmärk

Vältida olukorda, kus eesti sisu on JSX-is, teine eesti koopia JSON-is ning EN/RU kasutavad kolmandat teed.

### Ülesanded

- [ ] Eralda lühikesed UI-tekstid pikkadest lehesisudest.
- [ ] Jäta `next-intl` sõnumitesse:
  - navigatsioon;
  - vormi label’id;
  - nupud;
  - validatsioon;
  - üldised UI-teated;
  - jaluse üldtekstid.
- [ ] Vii pikad teenusesisud tüübitud sisumoodulitesse.
- [ ] Loo iga lehe kohta sama skeemiga ET, EN ja RU sisu.
- [ ] Säilita praegune nähtav ET sisu lähteallikana.
- [ ] Ära võta `et.json` ingliskeelseid teenuseplokke automaatselt õigeks ET sisuks.
- [ ] Võrdle iga ET sisumoodulit renderdatud eestikeelse lähtelehega.
- [ ] Säilita kõik olemasolevad sisusektsioonid.
- [ ] Säilita sektsioonide järjestus.
- [ ] Säilita pildid ja alt-tekst, parandades ainult tõendatud vigu.
- [ ] Asenda `item0Title` tüüpi struktuurid päris massiividega ainult siis, kui renderdus jääb identseks.
- [ ] Väldi toore HTML-i hoidmist JSON-stringis.
- [ ] Kui rich text on vältimatu, kasuta piiratud ja turvalist rendererit.
- [ ] Eemalda `dangerouslySetInnerHTML` kohtadest, kus sisu saab struktureerida.
- [ ] Lisa kasutamata tõlkevõtmete raport.
- [ ] Lisa puuduvate tõlgete test.
- [ ] Lisa põhjendamatult identsete pikkade ET/EN väärtuste test.

### Pilot

- [ ] Migreeri kõigepealt üks teenus, soovituslikult kontorikoristus.
- [ ] Võrdle ET, EN ja RU renderdust.
- [ ] Kinnita, et disain ei muutunud.
- [ ] Kinnita, et sektsioonide järjestus ei muutunud.
- [ ] Alles pärast piloodi õnnestumist migreeri ülejäänud teenused.

## 12. Etapp 8 — URL-id, canonical, redirect’id ja hierarhia

### Ülesanded

- [ ] Koosta `URL_MIGRATION_MAP.md`.
- [ ] Loetle iga sisu kõik praegu töötavad URL-id.
- [ ] Märgi praegune canonical.
- [ ] Märgi soovitatud canonical.
- [ ] Märgi kasutaja kinnitust vajavad valikud.
- [ ] Lahenda väliteenuste lühikese ja pika URL-i dubleerimine.
- [ ] Lahenda lumekoristuse vastassuunaline redirect.
- [ ] Paranda siselingid nii, et need viitaksid otse lõpp-URL-ile.
- [ ] Ära jäta siselinke 308 vaheastme taha.
- [ ] Genereeri canonical keskregistrist.
- [ ] Genereeri `hreflang` keskregistrist.
- [ ] Genereeri sitemap keskregistrist.
- [ ] Genereeri breadcrumb keskregistri parent-seosest.
- [ ] Lisa nähtav semantiline breadcrumb ainult seal, kus see on praeguses disainis olemas või kuhu selle lisamine on kasutajaga kinnitatud.
- [ ] Lisa JSON-LD breadcrumb ilma visuaali muutmata.
- [ ] Paranda vene slugid alles pärast kasutaja kinnitust.
- [ ] Lisa vanadelt vene slugidelt üks 308 uutele.
- [ ] Säilita päringuparameetrid redirect’ides, kui need on vajalikud.
- [ ] Väldi redirect-ahelaid ja -silmuseid.
- [ ] Kontrolli, et `redirects` käivitub enne Proxy loogikat vastavalt kasutatava Next.js versiooni juhendile.

### Kontroll

- [ ] Igal sisul on üks canonical.
- [ ] Ükski canonical ei suuna edasi.
- [ ] Sitemap sisaldab ainult canonical URL-e.
- [ ] Sitemap’i iga URL vastab otse 200.
- [ ] `hreflang` seosed on vastastikused.
- [ ] Keelevahetus säilitab sama Page ID.
- [ ] Parent–child seos on masinloetav.

## 13. Etapp 9 — eesti sisu kontroll

### Ülesanded iga lehe kohta

- [ ] Loe renderdatud leht tervikuna.
- [ ] Võrdle vana ja uut nähtavat teksti.
- [ ] Säilita kinnitatud mõte ja sektsioonide struktuur.
- [ ] Paranda ainult:
  - kirjavead;
  - käändevead;
  - kirjavahemärgid;
  - terminoloogiline ebajärjekindlus;
  - tõendatud faktivastuolu;
  - vigane hinna- või ühikuvorming.
- [ ] Dokumenteeri iga parandus `CONTENT_CORRECTIONS.md` failis.
- [ ] Märgi ettevõtte vanuse vastuolu otsust vajavaks.
- [ ] Märgi 2006/2007 vastuolu otsust vajavaks.
- [ ] Märgi teeninduspiirkonna vastuolu otsust vajavaks.
- [ ] Märgi 800 m² ulatus otsust vajavaks.
- [ ] Kontrolli “grafiti/graffiti” ühtset eestikeelset kuju.
- [ ] Kontrolli kõiki CTA-sid.
- [ ] Kontrolli kõiki KKK vastuseid.
- [ ] Kontrolli title’eid ja description’eid.

### Kontroll

- [ ] Eesti lehel ei ole ingliskeelseid sisulõike.
- [ ] UI-sõnad on eesti keeles.
- [ ] Ettevõtte faktid ei ole omavahel vastuolus.

## 14. Etapp 10 — inglise sisu kontroll

### Ülesanded iga lehe kohta

- [ ] Loe leht tervikuna inglise keeles.
- [ ] Säilita sama mõte ja sektsioonide struktuur.
- [ ] Paranda grammatika.
- [ ] Paranda sõna-sõnaline eesti lauseehitus.
- [ ] Ühtlusta teenuseterminid.
- [ ] Paranda `plating`, kui tegelik teenus on `tiling`.
- [ ] Paranda `plastering`, kui tegelik teenus on plaatimine.
- [ ] Kontrolli `cleaning`, `maintenance`, `sanitation`, `specialist cleaning` ja `grounds maintenance` tähendusi.
- [ ] Kontrolli title’eid.
- [ ] Kontrolli meta description’eid.
- [ ] Kontrolli CTA-sid.
- [ ] Kontrolli raha- ja ühikuvormingut.
- [ ] Kontrolli, et inglise title ei oleks eesti keeles.
- [ ] Dokumenteeri iga sisumuudatus.

### Kontroll

- [ ] Inglise tekst kõlab algupärase B2B-inglise tekstina.
- [ ] Tähendus vastab eesti lähteversioonile.
- [ ] Lehe struktuur ei ole muutunud.

## 15. Etapp 11 — vene sisu erikontroll

### Põhimõte

Vene teksti ei tohi kinnitada ainult automaattõlke või märksõnakontrolli alusel. Tekst tuleb lugeda lehekülje kontekstis.

### Ülesanded iga lehe kohta

- [ ] Loe leht tervikuna vene keeles.
- [ ] Säilita sama mõte ja sektsioonide struktuur.
- [ ] Kirjuta H1 ühe tervikliku vene fraasina.
- [ ] Ära liida inglise `title + subtitle` välju automaatselt.
- [ ] Paranda käänded.
- [ ] Paranda sõnajärg.
- [ ] Paranda terminoloogia.
- [ ] Eemalda sõna-sõnalised inglise konstruktsioonid.
- [ ] Paranda `Большой сайт` → objekti tähendav sõnastus.
- [ ] Paranda `Пользовательский` hinna tähenduses.
- [ ] Paranda `цитата` hinnapakkumise tähenduses.
- [ ] Paranda `профилактическая уборка`, kui mõeldud on regulaarset hoolduskoristust.
- [ ] Paranda `площадь пола`, kui mõeldud on ruumide pindala.
- [ ] Paranda topelt `с` kontaktilehe H1-s.
- [ ] Paranda väliteenuste põhilehe vale `Интерьеры` title.
- [ ] Paranda eesti keelde jäänud vene title’id.
- [ ] Eemalda või lase kinnitada `№1 в Эстонии`.
- [ ] Kasuta vene ühikut `м²`.
- [ ] Kasuta vene tekstis järjepidevat kümnendvormingut.
- [ ] Kontrolli ettevõtte nime grammatiliselt neutraalset kasutamist.
- [ ] Kontrolli CTA-de loomulikkust.
- [ ] Kontrolli vormitekste.
- [ ] Kontrolli serveriveateateid.
- [ ] Dokumenteeri iga enne/pärast parandus.
- [ ] Lase lõplik tekst võimalusel kinnitada vene emakeelega B2B-toimetajal.

### Kontroll

- [ ] Vene leht ei sisalda eesti turundusteksti.
- [ ] Vene leht ei sisalda juhuslikku inglise teenusesisu.
- [ ] H1 on grammatiliselt terviklik.
- [ ] Title kirjeldab õiget teenust.
- [ ] URL ei ole kärbitud ega segatähestikuga.

## 16. Etapp 12 — hinnastuse tehniline korrastamine

### Ülesanded

- [ ] Inventeerida kõik hinnad:
  - TypeScripti konstandid;
  - JSON;
  - JSX;
  - KKK;
  - hinnakaardid;
  - kalkulaator;
  - structured data.
- [ ] Loo iga hinnastatava teenuse arvuline hinnamudel.
- [ ] Hoia numbrid andmetena, mitte tõlgitud tekstina.
- [ ] Kasuta `Intl.NumberFormat`.
- [ ] Kasuta locale’i järgi õiget kümnendmärki.
- [ ] Hoia `currency: EUR`.
- [ ] Lisa teadlik käibemaksu olek pärast kasutaja otsust.
- [ ] Säilita praegune kalkulaatori visuaal.
- [ ] Säilita praegune kalkulaatori asukoht lehel.
- [ ] Paranda arvutusloogika ilma kujundust muutmata.
- [ ] Selgita kasutajale, kui tulemus on ainult minimaalne näidishind.
- [ ] Ära esita ühe sisendiga kalkulaatorit täpse hinnana, kui hind sõltub sagedusest ja objekti tüübist.
- [ ] Märgi ärireeglid, mida ei saa koodist kindlaks teha.
- [ ] Lahenda ehitusjärgse koristuse vastuolu:
  - kuni 200 m² / 350 €;
  - 200–1000 m² / 800 €;
  - 1,5–3,0 €/m².
- [ ] Eemalda pindalavahemiku kattuvus pärast ärireegli kinnitamist.
- [ ] Lisa “alates”, kui hind ei ole fikseeritud.
- [ ] Testi:
  - miinimum;
  - maksimum;
  - samm;
  - piirist väiksem väärtus;
  - piirist suurem väärtus;
  - mittelineaarne või vigane sisend.

### Kontroll

- [ ] Kõik näidisarvutused on matemaatiliselt õiged.
- [ ] Ükski KKK ega hinnakaart ei ole mudeliga vastuolus.
- [ ] ET, EN ja RU kuvavad sama arvu õiges lokaadivormingus.

## 17. Etapp 13 — vormide tehniline parandamine

### Üldised nõuded

- [ ] Säilita vormide praegune visuaal.
- [ ] Säilita vormide asukoht.
- [ ] Säilita olemasolevad väljad, kui kasutaja pole teisiti otsustanud.
- [ ] Ära saada migratsiooni testis päris päringut ilma loata.
- [ ] Kasuta testpostkasti või mock-transporti.

### Kontaktivorm

- [ ] Kontrolli client-side `required` atribuute.
- [ ] Kontrolli serverivalideerimist.
- [ ] Kontrolli nime pikkust.
- [ ] Kontrolli e-posti.
- [ ] Kontrolli telefoni.
- [ ] Kontrolli nõusolekut.
- [ ] Kontrolli faili laiendit.
- [ ] Kontrolli MIME-tüüpi.
- [ ] Kontrolli magic bytes’i.
- [ ] Kontrolli failisuurust.
- [ ] Kontrolli rate limit’i.
- [ ] Kontrolli topeltsaatmist.
- [ ] Kontrolli kõiki veateateid kolmes keeles.
- [ ] Kontrolli privaatsuslinki otse lõpp-URL-ile.
- [ ] Otsusta kasutajaga, kas telefon ja kirjeldus peavad olema kohustuslikud.

### Kandideerimisvorm

- [ ] Dokumenteeri puuduva nime välja probleem.
- [ ] Dokumenteeri CV üleslaadimise puudumine.
- [ ] Dokumenteeri piirkonna mittekohustuslikkus.
- [ ] Dokumenteeri tööaja mittekohustuslikkus.
- [ ] Dokumenteeri vaikimisi täistööaja valik.
- [ ] Lisa või muuda välju ainult pärast kasutaja kinnitust, sest see muudab nähtavat vormi.
- [ ] Sõltumata nähtava vormi otsusest valideeri lubatud väärtused serveris.
- [ ] Kontrolli tundmatuid `region`, `workload` ja `work_time` väärtusi.
- [ ] Kontrolli e-kirja lokaliseeritud sisu.

### Kontroll

- [ ] Brauseri ja serveri valideerimine ei ole vastuolus.
- [ ] Ühe keele leht ei kuva teise keele serveriviga.
- [ ] Ükski test ei saada päris kliendipäringut.

## 18. Etapp 14 — blogi ja arvustuste töökindlus

### Ülesanded

- [ ] Reprodutseeri `/blog/` timeout kontrollitud keskkonnas.
- [ ] Reprodutseeri `/sps-grupp/arvamused/` timeout.
- [ ] Tuvasta, milline DB-päring ootab.
- [ ] Lisa päringule piiratud timeout.
- [ ] Lisa kiire ja deterministlik fallback.
- [ ] Ära oota fallback’iga lõputult DB võrguvea järel.
- [ ] Kasuta staatilist sisu esmase allikana, kui see vastab praegusele äriloogikale.
- [ ] Liida DB muudatused ainult siis, kui DB vastab kokkulepitud ajaga.
- [ ] Logi fallback ilma saladuste või isikuandmeteta.
- [ ] Lisa test, mis katkestab DB ühenduse.
- [ ] Nõua, et blogi ja arvustused vastaksid fallback’iga.
- [ ] Puhasta blogi vigane HTML.
- [ ] Paranda avatud `<h2>` ja suletud `</h3>`.
- [ ] Paranda `#kysipakkumist` fragment praeguseks vormi ID-ks.
- [ ] Paranda siselingid canonical URL-idele.
- [ ] Kontrolli vanad `http://` lingid.
- [ ] Ära kirjuta ajaloolisi artikleid sisuliselt ümber.
- [ ] Märgi ajaloolised hinnad ja palgaandmed selgelt kuupäevastatuks, kui kasutaja kinnitab.

### Kontroll

- [ ] Blogi vastab ka DB tõrke ajal.
- [ ] Arvustuste leht vastab ka DB tõrke ajal.
- [ ] Fallback ei muuda lehe disaini.
- [ ] Vigane imporditud HTML ei lõhu DOM-i.

## 19. Etapp 15 — mobiilne ja ligipääsetavuse vigade parandus

### Ülesanded

- [ ] Testi kõiki lehemalle 320 px laiuses.
- [ ] Testi 360 px.
- [ ] Testi 390 px.
- [ ] Testi 430 px.
- [ ] Testi 768 px.
- [ ] Testi 1024 px.
- [ ] Testi 1440 px.
- [ ] Mõõda `documentElement.scrollWidth`.
- [ ] Leia päriselt ülevoolu põhjustav element.
- [ ] Ära kasuta globaalset `overflow-x: hidden` ainsa parandamisena.
- [ ] Paranda dekoratiivse 800 px elemendi mõju.
- [ ] Paranda ehitusjärgse koristuse mobiilne ülevool.
- [ ] Paranda vene avalehe mobiilne ülevool.
- [ ] Paranda 320 px hero telefoninupu väljaminemine.
- [ ] Säilita nupu visuaalne stiil.
- [ ] Vajadusel luba CTA real olemasoleva kujundusega kooskõlas reavahetus.
- [ ] Kontrolli vene pikkade sõnade murdumist.
- [ ] Kontrolli mobiilimenüüd.
- [ ] Kontrolli faili input’i.
- [ ] Kontrolli hinnakaarte.
- [ ] Kontrolli jalust.
- [ ] Kontrolli carousel’e.
- [ ] Kontrolli hero kontrasti.
- [ ] Tee ainult minimaalne overlay muudatus, kui kontrast ei vasta nõudele.
- [ ] Kontrolli minimaalselt 15 px kirjasuurust.
- [ ] Kontrolli vähemalt 44 × 44 px puutealasid.
- [ ] Lisa nähtav klaviatuurifookus.
- [ ] Kontrolli pealkirjahierarhiat.
- [ ] Kontrolli `aria-label`, `aria-live` ja vormivigu.
- [ ] Lisa vähendatud animatsiooni tugi.

### Kontroll

- [ ] Ükski leht ei keri horisontaalselt.
- [ ] Ükski interaktiivne element ei ole osaliselt ekraanilt väljas.
- [ ] Disain ei ole muudetud, välja arvatud dokumenteeritud veaparandused.

## 20. Etapp 16 — SEO ja struktureeritud andmed

### Ülesanded

- [ ] Genereeri title keskse sisu kaudu.
- [ ] Genereeri description keskse sisu kaudu.
- [ ] Genereeri canonical keskregistrist.
- [ ] Genereeri Open Graph.
- [ ] Genereeri Twitter metadata.
- [ ] Genereeri `hreflang`.
- [ ] Genereeri `x-default`.
- [ ] Genereeri sitemap.
- [ ] Genereeri robots.
- [ ] Genereeri Service JSON-LD.
- [ ] Genereeri Organization JSON-LD.
- [ ] Genereeri BreadcrumbList JSON-LD.
- [ ] Genereeri FAQ JSON-LD ainult siis, kui sama KKK on lehel nähtav.
- [ ] Väldi dubleeruvaid JSON-LD plokke.
- [ ] Paranda CSP nonce hydration mismatch.
- [ ] Ära genereeri serveris ja kliendis erinevat nonce atribuuti.
- [ ] Kontrolli admin-, image-tool- ja variandilehtede `noindex`.
- [ ] Kontrolli, et need pole sitemap’is.
- [ ] Kontrolli üks H1 lehe kohta.
- [ ] Kontrolli title’i keelt.
- [ ] Kontrolli description’i keelt.
- [ ] Kontrolli structured data URL-e.

### Kontroll

- [ ] Metaandmed vastavad nähtavale sisule.
- [ ] Ükski vene leht ei kanna eestikeelset title’it.
- [ ] Ükski title ei kirjelda vale teenust.
- [ ] Canonical ja sitemap kasutavad sama URL-i.

## 21. Etapp 17 — jõudlus ja turvalisus

### Jõudlus

- [ ] Mõõda lähte- ja sihtrakenduse HTML vastuseaega.
- [ ] Mõõda JS bundle.
- [ ] Mõõda Core Web Vitals.
- [ ] Eemalda põhjendamatud Client Component piirid.
- [ ] Optimeeri pildid ilma nähtavat kvaliteeti vähendamata.
- [ ] Kasuta korrektseid `sizes` väärtusi.
- [ ] Väldi layout shift’i.
- [ ] Säilita fondid.
- [ ] Kontrolli fontide preload’i.
- [ ] Väldi sama sisu topelthydration’it.
- [ ] Kontrolli animatsioonide CPU koormust.

### Turvalisus

- [ ] Säilita või tugevda CSP.
- [ ] Säilita `X-Content-Type-Options`.
- [ ] Säilita `X-Frame-Options` või vastav CSP.
- [ ] Säilita Referrer Policy.
- [ ] Säilita Permissions Policy.
- [ ] Kontrolli admin-auth’i.
- [ ] Kontrolli CSRF kaitset.
- [ ] Kontrolli rate limit’i mitme instantsi kontekstis.
- [ ] Ära kasuta ainult protsessimälu, kui funktsioon peab töötama serverless instantside vahel.
- [ ] Kontrolli failide üleslaadimist.
- [ ] Kontrolli e-posti sanitiseerimist.
- [ ] Ära logi vormide isikuandmeid.
- [ ] Kontrolli andmebaasipäringute timeout’e.

### Kontroll

- [ ] Sihtrakendus ei ole lähteversioonist aeglasem ilma dokumenteeritud põhjuseta.
- [ ] Turvaheader’id on tootmisbuildis olemas.

## 22. Etapp 18 — täielik regressioonikontroll

### Build

- [ ] `npm run lint`
- [ ] TypeScript
- [ ] `npm run build`
- [ ] tootmisserveri käivitamine

### URL-id

- [ ] Kõik canonical URL-id tagastavad 200.
- [ ] Kõik legacy URL-id suunavad ühe 308-ga.
- [ ] Ühtegi redirect-silmust pole.
- [ ] Ühtegi juhuslikku 404 pole.

### Keeled

- [ ] Kõik ET lehed on eesti keeles.
- [ ] Kõik EN lehed on inglise keeles.
- [ ] Kõik RU lehed on vene keeles.
- [ ] Keelevahetus säilitab sama lehe.
- [ ] Vormivead on õiges keeles.
- [ ] Metadata on õiges keeles.

### Hinnad

- [ ] Kõik näited on matemaatiliselt õiged.
- [ ] Kõik ühikud on lokaadile sobivad.
- [ ] Kõik hinnad pärinevad kinnitatud reeglitest.

### Vormid

- [ ] Tühi vorm.
- [ ] Vigane e-post.
- [ ] Vigane telefon.
- [ ] Puuduv nõusolek.
- [ ] Lubatud manus.
- [ ] Keelatud manus.
- [ ] Liiga suur manus.
- [ ] Topeltsaatmine.
- [ ] Rate limit.
- [ ] Õnnestumine testtranspordiga.

### Mobiil

- [ ] 320 px.
- [ ] 360 px.
- [ ] 390 px.
- [ ] 430 px.
- [ ] 768 px.
- [ ] Ükski ülevool.
- [ ] Ükski peidetud CTA.
- [ ] Ükski alla 15 px tekst.

### SEO

- [ ] Üks H1.
- [ ] Title.
- [ ] Description.
- [ ] Canonical.
- [ ] `hreflang`.
- [ ] `x-default`.
- [ ] Breadcrumb.
- [ ] JSON-LD.
- [ ] Sitemap.
- [ ] Robots.

### Visuaalne võrdlus

- [ ] Võrdle kõiki referentspilte.
- [ ] Dokumenteeri iga erinevus.
- [ ] Lükka tagasi juhuslikud erinevused.
- [ ] Küsi kinnitust teadlikele nähtavatele erinevustele.

## 23. Etapp 19 — lõplik kasutajale üleandmine

### Ülesanded

- [ ] Uuenda `REBUILD_PROGRESS.md`.
- [ ] Uuenda `MIGRATION_DECISIONS.md`.
- [ ] Uuenda `VISUAL_DIFFERENCES.md`.
- [ ] Uuenda `CONTENT_CORRECTIONS.md`.
- [ ] Uuenda `URL_MIGRATION_MAP.md`.
- [ ] Uuenda `TEST_RESULTS.md`.
- [ ] Koosta lõplik lehtede inventuur.
- [ ] Koosta lahendamata küsimuste loend.
- [ ] Koosta produktsiooni migratsioonijuhis.
- [ ] Koosta rollback-juhis.
- [ ] Ära suuna domeeni sihtrakendusele ilma kasutaja eraldi loata.
- [ ] Ära deploy produktsiooni ilma kasutaja eraldi loata.
- [ ] Ära kustuta lähteprojekti pärast valmimist.

## 24. Soovituslik teostusjärjekord leherühmade kaupa

Pärast tehnilise piloodi kinnitamist:

1. Avalehe ühised komponendid.
2. Regulaarse koristuse põhileht.
3. Kontorikoristus.
4. Kaubanduspindade koristus.
5. Tootmishoonete koristus.
6. Koolide koristus.
7. Puhastusteenuste põhileht.
8. Ehitusjärgne koristus.
9. Eskalaatorid.
10. Desinfitseerimine.
11. Põrandad.
12. Tule- ja suitsukahjustused.
13. Vaibad.
14. Välikoristuse põhileht.
15. Aknad.
16. Fassaad.
17. Grafiti.
18. Kojamees.
19. Lehed.
20. Lumi.
21. Muru.
22. Tänavakivid.
23. Remonditeenuste põhileht.
24. Elektritööd.
25. Torutööd.
26. Siseviimistlus.
27. Sanitaarremont.
28. Ventilatsioon.
29. Plaatimine.
30. Katuse remont.
31. Lammutustööd.
32. Ehitusprahi äravedu.
33. SPS Grupp.
34. Arvustused.
35. Kontakt.
36. Karjäär ja tööpakkumised.
37. Privaatsus.
38. Blogi ja blogipostitused.
39. 404 ja süsteemilehed.

Iga leherühma järel tuleb käivitada vastava rühma ET/EN/RU ja mobiili regressioonitestid.

## 25. Valmisoleku definitsioon

Ümberehitus on valmis ainult siis, kui kõik järgmised tingimused on täidetud:

- [ ] Lähteprojekt on puutumata.
- [ ] Sihtprojekt asub eraldi kõrvalkataloogis.
- [ ] Disain on säilinud.
- [ ] Sisusektsioonide järjestus on säilinud.
- [ ] Kõik tõendatud sisulised vead on parandatud või dokumenteeritud.
- [ ] Kõik keeled kasutavad kontrollitavat sisumudelit.
- [ ] Eesti sisu ei sõltu kasutamata ingliskeelsest `et.json` koopiast.
- [ ] Vene sisu on loomulik ja grammatiliselt korrektne.
- [ ] Igal sisul on üks canonical URL.
- [ ] Sitemap’i URL-id vastavad otse 200.
- [ ] Hinnaloogika on matemaatiliselt ja sisuliselt kooskõlaline.
- [ ] Vormid valideerivad brauseris ja serveris samu ärireegleid.
- [ ] Blogi ja arvustused ei jää DB tõrke korral lõputult ootama.
- [ ] 320–1440 px vaates ei ole horisontaalset ülevoolu.
- [ ] Ükski tekst ei ole alla 15 px.
- [ ] Build ja lint läbivad.
- [ ] Automaatsed testid läbivad.
- [ ] Kõik nähtavad erinevused on dokumenteeritud ja kinnitatud.
- [ ] Produktsiooni ülemineku- ja rollback-plaan on olemas.

## 26. Keelatud otseteed

AI ei tohi:

- teha kogu projekti automaatset otsi-asenda migratsiooni ilma lehekaupa kontrollita;
- asendada olemasolevat kujundust uue UI kit’iga;
- muuta värve või fonte “kaasaegsemaks”;
- kasutada globaalset `overflow-x: hidden` kõigi mobiilivigade peitmiseks;
- muuta kogu rakendust Client Component’iks;
- panna kogu sisu ühte hiiglaslikku JSON-faili;
- panna kogu sisu ühte hiiglaslikku Reacti komponenti;
- jätta ET, EN ja RU eri arhitektuuridele;
- genereerida vene teksti ja lugeda automaattõlget lõplikuks;
- otsustada hindu oletuse põhjal;
- muuta canonical URL-i ilma redirect-plaanita;
- lubada sama sisu kahel isekanoonilisel URL-il;
- testida päris vormisaatmist ilma loata;
- kopeerida saladusi uude kataloogi;
- deploy’da produktsiooni ilma loata;
- kustutada vana rakendust.

## 27. AI esimene konkreetne töötsükkel

AI peab alustama täpselt järgmiste sammudega:

1. Loe kõik punktis 3 nimetatud dokumendid.
2. Kontrolli lähteprojekti Git staatust ilma seda muutmata.
3. Koosta route’ide ja andmeallikate inventuur.
4. Kontrolli, kas sihtkataloog eksisteerib.
5. Kui sihtkataloog on tühi või puudub, loo see turvaliselt.
6. Kopeeri ainult punktis 7 lubatud failid.
7. Loo sihtprojekti juhtfailid.
8. Installi sõltuvused lukufaili järgi.
9. Käivita muutmata koopia lint ja build.
10. Käivita lähte- ja sihtrakendus eri portidel.
11. Loo visuaalne ja tehniline baasvõrdlus.
12. Dokumenteeri kõik erinevused.
13. Loo keskregistri ja sisuskeemi tehniline kavand.
14. Migreeri ainult kontorikoristuse piloot.
15. Kontrolli pilooti ET, EN, RU, mobiili, SEO, hinnastuse ja vormi ulatuses.
16. Esita piloodi tulemused kasutajale enne massmigratsiooni.

Massmigratsiooni ei tohi alustada enne, kui piloodi tehniline lahendus on kontrollitud ja kasutaja on kinnitanud kõik nähtavat või äriloogikat mõjutavad otsused.

## 28. Madalama mudeli kohustuslik ülesannete järjekord

Ära alusta järgmist rühma enne eelmise rühma vastuvõtukriteeriumide täitmist.

### Rühm A — ainult lugemine ja inventuur

1. [ ] Loe punktis 3 nimetatud projekti põhijuhendid.
2. [ ] Tuvasta ja dokumenteeri lähteprojekti Git olek.
3. [ ] Tuvasta kõik route-failid.
4. [ ] Tuvasta kõik leheregistrid, slug-map’id ja metadata allikad.
5. [ ] Tuvasta ET, EN ja RU sisuallikad.
6. [ ] Tuvasta kõik hinnareeglid ja arvutusfunktsioonid.
7. [ ] Tuvasta kõik vormid, skeemid ja saatmis-endpoint’id.
8. [ ] Tuvasta kõik sitemap’i, robots’i, canonical’i, `hreflang`i ja redirect’i genereerijad.
9. [ ] Salvesta tulemused `SOURCE_INVENTORY.md` faili.

Vastuvõtt: inventuuris on iga leitud objekti täpne failitee ja vastutus. Selles rühmas ei muudeta rakenduse koodi.

### Rühm B — uue kataloogi ohutu loomine

1. [ ] Kontrolli sihtkataloogi täpset absoluutset teed.
2. [ ] Kontrolli, et sihtkataloog ei ole lähteprojekti sees.
3. [ ] Kui kataloog juba sisaldab faile, peata kopeerimine ja dokumenteeri nende loend.
4. [ ] Loo tühi sihtkataloog ainult siis, kui see puudub.
5. [ ] Kopeeri ainult punktis 7 lubatud failid.
6. [ ] Ära kopeeri `.env*`, `.next`, `node_modules`, logisid, cache’i ega saladusi.
7. [ ] Kontrolli koopia faililoendit.
8. [ ] Paigalda sõltuvused lukufaili järgi.
9. [ ] Käivita muutmata koopia lint, tüübikontroll ja build.

Vastuvõtt: sihtprojekt kompileerub ning lähteprojekti Git olek on täpselt endine.

### Rühm C — lähte- ja sihtversiooni baasvõrdlus

1. [ ] Käivita lähte- ja sihtrakendus eri portidel.
2. [ ] Kontrolli sama URL-i mõlemas rakenduses.
3. [ ] Tee samad ekraanipildid ET, EN ja RU keeles.
4. [ ] Kasuta vähemalt laiusi 390, 768, 1280 ja 1440 px.
5. [ ] Salvesta HTTP olekud, metadata, lingid, vormi olek ja horisontaalse ülevoolu tulemus.
6. [ ] Dokumenteeri iga erinevus enne refaktoreerimist.

Vastuvõtt: muutmata koopia nähtavad erinevused on null või iga erinevuse põhjus on dokumenteeritud.

### Rühm D — testid enne refaktoreerimist

1. [ ] Lisa route’ide ja locale’ide inventuuritest.
2. [ ] Lisa duplikaat-URL-i test.
3. [ ] Lisa canonical’i ja `hreflang`i baasvõrdlus.
4. [ ] Lisa sitemap’i ja redirect’ide test.
5. [ ] Lisa hinnastuse praeguse käitumise karakterisatsioonitestid.
6. [ ] Lisa vormide praeguse valideerimise karakterisatsioonitestid.
7. [ ] Lisa kontorikoristuse ET, EN ja RU visuaalne baasvõrdlus.

Vastuvõtt: testid kinnitavad praegust käitumist ja tuvastavad auditis nimetatud teadaolevad vead. Teadaolevat viga kattev test võib enne parandust ebaõnnestuda ainult siis, kui see on märgitud oodatud ebaõnnestumiseks koos auditiviitega.

### Rühm E — ainult kontorikoristuse piloot

Täida punktis 10 toodud 17 alamtsüklit ükshaaval. Iga alamtsükli järel:

1. [ ] käivita selle üksuse test;
2. [ ] käivita kõik registri- ja route-testid;
3. [ ] käivita lint;
4. [ ] käivita tüübikontroll;
5. [ ] kontrolli mõjutatud URL-e brauseris;
6. [ ] uuenda `REBUILD_PROGRESS.md`;
7. [ ] tee eraldi diff-ülevaatus.

Vastuvõtt: kontorikoristuse ET, EN ja RU lehed säilitavad visuaali, sisu ülesehituse, funktsioonid ja URL-id; uus tehniline tee läbib kõik testid.

### Rühm F — kasutaja kinnitus enne massmigratsiooni

Esita kasutajale:

- piloodis muudetud failid;
- arhitektuuri kirjeldus;
- automatiseeritud kontrollide tulemused;
- visuaalse võrdluse tulemused;
- kõik nähtavad erinevused;
- kõik sisu-, URL-i-, hinna- ja vormiotsused;
- järgmise ühe lehe migratsiooniplaan.

Massmigratsiooni võib alustada ainult pärast piloodi kontrolli. Kasutaja eraldi kinnitust on alati vaja nähtava disaini, sektsioonide järjestuse, äriväite, hinna või avaliku URL-i muutmiseks.

## 29. Lehekaupa täidetav kontrollkaart

Kopeeri järgmine kaart `REBUILD_PROGRESS.md` faili iga lehe ja locale’i kohta. Ühtegi välja ei tohi tühjaks jätta; mittekohaldatava välja väärtus on `EI KOHALDU` koos põhjendusega.

```text
LEHE KONTROLLKAART

Page ID:
Lehe tüüp:
Parent ID:

ET URL:
EN URL:
RU URL:

Vana route’i fail:
Vana sisuallikas ET:
Vana sisuallikas EN:
Vana sisuallikas RU:
Vana metadata allikas:
Uus registrikirje:
Uus sisumoodul:
Kasutatav template:

ET title enne:
ET title pärast:
EN title enne:
EN title pärast:
RU title enne:
RU title pärast:

ET H1 enne/pärast:
EN H1 enne/pärast:
RU H1 enne/pärast:

ET canonical:
EN canonical:
RU canonical:
x-default:
hreflang-väärtused:

Sektsioonide järjekord enne:
Sektsioonide järjekord pärast:

Kontrollitud vaatelaiused:
- 390 px:
- 768 px:
- 1280 px:
- 1440 px:

Sisemised lingid kontrollitud:
Keelevahetus kontrollitud:
Breadcrumb kontrollitud:
Vorm kontrollitud:
Hinnad ja ühikud kontrollitud:
JSON-LD kontrollitud:
Sitemap kontrollitud:
Redirect’id kontrollitud:

Kas tekst muutus: JAH/EI
Kui jah, täpne muudatus ja põhjus:
Kas visuaal muutus: JAH/EI
Kui jah, täpne muudatus ja tõendus:
Kas URL muutus: JAH/EI
Kui jah, redirect ja kasutaja kinnitus:

Üksuse test:
Registritest:
Route-test:
Lint:
Tüübikontroll:
Build:
Brauserikontroll:

Olek: ALUSTAMATA / TÖÖS / BLOKEERITUD / VALMIS
```

## 30. Faili muutmise kontrollkaart

Enne iga faili salvestamist vasta kõigile küsimustele:

1. Kas fail oli töötsükli alguses muudetavate failide loendis?
2. Kas muudatus teenib ainult selle tsükli üht eesmärki?
3. Kas sama tulemus on saavutatav väiksema muudatusega?
4. Kas olemasolev avalik API või komponentide props muutus?
5. Kas renderdatud DOM, klassid või sektsioonide järjekord muutus?
6. Kas mõni ET, EN või RU tekst muutus?
7. Kas metadata, URL, canonical, `hreflang` või sitemap muutus?
8. Kas hinnavalem, ühik, miinimum, maksimum või ümardamine muutus?
9. Kas vormi kohustuslikkus, valideerimine või saatmine muutus?
10. Milline test tõendab, et muudatus on õige?

Kui küsimuste 4–9 vastus on `JAH` ja vastav muutus ei olnud töötsükli eesmärk, ära salvesta muudatust. Taasta ainult enda pooleliolev muudatus selles failis ja loo eraldi ülesanne.

## 31. Vea käsitlemise kontrollkaart

Kui test, build või brauserikontroll ebaõnnestub:

1. [ ] salvesta täpne käsk;
2. [ ] salvesta täielik veateade või selle failitee;
3. [ ] märgi esimene projekti enda fail ja rida, millele viga viitab;
4. [ ] kontrolli, kas sama viga esineb muutmata lähteversioonis;
5. [ ] võrdle viimase töötsükli diffi;
6. [ ] sõnasta üks otsene põhjuse hüpotees;
7. [ ] tee ainult hüpoteesi kontrolliv väikseim muudatus;
8. [ ] käivita kõigepealt ebaõnnestunud kontroll uuesti;
9. [ ] pärast edu käivita kogu töötsükli kontrollikomplekt;
10. [ ] dokumenteeri põhjus ja lahendus `REBUILD_PROGRESS.md` failis.

Vea eemaldamiseks on keelatud:

- testi kustutada;
- assertion’it nõrgemaks muuta ilma tõendatud nõude muutuseta;
- vigast lehte testiloendist välja jätta;
- muuta TypeScripti või ESLinti reeglit ainult veast möödumiseks;
- lisada põhjendamatu `any`, `@ts-ignore` või lint-disable;
- peita runtime-viga tühja `catch` plokiga;
- asendada vigane dünaamiline väärtus suvalise hardcoded väärtusega;
- teha sõltumatu massrefaktoreerimine.
