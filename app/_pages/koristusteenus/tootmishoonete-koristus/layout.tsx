import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/tootmishoonete-koristus",
  locale: "et",
  title: "Tootmishoonete koristus Tallinnas - alates 1,20 €/m² | SPS Grupp",
  description: "Tootmis- ja laopindade regulaarne koristus igas suuruses objektidele. Ohutusnõudeid arvestav meeskond, ISO 9001. Tasuta ülevaatus - pakkumine 1 tööpäevaga.",
  imagePath: "/tootmishoonete-koristus.webp",
});

export default function TootmishooneteKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
