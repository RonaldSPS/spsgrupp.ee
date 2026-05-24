import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graffiti eemaldamine Tallinnas | SPS Grupp",
  description:
    "Graffiti kiire eemaldamine Tallinnas. 24h reageerimine, kõik pinnatüübid, anti-graffiti kaitsekate. Alates 150€. Küsi pakkumist!",
  keywords:
    "graffiti eemaldamine, grafiti eemaldus, grafiti mahavõtmine, graffiti puhastus, anti-graffiti kate, grafiti eemaldamine tallinnas",
  openGraph: {
    title: "Graffiti eemaldamine Tallinnas | SPS Grupp",
    description:
      "Graffiti kiire eemaldamine Tallinnas. 24h reageerimine, kõik pinnatüübid, anti-graffiti kaitsekate. Alates 150€. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
};

export default function GrafitiEemaldamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
