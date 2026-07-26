import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elektritööd Tallinnas ja Harjumaal — ärikliendile | SPS Grupp",
  description:
    "Elektritööd äripindadele Tallinnas ja Harjumaal — paigaldus, hooldus, LED-valgustus ja muud elektritööd vastavalt töö sisule. Küsi vajaduspõhist pakkumist.",
  keywords:
    "elektritööd, elektritööd tallinnas, elektritööd harjumaal, elektrisüsteemide hooldus, elektripaigaldus, elektrik tallinnas, laadimisjaamad",
  openGraph: {
    title: "Elektritööd Tallinnas ja Harjumaal — ärikliendile | SPS Grupp",
    description:
      "Elektritööd äripindadele Tallinnas ja Harjumaal — paigaldus, hooldus, LED-valgustus ja muud elektritööd vastavalt töö sisule. Küsi vajaduspõhist pakkumist.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/remonditeenused-tallinnas/elektritood",
  },
};

export default function ElektritoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
