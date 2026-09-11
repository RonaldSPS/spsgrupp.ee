/**
 * SPS Grupi püsiv turunduse põhieesmärk — kliendi kirjalik direktiiv
 * (11.09.2026, vastus nädalaraporti küsimustele). AINUS tõeallikas —
 * insights.ts ja llm.ts impordivad siit, et iga nädalaraport ja
 * tegevuskava oleks selle eesmärgiga raamistatud. Kui klient muudab
 * strateegiat, muuda SIIN (ja kontrolli AGENTS.md vastvat punkti).
 *
 * Tulevikku: päringud-admin'i „Tasu"/„Kasum" veerud (realiseeritud
 * pakkumiste arv ja hind) on lepingu väärtuse ja lubatava päringu hinna
 * (CPL) arvutuse andmeallikas — klient 11.09.2026: „Täna pole seda vaja".
 * Kui arvutused käivitada, rakendada need siinse eesmärgi raamistusse.
 */

/** Põhieesmärk — kõik kanalid (SEO, Ads, sisu, e-post) teenivad seda. */
export const PRIMARY_GOAL =
  "B2B regulaarse hoolduskoristuse lepingud: ettevõttekliendid pikaajaliste, korduvate püsimaksetega — mida suurem objekt, seda parem. Ühekordsed tööd (ehitusjärgne koristus, akende pesu, suurpuhastus jm) on teisejärgulised."

/** Sihtpiirkond — kliendi direktiiv: AINULT Tallinn ja Harjumaa. */
export const TARGET_REGION = "Tallinn ja Harjumaa"
/** Lühike vorm reklaami-/sisutekstide jaoks („Tallinnas ja Harjumaal"). */
export const TARGET_REGION_SHORT = "Tallinnas ja Harjumaal"

/**
 * Segmendid/päringud, mida EI taheta (välja arvata brändi- ja
 * teenuse-päringud): Ads'is negatiivseteks märksõnadeks, SEO-s/sisus
 * ei prioriseerita.
 */
export const DEPRIORITIZED_SEGMENTS = [
  "B2C kodu/korter (kodukoristus, kodupuhastus, kolimiskoristus, madratsite puhastus, airbnb koristus)",
  "surmajärgne koristus",
  "vihmaveerennide puhastus",
  "tööotsija-intendid (palk, tööpakkumine, koolitus, cv, tööülesanded)",
  "piirkonnavälised päringud (Tartu, Pärnu, Valga jne — teeninduspiirkond on ainult Tallinn+Harjumaa)",
] as const

/**
 * Negatiivsed märksõnanimekirjad pole ühekordne töö: broad-match
 * märksõnad tõmbavad uusi soovimatuid termineid sisse ka pärast
 * välistamist → iganädalane otsinguterminite läbivaatus on kohustuslik
 * (toetab: nädalaraporti „kulutab ilma konversioonideta" reegel +
 * Ads'i search-terms vaade). Seis 11.09.2026: ülalolevad segmendid on
 * põhikampaanias juba negatiivsetena lisatud.
 */
export const NEGATIVE_KEYWORDS_MAINTENANCE =
  "Negatiivseid nimekirju hooldatakse iganädalaselt (broad match toob uusi soovimatuid termineid pidevalt sisse)."

/**
 * Konkurentide brändinimedega päringud (sol, kleenest, luuclean,
 * smartclean, rentokil jt): põhikampaaniates NEGATIIVSED. Tavapraktika
 * oleks eraldi eelarvega konkurendi-kampaania, aga SPS-i varasem
 * konkurendi-kampaania pole päringuteks konverteerunud — otsus
 * 11.09.2026: EI prioriseerita; taastada ainult teadliku otsuse ja
 * eraldi piiratud eelarvega.
 */
export const COMPETITOR_BRAND_POLICY =
  "Konkurentide brändinimed: põhikampaaniates välistatud; eraldi konkurendi-kampaania ajalooliselt nõrgalt konverteerinud — ei prioriseerita."

/**
 * Valmis kontekstiplokk LLM-i süsteemprompti ja käsitsi koostatavate
 * tegevuskavade päisesse — hoiab eesmärgi pidevalt silme ees.
 */
export const STRATEGY_CONTEXT = `PÕHIEESMÄRK (kliendi püsiv direktiiv 11.09.2026 — raami KÕIK prioriteedid ja soovitused selle järgi):
- ${PRIMARY_GOAL}
- Sihtpiirkond: AINULT ${TARGET_REGION}.
- Soovimatud segmendid (Ads: negatiivsed märksõnad; SEO/sisu: ei prioriseerita): ${DEPRIORITIZED_SEGMENTS.join("; ")}. ${COMPETITOR_BRAND_POLICY}
- B2B nõudlus ei istu ainult sõnas „hoolduskoristus" (maht on väike), vaid kogu regulaarse koristuse klastris: kontori koristus, kontorikoristus, büroo koristus, äripindade koristus, trepikoja koristus, kojamehe teenus.`
