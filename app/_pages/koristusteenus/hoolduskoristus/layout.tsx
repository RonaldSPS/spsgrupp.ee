import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/hoolduskoristus",
  locale: "et",
  title: "Hoolduskoristus Tallinnas 2026 — alates 1,20 €/m², tasuta hindamine 24h | SPS Grupp",
  description:
    "Hoolduskoristus kontoritele, kaubandus- ja tootmispindadele Tallinnas ja Harjumaal. Lepinguline koristus alates 1,20 €/m² kuus. Kindel meeskond, objektijuht, ISO 9001. Tasuta hindamine 24 tunni jooksul.",
  imagePath: "/images/kruiisiterminal/terminal-tables-wide-1920x1080.webp",
});

export default function HoolduskoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
