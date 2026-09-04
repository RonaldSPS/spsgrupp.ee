import { localizedPages } from '@/lib/pages/registry'

export type Locale = 'et' | 'en' | 'ru'

export interface LocalePaths {
  en: string
  ru: string
}

/**
 * Keyed by live Estonian path (no trailing slash, root = '/').
 * Derived from lib/pages/registry - do not add paths here directly.
 */
export const localizedPaths: Record<string, LocalePaths> = Object.fromEntries(
  localizedPages.map((page) => [page.etPath, { en: page.en as string, ru: page.ru as string }]),
)

function normalizePath(path: string): string {
  let decoded = path
  try {
    decoded = decodeURI(path)
  } catch {}
  if (decoded.length > 1) decoded = decoded.replace(/\/+$/, '')
  return decoded || '/'
}

function buildReverseMap(locale: 'en' | 'ru'): Record<string, string> {
  const map: Record<string, string> = {}
  for (const [etPath, paths] of Object.entries(localizedPaths)) {
    const localizedPath = normalizePath(paths[locale])
    if (!map[localizedPath]) map[localizedPath] = etPath
  }
  return map
}

export const enToEt = buildReverseMap('en')
export const ruToEt = buildReverseMap('ru')

export function localizePath(etPath: string, locale: Locale): string {
  const normalizedEtPath = normalizePath(etPath)
  const withTrailingSlash = (path: string) => path === '/' ? path : `${path}/`
  if (locale === 'et') return withTrailingSlash(normalizedEtPath)
  const slug = localizedPaths[normalizedEtPath]?.[locale]
  if (slug) return withTrailingSlash(`/${locale}${slug === '/' ? '' : slug}`)
  const withoutPrefix = normalizedEtPath.replace(/^\/koristusteenus\//, '/')
  const fallbackSlug = localizedPaths[withoutPrefix]?.[locale]
  if (fallbackSlug) return withTrailingSlash(`/${locale}${fallbackSlug === '/' ? '' : fallbackSlug}`)
  return withTrailingSlash(normalizedEtPath)
}

export function getCurrentEtPath(pathname: string, locale: Locale): string {
  const normalizedPathname = normalizePath(pathname)
  if (locale === 'et') {
    // ET pages prerender under the internal /et prefix (proxy rewrites the
    // public unprefixed URL to it) - strip it so active-state lookups match.
    if (normalizedPathname === '/et') return '/'
    if (normalizedPathname.startsWith('/et/')) return normalizePath(normalizedPathname.slice(3))
    return normalizedPathname
  }

  const pathWithoutLocale = normalizePath(
    normalizedPathname.replace(new RegExp(`^/${locale}`), '') || '/',
  )
  if (locale === 'en') return enToEt[pathWithoutLocale] || pathWithoutLocale
  return ruToEt[pathWithoutLocale] || pathWithoutLocale
}

export const allLocales: Locale[] = ['et', 'en', 'ru']
