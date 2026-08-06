import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus",
  locale: "et",
  title: "Koristusteenus Tallinnas | SPS Grupp",
  description:
    "Regulaarne koristusteenus kontoritele, kaubanduspindadele ja tootmishoonetele Tallinnas. ISO 9001, paindlik graafik. Küsi tasuta pakkumist!",
  imagePath: "/Koristusteenused-HERO.jpg",
});

export default function KoristusteenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
