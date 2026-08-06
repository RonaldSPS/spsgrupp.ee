import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/remonditeenused-tallinnas/siseviimistlustood",
  locale: "et",
  title: "Siseviimistlustööd Tallinnas | SPS Grupp",
  description:
    "Siseviimistlustööd Tallinna ärihoonetes. Pahteldus, värvimine, seinad, laed, põrandad. Küsi pakkumist!",
  imagePath: "/siseviimistlus-1.jpg",
});

export default function SiseviimistlustoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
