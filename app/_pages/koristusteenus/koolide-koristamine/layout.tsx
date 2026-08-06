import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koolide-koristamine",
  locale: "et",
  title: "Koolide koristamine Tallinnas | SPS Grupp",
  description: "Koolide ja lasteaedade koristamine Tallinnas. Tervishoiukeskne lähenemine, lastele ohutud puhastusvahendid. Küsi pakkumist!",
  imagePath: "/koolide-koristamine4.jpg",
});

export default function KoolideKoristamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
