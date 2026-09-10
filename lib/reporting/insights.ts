/**
 * Rule-based insights engine ("turundusreeglid") — deterministic Estonian
 * findings + next actions derived from the snapshot. Thresholds and framing
 * follow the manual weekly reports (raportid/): ±2 pos = stabiilne, <10
 * näitamist/nädal = statistiline müra, DB päringud = tõde, pre-launch
 * baasjoon 9,0 klikki/päevas, päringute eesmärk ≥15/kuu.
 *
 * The LLM narrative (llm.ts) gets these insights + the digest as input, so
 * the model prioritizes/phrases — the facts always come from here.
 */

import type {
  AdsData,
  FormsData,
  Ga4Data,
  GscData,
  Insight,
  KeywordFamilyStat,
  ReportSnapshot,
} from "./types"

/** Pre-launch organic baseline (20.07–16.08.2026): 9,0 GSC klikki päevas. */
const PRE_LAUNCH_CLICKS_PER_DAY = 9.0
/** Monthly real-inquiry target => weekly equivalent. */
const WEEKLY_CONTACT_GOAL = 4
/** Below this many weekly impressions a family stat is statistical noise. */
const NOISE_IMPRESSIONS = 10

const round1 = (n: number) => Math.round(n * 10) / 10
const fmtPos = (p: number | null | undefined) => (p === null || p === undefined ? "–" : round1(p).toFixed(1).replace(".", ","))
const pctChange = (cur: number, prev: number): number | null =>
  prev === 0 ? (cur > 0 ? 100 : null) : ((cur - prev) / prev) * 100

