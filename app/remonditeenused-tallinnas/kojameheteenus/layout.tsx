import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kojamehe teenus Tallinnas | SPS Grupp",
  description:
    "Kojamehe teenus ärikinnisvarale Tallinnas. Territooriumi hooldus, prügikastid, lumekoristus, väiksemad remonditööd. Küsi pakkumist!",
  keywords:
    "kojamehe teenus, kojamees, territooriumi hooldus, kinnisvara hooldus, ärihoone hooldus, kojamees tallinnas",
  openGraph: {
    title: "Kojamehe teenus Tallinnas | SPS Grupp",
    description:
      "Kojamehe teenus ärikinnisvarale Tallinnas. Territooriumi hooldus, prügikastid, lumekoristus, väiksemad remonditööd. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/remonditeenused-tallinnas/kojameheteenus",
  },
};

export default function KojameheteenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
