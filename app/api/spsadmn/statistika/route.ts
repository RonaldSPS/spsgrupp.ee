import { NextResponse } from "next/server"
import { sql, gte, lte, and } from "drizzle-orm"
import { db } from "@/lib/db"
import { pageViews } from "@/lib/db/schema"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { classifyReferrer } from "@/lib/analytics"

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export interface StatsResponse {
  summary: {
    pageViews: number
    uniqueVisitors: number
    pagesPerVisitor: number
    bounceRate: number
    avgSessionSeconds: number
  }
  topPages: Array<{ path: string; views: number }>
  topReferrers: Array<{ source: string; views: number }>
  topCountries: Array<{ country: string; views: number }>
  topCities: Array<{ city: string; views: number }>
  devices: Array<{ deviceType: string; views: number }>
  browsers: Array<{ browser: string; views: number }>
  osList: Array<{ os: string; views: number }>
  utmSources: Array<{ source: string; views: number }>
  daily: Array<{ date: string; views: number; visitors: number }>
}

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()

      const { searchParams } = new URL(request.url)
      const from = searchParams.get("from")
      const to = searchParams.get("to")

      if (!from || !DATE_RE.test(from) || !to || !DATE_RE.test(to)) {
        return noStoreResponse(JSON.stringify({ error: "Valid from/to dates are required (YYYY-MM-DD)" }), 400)
      }

      const fromDate = new Date(`${from}T00:00:00Z`)
      const toDate = new Date(`${to}T23:59:59Z`)

      const where = and(
        gte(pageViews.createdAt, fromDate),
        lte(pageViews.createdAt, toDate)
      )

      // Summary: total views, unique visitors, pages/visitor, bounce rate, avg session duration.
      const summaryRows = await db.execute(sql`
        WITH visitor_stats AS (
          SELECT
            daily_visitor_hash,
            COUNT(*) AS pages,
            MIN(created_at) AS first_seen,
            MAX(created_at) AS last_seen
          FROM page_views
          WHERE created_at >= ${fromDate} AND created_at <= ${toDate}
          GROUP BY daily_visitor_hash
        )
        SELECT
          (SELECT COUNT(*) FROM page_views WHERE created_at >= ${fromDate} AND created_at <= ${toDate}) AS page_views,
          COUNT(*) AS unique_visitors,
          COALESCE(AVG(pages), 0) AS pages_per_visitor,
          COALESCE(AVG(CASE WHEN pages = 1 THEN 1.0 ELSE 0.0 END), 0) AS bounce_rate,
          COALESCE(AVG(EXTRACT(EPOCH FROM (last_seen - first_seen))), 0) AS avg_session_seconds
        FROM visitor_stats
      `)

      const summaryRow = (summaryRows as unknown as Array<Record<string, unknown>>)[0]
      const summary = {
        pageViews: Number(summaryRow?.page_views || 0),
        uniqueVisitors: Number(summaryRow?.unique_visitors || 0),
        pagesPerVisitor: Number(Number(summaryRow?.pages_per_visitor || 0).toFixed(2)),
        bounceRate: Number(Number(summaryRow?.bounce_rate || 0).toFixed(4)),
        avgSessionSeconds: Math.round(Number(summaryRow?.avg_session_seconds || 0)),
      }

      // Top pages.
      const topPagesRows = await db
        .select({ path: pageViews.path, views: sql<number>`count(*)`.as("views") })
        .from(pageViews)
        .where(where)
        .groupBy(pageViews.path)
        .orderBy(sql`views DESC`)
        .limit(20)

      // Referrers: group by host, classify search engines/social in JS.
      const referrerRows = await db
        .select({ host: pageViews.referrerHost, views: sql<number>`count(*)`.as("views") })
        .from(pageViews)
        .where(where)
        .groupBy(pageViews.referrerHost)
        .orderBy(sql`views DESC`)

      const referrerMap = new Map<string, number>()
      for (const row of referrerRows) {
        const source = classifyReferrer(row.host)
        referrerMap.set(source, (referrerMap.get(source) || 0) + Number(row.views))
      }
      const topReferrers = Array.from(referrerMap.entries())
        .map(([source, views]) => ({ source, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 20)

      // Top countries.
      const topCountriesRows = await db
        .select({ country: pageViews.country, views: sql<number>`count(*)`.as("views") })
        .from(pageViews)
        .where(where)
        .groupBy(pageViews.country)
        .orderBy(sql`views DESC`)
        .limit(20)

      // Top cities (only where city is known).
      const topCitiesRows = await db
        .select({ city: pageViews.city, views: sql<number>`count(*)`.as("views") })
        .from(pageViews)
        .where(and(where, sql`${pageViews.city} != ''`))
        .groupBy(pageViews.city)
        .orderBy(sql`views DESC`)
        .limit(20)

      // Devices.
      const devicesRows = await db
        .select({ deviceType: pageViews.deviceType, views: sql<number>`count(*)`.as("views") })
        .from(pageViews)
        .where(where)
        .groupBy(pageViews.deviceType)
        .orderBy(sql`views DESC`)

      // Browsers.
      const browsersRows = await db
        .select({ browser: pageViews.browser, views: sql<number>`count(*)`.as("views") })
        .from(pageViews)
        .where(where)
        .groupBy(pageViews.browser)
        .orderBy(sql`views DESC`)
        .limit(10)

      // Operating systems.
      const osRows = await db
        .select({ os: pageViews.os, views: sql<number>`count(*)`.as("views") })
        .from(pageViews)
        .where(where)
        .groupBy(pageViews.os)
        .orderBy(sql`views DESC`)
        .limit(10)

      // UTM sources.
      const utmRows = await db
        .select({ source: pageViews.utmSource, views: sql<number>`count(*)`.as("views") })
        .from(pageViews)
        .where(and(where, sql`${pageViews.utmSource} != ''`))
        .groupBy(pageViews.utmSource)
        .orderBy(sql`views DESC`)
        .limit(20)

      // Daily series.
      const dailyRows = await db.execute(sql`
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS views,
          COUNT(DISTINCT daily_visitor_hash) AS visitors
        FROM page_views
        WHERE created_at >= ${fromDate} AND created_at <= ${toDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `)

      const daily = (dailyRows as unknown as Array<Record<string, unknown>>).map((row) => ({
        date: String(row.date),
        views: Number(row.views),
        visitors: Number(row.visitors),
      }))

      const response: StatsResponse = {
        summary,
        topPages: topPagesRows.map((r) => ({ path: r.path, views: Number(r.views) })),
        topReferrers,
        topCountries: topCountriesRows.map((r) => ({ country: r.country || "Teadmata", views: Number(r.views) })),
        topCities: topCitiesRows.map((r) => ({ city: r.city, views: Number(r.views) })),
        devices: devicesRows.map((r) => ({ deviceType: r.deviceType || "Teadmata", views: Number(r.views) })),
        browsers: browsersRows.map((r) => ({ browser: r.browser, views: Number(r.views) })),
        osList: osRows.map((r) => ({ os: r.os, views: Number(r.views) })),
        utmSources: utmRows.map((r) => ({ source: r.source, views: Number(r.views) })),
        daily,
      }

      return NextResponse.json(response, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Statistics GET error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to load statistics" }), 500)
    }
  }, true)
}
