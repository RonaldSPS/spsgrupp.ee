import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/hoolduskoristus",
  locale: "et",
  title: "Hoolduskoristus Tallinnas - alates 1,20 €/m² kuus | SPS Grupp",
  description:
    "Lepingueline hoolduskoristus kontoritele, kaubandus- ja tootmispindadele Tallinnas ja Harjumaal. Tasuta objekti ülevaatus, pakkumine 1 tööpäevaga. ISO 9001.",
  imagePath: "/images/kruiisiterminal/terminal-tables-wide-1920x1080.webp",
});

export default function HoolduskoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
