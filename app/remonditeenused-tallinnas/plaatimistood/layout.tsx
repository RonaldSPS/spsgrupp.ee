import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/remonditeenused-tallinnas/plaatimistood",
  locale: "et",
  title: "Plaatimistööd Tallinnas | SPS Grupp",
  description:
    "Plaatimistööd Tallinna ärihoonetes. Sanitaarruumid, köögid, kaubanduspinnad. Keraamika, kivi. Küsi pakkumist!",
  imagePath: "/plaatimistood-1.jpg",
});

export default function PlaatimistoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
