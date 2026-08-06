import type { Metadata } from "next"
import { BASE_URL, canonicalUrl, absoluteUrl } from "@/lib/url-utils"
import { localizePath, localizedPaths } from "@/lib/slug-map"
import type { Locale } from "@/lib/slug-map"

const LOCALE_MAP: Record<string, string> = {
  et: "et_EE",
  en: "en_US",
  ru: "ru_RU",
}

function makeAlternates(etPath: string, locale: Locale) {
  const languages: Record<string, string> = {
    et: canonicalUrl(etPath),
    "x-default": canonicalUrl(etPath),
  }

  if (localizedPaths[etPath]) {
    languages.en = canonicalUrl(localizePath(etPath, "en"))
    languages.ru = canonicalUrl(localizePath(etPath, "ru"))
  }

  return {
    canonical: canonicalUrl(
      locale === "et" ? etPath : localizePath(etPath, locale),
    ),
    languages,
  }
}

function makeOpenGraph(
  title: string,
  description: string,
  url: string,
  locale: Locale,
  type: "website" | "article",
  imagePath?: string,
  publishedTime?: string,
) {
  const images = imagePath
    ? [{ url: absoluteUrl(imagePath), alt: title }]
    : [{ url: absoluteUrl("/SPS_LOGO.svg"), alt: "SPS Grupp logo" }]

  const og: Record<string, unknown> = {
    title,
    description,
    url,
    siteName: "SPS Grupp",
    locale: LOCALE_MAP[locale] || "et_EE",
    type,
    images,
  }

  if (publishedTime) {
    og.publishedTime = publishedTime
  }

  return og
}

function makeTwitter(
  title: string,
  description: string,
  imagePath?: string,
) {
  const images = imagePath
    ? [absoluteUrl(imagePath)]
    : [absoluteUrl("/SPS_LOGO.svg")]

  return {
    card: "summary_large_image",
    title,
    description,
    images,
  } as const
}

type GeneratePageMetadataParams = {
  path: string
  locale: Locale
  title: string
  description: string
  imagePath?: string
  type?: "website" | "article"
  publishedTime?: string
}

const OG_LOCALE_ALTERNATES: Record<Locale, string[]> = {
  et: ["en_US", "ru_RU"],
  en: ["et_EE", "ru_RU"],
  ru: ["et_EE", "en_US"],
}

export function generatePageMetadata({
  path,
  locale,
  title,
  description,
  imagePath,
  type = "website",
  publishedTime,
}: GeneratePageMetadataParams): Metadata {
  const url =
    locale === "et"
      ? canonicalUrl(path)
      : canonicalUrl(localizePath(path, locale))

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: makeAlternates(path, locale),
    openGraph: makeOpenGraph(
      title,
      description,
      url,
      locale,
      type,
      imagePath,
      publishedTime,
    ),
    twitter: makeTwitter(title, description, imagePath),
    other: {
      "og:locale:alternate": OG_LOCALE_ALTERNATES[locale],
    },
  }
}
