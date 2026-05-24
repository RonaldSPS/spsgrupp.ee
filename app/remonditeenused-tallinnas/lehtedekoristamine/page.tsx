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

const faqItems = [
  {
    q: "Millal on parim aeg lehtede koristuseks?",
    a: "Sügisel, kui lehed on langenud, on põhiline koristusaeg. Kuid pakume lehtede koristust ka kevadel ja suvel vastavalt vajadusele. Regulaarne koristus hoiab ala korras kogu aasta vältel.",
  },
  {
    q: "Kas te koristate ka suuri territooriume?",
    a: "Jah. Oleme harjunud töötama nii väikeste ärihoone õuealade kui ka suurte territooriumitega. Vajadusel toome kohale suurema tehnika ja meeskonna.",
  },
  {
    q: "Mida teete kogutud lehtedega?",
    a: "Kogume lehed kokku, laadime veokisse ja viime nõuetekohaselt käitlusesse. Pakume ka kompostimist, kui see on teie sooviks.",
  },
  {
    q: "Kas koristate ka vihmase ilmaga?",
    a: "Märjad lehed on raskemad ja võivad tekitada libedust. Kui vihm pole väga tugev, teostame koristuse siiski. Tugeva vihma korral lepime kokku uue aja.",
  },
  {
    q: "Kas teenus hõlmab ka jäätmete äravedu?",
    a: "Jah, alati. Kogutud lehed ja haljastusjäätmed viime oma transpordiga ära ja käitleme vastavalt nõuetele.",
  },
];

const serviceItems = [
  "Lehtede kogumine ja kokkupuhumine",
  "Lehtede ja haljastusjäätmete äravedu",
  "Sügisene suurpuhastus",
  "Kevadine koristus pärast talve",
  "Okste ja prahi eemaldamine territooriumilt",
  "Aia- ja haljastusjäätmete käitlus",
  "Kõvakattega pindade puhastus lehtedest",
  "Vihmaveesüsteemide puhastus lehtedest",
  "Murult lehtede eemaldamine",
  "Regulaarne hooldusleping sügisperioodiks",
];

