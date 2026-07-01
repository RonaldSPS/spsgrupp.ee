import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fassaadipesu Tallinnas | SPS Grupp",
  description:
    "Professionaalne fassaadipesu Tallinnas. Krohv-, klinker-, kivi- ja klaasfassaadide pesu. Kõrgtööd, survepesu, öko-vahendid. Küsi pakkumist!",
  keywords:
    "fassaadipesu, fassaadipesu tallinnas, fassaadi pesu, kõrgtööd, survepesu, hoone fassaad, fassaadi puhastus",
  openGraph: {
    title: "Fassaadipesu Tallinnas | SPS Grupp",
    description:
      "Professionaalne fassaadipesu Tallinnas. Krohv-, klinker-, kivi- ja klaasfassaadide pesu. Küsige pakkumist.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/valikoristus/fassaadipesu",
  },
}

export default function FassaadipesuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
