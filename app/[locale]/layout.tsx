import type { Metadata } from "next"
import { locale } from "next/root-params"
import { notFound } from "next/navigation"
import { RootShell, rootMetadata, type SiteLocale } from "@/app/_shell/root-shell"
import "../globals.css"

export const metadata: Metadata = rootMetadata

export function generateStaticParams() {
  return [{ locale: "et" }, { locale: "en" }, { locale: "ru" }]
}

// dynamicParams stays enabled: admin-created job postings under
// /tule-meile-toole/[slug] must render on demand without a redeploy
// (unknown paths still 404 via notFound guards).

const LOCALES: ReadonlySet<string> = new Set(["et", "en", "ru"])

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const current = await locale()
  if (!current || !LOCALES.has(current)) notFound()

  return <RootShell locale={current as SiteLocale}>{children}</RootShell>
}
