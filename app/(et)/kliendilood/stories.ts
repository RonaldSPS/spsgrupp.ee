import type { CaseStudyFact, CaseStudyFaq } from "@/lib/case-study-format"

/**
 * Kliendilugude baas-sisu (üks tõeallikas, commit'itud).
 *
 * Uue loo lisamine: lisa objekt `caseStudies` massiivi (vaba `id`, unikaalne
 * `slug`) - hub, detailleht, avalehe slider ja sitemap võtavad aktiivsed lood
 * automaatselt üles (ISR, uued lehed vajavad build'i sarnaselt blogiga).
 * Admin (spsadmn/kliendilood) saab lugusid redigeerida ja peita/aktiveerida
 * (overlay case_study_edits tabelis / data/admin-case-study-edits.json).
 *
 * Reeglid (sama mis blogi kanibaliseerimise tõke):
 *  - pealkiri EI TOHI alata teenuselehe tuumikmärksõnaga nominatiivis
 *    (muster „Kliendilugu: …" on ohutu);
 *  - TL;DR sees peab olema teenuselehe link (otsingujõud suunatakse
 *    teenuselehele, lugu toetab - mitte ei konkureeri).
 */

export interface CaseStudy {
  /** Stabiilne id (admin-overlay ja API võtmed) - nt "estravel-kontor". */
  id: string
  /** URL-slug: /kliendilood/<slug> */
  slug: string
  clientName: string
  /** Kliendi logo kaartidel ja tsitaadi juures (image spot). */
  clientLogo: string
  quoteAuthor: string
  quoteRole: string
  /** Filtrisilt hubis, nt "Kontor + müügisaal". */
  objectType: string
  /** Filtri võti hubis, nt "kontor". */
  objectTypeSlug: string
  /** Lühike faktikiip kaartidel, nt "1290 m² · kesklinn". */
  keyStat: string
  title: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  /** Hero-pilt (image spot) - objekti/hoone foto; admin saab vahetada. */
  heroImage: string
  heroImageAlt: string
  /** "YYYY-MM-DD" - kuvamise ja sorteermise jaoks (ajastust pole). */
  datePublished: string
  /** TL;DR intro (HTML, võib sisaldada linke) - peab sisaldama teenuselehe linki. */
  tldrHtml: string
  /** Faktitabeli read. */
  facts: CaseStudyFact[]
  /** Põhitekst (HTML): vajadus / korraldus / tulemused sektsioonid. */
  bodyHtml: string
  /** Kliendi tsitaat (puhas tekst, ilma jutumärkideta). */
  quoteText: string
  faq: CaseStudyFaq[]
  relatedLinks: { label: string; href: string }[]
  active: boolean
}

