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

const serviceItems = [
  "Katuse ülevaatus ja seisukorra hindamine",
  "Lekete diagnoosimine ja kiirparandus",
  "Lamekatuste renoveerimine (rullmaterjalid, PVC)",
  "Hüdroisolatsiooni uuendamine",
  "Katuseluugide ja lõõride paigaldus",
  "Vihmaveesüsteemide puhastus ja remont",
  "Lumekoristus talvel (koormuse vältimiseks)",
  "Regulaarne hoolduslepingul põhinev teenindus",
  "Soojustamine ja energiatõhususe parandamine",
  "Katusekonstruktsioonide parandus",
];

const benefits = [
  {
    title: "Kiire lekke diagnostika",
    desc: 'Kasutame termokaameraid ja muid kaasaegseid tööriistu, et leida lekke tegelik allikas. Paljud lekked on "nähtamatud" tavalise vaatluse jaoks.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 7v8" />
        <path d="M7 11h8" />
      </svg>
    ),
  },
  {
    title: "Ärihoonete kogemus",
    desc: "Oleme spetsialiseerunud lamekatustele ja ärihoonete katustele. Teame erinevate katusetüüpide eripärasid.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M3 21h18" />
        <path d="M5 21V8l7-5 7 5v13" />
        <path d="M9 21v-7h6v7" />
      </svg>
    ),
  },
  {
    title: "Hoolduslepingud",
    desc: "Regulaarne ülevaatus ja hooldus väldivad suuri üllatusi. Kevadine ja sügisene kontroll on ärikinnisvarale suisa kohustuslik.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Kindlustatud tööd",
    desc: "Katusetööd on riskantsed. Meie tegevus on kindlustatud võimalike kahjude vastu.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const prices = [
  "Lekke diagnoosimine ja parandus: alates 250€",
  "Osaline katuse uuendamine: alates 25€/m²",
  "Täielik lamekatuse renoveerimine: alates 45€/m²",
  "Vihmaveesüsteemide puhastus: alates 300€",
  "Aastane hoolduskava: alates 400€",
];

const faqItems = [
  {
    q: "Kui sageli peaks katust kontrollima?",
    a: "Soovituslik on kevadel pärast talvekahjustusi ja sügisel enne talve. Lisaks peale tugevaid torme. Hoolduslepinguga kliendid saavad automaatselt regulaarset ülevaatust.",
  },
  {
    q: "Kuidas leiate katuselekke allika?",
    a: "Katuselekke allikas ei ole tihti seal, kus vesi sisse tuleb, sest vesi võib joosta katuse all. Kasutame termokaameraid ja süsteemset lähenemist lekke tegeliku koha leidmiseks.",
  },
  {
    q: "Kui kaua kestab lamekatuse renoveerimine?",
    a: "Kvaliteetne lamekatuse renoveerimine kestab 15-25 aastat, sõltuvalt materjalidest ja hooldusest. Regulaarne hooldus pikendab eluiga veelgi.",
  },
  {
    q: "Kas tegelete ka talvise lumekoristusega katuselt?",
    a: "Jah. Suured lumekoormused võivad kahjustada katust ja isegi ohustada konstruktsiooni. Pakume talvist lumekoristust katuselt.",
  },
  {
    q: "Kas annate garantii katusetöödele?",
    a: "Jah. Paigaldustöödele 2 aastat, materjalidele tootja garantii, sageli 10+ aastat. Suuremad renoveerimised tulevad pikema töögarantiiga.",
  },
];

export default function KatuseRemontLeht() {
  return (
    <>
      <SeoJsonLd
        serviceName="Katuse remont Tallinnas"
        serviceDescription="Katuse remont ja hooldus Tallinnas ärikinnisvarale. Katusekatte vahetus, parandus, ülevaatus."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas/katuse-remont"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" }, { position: 3, name: "Katuse remont", item: "https://spsgrupp.ee/remonditeenused-tallinnas/katuse-remont" }]}
        faq={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Katuse remont Tallinnas"
          style={{ background: "url('/katuseremont-1.jpg') right top/cover no-repeat" }}
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
                Katuse remont ja hooldus
                <br />
                <span className="text-[#3abeff]">ärihoonetele</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[560px] font-light">
                Lamekatused, rullmaterjalid, hüdroisolatsioon. Lekete kiire kõrvaldamine, regulaarne hooldus ja täielik renoveerimine. 20+ aastat kogemust.
              </p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi katuse remondi pakkumist →
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
                <a href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</a>
                <span className="text-white/50">/</span>
                <a href="/remonditeenused-tallinnas" className="text-white/80 no-underline hover:text-white transition-colors">Remonditeenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Katuse remont</span>
              </nav>

            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Katuse leke on aja jooksul kõige kallim probleem" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Katusest läbi tulev vesi ei ole lihtsalt ebamugavus. See on algus kiiresti kasvavatele probleemidele. Vesi kahjustab isolatsiooni, jõuab lagede ja seinte sisse, rikub elektrisüsteemi, põhjustab hallitust ja lõpuks kahjustab kogu hoone konstruktsiooni.</p>
                  <p className="mt-4">Halvim on see, et katuseleke ei ole alati selge. Väike leke võib kuude kaupa olla nähtamatu, kuni kahjustused on juba ulatuslikud.</p>
                </div>
                <div>
                  <p>SPS Grupp pakub katuse hooldust, remonti ja renoveerimist. Regulaarne ülevaatus väldib suuri üllatusi. Lekete kiire kõrvaldamine hoiab ära suuri kahjusid. Täielik renoveerimine annab meelerahu.</p>
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
                <TwoToneHeading text="Milliseid katusetöid me teostame?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceItems.map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-all duration-300 border border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-white/60 cursor-pointer"
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
                <TwoToneHeading text="Miks valida SPS Grupp katusepartneriks?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {benefits.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-[#eef7fc] cursor-pointer"
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
                    src="/katuseremont2.webp"
                    alt="SPS Grupp katuse remont ja hooldus ärihoonetele"
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
                <TwoToneHeading text="Katuse remondi hinnad" />
              </div>

              <div className="max-w-[900px] mx-auto">
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-6 font-light">
                  Hind sõltub katuse tüübist, pindalast, töö mahust ja materjalidest.
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
                  Suuremate projektide puhul alati kinnishind peale kohapealset ülevaatust.
                </p>
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi katuse pakkumist →
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
          <FooterCTA
            title="Ärge laske väiksel lekkel kasvada suureks kahjuks"
            description="Helistage täna! Tuleme hindama ja pakume lahenduse. Kiirreageerimine lekete puhul."
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
