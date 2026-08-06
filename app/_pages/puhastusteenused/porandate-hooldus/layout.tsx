import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused/porandate-hooldus",
  locale: "et",
  title: "Põrandate hooldus Tallinnas | SPS Grupp",
  description:
    "Põrandate hooldus ja süvapuhastus Tallinnas. PVC, parkett, betoon, kivi, keraamika. Vahatamine ja poleerimine. Küsi pakkumist!",
  imagePath: "/porandate-hooldus-1.webp",
});

export default function PorandateHooldusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