const benefits = [
  {
    title: "Kiire ja efektiivne",
    desc: "Kasutame professionaalseid lehepuhureid ja -imejaid, mis teevad töö kiiresti ja põhjalikult. Suured alad saavad koristatud mõne tunniga.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Täisteenus ühest kohast",
    desc: "Kogume, laadime ja viime ära. Teie ei pea muretsema jäätmete käitluse ega transpordi pärast. Kõik käib teenuse hinnas.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Regulaarne hooldus",
    desc: "Sügisel koristame lehti vastavalt vajadusele — kord nädalas või vastavalt langenud lehtede hulgale. Nii püsib teie territoorium alati korras.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Ohutu ja korralik",
    desc: "Märjad lehed tekitavad libedust ja võivad olla ohtlikud. Regulaarne lehtede koristus hoiab teie parkla ja kõnniteed ohutuna klientidele ja töötajatele.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const prices = [
  "Väike ala (kuni 500 m²): alates 80€",
  "Keskmine ala (500–2000 m²): alates 150€",
  "Suur ala (2000+ m²): alates 250€",
  "Regulaarne sügisene hooldusleping: alates 100€/kord",
  "Lehtede ja jäätmete äravedu: alates 50€",
];

export default function LehtedekoristamineLeht() {
  return (
    <>
      <SeoJsonLd
        serviceName="Lehtede koristamine Tallinnas"
        serviceDescription="Lehtede ja aiajäätmete koristamine ärikinnisvaralt Tallinnas. Sügisene koristus, kompostimine."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas/lehtedekoristamine"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" }, { position: 3, name: "Lehtede koristamine", item: "https://spsgrupp.ee/remonditeenused-tallinnas/lehtedekoristamine" }]}
        faq={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Lehtede koristus Tallinnas"
          style={{ background: "url('/lehekoristus-1.jpg') center/cover no-repeat" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            {[
              { value: "Sügisene", label: "koristus" },
              { value: "Kiire", label: "reageerimine" },
              { value: "Ohutu", label: "territoorium" },
            ].map((chip, i) => (
              <div key={i} className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
                <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
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
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] mb-[18px]">
                Lehtede koristus
                <br />
                <span className="text-[#3abeff]">Tallinnas</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Sügisene lehtede koristus ja äravedu ärihoonete ümbruses. Hoiame teie parkla, kõnniteed ja muru puhtana kogu sügisperioodi vältel.
              </p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <Link href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi lehtede koristuse pakkumist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
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
              <div className="text-white/70 text-[15px] font-light mb-3">
                Kiire teenindus <span className="text-white/40 mx-2">|</span> Jäätmete äravedu <span className="text-white/40 mx-2">|</span> Regulaarne hooldus <span className="text-white/40 mx-2">|</span> Ohutu ala <span className="text-white/40 mx-2">|</span> Paindlik ajakava
              </div>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</Link>
                <span className="text-white/50">/</span>
                <Link href="/remonditeenused-tallinnas" className="text-white/80 no-underline hover:text-white transition-colors">Remonditeenused</Link>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Lehtede koristus</span>
              </nav>
            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Lehtedest puhas territoorium on ohutu ja esinduslik" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Sügisel langevad lehed kiiresti ja katavad kogu territooriumi. Lisaks sellele, et see näeb koristamata välja, tekitavad märjad lehed libedust parklates ja kõnniteedel. See on ohtlik teie klientidele ja töötajatele.</p>
                  <p className="mt-4">Kui lehed jäävad pikaks ajaks murule, hakkab muru nende all lämbuma ja hallitama. Kevadel näete kahjustusi, mida oleks saanud vältida lihtsa sügisese koristusega.</p>
                </div>
                <div>
                  <p>SPS Grupp pakub professionaalset lehtede koristust ärihoonete ümbruses. Kasutame tõhusat tehnikat, mis kogub lehed kiirelt ja põhjalikult. Kogutud lehed ja haljastusjäätmed viime kohe ära.</p>
                  <p className="mt-4">Tellige regulaarne sügisene hooldus — siis pole vaja muretseda, millal lehti koristada. Tuleme kokkulepitud ajal ja teeme töö ära.</p>
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
                <TwoToneHeading text="Milliseid lehtede koristuse teenuseid pakume?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceItems.map((item, i) => (
                  <div key={i} className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-all duration-300 border border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-white/60 cursor-pointer">
                    <div className="text-[#5a6474] text-[15px] mb-2">
                      <span className="font-mono inline-block border-b border-[#5a6474] pb-px pr-5">{String(i + 1).padStart(2, "0")}.</span>
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
                <TwoToneHeading text="Miks valida SPS Grupp lehtede koristuseks?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {benefits.map((item, i) => (
                    <div key={i} className="bg-[#f8fafc] p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-[#eef7fc] cursor-pointer">
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
                    src="/lehekoristus-2.jpg"
                    alt="SPS Grupp lehtede koristus Tallinna ärihoone juures"
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
                <TwoToneHeading text="Lehtede koristuse hinnad" />
              </div>

              <div className="max-w-[900px] mx-auto">
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-6 font-light">
                  Hind sõltub territooriumi suurusest, lehtede hulgast ja koristuse sagedusest.
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
                  Regulaarse sügisese hoolduslepinguga saate soodsama hinna ja garanteeritud teenuse.
                </p>
                <Link href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi lehtede koristuse pakkumist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FAQ items={faqItems} />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Hoidke oma territoorium puhtana kogu sügise vältel"
            description="Telli regulaarne lehtede koristus ja äravedu. Pakume paindlikku ajakava ja konkurentsivõimelist hinda."
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
