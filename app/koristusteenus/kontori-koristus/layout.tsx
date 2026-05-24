import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontori koristus Tallinnas | SPS Grupp",
  description: "Regulaarne kontori koristus Tallinnas alates 1.2€/m². Paindlik graafik, koolitatud personal, ISO 9001. Küsi tasuta pakkumist!",
  keywords: "kontori koristus, kontorikoristus, büroo koristus, kontori koristusteenus, kontori koristus tallinnas, kontorite koristus",
  openGraph: {
    title: "Kontori koristus Tallinnas | SPS Grupp",
    description: "Regulaarne kontori koristus Tallinnas alates 1.2€/m². Paindlik graafik, koolitatud personal, ISO 9001.",
    type: "website",
    locale: "et_EE",
  },
};

export default function KontoriKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}