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

const serviceItems = [
  "Ventilatsioonisüsteemide projekteerimine (uued ja renoveerimine)",
  "Paigaldus — torustikud, agregaadid, komponendid",
  "Süsteemide regulaarne hooldus ja filtrite vahetus",
  "Ventilatsioonikanalite puhastus",
  "Rikete diagnoosimine ja kõrvaldamine",
  "Energiatõhususe auditid ja optimeerimine",
  "Tolmu- ja saaste eemaldamine tootmishoonetest",
  "Köökide ventilatsiooni hooldus (rasva eemaldamine)",
  "Automatiseerimis- ja juhtimissüsteemide paigaldus",
  "24h hooldusleping ärikriitiliste süsteemide jaoks",
];

const benefits = [
  {
    title: "Ärikinnisvara kogemus",
    desc: "Töötame kontorihoonetes, kaubanduspindadel, tootmishoonetes ja köökides. Tunneme iga tüübi eripära.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9h1M9 13h1M9 17h1M15 13h1M15 17h1" />
      </svg>
    ),
  },
  {
    title: "Täislahendus ühest kohast",
    desc: "Projekteerimisest paigalduseni ja hooldusest kuni remondini. Ei pea otsima erinevaid partnereid igale etapile.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Hoolduslepingud",
    desc: "Regulaarne hooldus hoiab süsteemi töös ja pikendab eluiga. Kindel hind, ennustatav kvaliteet.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Kiire reageerimine riketele",
    desc: "Kui süsteem seiskub, reageerime 24h jooksul. Hoolduslepingutega klientidele prioriteet.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M13 2L3 14h8l-1 8 11-14h-8l1-6z" />
      </svg>
    ),
  },
];

const prices = [
  "Ventilatsioonikanalite puhastus: alates 300€",
  "Filtrite vahetus ja hooldus: alates 150€",
  "Väikesema süsteemi paigaldus: alates 2 000€",
  "Keskmise kontori ventilatsioon: individuaalne projekt",
  "Hoolduslepingud: alates 80€/kuu",
];

const faqItems = [
  {
    q: "Kui sageli peaks ventilatsiooni puhastama?",
    a: "Sõltub keskkonnast. Kontorites tavaliselt 1-2 korda aastas, köökides ja tootmishoonetes oluliselt sagedamini. Filtreid vahetatakse 3-6 kuu tagant.",
  },
  {
    q: "Millal on vaja ventilatsiooni tervet süsteemi renoveerida?",
    a: "Kui süsteem on üle 15-20 aasta vana, tekivad pidevalt rikked, energiakulu on suur või õhu kvaliteet ei vasta normidele. Meie audit ütleb täpselt, mida soovitame.",
  },
  {
    q: "Kas saate teostada töid tööajal?",
    a: "Enamus hooldustöid saame teha tööajal ilma segajaid. Suuremate paigalduste puhul planeerime nädalavahetustele või tööpausidele.",
  },
  {
    q: "Kas annate garantii ventilatsioonitöödele?",
    a: "Jah. Paigaldustöödele 2 aastat, seadmetele tootja garantii (sageli 5 aastat).",
  },
  {
    q: "Kas kaetud hooldusleping võib säästa raha?",
    a: "Jah, reeglina jah. Regulaarne hooldus väldib suuri hädaremontide kulusid ja hoiab energiakulu madalal. Tavaliselt tasub leping end ära juba esimese aastaga.",
  },
];

