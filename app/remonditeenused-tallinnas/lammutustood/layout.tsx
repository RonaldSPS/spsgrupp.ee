import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lammutustööd Tallinnas | SPS Grupp",
  description:
    "Lammutustööd Tallinnas ärihoonetes. Vaheseinte eemaldamine, jäätmete sorteerimine ja äravedu. Küsi pakkumist!",
  keywords:
    "lammutustööd, lammutustööd tallinnas, vaheseinte lammutus, ruumide lammutus, remondijärgne lammutus",
  openGraph: {
    title: "Lammutustööd Tallinnas | SPS Grupp",
    description:
      "Lammutustööd Tallinnas ärihoonetes. Vaheseinte eemaldamine, jäätmete sorteerimine ja äravedu. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
};

export default function LammutustoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
