"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TestimonialCards from "../../components/TestimonialCards";
import FAQ from "../../components/FAQ";
import FooterCTA from "../../components/FooterCTA";
import ContactForm from "../../components/ContactForm";
import Tooprotsess from "../../components/Tooprotsess";
import TwoToneHeading from "../../components/TwoToneHeading";
import ScrollAnimation from "../../components/ScrollAnimation";
import Hinnakalkulaator from "../../components/Hinnakalkulaator";
import MaintenancePriceExamples from "../../components/MaintenancePriceExamples";
import SeoJsonLd from "../../components/SeoJsonLd";

const kontoriKoristusFAQ = [
  { q: "Kui tihti tuleks kontorit koristada?", a: "Enamikule kontoritest soovitame koristust 3–5 korda nädalas. Tiheda liiklusega alad vajavad igapäevast koristust, väiksemad kontorid saavad hakkama 2–3 korraga nädalas." },
  { q: "Kas kontorikoristus toimub tööajal või väljaspool?", a: "Tavaliselt koristame töövälisel ajal — varahommikul enne tööpäeva algust või õhtul pärast tööaega. Soovi korral saame korraldada ka päevase koristuse madala liiklusega aegadel." },
  { q: "Mida kontori koristus sisaldab?", a: "Tolmuimejaga puhastus, pindade pühkimine, prügi väljaviimine, sanitaarruumide puhastus, köögi ja puhkeala koristus. Lisateenustena pakume akende pesu, vaipade süvapuhastust ja desinfitseerimist." },
  { q: "Kas kasutate keskkonnasõbralikke puhastusvahendeid?", a: "Eelistame sertifitseeritud ja väiksema keskkonnamõjuga puhastusvahendeid kõikjal, kus puhastatav pind ja ohutusnõuded seda võimaldavad. Eritööde puhul valitakse vahendid konkreetse ülesande järgi." },
  { q: "Kui kiiresti saab kontorikoristusega alustada?", a: "Tööde algusaeg lepitakse kokku pärast mahu ja meeskonna saadavuse hindamist." },
];

