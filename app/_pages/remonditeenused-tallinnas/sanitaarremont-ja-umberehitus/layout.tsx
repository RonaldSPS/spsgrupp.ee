import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus",
  locale: "et",
  title: "Sanitaarremont Tallinnas | SPS Grupp",
  description:
    "Sanitaarruumide remont ja ümberehitus ärihoonetes Tallinnas - WC-d, dušid, plaatimine, toru- ja elektritööd. Küsi pakkumist!",
  imagePath: "/sanitaarremont-1.jpg",
});

export default function SanitaarremontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
