import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontori koristus Tallinnas | SPS Grupp",
  description: "Regulaarne kontorikoristus Tallinnas alates 1,20 €/m² kuus. Paindlik graafik, koolitatud personal, ISO 9001 ja ISO 14001. Küsi pakkumist!",
  keywords: "kontori koristus, kontorikoristus, büroo koristus, kontori koristusteenus, kontori koristus tallinnas, kontorite koristus",
  openGraph: {
    title: "Kontori koristus Tallinnas | SPS Grupp",
    description: "Regulaarne kontorikoristus Tallinnas alates 1,20 €/m² kuus. Paindlik graafik, koolitatud personal, ISO 9001 ja ISO 14001.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/kontori-koristus",
  },
};

export default function KontoriKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
