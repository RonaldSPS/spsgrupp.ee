import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/remonditeenused-tallinnas/lammutustood",
  locale: "et",
  title: "Lammutustööd Tallinnas | SPS Grupp",
  description:
    "Lammutustööd Tallinnas ärihoonetes. Vaheseinte eemaldamine, jäätmete sorteerimine ja äravedu. Küsi pakkumist!",
  imagePath: "/lammutustood-1.jpg",
});

export default function LammutustoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
