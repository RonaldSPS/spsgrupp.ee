import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Andmekaitsetingimused | SPS Grupp",
  description:
    "SPS Grupp OÜ andmekaitsetingimused. Tutvu, kuidas töötleme klientide, töötajate ja veebilehe külastajate isikuandmeid vastavalt GDPR-ile.",
  keywords:
    "andmekaitsetingimused, privaatsus, GDPR, isikuandmete töötlemine, SPS Grupp andmekaitse",
  openGraph: {
    title: "Andmekaitsetingimused | SPS Grupp",
    description:
      "SPS Grupp OÜ andmekaitsetingimused. Tutvu, kuidas töötleme isikuandmeid vastavalt GDPR-ile.",
    type: "website",
    locale: "et_EE",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/privaatsus",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivaatsusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
