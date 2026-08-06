import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused",
  locale: "et",
  title: "Puhastusteenused Tallinnas | SPS Grupp",
  description:
    "Professionaalsed puhastusteenused äriklientidele Tallinnas. Põrandate süvapuhastus, vaibad, ehitusjärgne koristus, desinfitseerimine. Küsi pakkumist!",
  imagePath: "/puhastusteenused1.jpg",
});

export default function PuhastusteenusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
