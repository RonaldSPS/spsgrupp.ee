import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/lumekoristus",
  locale: "et",
  title: "Lumekoristus Tallinnas | SPS Grupp",
  description:
    "Lumekoristus ja libedusetõrje Tallinnas 24/7. Parklad, kõnniteed, sissepääsud. Hooajaline leping. Küsi pakkumist!",
  imagePath: "/lumelykkamine-1.jpg",
});

export default function LumekoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
