import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Põrandate hooldus Tallinnas | SPS Grupp",
  description:
    "Põrandate hooldus ja süvapuhastus Tallinnas. PVC, parkett, betoon, kivi, keraamika. Vahatamine ja poleerimine. Küsi pakkumist!",
  keywords:
    "põrandate hooldus, põranda puhastus, põrandate süvapuhastus, parketi hooldus, põrandate vahamine, põranda hooldus tallinnas",
  openGraph: {
    title: "Põrandate hooldus Tallinnas | SPS Grupp",
    description:
      "Põrandate hooldus ja süvapuhastus Tallinnas. PVC, parkett, betoon, kivi, keraamika. Vahatamine ja poleerimine. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
};

export default function PorandateHooldusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
