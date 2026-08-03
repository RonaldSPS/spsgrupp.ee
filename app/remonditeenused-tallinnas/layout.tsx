import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/remonditeenused-tallinnas",
  locale: "et",
  title: "Remonditeenused Tallinnas | SPS Grupp",
  description: "Remonditeenused ärikinnisvarale Tallinnas. Elektri-, toru-, plaatimis- ja ventilatsioonitööd ühest kohast. Küsi pakkumist!",
  imagePath: "/remonditeenused-1.jpg",
});

export default function RemonditeenusedTallinnasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
