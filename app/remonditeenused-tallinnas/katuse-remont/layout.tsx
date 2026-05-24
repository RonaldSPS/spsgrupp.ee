import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katuse remont Tallinnas | SPS Grupp",
  description:
    "Katuse remont ja hooldus ärihoonetele Tallinnas. Lamekatused, hüdroisolatsioon, lekete kiire kõrvaldamine. Küsi pakkumist!",
  keywords:
    "katuse remont, katuse remont tallinnas, lamekatuse remont, katusetööd, katuse hooldus, katuseleke parandus",
  openGraph: {
    title: "Katuse remont Tallinnas | SPS Grupp",
    description:
      "Katuse remont ja hooldus ärihoonetele Tallinnas. Lamekatused, hüdroisolatsioon, lekete kiire kõrvaldamine. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
};

export default function KatuseRemontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
