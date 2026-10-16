import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/kontori-koristus",
  locale: "et",
  title: "Kontori koristus Tallinnas - alates 1,20 €/m² kuus | SPS Grupp",
  description:
    "Regulaarne kontorikoristus büroodele alates 800 m² Tallinnas ja Harjumaal. Tasuta ülevaatus, pakkumine 1 tööpäevaga. 50+ kontorit, ISO 9001.",
  imagePath: "/kontorikoristus1.jpg",
});

export default function KontoriKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
