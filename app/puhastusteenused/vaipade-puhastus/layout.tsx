import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vaipade puhastus Tallinnas | SPS Grupp",
  description:
    "Vaipade professionaalne puhastus ja keemiline pesu Tallinna kontorites. Allergeenide eemaldamine. Küsi pakkumist!",
  keywords:
    "vaipade puhastus, vaipade keemiline puhastus, vaipade pesu, vaipade puhastus tallinnas, vaipkatete puhastus, vaibapuhastus",
  openGraph: {
    title: "Vaipade puhastus Tallinnas | SPS Grupp",
    description:
      "Vaipade professionaalne puhastus ja keemiline pesu Tallinna kontorites. Allergeenide eemaldamine. Küsi pakkumist!",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/puhastusteenused/vaipade-puhastus",
  },
};

export default function VaipadePuhastusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
