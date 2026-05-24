import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lehtede koristus Tallinnas | SPS Grupp",
  description:
    "Lehtede koristus ja äravedu Tallinnas. Sügisene lehtede kogumine, puhastus, haljastusjäätmete käitlus. Küsi pakkumist!",
  keywords:
    "lehtede koristus, lehtede äravedu, sügisene koristus, lehtede kogumine, haljastusjäätmed, lehtede koristus tallinnas",
  openGraph: {
    title: "Lehtede koristus Tallinnas | SPS Grupp",
    description:
      "Lehtede koristus ja äravedu Tallinnas. Sügisene lehtede kogumine, puhastus, haljastusjäätmete käitlus. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/remonditeenused-tallinnas/lehtedekoristamine",
  },
};

export default function LehtedekoristamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
