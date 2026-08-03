import { generatePageMetadata } from "@/lib/metadata-helper"

export const metadata = generatePageMetadata({
  path: "/andmekaitsetingimused",
  locale: "et",
  title: "Andmekaitsetingimused | SPS Grupp",
  description:
    "SPS Grupp OÜ andmekaitsetingimused. Tutvu, kuidas töötleme klientide, töötajate ja veebilehe külastajate isikuandmeid vastavalt GDPR-ile.",
})

export default function PrivaatsusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
