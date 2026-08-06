import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine",
  locale: "et",
  title: "Suitsu- ja tulekahjustuste puhastamine | SPS Grupp",
  description:
    "Suitsu- ja tulekahjustuste puhastamine Tallinnas: tahma, jääkide ja lõhna eemaldamine. Reageerimisaeg sõltub asukohast, töömahust ja meeskonna saadavusest. Küsi pakkumist!",
  imagePath: "/tulekahjustus1.jpg",
});

export default function SuitsuJaTulekahjustustePuhastamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
