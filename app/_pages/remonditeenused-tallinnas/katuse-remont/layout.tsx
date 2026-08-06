import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/remonditeenused-tallinnas/katuse-remont",
  locale: "et",
  title: "Katuse remont Tallinnas | SPS Grupp",
  description:
    "Katuse remont ja hooldus ärihoonetele Tallinnas. Lamekatused, hüdroisolatsioon, lekete kiire kõrvaldamine. Küsi pakkumist!",
  imagePath: "/katuseremont-1.jpg",
});

export default function KatuseRemontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
