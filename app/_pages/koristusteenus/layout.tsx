import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus",
  locale: "et",
  title: "Koristusteenused Tallinnas - kontorid, kaubandus, tootmine | SPS Grupp",
  description:
    "Kontorite, kaubandus- ja tootmispindade regulaarne koristus Tallinnas ja Harjumaal, alates 1,20 €/m² kuus. Tasuta ülevaatus - vastus 1 tööpäevaga. 300+ töötajat.",
  imagePath: "/Koristusteenused-HERO.jpg",
});

export default function KoristusteenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
