# SPS Grupp veebilehe detailne audit

Kuupäev: 25.07.2026  
Kontrollitud projekt: `D:\WORKS\SPS\2026AprillWeb\AprilBuild`  
Kontrollitud lokaalne rakendus: `http://localhost:3001`

## 1. Auditi ulatus ja kontrollimeetod

Audit hõlmas:

- avalehte;
- kõiki teenuste põhilehti ja alamlehti;
- eesti, inglise ja vene keele sõnumifaile;
- sitemap’is loetletud 140 URL-i;
- 24 blogipostituse lähtekoodi ja siselinke;
- kontaktivormi kolmes keeles;
- kandideerimisvormi kolmes keeles;
- hinnakalkulaatorit, hinnanäiteid ja hinnatekste;
- 320, 360, 390 ja 768 px vaateid;
- siselinke, ümbersuunamisi, kanoonilisi URL-e, `hreflang`-viiteid, H1-sid ja lehetiitleid;
- tootmisbuildi ja lint-kontrolli.

Kontroll toimus kolmel tasandil:

1. Sõnumifailide ja lähtekoodi ristvõrdlus.
2. Renderdatud lehtede lugemine ning DOM-i, vormide ja metaandmete kontroll.
3. Mobiilivaadete tegelik renderdamine eri laiustel.

Oluline piirang: `/blog/` ja `/sps-grupp/arvamused/` ei vastanud lokaalses arendusrakenduses isegi 60 sekundi jooksul. Nende sisu vaadati seetõttu lähtefailidest läbi, kuid nende lõplikku brauserivaadet ei saanud täielikult kontrollida. See ei ole pelgalt auditi piirang, vaid eraldi töökindluse viga.

## 2. Üldhinnang

Leht ei ole praegusel kujul sisuliselt avaldamisvalmis.

Kõige kriitilisemad põhjused:

1. Eesti sõnumifaili 1679 tekstiväärtusest on 1356 täpselt samad nagu inglise sõnumifailis. See tähendab 77 733 identset tähemärki. Kontrollimisel selgus siiski, et mahukaid teenusesisu võtmeid ei kasutata praegu eestikeelsete teenuselehtede põhisisu renderdamiseks: eesti lehed sisaldavad eraldi eestikeelset teksti komponentides ning `LocalizedContentPage` kasutab neid sisunimeruume inglise ja vene URL-idel. Seega on tegemist tõlkeandmestiku ja arhitektuuri probleemiga, mitte tõendiga, et kogu see ingliskeelne tekst oleks eestikeelsel veebilehel nähtav.
2. Vene tekst on küll suures osas kirillitsas, kuid paljud H1-d, tiitlid, URL-id ja müügitekstid on sõna-sõnalised masintõlked, grammatiliselt vigased või semantiliselt valed.
3. Ehitusjärgse koristuse hinnakaardid ei sobi kokku lehel lubatud ruutmeetrihinnaga.
4. Hoolduskoristuse kalkulaator ütleb, et hind sõltub mitmest tegurist, kuid arvutab ainult pindala järgi.
5. Väliteenuste samad lehed on kättesaadavad kahe eri URL-i kaudu ning mõlemad variandid kuulutavad ennast kanooniliseks.
6. Vene väliteenuste URL-id on kärbitud, sisuliselt valed või sisaldavad ladina ja kirillitsa segamärke.
7. Blogi ja arvustuste leht jäid lokaalses rakenduses määramata ajaks andmebaasipäringu taha ootama.

## 3. Kriitilised vead

### 3.1. Eesti sõnumifailis on mahukas ingliskeelne teenusesisu, kuid see ei ole praegu samas mahus eesti lehtedel nähtav

Sõnumifailide võrdlus:

| Mõõdik | Tulemus |
|---|---:|
| Tekstiväärtusi `et.json` failis | 1679 |
| `et.json` ja `en.json` täpselt identsed väärtused | 1356 |
| Identse teksti maht | 77 733 tähemärki |
| Ingliskeelsetena tuvastatud eestikeelsed väärtused | vähemalt 934 |

See ei puuduta ainult tehnilisi nimetusi või kaubamärke. Failis on identsed terved H1-d, kirjeldused, teenuste loendid, KKK vastused, hinnastuse selgitused ja CTA-d.

Täiendav kasutuskontroll näitas:

- eestikeelsed teenuselehed, näiteks `/koristusteenus/` ja `/puhastusteenused/ehitusjargne-koristus/`, renderdavad põhisisu otse vastavatest Reacti lehekomponentidest;
- nende komponentide põhitekst on eesti keeles;
- `LocalizedContentPage` kutsub `getLocalizedContent()` välja inglise ja vene catch-all-lehtedel;
- `app/en/[[...slug]]/page.tsx` annab komponendile `locale="en"`;
- `app/ru/[[...slug]]/page.tsx` annab komponendile `locale="ru"`;
- eesti teenuselehed ei läbi seda lokaliseeritud üldkomponenti;
- `et.json` üldised kasutajaliidese nimeruumid, näiteks navigatsioon, vormid ja jalus, on siiski eesti lehtedel kasutusel ning nende renderdatud tekst oli kontrollitud vaadetes eesti keeles.

Seetõttu ei tohi allolevat 1356 väärtuse statistikat tõlgendada nii, et kasutaja näeb eestikeelsetel lehtedel 77 733 tähemärki inglise teksti. Õige järeldus on, et `et.json` sisaldab suurt hulka kasutamata või vale lähtekeelega teenusesisu, mis teeb tõlkesüsteemi eksitavaks ja loob suure tulevase regressiooniriski.

Näiteid eestikeelsest `messages/et.json` failist:

- `koristusteenus.seo.serviceName` — “Professional Cleaning Services in Tallinn”
- `koristusteenus.hero.h1Line1` — “Regular cleaning services for business premises”
- `koristusteenus.hero.description` — ingliskeelne teenusekirjeldus
- `koristusteenus.problem.heading` — “Does your current cleaner truly care about your business?”
- `koristusteenus.faq.q1` — “How quickly can regular cleaning service begin?”
- `kontakt.hero.title` — “Get in touch”
- `kontakt.hero.desc1` — ingliskeelne pikk kontaktilehe kirjeldus
- `spsGrupp.about.heading` — “Full-service cleaning company partner”
- `kontoriKoristus.pricing.heading` — “Transparent office cleaning pricing”
- `ehitusjargneKoristus.pricing.heading` — “Post-construction cleaning pricing”

Probleem mõjutab järgmisi sisunimeruume:

| Sisunimeruum | Tuvastatud ingliskeelseid väärtusi | Maht tähemärkides |
|---|---:|---:|
| `spsGrupp` | 50 | 6208 |
| `kontakt` | 29 | 2878 |
| `koristusteenus` | 37 | 3910 |
| `kontoriKoristus` | 30 | 2887 |
| `kaubanduspindadeKoristus` | 30 | 3011 |
| `tootmishooneteKoristus` | 28 | 3211 |
| `koolideKoristamine` | 33 | 3613 |
| `puhastusteenused` | 23 | 1907 |
| `ehitusjargneKoristus` | 23 | 2201 |
| `eskalaatoriteSuvapuhastus` | 18 | 1668 |
| `desinfitseerimine` | 16 | 1625 |
| `porandateHooldus` | 18 | 1688 |
| `suitsuJaTulekahjustustePuhastamine` | 16 | 1552 |
| `vaipadePuhastus` | 18 | 1729 |
| `akendePesu` | 18 | 1386 |
| `fassaadipesu` | 20 | 1630 |
| `grafitiEemaldamine` | 13 | 1368 |
| `kojameheteenus` | 18 | 1486 |
| `lehtedekoristamine` | 16 | 1418 |
| `lumekoristus` | 17 | 1549 |
| `muruniitmine` | 14 | 1290 |
| `tanavakividePesuJaHooldus` | 18 | 1531 |
| `remonditeenusedTallinnas` | 17 | 1579 |
| `elektritood` | 16 | 1498 |
| `torutood` | 17 | 1689 |
| `siseviimistlustood` | 13 | 1438 |
| `sanitaarremontJaUmberehitus` | 13 | 1508 |
| `ventilatsioonideEhitusJaHooldus` | 16 | 1644 |
| `plaatimistood` | 14 | 1440 |
| `katuseRemont` | 18 | 1552 |
| `lammutustood` | 15 | 1507 |

Mõju:

- tõlkefail ei ole usaldusväärne eesti sisu allikas;
- arendaja võib tulevikus ühisele lokaliseeritud komponendile üle minnes kogemata ingliskeelse teksti eesti lehtedel avaldada;
- automaatne tõlke- või sisuhaldusprotsess võib võtta ingliskeelse väärtuse ekslikult eesti lähtetekstiks;
- sama lehe eesti sisu on praegu Reacti komponendis, inglise ja vene sisu JSON-is, mistõttu versioonid võivad sisuliselt lahkneda;
- teksti parandamiseks tuleb muuta eri keelte puhul eri tüüpi allikaid;
- failinimi `et.json` ja selle tegelik teenusesisu ei vasta üheselt teineteisele.

Parandus:

- kõigepealt otsustada, kas teenusesisu põhiline allikas on Reacti eesti lehekomponent või `messages/et.json`;
- eemaldada kasutamata dubleeritud andmed või viia kõik kolm keelt teadlikult samasse sisumudelisse;
- kui `et.json` jääb eesti lähtesisu allikaks, tuleb selle teenusesisu päriselt eestindada ja võrrelda olemasolevate eesti lehekomponentidega;
- tõlget ei tohi teha ainult võtmete kaupa ilma tervet lehte kontekstis lugemata;
- lisada test, mis näitab, millised sõnumivõtmed on tegelikult kasutuses;
- pärast ühtlustamist kontrollida automaatselt, et `et` ja `en` pikad väärtused ei oleks põhjendamatult identsed;
- erandite nimekiri võib sisaldada ainult kaubamärke, standardeid, e-posti aadresse ja muid teadlikult keeleüleseid väärtusi.

### 3.2. Vene keele kvaliteet ei ole emakeelsele lugejale loomulik

Vene sisu ei ole lihtsalt “veidi kohmakas”. Paljud tekstid näitavad selgelt, et inglise konstruktsioon on tõlgitud sõnade kaupa ja kaks eraldi pealkirjarida on liidetud üheks H1-ks ilma kirjavahemärgi või grammatilise seoseta.

Põhjus on osaliselt komponendis `LocalizedContentPage`: `getTitle()` liidab `hero.title` ja `hero.subtitle` või `h1Line1` ja `h1Line2` lihtsalt tühikuga. Inglise turundusliku kaherealise pealkirja otsetõlge ei moodusta vene keeles automaatselt korrektset lauset.

#### 3.2.1. Kõige selgemad vene H1-vead