function gscInsights(gsc: GscData, out: Insight[]): void {
  const curPerDay = gsc.current.clicks / gsc.current.days
  const prevPerDay = gsc.previous.clicks / gsc.previous.days
  const clicksDelta = pctChange(curPerDay, prevPerDay)

  if (clicksDelta !== null && clicksDelta <= -15) {
    out.push({
      area: "seo",
      severity: "negative",
      title: `Orgaanilised klikid languses (${round1(curPerDay)} → ${round1(prevPerDay)} klikki/päevas, ${Math.round(clicksDelta)} %)`,
      detail: "GSC klikkide päevamaht kukkus võrreldes eelmise nädalaga üle 15 %.",
      action: "Kontrolli peatabeli langenud perekondi: kas langus on ühes klastris või laiem? Ühe klastri langus → vaata selle kandjalehte; laiem langus → kontrolli indekseerimist (GSC Pages) ja võimalikke tehnilisi tõrkeid.",
    })
  } else if (clicksDelta !== null && clicksDelta >= 15) {
    out.push({
      area: "seo",
      severity: "positive",
      title: `Orgaanilised klikid tõusmas (${round1(prevPerDay)} → ${round1(curPerDay)} klikki/päevas, +${Math.round(clicksDelta)} %)`,
      detail: "GSC klikkide päevamaht kasvab nädalaga üle 15 %.",
      action: "Tuvasta tõusu kandjad peatabelist ja kinnita tõus nende lehtede sisu/linkidega — tõusvad lehed reageerivad täiendustele kõige kiiremini.",
    })
  }

  if (curPerDay < PRE_LAUNCH_CLICKS_PER_DAY) {
    out.push({
      area: "seo",
      severity: "warning",
      title: `Klikkide päevamaht (${round1(curPerDay)}) on alla uue-lehe-eelse baasjoone (${PRE_LAUNCH_CLICKS_PER_DAY})`,
      detail: "Baasjoon 9,0 klikki/päevas on fikseeritud perioodist 20.07–16.08.2026 (enne uut lehte).",
      action: "Prioritiseeri suurima mahuga löögkaugus-perekonnad (pos 4–15) — need annavad kiireima klikkide tagasitõusu.",
    })
  }

  /* --- keyword families --- */
  const families = gsc.families.filter((f) => f.current.impressions > 0 || f.previous.impressions > 0)
  const noisy = (f: KeywordFamilyStat) =>
    f.current.impressions < NOISE_IMPRESSIONS && f.previous.impressions < NOISE_IMPRESSIONS

  const risers = families.filter((f) =>
    !noisy(f) && f.current.position !== null && f.previous.position !== null &&
    f.previous.position - f.current.position >= 3)
  const fallers = families.filter((f) =>
    !noisy(f) && f.current.position !== null && f.previous.position !== null &&
    f.current.position - f.previous.position >= 3)
  const striking = families.filter((f) =>
    !noisy(f) && f.current.position !== null && f.current.position >= 4 && f.current.position <= 15 &&
    f.current.impressions >= 30)
  const lowCtr = families.filter((f) =>
    !noisy(f) && f.current.impressions >= 60 && f.current.position !== null && f.current.position <= 10 &&
    f.current.impressions > 0 && f.current.clicks / f.current.impressions < 0.015)

  for (const f of risers.slice(0, 5)) {
    out.push({
      area: "seo",
      severity: "positive",
      title: `„${f.label}" tõusis ${fmtPos(f.previous.position)} → ${fmtPos(f.current.position)}`,
      detail: `${f.current.impressions} näitamist, ${f.current.clicks} klikki sel nädalal.`,
      action: "Kinnita tõus: värskenda kandjalehte (värske kuupäev sisus, täiendav lõik/FAQ) ja lisa 1–2 siselist linki märksõna-ankruga.",
    })
  }
  for (const f of fallers.slice(0, 5)) {
    out.push({
      area: "seo",
      severity: "negative",
      title: `„${f.label}" langes ${fmtPos(f.previous.position)} → ${fmtPos(f.current.position)}`,
      detail: `${f.current.impressions} näitamist sel nädalal (eelmine: ${f.previous.impressions}).`,
      action: "Kontrolli, milline leht päringuid kannab (GSC → Lehed) — kas Google vahetab kandjalehte? Kui kandja on sama, tugevda lehe sisu ja siselinke; kui kandja vahetub, suuna siselinkidega õigele lehele.",
    })
  }
  for (const f of striking.slice(0, 4)) {
    out.push({
      area: "seo",
      severity: "opportunity",
      title: `Löögkaugusel: „${f.label}" pos ${fmtPos(f.current.position)} (${f.current.impressions} näitamist/nädal)`,
      detail: "Positsioon 4–15 korral piisab esimesele lehele tõusmiseks sageli sisu- ja lingitööst.",
      action: `Täienda „${f.label}" kandjalehte: laienda sisu (mahud, hinnad, protsess, FAQ), optimeeri title/meta ja lisa siselinke hub-lehelt.`,
    })
  }
  for (const f of lowCtr.slice(0, 3)) {
    const ctr = (f.current.clicks / f.current.impressions) * 100
    out.push({
      area: "seo",
      severity: "opportunity",
      title: `Madal CTR hea positsiooni juures: „${f.label}" (${ctr.toFixed(1).replace(".", ",")} %, pos ${fmtPos(f.current.position)})`,
      detail: `${f.current.impressions} näitamist, aga vaid ${f.current.clicks} klikki — esilehel olemine ei too klikke.`,
      action: "Kirjuta title + meta description ümber: number/aasta, konkreetne kasu (nt „tasuta hindamine 24h“), piirkond. CTR-rünnaku meetod on varem tõestanud (kogu saidi CTR 2,4 % → 2,9 %).",
    })
  }

  /* --- new queries = new keyword/blog candidates --- */
  const fresh = gsc.newQueries.slice(0, 6)
  if (fresh.length > 0) {
    const list = fresh.map((q) => `„${q.query}" (${q.impressions} näitamist, pos ${fmtPos(q.position)})`).join(", ")
    out.push({
      area: "seo",
      severity: "opportunity",
      title: `${fresh.length} uut päringut on ilmunud nähtavusele`,
      detail: list,
      action: "Vaata päringud läbi: kas mõnele pole meil eraldi lehte? Mahukamale uuele päringule kaalu eraldi lehte või blogipostitust; olemasoleva lehe päringud lisa lehe sisse (FAQ või alapealkiri).",
    })
  }
}

