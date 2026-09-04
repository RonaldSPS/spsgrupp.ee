import type { Metadata } from "next"
import { locale } from "next/root-params"
import { RootShell, rootMetadata, type SiteLocale } from "@/app/_shell/root-shell"
import "../globals.css"

export const metadata: Metadata = rootMetadata

export function generateStaticParams() {
  return [{ locale: "et" }, { locale: "en" }, { locale: "ru" }]
}

// dynamicParams stays enabled: admin-created job postings under
// /tule-meile-toole/[slug] must render on demand without a redeploy
// (unknown paths still 404 via notFound guards).

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const current = await locale()
  // Unknown locale values (junk URLs, encoded path tricks) 404 via the page's
  // notFound guards - the shell must stay renderable for those 404s too, so
  // it falls back to et instead of crashing here.
  const safeLocale: SiteLocale = current === "en" || current === "ru" ? current : "et"

  return <RootShell locale={safeLocale}>{children}</RootShell>
}
