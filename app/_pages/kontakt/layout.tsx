import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/kontakt",
  locale: "et",
  title: "Võta ühendust SPS Grupiga | SPS Grupp",
  description:
    "Võtke ühendust SPS Grupiga - koristus- ja remonditeenuste partner Tallinnas ja Harjumaal. Personaalne hinnapakkumine - vastus 1 tööpäevaga!",
  imagePath: "/FrontHeroCar.jpg",
});

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