| Praegune tekst | Probleem | Loomulikum variant |
|---|---|---|
| `Свяжитесь с нами с SPS Grupp` | topelt “с”; grammatiliselt vale | `Свяжитесь с SPS Grupp` või `Свяжитесь с нами` |
| `Санитария и Специалист Клининговые услуги` | “специалист” on vale sõnaliik ja kääne | `Специализированные клининговые и санитарные услуги` |
| `Послестроительная уборка готовность к сдаче под ключ` | kaks fraasi on liidetud ilma seoseta | `Послестроительная уборка с подготовкой объекта к сдаче` |
| `Глубокая очистка эскалатора специализированное поэтапное обслуживание` | grammatiliselt sidumata nimisõnafraasid | `Глубокая очистка и поэтапное обслуживание эскалаторов` |
| `Дезинфекция профессиональный инфекционный контроль` | puudub seos ja kääne | `Профессиональная дезинфекция и инфекционный контроль` |
| `Уход за полом восстановить и защитить ваши полы` | infinitiivne käsk on H1-ga valesti liidetud | `Профессиональный уход, восстановление и защита полов` |
| `Ущерб от огня и дыма Реставрация` | inglise sõnajärg; teenus pole selge | `Уборка и восстановление после пожара и задымления` |
| `Снос контролируемое удаление и очистка` | “удаление” ei kirjelda siin lammutust | `Контролируемые демонтажные работы и вывоз строительного мусора` |
| `Укладка плитки профессиональный монтаж пола и стен` | kääne ja seos puuduvad | `Профессиональная укладка настенной и напольной плитки` |
| `Сантехника коммерческие и жилые` | lõpetamata ja grammatiliselt vale | `Сантехнические работы в коммерческих и жилых помещениях` |
| `Системы вентиляции установка и обслуживание` | puuduvad kirjavahemärk ja korrektne seos | `Монтаж и обслуживание систем вентиляции` |
| `Дворник Сервис полное обслуживание недвижимости` | otsetõlge “Janitor Service”; vene keeles ebaloomulik | `Услуги дворника и комплексный уход за территорией` |
| `Удаление листьев сезонное обслуживание недвижимости` | kaks sidumata fraasi | `Уборка листьев и сезонное обслуживание территории` |
| `Удаление снега Круглосуточное зимнее обслуживание недвижимости` | sidumata fraasid, vale kapitalisatsioon | `Круглосуточная уборка снега и зимнее обслуживание территории` |
| `Стрижка газона профессиональный уход за территорией` | kääne ja seos puuduvad | `Стрижка газонов и профессиональный уход за территорией` |

#### 3.2.2. Vene lehetiitlite vead

- Avalehe title `Уборочные Фирмы Таллинн | Клининг SPS Grupp | №1 в Эстонии` on märksõnade loetelu, mitte loomulik vene pealkiri. “Уборочные фирмы Таллинн” on grammatiliselt vigane; suurtähed on juhuslikud; “№1 в Эстонии” vajab tõendit.
- Väliteenuste põhilehe title on `Интерьеры`, kuigi leht räägib väliterritooriumi koristusest. See on täiesti vale teema.
- Kojameheteenuse, lehtede koristamise ja muruniitmise vene lehtedel kuvatakse eestikeelne title:
  - `Kojameheteenus Tallinnas — Territooriumi igapäevane hooldus | SPS Grupp`
  - `Lehtede koristamine Tallinnas — Sügisene territooriumi puhastus | SPS Grupp`
  - `Muruniitmine Tallinnas — Muru hooldus ja niitmine | SPS Grupp`
- Plaatimistööde vene title räägib krohvimisest: `Штукатурные работы...`.
- Väliala H1-des kasutatakse eri kohtades “недвижимость”, kuigi kontekst on tegelikult kinnistu väliterritoorium. Loomulikum termin on enamasti `территория объекта` või `прилегающая территория`.

#### 3.2.3. Vene sõnavara ja otsetõlke probleemid

- `Небольшая отделка` ehitusjärgse koristuse hinnakaardil ei tähenda väikest objekti või väikest siseviimistlusprojekti. Soovitus: `Небольшой объект`.
- `Большой сайт` on inglise “Large Site” vale masintõlge. Vene lugeja saab aru veebisaidist. Õige: `Крупный объект`.
- `Пользовательский` hinna asemel tähendab “custom/user-defined”. Õige: `Индивидуальная цена`.
- `цитата` inglise “quote” tõlkena tähendab tsitaati. Õige: `по запросу` või `индивидуальное предложение`.
- `профилактическая уборка` on kontorikoristuse kontekstis ebaloomulik. Regulaarse hoolduskoristuse jaoks sobib `регулярная поддерживающая уборка`.
- `Цена зависит от площади пола` on liiga sõnasõnaline. Loomulikum: `Стоимость зависит от площади помещений`.
- `требований специалистов` tööstuskoristuse hinnakirjelduses muudab tähendust. Inglise “specialist requirements” tähendab eritööde nõudeid, mitte spetsialistide nõudeid. Soovitus: `необходимости специализированных работ`.
- `фиксированная цена после осмотра объекта, чтобы не было сюрпризов` on kõnekeelne otsetõlge. B2B-le sobib `После осмотра объекта мы подготовим фиксированное коммерческое предложение без скрытых доплат`.
- `Мы предоставляем прозрачное ценовое предложение` on arusaadav, aga mitte loomulik ärikeel. Parem `подготовим понятное и детализированное коммерческое предложение`.
- `SPS Grupp потратил более 20 лет на создание...` kõlab vene keeles negatiivselt, justkui aega raisati. Parem `Более 20 лет SPS Grupp совершенствует...`.
- `Для каких типов деловых помещений...` on otsetõlge “business premises”. Parem `Какие коммерческие объекты мы обслуживаем?`.
- `Что отличает клининговые услуги SPS Grupp на рынке?` on kohmakas. Parem `Чем услуги SPS Grupp отличаются от других клининговых предложений?`.

#### 3.2.4. Vene URL-id on vigased

Failis `lib/slug-map.ts` on mitu SEO ja kasutatavuse seisukohalt sobimatut vene slugi:

