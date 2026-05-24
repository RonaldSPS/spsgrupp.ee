import type { ServiceSeoData } from "./ServiceSeoTemplate";

const BASE_URL = "https://spsgrupp.ee";

const sharedRelatedServices: ServiceSeoData["relatedServices"] = [
  {
    title: "Vaipade puhastus",
    href: "/puhastusteenused/vaipade-puhastus",
    text: "Süvapuhastus vaipkatetele, plekkidele ja allergeenidele.",
    icon: "carpet",
  },
  {
    title: "Põrandate hooldus",
    href: "/puhastusteenused/porandate-hooldus",
    text: "Masinpesu, vahatamine, poleerimine ja kaitsekihtide uuendamine.",
    icon: "floor",
  },
  {
    title: "Akende pesu",
    href: "/koristusteenus/valikoristus/akende-pesu",
    text: "Akende, klaasseinte ja kõrgete klaaspindade pesu äripindadel.",
    icon: "window",
  },
  {
    title: "Ehitusjärgne koristus",
    href: "/puhastusteenused/ehitusjargne-koristus",
    text: "Üleandmise, remondi või kolimise järgne põhjalik puhastus.",
    icon: "construction",
  },
];

function outdoorServicePage(input: {
  slug: string;
  serviceName: string;
  serviceType: string;
  originalPath: string;
  title: string;
  accent: string;
  heroImage: string;
  contentImage: string;
  imageAlt: string;
  description: string;
  cta: string;
  introTitle: string;
  introFirst: string;
  introSecond: string;
  serviceTitle: string;
  services: [string, string][];
  strengths: [string, string, ServiceSeoData["strengths"][number]["icon"]][];
  processTitle: string;
  processSteps: [string, string][];
  buyerTitle: string;
  buyerQuestions: string[];
  pricingTitle: string;
  pricingIntro: string;
  pricingFactors: string[];
  faqItems: ServiceSeoData["faqItems"];
  footerTitle: string;
  footerDescription: string;
  chips?: ServiceSeoData["hero"]["chips"];
}): ServiceSeoData {
  return {
    slug: input.slug,
    serviceName: input.serviceName,
    serviceType: input.serviceType,
    pageUrl: `${BASE_URL}${input.originalPath}`,
    metadata: {
      title: `SEO näidis: ${input.serviceName} | SPS Grupp`,
      description: input.description,
    },
    hero: {
      aria: input.serviceName,
      image: input.heroImage,
      title: input.title,
      accent: input.accent,
      description: input.description,
      cta: input.cta,
      chips: input.chips ?? [
        { value: "SPS", label: "tööplaan", tone: "blue", icon: "clipboard" },
        { value: "ISO", label: "kvaliteet", tone: "green", icon: "shield" },
        { value: "Kogemus", label: "ärikinnistud", tone: "navy", icon: "briefcase" },
      ],
    },
    intro: {
      title: input.introTitle,
      firstBold: input.introFirst,
      firstText: "SPS lähtub objekti tegelikust kasutusest, hooajast, ligipääsust ja tööohutusest, mitte ainult teenuse nimetusest.",
      secondBold: input.introSecond,
      secondText: "Tööplaanis on kirjas sagedus, vastutus, eritingimused ja see, millal töö tehakse nii, et see ei segaks hoone kasutajaid.",
    },
    strengthsIntro: "SPS Grupi välitööde tugevus on üks vastutav partner, praktiline töökorraldus, sobiv tehnika ja objektijuhi kontroll. Nii saab kinnistu väliala hoitud sama järjepidevalt kui siseruumid.",
    strengths: input.strengths.map(([title, text, icon]) => ({ title, text, icon })),
    serviceContent: {
      title: input.serviceTitle,
      intro: [
        `${input.serviceName} on SPSi jaoks osa terviklikust kinnistu korrashoiust. Teenus pannakse kokku objekti asukoha, pinna tüübi, hooaja ja kasutuskoormuse järgi.`,
        "Selge tööplaan aitab võrrelda pakkumisi: mida tehakse regulaarselt, mida vajaduspõhiselt ja millised tööd vajavad eraldi ettevalmistust või tehnikat.",
      ],
      image: input.contentImage,
      imageAlt: input.imageAlt,
      imageCaption: "Teenuse ulatus sõltub pinnast, ligipääsust, hooajast ja objekti kasutuskoormusest.",
      groups: [
        {
          title: "Põhitööd",
          kicker: "Tööd, mis moodustavad teenuse igapäevase või hooajalise põhiosa.",
          items: input.services.slice(0, 4).map(([title, text]) => `${title}: ${text}`),
        },
        {
          title: "Detailid ja ohutus",
          kicker: "Tööd, mis mõjutavad tulemust, kasutajate turvalisust ja kinnistu üldmuljet.",
          items: input.services.slice(4, 8).map(([title, text]) => `${title}: ${text}`),
        },
        {
          title: "Perioodilised lisad",
          kicker: "Tööd, mida saab lisada hoolduslepingu või ühekordse tellimusena.",
          items: input.services.slice(8).length > 0 ? input.services.slice(8).map(([title, text]) => `${title}: ${text}`) : input.services.slice(0, 3).map(([title, text]) => `${title}: ${text}`),
        },
      ],
    },
    process: {
      title: input.processTitle,
      intro: "SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele.",
      steps: input.processSteps,
    },
    buyerGuide: {
      title: input.buyerTitle,
      intro: "Välitööde pakkumisi ei tasu võrrelda ainult ühikuhinna järgi. Oluline on, kas tööde ulatus, sagedus ja vastutus on kirjas.",
      body: "SPSi pakkumine aitab aru saada, milline töö on hinnas, millised tingimused mõjutavad töömahtu ja millal on vaja eraldi lisatööd.",
      goodTitle: "Hea pakkumine teeb töö nähtavaks",
      warningTitle: "Ohumärgid enne valikut",
      questions: input.buyerQuestions,
    },
    pricing: {
      title: input.pricingTitle,
      intro: input.pricingIntro,
      cards: [["Väike objekt", "ühekordne või hooajaline", "personaalne", "pakkumine"], ["Keskmine objekt", "regulaarne graafik", "personaalne", "pakkumine"], ["Suur kinnistu", "täisteenus", "personaalne", "pakkumine"]],
      factors: input.pricingFactors,
    },
    relatedServices: sharedRelatedServices,
    faqItems: input.faqItems,
    footerCta: {
      title: input.footerTitle,
      description: input.footerDescription,
    },
  };
}

