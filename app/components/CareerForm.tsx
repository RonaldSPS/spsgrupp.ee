"use client";

import { useState } from "react";
import TwoToneHeading from "./TwoToneHeading";

export default function CareerForm() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    region: "",
    workload: "",
    workTime: "",
    info: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Career form submitted:", formData);
  };

  return (
    <section className="form-section py-[100px] bg-[#eceef1]" id="pakkumine">
      <div className="max-w-[800px] mx-auto px-[5%]">
        <div className="form-card">
          <div className="section-tag mx-auto w-fit">Karjäär</div>
          <TwoToneHeading text="Registreeru proovipäevale" className="mb-6 text-center" />
          <p className="text-[15px] text-[#5a6474] mb-6 font-light text-center">
            Täida allolev vorm ja me võtame sinuga ühendust proovipäeva kokkuleppimiseks.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
              <div className="flex flex-col gap-1.25">
                <label htmlFor="career-email" className="text-[15px] font-medium text-[#17345a]">E-mail *</label>
                <input
                  id="career-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder="sinu@email.ee"
                />
              </div>
              <div className="flex flex-col gap-1.25">
                <label htmlFor="career-phone" className="text-[15px] font-medium text-[#17345a]">Telefon *</label>
                <input
                  id="career-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder="+372 5xxx xxx"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <label htmlFor="career-region" className="text-[15px] font-medium text-[#17345a]">Vali tööpiirkond</label>
              <select
                id="career-region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
              >
                <option value="">Vali piirkond</option>
                <option value="Tallinn">Tallinn</option>
                <option value="Harjumaa">Harjumaa</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <span className="text-[15px] font-medium text-[#17345a]">Sobiv töökoormus</span>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workload"
                    value="Täistööaeg"
                    checked={formData.workload === "Täistööaeg"}
                    onChange={(e) => setFormData({ ...formData, workload: e.target.value })}
                    className="w-4 h-4 accent-[#17345a]"
                  />
                  <span className="text-[15px] text-[#2f353f]">Täistööaeg</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workload"
                    value="Osaline tööaeg"
                    checked={formData.workload === "Osaline tööaeg"}
                    onChange={(e) => setFormData({ ...formData, workload: e.target.value })}
                    className="w-4 h-4 accent-[#17345a]"
                  />
                  <span className="text-[15px] text-[#2f353f]">Osaline tööaeg</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <span className="text-[15px] font-medium text-[#17345a]">Sobiv tööaeg</span>
              <div className="flex gap-4 flex-wrap">
                {[
                  { value: "Päevane tööaeg (8-17)", label: "Päevane tööaeg (8-17)" },
                  { value: "Õhtune tööaeg (16-00)", label: "Õhtune tööaeg (16-00)" },
                  { value: "Öine tööaeg (22-06)", label: "Öine tööaeg (22-06)" },
                  { value: "Sobivad kõik tööajad", label: "Sobivad kõik tööajad" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="workTime"
                      value={opt.value}
                      checked={formData.workTime === opt.value}
                      onChange={(e) => setFormData({ ...formData, workTime: e.target.value })}
                      className="w-4 h-4 accent-[#17345a]"
                    />
                    <span className="text-[15px] text-[#2f353f]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-1">
              <label htmlFor="career-info" className="text-[15px] font-medium text-[#17345a]">Lisainfo</label>
              <textarea
                id="career-info"
                value={formData.info}
                onChange={(e) => setFormData({ ...formData, info: e.target.value })}
                className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)] resize-y min-h-[90px]"
                placeholder="Täiendav info..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#17345a] text-white py-3.5 border-none rounded-[10px] text-[15px] font-medium cursor-pointer transition-all hover:bg-[#1e4a7a] hover:-translate-y-0.5 mt-1"
              style={{ boxShadow: "0 8px 30px rgba(23,52,90,0.10)" }}
            >
              <span className="relative z-10">Esita avaldus</span>
            </button>

            <p className="text-center text-[15px] text-[#5a6474] mt-3 flex items-center justify-center gap-1.5 font-light">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Teie andmed on turvalised
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgba(23,52,90,0.1)] text-center">
            <p className="text-[15px] text-[#5a6474] font-light">
              Kui soovid saada oma CV failina, saada see aadressile{" "}
              <a href="mailto:personal@spsgrupp.ee" className="text-[#17345a] font-medium no-underline hover:underline">
                personal@spsgrupp.ee
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
