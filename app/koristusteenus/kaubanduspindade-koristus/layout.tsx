import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/kaubanduspindade-koristus",
  locale: "et",
  title: "Kaubanduspindade koristus Tallinnas | SPS Grupp",
  description:
    "Kaubanduspindade koristus ja hooldus Tallinnas: päevakoristus, töövälisel ajal tehtav süvapuhastus ja regulaarne kvaliteedikontroll. Küsi pakkumist!",
  imagePath: "/kaubanduspindade-koristus.jpg",
});

export default function KaubanduspindadeKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
