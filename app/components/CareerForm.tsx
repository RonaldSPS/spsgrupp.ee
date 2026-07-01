"use client"

import { useActionState, useEffect, useRef } from "react"
import TwoToneHeading from "./TwoToneHeading"
import { submitCareerForm } from "@/lib/actions"

const initialState = { success: false, error: undefined as string | undefined, fields: undefined as Record<string, string> | undefined }

const timeOptions = [
  { value: "Päevane tööaeg (8-17)", label: "Päevane tööaeg (8-17)" },
  { value: "Õhtune tööaeg (16-00)", label: "Õhtune tööaeg (16-00)" },
  { value: "Öine tööaeg (22-06)", label: "Öine tööaeg (22-06)" },
  { value: "Sobivad kõik tööajad", label: "Sobivad kõik tööajad" },
]

export default function CareerForm() {
  const [state, formAction, pending] = useActionState(submitCareerForm, initialState)
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
          <div className="section-tag mx-auto w-fit">Karjäär</div>
          <TwoToneHeading text="Registreeru proovipäevale" className="mb-6 text-center" />
          <p className="text-[15px] text-[#5a6474] mb-6 font-light text-center">
            Täida allolev vorm ja me võtame sinuga ühendust proovipäeva kokkuleppimiseks.
          </p>

          <form ref={formRef} action={formAction}>
            <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }} aria-hidden="true">
              <label htmlFor="career-website_url">Website</label>
              <input type="text" id="career-website_url" name="website_url" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
              <div className="flex flex-col gap-1.25">
                <label htmlFor="career-email" className="text-[15px] font-medium text-[#17345a]">E-mail *</label>
                <input
                  id="career-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  defaultValue={state.fields?.email ?? ""}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder="sinu@email.ee"
                />
              </div>
              <div className="flex flex-col gap-1.25">
                <label htmlFor="career-phone" className="text-[15px] font-medium text-[#17345a]">Telefon *</label>
                <input
                  id="career-phone"
                  name="phone"
                  type="tel"
                  required
                  maxLength={30}
                  defaultValue={state.fields?.phone ?? ""}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder="+372 5xxx xxx"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <label htmlFor="career-region" className="text-[15px] font-medium text-[#17345a]">Vali tööpiirkond</label>
              <select
                id="career-region"
                name="region"
                defaultValue={state.fields?.region ?? ""}
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
                    defaultChecked={state.fields?.workload === "Täistööaeg" || state.fields === undefined}
                    className="w-4 h-4 accent-[#17345a]"
                  />
                  <span className="text-[15px] text-[#2f353f]">Täistööaeg</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workload"
                    value="Osaline tööaeg"
                    defaultChecked={state.fields?.workload === "Osaline tööaeg"}
                    className="w-4 h-4 accent-[#17345a]"
                  />
                  <span className="text-[15px] text-[#2f353f]">Osaline tööaeg</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <span className="text-[15px] font-medium text-[#17345a]">Sobiv tööaeg</span>
              <div className="flex gap-4 flex-wrap">
                {timeOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="work_time"
                      value={opt.value}
                      defaultChecked={state.fields?.workTime === opt.value}
                      className="w-4 h-4 accent-[#17345a]"
                    />
                    <span className="text-[15px] text-[#2f353f]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <label htmlFor="career-info" className="text-[15px] font-medium text-[#17345a]">Lisainfo</label>
              <textarea
                id="career-info"
                name="info"
                maxLength={5000}
                defaultValue={state.fields?.info ?? ""}
                className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)] resize-y min-h-[90px]"
                placeholder="Täiendav info..."
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
                  Täname! Teie avaldus on saadetud. Võtame teiega ühendust esimesel võimalusel.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#17345a] text-white py-3.5 border-none rounded-[10px] text-[15px] font-medium cursor-pointer transition-all hover:bg-[#1e4a7a] hover:-translate-y-0.5 mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ boxShadow: "0 8px 30px rgba(23,52,90,0.10)" }}
            >
              <span className="relative z-10">{pending ? "Saadan..." : "Esita avaldus"}</span>
            </button>

            <p className="text-center text-[15px] text-[#5a6474] mt-3 flex items-center justify-center gap-1.5 font-light">
              Andmed edastatakse krüpteeritult. Vastame esimesel võimalusel.
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgba(23,52,90,0.1)] text-center">
            <p className="text-[15px] text-[#5a6474] font-light">
              Kui soovid saata oma CV failina, saada see aadressile{" "}
              <a href="mailto:personal@spsgrupp.ee" className="text-[#17345a] font-medium no-underline hover:underline">
                personal@spsgrupp.ee
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
