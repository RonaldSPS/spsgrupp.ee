"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Simplified Navbar for Variant A
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Image src="/SPS_LOGO.svg" alt="SPS Grupp" width={38} height={38} style={{ color: "#2d3748" }} />
        <div className="hidden md:flex items-center gap-8">
          <Link href="#teenused" className="text-[#17345a] text-sm font-medium hover:text-[#5ab5da] transition-colors">Teenused</Link>
          <Link href="#kliendid" className="text-[#17345a] text-sm font-medium hover:text-[#5ab5da] transition-colors">Tule tööle</Link>
          <Link href="#garantii" className="text-[#17345a] text-sm font-medium hover:text-[#5ab5da] transition-colors">SPS Grupp</Link>
          <Link href="#kkk" className="text-[#17345a] text-sm font-medium hover:text-[#5ab5da] transition-colors">Kontakt</Link>
          <Link href="tel:6623328" className="text-[#17345a] font-medium flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            662 3328
          </Link>
          <Link href="#pakkumine" className="bg-[#17345a] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1e4a7a] transition-colors">Küsi pakkumist</Link>
        </div>
      </div>
    </nav>
  );
};

// Minimalist Hero
const Hero = () => (
  <section id="avaleht" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1">
        <span className="inline-block text-[#5ab5da] text-xs font-semibold tracking-wider uppercase mb-4">Koristusteenused ärikliendile</span>
        <h1 className="text-5xl md:text-6xl font-light text-[#17345a] leading-tight mb-6">
          Puhtus, millele<br />
          <span className="font-semibold">saate kindel olla</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
          Hooldame igakuiselt üle <strong className="text-[#17345a] font-medium">500 000m²</strong> kontori-, kaubandus- ja tootmispinda Harjumaal. ISO sertifitseeritud kvaliteet.
        </p>
        <div className="flex gap-3">
          <Link href="#pakkumine" className="bg-[#17345a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1e4a7a] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#17345a]/20">Küsi pakkumist</Link>
          <Link href="tel:6623328" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-[#17345a] hover:text-[#17345a] transition-colors">662 3328</Link>
        </div>
      </div>
      <div className="order-1 md:order-2 relative">
        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
          <Image src="/FrontHeroCar.jpg" alt="Koristusfirma SPS Grupp" fill className="object-cover" style={{ color: "#2d3748" }} />
        </div>
        {/* Floating stats card */}
        <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#17345a] rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#17345a]">20+</div>
              <div className="text-sm text-gray-500">aastat kogemust</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Minimalist Logos
const Logos = () => (
  <section id="kliendid" className="py-16 bg-white border-y border-gray-100">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-center text-sm text-gray-400 uppercase tracking-wider mb-8">Usaldavad meid</p>
      <div className="overflow-hidden">
        <div className="flex gap-16 animate-scroll">
          {["Ericsson", "Maxima", "MyFitness", "Nordic Hotels", "Taltech", "Eften", "Elering", "Hobby Hall"].map((logo, i) => (
            <div key={i} className="flex-shrink-0 text-2xl font-semibold text-gray-300">{logo}</div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Minimalist Services
const Services = () => {
  const services = [
    { title: "Regulaarne koristus", desc: "Igapäevane hooldus teie äripindadele", icon: "🏢" },
    { title: "Puhastusteenused", desc: "Süvapuhastus ja eritööd", icon: "✨" },
    { title: "Välikoristus", desc: "Fassaad, aknad ja territoorium", icon: "🌿" },
  ];

  return (
    <section id="teenused" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#5ab5da] text-xs font-semibold uppercase tracking-wider">Meie teenused</span>
          <h2 className="text-4xl font-light text-[#17345a] mt-3 mb-4">Lahendused igale vajadusele</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Pakume täisteenust alates igapäevasest koristusest kuni keerukate eritöödeni.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="group p-8 rounded-2xl border border-gray-100 hover:border-[#17345a]/20 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-semibold text-[#17345a] mb-2">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              <Link href="#pakkumine" className="inline-flex items-center gap-2 mt-4 text-[#5ab5da] font-medium hover:text-[#17345a] transition-colors">
                Loe lähemalt <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Minimalist Testimonials
const Testimonials = () => (
  <section id="kliendid-arvustused" className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="text-[#5ab5da] text-xs font-semibold uppercase tracking-wider">Tagasiside</span>
        <h2 className="text-4xl font-light text-[#17345a] mt-3">Mida kliendid räägivad</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { quote: "SPS on usaldusväärne partner, kes tagab meie kontoritele alati puhtuse.", author: "Teledyne Flir" },
          { quote: "Professionaalne teenus ja suurepärane kommunikatsioon. Soovitame!", author: "AS Norma" },
          { quote: "Paindlik ja kvaliteetne koristusteenus juba üle 5 aasta.", author: "Nordic Hotels" },
        ].map((t, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-1 mb-4 text-[#f59e0b]">★★★★★</div>
            <p className="text-gray-700 leading-relaxed mb-6 italic">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eef7fc] flex items-center justify-center text-[#17345a] font-semibold">{t.author[0]}</div>
              <div className="text-sm font-medium text-[#17345a]">{t.author}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Minimalist Industries
const Industries = () => {
  const industries = ["Kontorid", "Kaubandus", "Tootmine", "Hotellid", "Tervishoid", "Haridus"];
  return (
    <section id="valdkonnad" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#5ab5da] text-xs font-semibold uppercase tracking-wider">Valdkonnad</span>
          <h2 className="text-4xl font-light text-[#17345a] mt-3">Teenindame erinevaid sektoreid</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {industries.map((ind, i) => (
            <div key={i} className="p-6 rounded-xl border border-gray-100 text-center hover:border-[#17345a] hover:shadow-lg transition-all cursor-default">
              <div className="text-3xl mb-2">🏢</div>
              <div className="text-sm font-medium text-[#17345a]">{ind}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Minimalist Trust
const Trust = () => (
  <section id="garantii" className="py-24 bg-gradient-to-br from-[#17345a] to-[#0f1f33] text-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-[#85cbe9] text-xs font-semibold uppercase tracking-wider">Miks meie?</span>
          <h2 className="text-4xl font-light mt-3 mb-6">Usaldavad 500+ ettevõtet</h2>
          <p className="text-white/80 leading-relaxed mb-8">
            SPS Grupp on pakkunud puhastusteenuseid Eesti ettevõtetele üle 20 aasta. 
            Igakuiselt hooldame üle poole miljoni ruutmeetri äripindu.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "500k", label: "m² kuus" },
              { num: "200+", label: "Töötajat" },
              { num: "500+", label: "Klienti" },
              { num: "20+", label: "Aastat" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="text-2xl font-bold text-[#85cbe9]">{stat.num}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#85cbe9] rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              </div>
              <div>
                <div className="font-semibold">ISO 9001 + ISO 14001</div>
                <div className="text-sm text-white/60">Sertifitseeritud kvaliteet</div>
              </div>
            </div>
            <div className="space-y-3">
              {["Kvaliteedi garantii", "Kindlustatud teenused", "24/7 tugi"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#85cbe9" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Minimalist Contact Form
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", message: "" });

  return (
    <section id="pakkumine" className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[#5ab5da] text-xs font-semibold uppercase tracking-wider">Pakkumine</span>
          <h2 className="text-4xl font-light text-[#17345a] mt-3 mb-4">Küsi tasuta pakkumist</h2>
          <p className="text-gray-600">Vastame 24 tunni jooksul</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nimi" className="px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#17345a] transition-colors" />
            <input type="email" placeholder="E-mail" className="px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#17345a] transition-colors" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="tel" placeholder="Telefon" className="px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#17345a] transition-colors" />
            <input type="text" placeholder="Ettevõte" className="px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#17345a] transition-colors" />
          </div>
          <textarea placeholder="Lisainfo" rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#17345a] transition-colors resize-none" />
          <button type="submit" className="w-full bg-[#17345a] text-white py-4 rounded-lg font-medium hover:bg-[#1e4a7a] transition-colors shadow-lg shadow-[#17345a]/20">Saada päring</button>
        </form>
      </div>
    </section>
  );
};

// Minimalist FAQ
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: "Kui sageli peaks äriruume koristama?", a: "Enamikule ettevõtetele soovitame koristust 3–5 korda nädalas." },
    { q: "Kuidas kujuneb koristuse hind?", a: "Hind sõltub ruumide suurusest, koristuse sagedusest ja eritööde vajadusest." },
    { q: "Kas saate koristada töövälisel ajal?", a: "Jah, enamik töid toimub enne 8:00, pärast 18:00 või nädalavahetustel." },
  ];

  return (
    <section id="kkk" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[#5ab5da] text-xs font-semibold uppercase tracking-wider">KKK</span>
          <h2 className="text-4xl font-light text-[#17345a] mt-3">Korduma kippuvad küsimused</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                <span className="font-medium text-[#17345a]">{faq.q}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2" className={`transition-transform ${openIndex === i ? "rotate-45" : ""}`}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Minimalist Footer
const Footer = () => (
  <footer className="bg-[#0f1f33] text-white py-16">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div>
          <Image src="/SPS_LOGO.svg" alt="SPS Grupp" width={38} height={38} className="mb-4" style={{ color: "#2d3748" }} />
          <p className="text-white/60 text-sm leading-relaxed">Professionaalne koristusteenus ärikliendile.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Teenused</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="#" className="hover:text-white transition-colors">Kontori koristus</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Kaubanduspinnad</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Tootmishooned</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Ettevõte</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="#" className="hover:text-white transition-colors">Meist</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Tule tööle</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Kontakt</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Mustamäe tee 46, Tallinn</li>
            <li><a href="tel:6623328" className="hover:text-white transition-colors">662 3328</a></li>
            <li><a href="mailto:info@spsgrupp.ee" className="hover:text-white transition-colors">info@spsgrupp.ee</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
        © {new Date().getFullYear()} SPS Grupp. Kõik õigused kaitstud.
      </div>
    </div>
  </footer>
);

export default function VariantA() {
  return (
    <div className="font-sans antialiased">
      <Navbar />
      <Hero />
      <Logos />
      <Services />
      <Testimonials />
      <Industries />
      <Trust />
      <ContactForm />
      <FAQ />
      <Footer />
    </div>
  );
}
