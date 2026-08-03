import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus",
  locale: "et",
  title: "Ventilatsioonide ehitus ja hooldus Tallinnas | SPS Grupp",
  description:
    "Ventilatsioonisüsteemide projekteerimine, paigaldus ja hooldus Tallinnas — kontorid, kaubandus, tootmishooned. Küsi pakkumist!",
  imagePath: "/ventilatsioon-1.jpg",
});

export default function VentilatsioonideEhitusJaHooldusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
