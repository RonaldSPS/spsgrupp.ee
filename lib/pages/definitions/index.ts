import type { ServiceDetailDefs } from '@/app/components/templates/ServiceDetailTemplate'
import { serviceDetail as valikoristus } from './valikoristus'
import { serviceDetail as akendePesu } from './akende-pesu'
import { serviceDetail as fassaadipesu } from './fassaadipesu'
import { serviceDetail as grafitiEemaldamine } from './grafiti-eemaldamine'
import { serviceDetail as kojameheteenus } from './kojameheteenus'
import { serviceDetail as lehtedekoristamine } from './lehtedekoristamine'
import { serviceDetail as lumekoristus } from './lumekoristus'
import { serviceDetail as muruniitmine } from './muruniitmine'
import { serviceDetail as tanavakividePesuJaHooldus } from './tanavakivide-pesu-ja-hooldus'
import { serviceDetail as puhastusteenused } from './puhastusteenused'
import { serviceDetail as ehitusjargneKoristus } from './ehitusjargne-koristus'
import { serviceDetail as eskalaatoriteSuvapuhastus } from './eskalaatorite-suvapuhastus'
import { serviceDetail as desinfitseerimine } from './desinfitseerimine'
import { serviceDetail as porandateHooldus } from './porandate-hooldus'
import { serviceDetail as suitsuJaTulekahjustustePuhastamine } from './suitsu-ja-tulekahjustuste-puhastamine'
import { serviceDetail as vaipadePuhastus } from './vaipade-puhastus'
import { serviceDetail as remonditeenusedTallinnas } from './remonditeenused-tallinnas'
import { serviceDetail as elektritood } from './elektritood'
import { serviceDetail as katuseRemont } from './katuse-remont'
import { serviceDetail as lammutustood } from './lammutustood'
import { serviceDetail as plaatimistood } from './plaatimistood'
import { serviceDetail as sanitaarremontJaUmberehitus } from './sanitaarremont-ja-umberehitus'
import { serviceDetail as siseviimistlustood } from './siseviimistlustood'
import { serviceDetail as torutood } from './torutood'
import { serviceDetail as ventilatsioonideEhitusJaHooldus } from './ventilatsioonide-ehitus-ja-hooldus'
import { serviceDetail as ehitusprahiAravedu } from './ehitusprahi-aravedu'
import { serviceDetail as hoolduskoristus } from './hoolduskoristus'
import { serviceDetail as suurpuhastus } from './suurpuhastus'

/**
 * Every ServiceDetailTemplate-backed page (26) mapped to its content definition.
 * Page shells import their definition directly; this index exists for
 * build-time validation (scripts/i18n-validate.ts section 5) and tooling.
 */
export const serviceDetailByEtPath: Record<string, ServiceDetailDefs> = {
  '/koristusteenus/valikoristus': valikoristus,
  '/koristusteenus/valikoristus/akende-pesu': akendePesu,
  '/koristusteenus/valikoristus/fassaadipesu': fassaadipesu,
  '/koristusteenus/valikoristus/grafiti-eemaldamine': grafitiEemaldamine,
  '/koristusteenus/valikoristus/kojameheteenus': kojameheteenus,
  '/koristusteenus/valikoristus/lehtedekoristamine': lehtedekoristamine,
  '/koristusteenus/valikoristus/lumekoristus': lumekoristus,
  '/koristusteenus/valikoristus/muruniitmine': muruniitmine,
  '/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus': tanavakividePesuJaHooldus,
  '/puhastusteenused': puhastusteenused,
  '/puhastusteenused/ehitusjargne-koristus': ehitusjargneKoristus,
  '/puhastusteenused/eskalaatorite-suvapuhastus': eskalaatoriteSuvapuhastus,
  '/puhastusteenused/koroonaviiruse-jargne-puhastus': desinfitseerimine,
  '/puhastusteenused/porandate-hooldus': porandateHooldus,
  '/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine': suitsuJaTulekahjustustePuhastamine,
  '/puhastusteenused/vaipade-puhastus': vaipadePuhastus,
  '/remonditeenused-tallinnas': remonditeenusedTallinnas,
  '/remonditeenused-tallinnas/elektritood': elektritood,
  '/remonditeenused-tallinnas/katuse-remont': katuseRemont,
  '/remonditeenused-tallinnas/lammutustood': lammutustood,
  '/remonditeenused-tallinnas/plaatimistood': plaatimistood,
  '/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus': sanitaarremontJaUmberehitus,
  '/remonditeenused-tallinnas/siseviimistlustood': siseviimistlustood,
  '/remonditeenused-tallinnas/torutood': torutood,
  '/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus': ventilatsioonideEhitusJaHooldus,
  '/ehitusprahi-aravedu': ehitusprahiAravedu,
  '/koristusteenus/hoolduskoristus': hoolduskoristus,
  '/puhastusteenused/suurpuhastus': suurpuhastus,
}