export default function VentilatsioonideEhitusJaHooldusLeht() {
  return (
    <>
      <SeoJsonLd
        serviceName="Ventilatsioonide ehitus ja hooldus Tallinnas"
        serviceDescription="Ventilatsioonisüsteemide ehitus ja hooldus ärikinnisvarale Tallinnas. Õhupuhastus, kanalid, seadmed."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" }, { position: 3, name: "Ventilatsioonide ehitus ja hooldus", item: "https://spsgrupp.ee/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus" }]}
        faq={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Ventilatsioonisüsteemide ehitus ja hooldus Tallinnas"
          style={{ background: "url('/ventilatsioon-1.jpg') right top/cover no-repeat" }}
        >
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
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] mb-[18px]">
                Ventilatsiooni-
                <br />
                süsteemide ehitus ja hooldus
                <br />
                <span className="text-[#3abeff]">Tallinnas</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[560px] font-light">
                Projekteerimine, paigaldus ja regulaarne hooldus kontoritele, kaubanduspindadele ja tootmishoonetele. Puhas õhk tähendab tervemaid töötajaid ja produktiivsemat äri.
              </p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi ventilatsiooni pakkumist →
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
                <span className="text-white/90">Ventilatsioonide ehitus ja hooldus</span>
              </nav>

            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Halva ventilatsiooni kulu on varjatud, aga reaalne" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Halva ventilatsiooniga kontoris väheneb töötajate produktiivsus. Süsihappegaasi kontsentratsioon tõuseb, töötajatel on raskem keskenduda, peavalud sagenevad, haiguspäevade arv tõuseb. Kõige hullem on see, et keegi ei seosta seda ventilatsiooniga.</p>
                  <p className="mt-4">Veelgi halvem on puhastamata ventilatsioon. Filtrid ummistuvad, süsteemi hakkab kogunema tolm, hallitus ja bakterid. Hingamisteede haigused sagenevad, allergiad ägenevad. Samuti suureneb energiakulu, sest süsteem peab töötama tavalisest suurema koormusega.</p>
                </div>
                <div>
                  <p>Arvatakse, et asi on töös endas või stressis.</p>
                  <p className="mt-4">SPS Grupp pakub ventilatsioonile täislahendust. Projekteerimisest paigalduseni ja regulaarsest hooldusest kuni hädaremondini. Üks meeskond haldab kogu süsteemi eluiga.</p>
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

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
                <TwoToneHeading text="Milliseid ventilatsioonitöid me teostame?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceItems.map((item, i) => (
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
                      <strong className="text-[#17345a] block mb-1">{item}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

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
                <TwoToneHeading text="Miks valida SPS Grupp ventilatsioonipartneriks?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {benefits.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">{item.icon}</div>
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
                    src="/ventilatsioon-2.webp"
                    alt="SPS Grupp ventilatsioonisüsteemide ehitus ja hooldus"
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
                <TwoToneHeading text="Ventilatsiooni hinnad" />
              </div>

              <div className="max-w-[900px] mx-auto">
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-6 font-light">
                  Hind sõltub süsteemi suurusest, keerukusest ja teenuse tüübist.
                </p>
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-4 font-light">Orienteeruvad hinnad:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {prices.map((item, i) => (
                    <div key={i} className="bg-[#f8fafc] rounded-2xl p-4 text-[15px] text-[#2f353f] leading-[1.7]">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-[15px] text-[#5a6474] leading-[1.7] mb-8">
                  Suuremate projektide puhul tasuta kohapealne hindamine ja projektipõhine pakkumine.
                </p>
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi ventilatsiooni pakkumist →
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FAQ items={faqItems} />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS ventilatsioonitööde teenust korraldab?"
          intro="Selge protsess teeb teenuse tellimise lihtsamaks ja annab mõlemale poolele ühise arusaama kvaliteedist, ajakavast ja vastutusest."
          steps={[
            ["Probleemi kirjeldus", "Täpsustame sümptomid ja ruumi kasutuse."],
            ["Ülevaatus", "Hindame süsteemi ja ligipääsu."],
            ["Tööplaan", "Pakume sobiva lahenduse."],
            ["Teostus", "Teeme hoolduse, remondi või paigalduse."],
            ["Kontroll", "Anname soovitused edasiseks hoolduseks."],
          ]}
        />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Puhas õhk, tervemad töötajad, madalamad kulud"
            description="Tuleme hindama teie ventilatsioonisüsteemi ja koostame pakkumise hooldusest, remondist või uuendamisest."
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
