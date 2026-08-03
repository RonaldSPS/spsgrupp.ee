import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/puhastusteenused/eskalaatorite-suvapuhastus",
  locale: "et",
  title: "Eskalaatorite süvapuhastus | SPS Grupp",
  description:
    "Eskalaatorite professionaalne süvapuhastus kaubanduskeskustes. Öine töö, erivahendid, pikendab eluiga. Küsi pakkumist!",
  imagePath: "/eskalaatorite-suvapuhastus-1.jpg",
});

export default function EskalaatoriteSuvapuhastusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
