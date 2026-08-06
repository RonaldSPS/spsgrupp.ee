import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/sps-grupp",
  locale: "et",
  title: "SPS Grupp – edukate ettevõtete koristusfirma Tallinnas",
  description:
    "SPS Grupp on usaldusväärne partner koristus-, remondi- ja hooldusteenustes äriklientidele. Pakume professionaalset teenust Tallinnas ja Harjumaal alates 2006. aastast.",
  imagePath: "/FrontHeroCar.jpg",
});

export default function SPSGruppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
