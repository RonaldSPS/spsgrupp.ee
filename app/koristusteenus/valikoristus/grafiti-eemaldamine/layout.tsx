import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/grafiti-eemaldamine",
  locale: "et",
  title: "Grafiti eemaldamine Tallinnas | SPS Grupp",
  description:
    "Grafiti eemaldamine Tallinnas eri pindadelt ja kaitsekatete paigaldus. Reageerimisaeg sõltub asukohast, töömahust ja meeskonna saadavusest. Küsi pakkumist!",
  imagePath: "/graffiti-eemaldamine-1.jpg",
});

export default function GrafitiEemaldamineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