export default function KontoriKoristus() {
  return (
    <>
      <SeoJsonLd
        serviceName="Kontori koristus Tallinnas"
        serviceDescription="Regulaarne kontorikoristus Tallinnas alates 1,20 €/m² kuus. Paindlik graafik, koolitatud personal, ISO 9001 ja ISO 14001."
        serviceUrl="https://spsgrupp.ee/koristusteenus/kontori-koristus"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Koristusteenus", item: "https://spsgrupp.ee/koristusteenus" },
          { position: 3, name: "Kontori koristus", item: "https://spsgrupp.ee/koristusteenus/kontori-koristus" },
        ]}
        faq={kontoriKoristusFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Kontori koristus"
          style={{ background: "url('/kontorikoristus1.jpg') center/cover no-repeat" }}
        >
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[5%] max-w-[45%] flex flex-wrap gap-[20px] z-20 hidden md:flex">
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">50+</div>
                <div className="text-[15px] text-[#1f2937]">kontorit</div>
              </div>
            </div>
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-green w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">ISO 9001</div>
                <div className="text-[15px] text-[#1f2937]">sertifitseeritud</div>
              </div>
            </div>
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-navy w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Kontrollitud</div>
                <div className="text-[15px] text-[#1f2937]">personal</div>
              </div>
            </div>
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
                border: "1px solid rgba(133, 203, 233, 0.2)"
              }}
            >
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] -tracking-[1px] mb-[18px]">
                Kontori koristus<br />
                <span className="text-[#3abeff]">Tallinnas ja Harjumaal</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Regulaarne kontorikoristus alates <strong className="text-white font-medium">1,20 €/m² kuus</strong>.
                Paindlik graafik, koolitatud personal ja regulaarne kvaliteedikontroll.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a
                  href="#pakkumine"
                  onClick={(e) => { e.preventDefault(); document.getElementById('pakkumine')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4 cursor-pointer"
                >
                  Küsi kontori koristuse pakkumist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <Link href="tel:6623328" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  662 3328
                </Link>
              </div>

              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</Link>
                <span className="text-white/50">/</span>
                <a href="/koristusteenus" className="text-white/80 no-underline hover:text-white transition-colors">Koristusteenus</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Kontori koristus</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block - H2 */}
        <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <TwoToneHeading text="Kas teie praegune koristusteenus vastab ettevõtte ootustele?" className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
              <div>
                <strong>Paljud ettevõtted on olukorras, kus koristaja küll käib, aga tulemus ei rahulda.</strong> Tolm koguneb kappide peale, prügikastid on hommikul endiselt täis ja WC-s lõpevad tarvikud kõige ebasobivamal hetkel. Töötajad märkavad ja kliendid samuti.
              </div>
              <div>
                <strong>Kontori puhtus mõjutab töötajate heaolu ja klientide esmamuljet.</strong> Puhas ja hügieeniline töökeskkond aitab toetada töötajate heaolu ja vähendada nakkuste leviku riski.<br /><br />
                <strong>SPS Grupis läbib iga koristaja koolituse just kontorikeskkonna jaoks.</strong> Me teame, kuidas käsitleda IT-tehnikat, tundlikke dokumente ja esinduspindu nii, et te ei pea enam muretsema.
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimation>

        {/* Teenuse sisu - Mida sisaldab kontori koristusteenus */}
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
              <TwoToneHeading text="Mida sisaldab kontori koristusteenus?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { bold: "Põrandate igapäevane puhastus ja hooldus", desc: "kõik põrandatüübid" },
                { bold: "Tööpindade ja mööbli tolmutamine ning desinfitseerimine", desc: "" },
                { bold: "Sanitaarruumide põhjalik puhastus", desc: "tarvikute täiendamine" },
                { bold: "Prügi koristamine", desc: "kogumine, sorteerimine ja uute kilekottide paigaldus" },
                { bold: "Kööginurga ja puhkeruumi hooldus", desc: "tasapinnad, mikrolaineahi, kohvimasin" },
                { bold: "Klaaspindade puhastus", desc: "peeglid, klaasseinad" },
                { bold: "IT-tehnika ümbruse antistaatiline puhastus", desc: "" },
                { bold: "Sissepääsu ja esinduspinna erihooldus", desc: "" },
                { bold: "Sageli puudutatavate pindade desinfitseerimine", desc: "ukselingid, lülitid" },
              ].map((item, i) => (
                <div key={i} className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80">
                  <div className="text-[#5a6474] text-[15px] mb-2">
                    <span className="font-mono inline-block border-b border-[#5a6474] pb-px pr-5">
                      {String(i + 1).padStart(2, '0')}.
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

        {/* Miks meie - H2 */}
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
              <TwoToneHeading text="Miks üle 50 kontori usaldab koristuse SPS Grupile?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Kontorihoolduse kogemus alates 2006. aastast</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Oleme koristanud kõiki kontoritüüpe — väikestest IT-büroodest suurte peakontorite ja ministeeriumideni. Teame, mis töötab ja mis mitte.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Konfidentsiaalsus ja andmekaitse</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Iga töötaja allkirjastab konfidentsiaalsuslepingu. Teie dokumentatsioon ja tehnika on turvalistes kätes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">ISO 9001 kvaliteedijuhtimine</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Objektijuhi korraldatud regulaarne kvaliteedikontroll aitab puudused kiiresti tuvastada ja lahendada.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Öko puhastusvahendid</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Vajadusel valime tundlikule töökeskkonnale sobivad vähese lõhna ja väiksema allergeeniohuga puhastusvahendid.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/kontorikoristus2.jpg"
                  alt="Koristusfirma kontori koristus"
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

        {/* Hind - H2 */}
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
              <TwoToneHeading text="Millest sõltub kontori koristuse hind?" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
              <div>
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                  Kontori koristuse hind kujuneb nelja teguri põhjal: pindala, koristuse sagedus, töötajate arv ja eritööde vajadus.
                </p>

                <MaintenancePriceExamples />
              </div>

              <Hinnakalkulaator />
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
                Klientide tagasiside
              </div>
              <TwoToneHeading text="Mida ütlevad meie kontorikliendid" />
            </div>
            <TestimonialCards testimonials={[
              {
                quote: "Soovin edastada tänusõnad ja kiituse väga hea kontorikoristuse eest. Üldine tagasiside on väga positiivne, kontor on puhas, korras ja hästi hooldatud. On näha, et tööd tehakse hoolikalt ning kvaliteedile pööratakse tähelepanu.",
                shortQuote: "Üldine tagasiside on väga positiivne, kontor on puhas, korras ja hästi hooldatud.",
                author: "Paul", initials: "P", logo: "/arvamused-logod/paul.png",
              },
              {
                quote: "Soovin edastada erakordselt positiivse tagasiside kontorikoristuse kohta. Kontor on puhas, korras ja hooldatud. Tehtud töö kvaliteet on järjepidevalt kõrgel tasemel ning see on leidnud positiivset tähelepanu ka meie töötajate seas.",
                shortQuote: "Kontor on puhas, korras ja hooldatud. Tehtud töö kvaliteet on järjepidevalt kõrgel tasemel.",
                author: "Elis", initials: "E", logo: "/arvamused-logod/elis.png",
              },
              {
                quote: "Soovin jagada positiivset tagasisidet kontori koristuse kohta. Kontoriruumid on olnud puhtad ja korras ning üldine mulje on väga hea. Oleme puhastusteenuse kvaliteedi ja töö tulemusega väga rahul.",
                shortQuote: "Kontoriruumid on olnud puhtad ja korras ning üldine mulje on väga hea.",
                author: "Ingrid", initials: "I", logo: "/arvamused-logod/ingrid.png",
              },
              {
                quote: "Puhas ja korrastatud kontor loob parema töökeskkonna nii töötajatele kui ka külastajatele. SPS Grupp on aidanud meil seda taset järjepidevalt hoida. Teenus on professionaalne, kvaliteetne ja hästi korraldatud.",
                shortQuote: "Puhas ja korrastatud kontor loob parema töökeskkonna. SPS Grupp on aidanud meil seda taset järjepidevalt hoida.",
                author: "Kaiti", initials: "K", logo: "/arvamused-logod/kaiti.png",
              },
              {
                quote: "Suur aitäh koristajale, et ta pani eilsest üritusest jäänud mustad nõud nõudepesumasinasse. Hommikul tuli vastu puhas ja korras kööginurk. Sellised väikesed, kuid väga tähelepanelikud teod jäävad silma ning näitavad hoolivust ja professionaalset suhtumist.",
                shortQuote: "Suur aitäh koristajale — hommikul tuli vastu puhas ja korras kööginurk. Sellised tähelepanelikud teod jäävad silma.",
                author: "Käthlin", initials: "K", logo: "/arvamused-logod/kathlin.png",
              },
            ]} />
          </div>
        </section>
        </ScrollAnimation>

        {/* Tööprotsess */}
        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS kontorikoristuse käivitab?"
          intro="Parem teenus algab enne esimest koristuskorda. SPS kaardistab kõigepealt, kuidas teie kontor päriselt töötab, ja ehitab tööplaani selle põhjal."
          steps={[
            ["Objekti ülevaatus", "Vaatame üle ruumide suuruse, kasutuskoormuse, põrandatüübid, sanitaarruumid, ligipääsu ja tööajad."],
            ["Tööplaani koostamine", "Kirjeldame alad, sageduse, igapäevased ja perioodilised tööd ning vastutava kontaktisiku."],
            ["Meeskonna ettevalmistus", "Määrame objektile sobiva väljaõppega teenindajad, puhastusvahendid ja vajalikud seadmed."],
            ["Teenuse käivitamine", "Alustame kokkulepitud graafiku järgi ja täpsustame esimestel nädalatel töömahtu tegeliku kasutuse põhjal."],
            ["Kvaliteedikontroll", "Objektijuht kontrollib tulemust, kogub tagasisidet ja lahendab puudused enne, kui neist saab korduv probleem."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA - Tellige tasuta kontorikoristuse analüüs */}
        <ScrollAnimation animation="fade-up">
        <FooterCTA 
          title="Tellige tasuta kontorikoristuse analüüs" 
          description="Võtame teiega üldjuhul ühe tööpäeva jooksul ühendust. Pakkumise tähtaeg sõltub töö iseloomust ja objekti ülevaatuse vajadusest."
        />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
        <ContactForm />
        </ScrollAnimation>

        {/* FAQ - KKK at the bottom */}
        <ScrollAnimation animation="fade-up">
        <FAQ items={kontoriKoristusFAQ} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}

