import etMessages from '@/messages/et.json'
import enMessages from '@/messages/en.json'
import ruMessages from '@/messages/ru.json'
import type { Locale } from '@/lib/slug-map'

export type LocalizedContentNamespace = keyof typeof etMessages

const messagesByLocale = {
  et: etMessages,
  en: enMessages,
  ru: ruMessages,
} as const

export const contentNamespacesByPath: Record<string, LocalizedContentNamespace> = {
  '/kontakt': 'kontakt',
  '/andmekaitsetingimused': 'privacyPolicy',
  '/ehitusprahi-aravedu': 'ehitusprahiAravedu',
  '/koolide-koristamine': 'koolideKoristamine',
  '/koristusteenus': 'koristusteenus',
  '/koristusteenus/kontori-koristus': 'kontoriKoristus',
  '/koristusteenus/kaubanduspindade-koristus': 'kaubanduspindadeKoristus',
  '/koristusteenus/tootmishoonete-koristus': 'tootmishooneteKoristus',
  '/puhastusteenused': 'puhastusteenused',
  '/puhastusteenused/ehitusjargne-koristus': 'ehitusjargneKoristus',
  '/puhastusteenused/eskalaatorite-suvapuhastus': 'eskalaatoriteSuvapuhastus',
  '/puhastusteenused/koroonaviiruse-jargne-puhastus': 'desinfitseerimine',
  '/puhastusteenused/porandate-hooldus': 'porandateHooldus',
  '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine': 'suitsuJaTulekahjustustePuhastamine',
  '/puhastusteenused/vaipade-puhastus': 'vaipadePuhastus',
  '/remonditeenused-tallinnas': 'remonditeenusedTallinnas',
  '/remonditeenused-tallinnas/elektritood': 'elektritood',
  '/remonditeenused-tallinnas/katuse-remont': 'katuseRemont',
  '/remonditeenused-tallinnas/lammutustood': 'lammutustood',
  '/remonditeenused-tallinnas/plaatimistood': 'plaatimistood',
  '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus': 'sanitaarremontJaUmberehitus',
  '/remonditeenused-tallinnas/siseviimistlustood': 'siseviimistlustood',
  '/remonditeenused-tallinnas/torutood': 'torutood',
  '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus': 'ventilatsioonideEhitusJaHooldus',
  '/sps-grupp': 'spsGrupp',
  '/sps-grupp/arvamused': 'reviews',
  '/tule-meile-toole': 'careers',
  '/koristusteenus/valikoristus': 'valikoristus',
  '/koristusteenus/valikoristus/akende-pesu': 'akendePesu',
  '/koristusteenus/valikoristus/fassaadipesu': 'fassaadipesu',
  '/koristusteenus/valikoristus/grafiti-eemaldamine': 'grafitiEemaldamine',
  '/koristusteenus/valikoristus/kojameheteenus': 'kojameheteenus',
  '/koristusteenus/valikoristus/lehtedekoristamine': 'lehtedekoristamine',
  '/koristusteenus/valikoristus/lumekoristus': 'lumekoristus',
  '/koristusteenus/valikoristus/muruniitmine': 'muruniitmine',
  '/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus': 'tanavakividePesuJaHooldus',
}

export const heroImagesByPath: Record<string, string> = {
  '/ehitusprahi-aravedu': '/ehitusprahi-aravedu-1.jpg',
  '/kontakt': '/FrontHeroCar.jpg',
  '/koolide-koristamine': '/koolide-koristamine4.jpg',
  '/koristusteenus': '/Koristusteenused-HERO.jpg',
  '/koristusteenus/kontori-koristus': '/kontorikoristus1.jpg',
  '/koristusteenus/kaubanduspindade-koristus': '/kaubanduspindade-koristus.jpg',
  '/koristusteenus/tootmishoonete-koristus': '/tootmishoonete-koristus.webp',
  '/puhastusteenused': '/puhastusteenused1.jpg',
  '/puhastusteenused/ehitusjargne-koristus': '/ehitusjargne-koristus-1.jpg',
  '/puhastusteenused/eskalaatorite-suvapuhastus': '/eskalaatorite-suvapuhastus-1.jpg',
  '/puhastusteenused/koroonaviiruse-jargne-puhastus': '/desinfitseerimine-1.jpg',
  '/puhastusteenused/porandate-hooldus': '/porandate-hooldus-1.webp',
  '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine': '/tulekahjustus1.jpg',
  '/puhastusteenused/vaipade-puhastus': '/vaipade-puhastus-1.webp',
  '/remonditeenused-tallinnas': '/remonditeenused-1.jpg',
  '/remonditeenused-tallinnas/elektritood': '/images/elekter/ElekterHero.webp',
  '/remonditeenused-tallinnas/katuse-remont': '/katuseremont-1.jpg',
  '/remonditeenused-tallinnas/lammutustood': '/lammutustood-1.jpg',
  '/remonditeenused-tallinnas/plaatimistood': '/plaatimistood-1.jpg',
  '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus': '/sanitaarremont-1.jpg',
  '/remonditeenused-tallinnas/siseviimistlustood': '/siseviimistlus-1.jpg',
  '/remonditeenused-tallinnas/torutood': '/torutood-1.jpg',
  '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus': '/ventilatsioon-1.jpg',
  '/sps-grupp': '/FrontHeroCar.jpg',
  '/sps-grupp/arvamused': '/images/arvamused.jpg',
  '/tule-meile-toole': '/tuletoole-1.jpg',
  '/koristusteenus/valikoristus': '/Valikoristus-1.jpg',
  '/koristusteenus/valikoristus/akende-pesu': '/akende-pesu-1.jpg',
  '/koristusteenus/valikoristus/fassaadipesu': '/fassaadipesu1.jpg',
  '/koristusteenus/valikoristus/grafiti-eemaldamine': '/graffiti-eemaldamine-1.jpg',
  '/koristusteenus/valikoristus/kojameheteenus': '/kojameheteenus-1.jpg',
  '/koristusteenus/valikoristus/lehtedekoristamine': '/lehekoristus-1.webp',
  '/koristusteenus/valikoristus/lumekoristus': '/lumelykkamine-1.jpg',
  '/koristusteenus/valikoristus/muruniitmine': '/muruniitmine-1.webp',
  '/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus': '/tanavakividepesu-1.jpg',
}

export function getContentNamespace(etPath: string): LocalizedContentNamespace | undefined {
  return contentNamespacesByPath[etPath]
}

export function getLocalizedContent(locale: Locale, namespace: LocalizedContentNamespace): unknown {
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
