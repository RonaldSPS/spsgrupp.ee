import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused/suurpuhastus",
  locale: "et",
  title: "Suurpuhastus Tallinnas - põhjalik süvapuhastus äripindadele | SPS Grupp",
  description:
    "Suurpuhastus kontoritele, kaubandus- ja tootmispindadele Tallinnas ja Harjumaal. Põrandate masinpesu, katlakivi eemaldus, varjatud alad. Tasuta pakkumine - vastus 1 tööpäevaga!",
  imagePath: "/puhastusteenused1.jpg",
});

export default function SuurpuhastusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
