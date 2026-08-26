import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/kontori-koristus",
  locale: "et",
  title: "Kontori koristus Tallinnas — alates 1,20 €/m² | SPS Grupp",
  description:
    "Regulaarne kontorikoristus büroodele alates 800 m² Tallinnas ja Harjumaal. 50+ kontori usaldab SPS Gruppi. Tasuta audit, koolitatud personal, ISO 9001. Vastus 1 tööpäevaga!",
  imagePath: "/kontorikoristus1.jpg",
});

export default function KontoriKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
