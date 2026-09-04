import type enMessages from '@/messages/en.json'

/**
 * Single authoritative registry of public pages.
 *
 * Every public page declares its canonical Estonian path, localized EN/RU
 * slugs, optional parent (for breadcrumbs), content namespace (messages/*.json)
 * and hero image. All other page maps (slug lookups, namespace maps, hero
 * images) are derived from this list - do not duplicate path data elsewhere.
 *
 * Pages with `localized: false` (e.g. blog) have no EN/RU URLs and are
 * excluded from slug lookups, sitemap alternates and language switching.
 */

export type ContentNamespace = keyof typeof enMessages

export interface PublicPageEntry {
  /** Canonical Estonian path (no trailing slash, root = '/'). */
  etPath: string
  /** English slug (without locale prefix). Null when not localized. */
  en: string | null
  /** Russian slug (without locale prefix). Null when not localized. */
  ru: string | null
  /** Parent page etPath for breadcrumb generation. */
  parent?: string
  /** Content namespace in messages/*.json (EN/RU page content). */
  namespace?: ContentNamespace
  /** Hero/OG image path. */
  heroImage?: string
  /** False when the page intentionally has no EN/RU versions. */
  localized: boolean
}

export const publicPages: PublicPageEntry[] = [
  { etPath: '/', en: '/', ru: '/', localized: true },
  { etPath: '/andmekaitsetingimused', en: '/privacy-policy', ru: '/политика-конфиденциальности', namespace: 'privacyPolicy', localized: true },
  { etPath: '/ehitusprahi-aravedu', en: '/construction-waste-removal', ru: '/вывоз-строительного-мусора', heroImage: '/ehitusprahi-aravedu-1.jpg', localized: true },
  { etPath: '/kontakt', en: '/contact-sps-group', ru: '/свяжитесь-с-sps-group', heroImage: '/FrontHeroCar.jpg', localized: true },
  { etPath: '/koolide-koristamine', en: '/cleaning-services-in-tallinn/school-cleaning', ru: '/услуги-по-уборке-в-таллинне/уборка-школ', parent: '/koristusteenus', namespace: 'koolideKoristamine', heroImage: '/koolide-koristamine4.jpg', localized: true },
  { etPath: '/koristusteenus', en: '/cleaning-services-in-tallinn', ru: '/услуги-по-уборке-в-таллинне', namespace: 'koristusteenus', heroImage: '/Koristusteenused-HERO.jpg', localized: true },
  { etPath: '/koristusteenus/kontori-koristus', en: '/cleaning-services-in-tallinn/office-cleaning', ru: '/услуги-по-уборке-в-таллинне/уборка-офисов', parent: '/koristusteenus', namespace: 'kontoriKoristus', heroImage: '/kontorikoristus1.jpg', localized: true },
  { etPath: '/koristusteenus/hoolduskoristus', en: '/cleaning-services-in-tallinn/regular-cleaning', ru: '/услуги-по-уборке-в-таллинне/регулярная-уборка', parent: '/koristusteenus', heroImage: '/Koristusteenused-HERO.jpg', localized: true },
  { etPath: '/koristusteenus/kaubanduspindade-koristus', en: '/cleaning-services-in-tallinn/retail-cleaning', ru: '/услуги-по-уборке-в-таллинне/уборка-торговых-помещений', parent: '/koristusteenus', namespace: 'kaubanduspindadeKoristus', heroImage: '/kaubanduspindade-koristus.jpg', localized: true },
  { etPath: '/koristusteenus/tootmishoonete-koristus', en: '/cleaning-services-in-tallinn/industrial-cleaning', ru: '/услуги-по-уборке-в-таллинне/уборка-промышленных-зданий', parent: '/koristusteenus', namespace: 'tootmishooneteKoristus', heroImage: '/tootmishoonete-koristus.webp', localized: true },
  { etPath: '/puhastusteenused', en: '/specialist-cleaning-services', ru: '/клининговые-услуги-для-бизнеса', heroImage: '/puhastusteenused1.jpg', localized: true },
  { etPath: '/puhastusteenused/ehitusjargne-koristus', en: '/specialist-cleaning-services/post-construction-cleaning', ru: '/клининговые-услуги-для-бизнеса/послестроительная-уборка', parent: '/puhastusteenused', heroImage: '/ehitusjargne-koristus-1.jpg', localized: true },
  { etPath: '/puhastusteenused/eskalaatorite-suvapuhastus', en: '/specialist-cleaning-services/escalator-deep-cleaning', ru: '/клининговые-услуги-для-бизнеса/глубокая-чистка-эскалаторов', parent: '/puhastusteenused', heroImage: '/eskalaatorite-suvapuhastus-1.jpg', localized: true },
  { etPath: '/puhastusteenused/koroonaviiruse-jargne-puhastus', en: '/specialist-cleaning-services/disinfection', ru: '/клининговые-услуги-для-бизнеса/дезинфекция', parent: '/puhastusteenused', heroImage: '/desinfitseerimine-1.jpg', localized: true },
  { etPath: '/puhastusteenused/porandate-hooldus', en: '/specialist-cleaning-services/floor-maintenance', ru: '/клининговые-услуги-для-бизнеса/уход-за-полами', parent: '/puhastusteenused', heroImage: '/porandate-hooldus-1.webp', localized: true },
  { etPath: '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine', en: '/specialist-cleaning-services/fire-and-smoke-damage-cleaning', ru: '/клининговые-услуги-для-бизнеса/уборка-после-пожара', parent: '/puhastusteenused', heroImage: '/tulekahjustus1.jpg', localized: true },
  { etPath: '/puhastusteenused/vaipade-puhastus', en: '/specialist-cleaning-services/carpet-cleaning', ru: '/клининговые-услуги-для-бизнеса/чистка-ковров', parent: '/puhastusteenused', heroImage: '/vaipade-puhastus-1.webp', localized: true },
  { etPath: '/puhastusteenused/suurpuhastus', en: '/specialist-cleaning-services/deep-cleaning', ru: '/клининговые-услуги-для-бизнеса/генеральная-уборка', parent: '/puhastusteenused', heroImage: '/puhastusteenused1.jpg', localized: true },
  { etPath: '/remonditeenused-tallinnas', en: '/repair-services-in-tallinn', ru: '/услуги-по-ремонту-в-таллинне', heroImage: '/remonditeenused-1.jpg', localized: true },
  { etPath: '/remonditeenused-tallinnas/elektritood', en: '/repair-services-in-tallinn/electrical-works', ru: '/услуги-по-ремонту-в-таллинне/электромонтажные-работы', parent: '/remonditeenused-tallinnas', heroImage: '/images/elekter/ElekterHero.webp', localized: true },
  { etPath: '/remonditeenused-tallinnas/katuse-remont', en: '/repair-services-in-tallinn/roof-repairs', ru: '/услуги-по-ремонту-в-таллинне/ремонт-крыши', parent: '/remonditeenused-tallinnas', heroImage: '/katuseremont-1.jpg', localized: true },
  { etPath: '/remonditeenused-tallinnas/lammutustood', en: '/repair-services-in-tallinn/demolition', ru: '/услуги-по-ремонту-в-таллинне/снос', parent: '/remonditeenused-tallinnas', heroImage: '/lammutustood-1.jpg', localized: true },
  { etPath: '/remonditeenused-tallinnas/plaatimistood', en: '/repair-services-in-tallinn/tiling', ru: '/услуги-по-ремонту-в-таллинне/укладка-плитки', parent: '/remonditeenused-tallinnas', heroImage: '/plaatimistood-1.jpg', localized: true },
  { etPath: '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus', en: '/repair-services-in-tallinn/washroom-renovation', ru: '/услуги-по-ремонту-в-таллинне/ремонт-санузлов', parent: '/remonditeenused-tallinnas', heroImage: '/sanitaarremont-1.jpg', localized: true },
  { etPath: '/remonditeenused-tallinnas/siseviimistlustood', en: '/repair-services-in-tallinn/interior-finishing', ru: '/услуги-по-ремонту-в-таллинне/внутренняя-отделка', parent: '/remonditeenused-tallinnas', heroImage: '/siseviimistlus-1.jpg', localized: true },
  { etPath: '/remonditeenused-tallinnas/torutood', en: '/repair-services-in-tallinn/plumbing', ru: '/услуги-по-ремонту-в-таллинне/сантехнические-работы', parent: '/remonditeenused-tallinnas', heroImage: '/torutood-1.jpg', localized: true },
  { etPath: '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus', en: '/repair-services-in-tallinn/ventilation-installation-and-maintenance', ru: '/услуги-по-ремонту-в-таллинне/монтаж-и-обслуживание-вентиляции', parent: '/remonditeenused-tallinnas', heroImage: '/ventilatsioon-1.jpg', localized: true },
  { etPath: '/sps-grupp', en: '/sps-group', ru: '/группа-sps', heroImage: '/FrontHeroCar.jpg', localized: true },
  { etPath: '/sps-grupp/arvamused', en: '/sps-group/reviews', ru: '/группа-sps/отзывы', parent: '/sps-grupp', namespace: 'reviews', heroImage: '/images/arvamused.jpg', localized: true },
  { etPath: '/tule-meile-toole', en: '/come-work-for-us', ru: '/приходите-работать-к-нам', namespace: 'careers', heroImage: '/tuletoole-1.jpg', localized: true },
  { etPath: '/koristusteenus/valikoristus', en: '/outdoor-cleaning-and-grounds-care', ru: '/уборка-и-обслуживание-территорий', parent: '/koristusteenus', heroImage: '/Valikoristus-1.jpg', localized: true },
  { etPath: '/koristusteenus/valikoristus/akende-pesu', en: '/outdoor-cleaning-and-grounds-care/window-cleaning', ru: '/уборка-и-обслуживание-территорий/мойка-окон', parent: '/koristusteenus/valikoristus', heroImage: '/akende-pesu-1.jpg', localized: true },
  { etPath: '/koristusteenus/valikoristus/fassaadipesu', en: '/outdoor-cleaning-and-grounds-care/facade-cleaning', ru: '/уборка-и-обслуживание-территорий/мойка-фасадов', parent: '/koristusteenus/valikoristus', heroImage: '/fassaadipesu1.jpg', localized: true },
  { etPath: '/koristusteenus/valikoristus/grafiti-eemaldamine', en: '/outdoor-cleaning-and-grounds-care/graffiti-removal', ru: '/уборка-и-обслуживание-территорий/удаление-граффити', parent: '/koristusteenus/valikoristus', heroImage: '/graffiti-eemaldamine-1.jpg', localized: true },
  { etPath: '/koristusteenus/valikoristus/kojameheteenus', en: '/outdoor-cleaning-and-grounds-care/groundskeeping', ru: '/уборка-и-обслуживание-территорий/услуги-дворника', parent: '/koristusteenus/valikoristus', heroImage: '/kojameheteenus-1.jpg', localized: true },
  { etPath: '/koristusteenus/valikoristus/lehtedekoristamine', en: '/outdoor-cleaning-and-grounds-care/leaf-removal', ru: '/уборка-и-обслуживание-территорий/уборка-листьев', parent: '/koristusteenus/valikoristus', heroImage: '/lehekoristus-1.webp', localized: true },
  { etPath: '/koristusteenus/valikoristus/lumekoristus', en: '/outdoor-cleaning-and-grounds-care/snow-clearing', ru: '/уборка-и-обслуживание-территорий/уборка-снега', parent: '/koristusteenus/valikoristus', heroImage: '/lumelykkamine-1.jpg', localized: true },
  { etPath: '/koristusteenus/valikoristus/muruniitmine', en: '/outdoor-cleaning-and-grounds-care/lawn-mowing', ru: '/уборка-и-обслуживание-территорий/стрижка-газонов', parent: '/koristusteenus/valikoristus', heroImage: '/muruniitmine-1.webp', localized: true },
  { etPath: '/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus', en: '/outdoor-cleaning-and-grounds-care/paving-stone-cleaning', ru: '/уборка-и-обслуживание-территорий/мойка-тротуарной-плитки', parent: '/koristusteenus/valikoristus', heroImage: '/tanavakividepesu-1.jpg', localized: true },
  { etPath: '/blog', en: null, ru: null, localized: false },
]

export const publicPageByEtPath: Record<string, PublicPageEntry> = Object.fromEntries(
  publicPages.map((page) => [page.etPath, page]),
)

/** Pages that have ET, EN and RU URLs. */
export const localizedPages = publicPages.filter((page) => page.localized)
