import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tänavakivide pesu Tallinnas | SPS Grupp",
  description:
    "Tänavakivide ja sillutuskivide pesu Tallinnas, umbrohu eemaldamine, vuukide täitmine, kaitsekihid. Küsi pakkumist!",
  keywords:
    "tänavakivide pesu, sillutuskivi pesu, tänavakivide puhastamine, sillutuskivi hooldus, tänavakivide hooldus tallinnas",
  openGraph: {
    title: "Tänavakivide pesu Tallinnas | SPS Grupp",
    description:
      "Tänavakivide ja sillutuskivide pesu Tallinnas, umbrohu eemaldamine, vuukide täitmine, kaitsekihid. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus",
  },
};

export default function TanavakividePesuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
