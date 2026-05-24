import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tootmishoonete koristus Tallinnas | SPS Grupp",
  description: "Tootmishoonete ja tööstuspindade koristus Tallinnas: ohutus, ISO 14001, öine ja nädalavahetuse töö. Küsi pakkumist!",
  keywords: "tootmishoonete koristus, tööstuspindade koristus, tootmishoone puhastus, tööstushoonete koristus, tootmispindade hooldus",
  openGraph: {
    title: "Tootmishoonete koristus Tallinnas | SPS Grupp",
    description: "Tootmishoonete ja tööstuspindade koristus Tallinnas: ohutus, ISO 14001, öine ja nädalavahetuse töö.",
    type: "website",
    locale: "et_EE",
  },
};

export default function TootmishooneteKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