function ga4Insights(ga4: Ga4Data, out: Insight[]): void {
  /* Tracking health first — broken measurement invalidates everything else. */
  if (ga4.daily.length > 0) {
    const avg = ga4.daily.reduce((s, d) => s + d.sessions, 0) / ga4.daily.length
    const deadDays = ga4.daily.filter((d) => d.sessions < 20).length
    if (avg < 20 || deadDays >= 2) {
      out.push({
        area: "ga4",
        severity: "negative",
        title: `GA4 mõõtmine võib olla katki (keskmiselt ${round1(avg)} sessiooni/päevas, ${deadDays} päeva alla 20)`,
        detail: "Tavapärane tase on 30–50 sessiooni/päevas. Alla 20/päevas = tracking-tõrge (vt CSP/consent/GTM), mitte liikluse langus.",
        action: "Kontrolli GTM-i laadimist live-is (DevTools → Network: gtm.js), CSP päiseid ja consent-mode'i. Ära tõlgenda selle nädala GA4-numbreid enne taastumist.",
      })
      return // further GA4 conclusions are unreliable
    }
  }

  const sessDelta = pctChange(ga4.current.sessions, ga4.previous.sessions)
  if (sessDelta !== null && sessDelta <= -15) {
    out.push({
      area: "ga4",
      severity: "warning",
      title: `Sessioonid languses (${ga4.previous.sessions} → ${ga4.current.sessions}, ${Math.round(sessDelta)} %)`,
      detail: "Kogu liiklus on nädalaga kahanenud üle 15 %.",
      action: "Võrdle kanalite lõikes: kui langus on orgaanilises, vaata GSC peatabelit; kui tasulises, kontrolli Ads kampaaniate seisu ja eelarvet.",
    })
  } else if (sessDelta !== null && sessDelta >= 15) {
    out.push({
      area: "ga4",
      severity: "positive",
      title: `Sessioonid kasvamas (${ga4.previous.sessions} → ${ga4.current.sessions}, +${Math.round(sessDelta)} %)`,
      detail: "Kogu liiklus kasvab nädalaga üle 15 %.",
      action: "Tuvasta kasvukanal ja -lehed (kanalite tabel + top-lehed) ning suuna kasvu toonud lehtedele rohkem siselinke ja sisu.",
    })
  }

  const engDelta = (ga4.current.engagementRate - ga4.previous.engagementRate) * 100
  if (ga4.previous.engagementRate > 0 && engDelta <= -5) {
    out.push({
      area: "ga4",
      severity: "warning",
      title: `Kaasatus langes ${engDelta.toFixed(1).replace(".", ",")} protsendipunkti`,
      detail: `Engagement rate ${(ga4.previous.engagementRate * 100).toFixed(1).replace(".", ",")} % → ${(ga4.current.engagementRate * 100).toFixed(1).replace(".", ",")} %.`,
      action: "Vaata top-lehtede sisu: kas maandujad leiavad kohe teenuse, hinna ja kontakti? Nõrgad lehed vajavad selgemat pakkumist ja üles-kutseid.",
    })
  }
}

