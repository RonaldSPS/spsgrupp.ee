/**
 * Geo-grid: kohaliku (Maps) nähtavuse mõõtmine linnaosa kaupa.
 *
 * Konkurendi pakkumise (Kaardil.ee, okt 2026) heatmap'i vastu: mõõdame ise,
 * kuidas SPS Grupi Google'i äriprofiil paikneb otsingutulemustes erinevates
 * Tallinna/Harjumaa punktides. Igas grid-punktis tehakse Places API (New)
 * Text Search päring koos ~1,5 km asukohabiasiga — positsioon 1–20 on meie
 * kirje järjekorranumber vastuste seas (null = ei esine esimese 20 seas).
 *
 * Täpsus (va lib/__tests__/reporting-geogrid.test.ts ja kokkuvõte AGENTS.md):
 * API järjestab sama "normal ranking stack" loogikaga nagu Maps otsing, aga
 * EI sisalda reklaame ega personaliseerimist — üksikpunkti koht võib Maps
 * UI-st paar positsiooni erineda. Seetõttu loeme trendi (keskmine, top-3/10
 * osakaal), mitte üksikpinde. Iganädalane mõõtmine on sisemise järjepidevuse
 * tõttu usaldusväärne muutuste mõõdik.
 *
 * Auth: GOOGLE_MAPS_API_KEY kui seatud, muidu teenuskonto OAuth (scope
 * maps-platform.places — sama .secrets/gcp-analytics.json / GCP_SERVICE_ACCOUNT_JSON).
 * Eeldus: "Places API (New)" on GCP projektis lubatud + billing aktiivne
 * (Text Search Pro SKU: 5000 tasuta kõnet/kuus — meie maht ~500–800).
 */

import { getGoogleAccessToken } from "./google-auth"
import type { GeoGridKeywordRun, GeoGridPoint, GeoGridSummary } from "./types"

const SCOPES = ["https://www.googleapis.com/auth/maps-platform.places"]
const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
const BIAS_RADIUS_M = 1500
const MAX_RESULTS = 20
/** Väike paus päringute vahel (quota-sõbralik, 27 punkti * 4 märksõna). */
const BETWEEN_REQUESTS_MS = 120

/** Iganädalaselt raportis mõõdetavad märksõnad. */
export const GEOGRID_DEFAULT_KEYWORDS = ["hoolduskoristus", "koristusfirma", "kontori koristus", "koristusteenus"]

/**
 * Fikseeritud mõõtepunktid — linnaosa/asumi keskused (mitte juhuslik ruudustik),
 * et nädalate vahel oleks võrdlus täpne ja admini vaade loetav ("Lasnamäe: 4.").
 * Katab Tallinna linnaosad + lähima Harjumaa (sihtpiirkond direktiivi järgi).
 */
export const GEOGRID_POINTS: GeoGridPoint[] = [
  { key: "kesklinn", label: "Kesklinn", lat: 59.434, lng: 24.7453 },
  { key: "kristiine", label: "Kristiine", lat: 59.4275, lng: 24.7136 },
  { key: "mustamae", label: "Mustamäe (kontor)", lat: 59.4045, lng: 24.6899 },
  { key: "nomme", label: "Nõmme", lat: 59.3897, lng: 24.6836 },
  { key: "haabersti", label: "Haabersti", lat: 59.4232, lng: 24.6438 },
  { key: "pohja-tallinn", label: "Põhja-Tallinn", lat: 59.4426, lng: 24.7216 },
  { key: "ulemiste", label: "Ülemiste", lat: 59.4197, lng: 24.7945 },
  { key: "lasnamae", label: "Lasnamäe", lat: 59.4389, lng: 24.8356 },
  { key: "viimsi", label: "Viimsi", lat: 59.4997, lng: 24.8327 },
  { key: "muuga", label: "Muuga/Maardu", lat: 59.4893, lng: 24.9539 },
  { key: "saue", label: "Saue", lat: 59.3203, lng: 24.5575 },
  { key: "saku", label: "Saku", lat: 59.3016, lng: 24.6639 },
  { key: "juri", label: "Jüri", lat: 59.3607, lng: 24.7723 },
  { key: "tabasalu", label: "Tabasalu", lat: 59.4271, lng: 24.5539 },
  { key: "peetri", label: "Peetri", lat: 59.3942, lng: 24.8103 },
  { key: "kopli", label: "Kopli", lat: 59.4526, lng: 24.6553 },
  { key: "pirita", label: "Pirita", lat: 59.4672, lng: 24.8269 },
  { key: "mustamae-louna", label: "Mustamäe lõuna", lat: 59.3915, lng: 24.6705 },
  { key: "nomme-idaaosa", label: "Harku/Laagri", lat: 59.3685, lng: 24.6175 },
  { key: "vao", label: "Lasnamäe/Vao", lat: 59.4305, lng: 24.8721 },
  { key: "merivaelja", label: "Merivälja", lat: 59.4785, lng: 24.8215 },
  { key: "maardu-linn", label: "Maardu", lat: 59.4778, lng: 25.0061 },
  { key: "kiili", label: "Kiili", lat: 59.3027, lng: 24.8435 },
  { key: "tallinn-ida", label: "Iru/Priisle", lat: 59.4512, lng: 24.8856 },
  { key: "tallinn-louna", label: "Männiku", lat: 59.3845, lng: 24.7155 },
  { key: "rohumae", label: "Rocca al Mare", lat: 59.4335, lng: 24.6605 },
  { key: "kakumae", label: "Kakumäe", lat: 59.4445, lng: 24.5939 },
]

