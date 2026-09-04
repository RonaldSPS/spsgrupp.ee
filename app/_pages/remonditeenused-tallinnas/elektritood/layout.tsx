import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/remonditeenused-tallinnas/elektritood",
  locale: "et",
  title: "Elektritööd Tallinnas ja Harjumaal - ärikliendile | SPS Grupp",
  description:
    "Elektritööd äripindadele Tallinnas ja Harjumaal - paigaldus, hooldus, LED-valgustus ja muud elektritööd vastavalt töö sisule. Küsi vajaduspõhist pakkumist.",
  imagePath: "/images/elekter/ElekterHero.webp",
});

export default function ElektritoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
