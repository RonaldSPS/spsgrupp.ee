import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/lehtedekoristamine",
  locale: "et",
  title: "Lehtede koristamine Tallinnas | SPS Grupp",
  description:
    "Lehtede koristamine ärikinnistutel, korteriühistutes ja välialadel. Lehtede kogumine, kõnniteede puhastus ja haljastusjäätmete äravedu.",
  imagePath: "/lehekoristus-1.webp",
});

export default function LehtedeKoristamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
