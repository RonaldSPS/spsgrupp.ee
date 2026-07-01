"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FAQ from "../../components/FAQ";
import FooterCTA from "../../components/FooterCTA";
import ContactForm from "../../components/ContactForm";
import TwoToneHeading from "../../components/TwoToneHeading";
import ScrollAnimation from "../../components/ScrollAnimation";
import SeoJsonLd from "../../components/SeoJsonLd";
import Tooprotsess from "../../components/Tooprotsess";

const elektritoodFAQ = [
  {
    q: "Kas teete ka kodupinna elektritöid?",
    a: "Ei — spetsialiseerume äriklientidele. Kodupinna elektritöödeks soovitame pöörduda kodumajapidamistele spetsialiseerunud elektriku poole. Äriklientide puhul on meie kogemused, kiirus ja dokumentatsioon teistmoodi, ning see peegeldub ka hinnas.",
  },
  {
    q: "Kui kiiresti reageerite elektririkkele?",
    a: "Harjumaa piirkonnas 2 tunni jooksul plaaniliste rikete puhul. Kriitiliste süsteemide (serveriruum, kaubandus, meditsiiniasutused) jaoks on lepinguliselt kokku leppida võimalik 30-minutiline reageering. Tööajavälisel ajal (õhtu, nädalavahetus) on hädaabireageering võimalik, hind on siis kõrgem.",
  },
  {
    q: "Kas LED-üleminek tasub end ära?",
    a: "Enamikel juhtudel jah. Keskmine kontor säästab 40–60% valgustuskuludest ja investeering teenib end tagasi 2–4 aastaga. Nutilahendustega (liikumis-, valgusandurid) on sääst veel suurem. Täpne arvestus sõltub teie praegustest kuludest, valgustuse kasutustihedusest ja valgustite arvust. Teeme vajadusel energiaefektiivsuse arvutuse enne investeerimist.",
  },
  {
    q: "Milline peab olema ärihoone elektrisüsteemi hooldusgraafik?",
    a: "Iga-aastane visuaalne ülevaatus ja termograafilist kontrolli kilbist. Iga 5 aasta tagant põhjalikum audit. Pistikupesade ja lülitite pistelised kontrollid. Kriitilistel süsteemidel (serveriruumid) kord poolaastas. Hoolduslepingu klientide jaoks hoolitseme kogu graafiku eest ise.",
  },
  {
    q: "Kas paigaldate ka elektriautode laadimisjaamu?",
    a: "Jah — nii tavalaadijaid (AC 7–22 kW) kui kiirlaadijaid (DC 50 kW+). Meil on kogemus nii töötajate parklatega kui avalike laadimisjaamadega kaubanduskeskustes ja hotellides. Teeme terviklikuma paketi — taristu, paigaldus, makselahendus, kaugjälgimine.",
  },
  {
    q: "Kas elektritööd nõuavad loa?",
    a: "Osa elektritöid nõuab elektriohutuse seaduse järgi pädevat isikut (meie elektrikud on litsentseeritud). Suurematele uusprojektidele võib vaja olla ehitusluba ja projektdokumentatsiooni — me haldame kogu protsessi kliendile nähtamatult. Pärast tööde lõppu väljastame tegevuspäeviku ja mõõtmisprotokollid, mis on vajalikud nii auditeerimise kui kindlustuse jaoks.",
  },
  {
    q: "Kas saaks ainult lubatud osa süsteemist uuendada, mitte kõike korraga?",
    a: "Jah — see ongi meie standardlähenemine ärikinnisvarale. Uuendame etappide kaupa, nii et teie äritegevus ei seisaks seisma. Sageli teeme töid õhtuti, nädalavahetustel või tühjade ruumide kaupa. Kogu plaan on ette paigas ja te teate, millal mis etapp tuleb.",
  },
];

