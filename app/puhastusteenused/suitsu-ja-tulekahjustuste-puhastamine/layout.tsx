import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suitsu- ja tulekahjustuste puhastamine | SPS Grupp",
  description:
    "Suitsu- ja tulekahjustuste puhastamine Tallinnas: tahma, jääkide ja lõhna eemaldamine. Reageerimisaeg sõltub asukohast, töömahust ja meeskonna saadavusest. Küsi pakkumist!",
  keywords:
    "suitsukahjustuste puhastamine, tulekahjustuste puhastus, tulekahju koristus, suitsu eemaldamine, tahmaeemaldus, tulekahju järgne koristus",
  openGraph: {
    title: "Suitsu- ja tulekahjustuste puhastamine | SPS Grupp",
    description:
"Suitsu- ja tulekahjustuste puhastamine Tallinnas: tahma, jääkide ja lõhna eemaldamine. Reageerimisaeg sõltub asukohast, töömahust ja meeskonna saadavusest. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine",
  },
};

export default function SuitsuJaTulekahjustustePuhastamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
