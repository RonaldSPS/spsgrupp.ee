import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Siseviimistlustööd Tallinnas | SPS Grupp",
  description:
    "Siseviimistlustööd Tallinna ärihoonetes. Pahteldus, värvimine, seinad, laed, põrandad. Küsi pakkumist!",
  keywords:
    "siseviimistlustööd, siseviimistlus tallinnas, pahteldus ja värvimine, kontori viimistlus, seinte värvimine, siseviimistluse teenus",
  openGraph: {
    title: "Siseviimistlustööd Tallinnas | SPS Grupp",
    description:
      "Siseviimistlustööd Tallinna ärihoonetes. Pahteldus, värvimine, seinad, laed, põrandad. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/remonditeenused-tallinnas/siseviimistlustood",
  },
};

export default function SiseviimistlustoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