- `/частные-клининговые-услуги-для-бизне`
  - kärbitud sõna `бизне`;
  - `частные` tähendab siin pigem eraisikutele mõeldud, kuid leht on äriklientidele;
  - soovitus: `/клининговые-услуги-для-бизнеса`.
- `/профессиональная-внешняя-отделка-в-т`
  - tähendab professionaalset välisviimistlust, mitte välikoristust;
  - lõpp on kärbitud;
  - soovitus: `/уборка-и-обслуживание-территорий`.
- `/профессиональная-внешняя-отделка-в-т/mытьe-окон`
  - sisaldab ladina `m` ja `e`, ülejäänu on kirillitsas;
  - sõna kuju on vigane;
  - soovitus: `/уборка-и-обслуживание-территорий/мойка-окон`.
- `/услуги-по-ремонту-в-таллинне/pipeworks`
  - vene URL-is on ingliskeelne slug;
  - soovitus: `/услуги-по-ремонту-в-таллинне/сантехнические-работы`.
- plaatimistööde slug `/покрытие`
  - tähendab katmist või pinnakatet, mitte plaatimist;
  - soovitus: `/укладка-плитки`.
- mitmed URL-id lõpevad poole sõna pealt: `...-в-талл`, `...-для-к`, `...-пов`, `...-професси`, `...-стр`.

Need URL-id tuleb asendada korrektsete püsivate aadressidega ja vanadelt aadressidelt teha üks 308 ümbersuunamine. Uusi parandatud URL-e ei tohi lihtsalt paralleelselt lisada.

#### 3.2.5. Vene keele toimetamise soovitus

Vene sisu tuleks:

1. tõlkida lehekülje, mitte üksiku võtme kaupa;
2. lasta üle vaadata vene emakeelega B2B-toimetajal;
3. kontrollida eraldi termineid:
   - `поддерживающая уборка`;
   - `генеральная уборка`;
   - `уборка коммерческих помещений`;
   - `обслуживание прилегающей территории`;
   - `коммерческое предложение`;
   - `выездная оценка объекта`;
4. loobuda inglise pealkirjade kaherealise struktuuri mehaanilisest liitmisest;
5. luua vene keele jaoks vajadusel eraldi terviklik H1, mitte `title + subtitle`.

### 3.3. Hinnastuse loogilised vastuolud

#### 3.3.1. Hoolduskoristuse valem ise arvutab õigesti

Lähtekoodis:

- hind: 1,20 €/m² kuus;
- miinimumpind: 800 m²;
- maksimumpind kalkulaatoris: 10 000 m²;
- samm: 100 m².

Kontrollitud arvutused:

| Pindala | Valem | Tulemus |
|---:|---:|---:|
| 800 m² | 800 × 1,20 | 960 € |
| 1500 m² | 1500 × 1,20 | 1800 € |
| 5000 m² | 5000 × 1,20 | 6000 € |
| 10 000 m² | 10 000 × 1,20 | 12 000 € |

Matemaatiline funktsioon `calculateMaintenancePrice()` on nende sisendite puhul korrektne.

#### 3.3.2. Kalkulaatori sisuline mudel on liiga lihtne

Leht ütleb samal ajal, et hind sõltub:

- pindalast;
- koristussagedusest;
- töömahust;
- eritöödest;
- objekti tüübist.

Kalkulaator küsib ainult pindala ja korrutab selle alati 1,20-ga. Seega:

- 2 korda nädalas ja 5 korda nädalas annavad sama hinna;
- kontor ja tootmishoone annavad sama hinna;
- eri töömahud annavad sama hinna;
- lehe hinnaselgitus ja arvutusmudel räägivad eri loogikast.

Kui 1,20 € on ainult minimaalne alghind, peab kalkulaator nimetama tulemust selgelt:

`Minimaalne näidishind pindala põhjal, alates X €/kuus`.

Praegune sõna “Arvutus” jätab täpsema mulje, kui mudel tegelikult võimaldab.

Soovitus:

- kas lisada sageduse, objekti tüübi ja töömahu sisendid;
- või muuta komponent “alghinna näidiseks” ja eemaldada kalkulaatori mulje;
- lisada selgelt, kas käibemaks lisandub;
- selgitada, miks kalkulaator lõpeb 10 000 m² juures ja mida peab tegema suurema objekti korral.

#### 3.3.3. Ehitusjärgse koristuse hinnakaardid on vastuolus ruutmeetrihinnaga

Lehel kuvatakse:

- väike objekt, kuni 200 m² — 350 €;
- keskmine objekt, 200–1000 m² — 800 €;
- tavapärane vahemik — 1,5–3,0 €/m².

Näited:

| Näide | Kaardihind | Tuletatud hind |
|---|---:|---:|
| 100 m² väike objekt | 350 € | 3,50 €/m² |
| 200 m² väike objekt | 350 € | 1,75 €/m² |
| 200 m² keskmine objekt | 800 € | 4,00 €/m² |
| 1000 m² keskmine objekt | 800 € | 0,80 €/m² |

Sama hinnakaart võib seega anda nii lubatud vahemikust kõrgema kui madalama ruutmeetrihinna.

Lisaprobleemid:

- kaartidel ei ole sõna “alates”;
- “kuni 200 m²” ja “200–1000 m²” kattuvad täpselt 200 m² juures;
- puudub käibemaksu info;
- ei ole selge, kas 350 € ja 800 € on miinimumtasu, tüüpnäide või fikseeritud hind.

Parandus:

- kui tegemist on miinimumtasuga, kasutada `alates 350 €`;
- muuta vahemikud kattumatuks, näiteks `kuni 199 m²` ja `200–999 m²`;
- arvutada kaardid ruutmeetrihinna vahemikust või eemaldada ruutmeetrihinna vahemik;
- lisada käibemaksu märge;
- eesti lehel tõlkida kogu hinnaplokk eesti keelde.

