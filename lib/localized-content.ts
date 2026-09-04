import enMessages from '@/messages/en.json'
import ruMessages from '@/messages/ru.json'
import type { Locale } from '@/lib/slug-map'
import { publicPages, type ContentNamespace } from '@/lib/pages/registry'

export type LocalizedContentNamespace = ContentNamespace

const messagesByLocale = {
  en: enMessages,
  ru: ruMessages,
} as const

/** Derived from lib/pages/registry - do not add entries here directly. */
export const contentNamespacesByPath: Record<string, LocalizedContentNamespace> = Object.fromEntries(
  publicPages
    .filter((page) => page.namespace)
    .map((page) => [page.etPath, page.namespace as LocalizedContentNamespace]),
)

/** Derived from lib/pages/registry - do not add entries here directly. */
export const heroImagesByPath: Record<string, string> = Object.fromEntries(
  publicPages
    .filter((page) => page.heroImage)
    .map((page) => [page.etPath, page.heroImage as string]),
)

export function getContentNamespace(etPath: string): LocalizedContentNamespace | undefined {
  return contentNamespacesByPath[etPath]
}

export function getLocalizedContent(locale: Exclude<Locale, 'et'>, namespace: LocalizedContentNamespace): unknown {
  const messages = messagesByLocale[locale] as Record<string, unknown>
  return messages[namespace]
}

export function getHeroImage(etPath: string): string {
  return heroImagesByPath[etPath] || '/Koristusteenused-HERO.jpg'
}

export function getLocalizedSeoMetadata(
  locale: Exclude<Locale, 'et'>,
  etPath: string,
): { title: string; description: string } | undefined {
  const namespace = getContentNamespace(etPath)
  if (!namespace) return undefined
  const content = getLocalizedContent(locale, namespace)
  if (!content || typeof content !== 'object' || Array.isArray(content)) return undefined
  const seo = (content as Record<string, unknown>).seo
  if (!seo || typeof seo !== 'object' || Array.isArray(seo)) return undefined
  const record = seo as Record<string, unknown>
  const title = typeof record.serviceName === 'string' ? record.serviceName : ''
  const description = typeof record.serviceDescription === 'string' ? record.serviceDescription : ''
  return title && description
    ? { title: title.includes('SPS Grupp') ? title : `${title} | SPS Grupp`, description }
    : undefined
}
