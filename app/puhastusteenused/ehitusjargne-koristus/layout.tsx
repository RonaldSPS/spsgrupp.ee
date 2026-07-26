import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ehitusjärgne koristus Tallinnas | SPS Grupp",
  description:
    "Ehitusjärgne koristus Tallinnas. Hind ja tööde algusaeg sõltuvad objekti suurusest, seisukorrast ning meeskonna saadavusest. Küsi pakkumist!",
  keywords:
    "ehitusjärgne koristus, ehitusjärgne puhastus, ehituskoristus, ehitusjärgne koristus tallinnas, ehituse järgne koristus",
  openGraph: {
    title: "Ehitusjärgne koristus Tallinnas | SPS Grupp",
    description:
      "Ehitusjärgne koristus Tallinnas. Hind ja tööde algusaeg sõltuvad objekti suurusest, seisukorrast ning meeskonna saadavusest. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/puhastusteenused/ehitusjargne-koristus",
  },
};

export default function EhitusjargneKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
