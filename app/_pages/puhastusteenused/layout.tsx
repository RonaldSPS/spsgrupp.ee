import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused",
  locale: "et",
  title: "Puhastusteenused Tallinnas - äriklientidele | SPS Grupp",
  description:
    "Puhastusteenused äriklientidele: põrandate süvapesu, vaipade puhastus, suurpuhastus, ehitusjärgne koristus ja desinfitseerimine Tallinnas ja Harjumaal. ISO 9001. Tasuta pakkumine - vastus 1 tööpäevaga!",
  imagePath: "/puhastusteenused1.jpg",
});

export default function PuhastusteenusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