function adsInsights(ads: AdsData, out: Insight[]): void {
  if (!ads.available) return
  const t = ads.totals
  if (t.cost === 0 && t.impressions === 0) {
    out.push({
      area: "ads",
      severity: "warning",
      title: "Google Ads'is polnud sel nädalal liiklust",
      detail: "Ükski kampaania ei teinud kulu ega näitamisi.",
      action: "Kontrolli Ads'is, kas kampaaniad on peatatud, eelarve on otsas või arveldus ebaõnnestus.",
    })
    return
  }

  for (const c of ads.campaigns) {
    if ((c.budgetLostIS ?? 0) >= 0.2) {
      out.push({
        area: "ads",
        severity: "opportunity",
        title: `„${c.name}" kaotab ${Math.round((c.budgetLostIS ?? 0) * 100)} % nähtavusest eelarve tõttu`,
        detail: `Näitamisosa ${c.impressionShare !== null ? Math.round(c.impressionShare * 100) + " %" : "–"}, kulu ${c.cost.toFixed(2).replace(".", ",")} € nädalas.`,
        action: "Kui kampaania konversioonid on tasuvad, tõsta päevaeelarvet — kaotatud näitamised on otseselt kaotatud päringud.",
      })
    }
    if ((c.rankLostIS ?? 0) >= 0.3) {
      out.push({
        area: "ads",
        severity: "warning",
        title: `„${c.name}" kaotab ${Math.round((c.rankLostIS ?? 0) * 100)} % nähtavusest madala reklaamikoha tõttu (konkurentsisurve)`,
        detail: "Rank-lost impression share = kaotame oksjonil kvaliteedi/korra pärast, mitte eelarve pärast — konkurendid pakuvad rohkem või nende reklaamid on asjakohasemad.",
        action: "Paranda reklaamide asjakohasust (märksõna pealkirja), lisa laiendusi (sitelinkid, callout'id) ja kontrolli Quality Score'u madalaid märksõnu — see tõstab kohta ilma eelarvet tõstmata.",
      })
    }
  }

  const nonBrandShare = t.cost > 0 ? ads.nonBrand.cost / t.cost : 0
  if (ads.brand.cost > 0 && nonBrandShare < 0.5) {
    out.push({
      area: "ads",
      severity: "opportunity",
      title: `${Math.round((1 - nonBrandShare) * 100)} % Ads-eelarvest läheb brändipäringutele`,
      detail: `Brändi-klikid oleks enamasti tulnud ka orgaaniliselt (pos 1). Brändikulu ${ads.brand.cost.toFixed(2).replace(".", ",")} € vs mitte-brändi ${ads.nonBrand.cost.toFixed(2).replace(".", ",")} €.`,
      action: "Kaalu brändikampaania eelarve kärpimist miinimumini ja raha suunamist mitte-brändi teenusepäringutesse, kus orgaaniline positsioon on nõrk (vt peatabel pos 10+).",
    })
  }

  const wasted = ads.topTerms.filter((x) => !isBrand(x.term) && x.cost >= 10 && x.conversions === 0).slice(0, 5)
  if (wasted.length > 0) {
    const list = wasted.map((x) => `„${x.term}" (${x.cost.toFixed(2).replace(".", ",")} €)`).join(", ")
    out.push({
      area: "ads",
      severity: "warning",
      title: `${wasted.length} mitte-brändi päringut kulutavad raha ilma konversioonideta`,
      detail: list,
      action: "Kui päringud ei sobi teenusevalikusse, lisa negatiivseteks märksõnadeks; kui sobivad, aga ei konverteeri, vaata maandumislehe pakkumist.",
    })
  }

  const winners = ads.topTerms.filter((x) => !isBrand(x.term) && x.conversions >= 1).slice(0, 5)
  if (winners.length > 0) {
    const list = winners.map((x) => `„${x.term}" (${x.conversions} konv, ${x.cost.toFixed(2).replace(".", ",")} €)`).join(", ")
    out.push({
      area: "ads",
      severity: "opportunity",
      title: "Konverteerivad mitte-brändi päringud — kandke orgaanikasse",
      detail: list,
      action: "Kontrolli, kas neil päringutel on orgaaniline leht ja positsioon. Kui orgaaniline koht on nõrk, täienda lehte või loo eraldi sihtleht — Ads tõestab, et päring konverteerib.",
    })
  }

  const lowQs = ads.keywords.filter((k) => k.qualityScore !== null && k.qualityScore <= 4 && k.impressions >= 20).slice(0, 4)
  for (const k of lowQs) {
    out.push({
      area: "ads",
      severity: "warning",
      title: `Quality Score ${k.qualityScore}/10: „${k.keyword}"`,
      detail: `${k.impressions} näitamist, CPC tõenäoliselt ülehinnatud madala kvaliteedi tõttu.`,
      action: "Kontrolli oodatud CTR-i, reklaami asjakohasust ja maandumislehte — lisa märksõna reklaami pealkirja ja maandumislehe pealkirja.",
    })
  }
}

