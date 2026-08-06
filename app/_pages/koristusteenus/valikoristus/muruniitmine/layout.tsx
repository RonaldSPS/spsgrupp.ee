import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/muruniitmine",
  locale: "et",
  title: "Muruniitmine Tallinnas ja Harjumaal | SPS Grupp",
  description:
    "Muruniitmine ärikinnistutele, korteriühistutele ja haljasaladele. Regulaarne hooldus, trimmerdamine ja hooajaline graafik. Küsi pakkumist!",
  imagePath: "/muruniitmine-1.webp",
});

export default function MuruniitmineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
