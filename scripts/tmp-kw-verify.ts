/**
 * TEMP: verification pulls for the merged report.
 *  1. click_view: gclid -> keyword/match/adgroup/campaign for the 6 ads leads
 *  2. campaign budgets (shared?) + network/geo targeting settings
 *  3. Harju maakond geoTargetConstant id
 * Run: npx tsx scripts/tmp-kw-verify.ts
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs"
import { getGoogleAccessToken } from "../lib/reporting/google-auth"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq === -1) continue
    if (process.env[t.slice(0, eq).trim()] === undefined) process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim()
  }
}
loadEnvLocal()

const GCLIDS = [
  ["Sky Autokool 19.08", "CjwKCAjwqJXUBhBNEiwA8BgG7ruTPtLllYed-6s4TWJgKy0Srv43AMFVunRWcH9G3LcdYok77Y52XhoCJ0EQAvD_BwE", "2026-08-19"],
  ["Legal Property 25.08", "CjwKCAjw-rTUBhAiEiwADv8gBIiZwuAJ5G5cImitZk22KgjgWjKXPdOgQfNm2OEcg40jI0NQH18lzxoCnlUQAvD_BwE", "2026-08-25"],
  ["Tallifornia 26.08", "CjwKCAjw-rTUBhAiEiwADv8gBDZaHkMBj1hRKumNuMXuMHdFXV88WmZTUhvgyunwRxillWX4OgU5wRoCTWwQAvD_BwE", "2026-08-26"],
  ["EstateMagic 01.09", "Cj0KCQjw79nUBhCgARIsADSHka2Hl-B0a3zMVXB8SI164h0ebiRrBp1x7TXXZsLfGHeH40XE4ztfzTUaAiZ0EALw_wcB", "2026-09-01"],
  ["Hiiu Käbi 11.09", "Cj0KCQjwzY7VBhDwARIsAFtPvBTptwQUTWqO440aae9CzxreAR_f1OW4bzYtwCQUF_yAU0DktKod9B0aAlVdEALw_wcB", "2026-09-11"],
  ["LIGHTMAKER 14.09", "CjwKCAjwtp7VBhBjEiwAJfpV-70DaTbT1SYVxdUyWLErDEITvvCossdx13PS-8FMW6hgDdmI58WlxxoC0e8QAvD_BwE", "2026-09-14"],
] as const

async function main() {
  const token = await getGoogleAccessToken(["https://www.googleapis.com/auth/adwords"])
  const cid = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    "Content-Type": "application/json",
  }
  const login = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
  if (login) headers["login-customer-id"] = login

  async function gaql(query: string): Promise<any[]> {
    const url = `https://googleads.googleapis.com/v25/customers/${cid}/googleAds:search`
    const rows: any[] = []
    let pageToken: string | undefined
    do {
      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }) })
      if (!res.ok) throw new Error(`GAQL ${res.status}: ${(await res.text()).slice(0, 400)}\nQ: ${query.slice(0, 160)}`)
      const data = (await res.json()) as { results?: any[]; nextPageToken?: string }
      rows.push(...(data.results ?? []))
      pageToken = data.nextPageToken
    } while (pageToken)
    return rows
  }

  /* 1. click_view for the 6 gclids */
  console.log("## 1. click_view gclid -> keyword")
  for (const [label, gclid, day] of GCLIDS) {
    try {
      const rows = await gaql(
        `SELECT click_view.gclid, click_view.keyword_info.text, click_view.keyword_info.match_type,
                campaign.name, ad_group.name, segments.date, click_view.page_number
         FROM click_view
         WHERE click_view.gclid = '${gclid}' AND segments.date = '${day}'`,
      )
      if (!rows.length) {
        console.log(`${label}: NO click_view row found`)
        continue
      }
      for (const r of rows) {
        const kw = r.clickView?.keywordInfo ?? r.click_view?.keyword_info ?? {}
        console.log(
          `${label}: kw="${kw.text ?? "?"}" match=${kw.matchType ?? kw.match_type ?? "?"} | ${r.campaign?.name} / ${r.adGroup?.name ?? r.ad_group?.name} | ${r.segments?.date} | serpPage=${r.clickView?.pageNumber ?? r.click_view?.page_number ?? "?"}`,
        )
      }
    } catch (e) {
      console.log(`${label}: ERROR ${e instanceof Error ? e.message.slice(0, 600) : e}`)
    }
  }

  /* 2. budgets + targeting */
  console.log("\n## 2. campaign budgets and targeting")
  const camps = await gaql(
    `SELECT campaign.name, campaign.status, campaign_budget.amount_micros, campaign_budget.explicitly_shared,
            campaign_budget.resource_name, campaign.network_settings.target_google_search,
            campaign.network_settings.target_search_network, campaign.network_settings.target_partner_search_network,
            campaign.geo_target_type_setting.positive_geo_target_type
     FROM campaign WHERE campaign.status IN ('ENABLED','PAUSED')`,
  )
  for (const r of camps) {
    const b = r.campaignBudget ?? r.campaign_budget ?? {}
    const n = r.campaign?.networkSettings ?? r.campaign?.network_settings ?? {}
    const g = r.campaign?.geoTargetTypeSetting ?? r.campaign?.geo_target_type_setting ?? {}
    console.log(
      `${r.campaign?.name} [${r.campaign?.status}] | budget=${(+((b.amountMicros ?? b.amount_micros) ?? 0)) / 1e6}€/day | shared=${b.explicitlyShared ?? b.explicitly_shared} | budgetRes=${(b.resourceName ?? b.resource_name ?? "").split("/").pop()} | googleSearch=${n.targetGoogleSearch ?? n.target_google_search} | searchPartners=${n.targetSearchNetwork ?? n.target_search_network} | partnerNet=${n.targetPartnerSearchNetwork ?? n.target_partner_search_network} | geoType=${g.positiveGeoTargetType ?? g.positive_geo_target_type}`,
    )
  }

  /* geo targets of main campaigns */
  console.log("\n## 2b. geo targets (campaign_criterion location)")
  const geos = await gaql(
    `SELECT campaign.name, campaign_criterion.location.geo_target_constant, campaign_criterion.negative
     FROM campaign_criterion WHERE campaign_criterion.type = 'LOCATION' AND campaign.status = 'ENABLED'`,
  )
  for (const r of geos) {
    console.log(`${r.campaign?.name} | ${r.campaignCriterion?.location?.geoTargetConstant ?? r.campaign_criterion?.location?.geo_target_constant} | negative=${r.campaignCriterion?.negative ?? r.campaign_criterion?.negative}`)
  }

  /* 3. Harju geo id lookup */
  console.log("\n## 3. geo_target_constant for Harju")
  try {
    const rows = await gaql(
      `SELECT geo_target_constant.resource_name, geo_target_constant.name, geo_target_constant.canonical_name,
              geo_target_constant.target_type, geo_target_constant.status
       FROM geo_target_constant
       WHERE geo_target_constant.country_code = 'EE' AND geo_target_constant.target_type = 'County'`,
    )
    for (const r of rows) {
      const g = r.geoTargetConstant ?? r.geo_target_constant ?? {}
      console.log(`${g.name} | ${g.canonicalName ?? g.canonical_name} | ${g.resourceName ?? g.resource_name} | ${g.targetType ?? g.target_type} | ${g.status}`)
    }
  } catch (e) {
    console.log(`geo lookup ERROR: ${e instanceof Error ? e.message.slice(0, 300) : e}`)
  }

  writeFileSync("tmp/kw-verify-done.txt", new Date().toISOString(), "utf-8")
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
