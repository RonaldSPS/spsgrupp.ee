import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/kontori-koristus",
  locale: "et",
  title: "Kontori koristus Tallinnas 2026 — tasuta hindamine 24h | SPS Grupp",
  description:
    "Regulaarne kontorikoristus igas suuruses büroodele Tallinnas ja Harjumaal. Säästa aega ja kulusid — tasuta hindamine 24 tunni jooksul, pakkumine 1 tööpäevaga. 50+ kontorit, ISO 9001.",
  imagePath: "/kontorikoristus1.jpg",
});

export default function KontoriKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
