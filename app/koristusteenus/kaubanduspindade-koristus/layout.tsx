import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kaubanduspindade koristus Tallinnas | SPS Grupp",
  description:
    "Kaubanduspindade koristus ja hooldus Tallinnas, päevakoristus, öine süvapuhastus, 24/7 valmisolek. Küsi tasuta pakkumist!",
  keywords:
    "kaubanduspindade koristus, kaubanduskeskuse puhastus, poe koristus, kauplusepindade hooldus, kaubanduspinna koristusteenus",
  openGraph: {
    title: "Kaubanduspindade koristus Tallinnas | SPS Grupp",
    description:
      "Kaubanduspindade koristus ja hooldus Tallinnas, päevakoristus, öine süvapuhastus, 24/7 valmisolek. Küsi tasuta pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/kaubanduspindade-koristus",
  },
};

export default function KaubanduspindadeKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
