"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import TwoToneHeading from "./TwoToneHeading";

export default function Trust() {
  const t = useTranslations("trust")

  return (
    <section className="trust-section py-[100px] bg-white" id="garantii">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <TwoToneHeading text={t("heading")} />
            <p className="text-[16px] text-[#2f353f] leading-[1.8] mb-7 font-light">
              {t("description")}
            </p>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="trust-badge-card hover:-translate-y-0.5">
                <div className="w-[46px] h-[46px] bg-[#17345a] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="w-[22px] h-[22px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">{t("highlight1Title")}</div>
                  <div className="text-[15px] text-[#5a6474]">ISO 9001 + ISO 14001</div>
                </div>
              </div>
              <div className="trust-badge-card hover:-translate-y-0.5">
                <div className="w-[46px] h-[46px] bg-[#17345a] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="w-[22px] h-[22px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">20+ aastat</div>
                  <div className="text-[15px] text-[#5a6474]">Kogemust</div>
                </div>
              </div>
              <div className="trust-badge-card hover:-translate-y-0.5">
                <div className="w-[46px] h-[46px] bg-[#17345a] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="w-[22px] h-[22px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">200+ töötajat</div>
                  <div className="text-[15px] text-[#5a6474]">Koolitatud</div>
                </div>
              </div>
              <div className="trust-badge-card hover:-translate-y-0.5">
                <div className="w-[46px] h-[46px] bg-[#17345a] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="w-[22px] h-[22px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">Üle miljoni m²</div>
                  <div className="text-[15px] text-[#5a6474]">Igapäevaselt hooldatavat pinda</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="rounded-[20px] overflow-hidden shadow-lg"
              style={{ height: "460px" }}
            >
              <Image
                src="/9001-14001-ENG.webp"
                alt="Koristusfirma SPS Grupp ISO 9001 ja ISO 14001 sertifikaadid"
                width={640}
                height={460}
                className="w-full h-auto"
                style={{ }}
              />
            </div>

            <div
              className="absolute -bottom-6 left-0 right-0 md:-left-6 md:right-6 bg-white rounded-4xl p-4 md:p-6 flex flex-col sm:flex-row gap-3 md:gap-4 shadow-md border border-[rgba(23,52,90,0.06)]"
              style={{ boxShadow: "0 8px 30px rgba(23,52,90,0.10)" }}
            >
              <div className="flex items-center gap-2.5 bg-[#eef7fc] border border-[rgba(133,203,233,0.25)] rounded-[10px] px-3.5 py-2.5 flex-1 md:min-w-[140px]">
                <div className="w-9 h-9 bg-[#17345a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="w-[18px] h-[18px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a]">{t("highlight2Title")}</div>
                </div>
              </div>
              {t("highlight2Cta") && (
                <div className="flex items-center gap-2.5 bg-[#eef7fc] border border-[rgba(133,203,233,0.25)] rounded-[10px] px-3.5 py-2.5 flex-1 md:min-w-[140px]">
                  <div className="w-9 h-9 bg-[#17345a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="w-[18px] h-[18px] text-white">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#17345a]">{t("highlight2Cta")}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mb-14 mt-20">
          <div className="section-tag">{t("sectionTag")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src="/regulaarnekoristusteenus.jpg"
                alt="Koristusfirma — regulaarne koristusteenus"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ }}
              />
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">Regulaarne koristusteenus</h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              Igapäevane ja perioodiline hooldus, mis hoiab teie tööruumid pidevalt puhtad ja esinduslikud.
            </p>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">Kõik vahendid ja tarvikud on hinna sees.</p>
            <a href="/koristusteenus" className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              Vaata lähemalt <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src="/puhastusteenused2.jpg"
                alt="Koristusfirma — puhastusteenused ja eritööd"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ }}
              />
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">Puhastusteenused ja eritööd</h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              Perioodilised ja spetsiifilised tööd, mis taastavad pindade seisukorra ja pikendavad nende eluiga.
            </p>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">Kiirreageerimine 24/7 ootamatute olukordade jaoks.</p>
            <a href="/puhastusteenused" className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              Vaata lähemalt <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src="/valikoristus.jpg"
                alt="Koristusfirma — välikoristus ja territooriumi hooldus"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ }}
              />
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">Välikoristus ja territooriumi hooldus</h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              Hooldame teie hoone ümbrust aastaringselt, igal hooajal oma plaaniga.
            </p>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">Üks leping, mis katab kõik hooajad ja vajadused.</p>
            <a href="/koristusteenus/valikoristus" className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              Vaata lähemalt <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
