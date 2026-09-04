import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus",
  locale: "et",
  title: "Koristusteenused Tallinnas - kontorid, kaubandus, tootmine | SPS Grupp",
  description:
    "Koristusfirma äriklientidele: kontorite, kaubandus- ja tootmispindade regulaarne koristus Tallinnas ja Harjumaal. 300+ töötajat, ISO 9001/14001. Tasuta ülevaatus - vastus 1 tööpäevaga!",
  imagePath: "/Koristusteenused-HERO.jpg",
});

export default function KoristusteenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
