import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arvamused ja tagasiside | SPS Grupp",
  description:
    "Loe meie klientide tagasisidet ja arvamusi. SPS Grupp on usaldusväärne koristuspartner — kontori-, kooli- ja puhastusteenused Tallinnas ja Harjumaal.",
  keywords:
    "arvamused, tagasiside, klientide arvamused, koristusfirma, SPS Grupp, kliendirahulolu",
  openGraph: {
    title: "Arvamused ja tagasiside | SPS Grupp",
    description:
      "Loe meie klientide tagasisidet ja arvamusi. Kontori-, kooli- ja puhastusteenused.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/sps-grupp/arvamused",
  },
};

export default function ArvamusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
