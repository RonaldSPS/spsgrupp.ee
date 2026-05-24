import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Puhastusteenused Tallinnas | SPS Grupp",
  description:
    "Professionaalsed puhastusteenused äriklientidele Tallinnas. Põrandate süvapuhastus, vaibad, ehitusjärgne koristus, desinfitseerimine. Küsi pakkumist!",
  keywords:
    "puhastusteenused, puhastusteenused tallinnas, puhastusfirma, süvapuhastus, äriklientide puhastusteenus",
  openGraph: {
    title: "Puhastusteenused Tallinnas | SPS Grupp",
    description:
      "Professionaalsed puhastusteenused äriklientidele Tallinnas. Põrandate süvapuhastus, vaibad, ehitusjärgne koristus, desinfitseerimine. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
};

export default function PuhastusteenusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
