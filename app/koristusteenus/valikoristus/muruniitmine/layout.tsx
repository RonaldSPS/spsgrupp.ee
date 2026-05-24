import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Muruniitmine Tallinnas ja Harjumaal | SPS Grupp",
  description:
    "Muruniitmine ärikinnistutele, korteriühistutele ja haljasaladele. Regulaarne hooldus, trimmerdamine ja hooajaline graafik. Küsi pakkumist!",
  keywords:
    "muruniitmine, muru niitmine, muruniitmine tallinnas, haljasalade hooldus, muru hooldus, välialade hooldus",
  openGraph: {
    title: "Muruniitmine Tallinnas ja Harjumaal | SPS Grupp",
    description:
      "Regulaarne muruniitmine ja haljasalade hooldus ärikinnistutele ning korteriühistutele.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/valikoristus/muruniitmine",
  },
};

export default function MuruniitmineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