function isBrand(term: string): boolean {
  return /\bsps\b|sps[\s-]?(grupp|group)/i.test(term)
}

function formsInsights(forms: FormsData, ads: AdsData | null, out: Insight[]): void {
  const c = forms.current
  const p = forms.previous

  if (c.contact < WEEKLY_CONTACT_GOAL) {
    out.push({
      area: "forms",
      severity: "warning",
      title: `Kontaktpäringuid tuli ${c.contact} (eesmärk ≥${WEEKLY_CONTACT_GOAL}/nädal = ≥15/kuu)`,
      detail: `Eelmine nädal: ${p.contact}. Päris päringud (DB) on konversioonide tõde — GA4 key events'i ei kasutata topelt-loenduse tõttu.`,
      action: "Kui liiklus on korras, aga päringuid pole, on probleem konversioonis: lihtsusta vormi (vähem välju), too kontaktandmed lehe üles ja lisa usaldussignaale (klientide logod, arvustused).",
    })
  } else {
    out.push({
      area: "forms",
      severity: "positive",
      title: `Kontaktpäringuid tuli ${c.contact} (eesmärk ≥${WEEKLY_CONTACT_GOAL}/nädal täidetud)`,
      detail: `Eelmine nädal: ${p.contact}${c.feeTotal > 0 ? ` · tasu kokku ${c.feeTotal.toFixed(2).replace(".", ",")} €` : ""}${c.profitTotal > 0 ? ` · kasum ${c.profitTotal.toFixed(2).replace(".", ",")} €` : ""}.`,
      action: "Hoia kursis, millistelt lehtedelt päringud tulevad (lehe-tabel allpool) — tugevda neid lehti veelgi.",
    })
  }

  if (c.gclidLeads > 0 && ads?.available && ads.totals.cost > 0) {
    const cpl = ads.totals.cost / c.gclidLeads
    out.push({
      area: "forms",
      severity: cpl > 80 ? "warning" : "positive",
      title: `Ads tootis ${c.gclidLeads} päringut — hind ${cpl.toFixed(2).replace(".", ",")} €/päring`,
      detail: `Ads-kulu nädalas ${ads.totals.cost.toFixed(2).replace(".", ",")} €, gclid-ga seotud kontaktpäringud ${c.gclidLeads}. Märkus: gclid puudub, kui reklaamipõhine nõusolek puudub — tegelik arv võib olla suurem.`,
      action: cpl > 80
        ? "Päringu hind on kõrge: kontrolli otsinguterminite tabelit ja lisa mitte-konverteerivad terminid negatiivseteks; suuna eelarve konverteerivatele terminitele."
        : "Päringu hind on tasuv — skaleeri: tõsta eelarvet kampaaniatel, mis neid päringuid toovad.",
    })
  } else if (ads?.available && ads.totals.clicks >= 20 && c.gclidLeads === 0 && c.contact === 0) {
    out.push({
      area: "forms",
      severity: "negative",
      title: `Ads tõi ${ads.totals.clicks} klikki, aga päringuid on 0`,
      detail: "Klikid ei muutu päringuteks — kas maandumisleht või vorm on probleem (või nõusoleku tõttu puudub gclid ja seost ei mõõdeta).",
      action: "Testi vormi käsitsi, kontrolli maandumislehe laadimiskiirust mobiilis ja too telefoninumber silmatorkavamalt esile.",
    })
  }

  const total = c.contact + c.career + c.spam
  if (total > 0 && c.spam / total >= 0.5) {
    out.push({
      area: "forms",
      severity: "warning",
      title: `Spämmi osakaal ${Math.round((c.spam / total) * 100)} % vormidest`,
      detail: `${c.spam} spämm-päringut ${total}-st — Turnstile + sisufilter töötavad, aga rünnak on kasvanud.`,
      action: "Kui spämm kordub samadelt domeenidelt, lisa need lib/spam.ts blokinimekirja; kaalu Turnstile'i nähtavat režiimi ajutiselt.",
    })
  }
}

