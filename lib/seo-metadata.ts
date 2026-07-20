import type { Metadata } from 'next'
import { localizePath } from '@/lib/slug-map'
import liveUrlInventory from '@/data/live-url-inventory.json'

const BASE_URL = 'https://spsgrupp.ee'

const LOCALE_MAP: Record<string, string> = {
  et: 'et_EE',
  en: 'en_US',
  ru: 'ru_RU',
}

function canonicalUrl(path: string): string {
  if (path === '/') return BASE_URL
  return `${BASE_URL}${path.replace(/\/$/, '')}/`
}

function comparablePath(path: string): string {
  let decoded = path
  try {
    decoded = decodeURI(path)
  } catch {}
  if (decoded.length > 1) decoded = decoded.replace(/\/$/, '')
  return decoded || '/'
}

function getLiveMetadata(urlPath: string): { title?: string; description?: string } {
  const targetPath = comparablePath(urlPath)
  const pages = liveUrlInventory.pages as Array<{
    canonical?: string
    finalUrl?: string
    title?: string
    metaDescription?: string
  }>
  const page = pages.find((item) => {
    const candidateUrl = item.canonical || item.finalUrl
    if (!candidateUrl) return false
    return comparablePath(new URL(candidateUrl).pathname) === targetPath
  })
  return {
    title: page?.title,
    description: page?.metaDescription,
  }
}

export function generateLocalizedMetadata(
  etPath: string,
  locale: string,
  title: string,
  description: string,
): Metadata {
  const localizedPath = locale === 'et' ? etPath : localizePath(etPath, locale as 'en' | 'ru')
  const url = canonicalUrl(localizedPath)
  const liveMetadata = getLiveMetadata(localizedPath)
  const localizedTitle = liveMetadata.title || title
  const localizedDescription = liveMetadata.description || description

  return {
    title: localizedTitle,
    description: localizedDescription,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: {
        et: canonicalUrl(etPath),
        en: canonicalUrl(localizePath(etPath, 'en')),
        ru: canonicalUrl(localizePath(etPath, 'ru')),
        'x-default': canonicalUrl(etPath),
      },
    },
    openGraph: {
      title: localizedTitle,
      description: localizedDescription,
      url,
      siteName: 'SPS Grupp',
      locale: LOCALE_MAP[locale] || 'et_EE',
      type: 'website',
      images: [{ url: `${BASE_URL}/SPS_LOGO.svg`, width: 512, height: 512, alt: 'SPS Grupp logo' }],
    },
    twitter: {
      card: 'summary',
      title: localizedTitle,
      description: localizedDescription,
    },
  }
}