#### 3.3.4. Numbrivormingud on keeltes segamini

- Eesti: `1,20 €/m²` on korrektne.
- Inglise: `€1.20/m²` on korrektne.
- Vene: soovitatav `1,20 €/м²`, mitte ladina `m²`.
- Vene ehitusjärgse koristuse tekstis on `€1.5–3,0/m²`: ühes vahemikus on korraga punkt ja koma ning ladina `m`.
- Pindala juures kuvatakse vene lehel `200m²`; vaja on tühikut ja kirillitsat: `200 м²`.

### 3.4. Dubleeruvad väliteenuste URL-id ja vastuolulised kanoonilised aadressid

Sama sisu on kättesaadav vähemalt kahel URL-kujul:

- `/valikoristus/fassaadipesu/`
- `/koristusteenus/valikoristus/fassaadipesu/`

Mõlemad tagastavad 200 ja mõlemad kuulutavad kanooniliseks iseenda.

Sama muster kehtib ka teiste füüsiliselt `app/koristusteenus/valikoristus/...` all olevate lehtede puhul.

See on SEO jaoks tõsine viga:

- sama sisu indekseeritakse kahe URL-iga;
- siselingid annavad autoriteeti mõlemale variandile;
- sitemap kasutab lühikest `/valikoristus/...` kuju;
- blogi lingid kasutavad pikka `/koristusteenus/valikoristus/...` kuju;
- kanoonilised viited ei konsolideeri variante.

Lumekoristuse puhul on olukord teistpidi:

- sitemap loetleb `/valikoristus/lumekoristus/`;
- see URL teeb 308 suunamise aadressile `/koristusteenus/valikoristus/lumekoristus/`;
- lõplik kanooniline URL on pikk variant.

Seega ei ole isegi sama teenusegrupi sees ühtset URL-strateegiat.

Parandus:

1. valida üks avalik URL-struktuur;
2. soovituslikult jätta sitemap’is juba kasutatud `/valikoristus/...` struktuur;
3. teha kõigilt `/koristusteenus/valikoristus/...` variantidelt 308 valitud aadressile;
4. muuta kõik siselingid valitud kujule;
5. panna kõik canonical- ja `hreflang`-viited samale kujule;
6. eemaldada lumekoristuse vastassuunaline erand.

## 4. Vormide detailne audit

### 4.1. Kontaktivorm

Kolmes keeles on olemas:

- nimi;
- e-post;
- telefon;
- ettevõte;
- lisainfo;
- manus;
- andmekaitsenõusolek;
- lokaliseeritud saatmisnupp;
- lokaliseeritud privaatsuslink.

Positiivne:

- nimi, e-post, telefon ja nõusolek on kohustuslikud;
- väljade `name` väärtused on keeltes ühesugused;
- server kontrollib e-posti ja telefoni;
- failidele kehtib 10 MB piir;
- lubatud on JPG, PNG ja PDF;
- server kontrollib faili maagilisi baite, mitte ainult laiendit;
- rämpsposti vastu on peidetud `website_url`;
- topeltsaatmise vastu on lühike duplikaadikontroll;
- serveri veatekstid valitakse URL-i keele järgi.

Puudused:

1. Sõnumi/lisainfo väli ei ole kohustuslik. Päring võib saabuda ilma teenusevajaduse kirjelduseta.
2. Telefon on kohustuslik ka siis, kui e-post on olemas. See võib vähendada konversiooni; otsus peab olema teadlik.
3. Manus on lubatud, kuid kasutajale ei selgitata privaatsusriski ega seda, mida ei tohiks üles laadida.
4. Vene placeholder `email@компания.ee` on tehniliselt ebarealistlik näide, sest rahvusvahelistatud domeeni käsitlus ei pruugi kogu e-posti teekonnas töötada. Parem `name@company.ee`.
5. Nupp `Отправить` on liiga üldine. B2B-päringu puhul on selgem `Отправить запрос`.
6. Privaatsuslingid on ilma lõpuslashita ja teevad 308 ümbersuunamise. Vormi põhitegevust see ei riku, aga siselink peaks osutama otse lõpp-URL-ile.

### 4.2. Kandideerimisvorm

Olemas:

- e-post;
- telefon;
- piirkond;
- täis- või osaline töökoormus;
- sobiv tööaeg;
- lisainfo;
- andmekaitsenõusolek.

Kriitilised sisulised puudused:

1. Kandidaadi nime ei küsita.
2. CV-d ei saa vormile lisada.
3. Piirkond ei ole kohustuslik.
4. Tööaeg ei ole kohustuslik.
5. Server ei valideeri piirkonda ega tööaega.
6. Avaldus saadetakse lubatult ka siis, kui piirkond ja tööaeg puuduvad; e-kirjas kuvatakse nende asemel `-`.
7. Töökoormus on vaikimisi täistööaeg, mis võib põhjustada valeandmeid, kui kasutaja seda plokki ei märka.
8. Raadiogruppidel pole natiivset `required` atribuuti.
9. Vene e-posti placeholder `вы@email.ee` on kohmakas. Parem neutraalne `name@email.ee`.

Soovituslik minimaalne kandideerimisvorm:

- nimi, kohustuslik;
- telefon või e-post, vähemalt üks kohustuslik;
- piirkond, kohustuslik;
- töökoormus, kohustuslik ja ilma vaikimisi valikuta;
- tööaeg, kohustuslik;
- CV/manus või väga selge juhis CV saatmiseks;
- lisainfo;
- nõusolek.

### 4.3. Vormide saatmist ei tehtud