function strategyInsights(snapshot: ReportSnapshot, out: Insight[]): void {
  const { gsc, ads, forms } = snapshot

  /* Content gap: families with impressions but no owned page above pos 20. */
  if (gsc) {
    const gaps = gsc.families.filter((f) =>
      f.current.impressions >= 25 &&
      (f.current.position === null || f.current.position > 20))
    if (gaps.length > 0) {
      const list = gaps.map((f) => `„${f.label}" (${f.current.impressions} näitamist, pos ${fmtPos(f.current.position)})`).join(", ")
      out.push({
        area: "strategy",
        severity: "opportunity",
        title: `Sisuauk: ${gaps.length} perekond on nähtav, aga positsioon >20`,
        detail: list,
        action: "Loo eraldi teenuseleht või kirjuta blogipostitus, mis vastab päringu kavatsusele; lingi hub-lehelt ja menüüst. Blogi sobib infootsingutele („kuidas“, „hind“), teenuseleht ostsooviga päringutele.",
      })
    }
  }

  /* Seasonal / channel diversification nudges, grounded in the data. */
  if (ads?.available && forms) {
    const totalLeads = forms.current.contact
    const adsShare = ads.totals.cost > 0 && forms.current.gclidLeads > 0
      ? forms.current.gclidLeads / Math.max(totalLeads, 1)
      : 0
    if (adsShare >= 0.5 && totalLeads > 0) {
      out.push({
        area: "strategy",
        severity: "opportunity",
        title: `Üle poole päringutest sõltub tasulisest liiklusest`,
        detail: `gclid-päringud ${forms.current.gclidLeads} / ${totalLeads} kokku (alampiir — nõusolekuta klikke ei mõõdeta). Tasulise liikluse sõltuvus on risk.`,
        action: "Tasakaalusta: (1) SEO — löögkaugus-perekondade sisu; (2) e-posti kampaania olemasolevatele klientidele (hooajaline hoolduskoristuse pakkumine); (3) kaalu Meta/Facebook kampaaniat B2C segmentidesse (nt akende pesu, suurpuhastus) — madalam CPC kui otsingus.",
      })
    }
  }

  if (forms && forms.current.contact === 0 && forms.previous.contact === 0) {
    out.push({
      area: "strategy",
      severity: "opportunity",
      title: "Kaks nädalat ilma kontaktpäringuteta — vaja aktiivset nõudluse loomist",
      detail: "Orgaaniline + tasuline liiklus ei too praegu päringuid.",
      action: "Aktiivsed kanalid: saada olemasolevatele klientidele e-kiri (sügishooaja hoolduskoristus / akende pesu enne talve), loo Meta-kampaania Tartu/Tallinna B2C sihtrühmale ja vaata üle avalehe pakkumine.",
    })
  }
}

export function buildInsights(snapshot: ReportSnapshot): Insight[] {
  const out: Insight[] = []
  if (snapshot.gsc) gscInsights(snapshot.gsc, out)
  if (snapshot.ga4) ga4Insights(snapshot.ga4, out)
  if (snapshot.ads) adsInsights(snapshot.ads, out)
  if (snapshot.forms) formsInsights(snapshot.forms, snapshot.ads, out)
  strategyInsights(snapshot, out)

  const order: Record<Insight["severity"], number> = { negative: 0, warning: 1, opportunity: 2, positive: 3 }
  return out.sort((a, b) => order[a.severity] - order[b.severity])
}
