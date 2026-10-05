import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused",
  locale: "et",
  title: "Puhastusteenused äriklientidele Tallinnas | SPS Grupp",
  description:
    "Puhastusteenused äriklientidele alates 1 €/m²: põrandate süvapesu, suurpuhastus ja ehitusjärgne koristus Tallinnas ja Harjumaal. Tasuta pakkumine!",
  imagePath: "/puhastusteenused1.jpg",
});

export default function PuhastusteenusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
