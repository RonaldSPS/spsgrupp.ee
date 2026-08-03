import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/kontakt",
  locale: "et",
  title: "Võta ühendust SPS Grupiga | SPS Grupp",
  description:
    "Võtke ühendust SPS Grupiga — professionaalne koristus- ja remonditeenuste partner Tallinnas ja Harjumaal. Tasuta konsultatsioon, kiire reageerimine ja personaalne hinnapakkumine äriklientidele ja korteriühistutele.",
  imagePath: "/FrontHeroCar.jpg",
});

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
