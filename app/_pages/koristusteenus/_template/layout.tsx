import type { Metadata } from "next";

export const metadata: Metadata = {
  // TODO: Kohanda SEO metaandmed vastavalt teenusele
  title: "{TEENUSE_NIMETUS} | SPS Grupp",
  description: "{SEO_KIRJELDUS - lühike, mõjuv kirjeldus koos põhiargumendi ja hinnavihjega}",
  openGraph: {
    title: "{TEENUSE_NIMETUS} | SPS Grupp",
    description: "{OG_KIRJELDUS - sama mis SEO kirjeldus või lühem versioon}",
    type: "website",
    locale: "et_EE",
  },
};

export default function TeenuseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
