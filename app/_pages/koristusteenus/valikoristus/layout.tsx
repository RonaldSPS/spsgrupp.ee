import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus",
  locale: "et",
  title: "Välikoristus Tallinnas | SPS Grupp",
  description: "Välikoristus ja territooriumi hooldus Tallinnas: fassaadipesu, aknapesu, grafiti eemaldamine ning lepingupõhine lumekoristus. Küsi pakkumist!",
  imagePath: "/Valikoristus-1.jpg",
});

export default function ValikoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
