import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused/vaipade-puhastus",
  locale: "et",
  title: "Vaipade puhastus Tallinnas | SPS Grupp",
  description:
    "Vaipade professionaalne puhastus ja keemiline pesu Tallinna kontorites. Allergeenide eemaldamine. Küsi pakkumist!",
  imagePath: "/vaipade-puhastus-1.webp",
});

export default function VaipadePuhastusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
