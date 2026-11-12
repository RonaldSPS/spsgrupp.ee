/**
 * GA4 Data API pulls for the weekly report (structured data, not markdown).
 * Mirrors scripts/analytics-report.ts but returns typed objects and adds a
 * per-day session series for the tracking-health check (tracking has broken
 * twice before - CSP 17–24.08.2026, consent deploy 03.09.2026).
 */

import { getGoogleAccessToken, postJson, type ReportPeriod } from "./google-auth"
import type { Ga4AiReferrals, Ga4Channel, Ga4Daily, Ga4Data, Ga4Page, MetricSet } from "./types"

const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]

interface Ga4Row {
  dimensionValues?: { value: string }[]
  metricValues?: { value: string }[]
}
interface Ga4Report {
  dimensionHeaders?: { name: string }[]
  rows?: Ga4Row[]
  totals?: { metricValues?: { value: string }[] }[]
}

const num = (v: string | undefined) => (v ? Number(v) : 0)

export async function pullGa4(period: ReportPeriod): Promise<Ga4Data> {
  const propertyId = process.env.GA4_PROPERTY_ID
  if (!propertyId) throw new Error("GA4_PROPERTY_ID is not set")
  const token = await getGoogleAccessToken(SCOPES)
  const run = (body: Record<string, unknown>) =>
    postJson<Ga4Report>(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, token, body)

  const current = { startDate: period.start, endDate: period.end, name: "current" }
  const previous = { startDate: period.prevStart, endDate: period.prevEnd, name: "previous" }

  const overview = await run({
    dateRanges: [current, previous],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "engagementRate" },
      { name: "keyEvents" },
    ],
  })
  const toMetricSet = (vals?: { value: string }[]): MetricSet => ({
    sessions: num(vals?.[0]?.value),
    users: num(vals?.[1]?.value),
    newUsers: num(vals?.[2]?.value),
    engagementRate: num(vals?.[3]?.value),
    keyEvents: num(vals?.[4]?.value),
  })
  const curRow = overview.rows?.find((r) => r.dimensionValues?.[0]?.value === "current")?.metricValues
  const prevRow = overview.rows?.find((r) => r.dimensionValues?.[0]?.value === "previous")?.metricValues

  const channelsReport = await run({
    dateRanges: [{ startDate: period.start, endDate: period.end }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }, { name: "keyEvents" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  })
  const channels: Ga4Channel[] = (channelsReport.rows ?? []).map((r) => ({
    channel: r.dimensionValues?.[0]?.value ?? "?",
    sessions: num(r.metricValues?.[0]?.value),
    keyEvents: num(r.metricValues?.[1]?.value),
  }))

  const pagesReport = await run({
    dateRanges: [{ startDate: period.start, endDate: period.end }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 15,
  })
  const topPages: Ga4Page[] = (pagesReport.rows ?? []).map((r) => ({
    path: r.dimensionValues?.[0]?.value ?? "?",
    sessions: num(r.metricValues?.[0]?.value),
  }))

  const dailyReport = await run({
    dateRanges: [{ startDate: period.start, endDate: period.end }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
    limit: 31,
  })
  const daily: Ga4Daily[] = (dailyReport.rows ?? []).map((r) => ({
    date: r.dimensionValues?.[0]?.value ?? "",
    sessions: num(r.metricValues?.[0]?.value),
  }))

  // AI-otsingute suunamised (chatgpt.com, perplexity.ai, copilot, gemini, claude
  // jm) — AI-leitavuse seire trendinäitaja. sessionSource regex-põhine filter;
  // mõlemad perioodid korraga, et delta oleks õiglane. dateRange on mitme
  // perioodi korral varjatud dimensioon — teda EI tohi dimensions-sse panna
  // (API 400), tema asukoht dimensionValues-is lahendatakse päistest.
  const aiReport = await run({
    dateRanges: [current, previous],
    dimensions: [{ name: "sessionSource" }],
    metrics: [{ name: "sessions" }],
    dimensionFilter: {
      filter: {
        fieldName: "sessionSource",
        stringFilter: {
          matchType: "PARTIAL_REGEXP",
          value: "chatgpt|chat\\.openai|openai|perplexity|copilot\\.microsoft|gemini\\.google|claude\\.ai|you\\.com|phind|mistral|deepseek|meta\\.ai",
          caseSensitive: false,
        },
      },
    },
    limit: 50,
  })
  const aiDimNames = (aiReport.dimensionHeaders ?? []).map((h) => h.name)
  const aiSourceIdx = aiDimNames.indexOf("sessionSource")
  const aiRangeIdx = aiDimNames.indexOf("dateRange")
  const aiSources = new Map<string, number>()
  let aiCurrent = 0
  let aiPrevious = 0
  for (const r of aiReport.rows ?? []) {
    const source = aiSourceIdx >= 0 ? (r.dimensionValues?.[aiSourceIdx]?.value ?? "?") : "?"
    const rangeName = aiRangeIdx >= 0 ? r.dimensionValues?.[aiRangeIdx]?.value : undefined
    const sessions = num(r.metricValues?.[0]?.value)
    if (rangeName === "previous") {
      aiPrevious += sessions
    } else {
      // "current" voi puuduv dateRange (ihe periood) = jooksev periood
      aiCurrent += sessions
      aiSources.set(source, (aiSources.get(source) ?? 0) + sessions)
    }
  }
  const aiReferrals: Ga4AiReferrals = {
    current: aiCurrent,
    previous: aiPrevious,
    sources: [...aiSources.entries()]
      .map(([source, sessions]) => ({ source, sessions }))
      .sort((a, b) => b.sessions - a.sessions),
  }

  return {
    current: toMetricSet(curRow ?? overview.totals?.[0]?.metricValues),
    previous: toMetricSet(prevRow),
    channels,
    topPages,
    daily,
    aiReferrals,
  }
}
