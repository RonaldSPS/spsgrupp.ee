import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/muruniitmine",
  locale: "et",
  title: "Muru niitmine Tallinnas | SPS Grupp",
  description:
    "Muru niitmine ja territooriumi hooldus Tallinnas. Regulaarne niitmine, trimmerdamine, võsa tõrje. Küsi pakkumist!",
  imagePath: "/muruniitmine-1.webp",
});

export default function MuruniitmineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
