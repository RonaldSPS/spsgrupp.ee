import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata: Metadata = generatePageMetadata({
  path: "/puhastusteenused/koroonaviiruse-jargne-puhastus",
  locale: "et",
  title: "Desinfitseerimine Tallinnas | SPS Grupp",
  description:
    "Ruumide professionaalne desinfitseerimine Tallinnas, elektrostaatilised pihustid, UV-C, sertifitseeritud vahendid. Küsi pakkumist!",
  imagePath: "/desinfitseerimine-1.jpg",
});

export default function DesinfitseerimineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
