import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koolide koristamine Tallinnas | SPS Grupp",
  description: "Koolide ja lasteaedade koristamine Tallinnas. Tervishoiukeskne lähenemine, lastele ohutud puhastusvahendid. Küsi pakkumist!",
  keywords: "koolide koristamine, koolide puhastus, kooli koristus, lasteaia koristus, haridusasutuste koristamine, koolikoristus",
  openGraph: {
    title: "Koolide koristamine Tallinnas | SPS Grupp",
    description: "Koolide ja lasteaedade koristamine Tallinnas. Tervishoiukeskne lähenemine, lastele ohutud puhastusvahendid.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/koolide-koristamine",
  },
};

export default function KoolideKoristamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
