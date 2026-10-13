import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused/suurpuhastus",
  locale: "et",
  title: "Suurpuhastus Tallinnas - süvapuhastus äripindadele | SPS Grupp",
  description:
    "Suurpuhastus kontoritele, kaubandus- ja tootmispindadele Tallinnas ja Harjumaal. Põrandate masinpesu, katlakivi eemaldus, varjatud alad.",
  imagePath: "/puhastusteenused1.jpg",
});

export default function SuurpuhastusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
