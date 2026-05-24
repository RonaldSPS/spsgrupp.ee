import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lumekoristus Tallinnas | SPS Grupp",
  description:
    "Lumekoristus ja libedusetõrje Tallinnas 24/7. Parklad, kõnniteed, sissepääsud. Hooajaline leping. Küsi pakkumist!",
  keywords:
    "lumekoristus, lumelükkamine, libedusetõrje, lumekoristus tallinnas, parkla lumekoristus, kõnnitee lumekoristus",
  openGraph: {
    title: "Lumekoristus Tallinnas | SPS Grupp",
    description:
      "Lumekoristus ja libedusetõrje Tallinnas 24/7. Parklad, kõnniteed, sissepääsud. Hooajaline leping. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/koristusteenus/valikoristus/lumekoristus",
  },
};

export default function LumekoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
