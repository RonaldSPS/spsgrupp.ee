import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata-helper'
import { localizePath } from '@/lib/slug-map'
import liveUrlInventory from '@/data/live-url-inventory.json'

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
  preferProvided = false,
  imagePath?: string,
): Metadata {
  const localizedPath = locale === 'et' ? etPath : localizePath(etPath, locale as 'en' | 'ru')
  const liveMetadata = getLiveMetadata(localizedPath)
  const localizedTitle = preferProvided ? title : liveMetadata.title || title
  const localizedDescription = preferProvided ? description : liveMetadata.description || description

  return generatePageMetadata({
    path: etPath,
    locale: locale as 'et' | 'en' | 'ru',
    title: localizedTitle,
    description: localizedDescription,
    imagePath,
  })
}
