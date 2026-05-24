import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Muru niitmine Tallinnas | SPS Grupp",
  description:
    "Muru niitmine ja territooriumi hooldus Tallinnas. Regulaarne niitmine, trimmerdamine, võsa tõrje. Küsi pakkumist!",
  keywords:
    "muru niitmine, muru niitmine tallinnas, territooriumi hooldus, rohu niitmine, haljastus teenus, ärihoone muru niitmine",
  openGraph: {
    title: "Muru niitmine Tallinnas | SPS Grupp",
    description:
      "Muru niitmine ja territooriumi hooldus Tallinnas. Regulaarne niitmine, trimmerdamine, võsa tõrje. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/remonditeenused-tallinnas/muruniitmine",
  },
};

export default function MuruniitmineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
