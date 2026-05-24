import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Välikoristus Tallinnas | SPS Grupp",
  description: "Välikoristus ja territooriumi hooldus Tallinnas: fassaadipesu, aknad, graffiti, 24/7 lumekoristus. Küsi pakkumist!",
  keywords: "välikoristus, territooriumi hooldus, välikoristus tallinnas, hoone välispuhastus, välispindade hooldus",
  openGraph: {
    title: "Välikoristus Tallinnas | SPS Grupp",
    description: "Välikoristus ja territooriumi hooldus Tallinnas: fassaadipesu, aknad, graffiti, 24/7 lumekoristus. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/valikoristus",
  },
};

export default function ValikoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
