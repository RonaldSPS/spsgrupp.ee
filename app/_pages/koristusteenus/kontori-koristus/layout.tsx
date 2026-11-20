import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/kontori-koristus",
  locale: "et",
  title: "Kontori koristus Tallinnas 2026 — alates 1,20 €/m², tasuta hindamine 24h | SPS Grupp",
  description:
    "Kontori koristus Tallinnas ja Harjumaal — regulaarne koristus igas suuruses büroodele. Hind alates 1,20 €/m² kuus. Tasuta hindamine 24 tunni jooksul, pakkumine 1 tööpäevaga. 50+ kontorit, ISO 9001.",
  imagePath: "/kontorikoristus1.jpg",
});

export default function KontoriKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
