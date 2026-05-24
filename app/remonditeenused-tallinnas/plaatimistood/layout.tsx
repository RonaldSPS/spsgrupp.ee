import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plaatimistööd Tallinnas | SPS Grupp",
  description:
    "Plaatimistööd Tallinna ärihoonetes. Sanitaarruumid, köögid, kaubanduspinnad. Keraamika, kivi. Küsi pakkumist!",
  keywords:
    "plaatimistööd, plaatija tallinnas, plaatide paigaldus, plaatimistööd tallinnas, sanitaarruumi plaatimine, põrandaplaatide paigaldus",
  openGraph: {
    title: "Plaatimistööd Tallinnas | SPS Grupp",
    description:
      "Plaatimistööd Tallinna ärihoonetes. Sanitaarruumid, köögid, kaubanduspinnad. Keraamika, kivi. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
};

export default function PlaatimistoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
