import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eskalaatorite süvapuhastus | SPS Grupp",
  description:
    "Eskalaatorite professionaalne süvapuhastus kaubanduskeskustes. Öine töö, erivahendid, pikendab eluiga. Küsi pakkumist!",
  keywords:
    "eskalaatorite puhastus, eskalaatori hooldus, liikurtrepi puhastus, eskalaatorite süvapuhastus, eskalaatori puhastus tallinnas",
  openGraph: {
    title: "Eskalaatorite süvapuhastus | SPS Grupp",
    description:
      "Eskalaatorite professionaalne süvapuhastus kaubanduskeskustes. Öine töö, erivahendid, pikendab eluiga. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
};

export default function EskalaatoriteSuvapuhastusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
