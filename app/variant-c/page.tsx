"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "#teenused", label: "Teenused" },
  { href: "#kliendid", label: "Tule tööle" },
  { href: "#garantii", label: "SPS Grupp" },
  { href: "#kkk", label: "Kontakt" },
];

// Dark Premium Navbar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0a1628]/95 backdrop-blur-xl border-b border-[#17345a]/30" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#17345a] to-[#85cbe9] rounded-xl flex items-center justify-center shadow-lg shadow-[#85cbe9]/30">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-white">SPS Grupp</span>
        </div>
        <ul className="hidden md:flex items-center gap-2 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-white/70 no-underline text-sm font-medium px-4 py-2 rounded-lg hover:text-white hover:bg-white/5 transition-all">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="#pakkumine" className="bg-gradient-to-r from-[#17345a] to-[#85cbe9] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-[#85cbe9]/30 transition-all">
              Küsi pakkumist
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Dark Premium Hero
const Hero = () => (
  <section id="avaleht" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f1f33] to-[#17345a]">
    {/* Glow effects */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#17345a]/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#85cbe9]/20 rounded-full blur-[120px]"></div>
    </div>
    
    <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
      <div>
        <div className="inline-flex items-center gap-2 bg-[#17345a]/50 backdrop-blur-lg rounded-full px-5 py-2.5 mb-6 border border-[#85cbe9]/30">
          <span className="w-2 h-2 bg-[#85cbe9] rounded-full animate-pulse shadow-lg shadow-[#85cbe9]"></span>
          <span className="text-sm text-white/90 font-medium">Premium koristusteenus</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          <span className="text-white">Puhtus</span><br />
          <span className="bg-gradient-to-r from-[#85cbe9] to-[#5ab5da] bg-clip-text text-transparent">uuel tasemel</span>
        </h1>
        <p className="text-xl text-white/70 leading-relaxed mb-8 max-w-lg">
          Hooldame <strong className="text-white font-semibold">500 000m²</strong> äripindu. 
          ISO sertifitseeritud premium kvaliteet.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link href="#pakkumine" className="bg-gradient-to-r from-[#17345a] to-[#85cbe9] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-2xl hover:shadow-[#85cbe9]/40 transition-all hover:-translate-y-1">
            Küsi pakkumist
          </Link>
          <Link href="tel:6623328" className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all backdrop-blur-lg">
            662 3328
          </Link>
        </div>
      </div>
      
      <div className="relative">
        <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <Image src="/FrontHeroCar.jpg" alt="Koristusfirma SPS Grupp" fill className="object-cover" style={{ color: "#2d3748" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent"></div>
        </div>
        
        {/* Floating premium cards */}
        <div className="absolute -top-8 -right-8 bg-[#0f1f33]/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-[#85cbe9]/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#17345a] to-[#85cbe9] rounded-xl flex items-center justify-center shadow-lg shadow-[#85cbe9]/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">500k m²</div>
              <div className="text-sm text-white/50">kuus</div>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-8 -left-8 bg-[#0f1f33]/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-[#85cbe9]/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#85cbe9] to-[#5ab5da] rounded-xl flex items-center justify-center shadow-lg shadow-[#85cbe9]/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">ISO</div>
              <div className="text-sm text-white/50">9001 + 14001</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Dark Logos
const Logos = () => (
  <section id="kliendid" className="py-20 bg-[#0a1628] border-y border-[#17345a]/30">
    <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
      <p className="text-sm text-white/50 uppercase tracking-wider">Premium partnerid</p>
    </div>
    <div className="overflow-hidden">
      <div className="flex gap-20 opacity-40">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex-shrink-0 text-2xl font-bold text-white/50">PARTNER {i + 1}</div>
        ))}
      </div>
    </div>
  </section>
);

// Dark Services
const Services = () => {
  const services = [
    { title: "Regulaarne koristus", desc: "Premium igapäevane hooldus teie äripindadele", icon: "🏢" },
    { title: "Puhastusteenused", desc: "Süvapuhastus ja eritööd kõrgeimal tasemel", icon: "✨" },
    { title: "Välikoristus", desc: "Fassaad, aknad ja territoorium aastaringselt", icon: "🌿" },
  ];

  return (
    <section id="teenused" className="py-32 bg-[#0a1628] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[#85cbe9] text-sm font-semibold uppercase tracking-wider mb-4 inline-block">Teenused</span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Premium lahendused</h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">Täisteenus kõrgeima kvaliteedistandardiga.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#17345a] to-[#85cbe9] rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-[#0f1f33] p-10 rounded-2xl border border-[#17345a]/50 shadow-xl hover:border-[#85cbe9]/50 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-[#17345a] to-[#85cbe9] rounded-xl flex items-center justify-center mb-6 text-3xl shadow-lg shadow-[#85cbe9]/20">{s.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/60 leading-relaxed mb-6">{s.desc}</p>
                <Link href="#pakkumine" className="inline-flex items-center gap-2 text-[#85cbe9] font-semibold hover:text-white transition-colors">
                  Loe lähemalt <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Dark Testimonials
const Testimonials = () => (
  <section id="kliendid-arvustused" className="py-32 bg-[#0f1f33]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <span className="text-[#85cbe9] text-sm font-semibold uppercase tracking-wider mb-4 inline-block">Tagasiside</span>
        <h2 className="text-5xl md:text-6xl font-bold text-white">Kliendi sõnad</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { quote: "SPS on premium partner, kes tagab alati laitmatu puhtuse.", author: "Teledyne Flir", role: "Tallinn" },
          { quote: "Kõrgeim kvaliteet ja professionaalne lähenemine. Soovitame!", author: "AS Norma", role: "Tootmine" },
          { quote: "Usaldusväärne teenus juba üle 5 aasta. Premium kvaliteet.", author: "Nordic Hotels", role: "Hotellindus" },
        ].map((t, i) => (
          <div key={i} className="bg-[#0a1628] p-8 rounded-2xl border border-[#17345a]/50 hover:border-[#85cbe9]/50 transition-all">
            <div className="flex gap-1 mb-6 text-[#f59e0b] text-lg">★★★★★</div>
            <p className="text-white/80 leading-relaxed mb-8 italic">"{t.quote}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#17345a] to-[#85cbe9] flex items-center justify-center text-white font-bold">{t.author[0]}</div>
              <div>
                <div className="font-semibold text-white">{t.author}</div>
                <div className="text-sm text-white/50">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Dark Industries
const Industries = () => {
  const industries = [
    { name: "Kontorid", count: "500+" },
    { name: "Kaubandus", count: "15+" },
    { name: "Tootmine", count: "100k m²" },
    { name: "Hotellid", count: "50+" },
    { name: "Tervishoid", count: "20+" },
    { name: "Haridus", count: "30+" },
  ];
  
  return (
    <section id="valdkonnad" className="py-32 bg-[#0a1628]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[#85cbe9] text-sm font-semibold uppercase tracking-wider mb-4 inline-block">Valdkonnad</span>
          <h2 className="text-5xl md:text-6xl font-bold text-white">Teenindame</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((ind, i) => (
            <div key={i} className="bg-[#0f1f33] p-8 rounded-2xl border border-[#17345a]/50 text-center hover:border-[#85cbe9]/50 transition-all">
              <div className="text-4xl mb-4">🏢</div>
              <div className="text-2xl font-bold text-[#85cbe9] mb-2">{ind.count}</div>
              <div className="text-white/70 font-medium">{ind.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Dark Trust
const Trust = () => (
  <section id="garantii" className="py-32 bg-[#0f1f33]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-[#85cbe9] text-sm font-semibold uppercase tracking-wider mb-4 inline-block">Miks meie?</span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Premium kvaliteet</h2>
          <p className="text-xl text-white/60 leading-relaxed mb-10">
            SPS Grupp on pakkunud puhastusteenuseid Eesti ettevõtetele üle 20 aasta. 
            Premium teenus, sertifitseeritud kvaliteet.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { num: "500k", label: "m² kuus" },
              { num: "200+", label: "Töötajat" },
              { num: "500+", label: "Klienti" },
              { num: "20+", label: "Aastat" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0a1628] p-6 rounded-2xl border border-[#17345a]/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#85cbe9] to-[#5ab5da] bg-clip-text text-transparent">{stat.num}</div>
                <div className="text-white/50 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <div className="relative bg-gradient-to-br from-[#17345a] to-[#0f1f33] p-10 rounded-2xl border border-[#85cbe9]/30 shadow-2xl">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#85cbe9] to-[#5ab5da] rounded-2xl flex items-center justify-center shadow-lg shadow-[#85cbe9]/30">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">ISO 9001 + 14001</div>
                <div className="text-white/50">Sertifitseeritud</div>
              </div>
            </div>
            <div className="space-y-4">
              {["Kvaliteedi garantii", "Kindlustatud teenused", "24/7 tugi"].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-[#0a1628]/50 p-4 rounded-xl border border-[#17345a]/50">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#85cbe9" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
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

// Dark Contact Form
const ContactForm = () => (
  <section id="pakkumine" className="py-32 bg-[#0a1628]">
    <div className="max-w-2xl mx-auto px-6">
      <div className="text-center mb-12">
        <span className="text-[#85cbe9] text-sm font-semibold uppercase tracking-wider mb-4 inline-block">Pakkumine</span>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">Küsi pakkumist</h2>
        <p className="text-xl text-white/60">Vastame 24 tunni jooksul</p>
      </div>
      
      <form className="bg-[#0f1f33] p-10 rounded-2xl border border-[#17345a]/50 shadow-2xl" onSubmit={(e) => e.preventDefault()}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <input type="text" placeholder="Nimi" className="px-5 py-4 bg-[#0a1628] border border-[#17345a]/50 rounded-xl outline-none focus:border-[#85cbe9] transition-all text-white placeholder-white/30" />
          <input type="email" placeholder="E-mail" className="px-5 py-4 bg-[#0a1628] border border-[#17345a]/50 rounded-xl outline-none focus:border-[#85cbe9] transition-all text-white placeholder-white/30" />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <input type="tel" placeholder="Telefon" className="px-5 py-4 bg-[#0a1628] border border-[#17345a]/50 rounded-xl outline-none focus:border-[#85cbe9] transition-all text-white placeholder-white/30" />
          <input type="text" placeholder="Ettevõte" className="px-5 py-4 bg-[#0a1628] border border-[#17345a]/50 rounded-xl outline-none focus:border-[#85cbe9] transition-all text-white placeholder-white/30" />
        </div>
        <textarea placeholder="Lisainfo" rows={4} className="w-full px-5 py-4 bg-[#0a1628] border border-[#17345a]/50 rounded-xl outline-none focus:border-[#85cbe9] transition-all text-white placeholder-white/30 resize-none mb-6" />
        <button type="submit" className="w-full bg-gradient-to-r from-[#17345a] to-[#85cbe9] text-white py-5 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#85cbe9]/30 transition-all">
          Saada päring
        </button>
      </form>
    </div>
  </section>
);

// Dark FAQ
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: "Kui sageli peaks äriruume koristama?", a: "Enamikule ettevõtetele soovitame koristust 3–5 korda nädalas." },
    { q: "Kuidas kujuneb koristuse hind?", a: "Hind sõltub ruumide suurusest, koristuse sagedusest ja eritööde vajadusest." },
    { q: "Kas saate koristada töövälisel ajal?", a: "Jah, enamik töid toimub enne 8:00, pärast 18:00 või nädalavahetustel." },
  ];

  return (
    <section id="kkk" className="py-32 bg-[#0f1f33]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#85cbe9] text-sm font-semibold uppercase tracking-wider mb-4 inline-block">KKK</span>
          <h2 className="text-5xl md:text-6xl font-bold text-white">Küsimused</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#0a1628] rounded-xl overflow-hidden border border-[#17345a]/50">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-[#17345a]/20 transition-colors">
                <span className="text-lg font-semibold text-white">{faq.q}</span>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#17345a] to-[#85cbe9] flex items-center justify-center transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
              </button>
              {openIndex === i && (
                <div className="px-8 pb-6 text-white/60 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Dark Footer
const Footer = () => (
  <footer className="bg-[#050d1a] text-white py-20 border-t border-[#17345a]/30">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#17345a] to-[#85cbe9] rounded-xl flex items-center justify-center shadow-lg shadow-[#85cbe9]/30">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold">SPS Grupp</span>
          </div>
          <p className="text-white/50 leading-relaxed">Premium koristusteenus ärikliendile.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-6">Teenused</h4>
          <ul className="space-y-3 text-white/50">
            <li><Link href="#" className="hover:text-[#85cbe9] transition-colors">Kontori koristus</Link></li>
            <li><Link href="#" className="hover:text-[#85cbe9] transition-colors">Kaubanduspinnad</Link></li>
            <li><Link href="#" className="hover:text-[#85cbe9] transition-colors">Tootmishooned</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-6">Ettevõte</h4>
          <ul className="space-y-3 text-white/50">
            <li><Link href="#" className="hover:text-[#85cbe9] transition-colors">Meist</Link></li>
            <li><Link href="#" className="hover:text-[#85cbe9] transition-colors">Tule tööle</Link></li>
            <li><Link href="#" className="hover:text-[#85cbe9] transition-colors">Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-6">Kontakt</h4>
          <ul className="space-y-3 text-white/50">
            <li>Mustamäe tee 46, Tallinn</li>
            <li><a href="tel:6623328" className="hover:text-[#85cbe9] transition-colors">+372 662 3328</a></li>
            <li><a href="mailto:info@spsgrupp.ee" className="hover:text-[#85cbe9] transition-colors">info@spsgrupp.ee</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#17345a]/30 pt-8 text-center text-white/30">
        © {new Date().getFullYear()} SPS Grupp. Kõik õigused kaitstud.
      </div>
    </div>
  </footer>
);

export default function VariantC() {
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
