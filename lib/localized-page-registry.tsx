import type { ReactNode } from 'react'
import type { Locale } from '@/lib/slug-map'
import { MuruniitminePageView } from '@/app/koristusteenus/valikoristus/muruniitmine/page'
import { KojameheteenusPageView } from '@/app/koristusteenus/valikoristus/kojameheteenus/page'
import { LehtedekoristaminePageView } from '@/app/koristusteenus/valikoristus/lehtedekoristamine/page'
import { LumekoristusPageView } from '@/app/koristusteenus/valikoristus/lumekoristus/page'
import { AkendePesuPageView } from '@/app/koristusteenus/valikoristus/akende-pesu/page'
import { FassaadipesuPageView } from '@/app/koristusteenus/valikoristus/fassaadipesu/page'
import { TanavakividePesuPageView } from '@/app/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus/page'
import { GrafitiEemaldaminePageView } from '@/app/koristusteenus/valikoristus/grafiti-eemaldamine/page'
import { EhitusprahiPageView } from '@/app/ehitusprahi-aravedu/page'
import { PuhastusteenusedPageView } from '@/app/puhastusteenused/page'
import { RemonditeenusedPageView } from '@/app/remonditeenused-tallinnas/page'
import { VaipadePuhastusPageView } from '@/app/puhastusteenused/vaipade-puhastus/page'
import { EhitusjargneKoristusPageView } from '@/app/puhastusteenused/ehitusjargne-koristus/page'
import { EskalaatoriteSuvapuhastusPageView } from '@/app/puhastusteenused/eskalaatorite-suvapuhastus/page'
import { DesinfitseeriminePageView } from '@/app/puhastusteenused/desinfitseerimine/page'
import { PorandateHooldusPageView } from '@/app/puhastusteenused/porandate-hooldus/page'
import { SuitsuJaTulekahjustustePuhastaminePageView } from '@/app/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine/page'
import { ElektritoodPageView } from '@/app/remonditeenused-tallinnas/elektritood/page'
import { TorutoodPageView } from '@/app/remonditeenused-tallinnas/torutood/page'
import { SiseviimistlustoodPageView } from '@/app/remonditeenused-tallinnas/siseviimistlustood/page'
import { SanitaarremontPageView } from '@/app/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus/page'
import { VentilatsioonidPageView } from '@/app/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus/page'
import { PlaatinistoodPageView } from '@/app/remonditeenused-tallinnas/plaatimistood/page'
import { KatuseRemontPageView } from '@/app/remonditeenused-tallinnas/katuse-remont/page'
import { LammutustoodPageView } from '@/app/remonditeenused-tallinnas/lammutustood/page'
import { ValikoristusPageView } from '@/app/koristusteenus/valikoristus/page'
import { KontaktPageView } from '@/app/kontakt/page'
import { SpsGruppPageView } from '@/app/sps-grupp/page'
import { KontoriKoristusPageView } from '@/app/koristusteenus/kontori-koristus/page'
import { KaubanduspindadeKoristusPageView } from '@/app/koristusteenus/kaubanduspindade-koristus/page'
import { TootmishooneteKoristusPageView } from '@/app/koristusteenus/tootmishoonete-koristus/page'
import { KoolideKoristaminePageView } from '@/app/koristusteenus/koolide-koristamine/page'
import { KoristusteenusPageView } from '@/app/koristusteenus/page'
import { TuleMeileToolePageView } from '@/app/tule-meile-toole/page'

export type LocalizedPageRenderer = (locale: Locale) => ReactNode

export const localizedPageRegistry: Record<string, LocalizedPageRenderer> = {
  '/koristusteenus/valikoristus/muruniitmine': (locale) => <MuruniitminePageView locale={locale} />,
  '/koristusteenus/valikoristus/kojameheteenus': (locale) => <KojameheteenusPageView locale={locale} />,
  '/koristusteenus/valikoristus/lehtedekoristamine': (locale) => <LehtedekoristaminePageView locale={locale} />,
  '/koristusteenus/valikoristus/lumekoristus': (locale) => <LumekoristusPageView locale={locale} />,
  '/koristusteenus/valikoristus/akende-pesu': (locale) => <AkendePesuPageView locale={locale} />,
  '/koristusteenus/valikoristus/fassaadipesu': (locale) => <FassaadipesuPageView locale={locale} />,
  '/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus': (locale) => <TanavakividePesuPageView locale={locale} />,
  '/koristusteenus/valikoristus/grafiti-eemaldamine': (locale) => <GrafitiEemaldaminePageView locale={locale} />,
  '/ehitusprahi-aravedu': (locale) => <EhitusprahiPageView locale={locale} />,
  '/puhastusteenused': (locale) => <PuhastusteenusedPageView locale={locale} />,
  '/remonditeenused-tallinnas': (locale) => <RemonditeenusedPageView locale={locale} />,
  '/puhastusteenused/vaipade-puhastus': (locale) => <VaipadePuhastusPageView locale={locale} />,
  '/puhastusteenused/ehitusjargne-koristus': (locale) => <EhitusjargneKoristusPageView locale={locale} />,
  '/puhastusteenused/eskalaatorite-suvapuhastus': (locale) => <EskalaatoriteSuvapuhastusPageView locale={locale} />,
  '/puhastusteenused/koroonaviiruse-jargne-puhastus': (locale) => <DesinfitseeriminePageView locale={locale} />,
  '/puhastusteenused/porandate-hooldus': (locale) => <PorandateHooldusPageView locale={locale} />,
  '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine': (locale) => <SuitsuJaTulekahjustustePuhastaminePageView locale={locale} />,
  '/remonditeenused-tallinnas/elektritood': (locale) => <ElektritoodPageView locale={locale} />,
  '/remonditeenused-tallinnas/torutood': (locale) => <TorutoodPageView locale={locale} />,
  '/remonditeenused-tallinnas/siseviimistlustood': (locale) => <SiseviimistlustoodPageView locale={locale} />,
  '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus': (locale) => <SanitaarremontPageView locale={locale} />,
  '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus': (locale) => <VentilatsioonidPageView locale={locale} />,
  '/remonditeenused-tallinnas/plaatimistood': (locale) => <PlaatinistoodPageView locale={locale} />,
  '/remonditeenused-tallinnas/katuse-remont': (locale) => <KatuseRemontPageView locale={locale} />,
  '/remonditeenused-tallinnas/lammutustood': (locale) => <LammutustoodPageView locale={locale} />,
  '/koristusteenus/valikoristus': (locale) => <ValikoristusPageView locale={locale} />,
  '/kontakt': (locale) => <KontaktPageView locale={locale} />,
  '/sps-grupp': (locale) => <SpsGruppPageView locale={locale} />,
  '/koristusteenus/kontori-koristus': (locale) => <KontoriKoristusPageView locale={locale} />,
  '/koristusteenus/kaubanduspindade-koristus': (locale) => <KaubanduspindadeKoristusPageView locale={locale} />,
  '/koristusteenus/tootmishoonete-koristus': (locale) => <TootmishooneteKoristusPageView locale={locale} />,
  '/koolide-koristamine': (locale) => <KoolideKoristaminePageView locale={locale} />,
  '/koristusteenus': (locale) => <KoristusteenusPageView locale={locale} />,
  '/tule-meile-toole': (locale) => <TuleMeileToolePageView locale={locale} />,
}
