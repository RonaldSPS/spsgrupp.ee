import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lehtede koristamine Tallinnas | SPS Grupp",
  description:
    "Lehtede koristamine ärikinnistutel, korteriühistutes ja välialadel. Lehtede kogumine, kõnniteede puhastus ja haljastusjäätmete äravedu.",
  keywords:
    "lehtede koristamine, lehekoristus, lehtede koristus tallinnas, sügisene koristus, haljastusjäätmete äravedu",
  openGraph: {
    title: "Lehtede koristamine Tallinnas | SPS Grupp",
    description:
      "Sügisene lehekoristus, lehtede kogumine ja vajadusel haljastusjäätmete äravedu.",
    type: "website",
    locale: "et_EE",
  },
};

export default function LehtedeKoristamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
