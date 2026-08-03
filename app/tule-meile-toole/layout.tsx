import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/tule-meile-toole",
  locale: "et",
  title: "Tule tööle SPS Gruppi | Liitu meie meeskonnaga",
  description:
    "Liitu SPS Grupi meeskonnaga! Otsime koristajaid Tallinnas ja Harjumaal. Pakume väljaõpet, täiendkoolitusi ja õigeaegset töötasu. Varasem kogemus pole oluline.",
  imagePath: "/tuletoole-1.jpg",
});

export default function TuleMeileTooleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
