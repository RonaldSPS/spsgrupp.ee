import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koristusteenus Tallinnas | SPS Grupp",
  description:
    "Regulaarne koristusteenus kontoritele, kaubanduspindadele ja tootmishoonetele Tallinnas. ISO 9001, paindlik graafik. Küsi tasuta pakkumist!",
  keywords:
    "koristusteenus, koristusteenused tallinnas, regulaarne koristus, äripindade koristusteenus, koristusteenused, koristus tallinn",
  openGraph: {
    title: "Koristusteenus Tallinnas | SPS Grupp",
    description:
      "Regulaarne koristusteenus kontoritele, kaubanduspindadele ja tootmishoonetele Tallinnas. ISO 9001, paindlik graafik. Küsi tasuta pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus",
  },
};

export default function KoristusteenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
