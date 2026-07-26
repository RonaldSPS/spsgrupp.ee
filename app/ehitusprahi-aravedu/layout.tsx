import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ehitusprahi äravedu Tallinnas | SPS Grupp",
  description:
    "Ehitusprahi ja ehitusjäätmete äravedu Tallinnas. Konteinerite tarne lepitakse kokku mahu, asukoha ja saadavuse järgi. Küsi pakkumist!",
  keywords:
    "ehitusprahi äravedu, ehitusjäätmete äravedu, ehitusprahi, ehituspraht, ehitusprahi äravedu tallinnas, ehitusjäätmed, ehituspraht konteiner",
  openGraph: {
    title: "Ehitusprahi äravedu Tallinnas | SPS Grupp",
    description:
      "Ehitusprahi ja ehitusjäätmete äravedu Tallinnas. Konteinerite tarne lepitakse kokku mahu, asukoha ja saadavuse järgi. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/ehitusprahi-aravedu",
  },
};

export default function EhitusprahiAraveduLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
