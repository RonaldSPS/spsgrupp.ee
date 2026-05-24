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
    q: "Kui sageli peaks muru niitma?",
    a: "Sõltub aastaajast ja muru kasvukiirusest. Suvekuudel tavaliselt kord nädalas, kevadel ja sügisel vastavalt vajadusele. Regulaarne niitmine hoiab muru tervena ja korralikuna.",
  },
  {
    q: "Kas tegelete ka muru ääriste ja trimmerdamisega?",
    a: "Jah. Muru niitmine hõlmab alati ka ääriste trimmerdamist ja servade korrastamist. Teeme töö lõpuni — kõik kohad saavad korralikult niidetud.",
  },
  {
    q: "Mis juhtub niidetud rohuga?",
    a: "Pakume nii niidetud rohu kogumist kui ka jätmist. Kogumise puhul korjame muru kokku ja viime minema. Jätmise korral jääb peenestatud muru murule väetiseks.",
  },
  {
    q: "Kas niidate ka vihmase ilmaga?",
    a: "Vältime niitmist tugeva vihma ajal, sest märg muru jääb ebaühtlane ja niiduk võib libiseda. Leppime kokku sobiva aja, kui ilm paraneb.",
  },
  {
    q: "Kui suuri pindasid te niidate?",
    a: "Niidame nii väikeseid kontorihoone murukaardikuid kui ka suuri territooriume. Meil on erineva suurusega niidukid, et valida igale pinnale sobiv tehnika.",
  },
];

const serviceItems = [
  "Muru niitmine ja hooldus",
  "Trimmerdamine ja ääriste lõikamine",
  "Servade korrastamine",
  "Niidetud muru kogumine ja äravedu",
  "Võsa ja umbrohu tõrje",
  "Põõsaste ja hekkide kujunduslõikus",
  "Muru ääriste paigaldus",
  "Territooriumi üldkoristus enne ja pärast niitmist",
  "Sügisene lehtede koristus",
  "Regulaarne hooldusleping",
];

const benefits = [
  {
    title: "Regulaarne ja usaldusväärne",
    desc: "Tuleme kokkulepitud ajal, iga kord. Regulaarne niitmine hoiab teie territooriumi esinduslikuna ilma, et peaksite sellele mõtlema.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Professionaalne tehnika",
    desc: "Kasutame kaasaegseid niidukeid ja trimmereid, mis tagavad ühtlase ja kvaliteetse tulemuse. Tehnika sobib igas suuruses ja tüübis murule.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Keskkonnasõbralik",
    desc: "Toimime loodust säästvalt. Jätame muru peenestatud jäätmed väetiseks või kogume ära vastavalt teie soovile. Kemikaale kasutame vaid siis, kui see on kokku lepitud.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Paindlik ajakava",
    desc: "Kohandume teie vajadustega. Niidame kas hommikul enne kontori tööaega või pärast tööpäeva lõppu, et mitte segada teie äritegevust.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

const prices = [
  "Väike ala (kuni 500 m²): alates 50€/kord",
  "Keskmine ala (500–2000 m²): alates 90€/kord",
  "Suur ala (2000+ m²): alates 150€/kord",
  "Regulaarne hooldusleping: alates 40€/kord",
  "Trimmerdamine ja ääriste korrastus: alates 30€",
];

export default function MuruniitmineLeht() {
  return (
    <>
      <SeoJsonLd
        serviceName="Muruniitmine Tallinnas"
        serviceDescription="Muruniitmine ja haljasalade hooldus ärikinnisvaral Tallinnas. Regulaarne niitmine, servade korrastus."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas/muruniitmine"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" }, { position: 3, name: "Muruniitmine", item: "https://spsgrupp.ee/remonditeenused-tallinnas/muruniitmine" }]}
        faq={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Muru niitmine Tallinnas"
          style={{ background: "url('/muruniitmine-1.jpg') center/cover no-repeat" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            {[
              { value: "Regulaarne", label: "hooldus" },
              { value: "Professionaalne", label: "tehnika" },
              { value: "Esinduslik", label: "territoorium" },
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
                Muru niitmine
                <br />
                <span className="text-[#3abeff]">Tallinnas</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Regulaarne muru niitmine, trimmerdamine ja territooriumi hooldus ärihoonete ümbruses. Esinduslik väliala algab korralikult hooldatud murust.
              </p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <Link href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi muru niitmise pakkumist
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
                Regulaarne hooldus <span className="text-white/40 mx-2">|</span> Professionaalne tehnika <span className="text-white/40 mx-2">|</span> Paindlik ajakava <span className="text-white/40 mx-2">|</span> Kvaliteetne tulemus <span className="text-white/40 mx-2">|</span> Garantii
              </div>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</Link>
                <span className="text-white/50">/</span>
                <Link href="/remonditeenused-tallinnas" className="text-white/80 no-underline hover:text-white transition-colors">Remonditeenused</Link>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Muru niitmine</span>
              </nav>
            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Korralik muru on teie ettevõtte visiitkaart" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Teie hoone ees olev muru on esimene asi, mida kliendid ja külastajad näevad. Hooldamata, võsastunud muru jätab hooletu mulje. See mõjutab teie ettevõtte mainet rohkem, kui võite arvata.</p>
                  <p className="mt-4">Lisaks esteetikale on regulaarne niitmine oluline muru tervisele. Liiga pikaks kasvanud muru nõrgeneb, umbrohi levib ja muru hakkab hõrenema. Kord nädalas niidetud muru on tihe, tugev ja roheline.</p>
                </div>
                <div>
                  <p>SPS Grupp pakub professionaalset muru niitmise teenust ärihoonetele Tallinnas. Tuleme kohale kokkulepitud ajal ja teeme töö ära. Teie ei pea mõtlema muruniiduki, kütuse ega aja peale.</p>
                  <p className="mt-4">Pakume nii ühekordseid niitmisi kui ka regulaarseid hoolduslepinguid. Hoolduslepinguga saate soodsama hinna ja garanteeritud teenuse kogu hooaja vältel.</p>
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
                <TwoToneHeading text="Milliseid muru niitmise teenuseid pakume?" />
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
                <TwoToneHeading text="Miks valida SPS Grupp muru niitjaks?" />
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
                    src="/muruniitmin-2.jpg"
                    alt="SPS Grupp muru niitmine Tallinna ärihoone juures"
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
                <TwoToneHeading text="Muru niitmise hinnad" />
              </div>

              <div className="max-w-[900px] mx-auto">
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-6 font-light">
                  Hind sõltub muru suurusest, kasvuoludest ja teenuse sagedusest.
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
                  Regulaarse hoolduslepinguga saate soodsama hinna ja garanteeritud teenuse.
                </p>
                <Link href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi muru niitmise pakkumist
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
            title="Esinduslik väliala algab korralikult hooldatud murust"
            description="Telli regulaarne muru niitmine ja hooldus. Tuleme kohale, hindame ala ja pakume sobiva lahenduse."
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