Audit ei saatnud päris kontakt- ega kandideerimisavaldusi, sest toiming oleks saatnud e-kirja välisele adressaadile. Kontrolliti renderdust, HTML-valideerimist ja serverifunktsioonide loogikat.

## 5. Mobiilivaadete audit

Kontrollitud laiused:

- 320 × 800;
- 360 × 800;
- 390 × 844;
- 768 × 1024.

Kontrollitud lehemustrid:

- eesti avaleht;
- regulaarse koristuse põhileht;
- ehitusjärgne koristus;
- pika pealkirjaga ventilatsioonileht;
- kontakt;
- tööle kandideerimine;
- vene avaleht;
- vene regulaarse koristuse leht;
- vene eskalaatorite süvapuhastus.

### 5.1. Horisontaalse ülevoolu tulemused

| Leht | 320 px | 360 px | 390 px | 768 px |
|---|---:|---:|---:|---:|
| Avaleht ET | korras | korras | korras | korras |
| Koristusteenus ET | korras | korras | korras | korras |
| Ehitusjärgne koristus ET | ülevool | ülevool | ülevool | korras |
| Ventilatsioon ET | korras | korras | korras | korras |
| Kontakt ET | väike ülevool | korras | korras | korras |
| Tule tööle ET | korras | korras | korras | korras |
| Avaleht RU | ülevool | ülevool | ülevool | korras |
| Koristusteenus RU | korras | korras | korras | korras |
| Eskalaatorid RU | korras | korras | korras | korras |

Ehitusjärgse koristuse ja vene avalehe puhul tekitavad mobiilis laiema dokumendi peamiselt absoluutse positsiooniga dekoratiivsed elemendid ning mõnel laiusel hero sees olevad pikad elemendid. Leht vajab sektsioonitasemel `overflow-x: clip` või dekoratsiooni mõõtude mobiilset kohandamist. Globaalne `body { overflow-x: hidden }` peidaks sümptomi, kuid ei lahendaks valesti mõõdetud interaktiivseid elemente.

### 5.2. CTA ja telefoninupu nähtavus

320 px vaates läheb mitmel hero-lehel telefoninupp osaliselt nähtavast sisualast välja. Näited:

- `/koristusteenus/` — telefoninupu parem serv umbes 345 px, sisuvaade 305 px;
- `/puhastusteenused/ehitusjargne-koristus/` — parem serv umbes 318 px;
- `/kontakt/` — parem serv umbes 311 px;
- `/tule-meile-toole/` — parem serv umbes 332 px.

Kuigi mõnel lehel vanem konteiner peidab tegeliku horisontaalse kerimise, pole nupp tervenisti nähtav. Hero CTA-de rida peab 320 px juures minema kindlalt veergu või kasutama täislaiusega nuppe.

### 5.3. Vene avalehe hero kontrast

Vene avalehe mobiilivaates on hallikas tekst paigutatud heleda ja detailse autofoto peale. H1 ja kirjeldus sulanduvad taustaga.

Vajalik:

- tugevam tume overlay;
- või tekstile eraldi poolläbipaistev tume paneel;
- kontrollida kontrasti vähemalt WCAG AA tasemel;
- mitte loota ainult tekstivarjule.

### 5.4. Kirjasuurus

Kontrollitud põhilistes mobiilivaadetes ei leitud nähtavat tekstielementi arvutatud kirjasuurusega alla 15 px. See vastab projekti `AGENTS.md` nõudele.

### 5.5. Mobiilimenüü

Põhiline hamburger-nupp on nähtav ja vähemalt 44 × 44 px. Menüü on dialoogina märgistatud. Keelevalik on mobiilimenüüs piisava puutealaga.

Täiendavalt tuleb pärast URL-struktuuri parandamist kontrollida, et iga vene menüülink viib parandatud vene slugile, mitte katkisele või ingliskeelsele variandile.

## 6. Lingid, hierarhia ja SEO

### 6.1. Sitemap

Sitemap sisaldab 140 URL-i. Põhiteenuste eesti, inglise ja vene variandid on üldiselt olemas ning `hreflang` seosed genereeritakse.

Probleemid:

- lumekoristuse sitemap-URL teeb kohe 308 ümbersuunamise;
- vene slugid on semantiliselt valed või kärbitud;
- väliteenuste dubleeruvad URL-id ei ole konsolideeritud;
- sitemap’is olevad vene URL-id on inimesele raskesti mõistetavad;
- blogi ja arvustuste URL-id olid lokaalses kontrollis blokeeritud pika andmebaasiootega.

### 6.2. Siselinkide ümbersuunamised

Leiti mitu siselinki, mis ei lähe otse lõpp-URL-ile:

- `/andmekaitsetingimused` → `/andmekaitsetingimused/`;
- `/en/privacy-policy` → `/en/privacy-policy/`;
- vene privaatsus-URL ilma slashita → slashiga URL;
- `/koristusteenus/koolide-koristamine/` → `/koolide-koristamine/`;
- `/puhastusteenused/desinfitseerimine/` → `/puhastusteenused/koroonaviiruse-jargne-puhastus/`;
- `/valikoristus/lumekoristus/` → pikk füüsiline URL.

Üksik 308 ei ole katastroof, kuid oma saidi siselingid peaksid osutama otse lõpp-URL-ile. See:

- vähendab tarbetuid päringuid;
- muudab indekseerimise signaalid selgemaks;
- väldib hilisemaid ümbersuunamisahelaid.

### 6.3. Lehehierarhia

Eesti originaallehtedel on mitmel juhul breadcrumb’i sisu või visuaalsed hierarhiaviited olemas.

Inglise ja vene teenuselehed renderdatakse üldise `LocalizedContentPage` komponendiga. See komponent:

