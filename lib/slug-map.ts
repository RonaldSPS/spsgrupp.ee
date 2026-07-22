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
    en: '/cleaning-services-in-tallinn/cleaning-up-retail-spaces',
    ru: '/услуги-по-уборке-в-таллинне/очистка-торговых-площадей-в-харьюмаа',
  },
  '/koristusteenus/tootmishoonete-koristus': {
    en: '/cleaning-services-in-tallinn/cleaning-of-industrial-buildings',
    ru: '/услуги-по-уборке-в-таллинне/уборка-промышленных-зданий',
  },
  '/puhastusteenused': {
    en: '/cleaning-services-for-business-clients',
    ru: '/частные-клининговые-услуги-для-бизне',
  },
  '/puhastusteenused/ehitusjargne-koristus': {
    en: '/cleaning-services-for-business-clients/post-construction-cleaning',
    ru: '/частные-клининговые-услуги-для-бизне/послестроительная-уборка-в-харьюмаа',
  },
  '/puhastusteenused/eskalaatorite-suvapuhastus': {
    en: '/cleaning-services-for-business-clients/deep-cleaning-of-escalators',
    ru: '/частные-клининговые-услуги-для-бизне/глубокая-очистка-эскалаторов',
  },
  '/puhastusteenused/koroonaviiruse-jargne-puhastus': {
    en: '/cleaning-services-for-business-clients/disinfection-and-post-virus-cleaning',
    ru: '/частные-клининговые-услуги-для-бизне/дезинфекция-и-очистка-после-вирусов',
  },
  '/puhastusteenused/porandate-hooldus': {
    en: '/cleaning-services-for-business-clients/professional-floor-maintenance-in-tallinn',
    ru: '/частные-клининговые-услуги-для-бизне/профессиональный-уход-за-полом-в-талл',
  },
  '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine': {
    en: '/cleaning-services-for-business-clients/smoke-and-fire-damage-cleaning',
    ru: '/частные-клининговые-услуги-для-бизне/уборка-повреждений-от-дыма-и-огня',
  },
  '/puhastusteenused/vaipade-puhastus': {
    en: '/cleaning-services-for-business-clients/carpet-cleaning',
    ru: '/частные-клининговые-услуги-для-бизне/профессиональная-чистка-ковров-для-к',
  },
  '/remonditeenused-tallinnas': {
    en: '/repair-services-in-tallinn',
    ru: '/услуги-по-ремонту-в-таллинне',
  },
  '/remonditeenused-tallinnas/betoonitood': {
    en: '/repair-services-in-tallinn/concrete-works',
    ru: '/услуги-по-ремонту-в-таллинне/бетонные-работы',
  },
  '/remonditeenused-tallinnas/elektritood': {
    en: '/repair-services-in-tallinn/electrical-works',
    ru: '/услуги-по-ремонту-в-таллинне/электромонтажные-работы',
  },
  '/remonditeenused-tallinnas/garderoobide-ehitus': {
    en: '/repair-services-in-tallinn/cloakroom-construction',
    ru: '/услуги-по-ремонту-в-таллинне/строительство-гардеробной',
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
    en: '/repair-services-in-tallinn/plating',
    ru: '/услуги-по-ремонту-в-таллинне/покрытие',
  },
  '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus': {
    en: '/repair-services-in-tallinn/sanitary-renovation-and-conversion',
    ru: '/услуги-по-ремонту-в-таллинне/обновление-и-преобразование-санитар',
  },
  '/remonditeenused-tallinnas/siseviimistlustood': {
    en: '/repair-services-in-tallinn/interior-finishing',
    ru: '/услуги-по-ремонту-в-таллинне/внутренняя-отделка',
  },
  '/remonditeenused-tallinnas/torutood-2': {
    en: '/repair-services-in-tallinn/pipeworks',
    ru: '/услуги-по-ремонту-в-таллинне/pipeworks',
  },
  '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus': {
    en: '/repair-services-in-tallinn/construction-and-maintenance-of-ventilation-systems',
    ru: '/услуги-по-ремонту-в-таллинне/строительство-и-обслуживание-вентил',
  },
  '/sps-grupp': { en: '/sps-group', ru: '/группа-sps' },
  '/sps-grupp/arvamused': { en: '/sps-group/reviews', ru: '/группа-sps/отзывы' },
  '/tule-meile-toole': { en: '/come-work-for-us', ru: '/приходите-работать-к-нам' },
  '/valikoristus': { en: '/professional-exterior-cleaning', ru: '/профессиональная-внешняя-отделка-в-т' },
  '/valikoristus/akende-pesu': {
    en: '/professional-exterior-cleaning/professional-window-cleaning-in-tallinn',
    ru: '/профессиональная-внешняя-отделка-в-т/mытьe-окон',
  },
  '/valikoristus/fassaadipesu': {
    en: '/professional-exterior-cleaning/professional-facade-cleaning',
    ru: '/профессиональная-внешняя-отделка-в-т/профессиональная-чистка-фасадов-пов',
  },
  '/valikoristus/grafiti-eemaldamine': {
    en: '/professional-exterior-cleaning/graffiti-removal',
    ru: '/профессиональная-внешняя-отделка-в-т/удаление-граффити-быстрое-и-професси',
  },
  '/valikoristus/kojameheteenus': {
    en: '/professional-exterior-cleaning/janitor-service',
    ru: '/профессиональная-внешняя-отделка-в-т/услуги-дворника',
  },
  '/valikoristus/lehtedekoristamine': {
    en: '/professional-exterior-cleaning/leaf-removal',
    ru: '/профессиональная-внешняя-отделка-в-т/уборка-листьев',
  },
  '/valikoristus/lumekoristus': {
    en: '/professional-exterior-cleaning/snow-clearing-in-tallinn-and-harju-county',
    ru: '/профессиональная-внешняя-отделка-в-т/уборка-снега-в-таллинне-и-харьюмаа',
  },
  '/valikoristus/muruniitmine': {
    en: '/professional-exterior-cleaning/lawn-mowing',
    ru: '/профессиональная-внешняя-отделка-в-т/стрижка-газонов',
  },
  '/valikoristus/tanavakivide-pesu-ja-hooldus': {
    en: '/professional-exterior-cleaning/street-paving-washing',
    ru: '/профессиональная-внешняя-отделка-в-т/мойка-и-уход-за-уличной-брусчаткой-стр',
  },
  '/blog': { en: '/blog', ru: '/blog' },
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
  if (locale === 'et') return normalizedEtPath
  const slug = localizedPaths[normalizedEtPath]?.[locale]
  if (slug) return `/${locale}${slug === '/' ? '' : slug}`
  const withoutPrefix = normalizedEtPath.replace(/^\/koristusteenus\//, '/')
  const fallbackSlug = localizedPaths[withoutPrefix]?.[locale]
  if (fallbackSlug) return `/${locale}${fallbackSlug === '/' ? '' : fallbackSlug}`
  return normalizedEtPath
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
