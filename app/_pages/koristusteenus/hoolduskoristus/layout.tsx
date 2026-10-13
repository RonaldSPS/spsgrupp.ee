import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/hoolduskoristus",
  locale: "et",
  title: "Hoolduskoristus Tallinnas - äripindade regulaarne koristus | SPS Grupp",
  description:
    "Lepingueline hoolduskoristus kontoritele, kaubandus- ja tootmispindadele Tallinnas ja Harjumaal, alates 1,20 €/m² kuus. Kindel personal, ISO 9001.",
  imagePath: "/images/kruiisiterminal/terminal-tables-wide-1920x1080.webp",
});

export default function HoolduskoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
