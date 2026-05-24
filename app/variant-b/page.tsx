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

// Modern Gradient Navbar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-2xl" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#17345a] via-[#5ab5da] to-[#2d9e6b] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#17345a] to-[#5ab5da] bg-clip-text text-transparent">SPS Grupp</span>
        </div>
        <ul className="hidden md:flex items-center gap-2 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-[#17345a] no-underline text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#17345a]/5 transition-all">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="#pakkumine" className="bg-gradient-to-r from-[#17345a] to-[#2d9e6b] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-xl hover:shadow-[#17345a]/30 transition-all hover:-translate-y-0.5">
              Küsi pakkumist
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Dynamic Hero with gradient
const Hero = () => (
  <section id="avaleht" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#17345a] via-[#1e4a7a] to-[#2d9e6b]"></div>
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#5ab5da] rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#2d9e6b] rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
    </div>
    
    <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
      <div className="text-white">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full px-5 py-2.5 mb-6 border border-white/20">
          <span className="w-2 h-2 bg-[#5ab5da] rounded-full animate-ping"></span>
          <span className="text-sm font-medium">20+ aastat kogemust</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Puhtus,<br />
          <span className="bg-gradient-to-r from-[#5ab5da] to-[#2d9e6b] bg-clip-text text-transparent">mis inspireerib</span>
        </h1>
        <p className="text-xl text-white/80 leading-relaxed mb-8 max-w-lg">
          Hooldame <strong className="text-white font-semibold">500 000m²</strong> äripindu. 
          Innovatiivne lähenemine, sertifitseeritud kvaliteet.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link href="#pakkumine" className="bg-white text-[#17345a] px-8 py-4 rounded-full font-bold hover:shadow-2xl hover:shadow-white/30 transition-all hover:-translate-y-1">
            Küsi pakkumist →
          </Link>
          <Link href="tel:6623328" className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all backdrop-blur-lg">
            662 3328
          </Link>
        </div>
      </div>
      
      <div className="relative">
        <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
          <Image src="/FrontHeroCar.jpg" alt="Koristusfirma SPS Grupp" fill className="object-cover" style={{ color: "#2d3748" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17345a]/80 via-transparent to-transparent"></div>
        </div>
        
        {/* Floating cards */}
        <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 animate-bounce" style={{ animationDuration: "3s" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#5ab5da] to-[#2d9e6b] rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#17345a]">500k m²</div>
              <div className="text-sm text-gray-500">kuus</div>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#17345a] to-[#5ab5da] rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#17345a]">ISO</div>
              <div className="text-sm text-gray-500">9001 + 14001</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Modern Logos with scroll
const Logos = () => (
  <section id="kliendid" className="py-20 bg-gradient-to-r from-[#f8f9fa] via-white to-[#f0f4f8] overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
      <p className="text-sm font-semibold text-[#17345a] uppercase tracking-wider">Meid usaldavad</p>
    </div>
    <div className="overflow-hidden">
      <div className="flex gap-20 animate-scroll">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex-shrink-0 px-8 py-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-xl font-bold bg-gradient-to-r from-[#17345a] to-[#5ab5da] bg-clip-text text-transparent">Partner {i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Modern Services with 3D cards
const Services = () => {
  const services = [
    { title: "Regulaarne koristus", desc: "Igapäevane hooldus maksimaalse efektiivsusega", icon: "🏢", gradient: "from-[#17345a] to-[#1e4a7a]" },
    { title: "Puhastusteenused", desc: "Süvapuhastus ja eritööd professionaalselt", icon: "✨", gradient: "from-[#5ab5da] to-[#2d9e6b]" },
    { title: "Välikoristus", desc: "Fassaad, aknad ja territoorium aastaringselt", icon: "🌿", gradient: "from-[#2d9e6b] to-[#17345a]" },
  ];

  return (
    <section id="teenused" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#5ab5da]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2d9e6b]/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="inline-block bg-gradient-to-r from-[#17345a] to-[#5ab5da] bg-clip-text text-transparent text-sm font-bold uppercase tracking-wider mb-4">Teenused</span>
          <h2 className="text-5xl md:text-6xl font-bold text-[#17345a] mb-6">Lahendused, mis <span className="bg-gradient-to-r from-[#5ab5da] to-[#2d9e6b] bg-clip-text text-transparent">töötavad</span></h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Täisteenus alates igapäevasest koristusest kuni keerukate eritöödeni.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
              <div className="relative bg-white p-10 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className={`w-20 h-20 bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-lg`}>{s.icon}</div>
                <h3 className="text-2xl font-bold text-[#17345a] mb-3">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{s.desc}</p>
                <Link href="#pakkumine" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-[#17345a] to-[#5ab5da] px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
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

// Modern Testimonials
const Testimonials = () => (
  <section id="kliendid-arvustused" className="py-32 bg-gradient-to-br from-[#17345a] via-[#1e4a7a] to-[#0f1f33] relative overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#5ab5da] rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#2d9e6b] rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <span className="text-[#85cbe9] text-sm font-bold uppercase tracking-wider mb-4 inline-block">Tagasiside</span>
        <h2 className="text-5xl md:text-6xl font-bold text-white">Kliendid räägivad</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { quote: "SPS on partner, kellele saame kindlad olla. Puhtus garanteeritud!", author: "Teledyne Flir", role: "Tallinn" },
          { quote: "Professionaalne meeskond ja suurepärane tulemus. Soovitame!", author: "AS Norma", role: "Tootmine" },
          { quote: "Paindlik ja töökindel teenus juba üle 5 aasta.", author: "Nordic Hotels", role: "Hotellindus" },
        ].map((t, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex gap-1 mb-6 text-[#f59e0b] text-xl">★★★★★</div>
            <p className="text-white/90 leading-relaxed mb-8 text-lg italic">"{t.quote}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5ab5da] to-[#2d9e6b] flex items-center justify-center text-white font-bold text-lg">{t.author[0]}</div>
              <div>
                <div className="font-bold text-white">{t.author}</div>
                <div className="text-sm text-[#85cbe9]">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Modern Industries
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
    <section id="valdkonnad" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[#5ab5da] text-sm font-bold uppercase tracking-wider mb-4 inline-block">Valdkonnad</span>
          <h2 className="text-5xl md:text-6xl font-bold text-[#17345a]">Teenindame edukalt</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((ind, i) => (
            <div key={i} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17345a] to-[#0f1f33] p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5ab5da]/20 to-[#2d9e6b]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-4xl mb-3">🏢</div>
                <div className="text-3xl font-bold text-[#5ab5da] mb-2">{ind.count}</div>
                <div className="text-white font-medium">{ind.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Modern Trust with animated stats
const Trust = () => (
  <section id="garantii" className="py-32 bg-gradient-to-br from-[#f8f9fa] via-white to-[#f0f4f8]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-[#5ab5da] text-sm font-bold uppercase tracking-wider mb-4 inline-block">Miks meie?</span>
          <h2 className="text-5xl md:text-6xl font-bold text-[#17345a] mb-6">Usaldavad sadu ettevõtteid</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-10">
            SPS Grupp on pakkunud puhastusteenuseid Eesti ettevõtetele üle 20 aasta. 
            Meie missioon on muuta teie äripinnad puhtamaks ja tervislikumaks.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { num: "500k", label: "m² kuus", icon: "📊" },
              { num: "200+", label: "Töötajat", icon: "👥" },
              { num: "500+", label: "Klienti", icon: "🏢" },
              { num: "20+", label: "Aastat", icon: "⭐" },
            ].map((stat, i) => (
              <div key={i} className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#17345a] to-[#5ab5da] bg-clip-text text-transparent">{stat.num}</div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <div className="relative bg-gradient-to-br from-[#17345a] to-[#0f1f33] p-10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5ab5da]/20 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5ab5da] to-[#2d9e6b] rounded-2xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">ISO 9001 + 14001</div>
                  <div className="text-white/60">Sertifitseeritud kvaliteet</div>
                </div>
              </div>
              <div className="space-y-4">
                {["Kvaliteedi garantii 100%", "Kindlustatud teenused", "24/7 tugi ja reageerimine"].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-lg p-4 rounded-xl">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Modern Contact Form
const ContactForm = () => (
  <section id="pakkumine" className="py-32 bg-gradient-to-br from-[#17345a] via-[#1e4a7a] to-[#2d9e6b] relative overflow-hidden">
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#5ab5da]/20 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative max-w-2xl mx-auto px-6">
      <div className="text-center mb-12">
        <span className="text-[#85cbe9] text-sm font-bold uppercase tracking-wider mb-4 inline-block">Pakkumine</span>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">Küsi tasuta pakkumist</h2>
        <p className="text-xl text-white/70">Vastame 24 tunni jooksul</p>
      </div>
      
      <form className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl" onSubmit={(e) => e.preventDefault()}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <input type="text" placeholder="Nimi" className="px-5 py-4 bg-white/90 backdrop-blur-lg border border-white/20 rounded-xl outline-none focus:border-[#5ab5da] focus:ring-2 focus:ring-[#5ab5da]/30 transition-all text-[#17345a] font-medium" />
          <input type="email" placeholder="E-mail" className="px-5 py-4 bg-white/90 backdrop-blur-lg border border-white/20 rounded-xl outline-none focus:border-[#5ab5da] focus:ring-2 focus:ring-[#5ab5da]/30 transition-all text-[#17345a] font-medium" />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <input type="tel" placeholder="Telefon" className="px-5 py-4 bg-white/90 backdrop-blur-lg border border-white/20 rounded-xl outline-none focus:border-[#5ab5da] focus:ring-2 focus:ring-[#5ab5da]/30 transition-all text-[#17345a] font-medium" />
          <input type="text" placeholder="Ettevõte" className="px-5 py-4 bg-white/90 backdrop-blur-lg border border-white/20 rounded-xl outline-none focus:border-[#5ab5da] focus:ring-2 focus:ring-[#5ab5da]/30 transition-all text-[#17345a] font-medium" />
        </div>
        <textarea placeholder="Lisainfo" rows={4} className="w-full px-5 py-4 bg-white/90 backdrop-blur-lg border border-white/20 rounded-xl outline-none focus:border-[#5ab5da] focus:ring-2 focus:ring-[#5ab5da]/30 transition-all text-[#17345a] font-medium resize-none mb-6" />
        <button type="submit" className="w-full bg-gradient-to-r from-[#5ab5da] to-[#2d9e6b] text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#5ab5da]/40 transition-all hover:-translate-y-1">
          Saada päring →
        </button>
      </form>
    </div>
  </section>
);

// Modern FAQ
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: "Kui sageli peaks äriruume koristama?", a: "Enamikule ettevõtetele soovitame koristust 3–5 korda nädalas. Täpne sagedus sõltub teie äri spetsiifikast." },
    { q: "Kuidas kujuneb koristuse hind?", a: "Hind sõltub ruumide suurusest, koristuse sagedusest ja eritööde vajadusest. Anname alati läbipaistva pakkumise." },
    { q: "Kas saate koristada töövälisel ajal?", a: "Jah, enamik meie koristustöid toimub enne 8:00, pärast 18:00 või nädalavahetustel." },
  ];

  return (
    <section id="kkk" className="py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#5ab5da] text-sm font-bold uppercase tracking-wider mb-4 inline-block">KKK</span>
          <h2 className="text-5xl md:text-6xl font-bold text-[#17345a]">Korduma kippuvad küsimused</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="group bg-gradient-to-r from-[#f8f9fa] to-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#5ab5da] transition-all">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full px-8 py-6 text-left flex items-center justify-between">
                <span className="text-lg font-bold text-[#17345a] group-hover:text-[#5ab5da] transition-colors">{faq.q}</span>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#17345a] to-[#5ab5da] flex items-center justify-center transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
              </button>
              {openIndex === i && (
                <div className="px-8 pb-6 text-gray-600 leading-relaxed text-lg">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Modern Footer
const Footer = () => (
  <footer className="bg-gradient-to-br from-[#0f1f33] via-[#17345a] to-[#0f1f33] text-white py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#5ab5da] to-[#2d9e6b] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold">SPS Grupp</span>
          </div>
          <p className="text-white/60 leading-relaxed">Professionaalne koristusteenus ärikliendile üle 20 aasta.</p>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-lg">Teenused</h4>
          <ul className="space-y-3 text-white/60">
            <li><Link href="#" className="hover:text-[#5ab5da] transition-colors">Kontori koristus</Link></li>
            <li><Link href="#" className="hover:text-[#5ab5da] transition-colors">Kaubanduspinnad</Link></li>
            <li><Link href="#" className="hover:text-[#5ab5da] transition-colors">Tootmishooned</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-lg">Ettevõte</h4>
          <ul className="space-y-3 text-white/60">
            <li><Link href="#" className="hover:text-[#5ab5da] transition-colors">Meist</Link></li>
            <li><Link href="#" className="hover:text-[#5ab5da] transition-colors">Tule tööle</Link></li>
            <li><Link href="#" className="hover:text-[#5ab5da] transition-colors">Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-lg">Kontakt</h4>
          <ul className="space-y-3 text-white/60">
            <li>Mustamäe tee 46, Tallinn</li>
            <li><a href="tel:6623328" className="hover:text-[#5ab5da] transition-colors">+372 662 3328</a></li>
            <li><a href="mailto:info@spsgrupp.ee" className="hover:text-[#5ab5da] transition-colors">info@spsgrupp.ee</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center text-white/40">
        © {new Date().getFullYear()} SPS Grupp. Kõik õigused kaitstud.
      </div>
    </div>
  </footer>
);

export default function VariantB() {
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
