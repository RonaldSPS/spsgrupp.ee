import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus",
  locale: "et",
  title: "Koristusteenused Tallinnas 2026 — alates 1,20 €/m² kuus | SPS Grupp",
  description:
    "Koristusteenused kontoritele, kaubandus- ja tootmispindadele Tallinnas ja Harjumaal, alates 1,20 €/m² kuus. Tasuta ülevaatus - vastus 1 tööpäevaga. 300+ töötajat, ISO 9001.",
  imagePath: "/Koristusteenused-HERO.jpg",
});

export default function KoristusteenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
