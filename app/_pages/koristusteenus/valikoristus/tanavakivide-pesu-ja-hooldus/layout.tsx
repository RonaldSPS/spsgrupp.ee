import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus",
  locale: "et",
  title: "Tänavakivide pesu Tallinnas | SPS Grupp",
  description:
    "Tänavakivide ja sillutuskivide pesu Tallinnas, umbrohu eemaldamine, vuukide täitmine, kaitsekihid. Küsi pakkumist!",
  imagePath: "/tanavakividepesu-1.jpg",
});

export default function TanavakividePesuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