- loeb küll sisuplokkidest tekste;
- ei renderda sisufailis olevaid breadcrumb-välju;
- liidab H1 pealkirjaread;
- kuvab üldised sektsioonid ühesuguses järjekorras.

Tagajärg:

- lokaliseeritud alamlehtedel puudub nähtav semantiline teekond `Avaleht → põhiteenus → alamteenus`;
- kasutaja peab hierarhia mõistmiseks lootma menüüle ja jalusele;
- AI ja otsingumootor saavad küll URL-ist mingi struktuuri, kuid lehe põhisisu ei kinnita seda;
- vene URL-id ise on vigased, mistõttu ei saa ka URL-struktuurile loota.

Soovitus:

- lisada kõigile teenuselehtedele semantiline `<nav aria-label="Breadcrumb">`;
- kasutada päris linke avalehele ja otsesele põhiteenusele;
- lisada vastav `BreadcrumbList` JSON-LD;
- mitte teha alamlehe ainsaks “parent”-viiteks jaluse või megamenüü linki.

### 6.4. H1 ja title

Kontrollitud tavateenuselehtedel oli üldiselt üks H1. See on positiivne.

Probleem ei ole H1 arv, vaid kvaliteet:

- inglise ja vene lokaliseeritud H1-d liidavad kaks fraasi mehaaniliselt;
- osa vene title’eid on eesti keeles;
- osa title’eid kirjeldab valet teenust;
- osa on märksõnaloendid;
- “№1 в Эстонии” on tõendamata ülivõrre.

### 6.5. Välisteenuste dubleerimise mõju AI-le

Kui sama teenus on kahe eri URL-i all ning mõlemal on eri canonical, võib otsingurobot või AI-indekseerija järeldada, et:

- tegemist on kahe eri teenusega;
- ettevõttel on kaks vastuolulist teenusehierarhiat;
- `/valikoristus` on põhiteenus, kuid osa linke ütleb, et see kuulub `/koristusteenus` alla.

Valida tuleb üks taksonoomia:

`Teenused → Välikoristus → Fassaadipesu`

või

`Teenused → Koristusteenus → Välikoristus → Fassaadipesu`.

Praegune leht kasutab mõlemat korraga.

### 6.6. Blogi siselingid

24 blogipostituses leiti 81 linki, 54 unikaalset sihtmärki.

Probleemid:

- osa blogilinke viib `/koristusteenus/valikoristus/...` dubleeritud URL-idele;
- vana kontaktlink kasutab fragmenti `#kysipakkumist`, kuid praeguse vormi ID on `#pakkumine`;
- mitmed vanad välislingid kasutavad endiselt `http://`;
- osa välisallikaid võib olla aegunud või kadunud;
- vanas imporditud HTML-is on vigane sulgev märgend: avatakse `<h2>`, suletakse `</h3>`;
- vähemalt üks blogitekst sisaldab kirjaviga `pools professionaalsesse`, mis peaks olema `poolprofessionaalsesse`;
- vanades artiklites kasutatakse ajaloolisi hindu ja palganumbreid; need peavad olema väga selgelt kuupäevastatud, et neid ei peetaks 2026. aasta hinnainfoks.

Blogi artiklid peaksid sisaldama:

- nähtavat avaldamis- või uuendamiskuupäeva;
- linki blogi põhilehele;
- kontekstipõhist linki teenuse põhilehele;
- ainult ühte eelistatud sisemist URL-kuju;
- kontrollitud allikaid faktiväidete juures.

## 7. Sisu loogika ja järjepidevus

### 7.1. Ettevõtte vanus

Lehel kasutatakse väidet “Üle 20 aasta kogemust”, samal ajal öeldakse mujal, et SPS Grupp alustas 2006. aastal.

2026. aastal on 2006. aastal asutatud ettevõttel sõltuvalt täpsest kuupäevast 19–20 või täpselt 20 aastat tegevust, mitte tingimata “üle 20 aasta”.

Lisaks esineb vanas blogipostituses asutamisaastana 2007.

Vajalik on üks kinnitatud fakt:

- ettevõte asutati 2006 või 2007;
- tegevus algas millal;
- “20 aastat”, “üle 20 aasta” või “alates 2006. aastast”.

Kuni kuupäev pole kinnitatud, on kõige turvalisem `Alates 2006. aastast`.

### 7.2. Teeninduspiirkond

Enamik lehti ütleb Tallinn ja Harjumaa. Mõni tekst lubab kokkuleppel teenust üle Eesti. See võib olla õige, kuid hierarhia peaks olema:

- põhiteeninduspiirkond: Tallinn ja Harjumaa;
- suuremad objektid või erilahendused: kokkuleppel üle Eesti.

Praegu ilmub üleriigiline lubadus üksikutes tekstides ja võib jätta teenindusala osas vastuolulise mulje.

### 7.3. Miinimumobjekti suurus

Regulaarse koristuse lehed ütlevad, et teenindatakse äripindu alates 800 m².

Samas kontaktilehe ingliskeelses tekstis öeldakse, et teenindatakse ka väiksemaid kontoreid. Need väited vajavad eristamist:

- kas 800 m² miinimum kehtib ainult regulaarsele lepingulisele koristusele;
- kas eritöid tehakse ka väiksematel pindadel;
- kas “smaller offices” on vale või teadlik erand.

### 7.4. Teenuse nimetused

Lehel kasutatakse läbisegi:

- koristusteenus;
- puhastusteenus;
- sanitaartööd;
- eripuhastus;
- hoolduskoristus;
- regulaarne koristus.

Need ei ole alati sünonüümid. SEO ja kasutaja mõistmise jaoks tuleks sõnastada taksonoomia:

- regulaarne hoolduskoristus;
- ühekordsed eripuhastustööd;
- välikoristus ja territooriumi hooldus;
- remondi- ja tehnilised tööd.

