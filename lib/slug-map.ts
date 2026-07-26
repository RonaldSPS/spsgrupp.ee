export type Locale = 'et' | 'en' | 'ru'

export interface LocalePaths {
  en: string
  ru: string
}

/** Keyed by live Estonian path (no trailing slash, root = '/'). */
export const localizedPaths: Record<string, LocalePaths> = {
  '/': { en: '/', ru: '/' },
  '/andmekaitsetingimused': { en: '/privacy-policy', ru: '/политика-конфиденциальности' },
  '/ehitusprahi-aravedu': { en: '/construction-waste-removal', ru: '/вывоз-строительного-мусора' },
  '/kontakt': { en: '/contact-sps-group', ru: '/свяжитесь-с-sps-group' },
  '/koolide-koristamine': {
    en: '/cleaning-services-in-tallinn/school-cleaning',
    ru: '/услуги-по-уборке-в-таллинне/уборка-школ',
  },
  '/koristusteenus': { en: '/cleaning-services-in-tallinn', ru: '/услуги-по-уборке-в-таллинне' },
  '/koristusteenus/kontori-koristus': {
    en: '/cleaning-services-in-tallinn/office-cleaning',
    ru: '/услуги-по-уборке-в-таллинне/уборка-офисов',
  },
  '/koristusteenus/kaubanduspindade-koristus': {
    en: '/cleaning-services-in-tallinn/retail-cleaning',
    ru: '/услуги-по-уборке-в-таллинне/уборка-торговых-помещений',
  },
  '/koristusteenus/tootmishoonete-koristus': {
    en: '/cleaning-services-in-tallinn/industrial-cleaning',
    ru: '/услуги-по-уборке-в-таллинне/уборка-промышленных-зданий',
  },
  '/puhastusteenused': {
    en: '/specialist-cleaning-services',
    ru: '/клининговые-услуги-для-бизнеса',
  },
  '/puhastusteenused/ehitusjargne-koristus': {
    en: '/specialist-cleaning-services/post-construction-cleaning',
    ru: '/клининговые-услуги-для-бизнеса/послестроительная-уборка',
  },
  '/puhastusteenused/eskalaatorite-suvapuhastus': {
    en: '/specialist-cleaning-services/escalator-deep-cleaning',
    ru: '/клининговые-услуги-для-бизнеса/глубокая-чистка-эскалаторов',
  },
  '/puhastusteenused/koroonaviiruse-jargne-puhastus': {
    en: '/specialist-cleaning-services/disinfection',
    ru: '/клининговые-услуги-для-бизнеса/дезинфекция',
  },
  '/puhastusteenused/porandate-hooldus': {
    en: '/specialist-cleaning-services/floor-maintenance',
    ru: '/клининговые-услуги-для-бизнеса/уход-за-полами',
  },
  '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine': {
    en: '/specialist-cleaning-services/fire-and-smoke-damage-cleaning',
    ru: '/клининговые-услуги-для-бизнеса/уборка-после-пожара',
  },
  '/puhastusteenused/vaipade-puhastus': {
    en: '/specialist-cleaning-services/carpet-cleaning',
    ru: '/клининговые-услуги-для-бизнеса/чистка-ковров',
  },
  '/remonditeenused-tallinnas': {
    en: '/repair-services-in-tallinn',
    ru: '/услуги-по-ремонту-в-таллинне',
  },
  '/remonditeenused-tallinnas/elektritood': {
    en: '/repair-services-in-tallinn/electrical-works',
    ru: '/услуги-по-ремонту-в-таллинне/электромонтажные-работы',
  },
  '/remonditeenused-tallinnas/katuse-remont': {
    en: '/repair-services-in-tallinn/roof-repairs',
    ru: '/услуги-по-ремонту-в-таллинне/ремонт-крыши',
  },
  '/remonditeenused-tallinnas/lammutustood': {
    en: '/repair-services-in-tallinn/demolition',
    ru: '/услуги-по-ремонту-в-таллинне/снос',
  },
  '/remonditeenused-tallinnas/plaatimistood': {
    en: '/repair-services-in-tallinn/tiling',
    ru: '/услуги-по-ремонту-в-таллинне/укладка-плитки',
  },
  '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus': {
    en: '/repair-services-in-tallinn/washroom-renovation',
    ru: '/услуги-по-ремонту-в-таллинне/ремонт-санузлов',
  },
  '/remonditeenused-tallinnas/siseviimistlustood': {
    en: '/repair-services-in-tallinn/interior-finishing',
    ru: '/услуги-по-ремонту-в-таллинне/внутренняя-отделка',
  },
  '/remonditeenused-tallinnas/torutood': {
    en: '/repair-services-in-tallinn/plumbing',
    ru: '/услуги-по-ремонту-в-таллинне/сантехнические-работы',
  },
  '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus': {
    en: '/repair-services-in-tallinn/ventilation-installation-and-maintenance',
    ru: '/услуги-по-ремонту-в-таллинне/монтаж-и-обслуживание-вентиляции',
  },
  '/sps-grupp': { en: '/sps-group', ru: '/группа-sps' },
  '/sps-grupp/arvamused': { en: '/sps-group/reviews', ru: '/группа-sps/отзывы' },
  '/tule-meile-toole': { en: '/come-work-for-us', ru: '/приходите-работать-к-нам' },
  '/koristusteenus/valikoristus': { en: '/outdoor-cleaning-and-grounds-care', ru: '/уборка-и-обслуживание-территорий' },
  '/koristusteenus/valikoristus/akende-pesu': {
    en: '/outdoor-cleaning-and-grounds-care/window-cleaning',
    ru: '/уборка-и-обслуживание-территорий/мойка-окон',
  },
  '/koristusteenus/valikoristus/fassaadipesu': {
    en: '/outdoor-cleaning-and-grounds-care/facade-cleaning',
    ru: '/уборка-и-обслуживание-территорий/мойка-фасадов',
  },
  '/koristusteenus/valikoristus/grafiti-eemaldamine': {
    en: '/outdoor-cleaning-and-grounds-care/graffiti-removal',
    ru: '/уборка-и-обслуживание-территорий/удаление-граффити',
  },
  '/koristusteenus/valikoristus/kojameheteenus': {
    en: '/outdoor-cleaning-and-grounds-care/groundskeeping',
    ru: '/уборка-и-обслуживание-территорий/услуги-дворника',
  },
  '/koristusteenus/valikoristus/lehtedekoristamine': {
    en: '/outdoor-cleaning-and-grounds-care/leaf-removal',
    ru: '/уборка-и-обслуживание-территорий/уборка-листьев',
  },
  '/koristusteenus/valikoristus/lumekoristus': {
    en: '/outdoor-cleaning-and-grounds-care/snow-clearing',
    ru: '/уборка-и-обслуживание-территорий/уборка-снега',
  },
  '/koristusteenus/valikoristus/muruniitmine': {
    en: '/outdoor-cleaning-and-grounds-care/lawn-mowing',
    ru: '/уборка-и-обслуживание-территорий/стрижка-газонов',
  },
  '/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus': {
    en: '/outdoor-cleaning-and-grounds-care/paving-stone-cleaning',
    ru: '/уборка-и-обслуживание-территорий/мойка-тротуарной-плитки',
  },
}

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
  if (locale === 'et') return normalizedPathname

  const pathWithoutLocale = normalizePath(
    normalizedPathname.replace(new RegExp(`^/${locale}`), '') || '/',
  )
  if (locale === 'en') return enToEt[pathWithoutLocale] || pathWithoutLocale
  return ruToEt[pathWithoutLocale] || pathWithoutLocale
}

export const allLocales: Locale[] = ['et', 'en', 'ru']
