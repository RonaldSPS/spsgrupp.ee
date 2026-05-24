import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SPS Grupp – edukate ettevõtete koristusfirma Tallinnas",
  description:
    "SPS Grupp on usaldusväärne partner koristus-, remondi- ja hooldusteenustes äriklientidele. Pakume professionaalset teenust Tallinnas ja Harjumaal alates 2006. aastast.",
  keywords:
    "SPS Grupp, koristusfirma Tallinnas, professionaalne koristus, koristusteenus, remonditeenus, hooldusteenus, ISO 9001, ISO 14001, ärikoristus, puhastusteenus",
  openGraph: {
    title: "SPS Grupp – edukate ettevõtete koristusfirma",
    description:
      "SPS Grupp pakub professionaalset koristus-, remondi- ja hooldusteenust äriklientidele Tallinnas ja Harjumaal.",
    type: "website",
    locale: "et_EE",
  },
};

export default function SPSGruppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
