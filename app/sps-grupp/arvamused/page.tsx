"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FooterCTA from "../../components/FooterCTA";
import ContactForm from "../../components/ContactForm";
import TwoToneHeading from "../../components/TwoToneHeading";
import ScrollAnimation from "../../components/ScrollAnimation";
import SeoJsonLd from "../../components/SeoJsonLd";
import TestimonialCards, { type TestimonialData } from "../../components/TestimonialCards";

interface CategoryGroup {
  title: string;
  href: string;
  testimonials: TestimonialData[];
}

const categories: CategoryGroup[] = [
  {
    title: "Kontorikoristus",
    href: "/koristusteenus/kontori-koristus",
    testimonials: [
      {
        quote:
          "Soovin edastada tänusõnad ja kiituse väga hea kontorikoristuse eest. Üldine tagasiside on väga positiivne, kontor on puhas, korras ja hästi hooldatud. On näha, et tööd tehakse hoolikalt ning kvaliteedile pööratakse tähelepanu.",
        shortQuote:
          "Üldine tagasiside on väga positiivne, kontor on puhas, korras ja hästi hooldatud.",
        author: "Paul",
        initials: "P",
        logo: "/arvamused-logod/paul.png",
      },
      {
        quote:
          "Soovin edastada erakordselt positiivse tagasiside kontorikoristuse kohta. Kontor on puhas, korras ja hooldatud. Tehtud töö kvaliteet on järjepidevalt kõrgel tasemel ning see on leidnud positiivset tähelepanu ka meie töötajate seas. On näha, et koristustöid tehakse suure hoole ja pühendumusega.",
        shortQuote:
          "Kontor on puhas, korras ja hooldatud. Tehtud töö kvaliteet on järjepidevalt kõrgel tasemel.",
        author: "Elis",
        initials: "E",
        logo: "/arvamused-logod/elis.png",
      },
      {
        quote:
          "Soovin jagada positiivset tagasisidet kontori koristuse kohta. Kontoriruumid on olnud puhtad ja korras ning üldine mulje on väga hea. On näha, et koristustöid tehakse hoolikalt ja järjepidevalt ning ruumide korrashoiule pööratakse tähelepanu. Oleme puhastusteenuse kvaliteedi ja töö tulemusega väga rahul.",
        shortQuote:
          "Kontoriruumid on olnud puhtad ja korras ning üldine mulje on väga hea.",
        author: "Ingrid",
        initials: "I",
        logo: "/arvamused-logod/ingrid.png",
      },
      {
        quote:
          "Puhas ja korrastatud kontor loob parema töökeskkonna nii töötajatele kui ka külastajatele. SPS Grupp on aidanud meil seda taset järjepidevalt hoida. Teenus on professionaalne, kvaliteetne ja hästi korraldatud ning kogu koostöö on olnud sujuv algusest peale. Oleme tulemusega väga rahul.",
        shortQuote:
          "Puhas ja korrastatud kontor loob parema töökeskkonna. SPS Grupp on aidanud meil seda taset järjepidevalt hoida.",
        author: "Kaiti",
        initials: "K",
        logo: "/arvamused-logod/kaiti.png",
      },
      {
        quote:
          "Suur aitäh koristajale, et ta pani eilsest üritusest jäänud mustad nõud nõudepesumasinasse. Meie üritus lõppes väga hilja ning nõudepesumasin oli juba nõusid täis. Ausalt öeldes olin õhtul lahkudes veidi mures, et hommikul ootab ees paras segadus. Seda suurem oli positiivne üllatus, kui hommikul tuli vastu puhas ja korras kööginurk. Palun edastage koristajale meie siiras tänu. Sellised väikesed, kuid väga tähelepanelikud teod jäävad silma ning näitavad hoolivust ja professionaalset suhtumist oma töösse. Suur suur aitäh!",
        shortQuote:
          "Suur aitäh koristajale — hommikul tuli vastu puhas ja korras kööginurk. Sellised väikesed, kuid tähelepanelikud teod jäävad silma.",
        author: "Käthlin",
        initials: "K",
        logo: "/arvamused-logod/kathlin.png",
      },
    ],
  },
  {
    title: "Tootmis- ja laokoristus",
    href: "/koristusteenus/tootmishoonete-koristus",
    testimonials: [
      {
        quote:
          "Täname tehtud töö ja panustatud pingutuse eest. Lao ja tootmiskoristuse tööd said korrektselt tehtud, koostöö sujus hästi ning jäime lõpptulemusega rahule. Hindame Teie meeskonna professionaalset suhtumist, täpsust ja valmisolekut töödega kokkulepitud mahus ning tähtajaks toime tulla. Palun edastage meie tänu ka tööde teostajatele. Selline suhtumine ja kvaliteetne töö on kindlasti märgatav ning aitab kaasa heale koostööle ka edaspidi. Täname veel kord ning soovime Teile ja meeskonnale jõudu edasisteks töödeks!",
        shortQuote:
          "Lao ja tootmiskoristuse tööd said korrektselt tehtud, koostöö sujus hästi ning jäime lõpptulemusega rahule.",
        author: "Heigar",
        initials: "H",
        logo: "/arvamused-logod/heigar.png",
      },
      {
        quote:
          "Soovin avaldada tunnustust väga hea koristusteenuse eest. Nii ladu kui ka kontoriruumid on puhtad, korras ja hästi hooldatud. Tehtud töö kvaliteet on olnud järjepidevalt kõrgel tasemel ning on näha, et koristustöid tehakse hoolikalt ja vastutustundlikult. Täname kogu meeskonda panuse eest. Hea töö on märgatud ja kõrgelt hinnatud.",
        shortQuote:
          "Nii ladu kui ka kontoriruumid on puhtad, korras ja hästi hooldatud. Tehtud töö kvaliteet on olnud järjepidevalt kõrgel tasemel.",
        author: "Katri",
        initials: "K",
        logo: "/arvamused-logod/katri.png",
      },
      {
        quote:
          "SPS Grupp on olnud meie jaoks usaldusväärne koostööpartner. Nii tootmis-, lao- kui ka kontoriruumide korrashoid on olnud järjepidevalt kõrgel tasemel. Hindame nende professionaalset lähenemist, paindlikkust ja võimet tagada kvaliteet ka suure kasutuskoormusega keskkonnas. Puhas ja korrastatud töökeskkond aitab kaasa nii töötajate heaolule kui ka ettevõtte sujuvale toimimisele. Aitäh professionaalse puhastusteenuse eest!",
        shortQuote:
          "Nii tootmis-, lao- kui ka kontoriruumide korrashoid on olnud järjepidevalt kõrgel tasemel.",
        author: "Heido",
        initials: "H",
        logo: "/arvamused-logod/heido.png",
      },
    ],
  },
  {
    title: "Koolide koristamine",
    href: "/koristusteenus/koolide-koristamine",
    testimonials: [
      {
        quote:
          "Soovime avaldada tunnustust koolimaja koristusega tegelevale meeskonnale väga hea töö eest. Koolimaja on olnud puhas, korras ja hooldatud ning on näha, et koristustöid tehakse järjepidevalt ja kohusetundlikult. Eriti oluline on see koolikeskkonnas, kus puhtus ja korrashoid mõjutavad igapäevaselt nii õpilaste, õpetajate kui ka kogu personali heaolu. Palun edastage meie tänusõnad kogu koristusmeeskonnale. Hindame kõrgelt nende panust, tähelepanelikkust ja professionaalset suhtumist. Hea töö ei jää märkamata ning soovime selle eest siiralt tänada. Täname Teid ja kogu meeskonda tehtud töö eest ning loodame, et sama kõrge kvaliteeditase jätkub ka edaspidi.",
        shortQuote:
          "Koolimaja on olnud puhas, korras ja hooldatud. Puhtus ja korrashoid mõjutavad igapäevaselt nii õpilaste, õpetajate kui ka kogu personali heaolu.",
        author: "Kalev",
        initials: "K",
        logo: "/arvamused-logod/kalev.png",
      },
      {
        quote:
          "Soovin jagada positiivset tagasisidet koolimaja koristuse kohta. Koolimaja on puhas, korras ja hästi hooldatud ning on näha, et koristustöid tehakse järjepidevalt ja hoolikalt. Puhtus ja kord loovad meeldiva õpi- ja töökeskkonna nii õpilastele kui ka personalile. Tehtud töö on märgatud ning seda hinnatakse kõrgelt. Suur aitäh väga hea töö eest!",
        shortQuote:
          "Koolimaja on puhas, korras ja hästi hooldatud. Puhtus ja kord loovad meeldiva õpi- ja töökeskkonna.",
        author: "Pille",
        initials: "P",
        logo: "/arvamused-logod/pille.png",
      },
      {
        quote:
          "Pidev koristuskvaliteedi jälgimine tagab ka tervislikuma õpikeskkonna ja tervemad lapsed.",
        shortQuote:
          "Pidev koristuskvaliteedi jälgimine tagab tervislikuma õpikeskkonna ja tervemad lapsed.",
        author: "Tehnikakõrgkooli arendusprorektor Tarmo",
        initials: "T",
      },
    ],
  },
  {
    title: "Puhastusteenused ja eritööd",
    href: "/puhastusteenused",
    testimonials: [
      {
        quote:
          "Soovime avaldada suurt tunnustust eritööde brigaadile väga hästi tehtud töö eest. Tööd olid läbi mõeldud, korralikult planeeritud ja professionaalselt teostatud. Kogu protsess sujus ladusalt ning lõpptulemus vastas ootustele. Palun edastage meie tänusõnad kogu eripuhastustööde meeskonnale. Selline suhtumine ja kvaliteetne töö väärivad kindlasti tunnustust. Suur tänu väga hea töö eest!",
        shortQuote:
          "Tööd olid läbi mõeldud, korralikult planeeritud ja professionaalselt teostatud. Kogu protsess sujus ladusalt.",
        author: "Juta",
        initials: "J",
        logo: "/arvamused-logod/juta.png",
      },
      {
        quote:
          "Palun edastage meie tänusõnad meeskonnale. Puhastustööd said tehtud korrektselt ja kokkulepitud mahus. Samuti hindame seda, et tööde teostamine oli hästi korraldatud ning kogu protsess sujus ladusalt. Oleme tehtud puhastustööga rahul ning hindame kvaliteetset ja usaldusväärset teenust.",
        shortQuote:
          "Puhastustööd said tehtud korrektselt ja kokkulepitud mahus. Oleme tehtud puhastustööga rahul.",
        author: "Reet",
        initials: "R",
        logo: "/arvamused-logod/reet.png",
      },
    ],
  },
  {
    title: "Üldine koristusteenus",
    href: "/koristusteenus",
    testimonials: [
      {
        quote:
          "Täname tehtud töö ja panustatud pingutuse eest. Kõik sujus väga hästi ning jäime tulemusega rahule.",
        shortQuote:
          "Kõik sujus väga hästi ning jäime tulemusega rahule.",
        author: "Sirje",
        initials: "S",
        logo: "/arvamused-logod/sirje.png",
      },
      {
        quote:
          "Suur tänu väga hea töö ja suure panuse eest! Jäime tehtud koristustööde tulemusega väga rahule. Töö oli korralikult teostatud, objekt jäi puhas ning kogu protsess sujus professionaalselt ja kokkulepitud viisil. Hindame kõrgelt Teie meeskonna suhtumist, paindlikkust ja pühendumist, mis aitasid saavutada soovitud tulemuse.",
        shortQuote:
          "Jäime tehtud koristustööde tulemusega väga rahule. Töö oli korralikult teostatud, objekt jäi puhas.",
        author: "Maiki",
        initials: "M",
        logo: "/arvamused-logod/maiki.png",
      },
      {
        quote:
          "Suur tänu kiire reageerimise ja operatiivse tegutsemise eest. Teiega on tõeliselt meeldiv koostööd teha. Hindame kõrgelt seda, et mõistate kiiresti olukorra sisu, suhtlus on selge ning vajalikud küsimused saavad lahendatud kiiresti ja professionaalselt. Selline koostöö teeb igapäevase töö oluliselt lihtsamaks ja annab kindlustunde, et asjad liiguvad õiges suunas. Täname veel kord ning loodame sama hea koostöö jätkumisele ka edaspidi. Parimate soovidega!",
        shortQuote:
          "Suur tänu kiire reageerimise eest! Teiega on tõeliselt meeldiv koostööd teha. Suhtlus on selge ning küsimused saavad lahendatud kiiresti.",
        author: "Renat",
        initials: "R",
        logo: "/arvamused-logod/renat.png",
      },
      {
        quote:
          "Soovin avaldada tunnustust väga operatiivselt ja kvaliteetselt teostatud töö eest! Tagasiside on olnud positiivne ning on näha, et olukorrale reageeriti kiiresti ja professionaalselt. Täname Teid ja kogu meeskonda tehtud töö ning panuse eest. Selline proaktiivne tegutsemine ja tähelepanu detailidele aitab meil hoida kõrget teenuse kvaliteeti ning tugevdada kliendi usaldust.",
        shortQuote:
          "Soovin avaldada tunnustust väga operatiivselt ja kvaliteetselt teostatud töö eest!",
        author: "Karl",
        initials: "K",
        logo: "/arvamused-logod/karl.png",
      },
      {
        quote:
           "Sooviksin edastada meie ettevõtte siirad tänusõnad ja suured kiitused Teie töötajale, kes viibib hetkel puhkusel, kuid keda ootame väga tagasi. Puhastusteenindaja on erakordselt tubli, kohusetundlik ja professionaalne koristaja. Tema töö kvaliteet on olnud järjepidevalt väga kõrgel tasemel ning tema panus on olnud selgelt märgatav. Ruumid on puhtad, korras ja hooldatud ning tema suhtumine oma töösse väärib igati tunnustust. Selliseid töötajaid kohtab harva.",
        shortQuote:
          "Puhastusteenindaja on erakordselt tubli, kohusetundlik ja professionaalne. Tema töö kvaliteet on olnud järjepidevalt väga kõrgel tasemel.",
        author: "Kelly",
        initials: "K",
        logo: "/arvamused-logod/kelly.png",
      },
      {
        quote:
          "Palun edastage meie tänusõnad koristajale. Selline hoolikas ja kvaliteetne töö jääb klientidele silma ning väärib tunnustust.",
        shortQuote:
          "Selline hoolikas ja kvaliteetne töö jääb klientidele silma ning väärib tunnustust.",
        author: "Kätlin",
        initials: "K",
        logo: "/arvamused-logod/katlin.png",
      },
      {
        quote:
          "Soovin anda tunnustavat tagasisidet puhastusteenuse kohta. Kontori ja logistika ning üldpindade koristus jätavad väga hea ja korrastatud mulje. Pinnad on puhtad, ruumid korras ning on näha, et koristustöid tehakse hoolikalt. Selline igapäevane tähelepanu detailidele aitab luua meeldiva töökeskkonna kõigile kontori kasutajatele.",
        shortQuote:
          "Kontori ja logistika ning üldpindade koristus jätavad väga hea ja korrastatud mulje. Pinnad on puhtad, ruumid korras.",
        author: "Mati",
        initials: "M",
        logo: "/arvamused-logod/mati.png",
      },
      {
        quote:
          "Soovin edastada positiivset tagasisidet senise koristusteenuse kohta. Oleme koostöö algusega rahul ning esmane mulje on igati positiivne. Koristustööd on tehtud korrektselt, ruumid on pärast koristust puhtad ja korras ning kokkulepitud tööde teostamisel on olnud näha hoolikust ja professionaalset suhtumist. Meie jaoks on oluline, et koristusteenus toimiks märkamatult, kuid tulemus oleks selgelt nähtav. Senine kogemus näitab, et meeskond on oma töös kohusetundlik ning pöörab tähelepanu ka väiksematele detailidele, mis mõjutavad ruumide üldmuljet. Täname koristajat ja kogu meeskonda hea töö eest. Loodame, et senine kvaliteeditase ja hea koostöö jätkuvad ka edaspidi.",
        shortQuote:
          "Koristustööd on tehtud korrektselt, ruumid on pärast koristust puhtad ja korras. Meeskond on kohusetundlik ja pöörab tähelepanu detailidele.",
        author: "Marek",
        initials: "M",
        logo: "/arvamused-logod/marek.png",
      },
      {
        quote:
          "Tunnen, et pean Teile kirjutama, et avaldada tunnustust Teie ettevõtte töötajale Irinale. Irina on jätnud meile väga professionaalse ja positiivse mulje. Ta on asjalik, vastutustundlik, lahendustele suunatud ning alati valmis kaasa mõtlema ja vajadusel kiiresti reageerima. Suhtlus temaga on meeldiv ning tema suhtumine töösse annab kindlustunde, et kokkulepitud asjad saavad tehtud. Eriti hästi on tema tugevused esile tulnud keerulisemates olukordades, kus on olnud vaja kiiresti tegutseda, leida lahendusi ja hoida töökorraldus toimimas. Sellised töötajad on ettevõtte jaoks suur väärtus ning mängivad olulist rolli kliendi usalduse hoidmisel. Loodan, et selline pühendunud ja südamega tehtud töö leiab tunnustust ka ettevõtte sees, sest sellised inimesed väärivad märkamist.",
        shortQuote:
          "Irina on jätnud väga professionaalse ja positiivse mulje — ta on asjalik, vastutustundlik ja alati valmis kiiresti reageerima.",
        author: "Eve",
        initials: "E",
        logo: "/arvamused-logod/eve.png",
      },
      {
        quote:
          "Soovin edastada positiivset tagasisidet koristusteenuse kohta. Koostöö on olnud sujuv ning esmamulje väga hea. Ruumid on pärast koristust puhtad ja korras ning on näha, et töid tehakse hoolikalt ja läbimõeldult. Samuti hindame head suhtlust ja operatiivset reageerimist. Kliendina on meie jaoks oluline, et kokkulepped peavad paika ja teenuse kvaliteet vastab ootustele. Oleme puhastusteenusega rahul. Loodame, et sama hea koostöö ja kvaliteet jätkuvad ka edaspidi.",
        shortQuote:
          "Koostöö on olnud sujuv, ruumid on puhtad ja korras. Hindame head suhtlust ja operatiivset reageerimist.",
        author: "Krista",
        initials: "K",
        logo: "/arvamused-logod/krista.png",
      },
      {
        quote:
          "Soovin jagada tunnustust Teie meeskonnale. Koristusteenuse puhul märkab klient sageli just neid hetki, kui midagi on tegemata. Seetõttu pean oluliseks välja tuua, et meie puhul on olukord vastupidine — ruumid on korras, töökeskkond meeldiv ning koristusega seotud teemad ei vaja igapäevaselt tähelepanu. See näitab, et teenus toimib ja tööd tehakse hästi. Nii kontori-, lao- kui ka tootmisaladel on üldine korrashoid olnud heal tasemel. Samuti on positiivne, et kvaliteet on olnud stabiilne ning puuduste korral reageeritakse kiiresti ja konstruktiivselt. Palun edastage meie tänu kogu meeskonnale. Hindame professionaalset suhtumist ja seda, et saame oma põhitegevusele keskenduda teadmisega, et koristuse poole pealt on asjad kontrolli all.",
        shortQuote:
          "Ruumid on korras, töökeskkond meeldiv ning koristusega seotud teemad ei vaja igapäevaselt tähelepanu. Teenus toimib ja tööd tehakse hästi.",
        author: "Olev",
        initials: "O",
        logo: "/arvamused-logod/olev.png",
      },
      {
        quote:
          "Soovin anda positiivset tagasisidet koristusteenuse kohta. Korralik koristusteenus ei paista tavaliselt silma üksikute tööde kaudu, vaid selle järgi, millise üldmulje ruumid igapäevaselt jätavad. Meie kogemus on olnud positiivne — ruumid on korras, puhtad ja hästi hoitud ning teenus toimib stabiilselt. Hindame seda, et koristuse kvaliteet on püsinud ühtlane ning puudub vajadus pidevalt tähelepanu juhtida või meelde tuletada. Selline iseseisev ja professionaalne töökorraldus on kliendi jaoks väga oluline. Oleme senise koostööga rahul ning hindame Teie panust meie töökeskkonna korrashoidu.",
        shortQuote:
          "Ruumid on korras, puhtad ja hästi hoitud ning teenus toimib stabiilselt. Koristuse kvaliteet on püsinud ühtlane.",
        author: "Kersti",
        initials: "K",
        logo: "/arvamused-logod/kersti.png",
      },
      {
        quote:
          "Aitäh seni osutatud puhastusteenuste eest! Meie ruumid on puhtad ja korras ning teenuse kvaliteediga oleme rahul. Tööd on tehtud korrektselt ning üldmulje on väga hea.",
        shortQuote:
          "Meie ruumid on puhtad ja korras ning teenuse kvaliteediga oleme rahul.",
        author: "Madis",
        initials: "M",
        logo: "/arvamused-logod/madis.png",
      },
      {
        quote:
          "Jagan tunnustust koristusteenuse eest. Töökeskkond on meeldiv ja korrastatud ning senine koostöö on jätnud väga hea mulje.",
        shortQuote:
          "Töökeskkond on meeldiv ja korrastatud ning senine koostöö on jätnud väga hea mulje.",
        author: "Liis",
        initials: "L",
        logo: "/arvamused-logod/liis.png",
      },
    ],
  },
];