export const caseStudies: CaseStudy[] = [
  {
    id: "estravel-kontor",
    slug: "kliendilugu-estravel-kontori-ja-myygisaali-hoolduskoristus",
    clientName: "Estravel",
    clientLogo: "/arvamused-logod/paul.png",
    quoteAuthor: "Paul Lushkov",
    quoteRole: "haldusjuht",
    objectType: "Kontor + müügisaal",
    objectTypeSlug: "kontor",
    keyStat: "1290 m² · kesklinn",
    title: "Kliendilugu: Estraveli kontori ja müügisaali hoolduskoristus Tallinna kesklinnas",
    excerpt:
      "Estraveli 1290 m² objekt Suur-Karja 15 ühendas viie korruse kontorid ja klientidele avatud müügisaali. Lahendus: läbimõeldud graafik ruumide kasutuse järgi - müügisaal kaks korda nädalas, kontorid korruste kaupa, kõik tööd peale tööpäeva.",
    metaTitle: "Estraveli kliendilugu: kontori ja müügisaali koristus | SPS",
    metaDescription:
      "Kuidas SPS Grupp hooldas Estraveli 1290 m² kontorit ja müügisaali Suur-Karja tänaval: müügisaal 2× nädalas, kontorid korruste kaupa, tööd algasid 17.30.",
    heroImage: "/images/industries/kontorid-1600x920.webp",
    heroImageAlt: "SPS Grupi hoolduskoristus Estraveli kontoris ja müügisaalis Suur-Karja tänaval",
    datePublished: "2026-11-05",
    tldrHtml:
      '<p>Kuidas korraldada <a href="/koristusteenus/hoolduskoristus/">hoolduskoristust</a> objektil, kus klientidele avatud müügisaal vajab tihedamat hooldust ja viie korruse kontorid korrapärast rütmi? Estraveli 1290 m² objektil Suur-Karja 15 Tallinna kesklinnas lahendas SPS Grupp selle läbimõeldud graafikuga: müügisaali koristati kaks korda nädalas, kontoripindu kord nädalas korruste kaupa eri päevadel - ja kõik tööd algasid kell 17.30, et objekt oleks iga hommik puhas. Koostöö kestis tähtajatu lepingu alusel üle nelja aasta (04.01.2022-2026).</p>',
    facts: [
      { label: "Klient", value: "Estravel - reisibüroo" },
      { label: "Objekt", value: "Kontoripinnad korrustel 0-4 + esimese korruse müügisaal" },
      { label: "Aadress", value: "Suur-Karja 15, Tallinna kesklinn" },
      { label: "Pindala", value: "1290 m²" },
      { label: "Teenus", value: "Hoolduskoristus - tähtajatu leping" },
      { label: "Graafik", value: "Müügisaal 2× nädalas (teisipäev, reede); kontoripinnad 1× nädalas, korruste kaupa eri päevadel" },
      { label: "Tööde algus", value: "kell 17.30 - kogu koristus peale tööpäeva" },
      { label: "Koostöö", value: "04.01.2022 - 2026 (üle nelja aasta; praeguseks lõppenud)" },
      { label: "Lepingu kontaktisik", value: "Paul Lushkov, haldusjuht" },
    ],
    bodyHtml:
      `<h2>Milline oli kliendi vajadus?</h2>
<p>Kesklinna objekt ühendas kahte erinevat rütmivajadust: esimese korruse müügisaal on klientidele avatud ruum, mis peab olema esinduslik iga kliendipäeva hommikul, ja korrustel 0-4 asuvad kontoripinnad vajavad korrapärast nädalast hooldust, mis ei sega tööpäeva. "Kõike korraga ja üht sagedust" oleks tähendanud müügisaalile liiga vähe ja kontoritele liiga palju - ja kallimat lepingut.</p>
<p>Vajalik oli partner, kes ehitab graafiku ruumide tegeliku kasutuse järgi ja kelle töö on nähtamatu: kõik koristused peale tööpäeva, algusega kell 17.30.</p>

<h2>Kuidas me töö korraldasime?</h2>
<ol>
<li><strong>Objekti ülevaatus ja tööplaan alade kaupa.</strong> Lepingu tööde hulka kirjutati: põrandate ja vaipkatete puhastamine, tööpindade ja riiulite puhastus, prügi eemaldamine, klaasuste kohtpuhastus ning tualettide ja köögipindade korrashoid.</li>
<li><strong>Graafik ruumikasutuse järgi.</strong> Müügisaal - kliendi nähtavaim ruum - koristati kaks korda nädalas, teisipäeval ja reedel. Kontoripindu koristati kord nädalas, jaotatuna korruste kaupa eri päevadele: igal korrusel oli oma kindel koristuspäev, mis tegi tulemuse ennustatavaks ja kontrollitavaks.</li>
<li><strong>Tööaeg 17.30.</strong> Kogu hooldus toimus peale tööpäeva - koristus ei segi töötajaid ega kliente ja hommikuks on objekt puhas.</li>
<li><strong>Kindel meeskond ja objektijuht.</strong> Objektil töötas kindel meeskond; objektijuht tegi regulaarseid kontrollkäike ja kontaktisikuna toimis üks nimetatud inimene, mitte anonüümne info-aadress.</li>
</ol>

<h2>Tulemused: mida klient võitis?</h2>
<table>
<thead><tr><th>Valdkond</th><th>Lahendus ja tulemus</th></tr></thead>
<tbody>
<tr><td><strong>Müügisaali esinduslikkus</strong></td><td>Klientidele avatud ruum koristuses 2× nädalas (teisipäev, reede) - saal puhas iga kliendipäeva hommikul</td></tr>
<tr><td><strong>Kontorikorruste katvus</strong></td><td>Iga korrus oma kindla koristuspäevaga - ükski korrus ei jäänud "kahe koristuse vahele"</td></tr>
<tr><td><strong>Tööpäev sujuv</strong></td><td>Kõik tööd algasid 17.30 - hooldus ei seganud töötajaid ega kliente</td></tr>
<tr><td><strong>Koostöö kestus</strong></td><td>Üle nelja aasta tähtajatu lepingu alusel - stabiilsuse praktiline tõend</td></tr>
</tbody>
</table>`,
    quoteText:
      "Soovin edastada tänusõnad ja kiituse väga hea kontorikoristuse eest. Üldine tagasiside on väga positiivne, kontor on puhas, korras ja hästi hooldatud. On näha, et tööd tehakse hoolikalt ning kvaliteedile pööratakse tähelepanu.",
    faq: [
      {
        q: "Kui tihti peaks kontorit koristama?",
        a: "Enamikule kontoritest soovitame 3-5 korda nädalas; Estraveli objektil piisas kontoripindadest korruste kaupa jaotatud nädalasest rütmist, sest kriitilisem müügisaal oli eraldi, tihedama graafikuga. Täpne sagedus koostatakse tasuta objekti ülevaatuse käigus.",
      },
      {
        q: "Kas koristate ka klientidele avatud müügi- ja teenindussaale?",
        a: "Jah - Estraveli esimese korruse müügisaal oli lepingus eraldi rütmiga (2× nädalas). Avatud ruumide graafik planeeritakse alati kliendipäevade ette, mitte järele.",
      },
      {
        q: "Kas koristus toimub tööajal või õhtuti?",
        a: "Tavaliselt töövälises ajas - Estraveli objektil algasid tööd kell 17.30. Kokkuleppel on võimalik ka päevane valvekoristus.",
      },
      {
        q: "Kuidas on tagatud asendus, kui koristaja haigestub või jääb puhkusele?",
        a: "Igale objektile on määratud kindel meeskond koos asenduslahendusega - asendaja on objektiga tutvustatud ja teenus ei katke.",
      },
      {
        q: "Palju kontori hoolduskoristus maksab?",
        a: "Hind sõltub pindalast, sagedusest ja mahust - orienteeruv tase on alates 1,20 €/m² kuus. Täpse pakkumise koostame tasuta objekti ülevaatuse järel ühe tööpäevaga.",
      },
    ],
    relatedLinks: [
      { label: "Kontori koristus", href: "/koristusteenus/kontori-koristus/" },
      { label: "Hoolduskoristus", href: "/koristusteenus/hoolduskoristus/" },
      { label: "Klientide tagasiside", href: "/sps-grupp/arvamused/" },
    ],
    active: true,
  },
  {
    id: "fazer-tootmine",
    slug: "kliendilugu-fazer-tootmiskeskkonna-koristus",
    clientName: "Fazer",
    clientLogo: "/arvamused-logod/heido.png",
    quoteAuthor: "Heido Valton",
    quoteRole: "haldusjuht",
    objectType: "Tootmine",
    objectTypeSlug: "tootmine",
    keyStat: "Tootmine 7 päeva nädalas",
    title: "Kliendilugu: Fazeri tootmiskeskkonna koristus - tootmisruume hooldati 7 päeva nädalas",
    excerpt:
      "Kuidas korraldada toiduainetootmise koristust, kus tootmisruume ja seadmeid tuleb hooldada seitse päeva nädalas ja ühes üksuses on ainus võimalik aken öösel kell 23-03? Fazeri kahe objekti kogemus.",
    metaTitle: "Fazeri kliendilugu: tootmiskeskkonna koristus | SPS Grupp",
    metaDescription:
      "Fazeri teenindusköök Jälgimäel ja kondiitriüksus Kadaka teel: tootmisruumid ja seadmed 7 päeva nädalas, vahupesu, masinpesu, desinfitseerimine.",
    heroImage: "/tootmishoonete-koristus.webp",
    heroImageAlt: "Tootmisruumide koristus Fazeri teenindusköögil Jälgimäel",
    datePublished: "2026-11-05",
    tldrHtml:
      '<p>Toiduainetootmise koristus on režiimitöö: ei piisa "puhtast", vaja on õiget võtet õiges ruumis õigel ajal. Fazeri teenindusköögis Jälgimäel (tootmisruumid 1066 m², külm- ja kuivainelaod ~346 m², kontorid ja üldpinnad 254 m²) ning kondiitriüksuses Tallinnas Kadaka teel (482 m²) korraldas SPS Grupp <a href="/koristusteenus/tootmishoonete-koristus/">tootmisruumide koristuse</a> nii, et tootmisruume ja seadmeid hooldati seitse päeva nädalas kuni nelja puhastusteenindajaga - ja Kadaka üksuses iga öö kell 23.00-03.00. Iga ruumitüübi jaoks oli lepingus oma töövõte, sagedus ja aeg.</p>',
    facts: [
      { label: "Klient", value: "Fazer - toiduainetootmine" },
      { label: "Objektid", value: "Teenindusköök, Jälgimäe tee 14, Saku vald (põhiobjekt) + kondiitriüksus, Kadaka tee 70D, Tallinn" },
      { label: "Pindala (Jälgimäe)", value: "Tootmisruumid 1066 m² · kuivaine-, jahe- ja sügavkülmalaod kokku ~346 m² · kontorid, puhkeruum ja tootmise kontorid 254 m² · lisaks koridorid, trepid, kauba vastuvõtt, garderoobid ja tualetid" },
      { label: "Pindala (Kadaka)", value: "482,27 m²" },
      { label: "Sagedus (Jälgimäe)", value: "Tootmisruumid ja seadmed 7 päeva nädalas (kuni 4 puhastusteenindajat) · laod ja sanitaarruumid 7 päeva nädalas · kontorid ja osa üldpindu 3× nädalas" },
      { label: "Graafik (Kadaka)", value: "Iga päev kell 23.00-03.00, 2-3 puhastusteenindajat" },
      { label: "Töövõtted", value: "Vahupesu · põrandate masinpesu · pindade ja trappide desinfitseerimine · seadmete puhastus kliendi juhendite järgi" },
      { label: "Lepingu kontaktisik", value: "Heido Valton, haldusjuht" },
      { label: "Staatus", value: "Koostöö lõppenud" },
    ],
    bodyHtml:
      `<h2>Milline oli kliendi vajadus?</h2>
<p>Tootmisettevõtte koristus erineb kontorist kolmes kohas. Esiteks peab hügieen arvestama toiduainetööstuse nõuetega - erinevate ruumide ja seadmete jaoks on erinevad töövõtted. Teiseks peab graafik haakuma tootmise rütmiga: seisakuid koristuse tõttu ei tohi tekkida, mistõttu tootmisruumide hooldus oli lepingus ette nähtud seitse päeva nädalas. Kolmandaks on pinnad heterogeensed: tootmisruumid, kuivaine- ja külmalaod, kontorid, garderoobid ja kauba vastuvõtt - igaüks oma sageduse ja nõuetega.</p>
<p>Lisanduväljakutsena oli Kadaka kondiitriüksus, kus ainus võimalik koristusaken oli öine - iga päev kell 23.00-03.00.</p>

<h2>Kuidas me töö korraldasime?</h2>
<ol>
<li><strong>Tsoonipõhine tööplaan.</strong> Tootmisruumid, laod, kontorid ja üldpinnad kirjutati lepingusse eraldi - iga tsooni kohta oma tööde loetelu, sagedus ja aeg. Nii ei sega tootmise igapäevane hooldus kontorite kolmekordset nädalarütmi ja vastupidi.</li>
<li><strong>Töövõtted ruumi ja pinna järgi.</strong> Lepingu tööde hulka kuulusid vahupesu, põrandate masinpesu, pindade ja trappide desinfitseerimine ning seadmete puhastus kliendi juhendite järgi - meeskond töötab objekti omade hügieenireeglite raames, mitte ühe universaalse šablooniga.</li>
<li><strong>Ressurss tootmise rütmis.</strong> Tootmisruumide ja seadmete koristust tegi kuni neli puhastusteenindajat seitse päeva nädalas - graafikud olid planeeritud nii, et tootmine ei seiskunud.</li>
<li><strong>Öine töökorraldus Kadaka üksuses.</strong> Kondiitriüksust (482,27 m²) koristati iga päev kell 23.00-03.00 kahe kuni kolme puhastusteenindajaga - klient alustas hommiku alati puhtas ruumis.</li>
<li><strong>Objektijuht ja kindel meeskond.</strong> Regulaarne kvaliteedikontroll ja üks nimetatud kontaktisik; asenduslahendus tagatud haiguste ja puhkuste ajaks.</li>
</ol>

<h2>Tulemused: mida klient võitis?</h2>
<table>
<thead><tr><th>Valdkond</th><th>Lahendus ja tulemus</th></tr></thead>
<tbody>
<tr><td><strong>Kogu objekti katvus</strong></td><td>Tootmisruumid, laod ja sanitaarruumid 7 päeva nädalas; kontorid ja üldpinnad 3× nädalas - ükski tsoon ei jäänud teenuseta</td></tr>
<tr><td><strong>Hügieen protokollidena</strong></td><td>Vahupesu, desinfitseerimine ja seadmete puhastus kliendi juhendite järgi - fikseeritud töövõtted, mitte "vajaduse korral"</td></tr>
<tr><td><strong>Paindlikkus</strong></td><td>Kaks erinevat objekti ja Kadaka öötöö (23-03) ühe partneri ja ühe lepingu all</td></tr>
<tr><td><strong>Töötajate keskkond</strong></td><td>Puhas ja korrastatud töökeskkond igas vahetuses - toetab heaolu ja sujuvat toimimist</td></tr>
</tbody>
</table>`,
    quoteText:
      "SPS Grupp on olnud meie jaoks usaldusväärne koostööpartner. Nii tootmis-, lao- kui ka kontoriruumide korrashoid on olnud järjepidevalt kõrgel tasemel. Hindame nende professionaalset lähenemist, paindlikkust ja võimet tagada kvaliteet ka suure kasutuskoormusega keskkonnas. Puhas ja korrastatud töökeskkond aitab kaasa nii töötajate heaolule kui ka ettevõtte sujuvale toimimisele.",
    faq: [
      {
        q: "Kuidas koristus tootmisprotsessi ei sega?",
        a: "Töögraafik pannakse kokku koos tootmisjuhiga. Fazeri näitel hooldati tootmisruume seitse päeva nädalas kuni nelja teenindajaga ja Kadaka üksust öösel kell 23-03 - koristus ei tohi kunagi olla põhjus, miks tootmine seisab.",
      },
      {
        q: "Kas SPS arvestab toiduainetööstuse hügieeninõudeid?",
        a: "Jah - töövõtted fikseeritakse lepingus ruumiti (nt vahupesu, pindade ja trappide desinfitseerimine) ja seadmeid puhastatakse kliendi juhendite järgi. Meeskond läbib objektispetsiifilise väljaõppe.",
      },
      {
        q: "Kas laod, garderoobid ja sanitaarruumid saab samasse lepingusse?",
        a: "Jah - Fazeri lepingus olid laod ja sanitaarruumid 7 päeva nädalas ning kontorid ja üldpinnad 3× nädalas. Meie tugevus on kogu objekti katvus ühe lepingu ja ühe objektijuhi all.",
      },
      {
        q: "Palju tootmisruumide koristus maksab?",
        a: "Hind sõltub pindalast, sagedusest ning ohutus- ja hügieeninõuetest - täpne pakkumine koostatakse tasuta objekti ülevaatuse järel ühe tööpäevaga.",
      },
    ],
    relatedLinks: [
      { label: "Tootmishoonete koristus", href: "/koristusteenus/tootmishoonete-koristus/" },
      { label: "Hoolduskoristus", href: "/koristusteenus/hoolduskoristus/" },
      { label: "Suurpuhastus", href: "/puhastusteenused/suurpuhastus/" },
    ],
    active: true,
  },
  {
    id: "logistikapluss-ladu",
    slug: "kliendilugu-logistikapluss-logistikakeskuse-korrashoid",
    clientName: "LogistikaPluss",
    clientLogo: "/arvamused-logod/mati.png",
    quoteAuthor: "Mati Tõnts",
    quoteRole: "haldusjuht",
    objectType: "Logistikakeskus",
    objectTypeSlug: "ladu",
    keyStat: "Koostöö alates 2015",
    title: "Kliendilugu: üle 11 aastat LogistikaPlussi logistikakeskuse korrashoidu",
    excerpt:
      "LogistikaPlussi logistikakeskust Välja tee 1 Irus on SPS Grupp hooldanud alates 01.09.2015 - üle 11 aasta. Kuidas jagatakse logistikakeskuse tööd päevaseks laokoristuseks ja õhtuseks kontorihoolduseks?",
    metaTitle: "LogistikaPlussi kliendilugu: lao korrashoid | SPS Grupp",
    metaDescription:
      "SPS Grupp on hooldanud LogistikaPlussi logistikakeskust Irus alates 2015: 6000 m² laopinda, päevane laokoristus ja õhtune kontorihooldus.",
    heroImage: "/porandate-hooldus-1.webp",
    heroImageAlt: "LogistikaPlussi logistikakeskuse põrandate hooldus Irus",
    datePublished: "2026-11-05",
    tldrHtml:
      '<p>Üle 11 aasta kestev koostöö on koristusvaldkonnas harv ja kõneleb süsteemist, mis töötab. LogistikaPlussi logistikakeskust Välja tee 1 Iru külas Harjumaal - 6000 m² laopinda, 2388 m² teise korruse tootmis- ja laoruumid ning 1056 m² siseruume - on SPS Grupp hooldanud alates 01.09.2015. <a href="/koristusteenus/hoolduskoristus/">Korrashoiuleping</a> on ehitatud kahele rütmile: lao- ja tootmisruumide päevane koristus tööpäeviti ning kontoripindade õhtune põhihooldus - kokku viis koristuspäeva nädalas.</p>',
    facts: [
      { label: "Klient", value: "LogistikaPluss - logistikateenused" },
      { label: "Objekt", value: "Logistikakeskus, Välja tee 1, Iru küla, Harjumaa" },
      { label: "Mahud", value: "Laopinda 6000 m² · teise korruse tootmis-/laoruumid 2388 m² · siseruume 1056 m²" },
      { label: "Teenus", value: "Siseruumide korrashoid - 5 koristuspäeva nädalas" },
      { label: "Päevane koristus (ladu/tootmine)", value: "Tööpäeviti: töökohtade ümbruse põrandad ja prügi iga päev; riiulid, alused, piirded ja muud ligipääsetavad pinnad ringimeetodil 1× nädalas" },
      { label: "Õhtune hooldus (kontorid)", value: "Kontoripindade põhikoristus tööpäeviti, kui büroopäev on läbi" },
      { label: "Koostöö", value: "Alates 01.09.2015 - üle 11 aasta, kestab" },
      { label: "Lepingu kontaktisik", value: "Mati Tõnts, haldusjuht" },
    ],
    bodyHtml:
      `<h2>Milline oli kliendi vajadus?</h2>
<p>Logistikakeskus töötab pidevas kaubavoolus: põrandad ja töökohtade ümbrus vajavad igapäevast tähelepanu, aga kogu 6000 m² pole mõtet ega majanduslikku põhjust iga päev üle käia. Samal ajal peab sama partner katma ka kontori- ja üldpinnad, et kogu objekti üldmulje oleks ühtlane - ja kontori hooldus ei tohi segada lao päevatööd.</p>
<p>Vaja oli süsteemi, kus igapäevane kriitiline hooldus ja perioodiline süstemaatiline koristus katavad koos kogu pinna - kontrollitava graafiku ja ühe vastutajaga.</p>

<h2>Kuidas me töö korraldasime?</h2>
<ol>
<li><strong>Kahe rütmi mudel.</strong> Objekti töö jagunes päevaseks koristuseks lao- ja tootmisruumides (tööpäeviti) ning õhtuseks kontoripindade põhihoolduseks, kui büroopäev on läbi - koristus ei sega kumbagi protsessi.</li>
<li><strong>Igapäevane kriitiliste alade hooldus.</strong> Töökohtade ümbruse põrandad ja prügi eemaldatakse iga päev - mustust ei ladestu ja lao töö tempo ei aeglustu.</li>
<li><strong>Ringimeetod suurele pinnale.</strong> Riiulid, alused, piirded ja muud ligipääsetavad pinnad puhastatakse ringimeetodil kord nädalas - kogu suur pind saab süstemaatiliselt kaetud ilma igapäevase ülepaisutuseta ja iga ala kordustulemus on graafikuga kontrollitav.</li>
<li><strong>Viis koristuspäeva nädalas, kindel meeskond.</strong> Objektil töötab kindel meeskond koos asenduslahendusega; objektijuht teeb regulaarseid kontrollkäike ja tagasiside kanal on üks nimetatud kontaktisik.</li>
</ol>

<h2>Tulemused: mida klient võitis?</h2>
<table>
<thead><tr><th>Valdkond</th><th>Lahendus ja tulemus</th></tr></thead>
<tbody>
<tr><td><strong>Koostöö kestus</strong></td><td>Üle 11 aastat katkematut koostööd (alates 01.09.2015) - töötava süsteemi tugevaim tõend</td></tr>
<tr><td><strong>Kogu pinna katvus</strong></td><td>Igapäevane kriitiline hooldus + nädalane ringimeetod = kogu 6000 m² on süstemaatiliselt kaetud</td></tr>
<tr><td><strong>Kontor ja ladu ühe partneri all</strong></td><td>Päevane laokoristus ja õhtune kontorihooldus ühes lepingus - üldmulje ühtlane</td></tr>
<tr><td><strong>Lao töö sujuvus</strong></td><td>Graafik on seatud lao rütmi järgi - koristus ei sega kaubavoogu</td></tr>
</tbody>
</table>`,
    quoteText:
      "Soovin anda tunnustavat tagasisidet puhastusteenuse kohta. Kontori ja logistika ning üldpindade koristus jätavad väga hea ja korrastatud mulje. Pinnad on puhtad, ruumid korras ning on näha, et koristustöid tehakse hoolikalt. Selline igapäevane tähelepanu detailidele aitab luua meeldiva töökeskkonna kõigile ruumide kasutajatele.",
    faq: [
      {
        q: "Kuidas suurt laopinda koristusega kaetakse?",
        a: "Kriitilised alad (töökohtade ümbruse põrandad, prügi) hooldatakse iga päev ja ülejäänu ringimeetodil - näiteks LogistikaPlussi objektil puhastatakse riiulid, alused ja piirded süstemaatilises ringis kord nädalas, nii et kogu pind on graafikuga kaetud.",
      },
      {
        q: "Kas koristus segab lao tööd?",
        a: "Ei - LogistikaPlussi objektil toimub lao- ja tootmisruumide koristus tööpäeviti lao rütmi arvestades ja kontoripindade põhikoristus õhtuti, kui büroopäev on läbi.",
      },
      {
        q: "Kas kontor ja sanitaarruumid saab samasse lepingusse?",
        a: "Jah - kogu objekt (ladu, tootmisruumid, kontor, üldpinnad) kaetakse ühe lepingu ja ühe objektijuhi all.",
      },
      {
        q: "Palju lao ja logistikakeskuse koristus maksab?",
        a: "Hind sõltub pindalast, sagedusest ja mahust - LogistikaPlussi objektil piisab viisest koristuspäevast nädalas kahe rütmi mudelis. Täpse pakkumise koostame tasuta objekti ülevaatuse järel ühe tööpäevaga.",
      },
    ],
    relatedLinks: [
      { label: "Tootmis- ja laopindade koristus", href: "/koristusteenus/tootmishoonete-koristus/" },
      { label: "Põrandate hooldus", href: "/puhastusteenused/porandate-hooldus/" },
      { label: "Klientide tagasiside", href: "/sps-grupp/arvamused/" },
    ],
    active: true,
  },
]
