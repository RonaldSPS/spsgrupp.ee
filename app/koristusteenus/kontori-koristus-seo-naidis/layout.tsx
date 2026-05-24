import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO näidis: Kontori koristus Tallinnas | SPS Grupp",
  description:
    "Eraldi lab-keskkonnas loodud kontorikoristuse SEO ja AI-crawlability näidisleht.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "SEO näidis: Kontori koristus Tallinnas | SPS Grupp",
    description:
      "Näidisleht, mis testib põhjalikumat teenuse sisu, ostujuhist, hinnategureid ja struktureeritud andmeid.",
    type: "website",
    locale: "et_EE",
  },
};

export default function SeoExampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
