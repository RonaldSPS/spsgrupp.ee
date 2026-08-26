import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/hoolduskoristus",
  locale: "et",
  title: "Hoolduskoristus Tallinnas — äripindade regulaarne koristus | SPS Grupp",
  description:
    "Lepingueline hoolduskoristus kontoritele, kaubandus- ja tootmispindadele Tallinnas ja Harjumaal, 1–7 korda nädalas, alates 1,20 €/m² kuus. Kindel personal, ISO 9001. Tasuta ülevaatus!",
  imagePath: "/Koristusteenused-HERO.jpg",
});

export default function HoolduskoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