export const serviceSeoPages: Record<string, ServiceSeoData> = {
  kontor: {
    slug: "kontori-koristus-seo-naidis",
    serviceName: "Kontori koristus",
    serviceType: "Kontorikoristus",
    pageUrl: `${BASE_URL}/koristusteenus/kontori-koristus`,
    metadata: {
      title: "SEO näidis: Kontori koristus Tallinnas | SPS Grupp",
      description: "Eraldi lab-keskkonnas loodud kontorikoristuse SEO ja AI-crawlability näidisleht.",
    },
    hero: {
      aria: "Kontori koristus",
      image: "/kontorikoristus1.jpg",
      title: "Kontori koristus",
      accent: "Tallinnas ja Harjumaal",
      description: "Regulaarne kontorikoristus alates 1.2€/m². Paindlik graafik, koolitatud personal, kvaliteedikontroll ja selgelt võrreldav tööplaan.",
      cta: "Küsi kontori koristuse pakkumist",
      chips: [
        { value: "50+", label: "kontorit", tone: "blue", icon: "briefcase" },
        { value: "ISO 9001", label: "sertifitseeritud", tone: "green", icon: "shield" },
        { value: "Kontrollitud", label: "personal", tone: "navy", icon: "users" },
      ],
    },
    intro: {
      title: "Kas teie kontorit koristab keegi, keda te usaldate?",
      firstBold: "Paljud ettevõtted jõuavad koristuspartneri vahetamiseni alles siis, kui väikesed probleemid on muutunud igapäevaseks häirijaks.",
      firstText: "Tolm koguneb kappide peale, prügi jääb õigel ajal viimata, sanitaarruumides lõppevad tarvikud ja esindusala ei näe hommikul enam selline välja, nagu kliendid ootavad.",
      secondBold: "Kontori puhtus mõjutab töötajate heaolu, klientide esmamuljet ja tööpäeva sujuvust.",
      secondText: "SPS Grupi kontorikoristus põhineb selgel tööplaanil: mida tehakse iga päev, mida kord nädalas, millised tööd on perioodilised ja kes vastutab kvaliteedi eest.",
    },
    strengthsIntro: "SPS Grupp on äriklientidele keskendunud puhastuspartner. Meie tugevus ei ole ainult koristustöö ise, vaid see, kuidas töö on korraldatud: objektijuht, koolitatud meeskond, selge tööplaan, kvaliteedikontroll ja paindlik graafik.",
    strengths: [
      { title: "ISO 9001 ja süsteemne kvaliteet", text: "Töö on juhitud tööplaani, objektijuhi ja kvaliteedikontrolli kaudu, et kvaliteet ei sõltuks ainult ühest heast koristajast.", icon: "shield" },
      { title: "20+ aastat äripindade kogemust", text: "Oleme töötanud väikeste büroode, suurte peakontorite ja eri kasutuskoormusega kontoritega.", icon: "briefcase" },
      { title: "Koolitatud ja kontrollitud personal", text: "Kontorikeskkonnas on oluline diskreetsus, konfidentsiaalsus ja oskus töötada tehnika ning dokumentide läheduses.", icon: "users" },
      { title: "Paindlik graafik", text: "Koristus saab toimuda enne tööpäeva, õhtul, nädalavahetusel või vastavalt kontori tegelikule rütmile.", icon: "clock" },
    ],
    serviceContent: {
      title: "Mida sisaldab professionaalne kontorikoristus?",
      intro: [
        "SPSi kontorikoristus ei ole nimekiri juhuslikke tegevusi. See on kokkulepitud rütm, mis hoiab ruumi iga tööpäeva alguseks samasuguses seisus: põrandad korras, sanitaarruumid varustatud, kööginurk puhas ja esindusala valmis külalisi vastu võtma.",
        "Tööplaanis eristame igapäevased, nädalased ja perioodilised tööd. Nii on selge, mida teenus sisaldab, mida tehakse eraldi tellimusena ning miks kaks pealtnäha sarnast hinnapakkumist ei pruugi katta sama töömahtu.",
      ],
      image: "/kontorikoristus2.jpg",
      imageAlt: "SPS Grupi kontorikoristuse töö kontorikeskkonnas",
      imageCaption: "Kontorikoristuse maht pannakse kirja ruumide kasutuse, tööaja ja pindade eripära järgi.",
      groups: [
        { title: "Igapäevane hooldus", kicker: "Tööd, mis hoiavad kontori igal hommikul töökorras.", items: ["põrandate kuiv- ja niiskepuhastus vastavalt põrandakattele", "prügikastide tühjendamine ja sorteerimine", "sanitaarruumide puhastus, desinfitseerimine ja tarvikute kontroll", "kööginurga, kohviala ja puhkeruumide korrashoid"] },
        { title: "Nädalased tööd", kicker: "Ruumide värskus ja detailid, mis kogunevad nädalaga.", items: ["tööpindade, riiulite ja kappide pealsete tolmueemaldus", "klaasvaheseinte, peeglite ja siseklaaside puhastus", "sissepääsuala ja porimattide põhjalikum hooldus", "IT-tehnika ümbruse ettevaatlik antistaatiline puhastus"] },
        { title: "Perioodilised eritööd", kicker: "Eritööd, mis hoiavad pinnad pikemas vaates esinduslikud.", items: ["vaipkatete süvapuhastus ja plekkide eeltöötlus", "põrandate masinpesu või kaitsekihi uuendamine", "akende pesu ja kõrgete klaaspindade puhastus", "suurpuhastus enne või pärast kolimist, üritust või remonti"] },
      ],
    },
    process: {
      title: "Kuidas SPS kontorikoristuse käivitab?",
      intro: "Parem teenus algab enne esimest koristuskorda. SPS kaardistab kõigepealt, kuidas teie kontor päriselt töötab, ja ehitab tööplaani selle põhjal.",
      steps: [
        ["Objekti ülevaatus", "Vaatame üle ruumide suuruse, kasutuskoormuse, põrandatüübid, sanitaarruumid, ligipääsu ja tööajad."],
        ["Tööplaani koostamine", "Kirjeldame alad, sageduse, igapäevased ja perioodilised tööd ning vastutava kontaktisiku."],
        ["Meeskonna ettevalmistus", "Määrame objektile sobiva väljaõppega teenindajad, puhastusvahendid ja vajalikud seadmed."],
        ["Teenuse käivitamine", "Alustame kokkulepitud graafiku järgi ja täpsustame esimestel nädalatel töömahtu tegeliku kasutuse põhjal."],
        ["Kvaliteedikontroll", "Objektijuht kontrollib tulemust, kogub tagasisidet ja lahendab puudused enne, kui neist saab korduv probleem."],
      ],
    },
    buyerGuide: {
      title: "Mille järgi võrrelda SPSi pakkumist teistega?",
      intro: "Odavaim pakkumine ei pruugi olla võrreldav, kui tööde nimekiri, sagedus või vastutus on erinev.",
      body: "SPS kirjeldab pakkumises, mida koristatakse iga päev, mida tehakse kord nädalas ja millised tööd on eraldi tellitavad. Samuti peab kliendil olema selge, kes vastutab kvaliteedikontrolli eest ning kuidas lahendatakse asendused, ootamatud olukorrad ja erisoovid.",
      goodTitle: "SPSi pakkumine teeb töö nähtavaks",
      warningTitle: "Ohumärgid enne lepingu sõlmimist",
      questions: ["Kas pakkumises on eraldi välja toodud igapäevased, nädalased ja perioodilised tööd?", "Kes vastutab kvaliteedikontrolli eest ja kui kiiresti probleemidele reageeritakse?", "Kas hind sisaldab puhastusvahendeid, tarvikuid ja vajalikke seadmeid?", "Kas teenusepakkuja ei täpsusta tööde sagedust?", "Kas asenduste ja haiguspäevade plaan puudub?", "Kas hind tundub madal, kuid eritööd on kõik eraldi?"],
    },
    pricing: {
      title: "Millest sõltub kontorikoristuse hind?",
      intro: "Sama pindala võib tähendada väga erinevat töömahtu, kui ruumide kasutuskoormus, sanitaarruumide arv või tööde sagedus on erinev.",
      cards: [["Väike kontor", "kuni 200 m²", "al. 250€", "kuu"], ["Keskmine kontor", "200-500 m²", "al. 450€", "kuu"], ["Suur kontor", "500+ m²", "personaalne", "pakkumine"]],
      factors: ["kontori pindala ja ruumide arv", "koristuse sagedus nädalas", "töötajate ja külastajate arv", "sanitaarruumide ja köögialade arv", "põrandakatete ning klaaspindade tüüp", "eritööde vajadus, näiteks aknapesu või vaipade puhastus", "koristuse aeg: tööajal, õhtul, öösel või nädalavahetusel"],
    },
    relatedServices: sharedRelatedServices,
    faqItems: [
      {
        q: "Kui sageli peaks äriruume koristama?",
        a: "Enamikule ettevõtetele soovitame koristust 3-5 korda nädalas. Täpne sagedus sõltub teie äri spetsiifikast, töötajate arvust ja pindalast. Aitame teil leida optimaalse graafiku tasuta konsultatsiooni käigus.",
      },
      {
        q: "Kuidas kujuneb koristuse hind?",
        a: "Hind sõltub ruumide suurusest, koristuse sagedusest ja eritööde vajadusest. Anname alati läbipaistva pakkumise, kus iga komponent on selgelt välja toodud. Alustage tasuta koristuskulude auditist.",
      },
      {
        q: "Kas saate koristada ka töövälisel ajal?",
        a: "Jah, enamik meie koristustöid toimub varahommikul enne 8:00, õhtuti peale 18:00 või nädalavahetustel. Kohandame graafiku täpselt teie ettevõtte tööajaga.",
      },
      {
        q: "Kuidas tagate konfidentsiaalsuse ja turvalisuse?",
        a: "Kõik meie töötajad läbivad taustakontrolli ja allkirjastavad konfidentsiaalsuslepingud. Kasutame ranget personalivaliku protsessi.",
      },
      {
        q: "Miks valida SPS Grupp, mitte mõni teine koristusfirma?",
        a: "Meil on üle 20 aasta kogemust, ISO 9001 ja 14001 keskkonnasertifikaadid, meie teenus on kindlustatud ja anname 100% garantii oma töödele. Saame hakkama igat tüüpi pindade puhastamisega.",
      },
    ],
    footerCta: {
      title: "Soovite võrreldavat kontorikoristuse pakkumist?",
      description: "Kirjeldage ruume, sagedust ja erisoove. Koostame tööplaani põhjal pakkumise, mida on lihtne teiste teenusepakkujatega võrrelda.",
    },
  },
  tootmishooned: {
    slug: "tootmishoonete-koristus-seo-naidis",
    serviceName: "Tööstushoonete ja tootmispindade koristus",
    serviceType: "Tööstushoonete koristus",
    pageUrl: `${BASE_URL}/koristusteenus/tootmishoonete-koristus`,
    metadata: {
      title: "SEO näidis: Tööstushoonete koristus | SPS Grupp",
      description: "SPS Grupi tööstushoonete ja tootmispindade koristuse SEO-malli näidis koos tööprotsessi, hinnategurite ja FAQ-ga.",
    },
    hero: {
      aria: "Tööstushoonete koristus",
      image: "/tootmishoonete-koristus.jpg",
      title: "Tööstushoonete",
      accent: "ja tootmispindade koristus",
      description: "Ohutu ja põhjalik tootmispindade hooldus, mis arvestab tootmisrütmi, tööohutuse, seadmete ümbruse ja raskema mustusega.",
      cta: "Küsi tööstushoone pakkumist",
      chips: [
        { value: "20+ aastat", label: "kogemust", tone: "blue", icon: "factory" },
        { value: "ISO 14001", label: "keskkonnajuhtimine", tone: "green", icon: "leaf" },
        { value: "Ohutu", label: "töökorraldus", tone: "navy", icon: "shield" },
      ],
    },
    intro: {
      title: "Kas tootmispinna koristus toetab teie tööd või segab seda?",
      firstBold: "Tööstuskeskkonnas ei piisa ilusast üldmuljest.",
      firstText: "Põrandale jäänud õli, tolm seadmete ümber, täitunud jäätmealad või koristus valel ajal võivad mõjutada ohutust, tootlikkust ja töötajate liikumist.",
      secondBold: "SPS planeerib tööstushoone koristuse tootmisrütmi järgi.",
      secondText: "Me kaardistame alad, riskid, tööajad ja puhastusmeetodid, et koristus toetaks protsessi ega katkestaks tootmist.",
    },
    strengthsIntro: "SPSi tugevus tööstuskeskkonnas on tööohutuse, sobivate masinate, väljaõppe ja objektijuhtimise ühendamine. Puhastust ei tehta tootmise kõrvalt juhuslikult, vaid tööplaani ja riskidega arvestades.",
    strengths: [
      { title: "Tööstuskeskkonna kogemus", text: "Meeskond arvestab liikumisteede, seadmete ümbruse, ladude ja tootmisalade eripäraga.", icon: "factory" },
      { title: "Tööohutuse põhimõtted", text: "Koristus kavandatakse nii, et see ei tekitaks libisemisriski, seisakuid ega tarbetut liikumist tootmisalas.", icon: "shield" },
      { title: "Õiged seadmed ja vahendid", text: "Kasutame põrandapesumasinaid, rasvaeemaldust, tolmukontrolli ja vajadusel erilahendusi raskemale mustusele.", icon: "sparkle" },
      { title: "Graafik tootmispauside järgi", text: "Tööd saab teha õhtul, öösel, nädalavahetusel või planeeritud hooldusaknas.", icon: "clock" },
    ],
    serviceContent: {
      title: "Mida sisaldab tööstushoonete koristus?",
      intro: [
        "SPSi tööstushoonete koristus katab tootmisalad, liikumisteed, laopinnad, riietusruumid, puhkeruumid ja kontoriosa vastavalt objekti tegelikule kasutusele.",
        "Tööplaanis eristame hoolduskoristuse, perioodilised süvatööd ja eripuhastuse. Nii on selge, milline töö toimub regulaarselt ja milline vajab eraldi planeerimist, seisakut või lisavarustust.",
      ],
      image: "/Tootmishoonete-koristus-2.webp",
      imageAlt: "SPS Grupi tööstushoonete koristus tootmiskeskkonnas",
      imageCaption: "Tööstushoone tööplaan peab arvestama ohutust, tootmisrütmi ja mustuse iseloomu.",
      groups: [
        { title: "Tootmisala hooldus", kicker: "Regulaarne töö aladel, kus puhtus mõjutab ohutust ja liikumist.", items: ["põrandate masinpesu ja tolmueemaldus", "liikumisteede, laadimisalade ja töökohtade ümbruse puhastus", "õli, rasva ja tootmisjääkide eemaldamine", "jäätmealade ja prügipunktide korrashoid"] },
        { title: "Töötajate alad", kicker: "Ruumid, mis mõjutavad tööpäeva mugavust ja hügieeni.", items: ["riietusruumide ja sanitaarruumide puhastus", "puhkeruumide ja köögialade hooldus", "kontoriosa regulaarne koristus", "tarvikute kontroll ja täiendamine"] },
        { title: "Perioodilised eritööd", kicker: "Süvatööd, mida kavandatakse tootmisgraafiku järgi.", items: ["kõrgete pindade, torustike ja valgustite puhastus", "põrandate süvapesu ja kaitsekihtide hooldus", "suitsu-, vee- või õlikahjustuste puhastus", "akende, fassaadi ja laadimisalade pesu"] },
      ],
    },
    process: {
      title: "Kuidas SPS tööstushoone koristuse käivitab?",
      intro: "Tootmispinna puhul algab teenus riskide ja töövoo mõistmisest. Alles siis saab valida inimesed, seadmed ja graafiku.",
      steps: [
        ["Tootmisrütmi kaardistus", "Selgitame välja tööajad, seisakud, ohualad, liikumisteed ja alad, kuhu ligipääs on piiratud."],
        ["Mustuse ja pindade hindamine", "Hindame põrandakatteid, õli- või tolmukoormust, seadmete ümbrust ja vajalikke puhastusmeetodeid."],
        ["Ohutu tööplaani koostamine", "Kirjeldame alad, sageduse, seadmed, isikukaitsevahendid ja tööohutuse nõuded."],
        ["Meeskonna juhendamine", "Teenindajad saavad objekti eripära, liikumise, vahendite ja kliendi sisereeglite juhised."],
        ["Kontroll ja täpsustamine", "Objektijuht hindab esimesi tulemusi ning korrigeerib sagedust või meetodit vastavalt tegelikule töömahule."],
      ],
    },
    buyerGuide: {
      title: "Kuidas võrrelda tööstushoone koristuse pakkumisi?",
      intro: "Tööstuspinna puhul võib odav pakkumine tähendada, et riskid, eriseadmed või perioodilised tööd on välja jäetud.",
      body: "SPSi pakkumine kirjeldab alad, puhastusmeetodid, graafiku, ohutusnõuded ja eritööd. Nii saab klient aru, kas pakkumine katab ainult lihtsa hoolduse või ka tootmiskeskkonna tegelikud vajadused.",
      goodTitle: "Hea pakkumine täpsustab riskid",
      warningTitle: "Ohumärgid enne valikut",
      questions: ["Kas teenusepakkuja küsib tootmisrütmi ja seisakute kohta?", "Kas eraldi on kirjeldatud õli, tolmu või rasva eemaldamise meetod?", "Kas tööohutuse ja isikukaitsevahendite vastutus on kirjas?", "Kas pakkumine räägib ainult ruutmeetritest?", "Kas eripuhastus ja kõrgtööd puuduvad täielikult?", "Kas puudub plaan, kuidas töö toimub tootmist segamata?"],
    },
    pricing: {
      title: "Millest sõltub tööstushoone koristuse hind?",
      intro: "Hind sõltub pindalast, mustuse iseloomust, tööaja piirangutest, seadmete vajadusest ja sellest, kui palju töid tuleb teha väljaspool tavalist hoolduskoristust.",
      cards: [["Väike tootmispind", "kuni 500 m²", "al. 400€", "kuu"], ["Keskmine objekt", "500-2000 m²", "al. 900€", "kuu"], ["Suur kompleks", "2000+ m²", "personaalne", "pakkumine"]],
      factors: ["tootmis- ja laopinna suurus", "mustuse tüüp: tolm, õli, rasv või tootmisjäägid", "koristuse sagedus ja tööaeg", "seadmete ja masinate vajadus", "sanitaarruumide, riietusruumide ja puhkealade arv", "kõrgete pindade või eritööde maht", "ohutusnõuded ja ligipääsupiirangud"],
    },
    relatedServices: sharedRelatedServices,
    faqItems: [
      {
        q: "Kui sageli peaks tootmishoonet koristama?",
        a: "Sõltub tootmise intensiivsusest. Tavaliselt vähemalt kord nädalas, tolmurohketes või õlirohketes tingimustes tihedamini, sageli igapäevaselt. Sanitaarruumid ja puhkeruumid vajavad igapäevast hooldust.",
      },
      {
        q: "Kas koristus saab toimuda väljaspool tootmisaega?",
        a: "Jah. Enamus meie tootmishoonete koristustöid toimub öösiti, nädalavahetustel või tootmispausides. Me ei sega teie tootmisprotsessi.",
      },
      {
        q: "Kas kasutate keskkonnasõbralikke vahendeid?",
        a: "Jah, kasutame ökomärgisega sertifitseeritud tooteid ja järgime ISO 14001 standardi nõudeid. Õlieemaldus toimub spetsiaalsete biolagunevate ainetega.",
      },
      {
        q: "Kas SPS Grupp koristab ka õli- või suitsukahjustusi?",
        a: "Jah, meil on kogemus suitsu-, vee- ja õlikahjustuste puhastamisel tööstuskeskkonnas. Pakume ka hädaolukorra reageerimist.",
      },
      {
        q: "Kas teil on tööohutuskoolitused?",
        a: "Jah, kõik meie tootmishoonete koristajad läbivad tööohutuskoolituse, kasutavad isikukaitsevahendeid ja järgivad kliendi kehtestatud ohutusreegleid.",
      },
    ],
    footerCta: {
      title: "Soovite tööstushoone koristuse tööplaani?",
      description: "Tuleme kohale, hindame tootmisala, riskid ja tööaja piirangud ning koostame võrreldava pakkumise.",
    },
  },
  kaubandus: {
    slug: "kaubanduspindade-koristus-seo-naidis",
    serviceName: "Kaubanduspindade koristus",
    serviceType: "Kaubanduspindade koristus",
    pageUrl: `${BASE_URL}/koristusteenus/kaubanduspindade-koristus`,
    metadata: {
      title: "SEO näidis: Kaubanduspindade koristus | SPS Grupp",
      description: "SPS Grupi kaubanduspindade koristuse SEO-malli näidis, mis käsitleb päevakoristust, süvapuhastust, graafikut ja kvaliteedikontrolli.",
    },
    hero: {
      aria: "Kaubanduspindade koristus",
      image: "/kaubanduspindade-koristus.jpg",
      title: "Kaubanduspindade koristus",
      accent: "Tallinnas ja Harjumaal",
      description: "Päevakoristus, süvapuhastus ja eritööd poodidele, esindustele ning kaubanduskeskustele, kus puhtus peab kestma kogu lahtiolekuaja.",
      cta: "Küsi kaubanduspinna pakkumist",
      chips: [
        { value: "Päev + öö", label: "koristusgraafik", tone: "blue", icon: "clock" },
        { value: "ISO 9001", label: "kvaliteet", tone: "green", icon: "shield" },
        { value: "Kiire", label: "reageerimine", tone: "navy", icon: "sparkle" },
      ],
    },
    intro: {
      title: "Kas teie pind näeb õhtul sama esinduslik välja kui hommikul?",
      firstBold: "Kaubanduspinnal ei hinnata puhtust ainult avamise hetkel.",
      firstText: "Kliendid liiguvad sisse märgade jalanõudega, prügikastid täituvad, klaasid saavad sõrmejälgi ja sanitaarruumid vajavad kontrolli ka keset päeva.",
      secondBold: "SPS ühendab päevakoristuse, öise süvapuhastuse ja kiire reageerimise.",
      secondText: "Nii püsivad sissepääsud, müügialad, klaasid ja sanitaarruumid korras ka siis, kui külastuskoormus on kõige suurem.",
    },
    strengthsIntro: "Kaubanduskeskkonnas on SPSi tugevus nähtamatu töökorraldus: koristus peab olema piisavalt tihe, kuid mitte segama müüki, kliente ega teenindajaid.",
    strengths: [
      { title: "Töö lahtioleku rütmi järgi", text: "Planeerime päevased ja öised tööd nii, et müügitegevus saaks jätkuda sujuvalt.", icon: "store" },
      { title: "Esindusala fookus", text: "Sissepääs, klaasid, põrandad ja sanitaarruumid on kohad, mis mõjutavad kliendi esmamuljet kõige kiiremini.", icon: "sparkle" },
      { title: "Koolitatud personal klientide keskel", text: "Meeskond oskab töötada diskreetselt ja ohutult ka siis, kui kliendid on ruumis.", icon: "users" },
      { title: "Objektijuht ja kvaliteedikontroll", text: "Koristuskvaliteet peab olema ühtlane ka nädalavahetustel, kampaaniate ajal ja hooajalistes tippudes.", icon: "clipboard" },
    ],
    serviceContent: {
      title: "Mida sisaldab kaubanduspindade koristus?",
      intro: [
        "SPSi kaubanduspindade koristus on üles ehitatud külastuskoormuse järgi. Päeval hoiame kontrolli all kiiresti märgatavad alad, öösel või enne avamist tehakse sügavam hooldus.",
        "Tööplaanis kirjeldame, millised tööd toimuvad müügisaalis, sissepääsudes, sanitaarruumides, töötajate aladel ja klaaspindadel. See teeb teenuse ulatuse võrreldavaks ja aitab vältida olukorda, kus oluline töö jääb pakkumisest välja.",
      ],
      image: "/kaubanduspindade-koristus-2.jpg",
      imageAlt: "SPS Grupi kaubanduspindade koristus",
      imageCaption: "Kaubanduspinna koristus peab arvestama nii müügi, külastajate kui ka hooajalise koormusega.",
      groups: [
        { title: "Päevakoristus", kicker: "Tööd, mis hoiavad külastajatele nähtavad alad korras.", items: ["sissepääsude ja porialade kontroll", "prügikastide tühjendamine ja ümbruse puhastus", "sanitaarruumide regulaarne kontroll ja tarvikud", "klaaside, lettide ja enim puudutatud pindade puhastus"] },
        { title: "Süvapuhastus", kicker: "Tööd, mis tehakse enne avamist, pärast sulgemist või madala koormusega ajal.", items: ["põrandate masinpesu ja kaitsekihtide hooldus", "vitriinide ja klaaspindade põhjalik puhastus", "eskalaatorite, liftide ja treppide detailsem hooldus", "töötajate alade ja lao korrashoid"] },
        { title: "Kiirreageerimine", kicker: "Ootamatud olukorrad, mis mõjutavad kliendikogemust kohe.", items: ["mahapillatud tooted või vedelikud", "lekete ja libisemisohu kõrvaldamine", "kampaaniate või ürituste järgne lisakoristus", "hooajaline pori, lumi ja sissepääsude suurem koormus"] },
      ],
    },
    process: {
      title: "Kuidas SPS kaubanduspinna koristuse käivitab?",
      intro: "Alustame sellest, millal pind on kõige koormatum, millised alad on kliendile nähtavad ja millal saab teha sügavamaid töid.",
      steps: [
        ["Külastuskoormuse hindamine", "Vaatame üle tipptunnid, sissepääsud, sanitaarruumid, klaaspinnad ja müügiala liikumisrajad."],
        ["Päeva- ja öögraafik", "Jagame tööd nähtava päevakoristuse, sulgemisjärgse hoolduse ja perioodiliste eritööde vahel."],
        ["Teenindusstandard", "Lepime kokku vormi, käitumise, reageerimise ja suhtluse, sest koristaja võib töötada klientide vahetus läheduses."],
        ["Käivitamine", "Alustame graafikuga ja jälgime esimestel nädalatel, kas sagedus vastab tegelikule külastuskoormusele."],
        ["Kvaliteedikontroll", "Objektijuht kontrollib nähtavaid alasid, tööde täitmist ja korduvate probleemide lahendamist."],
      ],
    },
    buyerGuide: {
      title: "Kuidas võrrelda kaubanduspinna koristuse pakkumisi?",
      intro: "Kaubanduspinna puhul on kõige tähtsam, kas pakkumine katab kogu lahtiolekuaja, mitte ainult öise koristuse.",
      body: "SPSi pakkumine eristab päevakoristuse, süvapuhastuse, kiirreageerimise ja perioodilised tööd. Nii on näha, kuidas teenus hoiab esinduslikkust nii hommikul, tipptunnil kui ka päeva lõpus.",
      goodTitle: "Hea pakkumine katab päeva rütmi",
      warningTitle: "Ohumärgid enne valikut",
      questions: ["Kas pakkumine kirjeldab päevakoristust ja öist hooldust eraldi?", "Kas sanitaarruumide kontrolli sagedus on kirjas?", "Kas ootamatutele olukordadele reageerimine on kokku lepitud?", "Kas pakkumine arvestab ainult ruutmeetritega?", "Kas tipptunnid, kampaaniad ja hooajalisus on välja jäetud?", "Kas klaasid, sissepääsud ja porialad on mainimata?"],
    },
    pricing: {
      title: "Millest sõltub kaubanduspinna koristuse hind?",
      intro: "Hind sõltub pindalast, külastuskoormusest, lahtiolekuaegadest, sanitaarruumidest, klaaspindadest ja sellest, kui palju on vaja päevast kohalolu.",
      cards: [["Väike kauplus", "kuni 200 m²", "al. 300€", "kuu"], ["Keskmine pind", "200-800 m²", "al. 600€", "kuu"], ["Suur pind", "800+ m²", "personaalne", "pakkumine"]],
      factors: ["müügiala ja abiruumide pindala", "külastajate arv ja tipptunnid", "lahtiolekuajad ja nädalavahetused", "sanitaarruumide arv ja kontrollisagedus", "klaaspindade, vitriinide ja sissepääsude maht", "põrandakatete tüüp ja masinpesu vajadus", "kiirreageerimise ja päevakoristuse vajadus"],
    },
    relatedServices: sharedRelatedServices,
    faqItems: [
      {
        q: "Kui sageli tuleks kaubanduspinda koristada?",
        a: "Enamik kaubanduspindu vajab päevakoristust 1-3 korda tööpäeva jooksul ja öist süvapuhastust. Sagedus sõltub liikluskoormusest ja sortimendist. Aitame koostada optimaalse graafiku.",
      },
      {
        q: "Kas koristus segab kaubanduspinna igapäevatööd?",
        a: "Ei. Planeerime töö nii, et oleksime nähtamatud kaubanduskeskuse klientidele. Tõsisemad puhastustööd toimuvad öösel või enne avamist, päevakoristus madala liiklusega aegadel ja diskreetselt.",
      },
      {
        q: "Kas pakute kiirreageerimist hädaolukordades?",
        a: "Jah, pakume 24/7 hädaolukordade teenust, näiteks lekked, mahapillatud tooted ja rikutud sanitaarruum. Kohapeal tavaliselt 30-60 minuti jooksul.",
      },
      {
        q: "Kas eskalaatorite puhastus sisaldub teenuses?",
        a: "Igapäevane pinnapuhastus jah. Eskalaatorite perioodiline süvapuhastus on eraldi teenus, mida soovitame 2-4 korda aastas sõltuvalt kasutussagedusest.",
      },
      {
        q: "Kuidas toimub kvaliteedikontroll?",
        a: "Igal objektil on objektijuht, kes kontrollib tööd regulaarselt. Esitame kliendile digitaalseid raporteid ja viime läbi kliendi rahulolu-uuringuid.",
      },
    ],
    footerCta: {
      title: "Soovite kaubanduspinna koristuse tööplaani?",
      description: "Kirjeldage pinda, lahtiolekuaegu ja külastuskoormust. Koostame pakkumise, mis eristab päevakoristuse, süvatööd ja kiirreageerimise.",
    },
  },
  koolid: {
    slug: "koolide-koristamine-seo-naidis",
    serviceName: "Koolide ja lasteaedade koristamine",
    serviceType: "Koolide koristamine",
    pageUrl: `${BASE_URL}/koristusteenus/koolide-koristamine`,
    metadata: {
      title: "SEO näidis: Koolide koristamine | SPS Grupp",
      description: "SPS Grupi koolide ja lasteaedade koristuse SEO-malli näidis, mis käsitleb hügieeni, turvalisi vahendeid, tööplaani ja FAQ-d.",
    },
    hero: {
      aria: "Koolide koristamine",
      image: "/koolide-koristamine4.jpg",
      title: "Koolide ja lasteaedade",
      accent: "koristamine",
      description: "Haridusasutuste koristus, mis keskendub hügieenile, laste ohutusele, kõrge puutekoormusega pindadele ja õppetööd mitte segavale graafikule.",
      cta: "Küsi kooli koristuse pakkumist",
      chips: [
        { value: "Lastele", label: "ohutud vahendid", tone: "blue", icon: "school" },
        { value: "ISO 9001", label: "kvaliteet", tone: "green", icon: "shield" },
        { value: "Kõrge", label: "hügieenifookus", tone: "navy", icon: "sparkle" },
      ],
    },
    intro: {
      title: "Kas kooli koristus aitab hoida tervislikku õpikeskkonda?",
      firstBold: "Koolis ja lasteaias ei tähenda puhtus ainult korras põrandaid.",
      firstText: "Ukselingid, käsipuud, lauad, sanitaarruumid, sööklad ja spordisaalid on kohad, kus hügieen mõjutab iga päev lapsi, õpetajaid ja personali.",
      secondBold: "SPS ehitab koristusplaani haridusasutuse päevakava järgi.",
      secondText: "Töö peab toetama õppetööd, vähendama häirivaid riske ja kasutama vahendeid, mis sobivad lastega keskkonda.",
    },
    strengthsIntro: "Haridusasutustes on SPSi tugevus süsteemne hügieen: meeskond, tööplaan, ohutud vahendid ja kontrollitud korduvus kohtades, kus nakkuste ja mustuse koormus on suurem.",
    strengths: [
      { title: "Lastega keskkonda sobivad vahendid", text: "Puhastusmeetodid ja vahendid valitakse nii, et need sobiksid kooli või lasteaia igapäevasesse rütmi.", icon: "leaf" },
      { title: "Kõrge puutekoormusega pindade fookus", text: "Ukselingid, käsipuud, lauad, lülitid ja sanitaarruumid vajavad regulaarset ja teadlikku tähelepanu.", icon: "sparkle" },
      { title: "Õppetööd mitte segav graafik", text: "Põhitööd saab teha enne või pärast õppetööd, päevane töö jääb avalike alade ja vajaduspõhise hoolduse juurde.", icon: "clock" },
      { title: "Objektijuht ja dokumenteeritud töö", text: "Haridusasutus vajab selget vastutust, kokkulepitud standardit ja regulaarset tagasisidet.", icon: "clipboard" },
    ],
    serviceContent: {
      title: "Mida sisaldab koolide ja lasteaedade koristus?",
      intro: [
        "SPSi koolikoristus lähtub sellest, kuidas hoonet päeva jooksul kasutatakse: klassid, koridorid, sanitaarruumid, sööklad, spordisaalid ja töötajate alad vajavad erinevat sagedust ja meetodit.",
        "Tööplaanis eristame igapäevase hoolduse, kõrge puutekoormusega pindade puhastuse ja perioodilised eritööd. Nii on koolil selge ülevaade, mis toimub iga päev ja mis on planeeritud vaheaegadele või eraldi ajale.",
      ],
      image: "/koolide-koristamine2.jpg",
      imageAlt: "SPS Grupi koolide koristamine",
      imageCaption: "Koolikoristuse tööplaan peab sobituma õppetöö, laste liikumise ja hügieenivajadustega.",
      groups: [
        { title: "Igapäevane hooldus", kicker: "Ruumid, mis vajavad regulaarset korrashoidu igal koolipäeval.", items: ["klassiruumide ja ühiskasutusalade puhastus", "sanitaarruumide pesu, desinfitseerimine ja tarvikud", "söökla, köögiala ümbruse ja puhkeruumide korrashoid", "prügikastide tühjendamine ja pindade korrastus"] },
        { title: "Hügieenifookus", kicker: "Kõrge puutekoormusega pinnad, kus korduvus on eriti oluline.", items: ["ukselingid, käsipuud ja lülitid", "lauad, toolid ja ühiskasutuses pinnad", "spordisaali ja riietusruumide puhastus", "haigestumiste perioodil tihendatud puhastusplaan"] },
        { title: "Perioodilised tööd", kicker: "Tööd, mida on mõistlik planeerida vaheaegadele või madalama koormusega ajale.", items: ["akende pesu ja klaaspindade hooldus", "põrandate masinpesu ja kaitsekihtide uuendamine", "vaipade ja pehme mööbli puhastus", "suurpuhastus enne õppeaasta algust või pärast üritusi"] },
      ],
    },
    process: {
      title: "Kuidas SPS koolikoristuse käivitab?",
      intro: "Haridusasutuse koristus algab päevakava, liikumisteede ja hügieeniriskide kaardistamisest.",
      steps: [
        ["Ruumide ja päevakava ülevaatus", "Kaardistame klassid, sööklad, spordisaalid, sanitaarruumid, sissepääsud ja õppetöö ajad."],
        ["Hügieenipunktide määramine", "Märgime pinnad ja alad, mis vajavad sagedasemat puhastust või desinfitseerimist."],
        ["Tööplaani koostamine", "Kirjeldame hommikused, päevased, õhtused ja perioodilised tööd ning vastutuse."],
        ["Meeskonna juhendamine", "Teenindajad saavad juhised lastega keskkonnas liikumiseks, vahendite kasutamiseks ja suhtluseks."],
        ["Kontroll ja tagasiside", "Objektijuht jälgib tööde täitmist ja kohandab sagedust vastavalt kooli tegelikule kasutusele."],
      ],
    },
    buyerGuide: {
      title: "Kuidas võrrelda koolikoristuse pakkumisi?",
      intro: "Haridusasutuses ei tohiks võrrelda ainult ruutmeetrihinda. Oluline on, kas pakkumine kirjeldab hügieenipunkte, graafikut ja vastutust.",
      body: "SPSi pakkumine teeb nähtavaks, mida puhastatakse iga päev, mida tehakse enne või pärast õppetööd ning millised tööd planeeritakse vaheaegadele. See aitab koolil hinnata nii hinda kui ka tegelikku töömahtu.",
      goodTitle: "Hea pakkumine näitab hügieenifookust",
      warningTitle: "Ohumärgid enne valikut",
      questions: ["Kas kõrge puutekoormusega pinnad on eraldi kirjeldatud?", "Kas tööaeg sobib õppetöö ja laste liikumisega?", "Kas sanitaarruumide ja söökla sagedus on täpsustatud?", "Kas pakkumine kasutab ainult üldsõnu nagu regulaarne koristus?", "Kas puudub info vahendite ja ohutuse kohta?", "Kas vaheaegade suurpuhastus on välja jäetud?"],
    },
    pricing: {
      title: "Millest sõltub kooli või lasteaia koristuse hind?",
      intro: "Hind sõltub hoone suurusest, laste või õpilaste arvust, sanitaarruumidest, sööklast, spordisaalist ja koristuse ajalisest jaotusest.",
      cards: [["Lasteaed", "kuni 500 m²", "al. 500€", "kuu"], ["Väike kool", "kuni 2000 m²", "al. 1200€", "kuu"], ["Suur kool", "5000+ m²", "personaalne", "pakkumine"]],
      factors: ["hoone pindala, korruste arv ja ruumide jaotus", "laste, õpilaste ja personali arv", "sanitaarruumide, söökla ja köögiala pindala ning kasutuskoormus", "spordisaali, garderoobide ja ühiskasutusalade puhastussagedus", "kas päeva jooksul on vaja vahekoristust või sanitaarruumide lisakontrolli", "vaheaegadel tehtava suurpuhastuse ulatus", "akende, põrandate ja vaipade perioodiliste tööde sagedus"],
    },
    relatedServices: sharedRelatedServices,
    faqItems: [
      {
        q: "Kui kiiresti tervishoiukeskne koristus haiguspuhanguid vähendab?",
        a: "Esimesed tulemused on märgatavad 2-3 nädala jooksul. Märkimisväärne haigestumiste vähenemine ilmneb tavaliselt 6-8 nädalaga, kui süsteem on täielikult rakendatud.",
      },
      {
        q: "Millised alad koolis vajavad erilist tähelepanu?",
        a: "Kriitilised alad on käepidemed, lauad ja toolid, WC-ruumid, söökla, spordirajatised ja ventilatsioonisisendid. Need 6 ala moodustavad umbes 80% nakkuste levikuteedest koolis.",
      },
      {
        q: "Kas puhastusvahendid on lastele ohutud?",
        a: "Jah, kasutame ainult haridusasutustes sertifitseeritud, EL standarditele vastavaid vahendeid. Ei kasuta ärritavaid lõhnaaineid ega ohtlikke kemikaale.",
      },
      {
        q: "Kas koristus segab õppetööd?",
        a: "Ei. Põhiline koristus toimub hommikul enne õppetundide algust ja õhtul pärast tundide lõppu. Päevane töö piirdub avalike alade kiirreageerimisega.",
      },
      {
        q: "Kas osalete ka riigihangetel?",
        a: "Jah, osaleme aktiivselt koolide koristuse riigihangetel. Omame vajalikku kvalifikatsiooni, ISO sertifikaate ja kogemust.",
      },
    ],
    footerCta: {
      title: "Soovite kooli või lasteaia koristusplaani?",
      description: "Kirjeldage hoonet, päevakava ja erivajadusi. Koostame tööplaani, mis arvestab hügieeni, ohutuse ja õppetöö rütmiga.",
    },
  },
  valikoristus: outdoorServicePage({
    slug: "valikoristus-seo-naidis",
    serviceName: "Välikoristus ja territooriumi hooldus",
    serviceType: "Välikoristus",
    originalPath: "/koristusteenus/valikoristus",
    title: "Välikoristus ja territooriumi hooldus",
    accent: "Tallinnas ja Harjumaal",
    heroImage: "/Valikoristus-1.jpg",
    contentImage: "/valikoristus-2.jpg",
    imageAlt: "SPS Grupp välikoristus ja territooriumi hooldus",
    description: "Fassaadipesu, aknapesu, graffiti eemaldamine, tänavakivide hooldus, kojameheteenus, muruniitmine, lehekoristus ja lumekoristus ühe partneri käest.",
    cta: "Küsi välikoristuse pakkumist",
    introTitle: "Kas kinnistu väliala jätab sama hea mulje kui hoone sisemus?",
    introFirst: "Väliala mõjutab esmamuljet enne, kui klient uksest sisse astub.",
    introSecond: "SPS seob välitööd üheks hooldusplaaniks.",
    serviceTitle: "Millised välikoristuse teenused on saadaval?",
    services: [["Fassaadipesu", "krohv, klinker, klaas ja metall"], ["Akende ja klaasfassaadide pesu", "ärihoonete klaaspinnad ja vitriinid"], ["Graffiti eemaldamine", "kiire eemaldus ja kaitsekihtide paigaldus"], ["Tänavakivide pesu", "survepesu, vuugid ja kaitse"], ["Lumekoristus", "24/7 talvine valmisolek"], ["Kojameheteenus", "igapäevane kinnistu korrashoid"], ["Muruniitmine", "hooajaline haljasalade hooldus"], ["Lehekoristus", "sügisene koristus ja äravedu"]],
    strengths: [["Üks partner, kõik välistööd", "Vähem halduskoormust ja selgem vastutus kogu kinnistu välialale.", "briefcase"], ["Hooajaline valmisolek", "Talv, kevad, suvi ja sügis vajavad eri töid ning eri rütmi.", "clock"], ["Õige tehnika", "Kasutame tööle sobivaid masinaid, survepesu, puhastusvahendeid ja hooldusvõtteid.", "sparkle"], ["Objektijuhi kontroll", "Tööde sagedus ja kvaliteet on kokkulepitult juhitud.", "clipboard"]],
    processTitle: "Kuidas SPS välikoristuse hooldusplaani koostab?",
    processSteps: [["Objekti ülevaatus", "Vaatame üle sissepääsud, parklad, fassaadid, kõnniteed ja hooajalised riskid."], ["Tööde jaotus", "Eristame regulaarsed, hooajalised ja vajaduspõhised tööd."], ["Graafiku kokkulepe", "Määrame sageduse ja reageerimise tingimused."], ["Teenuse käivitamine", "Meeskond alustab tööplaani järgi."], ["Järelkontroll", "Objektijuht jälgib tööde täitmist ja vajadusel korrigeerib graafikut."]],
    buyerTitle: "Kuidas võrrelda välikoristuse pakkumisi?",
    buyerQuestions: ["Kas pakkumine kirjeldab kõik välialad eraldi?", "Kas hooajalised tööd on eristatud?", "Kas lumekoristuse reageerimine on kirjas?", "Kas pakkumine jätab välja fassaadi või klaaspinnad?", "Kas puudub objektijuhi vastutus?", "Kas lisatööde hinnastamine on ebaselge?"],
    pricingTitle: "Millest sõltub välikoristuse hind?",
    pricingIntro: "Hind sõltub kinnistu suurusest, tööde sagedusest, hooajast, pindade tüübist ja reageerimisvajadusest.",
    pricingFactors: ["kinnistu pindala ja välialade jaotus", "sissepääsude, kõnniteede ja parklate arv", "hooajalised tööd: lumi, lehed, muru", "fassaadi, klaasi ja tänavakivide pindala", "reageerimiskiirus ja tööde sagedus", "kas töö on ühekordne või hoolduslepinguga"],
    faqItems: [
      { q: "Kui sageli peaks fassaadi pesema?", a: "Tallinna tingimustes soovitame fassaadipesu vähemalt kord aastas, tiheda liiklusega piirkondades sagedamini. Klaas- ja heledatel fassaadidel on mustus kiiremini nähtav." },
      { q: "Kas lumekoristuse leping algab automaatselt?", a: "Jah, hooajalise lepingu puhul tuleme automaatselt, kui sajab lund või on libeduseoht. Te ei pea meid kutsuma." },
      { q: "Kui kiiresti saate graffiti eemaldada?", a: "Graffiti eemaldame tavaliselt 30 minutit kuni 2 tundi sõltuvalt suurusest ja pinnast. Kiireloomuliste juhtumite puhul reageerime 24h jooksul." },
      { q: "Kas teete välitöid ka talvel?", a: "Jah. Lumekoristus ja libedusetõrje on talvel meie põhitegevus. Teatud välitöid tehakse eelistatult soojema ilmaga." },
      { q: "Millised on hoolduslepingu eelised ühekordse teenuse ees?", a: "Soodsam hind, fikseeritud eelarve, prioriteetne reageerimine ja ennustatav kvaliteet." },
    ],
    footerTitle: "Tellige välikoristuse tasuta audit",
    footerDescription: "Tuleme kohale, vaatame üle teie ärikinnistu ja koostame personaalse hoolduskava.",
  }),
  akendePesu: outdoorServicePage({
    slug: "valikoristus/akende-pesu-seo-naidis",
    serviceName: "Akende pesu",
    serviceType: "Akende pesu",
    originalPath: "/koristusteenus/valikoristus/akende-pesu",
    title: "Akende pesu",
    accent: "ärihoonetele",
    heroImage: "/akende-pesu-1.jpg",
    contentImage: "/akende-pesu-2.jpg",
    imageAlt: "SPS Grupp akende pesu ärihoonetele",
    description: "Professionaalne akende pesu kontoritele, kaubandushoonetele ja klaasfassaadidele koos kõrgtööde valmisolekuga.",
    cta: "Küsi akende pesu pakkumist",
    introTitle: "Kas teie hoone klaaspinnad toetavad esinduslikku esmamuljet?",
    introFirst: "Aknad määrduvad aeglaselt, aga mõjutavad ruumi valgust ja hoone välisilmet iga päev.",
    introSecond: "SPS planeerib aknapesu pinna, kõrguse ja tööaja järgi.",
    serviceTitle: "Millist akende pesu SPS Grupp pakub?",
    services: [["Kontoriakende pesu", "seest ja väljast"], ["Kõrghoonete aknapesu", "tõstukite ja ronimisvarustusega"], ["Klaasfassaadid", "suured klaaspinnad triipudeta"], ["Vitriinid", "kaubanduspindade nähtavad pinnad"], ["Raamid ja aknalauad", "täispuhastus koos detailidega"], ["Hooajaline pesu", "õietolm, sool ja saaste"], ["Ehitusjärgne aknapesu", "tolm, kleebised ja jäägid"], ["Hooldusleping", "regulaarne graafik"]],
    strengths: [["Kõrgtööde kogemus", "Meeskond ja varustus sobivad ka keerukale ligipääsule.", "shield"], ["Õige tehnika", "Teleskoopvarred, tõstukid ja klaasipuhastuse süsteemid.", "sparkle"], ["Töö ärirütmi järgi", "Pesu saab planeerida töövälisele ajale.", "clock"], ["Kindlustatud teenus", "Kliendi vara ja hoone on töö ajal kaitstud.", "clipboard"]],
    processTitle: "Kuidas SPS aknapesu korraldab?",
    processSteps: [["Pindade ülevaatus", "Hindame klaaspindade mahu ja ligipääsu."], ["Meetodi valik", "Valime tõstuki, teleskoopvarre või muu lahenduse."], ["Tööaja kokkulepe", "Planeerime töö nii, et see ei segaks kliente ega töötajaid."], ["Pesu ja kontroll", "Teeme töö ning kontrollime triipudevaba tulemust."], ["Hooldusgraafik", "Soovi korral lepime kokku korduva pesurütmi."]],
    buyerTitle: "Kuidas võrrelda aknapesu pakkumisi?",
    buyerQuestions: ["Kas pakkumine eristab sise- ja välispesu?", "Kas kõrgtöö või tõstuk on hinnas?", "Kas raamid ja aknalauad on mainitud?", "Kas pakkumine on ainult ruutmeetrihind?", "Kas tööaega ei ole kokku lepitud?", "Kas tulemusgarantii puudub?"],
    pricingTitle: "Millest sõltub akende pesu hind?",
    pricingIntro: "Hind sõltub klaaspindade mahust, kõrgusest, ligipääsust, määrdumisest ja pesu sagedusest.",
    pricingFactors: ["klaaspindade pindala ja arv", "kas pesu toimub seest, väljast või mõlemalt poolt", "ligipääs ja kõrgus", "raamide ja aknalaudade puhastuse vajadus", "ehitusjärgse mustuse olemasolu", "regulaarse hoolduslepingu sagedus"],
    faqItems: [
      { q: "Kui sageli peaksid Tallinna ärihoonete aknad saama professionaalset pesu?", a: "Kesklinnas ja tiheda liiklusega piirkondades soovitame pesu kord kvartalis. Klaashoonetele on optimaalne 4 korda aastas." },
      { q: "Kuidas saab aknapesu toimuda ilma tööd katkestamata?", a: "Teeme tööd enne kontorite avamist, peale sulgemist või nädalavahetustel. Kõrghoonete puhul töötame väljastpoolt." },
      { q: "Kas teete ka kõrghoonete aknapesu?", a: "Jah, kasutame tõstukeid, ronimisvarustust ja teleskoopvarrega süsteeme." },
      { q: "Mis juhtub, kui aknapesu järel tekivad triibud?", a: "Anname tulemustele garantii. Kui puudused tekivad meie töö tagajärjel, parandame tasuta." },
      { q: "Millal on parim aeg klaashoone aknapesu tellida?", a: "Kevad pärast õietolmu perioodi ja sügis enne talve on kõige sobivamad. Lisaks regulaarne kvartaalne hooldus." },
    ],
    footerTitle: "Toome valguse tagasi teie kontorisse",
    footerDescription: "Saadame eksperdi teie hoonesse hindama ja koostame personaalse pesuplaani.",
  }),
  fassaadipesu: outdoorServicePage({
    slug: "valikoristus/fassaadipesu-seo-naidis",
    serviceName: "Fassaadipesu",
    serviceType: "Fassaadipesu",
    originalPath: "/koristusteenus/valikoristus/fassaadipesu",
    title: "Fassaadipesu",
    accent: "Tallinnas ja Harjumaal",
    heroImage: "/fassaadipesu1.jpg",
    contentImage: "/fassaadipesu1.jpg",
    imageAlt: "SPS Grupp fassaadipesu ärihoonetele",
    description: "Fassaadipesu krohvile, klinkrile, klaasile, metallile ja puidule koos õige meetodi, ökoloogiliste vahendite ja kõrgtööde kogemusega.",
    cta: "Küsi fassaadipesu pakkumist",
    introTitle: "Kas teie hoone fassaad töötab teie maine kasuks?",
    introFirst: "Fassaad määrdub aeglaselt, kuid mõjutab iga külastaja esmamuljet.",
    introSecond: "SPS valib meetodi fassaadimaterjali ja määrdumise järgi.",
    serviceTitle: "Milliseid fassaadipesu teenuseid SPS pakub?",
    services: [["Krohvfassaadid", "õrn pesu keskmise survega"], ["Klinkertellis", "pooridesse kogunenud mustuse eemaldus"], ["Klaasfassaad", "triipudeta puhastus"], ["Metallfassaad", "õige surve ja vahendid"], ["Puitfassaad", "pinnasäästlik hoolduspesu"], ["Sool ja samblik", "talvejääkide ja taimede eemaldus"], ["Kaitsekihid", "hüdrofoob ja anti-graffiti"], ["Kõrghooned", "tõstukid ja ronimisvarustus"]],
    strengths: [["Pinnapõhine meetod", "Krohv, klaas, metall ja puit vajavad erinevat lähenemist.", "clipboard"], ["Kõrgtööde valmisolek", "Saame töötada ka keerukama ligipääsuga hoonetel.", "shield"], ["Keskkonnahoid", "Kasutame biolagunevaid vahendeid ja sobivat veekäitlust.", "leaf"], ["Kindlustatud teenus", "Tööde riskid on maandatud.", "briefcase"]],
    processTitle: "Kuidas SPS fassaadipesu ette valmistab?",
    processSteps: [["Materjali hindamine", "Selgitame välja fassaadi tüübi ja seisundi."], ["Mustuse hindamine", "Vaatame üle sool, samblik, saaste ja üldmäärdumine."], ["Meetodi valik", "Valime surve, vahendi ja ligipääsu."], ["Töö teostus", "Puhastame pinna kokkulepitud ulatuses."], ["Kaitse soovitus", "Vajadusel soovitame kaitsekihti pikema tulemuse jaoks."]],
    buyerTitle: "Kuidas võrrelda fassaadipesu pakkumisi?",
    buyerQuestions: ["Kas fassaadimaterjal on hinnangus eraldi välja toodud?", "Kas ligipääsu meetod on kirjeldatud?", "Kas kaitsekihi vajadus on selgitatud?", "Kas pakutakse sama meetodit kõigile pindadele?", "Kas tööohutuse vastutus puudub?", "Kas keskkonnanõudeid ei mainita?"],
    pricingTitle: "Millest sõltub fassaadipesu hind?",
    pricingIntro: "Hind sõltub fassaadi pindalast, materjalist, määrdumisastmest, ligipääsust ja kaitsekihi vajadusest.",
    pricingFactors: ["fassaadi pindala", "materjal: krohv, klaas, metall, puit või klinker", "ligipääs ja kõrgus", "määrdumisaste", "kaitsekihi vajadus", "tööde ajastus ja ala piiramine"],
    faqItems: [
      { q: "Kui sageli peaks ärihoone fassaadi pesema?", a: "Soovituslik sagedus on iga 2-3 aasta tagant. Kesklinnas ja liiklusrohketes piirkondades sagedamini." },
      { q: "Kas fassaadipesu kahjustab hoone viimistlust?", a: "Mitte kui seda teeb professionaalne meeskond, kes valib õige meetodi ja vahendid iga pinna jaoks." },
      { q: "Mis ajal aastast on parim fassaadipesu tellida?", a: "Kevadel pärast talve ja õietolmu perioodi või sügisel enne külma. Temperatuur peaks olema vähemalt +5°C." },
      { q: "Kas teete fassaadipesu ka kõrghoonetel?", a: "Jah. Omame sertifitseeritud personali ja varustust kõrgtöödeks." },
      { q: "Kas kaitsekihi lisamine on vajalik?", a: "Kaitsekiht pikendab pesu tulemust ja kaitseb pinda saaste eest, eriti kesklinnas ja kõrge liiklusega piirkondades." },
    ],
    footerTitle: "Uuendage oma hoone ilmet",
    footerDescription: "Tuleme kohale, hindame fassaadi seisundit ja koostame personaalse pakkumise.",
  }),
  grafitiEemaldamine: outdoorServicePage({
    slug: "valikoristus/grafiti-eemaldamine-seo-naidis",
    serviceName: "Graffiti eemaldamine",
    serviceType: "Graffiti eemaldamine",
    originalPath: "/koristusteenus/valikoristus/grafiti-eemaldamine",
    title: "Graffiti eemaldamine",
    accent: "Tallinnas",
    heroImage: "/grafiti-eemaldamine-1.jpg",
    contentImage: "/grafiti-eemaldamine-2.jpg",
    imageAlt: "SPS Grupp graffiti eemaldamine",
    description: "Kiire graffiti eemaldamine kõigilt levinud pindadelt koos sobiva meetodi, pinnasäästliku töö ja anti-graffiti kaitsekihiga.",
    cta: "Helistage kohe",
    introTitle: "Graffiti ei ole ainult esteetiline probleem",
    introFirst: "Mida kiiremini graffiti eemaldada, seda parem on tulemus ja seda väiksem on kordumise risk.",
    introSecond: "SPS valib eemaldusmeetodi pinna järgi.",
    serviceTitle: "Mida sisaldab graffiti eemaldamise teenus?",
    services: [["Kiire hindamine", "pinna ja värvi tüübi kontroll"], ["Spetsiaalsed lahused", "värvi eemaldus aluspinda säästes"], ["Kõrgsurvepesu", "sobivatel pindadel"], ["Delikaatne käsitöö", "krohv, puit ja tundlikud pinnad"], ["Korduv pesu", "sügavale imbunud graffiti korral"], ["Anti-graffiti kaitse", "läbipaistev kaitsekiht"], ["Tööala korrastus", "puhas tööpiirkond pärast pesu"], ["Fotod dokumenteerimiseks", "vajadusel enne töö algust"]],
    strengths: [["24h reageerimine", "Värske graffiti on lihtsam eemaldada.", "clock"], ["Pinnasäästlik meetod", "Valime õrna, kuid tõhusa lahenduse.", "shield"], ["Kaitsekihi võimalus", "Järgmine graffiti on lihtsamini eemaldatav.", "sparkle"], ["Kogemus eri pindadega", "Krohv, klinker, betoon, klaas, metall ja puit.", "briefcase"]],
    processTitle: "Kuidas SPS graffiti eemaldab?",
    processSteps: [["Fotod ja hindamine", "Dokumenteerime ja hindame pinna."], ["Meetodi valik", "Valime lahusti, surve või käsitöö."], ["Eemaldus", "Eemaldame graffiti võimalikult pinnasäästlikult."], ["Järelpesu", "Puhastame tööala."], ["Kaitse soovitus", "Soovitame anti-graffiti kaitset riskialadele."]],
    buyerTitle: "Kuidas võrrelda graffiti eemaldamise pakkumisi?",
    buyerQuestions: ["Kas pinnatüüp on hinnangus kirjas?", "Kas reageerimisaeg on kokku lepitud?", "Kas kaitsekihi võimalus on olemas?", "Kas kasutatakse kõigil pindadel sama meetodit?", "Kas tulemusriski ei selgitata?", "Kas tööala korrastus puudub?"],
    pricingTitle: "Millest sõltub graffiti eemaldamise hind?",
    pricingIntro: "Hind sõltub graffiti suurusest, vanusest, värvi tüübist, pinnamaterjalist ja ligipääsust.",
    pricingFactors: ["graffiti suurus", "graffiti vanus", "pinna tüüp ja tundlikkus", "ligipääs", "kas vaja on korduvat pesu", "kaitsekihi lisamine"],
    faqItems: [
      { q: "Kui kiiresti saate graffiti eemaldada?", a: "Enamikul juhtudel 24 tunni jooksul peale tellimust. Kiireloomuliste juhtumite puhul saame tulla ka samal päeval." },
      { q: "Kas kõik graffitid on eemaldatavad?", a: "Enamik jah. Värsked graffitid on eemaldatavad peaaegu täielikult. Vanad võivad jätta ghost-efekti." },
      { q: "Mis on graffiti kaitsekate?", a: "Läbipaistev kaitsekiht, millelt järgmine graffiti on eemaldatav lihtsama veesurvega." },
      { q: "Kas graffiti eemaldamine kahjustab fassaadi?", a: "Mitte kui seda teeb professionaalne meeskond. Vale meetod võib pinda kahjustada." },
      { q: "Kas aitate koostada politsei kaebust?", a: "Jah, kui soovite. Teeme enne tööd fotod, mida saate kaebusele lisada." },
    ],
    footerTitle: "Ärge oodake, helistage kohe",
    footerDescription: "Mida värskem graffiti, seda parem tulemus. Helistage täna ja vabanege probleemist.",
  }),
  kojameheteenus: outdoorServicePage({
    slug: "valikoristus/kojameheteenus-seo-naidis",
    serviceName: "Kojamehe teenus",
    serviceType: "Kojamehe teenus",
    originalPath: "/koristusteenus/valikoristus/kojameheteenus",
    title: "Kojamehe teenus",
    accent: "kinnistu igapäevaseks korrashoiuks",
    heroImage: "/kojameheteenus-1.jpg",
    contentImage: "/kojameheteenus_2.jpg",
    imageAlt: "SPS Grupp kojamehe teenus kinnistutele",
    description: "Kojamehe teenus hoiab sissepääsud, kõnniteed, prügialad ja hoone ümbruse korras igal hooajal.",
    cta: "Küsi kojamehe teenuse pakkumist",
    introTitle: "Kas kinnistu korrashoid vajab järjepidevat kohalolekut?",
    introFirst: "Väliala läheb käest väikeste asjade kaudu.",
    introSecond: "SPS loob regulaarse hooldusrütmi.",
    serviceTitle: "Mida sisaldab kojamehe teenus?",
    services: [["Sissepääsude puhastus", "pühkimine ja prahi eemaldus"], ["Kõnniteede korrashoid", "käidavate alade regulaarne hooldus"], ["Prügialade korrashoid", "konteinerite ümbruse ülevaatus"], ["Väikeprügi koristamine", "konid, pakendid ja oksad"], ["Hooajalised välitööd", "lehed, lumi ja kevadine korrastus"], ["Treppide hooldus", "esindusala puhtus"], ["Probleemide märkamine", "teavitame kahjustustest või ohtudest"], ["Hoolduslepingu töö", "selge graafik ja vastutus"]],
    strengths: [["Püsiv korrashoid", "Kinnistu ei sõltu juhuslikest ühekordsetest töödest.", "clock"], ["Hooajad kaetud", "Ühe lepingu alla saab siduda erinevad välitööd.", "leaf"], ["Selge vastutus", "Tööde nimekiri ja vastutusalad on kokku lepitud.", "clipboard"], ["Ärikinnistute kogemus", "Puhtus ja ligipääsetavus peavad olema pidevalt tagatud.", "briefcase"]],
    processTitle: "Kuidas SPS kojamehe teenuse käivitab?",
    processSteps: [["Objekti ülevaatus", "Vaatame üle alad ja ligipääsud."], ["Tööde nimekiri", "Paneme kirja igapäevased ja hooajalised tööd."], ["Graafik", "Lepime kokku sageduse."], ["Teenuse algus", "Meeskond alustab graafiku järgi."], ["Tagasiside", "Täpsustame töömahtu vajaduse järgi."]],
    buyerTitle: "Kuidas võrrelda kojamehe teenuse pakkumisi?",
    buyerQuestions: ["Kas tööde sagedus on kirjas?", "Kas hooajalised tööd on eraldi välja toodud?", "Kas prügiala kuulub teenusesse?", "Kas pakkumine on liiga üldine?", "Kas vastutusalad on ebaselged?", "Kas talvised tööd on välja jäetud?"],
    pricingTitle: "Millest sõltub kojamehe teenuse hind?",
    pricingIntro: "Hind sõltub kinnistu suurusest, tööde sagedusest, hooajalistest lisatöödest ja talvisest valmisolekust.",
    pricingFactors: ["kinnistu väliala suurus", "tööde sagedus nädalas", "sissepääsude ja prügialade arv", "hooajalised lisatööd", "talvise valmisoleku vajadus", "kas teenus on eraldi või hoolduslepingu osa"],
    faqItems: [
      { q: "Kui sageli kojamees objektile tuleb?", a: "Sagedus lepitakse kokku vastavalt vajadusele. Levinud on 1-5 korda nädalas, suurematel objektidel ka igapäevaselt." },
      { q: "Kas talvine lumekoristus kuulub teenusesse?", a: "See sõltub lepingust. Kojamehe teenusele saab lisada lumekoristuse ja libedusetõrje." },
      { q: "Kas te koristate ka prügimaja ümbrust?", a: "Jah. Prügialade korrashoid on üks tavalisemaid kojamehe teenuse osi." },
      { q: "Kas teenus sobib korteriühistule?", a: "Jah. Teenus sobib nii korteriühistutele, büroohoonetele, laohoonetele kui ka muudele ärikinnistutele." },
    ],
    footerTitle: "Koostame teie kinnistule kojamehe hoolduskava",
    footerDescription: "Saatke objekti kirjeldus ja soovitud sagedus. Pakume praktilise graafiku.",
  }),
  lehtedekoristamine: outdoorServicePage({
    slug: "valikoristus/lehtedekoristamine-seo-naidis",
    serviceName: "Lehtede koristamine",
    serviceType: "Lehtede koristamine",
    originalPath: "/koristusteenus/valikoristus/lehtedekoristamine",
    title: "Lehtede koristamine",
    accent: "ärikinnistutele ja ühistutele",
    heroImage: "/lehekoristus-1.jpg",
    contentImage: "/lehekoristus-2.jpg",
    imageAlt: "SPS Grupp lehtede koristamine välialadel",
    description: "Sügisesed lehed, oksad ja märg orgaaniline praht koristatakse kiiresti ning vajadusel viiakse ära.",
    cta: "Küsi lehekoristuse pakkumist",
    introTitle: "Märjad lehed on korrashoiu- ja ohutusrisk",
    introFirst: "Lehed kogunevad kiiresti sissepääsudele ja kõnniteedele.",
    introSecond: "SPS aitab sügisperioodil territooriumi läbikäidavana hoida.",
    serviceTitle: "Mida sisaldab lehtede koristamise teenus?",
    services: [["Riisumine ja puhumine", "meetod vastavalt pinnale"], ["Kõnniteede puhastus", "liikumisteede korrashoid"], ["Oksade kogumine", "orgaaniline praht kokku"], ["Lehekottide täitmine", "kogumine kottidesse või konteinerisse"], ["Jäätmete äravedu", "vajadusel haljastusjäätmete äravedu"], ["Korduv sügishooldus", "graafik aktiivse lehelanguse ajal"]],
    strengths: [["Kiire hooajatöö", "Ajastus on sügisel oluline.", "clock"], ["Ohutumad liikumisteed", "Eelistame sissepääse, treppe ja kõnniteid.", "shield"], ["Töö koos äraveoga", "Lehekotid ei jää kinnistule seisma.", "briefcase"], ["Hoolduslepingu osa", "Ühendatav muruniitmise ja lumekoristusega.", "leaf"]],
    processTitle: "Kuidas SPS lehekoristuse korraldab?",
    processSteps: [["Ala hindamine", "Vaatame üle puud, teed ja kogunemiskohad."], ["Töömeetod", "Valime riisumise, puhumise või tehnika."], ["Kogumine", "Kogume lehed kokkulepitud kohta."], ["Äravedu", "Vajadusel korraldame äraveo."], ["Kordusgraafik", "Suurte puude korral lepime kokku korduva töö."]],
    buyerTitle: "Kuidas võrrelda lehekoristuse pakkumisi?",
    buyerQuestions: ["Kas äravedu on hinnas?", "Kas käidavad alad on prioriteedina kirjas?", "Kas töö on ühekordne või korduv?", "Kas pakkumine ei täpsusta jäätmete käitlust?", "Kas märgade lehtede libedusriski ei käsitleta?", "Kas parklad ja restid on välja jäetud?"],
    pricingTitle: "Millest sõltub lehekoristuse hind?",
    pricingIntro: "Hind sõltub lehtede hulgast, koristatava ala suurusest, ligipääsust ja äraveo vajadusest.",
    pricingFactors: ["koristatava ala pindala", "lehtede hulk ja puude arv", "kas lehed on märjad või kuivad", "äraveo vajadus", "korduva graafiku vajadus", "ligipääs ja parkla kasutus"],
    faqItems: [
      { q: "Kas lehed viiakse ära?", a: "Jah, kui see on tellimuses kokku lepitud. Saame lehed koguda kottidesse või korraldada haljastusjäätmete äraveo." },
      { q: "Kas koristate ka märjad lehed?", a: "Jah. Märjad lehed on sageli kõige olulisem koristada, sest need muudavad kõnniteed ja trepid libedaks." },
      { q: "Kas teenust saab tellida korduvalt?", a: "Jah. Suuremate puude all soovitame korduvat sügishooldust, sest kogu lehemass ei lange korraga." },
      { q: "Milliseid alasid puhastate?", a: "Puhastame kõnniteed, parklad, trepid, sissepääsud, haljasalad ja muud kinnistu välialad." },
    ],
    footerTitle: "Broneerige lehtede koristamine sügishooajaks",
    footerDescription: "Kirjeldage kinnistut ja lehtede mahtu. Koostame pakkumise koos tööde ulatuse ja äraveoga.",
  }),
  lumekoristus: outdoorServicePage({
    slug: "valikoristus/lumekoristus-seo-naidis",
    serviceName: "Lumekoristus ja libedusetõrje",
    serviceType: "Lumekoristus",
    originalPath: "/koristusteenus/valikoristus/lumekoristus",
    title: "Lumekoristus ja libedusetõrje",
    accent: "24/7 valmisolekuga",
    heroImage: "/lumelykkamine-1.jpg",
    contentImage: "/Lumelykkamine2.png",
    imageAlt: "SPS Grupp lumekoristus ja libedusetõrje",
    description: "Automaatne reageerimine lumesajule, parklate ja kõnniteede lumekoristus ning libedusetõrje hooajalise lepinguga.",
    cta: "Küsi lumekoristuse pakkumist",
    introTitle: "Lumekoristus on ohutuse küsimus",
    introFirst: "Kinnistu omanik vastutab kõnnitee, parkla ja sissepääsu seisukorra eest.",
    introSecond: "SPS reageerib lumesajule automaatselt.",
    serviceTitle: "Mida sisaldab lumekoristuse teenus?",
    services: [["Parklad ja sissepääsud", "lumest puhtaks pärast sadu"], ["Kõnniteed", "jalakäijate alad ja trepid"], ["Libedusetõrje", "sool ja graniitkruus"], ["Lume äravedu", "kuhjumisel lisateenus"], ["24/7 valmisolek", "hooaja vältel"], ["Ilmaprognoosi jälgimine", "automaatne reageerimine"], ["Katuste lumi", "ohutõrjega töö"], ["Porimatid", "sissekandumise vähendamine"]],
    strengths: [["Automaatne reageerimine", "Te ei pea eraldi helistama.", "clock"], ["Fikseeritud hooajahind", "Eelarve on prognoositav.", "clipboard"], ["Kindlustatud teenus", "Riskid on maandatud.", "shield"], ["Tallinna talvede kogemus", "Piisav tehnika ja personal suuremate sadude jaoks.", "briefcase"]],
    processTitle: "Kuidas SPS lumekoristuse käivitab?",
    processSteps: [["Objekti kaardistus", "Märgime parklad, teed, trepid ja prioriteedid."], ["Hooajaleping", "Lepime kokku valmisoleku ja reageerimise."], ["Ilmajälgimine", "Jälgime sadu ja libedusriski."], ["Tööde teostus", "Puhastame ja teeme libedusetõrje."], ["Korduvad kontrollid", "Vajadusel naaseme suurte sadude ajal."]],
    buyerTitle: "Kuidas võrrelda lumekoristuse pakkumisi?",
    buyerQuestions: ["Kas automaatne reageerimine on kirjas?", "Kas libedusetõrje sisaldub?", "Kas prioriteetsed alad on määratud?", "Kas hind kehtib ainult väljakutsele?", "Kas vastutuse piirid on ebaselged?", "Kas lume äravedu on selgitamata?"],
    pricingTitle: "Millest sõltub lumekoristuse hind?",
    pricingIntro: "Lumekoristuse hind sõltub pindalast, raskusastmest, teenuse ulatusest ja hooajalise valmisoleku tingimustest.",
    pricingFactors: ["parkla ja kõnniteede pindala", "sissepääsude ja treppide arv", "libedusetõrje vajadus", "24/7 valmisoleku ulatus", "lume ladustamise või äraveo vajadus", "prioriteedid ja reageerimisaeg"],
    faqItems: [
      { q: "Millal lumekoristuse leping algab?", a: "Tavaliselt oktoobri esimesest päevast aprilli viimase päevani. Soovitame lepingu sõlmida hiljemalt septembris." },
      { q: "Kas ma pean teile helistama, kui sajab lund?", a: "Ei. Jälgime ilmaprognoosi ja tuleme automaatselt. Erakorralise olukorra puhul helistage alati." },
      { q: "Kas teete libedusetõrjet soola või kruusaga?", a: "Tavaliselt kombineeritult: sool sulatab lund, graniidikruus tagab haardumise." },
      { q: "Mis juhtub, kui te ei jõua õigeks ajaks ja keegi libastub?", a: "Teenus on kindlustatud. Meie vastutus katab võimalikke kahjusid vastavalt lepingule." },
      { q: "Kas korraldate ka lume äravedu suurte kuhjade korral?", a: "Jah, lume äravedu on lisateenus, kui parklas ei jätku enam ruumi kuhjumiseks." },
    ],
    footerTitle: "Sõlmige lumekoristuse leping enne talve",
    footerDescription: "Küsige pakkumist täna ja tagage kinnistule rahulikum talvehooaeg.",
  }),
  muruniitmine: outdoorServicePage({
    slug: "valikoristus/muruniitmine-seo-naidis",
    serviceName: "Muruniitmine",
    serviceType: "Muruniitmine",
    originalPath: "/koristusteenus/valikoristus/muruniitmine",
    title: "Muruniitmine",
    accent: "Tallinnas ja Harjumaal",
    heroImage: "/muruniitmine-1.jpg",
    contentImage: "/muruniitmin-2.jpg",
    imageAlt: "SPS Grupp muruniitmine ja haljasalade hooldus",
    description: "Regulaarne muruniitmine ärikinnistutele, korteriühistutele ja avalikele aladele kogu kasvuperioodi vältel.",
    cta: "Küsi muruniitmise pakkumist",
    introTitle: "Hooldamata muru jätab kinnistust lohaka mulje",
    introFirst: "Kõrge muru ja niitmata servad muudavad hoone ümbruse kiiresti hooletuks.",
    introSecond: "SPS koostab niitmisgraafiku kasvukiiruse ja objekti järgi.",
    serviceTitle: "Mida sisaldab muruniitmise teenus?",
    services: [["Regulaarne niitmine", "kokkulepitud sagedusega"], ["Servade trimmerdamine", "puude, piirete ja äärekivide juures"], ["Niite kogumine", "või multšimine vastavalt vajadusele"], ["Haljasala ülevaatus", "probleemsete kohtade märkamine"], ["Kõnniteede puhastus", "murujääkide eemaldus"], ["Hooajaleping", "selge graafik ja kulu"]],
    strengths: [["Graafik hooaja järgi", "Niitmissagedus muutub koos ilmaga.", "clock"], ["Viimistletud servad", "Trimmerdamine annab hooldatud tulemuse.", "sparkle"], ["Sobib suurtele pindadele", "Äripargid, ühistud ja büroohooned.", "briefcase"], ["Üks partner välitöödeks", "Seotav lehekoristuse ja talvise hooldusega.", "leaf"]],
    processTitle: "Kuidas SPS muruniitmise graafiku koostab?",
    processSteps: [["Ala ülevaatus", "Hindame niidetava ala ja takistused."], ["Sageduse kokkulepe", "Lepime kokku hooajalise rütmi."], ["Servatööd", "Määrame trimmerdamise ulatuse."], ["Niitmine", "Teostame töö graafiku järgi."], ["Järelpuhastus", "Puhastame teed ja sissepääsud murujääkidest."]],
    buyerTitle: "Kuidas võrrelda muruniitmise pakkumisi?",
    buyerQuestions: ["Kas trimmerdamine sisaldub?", "Kas niite kogumine on kirjas?", "Kas graafik muutub hooaja järgi?", "Kas pakkumine räägib ainult niitmisest?", "Kas järeltööd on välja jäetud?", "Kas suurte pindade tehnika puudub?"],
    pricingTitle: "Millest sõltub muruniitmise hind?",
    pricingIntro: "Hind sõltub ala suurusest, niitmise sagedusest, servatööde mahust ja niite kogumise vajadusest.",
    pricingFactors: ["niitmisala pindala", "niitmise sagedus", "servade ja takistuste hulk", "kas niide kogutakse või multšitakse", "ligipääs tehnikale", "hooajalepingu kestus"],
    faqItems: [
      { q: "Kui tihti peaks muru niitma?", a: "Tavaliselt iga 7-14 päeva järel, sõltuvalt kasvuperioodist, ilmast ja kinnistu esinduslikkuse nõudest." },
      { q: "Kas teete ka trimmerdamist?", a: "Jah. Servade trimmerdamine kuulub teenuse juurde, kui see on pakkumises kokku lepitud." },
      { q: "Kas niide viiakse ära?", a: "Vajadusel kogume ja viime niite ära. Suurematel aladel on sageli mõistlik kasutada multšimist." },
      { q: "Kas saab sõlmida hooajalise lepingu?", a: "Jah. Hooajaleping on mugavaim lahendus, sest töö toimub automaatselt kokkulepitud graafiku järgi." },
    ],
    footerTitle: "Tellige muruniitmise hooldusplaan",
    footerDescription: "Saatke meile kinnistu info ja koostame sobiva niitmisgraafiku koos hinnapakkumisega.",
  }),
  tanavakividePesu: outdoorServicePage({
    slug: "valikoristus/tanavakivide-pesu-ja-hooldus-seo-naidis",
    serviceName: "Tänavakivide pesu ja hooldus",
    serviceType: "Tänavakivide pesu",
    originalPath: "/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus",
    title: "Tänavakivide pesu ja hooldus",
    accent: "ärikinnistutele",
    heroImage: "/tanavakividepesu-1.jpg",
    contentImage: "/tanavakividepesu-2.jpg",
    imageAlt: "SPS Grupp tänavakivide pesu ja hooldus",
    description: "Tänavakivide kõrgsurvepesu, umbrohu eemaldamine, vuukide täitmine ja kaitsekihtide paigaldus.",
    cta: "Küsi tänavakivide pesu pakkumist",
    introTitle: "Tänavakivid muutuvad aastatega vaikselt mustaks",
    introFirst: "Tolm, muld, õli ja umbrohi kogunevad vuukidesse ning muudavad pinna lohakaks.",
    introSecond: "SPS taastab pinna välimuse ja aitab pikendada kivide eluiga.",
    serviceTitle: "Mida sisaldab tänavakivide hooldusteenus?",
    services: [["Umbrohu eemaldamine", "koos juurtega"], ["Kõrgsurvepesu", "spetsiaalse tehnikaga"], ["Õliplekkide eemaldus", "sobivate lahustega"], ["Vuukide puhastus", "muda ja orgaanika eemaldus"], ["Vuukide taastäitmine", "uue liiva või kivipuruga"], ["Kaitsekiht", "mustuse ja niiskuse vastu"], ["Lokaalne parandus", "vajunud või katkised kivid"], ["Regulaarne hooldus", "1-2 korda aastas"]],
    strengths: [["Professionaalne tehnika", "Õige surve ja otsik säästavad kive.", "sparkle"], ["Umbrohu täielik eemaldus", "Pinnapealne lõikamine ei anna kestvat tulemust.", "leaf"], ["Vuukide taastäitmine", "Stabiliseerib kive pärast pesu.", "clipboard"], ["Keskkonnahoid", "Pesuvee käitlus ja sobivad vahendid.", "shield"]],
    processTitle: "Kuidas SPS tänavakivide pesu teeb?",
    processSteps: [["Pinna ülevaatus", "Hindame mustust, õliplekke ja vuukide seisu."], ["Eeltöö", "Eemaldame umbrohu ja lahtise prahi."], ["Pesu", "Teeme kõrgsurvepesu õige survega."], ["Vuugid", "Taastäidame vuugid vajadusel."], ["Kaitse", "Soovitame kaitsekihti pikema tulemuse jaoks."]],
    buyerTitle: "Kuidas võrrelda tänavakivide hoolduse pakkumisi?",
    buyerQuestions: ["Kas vuukide täitmine sisaldub?", "Kas õliplekid on eraldi käsitletud?", "Kas kaitsekihi võimalus on olemas?", "Kas pakkumine hõlmab ainult pesu?", "Kas umbrohu juurte eemaldust ei mainita?", "Kas pesuvee käitlust ei selgitata?"],
    pricingTitle: "Millest sõltub tänavakivide pesu hind?",
    pricingIntro: "Hind sõltub pindalast, mustuse astmest, umbrohust, plekkidest, vuukide seisust ja kaitsekihi vajadusest.",
    pricingFactors: ["pestava ala pindala", "mustuse ja umbrohu määr", "õli- või rasvaplekkide olemasolu", "vuukide taastäitmise vajadus", "kaitsekihi vajadus", "ligipääs ja vee kasutamise võimalus"],
    faqItems: [
      { q: "Kui sageli peaks tänavakive pesema?", a: "Keskmiselt 1-2 korda aastas, sõltuvalt liikluskoormusest. Parklas ja sissepääsu alas sagedamini." },
      { q: "Kas kõrgsurvepesu kahjustab kive?", a: "Õiges käes kasutatuna ei. Vale surve või vale nurk võib kive kahjustada või vuukide liiva välja lennutada." },
      { q: "Kas peate vuuke pärast pesu taastäitma?", a: "Enamasti jah. Taastäitmine stabiliseerib kive ja vähendab umbrohu tagasituleku riski." },
      { q: "Kas saate eemaldada õli- ja rasvaplekke?", a: "Jah, kasutame spetsiaalseid lahuseid. Värsked plekid on lihtsamini eemaldatavad." },
      { q: "Millal on parim aeg tänavakivide pesuks?", a: "Kevadel pärast talve või sügisel enne talve. Temperatuur peaks olema vähemalt +5°C." },
    ],
    footerTitle: "Uuendage oma ärikinnistu välimust",
    footerDescription: "Tuleme kohale, hindame tänavakivide seisukorda ja koostame pakkumise.",
  }),
};

