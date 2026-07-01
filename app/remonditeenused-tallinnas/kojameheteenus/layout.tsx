import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kojameheteenus — remont ja hooldus | SPS Grupp",
  description:
    "Kojameheteenus ärikinnisvarale Tallinnas. Territooriumi hooldus, väiksemad remonditööd, prügikastid, lumekoristus. Küsi pakkumist!",
  keywords:
    "kojamehe teenus, kojamees, kinnisvara hooldus, ärihoone remont, territooriumi hooldus tallinnas",
  openGraph: {
    title: "Kojameheteenus — remont ja hooldus | SPS Grupp",
    description:
      "Kojameheteenus ärikinnisvarale Tallinnas. Territooriumi hooldus, väiksemad remonditööd, lumekoristus. Küsi pakkumist!",
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