export default function ElektritoodLeht() {
  const heroPilt = "/images/elekter/ElekterHero.webp";
  const heroPealkiri = "Elektritööd äripindadele";
  const heroPealkiriVarviline = "Tallinnas ja Harjumaal";
  const heroKirjeldus =
    "Projekteerime ja paigaldame uusi elektrisüsteeme, hooldame olemasolevaid, uuendame aegunud juhtmestikke, paigaldame LED-valgustust ja elektriautode laadimisjaamu. Kõik meie elektrikud on litsentseeritud ja tööd vastavad EVS-HD 60364 standardile. Anname tehtud töödele 2-aastase garantii ja kogu tegevus on kindlustatud.";
  const heroHind = "2-aastase garantii";
  const heroCtaTekst = "Küsi elektritööde pakkumist";

  const floatingChips = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      chipClass: "chip-icon-blue",
      value: "Litsentseeritud",
      label: "Elektrikud",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      chipClass: "chip-icon-green",
      value: "EVS-HD 60364",
      label: "Standard",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
      chipClass: "chip-icon-navy",
      value: "2-aastane",
      label: "Garantii",
    },
  ];

  const probleemPealkiri = "Miks äripinna elektritööd erinevad kodustest";
  const probleemTekstVasak =
    "<p>Äripindade elektrisüsteemid peavad toimima katkestusteta, turvaliselt ja kooskõlas kõigi kehtivate nõuetega. Bürood, tootmishooned, kaubanduspinnad ja laod vajavad lahendusi, mis taluvad suuri koormusi ning tagavad töökindluse ka intensiivses kasutuses. Iga elektrikatkestus või rike võib tähendada tööseisakut, saamata jäänud tulu ja häiritud kliendikogemust.</p>";
  const probleemTekstParem =
    "<p>Äripindade elektritööd nõuavad põhjalikku projekteerimist, täpset dokumentatsiooni ja regulaarset hooldust. Teostame elektripaigaldisi vastavalt nõuetele ning koostame vajalikud mõõtmisprotokollid, teostusdokumentatsiooni ja audititeks vajaliku info. Vajadusel viime läbi ka termograafilisi kontrolle ja ennetavaid hooldustöid, et avastada võimalikud probleemid enne rikete tekkimist.</p><p>Keskendume ainult äriklientidele. See tähendab kogemust keerukate süsteemidega, kiiret reageerimist ning võimekust töötada aktiivses töökeskkonnas nii, et teie ettevõtte igapäevane tegevus oleks võimalikult vähe häiritud. Olgu tegemist uue elektrisüsteemi ehituse, laienduse, hoolduse või kiire avariitööga — tagame professionaalse ja töökindla lahenduse.</p>";

  const teenuseSisuPealkiri = "Elektritööde teenused";
  const teenuseSisuKaardid: { bold: string; desc: string }[] = [
    {
      bold: "Projekteerimine ja paigaldus",
      desc: "Täisteenus uutele ja renoveeritavatele ärihoonetele: projekteerimine, koosolekud peatöövõtjatega, paigaldus, testimine, dokumentatsioon ja käikuandmine.",
    },
    {
      bold: "Hooldus ja rikete likvideerimine",
      desc: "Regulaarne hooldusleping sisaldab iga-aastast visuaalset ülevaatust ja termograafilist kontrolli. Rikkele reageerime Harjumaal 2 tunni jooksul.",
    },
    {
      bold: "Juhtmestiku uuendamine",
      desc: "Vanemate ärihoonete aegunud juhtmestiku uuendamine etappide kaupa. Töid teeme õhtuti või nädalavahetustel, et äritegevus ei seiskuks.",
    },
    {
      bold: "LED-valgustus",
      desc: "Aegunud valgustite asendamine LED-lahendustega. Tavaline kontorihoone säästab 40–60% valgustuskuludest ja investeering tasub end 2–4 aastaga.",
    },
    {
      bold: "Nutilahendused",
      desc: "Liikumis- ja valgusandurid, automaatne reguleerimine ja kaugjuhtimine. Büroohoonetes annavad nutisüsteemid sageli lisaks 30% säästu.",
    },
    {
      bold: "Elektriautode laadimisjaamad",
      desc: "Tavalaadijad (AC 7–22 kW) ja kiirlaadijad (DC 50 kW+) äriklientidele. Täisteenus taristust kuni makselahenduse ja kaugjälgimiseni.",
    },
    {
      bold: "Elektriaudit",
      desc: "Põhjalik süsteemi audit: mõõtmised, termograafia, dokumentatsiooni läbivaatus. 400–800 € auditi vastus võib säästa kordades rohkem järgmise aasta kuludes.",
    },
    {
      bold: "Jaotuskilpide paigaldus",
      desc: "Uute jaotuskilpide projekteerimine ja paigaldus vastavalt koormustele ja tuleviku laiendatavusele. Olemasolevate kilpide uuendamine.",
    },
    {
      bold: "Dokumentatsioon ja mõõtmisprotokollid",
      desc: "Koostame kogu vajaliku dokumentatsiooni: teostusjoonised, mõõtmisprotokollid, tegevuspäevikud auditeerimiseks ja kindlustuse jaoks.",
    },
  ];

  const miksMeiePealkiri = "Miks valida SPS Grupp elektritöödeks";
  const miksMeieKaardid: { title: string; desc: string; icon: React.ReactNode }[] = [
    {
      title: "Ärikinnisvara spetsialistid",
      desc: "Tunneme büroode, tootmishoonete ja kaubanduspindade elektrisüsteemide spetsiifikat: suured koormused, serveriruumid, tööstussüsteemid.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
    },
    {
      title: "Vastutuskindlustus",
      desc: "Kogu meie elektritööde tegevus on kaetud vastutuskindlustusega. Sinu äri on kaitstud ka ootamatuste korral.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: "2-aastane garantii",
      desc: "Anname kõikidele elektritöödele 2-aastase garantii. Kui midagi läheb valesti, parandame selle omal kulul.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      title: "Litsentseeritud elektrikud",
      desc: "Kõik meie elektrikud on litsentseeritud ja tööd vastavad EVS-HD 60364 standardile. Teostame töid vastavalt elektriohutuse seadusele.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
  ];
  const miksMeiePilt = "/images/elekter/Elekter2.webp";
  const miksMeiePiltAlt = "SPS Grupp elektrikud tööl äripinnal";

  const hindPealkiri = "Elektritööde hinnad";
  const hindKirjeldus =
    "Elektritööd on enamasti projektipõhised. Allolevad numbrid on orienteeruvad. Täpne pakkumine nõuab kohapealset hindamist või projektdokumentatsiooni.";
  const hindTabel: { teenus: string; hind: string; kommentaar: string }[] = [
    {
      teenus: "Tunnitasu (rikke otsing, väiksem remont)",
      hind: "55–75 €/tund",
      kommentaar: "Miinimumtasu 1 tund",
    },
    {
      teenus: "Elektriaudit (kuni 1000 m²)",
      hind: "400–800 €",
      kommentaar: "Mõõtmised + raport",
    },
    {
      teenus: "Aastahooldusleping (kontor)",
      hind: "alates 80 €/kuu",
      kommentaar: "Sõltub hoone suurusest",
    },
    {
      teenus: "LED-üleminek (kontor, 500 m²)",
      hind: "3000–7000 €",
      kommentaar: "Tasub end 2–4 aastaga",
    },
    {
      teenus: "Laadimisjaam (AC 22 kW, paigaldus)",
      hind: "alates 1500 €",
      kommentaar: "Sõltub kaugustest ja infrastruktuurist",
    },
    {
      teenus: "Juhtmestiku uuendus (keskmine kontor)",
      hind: "projektipõhine",
      kommentaar: "Etappide kaupa",
    },
  ];
  const footerCtaTitle = "Tellige elektritööde pakkumine";
  const footerCtaDescription =
    "Alustame enamasti 15–30-minutilisest kohapealsest nõustamisest — see on tasuta ega kohusta millekski. Helistage +372 662 3328 või kirjutage info@spsgrupp.ee.";

  const breadcrumbTeenus = "Elektritööd";

  const sotsiaalneToestusSectionTag = "Meie elektrikud";
  const sotsiaalneToestusPealkiri = "Tallinnas ja Harjumaal";
  const sotsiaalneToestusKirjeldus =
    "Meie elektritööde meeskond teenindab kontoreid Ülemiste Citys ja kesklinnas, kaubanduskeskusi Mustamäel ja Lasnamäel, tootmisettevõtteid Peetri ja Saku tööstusparkides. Sageli kombineeritakse elektritööd meie muude teenustega (siseviimistlus, ventilatsioon, sanitaarremont) ühe projekti alusel. Meil on kogemus nii 100 m² väikekontoritest kuni 10 000 m² tootmishoonetesteni.";

  const stats = [
    { number: "2 h", label: "Reageerimisaeg Harjumaal" },
    { number: "2 a", label: "Garantii elektritöödele" },
    { number: "100+", label: "Äriobjekti teenindatud" },
  ];

  return (
    <>
      <SeoJsonLd
        serviceName="Elektritööd Tallinnas"
        serviceDescription="Elektriteenused ärikinnisvarale Tallinnas. Paigaldus, remont, hooldus, elektrikilbid."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas/elektritood"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" }, { position: 3, name: "Elektritööd", item: "https://spsgrupp.ee/remonditeenused-tallinnas/elektritood" }]}
        faq={elektritoodFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label={breadcrumbTeenus}
          style={{ background: `url('${heroPilt}') center/cover no-repeat` }}
        >
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            {floatingChips.map((chip, i) => (
              <div
                key={i}
                className="floating-chip animate-float"
                style={{ background: "rgba(255,255,255,0.95)" }}
              >
                <div className={`chip-icon ${chip.chipClass} w-11 h-11 rounded-xl flex items-center justify-center`}>
                  {chip.icon}
                </div>
                <div>
                  <div className="text-[18px] font-bold text-[#17345a] leading-tight">{chip.value}</div>
                  <div className="text-[15px] text-[#1f2937]">{chip.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] md:gap-[60px] items-start max-w-[1280px] mx-auto w-full relative z-10">
            <div
              className="animate-fade-up order-2 md:order-1"
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
                {heroPealkiri}
                <br />
                <span className="text-[#3abeff]">{heroPealkiriVarviline}</span>
              </h1>
              <p
                className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light"
                dangerouslySetInnerHTML={{
                  __html: heroKirjeldus.replace(
                    heroHind,
                    `<strong class="text-white font-medium">${heroHind}</strong>`
                  ),
                }}
              />
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  {heroCtaTekst}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <Link
                  href="tel:6623328"
                  className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  662 3328
                </Link>
              </div>

              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</Link>
                <span className="text-white/50">/</span>
                <a href="/remonditeenused-tallinnas" className="text-white/80 no-underline hover:text-white transition-colors">Remonditeenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Elektritööd</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text={probleemPealkiri} className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div dangerouslySetInnerHTML={{ __html: probleemTekstVasak }} />
                <div dangerouslySetInnerHTML={{ __html: probleemTekstParem }} />
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Teenuse sisu */}
        <ScrollAnimation animation="fade-up">
          <section
            className="py-[100px]"
            id="teenused"
            style={{ background: "#d4d8e3 url('/swirl_back.svg') calc(100% + 100px) center / cover no-repeat" }}
          >
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  Teenuse sisu
                </div>
                <TwoToneHeading text={teenuseSisuPealkiri} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teenuseSisuKaardid.map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80"
                  >
                    <div className="text-[#5a6474] text-[15px] mb-2">
                      <span className="font-mono inline-block border-b border-[#5a6474] pb-px pr-5">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                    </div>
                    <div className="text-[#2f353f] text-[15px] leading-[1.6]">
                      <strong className="text-[#17345a] block mb-1">{item.bold}</strong>
                      {item.desc ? <span className="text-[#5a6474]">{item.desc}</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Miks meie */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Miks meie
                </div>
                <TwoToneHeading text={miksMeiePealkiri} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {miksMeieKaardid.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-[18px] font-bold text-[#17345a] mb-2">{item.title}</h3>
                          <p className="text-[15px] text-[#5a6474] leading-[1.7]">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src={miksMeiePilt}
                    alt={miksMeiePiltAlt}
                    width={600}
                    height={700}
                    className="w-full h-auto object-cover"
                    style={{ color: "#2d3748" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Hind */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Hind
                </div>
                <TwoToneHeading text={hindPealkiri} />
              </div>

              <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-10 font-light max-w-[800px] mx-auto text-center">
                {hindKirjeldus}
              </p>

              <div className="overflow-x-auto max-w-[900px] mx-auto">
                <table className="w-full border-collapse text-[15px]">
                  <thead>
                    <tr className="bg-[#17345a] text-white">
                      <th className="text-left p-4 font-medium rounded-tl-2xl">Teenus</th>
                      <th className="text-center p-4 font-medium">Hinnavahemik</th>
                      <th className="text-left p-4 font-medium rounded-tr-2xl">Kommentaar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hindTabel.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-[#e8eaed] transition-colors ${
                          i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                        } hover:bg-[#eef7fc]`}
                      >
                        <td className="p-4 text-[#17345a] font-medium">{row.teenus}</td>
                        <td className="p-4 text-center text-[#17345a] font-bold">{row.hind}</td>
                        <td className="p-4 text-[#5a6474]">{row.kommentaar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="max-w-[800px] mx-auto mt-8 space-y-2">
                <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                  Suuremate projektide (uus paigaldus, renoveerimine) hind sõltub tugevalt hoone seisundist ja nõuetest. Vajalik on kohapealne hindamine.
                </p>
                <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                  Esimene konsultatsioon on tasuta Harjumaa äriklientidele.
                </p>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Sotsiaalne tõestus */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-[#eceef1]" id="kliendid-arvustused">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {sotsiaalneToestusSectionTag}
                </div>
                <TwoToneHeading text={sotsiaalneToestusPealkiri} />
                <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mt-6">
                  {sotsiaalneToestusKirjeldus}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-8 text-center transition-colors duration-300 border-2 border-transparent hover:bg-gray-50"
                  >
                    <div className="text-[clamp(32px,4vw,48px)] font-bold text-[#17345a] mb-2">{stat.number}</div>
                    <div className="text-[15px] text-[#5a6474]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS elektritööde teenust korraldab?"
          intro="Selge protsess teeb teenuse tellimise lihtsamaks ja annab mõlemale poolele ühise arusaama kvaliteedist, ajakavast ja vastutusest."
          steps={[
            ["Probleemi kirjeldus", "Täpsustame töö vajaduse."],
            ["Ülevaatus", "Hindame olukorra kohapeal."],
            ["Pakkumine", "Kirjeldame tööde ulatuse."],
            ["Teostus", "Teeme töö kokkulepitud ajal."],
            ["Kontroll", "Anname töö üle ja selgitame tulemust."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA title={footerCtaTitle} description={footerCtaDescription} />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
          <FAQ items={elektritoodFAQ} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