const allServiceLinks = Object.values(serviceSeoPages).map((page) => ({
  title: page.serviceName,
  href: `/koristusteenus/${page.slug}`,
}));

function relatedFrom(keys: string[]): ServiceSeoData["relatedServices"] {
  return keys.map((key) => {
    const page = serviceSeoPages[key];
    const icons: Record<string, ServiceSeoData["relatedServices"][number]["icon"]> = {
      kontor: "briefcase",
      tootmishooned: "factory",
      kaubandus: "store",
      koolid: "school",
      valikoristus: "sparkle",
      akendePesu: "window",
      fassaadipesu: "construction",
      grafitiEemaldamine: "sparkle",
      kojameheteenus: "clipboard",
      lehtedekoristamine: "leaf",
      lumekoristus: "clock",
      muruniitmine: "leaf",
      tanavakividePesu: "floor",
    };

    return {
      title: page.serviceName,
      href: `/koristusteenus/${page.slug}`,
      text: page.metadata.description,
      icon: icons[key] ?? "briefcase",
    };
  });
}

Object.values(serviceSeoPages).forEach((page) => {
  page.serviceLinks = allServiceLinks;
});

serviceSeoPages.kontor.relatedServices = relatedFrom(["akendePesu", "fassaadipesu", "kaubandus", "koolid"]);
serviceSeoPages.tootmishooned.relatedServices = relatedFrom(["tanavakividePesu", "fassaadipesu", "kojameheteenus", "lumekoristus"]);
serviceSeoPages.kaubandus.relatedServices = relatedFrom(["akendePesu", "tanavakividePesu", "grafitiEemaldamine", "kojameheteenus"]);
serviceSeoPages.koolid.relatedServices = relatedFrom(["akendePesu", "muruniitmine", "lehtedekoristamine", "lumekoristus"]);
serviceSeoPages.valikoristus.relatedServices = relatedFrom(["akendePesu", "fassaadipesu", "lumekoristus", "kojameheteenus"]);
serviceSeoPages.akendePesu.relatedServices = relatedFrom(["fassaadipesu", "kaubandus", "kontor", "valikoristus"]);
serviceSeoPages.fassaadipesu.relatedServices = relatedFrom(["akendePesu", "grafitiEemaldamine", "tanavakividePesu", "valikoristus"]);
serviceSeoPages.grafitiEemaldamine.relatedServices = relatedFrom(["fassaadipesu", "tanavakividePesu", "kojameheteenus", "valikoristus"]);
serviceSeoPages.kojameheteenus.relatedServices = relatedFrom(["lumekoristus", "lehtedekoristamine", "muruniitmine", "tanavakividePesu"]);
serviceSeoPages.lehtedekoristamine.relatedServices = relatedFrom(["kojameheteenus", "muruniitmine", "lumekoristus", "valikoristus"]);
serviceSeoPages.lumekoristus.relatedServices = relatedFrom(["kojameheteenus", "lehtedekoristamine", "tanavakividePesu", "valikoristus"]);
serviceSeoPages.muruniitmine.relatedServices = relatedFrom(["lehtedekoristamine", "kojameheteenus", "tanavakividePesu", "valikoristus"]);
serviceSeoPages.tanavakividePesu.relatedServices = relatedFrom(["kojameheteenus", "muruniitmine", "fassaadipesu", "grafitiEemaldamine"]);
