import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused",
  locale: "et",
  title: "Puhastusteenused Tallinnas — eritööd äriklientidele | SPS Grupp",
  description:
    "Põrandate süvapesu, vaipade puhastus, ehitusjärgne koristus, desinfitseerimine ja põrandate hooldus Tallinnas ja Harjumaal. ISO 9001. Tasuta pakkumine — vastus 1 tööpäevaga!",
  imagePath: "/puhastusteenused1.jpg",
});

export default function PuhastusteenusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
