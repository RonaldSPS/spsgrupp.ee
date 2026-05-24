import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ehitusjärgne koristus Tallinnas | SPS Grupp",
  description:
    "Ehitusjärgne koristus Tallinnas alates 250€. 24–48h reageerimine, objekt valmis üleandmiseks. Küsi pakkumist!",
  keywords:
    "ehitusjärgne koristus, ehitusjärgne puhastus, ehituskoristus, ehitusjärgne koristus tallinnas, ehituse järgne koristus",
  openGraph: {
    title: "Ehitusjärgne koristus Tallinnas | SPS Grupp",
    description:
      "Ehitusjärgne koristus Tallinnas alates 250€. 24–48h reageerimine, objekt valmis üleandmiseks. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
};

export default function EhitusjargneKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
