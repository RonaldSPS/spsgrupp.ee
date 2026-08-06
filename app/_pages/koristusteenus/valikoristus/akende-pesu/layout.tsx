import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/akende-pesu",
  locale: "et",
  title: "Akende pesu Tallinnas | SPS Grupp",
  description:
    "Akende pesu ärihoonetel Tallinnas. Kõrghoonete aknapesu, klaasfassaadid, regulaarne hooldus. Küsi tasuta pakkumist!",
  imagePath: "/akende-pesu-1.jpg",
});

export default function AkendePesuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
