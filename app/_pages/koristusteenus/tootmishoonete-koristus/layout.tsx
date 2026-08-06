import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/tootmishoonete-koristus",
  locale: "et",
  title: "Tootmishoonete koristus Tallinnas | SPS Grupp",
  description: "Tootmishoonete ja tööstuspindade koristus Tallinnas: ohutus, ISO 14001, öine ja nädalavahetuse töö. Küsi pakkumist!",
  imagePath: "/tootmishoonete-koristus.webp",
});

export default function TootmishooneteKoristusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
