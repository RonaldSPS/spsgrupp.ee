/**
 * Search Console pulls for the weekly report: totals, full query sets for
 * both weeks (needed for family aggregation + position movement), top pages,
 * and query×page rows (maandumisleht = which landing page Google serves per
 * query — used for carrier-page insights and carrier-swap detection).
 * Methodology matches the manual reports: family position = impression-weighted
 * average over the query family (raportid/RAPORTI-KOOSTAMINE-JUHEND.md §8).
 */

import { getGoogleAccessToken, postJson, type ReportPeriod } from "./google-auth"
import { computeFamilyStats, findNewQueries } from "./keyword-families"
import type { GscData, GscPage, GscQuery, GscQueryPage, GscTotals } from "./types"

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
/** Full query set (the manual pipeline pulled 5000/period too). */
const QUERY_ROW_LIMIT = 5000
/** Query×page rows — the cartesian set is larger than the query set. */
const QUERY_PAGE_ROW_LIMIT = 25000
/** How many current-period queries are kept in the stored snapshot. */
const SNAPSHOT_QUERY_LIMIT = 100

interface GscRow {
  keys?: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}
interface GscResponse {
  rows?: GscRow[]
}

function daysBetween(start: string, end: string): number {
  const ms = new Date(`${end}T00:00:00Z`).getTime() - new Date(`${start}T00:00:00Z`).getTime()
  return Math.round(ms / 86_400_000) + 1
}

function toQuery(row: GscRow): GscQuery {
  return {
    query: row.keys?.[0] ?? "?",
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }
}

function toQueryPage(row: GscRow): GscQueryPage {
  return {
    query: row.keys?.[0] ?? "?",
    page: row.keys?.[1] ?? "?",
    clicks: row.clicks,
    impressions: row.impressions,
    position: row.position,
  }
}

export async function pullGsc(period: ReportPeriod): Promise<GscData> {
  const siteUrl = process.env.GSC_SITE_URL
  if (!siteUrl) throw new Error("GSC_SITE_URL is not set")
  const token = await getGoogleAccessToken(SCOPES)
  const site = encodeURIComponent(siteUrl)
  const query = (body: Record<string, unknown>) =>
    postJson<GscResponse>(`https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`, token, body)

  const toTotals = (rows: GscRow[] | undefined, days: number): GscTotals => {
    const t = rows?.[0]
    return {
      clicks: t?.clicks ?? 0,
      impressions: t?.impressions ?? 0,
      ctr: t?.ctr ?? 0,
      position: t?.position ?? 0,
      days,
    }
  }

  const [totalsCur, totalsPrev, queriesCur, queriesPrev, pagesCur, queryPageCur, queryPagePrev] = await Promise.all([
    query({ startDate: period.start, endDate: period.end, dimensions: [] }),
    query({ startDate: period.prevStart, endDate: period.prevEnd, dimensions: [] }),
    query({ startDate: period.start, endDate: period.end, dimensions: ["query"], rowLimit: QUERY_ROW_LIMIT }),
    query({ startDate: period.prevStart, endDate: period.prevEnd, dimensions: ["query"], rowLimit: QUERY_ROW_LIMIT }),
    query({ startDate: period.start, endDate: period.end, dimensions: ["page"], rowLimit: 25 }),
    query({ startDate: period.start, endDate: period.end, dimensions: ["query", "page"], rowLimit: QUERY_PAGE_ROW_LIMIT }),
    query({ startDate: period.prevStart, endDate: period.prevEnd, dimensions: ["query", "page"], rowLimit: QUERY_PAGE_ROW_LIMIT }),
  ])

  const curQueries = (queriesCur.rows ?? []).map(toQuery)
  const prevQueries = (queriesPrev.rows ?? []).map(toQuery)
  const byImpressions = [...curQueries].sort((a, b) => b.impressions - a.impressions)
  const qpCur = (queryPageCur.rows ?? []).map(toQueryPage)
  const qpPrev = (queryPagePrev.rows ?? []).map(toQueryPage)

  const topPages: GscPage[] = (pagesCur.rows ?? []).map((r) => ({
    page: r.keys?.[0] ?? "?",
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }))

  return {
    current: toTotals(totalsCur.rows, daysBetween(period.start, period.end)),
    previous: toTotals(totalsPrev.rows, daysBetween(period.prevStart, period.prevEnd)),
    topQueries: byImpressions.slice(0, SNAPSHOT_QUERY_LIMIT),
    prevQueries,
    topPages,
    families: computeFamilyStats(curQueries, prevQueries, qpCur, qpPrev),
    newQueries: findNewQueries(curQueries, prevQueries, 10, qpCur).slice(0, 25),
  }
}
