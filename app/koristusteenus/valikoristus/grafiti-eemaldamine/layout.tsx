import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graffiti eemaldamine Tallinnas | SPS Grupp",
  description:
    "Graffiti eemaldamine Tallinnas eri pindadelt ja kaitsekatete paigaldus. Reageerimisaeg sõltub asukohast, töömahust ja meeskonna saadavusest. Küsi pakkumist!",
  keywords:
    "graffiti eemaldamine, grafiti eemaldus, grafiti mahavõtmine, graffiti puhastus, anti-graffiti kate, grafiti eemaldamine tallinnas",
  openGraph: {
    title: "Graffiti eemaldamine Tallinnas | SPS Grupp",
    description:
      "Graffiti eemaldamine Tallinnas eri pindadelt ja kaitsekatete paigaldus. Reageerimisaeg sõltub asukohast, töömahust ja meeskonna saadavusest. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/valikoristus/grafiti-eemaldamine",
  },
};

export default function GrafitiEemaldamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
