import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/kontori-koristus",
  locale: "et",
  title: "Kontori koristus Tallinnas | SPS Grupp",
  description:
    "Regulaarne kontorikoristus v\u00e4hemalt 800 m\u00b2 b\u00fcroodele Tallinnas ja Harjumaal, alates 1,20 \u20ac/m\u00b2 kuus. Paindlik graafik, koolitatud personal, ISO 9001 ja ISO 14001.",
  imagePath: "/kontorikoristus1.jpg",
});

export default function KontoriKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