interface PlacesCandidate {
  id?: string
  displayName?: { text?: string }
  websiteUri?: string
}

/** Meie domeeni kontroll hostname'i tasemel (tee/alamdomeen OK, sarnased domeenid mitte). */
function isOurSite(uri: string): boolean {
  try {
    const host = new URL(uri).hostname.toLowerCase()
    return host === "spsgrupp.ee" || host.endsWith(".spsgrupp.ee")
  } catch {
    return false
  }
}

/** Meie kirje tuvastus: domeen on alati tõele lähim; nimi on varuvariant. */
export function findOwnRank(places: PlacesCandidate[]): number | null {
  for (let i = 0; i < places.length; i++) {
    const p = places[i]
    if (p.websiteUri && isOurSite(p.websiteUri)) return i + 1
    const name = (p.displayName?.text ?? "").toLowerCase()
    if (name.includes("sps grupp")) return i + 1
  }
  return null
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Kogu mõõtmise kokkuvõte: null-kohad loetakse top-20-st väljas olevateks. */
export function summarizeRun(points: { rank: number | null }[]): GeoGridSummary {
  const ranks = points.map((p) => p.rank)
  const found = ranks.filter((r): r is number => r !== null)
  const effective = ranks.map((r) => r ?? MAX_RESULTS + 1)
  return {
    found: found.length,
    top3: found.filter((r) => r <= 3).length,
    top10: found.filter((r) => r <= 10).length,
    avgRank: effective.reduce((a, b) => a + b, 0) / Math.max(1, effective.length),
  }
}

function rankDelta(cur: number, prev: number | null | undefined): number | undefined {
  if (prev === null || prev === undefined) return undefined
  return Math.round((cur - prev) * 100) / 100
}

type PlacesAuth = { apiKey: string } | { token: string }

async function placesAuth(): Promise<PlacesAuth> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim()
  if (apiKey) return { apiKey }
  const token = await getGoogleAccessToken(SCOPES)
  return { token }
}

async function searchRankAt(keyword: string, point: GeoGridPoint, auth: PlacesAuth): Promise<number | null> {
  const body = {
    textQuery: keyword,
    languageCode: "et",
    regionCode: "ee",
    maxResultCount: MAX_RESULTS,
    rankPreference: "RELEVANCE",
    locationBias: {
      circle: {
        center: { latitude: point.lat, longitude: point.lng },
        radius: BIAS_RADIUS_M,
      },
    },
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Goog-FieldMask": "places.id,places.displayName,places.websiteUri",
  }
  if ("apiKey" in auth) headers["X-Goog-Api-Key"] = auth.apiKey
  else headers.Authorization = `Bearer ${auth.token}`

  const res = await fetch(SEARCH_URL, { method: "POST", headers, body: JSON.stringify(body) })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Places searchText -> ${res.status}: ${text.slice(0, 300)}`)
  }
  const data = (await res.json()) as { places?: PlacesCandidate[] }
  return findOwnRank(data.places ?? [])
}

/**
 * Mõõdab ühe märksõna kõigis grid-punktides. `prev` = eelmise nädala run
 * (kui eelmine raport geogrid'i sisaldas) — deltad arvutatakse kohe snapshoti
 * sisse, et e-kiri/admin ei peaks eelmist raportit laadima.
 * Üksikpunkti tõrge → rank null; kui KÕIK punktid ebaõnnestuvad (API pole
 * lubatud, auth katki), visatakse viga ja kogu sektsioon jääb raportist välja.
 */
export async function measureGeoGrid(
  keyword: string,
  prev?: { summary: GeoGridSummary } | null,
): Promise<GeoGridKeywordRun> {
  const auth = await placesAuth()
  const points: { key: string; label: string; lat: number; lng: number; rank: number | null }[] = []
  let firstError: unknown = null
  let failures = 0
  for (const point of GEOGRID_POINTS) {
    try {
      const rank = await searchRankAt(keyword, point, auth)
      points.push({ key: point.key, label: point.label, lat: point.lat, lng: point.lng, rank })
    } catch (error) {
      failures++
      if (!firstError) firstError = error
      points.push({ key: point.key, label: point.label, lat: point.lat, lng: point.lng, rank: null })
    }
    await sleep(BETWEEN_REQUESTS_MS)
  }
  if (failures === GEOGRID_POINTS.length) throw firstError instanceof Error ? firstError : new Error(String(firstError))
  const summary = summarizeRun(points)
  return {
    keyword,
    measuredAt: new Date().toISOString(),
    points,
    summary,
    deltaAvgRank: prev ? rankDelta(summary.avgRank, prev.summary.avgRank) : undefined,
    deltaTop10: prev ? rankDelta(summary.top10, prev.summary.top10) : undefined,
    deltaTop3: prev ? rankDelta(summary.top3, prev.summary.top3) : undefined,
  }
}

/** Märksõna sisendi puhastus (on-demand API + vaikimisi nimekiri läbib sama). */
export function normalizeGeoKeyword(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  const kw = raw.trim().toLowerCase().replace(/\s+/g, " ")
  if (kw.length < 2 || kw.length > 80) return null
  // tähed/numbrid/tühik — eesti tähestik lubatud; väldime URI-/päringusüsteeme
  if (!/^[\p{L}\p{M}0-9 ]+$/u.test(kw)) return null
  return kw
}
