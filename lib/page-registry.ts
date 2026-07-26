import type { ComponentType } from 'react'

export interface PageEntry {
  load: () => Promise<ComponentType<Record<string, unknown>>>
}

const registry: Record<string, PageEntry> = {
  '/': { load: () => import('@/app/page').then((m) => m.default) },
  '/andmekaitsetingimused': { load: () => import('@/app/privaatsus/page').then((m) => m.default) },
  '/ehitusprahi-aravedu': { load: () => import('@/app/ehitusprahi-aravedu/page').then((m) => m.default) },
  '/kontakt': { load: () => import('@/app/kontakt/page').then((m) => m.default) },
  '/koolide-koristamine': { load: () => import('@/app/koristusteenus/koolide-koristamine/page').then((m) => m.default) },
  '/koristusteenus': { load: () => import('@/app/koristusteenus/page').then((m) => m.default) },
  '/koristusteenus/kontori-koristus': { load: () => import('@/app/koristusteenus/kontori-koristus/page').then((m) => m.default) },
  '/koristusteenus/kaubanduspindade-koristus': { load: () => import('@/app/koristusteenus/kaubanduspindade-koristus/page').then((m) => m.default) },
  '/koristusteenus/tootmishoonete-koristus': { load: () => import('@/app/koristusteenus/tootmishoonete-koristus/page').then((m) => m.default) },
  '/puhastusteenused': { load: () => import('@/app/puhastusteenused/page').then((m) => m.default) },
  '/puhastusteenused/ehitusjargne-koristus': { load: () => import('@/app/puhastusteenused/ehitusjargne-koristus/page').then((m) => m.default) },
  '/puhastusteenused/eskalaatorite-suvapuhastus': { load: () => import('@/app/puhastusteenused/eskalaatorite-suvapuhastus/page').then((m) => m.default) },
  '/puhastusteenused/koroonaviiruse-jargne-puhastus': { load: () => import('@/app/puhastusteenused/desinfitseerimine/page').then((m) => m.default) },
  '/puhastusteenused/porandate-hooldus': { load: () => import('@/app/puhastusteenused/porandate-hooldus/page').then((m) => m.default) },
  '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine': { load: () => import('@/app/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine/page').then((m) => m.default) },
  '/puhastusteenused/vaipade-puhastus': { load: () => import('@/app/puhastusteenused/vaipade-puhastus/page').then((m) => m.default) },
  '/remonditeenused-tallinnas': { load: () => import('@/app/remonditeenused-tallinnas/page').then((m) => m.default) },
  '/remonditeenused-tallinnas/elektritood': { load: () => import('@/app/remonditeenused-tallinnas/elektritood/page').then((m) => m.default) },
  '/remonditeenused-tallinnas/katuse-remont': { load: () => import('@/app/remonditeenused-tallinnas/katuse-remont/page').then((m) => m.default) },
  '/remonditeenused-tallinnas/lammutustood': { load: () => import('@/app/remonditeenused-tallinnas/lammutustood/page').then((m) => m.default) },
  '/remonditeenused-tallinnas/plaatimistood': { load: () => import('@/app/remonditeenused-tallinnas/plaatimistood/page').then((m) => m.default) },
  '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus': { load: () => import('@/app/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus/page').then((m) => m.default) },
  '/remonditeenused-tallinnas/siseviimistlustood': { load: () => import('@/app/remonditeenused-tallinnas/siseviimistlustood/page').then((m) => m.default) },
  '/remonditeenused-tallinnas/torutood': { load: () => import('@/app/remonditeenused-tallinnas/torutood/page').then((m) => m.default) },
  '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus': { load: () => import('@/app/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus/page').then((m) => m.default) },
  '/sps-grupp': { load: () => import('@/app/sps-grupp/page').then((m) => m.default) },
  '/sps-grupp/arvamused': { load: () => import('@/app/sps-grupp/arvamused/page').then((m) => m.default) },
  '/tule-meile-toole': { load: () => import('@/app/tule-meile-toole/page').then((m) => m.default) },
  '/koristusteenus/valikoristus': { load: () => import('@/app/koristusteenus/valikoristus/page').then((m) => m.default) },
  '/koristusteenus/valikoristus/akende-pesu': { load: () => import('@/app/koristusteenus/valikoristus/akende-pesu/page').then((m) => m.default) },
  '/koristusteenus/valikoristus/fassaadipesu': { load: () => import('@/app/koristusteenus/valikoristus/fassaadipesu/page').then((m) => m.default) },
  '/koristusteenus/valikoristus/grafiti-eemaldamine': { load: () => import('@/app/koristusteenus/valikoristus/grafiti-eemaldamine/page').then((m) => m.default) },
  '/koristusteenus/valikoristus/kojameheteenus': { load: () => import('@/app/koristusteenus/valikoristus/kojameheteenus/page').then((m) => m.default) },
  '/koristusteenus/valikoristus/lehtedekoristamine': { load: () => import('@/app/koristusteenus/valikoristus/lehtedekoristamine/page').then((m) => m.default) },
  '/koristusteenus/valikoristus/lumekoristus': { load: () => import('@/app/koristusteenus/valikoristus/lumekoristus/page').then((m) => m.default) },
  '/koristusteenus/valikoristus/muruniitmine': { load: () => import('@/app/koristusteenus/valikoristus/muruniitmine/page').then((m) => m.default) },
  '/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus': { load: () => import('@/app/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus/page').then((m) => m.default) },
  '/blog': { load: () => import('@/app/blog/page').then((m) => m.default) },
}

export async function getPage(etPath: string): Promise<ComponentType<Record<string, unknown>> | undefined> {
  const entry = registry[etPath]
  if (!entry) return undefined
  return entry.load()
}

export function getAllPaths(): string[] {
  return Object.keys(registry)
}
