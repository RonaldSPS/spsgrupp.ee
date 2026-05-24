import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ventilatsioonide ehitus ja hooldus Tallinnas | SPS Grupp",
  description:
    "Ventilatsioonisüsteemide projekteerimine, paigaldus ja hooldus Tallinnas — kontorid, kaubandus, tootmishooned. Küsi pakkumist!",
  keywords:
    "ventilatsiooni ehitus, ventilatsiooni hooldus, ventilatsioonisüsteemid, ventilatsiooni paigaldus, ventilatsioonide puhastus, ventilatsioon tallinnas",
  openGraph: {
    title: "Ventilatsioonide ehitus ja hooldus Tallinnas | SPS Grupp",
    description:
      "Ventilatsioonisüsteemide projekteerimine, paigaldus ja hooldus Tallinnas — kontorid, kaubandus, tootmishooned.",
    type: "website",
    locale: "et_EE",
  },
};

export default function VentilatsioonideEhitusJaHooldusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
