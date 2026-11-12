/**
 * Arvustuste logode failinimi -> kliendi (ettevõtte) nimi.
 *
 * Üks tõeallikas: TestimonialCards kasutab seda logo alt-tekstiks ja
 * Review JSON-LD `author.worksFor` väljana (AI-leitavus/AEO — varem kandsid
 * logod alt-tekstina autori eesnime, nii et ettevõtte nimi jäi masinatele
 * nähtamatuks). Nimed on tuvastatud logo failide sisust (11/2026) ja
 * kattuvad avalike kliendilogodega (Estravel = Paul Lushkov, vt ka
 * app/(et)/kliendilood/stories.ts).
 *
 * Kui admin lisab uue arvustuse koos uue logoga (spsadmn -> arvamused),
 * lisa siia uue logo faili jaoks vastav rida - muidu jääb alt-tekstiks
 * autori nimi ja Review-skeemis firmainfo puudu.
 */
export const TESTIMONIAL_COMPANY_BY_LOGO: Record<string, string> = {
  "/arvamused-logod/elis.png": "Bigbank",
  "/arvamused-logod/eve.png": "Tallinna Lennujaam",
  "/arvamused-logod/heigar.png": "Leibur",
  "/arvamused-logod/heido.png": "Fazer",
  "/arvamused-logod/ingrid.png": "PZU",
  "/arvamused-logod/juta.png": "Tallinna Reaalkool",
  "/arvamused-logod/kaiti.png": "Inspired",
  "/arvamused-logod/kalev.png": "Eesti Kunstiakadeemia",
  "/arvamused-logod/karl.png": "Tallinna Linnavaraamet",
  "/arvamused-logod/kathlin.png": "Tallinna Loomeinkubaator",
  "/arvamused-logod/katlin.png": "Riigi Infosüsteemi Amet",
  "/arvamused-logod/katri.png": "Baibiino",
  "/arvamused-logod/kelly.png": "Viru Elektrikaubandus",
  "/arvamused-logod/kersti.png": "Eesti Raudtee",
  "/arvamused-logod/krista.png": "3 Group",
  "/arvamused-logod/liis.png": "Eugesta",
  "/arvamused-logod/madis.png": "Elering",
  "/arvamused-logod/maiki.png": "Norma",
  "/arvamused-logod/marek.png": "Ericsson",
  "/arvamused-logod/mati.png": "LogistikaPluss",
  "/arvamused-logod/olev.png": "COOR",
  "/arvamused-logod/paul.png": "Estravel",
  "/arvamused-logod/pille.png": "Tallinna XXI Kool",
  "/arvamused-logod/reet.png": "Coop",
  "/arvamused-logod/renat.png": "HHLA TK Estonia",
  "/arvamused-logod/sirje.png": "Tallinna Kopli Huvikool",
}

export function testimonialCompany(logo?: string): string | undefined {
  return logo ? TESTIMONIAL_COMPANY_BY_LOGO[logo] : undefined
}
