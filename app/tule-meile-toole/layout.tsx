import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tule tööle SPS Gruppi | Liitu meie meeskonnaga",
  description:
    "Liitu SPS Grupi meeskonnaga! Otsime koristajaid Tallinnas ja Harjumaal. Pakume väljaõpet, täiendkoolitusi ja õigeaegset töötasu. Varasem kogemus pole oluline.",
  keywords:
    "töökoristajana, koristaja töö, tööpakkumised Tallinn, koristaja töökuulutus, SPS Grupp töö, koristusfirma töö, töökoht Tallinn",
  openGraph: {
    title: "Tule tööle SPS Gruppi | Liitu meie meeskonnaga",
    description:
      "Liitu SPS Grupi meeskonnaga! Otsime koristajaid Tallinnas ja Harjumaal. Varasem kogemus pole oluline.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/tule-meile-toole",
  },
};

export default function TuleMeileTooleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
