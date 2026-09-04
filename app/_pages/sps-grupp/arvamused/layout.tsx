import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/sps-grupp/arvamused",
  locale: "et",
  title: "Arvamused ja tagasiside | SPS Grupp",
  description:
    "Loe meie klientide tagasisidet ja arvamusi. SPS Grupp on usaldusväärne koristuspartner - kontori-, kooli- ja puhastusteenused Tallinnas ja Harjumaal.",
  imagePath: "/images/arvamused.jpg",
});

export default function ArvamusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
