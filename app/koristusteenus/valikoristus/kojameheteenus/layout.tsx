import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kojamehe teenus Tallinnas | SPS Grupp",
  description:
    "Kojamehe teenus ärikinnistutele ja korteriühistutele. Sissepääsude, kõnniteede, prügialade ja hooneümbruse regulaarne korrashoid.",
  keywords:
    "kojamehe teenus, kojamees, kinnistu hooldus, väliala korrashoid, kojamehe teenus tallinnas",
  openGraph: {
    title: "Kojamehe teenus Tallinnas | SPS Grupp",
    description:
      "Regulaarne kojamehe teenus kinnistu igapäevaseks ja hooajaliseks korrashoiuks.",
    type: "website",
    locale: "et_EE",
  },
};

export default function KojameheTeenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
