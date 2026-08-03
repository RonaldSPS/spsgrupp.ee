import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/ehitusprahi-aravedu",
  locale: "et",
  title: "Ehitusprahi äravedu Tallinnas | SPS Grupp",
  description:
    "Ehitusprahi ja ehitusjäätmete äravedu Tallinnas. Konteinerite tarne lepitakse kokku mahu, asukoha ja saadavuse järgi. Küsi pakkumist!",
  imagePath: "/ehitusprahi-aravedu-1.jpg",
});

export default function EhitusprahiAraveduLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
