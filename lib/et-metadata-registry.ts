/**
 * ET route metadata, sourced from the pass-through layout.tsx files that used to
 * carry metadata for the ET static routes (moved to app/_pages during the
 * [locale] restructure). Imported as module exports so rendered <head> bytes
 * stay identical to the pre-restructure routes.
 *
 * Paths NOT here (served via pageMetadata + generateLocalizedMetadata instead,
 * matching the old [...slug] catch-all behavior):
 *   /andmekaitsetingimused, /koolide-koristamine
 */
import type { Metadata } from 'next'

export const etLayoutMetadata: Record<string, () => Promise<{ metadata?: Metadata }>> = {
  '/ehitusprahi-aravedu': () => import('@/app/_pages/ehitusprahi-aravedu/layout'),
  '/kontakt': () => import('@/app/_pages/kontakt/layout'),
  '/koristusteenus': () => import('@/app/_pages/koristusteenus/layout'),
  '/koristusteenus/kaubanduspindade-koristus': () => import('@/app/_pages/koristusteenus/kaubanduspindade-koristus/layout'),
  '/koristusteenus/kontori-koristus': () => import('@/app/_pages/koristusteenus/kontori-koristus/layout'),
  '/koristusteenus/tootmishoonete-koristus': () => import('@/app/_pages/koristusteenus/tootmishoonete-koristus/layout'),
  '/koristusteenus/valikoristus': () => import('@/app/_pages/koristusteenus/valikoristus/layout'),
  '/koristusteenus/valikoristus/akende-pesu': () => import('@/app/_pages/koristusteenus/valikoristus/akende-pesu/layout'),
  '/koristusteenus/valikoristus/fassaadipesu': () => import('@/app/_pages/koristusteenus/valikoristus/fassaadipesu/layout'),
  '/koristusteenus/valikoristus/grafiti-eemaldamine': () => import('@/app/_pages/koristusteenus/valikoristus/grafiti-eemaldamine/layout'),
  '/koristusteenus/valikoristus/kojameheteenus': () => import('@/app/_pages/koristusteenus/valikoristus/kojameheteenus/layout'),
  '/koristusteenus/valikoristus/lehtedekoristamine': () => import('@/app/_pages/koristusteenus/valikoristus/lehtedekoristamine/layout'),
  '/koristusteenus/valikoristus/lumekoristus': () => import('@/app/_pages/koristusteenus/valikoristus/lumekoristus/layout'),
  '/koristusteenus/valikoristus/muruniitmine': () => import('@/app/_pages/koristusteenus/valikoristus/muruniitmine/layout'),
  '/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus': () => import('@/app/_pages/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus/layout'),
  '/puhastusteenused': () => import('@/app/_pages/puhastusteenused/layout'),
  '/puhastusteenused/ehitusjargne-koristus': () => import('@/app/_pages/puhastusteenused/ehitusjargne-koristus/layout'),
  '/puhastusteenused/eskalaatorite-suvapuhastus': () => import('@/app/_pages/puhastusteenused/eskalaatorite-suvapuhastus/layout'),
  '/puhastusteenused/porandate-hooldus': () => import('@/app/_pages/puhastusteenused/porandate-hooldus/layout'),
  '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine': () => import('@/app/_pages/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine/layout'),
  '/puhastusteenused/vaipade-puhastus': () => import('@/app/_pages/puhastusteenused/vaipade-puhastus/layout'),
  '/remonditeenused-tallinnas': () => import('@/app/_pages/remonditeenused-tallinnas/layout'),
  '/remonditeenused-tallinnas/elektritood': () => import('@/app/_pages/remonditeenused-tallinnas/elektritood/layout'),
  '/remonditeenused-tallinnas/katuse-remont': () => import('@/app/_pages/remonditeenused-tallinnas/katuse-remont/layout'),
  '/remonditeenused-tallinnas/lammutustood': () => import('@/app/_pages/remonditeenused-tallinnas/lammutustood/layout'),
  '/remonditeenused-tallinnas/plaatimistood': () => import('@/app/_pages/remonditeenused-tallinnas/plaatimistood/layout'),
  '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus': () => import('@/app/_pages/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus/layout'),
  '/remonditeenused-tallinnas/siseviimistlustood': () => import('@/app/_pages/remonditeenused-tallinnas/siseviimistlustood/layout'),
  '/remonditeenused-tallinnas/torutood': () => import('@/app/_pages/remonditeenused-tallinnas/torutood/layout'),
  '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus': () => import('@/app/_pages/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus/layout'),
  '/sps-grupp': () => import('@/app/_pages/sps-grupp/layout'),
  '/sps-grupp/arvamused': () => import('@/app/_pages/sps-grupp/arvamused/layout'),
  '/tule-meile-toole': () => import('@/app/_pages/tule-meile-toole/layout'),
}
