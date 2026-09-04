import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/ehitusprahi-aravedu",
  locale: "et",
  title: "Ehitusprahi äravedu Tallinnas - kiire pakkumine | SPS Grupp",
  description:
    "Ehitusjäätmete ja ehitusprahi äravedu Tallinnas ja Harjumaal. Konteinerite tarne lepime kokku Sinu mahu ja ajakava järgi. Küsi tasuta pakkumist - vastus 1 tööpäevaga!",
  imagePath: "/ehitusprahi-aravedu-1.jpg",
});

export default function EhitusprahiAraveduLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
