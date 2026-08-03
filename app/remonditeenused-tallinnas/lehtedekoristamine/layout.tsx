import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/lehtedekoristamine",
  locale: "et",
  title: "Lehtede koristus Tallinnas | SPS Grupp",
  description:
    "Lehtede koristus ja äravedu Tallinnas. Sügisene lehtede kogumine, puhastus, haljastusjäätmete käitlus. Küsi pakkumist!",
  imagePath: "/lehekoristus-1.webp",
});

export default function LehtedekoristamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
