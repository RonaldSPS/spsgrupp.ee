"use client"

import Link from "next/link";
import { useTranslations } from "next-intl";
import TwoToneHeading from "./TwoToneHeading";

export default function Services() {
  const t = useTranslations("services")

  return (
    <section className="services-section py-[100px] bg-white" id="teenused">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="mb-12 max-w-[800px] mx-auto">
          <TwoToneHeading text={t("heading")} />
          <div className="text-[16px] text-[#333a46] leading-[1.8]">
            <p className="mb-4">
              <Link href="/koristusteenus" className="text-[#17345a] underline hover:text-[#5ab5da]">Koristusteenuse</Link> {t("para1").split(" ").slice(1).join(" ")}
            </p>
            <p className="mb-4">
              {t("para2")}
            </p>
            <p className="mb-4">
              {t("para3")}
            </p>
            <p>
              {t("para4")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
