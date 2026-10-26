import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/kaubanduspindade-koristus",
  locale: "et",
  title: "Kaubanduspindade koristus Tallinnas - alates 1,20 €/m² | SPS Grupp",
  description:
    "Poodide ja kaubanduskeskuste regulaarne koristus Tallinnas ja Harjumaal - igas suuruses, alates 1,20 €/m² kuus. Tasuta ülevaatus, pakkumine 1 tööpäevaga.",
  imagePath: "/images/kruiisiterminal/terminal-swingo-atrium-1920x1080.webp",
});

export default function KaubanduspindadeKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