Inglise “Sanitation and Specialist Cleaning Services” ning vene otsetõlge ei sobitu hästi eestikeelse “Puhastusteenused” lehega.

## 8. Blogi ja arvustuste töökindlus

`/blog/` ja `/sps-grupp/arvamused/` ei vastanud lokaalses rakenduses 60 sekundi jooksul.

Lähtekood näitab:

- blogi proovib `DATABASE_URL` olemasolul lugeda muudatusi andmebaasist;
- arvustused proovivad andmebaasist lugeda testimonial’e;
- JSON fallback toimub alles pärast andmebaasipäringu vea saabumist;
- päringul ei ole nähtavat lühikest timeout’i.

Kui andmebaasivõrk ripub ega anna kohe viga, ei jõuta fallback’ini.

Mõju:

- blogi ja arvustuste lehed võivad jääda kasutajale lõputult laadima;
- sitemap’i genereerimine või serverrenderdus võib aeglustuda;
- lingikontroll annab timeout’i, mitte 200 vastuse;
- SEO robot võib lehelt loobuda.

Parandus:

- lisada andmebaasipäringutele selge ajapiirang;
- staatilise sisu puhul kasutada JSON-i kohe ja liita DB muudatused ainult siis, kui DB vastab kiiresti;
- logida fallback’i põhjus;
- lisada tervisetest, mis nõuab blogilt ja arvustustelt vastust näiteks alla 3 sekundi.

## 9. Tehnilise kontrolli tulemused

### 9.1. Build

`npm run build` õnnestus:

- Next.js kompileerus;
- TypeScript kontroll läbis;
- 69 staatilise lehe genereerimine õnnestus;
- build lõpetas veata.

### 9.2. Lint

`npm run lint` lõpetas:

- 0 viga;
- 5 hoiatust.

Kõik viis hoiatust puudutavad kasutamata `eslint-disable` direktiive abiskriptides. Need ei mõjuta avalikku lehte.

### 9.3. Renderduse hydration-hoiatus

Arenduslogis esines JSON-LD `<script>` elementide nonce’i serveri ja kliendi erinevusest põhjustatud hydration mismatch.

See ei paistnud põhisisu kohe katki tegevat, kuid:

- React ütleb, et atribuute kliendis ei parandata;
- CSP nonce võib olla turbe seisukohalt oluline;
- viga tekitab arenduslogis müra ja võib peita päris hydration-vigu.

Nonce tuleb genereerida ja edasi anda serveri ning kliendi vahel deterministlikult.

## 10. Parandusjärjekord

### P0 — enne avaldamist

1. Ühtlustada eesti teenusesisu allikas: eemaldada kasutamata ingliskeelsed `et.json` koopiad või muuta `et.json` teadlikult eestikeelseks lähtesisuks.
2. Toimetada vene sisu emakeelse toimetajaga.
3. Parandada vene URL-id ja lisada vanadelt URL-idelt 308 suunamised.
4. Eemaldada väliteenuste dubleeruvad URL-id ja canonical-konflikt.
5. Parandada ehitusjärgse koristuse hinnaloogika.
6. Lahendada blogi ja arvustuste lõputu andmebaasiootus.
7. Parandada vene lehetiitlid, eriti `Интерьеры` ja eestikeelsed title’id.

### P1 — väga oluline

1. Täpsustada hoolduskoristuse kalkulaatori tähendust või lisada puuduvad hinnategurid.
2. Lisada breadcrumb’id kõigi keelte alamlehtedele.
3. Teha kandideerimisvormis nimi, piirkond, töökoormus ja tööaeg teadlikult nõutavaks.
4. Lisada CV üleslaadimine või selge alternatiiv.
5. Parandada 320–390 px horisontaalne ülevool.
6. Tugevdada vene avalehe hero kontrasti.
7. Uuendada kõik siselingid lõpp-URL-idele ilma 308 vaheastmeta.

### P2 — kvaliteet ja SEO

1. Ühtlustada terminoloogia.
2. Kontrollida ettevõtte asutamisaasta ja kogemuse väited.
3. Ühtlustada teeninduspiirkonna kirjeldus.
4. Puhastada blogi vigane HTML.
5. Uuendada vanad `http://` välislingid.
6. Parandada blogi vana `#kysipakkumist` fragment.
7. Lisada hinnainfo juurde käibemaksu märge.
8. Eemaldada tõendamata `№1 в Эстонии`.
9. Parandada CSP nonce’i hydration mismatch.

## 11. Soovituslik vastuvõtukontroll pärast parandusi

Parandused on valmis alles siis, kui:

- `et.json` ja `en.json` pikkade identsete väärtuste arv on viidud põhjendatud eranditeni;
- iga eesti leht on tervikuna eesti keeles;
- iga vene leht on tervikuna loomulikus vene keeles;
- ükski vene URL ei ole kärbitud ega sega ladina ja kirillitsa tähti;
- iga teenus on indekseeritav ainult ühe kanoonilise URL-iga;
- sitemap’i URL-id tagastavad otse 200, mitte 308;
- 320, 360, 390 ja 768 px vaates pole horisontaalset kerimist;
- ükski CTA, telefoninupp, hinnakaart ega vormiväli ei lähe ekraanilt välja;
- hinnakaartide arvud sobivad avaldatud valemite ja vahemikega;
- blogi ja arvustused vastavad stabiilselt alla 3 sekundi;
- kontaktivormi ja kandideerimisvormi test saadetakse igas keeles testpostkasti;
- serveri veateated kuvatakse õiges keeles;
- breadcrumbs, canonical ja `hreflang` viitavad samale valitud URL-struktuurile;
- build, lint ja automatiseeritud lingikontroll läbivad vigadeta.
