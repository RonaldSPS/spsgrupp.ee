import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Torutööd Tallinnas | SPS Grupp",
  description:
    "Torutööd ärihoonetes Tallinnas:vee-, kanalisatsiooni- ja küttesüsteemid. Avariireageerimine 24 tunni jooksul. Küsi pakkumist!",
  keywords:
    "torutööd, torutööd tallinnas, torulukksepp, torulukksepp tallinnas, torutööd tallinn, santehnik tallinnas, veelekke kõrvaldamine",
  openGraph: {
    title: "Torutööd Tallinnas | SPS Grupp",
    description:
      "Torutööd ärihoonetes Tallinnas:vee-, kanalisatsiooni- ja küttesüsteemid. Avariireageerimine 24 tunni jooksul. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/remonditeenused-tallinnas/torutood",
  },
};

export default function TorutoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
