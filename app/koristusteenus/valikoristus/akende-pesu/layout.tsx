import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akende pesu Tallinnas | SPS Grupp",
  description:
    "Akende pesu ärihoonetel Tallinnas. Kõrghoonete aknapesu, klaasfassaadid, regulaarne hooldus. Küsi tasuta pakkumist!",
  keywords:
    "akende pesu, aknapesu, akende pesemine, aknapesemine tallinn, aknapesu tallinnas, akende pesu tallinnas, kõrghoonete aknapesu",
  openGraph: {
    title: "Akende pesu Tallinnas | SPS Grupp",
    description:
      "Akende pesu ärihoonetel Tallinnas. Kõrghoonete aknapesu, klaasfassaadid, regulaarne hooldus. Küsi tasuta pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/valikoristus/akende-pesu",
  },
};

export default function AkendePesuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
