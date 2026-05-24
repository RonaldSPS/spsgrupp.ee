import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desinfitseerimine Tallinnas | SPS Grupp",
  description:
    "Ruumide professionaalne desinfitseerimine Tallinnas, elektrostaatilised pihustid, UV-C, sertifitseeritud vahendid. Küsi pakkumist!",
  keywords:
    "desinfitseerimine, ruumide desinfitseerimine, viiruse puhastus, hügieenipakett, desinfitseerimine tallinnas, viirusejärgne puhastus",
  openGraph: {
    title: "Desinfitseerimine Tallinnas | SPS Grupp",
    description:
      "Ruumide professionaalne desinfitseerimine Tallinnas, elektrostaatilised pihustid, UV-C, sertifitseeritud vahendid. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/puhastusteenused/desinfitseerimine",
  },
};

export default function DesinfitseerimineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
