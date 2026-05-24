import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Võta ühendust SPS Gruppiga | SPS Grupp",
  description:
    "Võtke ühendust SPS Grupiga — professionaalne koristus- ja remonditeenuste partner Tallinnas ja Harjumaal. Tasuta konsultatsioon, kiire reageerimine ja personaalne hinnapakkumine äriklientidele ja korteriühistutele.",
  keywords:
    "SPS Grupp kontakt, koristusfirma kontakt tallinn, äripindade koristus Tallinn, hoolduspartner Harjumaa, kontorikoristus kontakt",
  openGraph: {
    title: "Võta ühendust SPS Gruppiga | SPS Grupp",
    description:
      "Võtke ühendust SPS Grupiga — professionaalne koristus- ja remonditeenuste partner Tallinnas ja Harjumaal.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/kontakt",
  },
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
