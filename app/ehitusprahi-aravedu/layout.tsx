import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ehitusprahi äravedu Tallinnas | SPS Grupp",
  description:
    "Ehitusprahi ja ehitusjäätmete äravedu Tallinnas. Konteinerid 24h, sorteerimine. Küsi pakkumist!",
  keywords:
    "ehitusprahi äravedu, ehitusjäätmete äravedu, ehitusprahi, ehituspraht, ehitusprahi äravedu tallinnas, ehitusjäätmed, ehituspraht konteiner",
  openGraph: {
    title: "Ehitusprahi äravedu Tallinnas | SPS Grupp",
    description:
      "Ehitusprahi ja ehitusjäätmete äravedu Tallinnas. Konteinerid 24h, sorteerimine. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
};

export default function EhitusprahiAraveduLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
