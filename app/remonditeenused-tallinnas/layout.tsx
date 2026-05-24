import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remonditeenused Tallinnas | SPS Grupp",
  description: "Remonditeenused ärikinnisvarale Tallinnas. Elektri-, toru-, plaatimis- ja ventilatsioonitööd ühest kohast. Küsi pakkumist!",
  keywords: "remonditeenused, remonditeenused tallinnas, ärikinnisvara remont, ehitusteenused, remondifirma tallinnas, äripinna remont",
  openGraph: {
    title: "Remonditeenused Tallinnas | SPS Grupp",
    description: "Remonditeenused ärikinnisvarale Tallinnas. Elektri-, toru-, plaatimis- ja ventilatsioonitööd ühest kohast.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/remonditeenused-tallinnas",
  },
};

export default function RemonditeenusedTallinnasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
