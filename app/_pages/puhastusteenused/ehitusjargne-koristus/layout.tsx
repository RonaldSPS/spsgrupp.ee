import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused/ehitusjargne-koristus",
  locale: "et",
  title: "Ehitusjärgne koristus Tallinnas | SPS Grupp",
  description:
    "Ehitusjärgne koristus Tallinnas. Hind ja tööde algusaeg sõltuvad objekti suurusest, seisukorrast ning meeskonna saadavusest. Küsi pakkumist!",
  imagePath: "/ehitusjargne-koristus-1.jpg",
});

export default function EhitusjargneKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
