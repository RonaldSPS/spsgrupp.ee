import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanitaarremont Tallinnas | SPS Grupp",
  description:
    "Sanitaarruumide remont ja ümberehitus ärihoonetes Tallinnas — WC-d, dušid, plaatimine, toru- ja elektritööd. Küsi pakkumist!",
  keywords:
    "sanitaarremont, sanitaarruumide remont, WC remont, sanitaarremont tallinnas, äriruumide sanitaarremont, ümberehitus",
  openGraph: {
    title: "Sanitaarremont Tallinnas | SPS Grupp",
    description:
      "Sanitaarruumide remont ja ümberehitus ärihoonetes Tallinnas — WC-d, dušid, plaatimine, toru- ja elektritööd. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
};

export default function SanitaarremontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
