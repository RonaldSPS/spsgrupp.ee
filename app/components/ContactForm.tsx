"use client";

import { useState } from "react";
import TwoToneHeading from "./TwoToneHeading";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section className="form-section py-[100px] bg-[#eceef1]" id="pakkumine">
      <div className="max-w-[800px] mx-auto px-[5%]">
        {/* Center - Form */}
        <div className="form-card">
            <div className="section-tag mx-auto w-fit">Küsi pakkumist</div>
            <TwoToneHeading text="Aitame leida optimaalse lahenduse teie koristusvajadustele" className="mb-6 text-center" />
            <p className="text-[15px] text-[#5a6474] mb-6 font-light text-center">
              Täitke vorm ja meie spetsialist võtab teiega ühendust 24 tunni jooksul.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
                <div className="flex flex-col gap-1.25">
                  <label htmlFor="form-name" className="text-[15px] font-medium text-[#17345a]">Nimi *</label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                    placeholder="Teie nimi"
                  />
                </div>
                <div className="flex flex-col gap-1.25">
                  <label htmlFor="form-email" className="text-[15px] font-medium text-[#17345a]">E-mail *</label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                    placeholder="email@ettevõte.ee"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
                <div className="flex flex-col gap-1.25">
                  <label htmlFor="form-phone" className="text-[15px] font-medium text-[#17345a]">Telefon *</label>
                  <input
                    id="form-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                    placeholder="+372 5xxx xxx"
                  />
                </div>
                <div className="flex flex-col gap-1.25">
                  <label htmlFor="form-company" className="text-[15px] font-medium text-[#17345a]">Ettevõte</label>
                  <input
                    id="form-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                    placeholder="Ettevõte OÜ"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.25 mb-1">
                <label htmlFor="form-message" className="text-[15px] font-medium text-[#17345a]">Lisainfo</label>
                <textarea
                  id="form-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)] resize-y min-h-[90px]"
                  placeholder="Ruume ruutmeetrites, erisoovitused..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#17345a] text-white py-3.5 border-none rounded-[10px] text-[15px] font-medium cursor-pointer transition-all hover:bg-[#1e4a7a] hover:-translate-y-0.5 mt-1"
                style={{ boxShadow: "0 8px 30px rgba(23,52,90,0.10)" }}
              >
                <span className="relative z-10">Saada päring</span>
              </button>

              <p className="text-center text-[15px] text-[#5a6474] mt-3 flex items-center justify-center gap-1.5 font-light">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Teie andmed on turvalised
              </p>
            </form>
          </div>
      </div>
    </section>
  );
}