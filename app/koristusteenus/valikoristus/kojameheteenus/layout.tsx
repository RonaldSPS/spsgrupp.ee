import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kojameheteenus — välikoristus | SPS Grupp",
  description:
    "Kojameheteenus ärikinnistutele ja korteriühistutele. Sissepääsude, kõnniteede, prügialade ja hooneümbruse regulaarne korrashoid Tallinnas.",
  keywords:
    "kojamehe teenus, kojamees, kinnistu hooldus, väliala korrashoid, välikoristus tallinnas",
  openGraph: {
    title: "Kojameheteenus — välikoristus | SPS Grupp",
    description:
      "Regulaarne kojameheteenus kinnistu igapäevaseks ja hooajaliseks korrashoiuks Tallinnas.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/valikoristus/kojameheteenus",
  },
};

export default function KojameheTeenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
