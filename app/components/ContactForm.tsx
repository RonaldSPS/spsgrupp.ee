"use client"

import { useActionState, useEffect, useRef } from "react"
import TwoToneHeading from "./TwoToneHeading"
import { submitContactForm } from "@/lib/actions"

const initialState = { success: false, error: undefined as string | undefined, fields: undefined as Record<string, string> | undefined }

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset()
    }
  }, [state.success])

  return (
    <section className="form-section py-[100px] bg-[#eceef1]" id="pakkumine">
      <div className="max-w-[800px] mx-auto px-[5%]">
        <div className="form-card">
          <div className="section-tag mx-auto w-fit">Küsi pakkumist</div>
          <TwoToneHeading text="Aitame leida optimaalse lahenduse teie koristusvajadustele" className="mb-6 text-center" />
          <p className="text-[15px] text-[#5a6474] mb-6 font-light text-center">
            Täitke vorm ja meie spetsialist võtab teiega ühendust 24 tunni jooksul.
          </p>

          <form ref={formRef} action={formAction}>
            <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }} aria-hidden="true">
              <label htmlFor="contact-website_url">Website</label>
              <input type="text" id="contact-website_url" name="website_url" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
              <div className="flex flex-col gap-1.25">
                <label htmlFor="form-name" className="text-[15px] font-medium text-[#17345a]">Nimi *</label>
                <input
                  id="form-name"
                  name="name"
                  type="text"
                  required
                  maxLength={200}
                  defaultValue={state.fields?.name ?? ""}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder="Teie nimi"
                />
              </div>
              <div className="flex flex-col gap-1.25">
                <label htmlFor="form-email" className="text-[15px] font-medium text-[#17345a]">E-mail *</label>
                <input
                  id="form-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  defaultValue={state.fields?.email ?? ""}
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
                  name="phone"
                  type="tel"
                  required
                  maxLength={30}
                  defaultValue={state.fields?.phone ?? ""}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder="+372 5xxx xxx"
                />
              </div>
              <div className="flex flex-col gap-1.25">
                <label htmlFor="form-company" className="text-[15px] font-medium text-[#17345a]">Ettevõte</label>
                <input
                  id="form-company"
                  name="company"
                  type="text"
                  maxLength={200}
                  defaultValue={state.fields?.company ?? ""}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder="Ettevõte OÜ"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <label htmlFor="form-message" className="text-[15px] font-medium text-[#17345a]">Lisainfo</label>
              <textarea
                id="form-message"
                name="message"
                maxLength={5000}
                defaultValue={state.fields?.message ?? ""}
                className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)] resize-y min-h-[90px]"
                placeholder="Ruume ruutmeetrites, erisoovitused..."
              />
            </div>

            <div className="mb-3.5">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacy_consent"
                  required
                  className="w-4 h-4 mt-0.5 accent-[#17345a] shrink-0"
                />
                <span className="text-[15px] text-[#5a6474]">
                  Olen tutvunud{" "}
                  <a href="/privaatsus" target="_blank" rel="noopener noreferrer" className="text-[#17345a] font-medium underline hover:text-[#3abeff]">
                    andmekaitsetingimustega
                  </a>{" "}
                  ja nõustun oma andmete töötlemisega päringule vastamise eesmärgil. *
                </span>
              </label>
            </div>

            <div aria-live="polite" aria-atomic="true">
              {state?.error && (
                <p className="text-[15px] text-red-600 mb-3.5 font-medium" role="alert">
                  {state.error}
                </p>
              )}
              {state?.success && (
                <p className="text-[15px] text-[#2d9e6b] mb-3.5 font-medium" role="status">
                  Täname! Teie päring on saadetud. Võtame ühendust 24 tunni jooksul.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#17345a] text-white py-3.5 border-none rounded-[10px] text-[15px] font-medium cursor-pointer transition-all hover:bg-[#1e4a7a] hover:-translate-y-0.5 mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ boxShadow: "0 8px 30px rgba(23,52,90,0.10)" }}
            >
              <span className="relative z-10">{pending ? "Saadan..." : "Saada päring"}</span>
            </button>

            <p className="text-center text-[15px] text-[#5a6474] mt-3 flex items-center justify-center gap-1.5 font-light">
              Andmed edastatakse krüpteeritult. Vastame üldjuhul 24 tunni jooksul.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
