import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused",
  locale: "et",
  title: "Puhastusteenused Tallinnas 2026 - alates 1 €/m² | SPS Grupp",
  description:
    "Suurpuhastus, põrandate süvapesu ja ehitusjärgne koristus äriklientidele Tallinnas ja Harjumaal. Tasuta hindamine - pakkumine 1 tööpäevaga! 300+ töötajat, ISO 9001.",
  imagePath: "/puhastusteenused1.jpg",
});

export default function PuhastusteenusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