export default function ArvamusedPage() {
  return (
    <>
      <SeoJsonLd
        serviceName="Arvamused ja klientide tagasiside"
        serviceDescription="Loe meie klientide arvamusi ja tagasisidet. SPS Grupp pakub professionaalseid koristus-, puhastus- ja hooldusteenuseid äriklientidele Tallinnas ja Harjumaal."
        serviceUrl="https://spsgrupp.ee/sps-grupp/arvamused"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "SPS Grupp", item: "https://spsgrupp.ee/sps-grupp" },
          { position: 3, name: "Arvamused", item: "https://spsgrupp.ee/sps-grupp/arvamused" },
        ]}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section min-h-[50vh] max-h-[550px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          aria-label="Arvamused"
          style={{ background: "url('/images/arvamused.jpg') center/cover no-repeat" }}
        >
          <div className="grid grid-cols-1 gap-[30px] items-start max-w-[1280px] mx-auto w-full relative z-10">
            <div
              className="animate-fade-up max-w-[750px]"
              style={{
                background: "rgba(55, 54, 45, 0.62)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(3px)",
                padding: "32px",
                borderRadius: "20px",
                border: "1px solid rgba(133, 203, 233, 0.2)",
              }}
            >
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] -tracking-[1px] mb-[18px]">
                Klientide
                <br />
                <span className="text-[#3abeff]">arvamused ja tagasiside</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] font-light">
                Meie klientide rahulolu on parim tunnustus.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
                  Soovid sama tulemust? Küsi pakkumist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>

              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</Link>
                <span className="text-white/50">/</span>
                <a href="/sps-grupp" className="text-white/80 no-underline hover:text-white transition-colors">SPS Grupp</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Arvamused</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Testimonials by category */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Arvamused teenuste kaupa
                </div>
                <TwoToneHeading text="Mida ütlevad meie kliendid" />
              </div>

              {categories.map((category, catIdx) => (
                <div key={catIdx} className="mb-20 last:mb-0">
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-[24px] font-bold text-[#17345a]">{category.title}</h2>
                    <span className="text-[15px] text-[#5a6474] bg-[#f0f2f5] rounded-full px-3 py-0.5">
                      {category.testimonials.length}
                    </span>
                    <Link
                      href={category.href}
                      className="text-[15px] text-[#3abeff] no-underline font-medium transition-colors hover:text-[#17345a] ml-auto"
                    >
                      Vaata teenust →
                    </Link>
                  </div>

                  <TestimonialCards testimonials={category.testimonials} cols={3} />
                </div>
              ))}
            </div>
          </section>
        </ScrollAnimation>

        {/* Video section */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-[#eceef1]">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Video
                </div>
                <TwoToneHeading text="Kliendilugu: Tehnikakõrgkool" />
                <p className="section-intro mx-auto mt-4">
                  Vaata, kuidas aitasime 2800 õpilasega koolil luua tervislikuma õpikeskkonna.
                </p>
              </div>

              <div className="w-full md:w-3/4 mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <video
                    src="/SPS-TarmoSildberg.mp4"
                    controls
                    preload="none"
                    poster="/TarmoHero.jpg"
                    className="w-full h-auto"
                    style={{ borderRadius: "24px" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Liitu rahulolevate klientidega!"
            description="TASUTA konsultatsioon – Personaalne hoone hindamine – Ekspertarvamus 30 minuti jooksul. Võta meiega ühendust: telefonil +372 662 3328 või e-postil info@spsgrupp.ee"
          />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
