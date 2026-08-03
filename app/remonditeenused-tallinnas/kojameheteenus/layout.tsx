import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/kojameheteenus",
  locale: "et",
  title: "Kojameheteenus — remont ja hooldus | SPS Grupp",
  description:
    "Kojameheteenus ärikinnisvarale Tallinnas. Territooriumi hooldus, väiksemad remonditööd, prügikastid, lumekoristus. Küsi pakkumist!",
  imagePath: "/kojameheteenus-1.jpg",
});

export default function KojameheteenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
