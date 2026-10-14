/**
 * Geo-grid CLI: mõõdab kohaliku Maps-nähtavuse fikseeritud 27 mõõtepunktis.
 *
 *   npm run report:geogrid                      — vaikimisi märksõnad (geogrid.ts)
 *   npx tsx scripts/geogrid-report.ts "akende pesu"  — üks vaba märksõna
 *
 * Env (.env.local): kas GOOGLE_MAPS_API_KEY või teenuskonto (sama mis
 * report:analytics). Eeldus: "Places API (New)" on GCP projektis lubatud.
 */

import { readFileSync, existsSync } from "node:fs"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2]
  }
}
loadEnvLocal()

import { GEOGRID_DEFAULT_KEYWORDS, GEOGRID_POINTS, measureGeoGrid } from "../lib/reporting/geogrid"

async function main() {
  const custom = process.argv[2]?.trim()
  const keywords = custom ? [custom] : GEOGRID_DEFAULT_KEYWORDS
  console.log(`Geo-grid: ${keywords.length} märksõna × ${GEOGRID_POINTS.length} punkti\n`)
  for (const kw of keywords) {
    const run = await measureGeoGrid(kw, null)
    console.log(`== ${kw} ==`)
    console.log(
      `   keskm. koht ${run.summary.avgRank.toFixed(1)} · top-3: ${run.summary.top3} · top-10: ${run.summary.top10} · leitud ${run.summary.found}/${run.points.length}`,
    )
    for (const p of run.points) {
      console.log(`   ${p.label.padEnd(22)} ${p.rank === null ? ">20" : p.rank}`)
    }
    console.log("")
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
