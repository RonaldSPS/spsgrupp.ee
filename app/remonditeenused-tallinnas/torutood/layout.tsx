import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/remonditeenused-tallinnas/torutood",
  locale: "et",
  title: "Torutööd Tallinnas | SPS Grupp",
  description:
    "Torutööd ärihoonetes Tallinnas: vee-, kanalisatsiooni- ja küttesüsteemide tööd vastavalt objekti vajadustele. Küsi pakkumist!",
  imagePath: "/torutood-1.jpg",
});

export default function TorutoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
