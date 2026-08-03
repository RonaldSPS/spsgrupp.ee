import { generatePageMetadata } from "@/lib/metadata-helper"

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/fassaadipesu",
  locale: "et",
  title: "Fassaadipesu Tallinnas | SPS Grupp",
  description:
    "Professionaalne fassaadipesu Tallinnas. Krohv-, klinker-, kivi- ja klaasfassaadide pesu. Kõrgtööd, survepesu, öko-vahendid. Küsi pakkumist!",
  imagePath: "/fassaadipesu1.jpg",
})

export default function FassaadipesuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
