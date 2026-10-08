/**
 * Google Business Profile read-only audit pull.
 *
 * Reads (no writes): GBP accounts -> locations with categories, service
 * items, hours, attributes -> reviews (legacy My Business API v4, only if
 * that API is enabled in the GCP project). Prints an Estonian summary.
 *
 * Prerequisites (.env.local):
 *   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET   (OAuth client, project spsgrupp)
 *   GOOGLE_GBP_REFRESH_TOKEN                  (from npm run setup:gbp-auth)
 *   GCP project must have enabled: My Business Account Management API +
 *   My Business Business Information API (+ optional legacy Google My
 *   Business API for reviews).
 *
 * Usage: npx tsx scripts/gbp-read.ts
 */

import { readFileSync, existsSync } from "node:fs"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}
loadEnvLocal()

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REFRESH_TOKEN = process.env.GOOGLE_GBP_REFRESH_TOKEN

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error("Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_GBP_REFRESH_TOKEN in .env.local")
  console.error("Run npm run setup:gbp-auth first and add the printed refresh token to .env.local")
  process.exit(1)
}

async function apiGet(url: string, token: string): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  return { ok: res.ok, status: res.status, data }
}

const READ_MASK = [
  "name", "title", "phoneNumbers", "categories", "websiteUri", "regularHours",
  "specialHours", "profile", "serviceItems", "storefrontAddress", "labels",
  "attributes", "metadata", "latlng", "openInfo",
].join(",")

async function main() {
  /* 1) refresh access token */
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      refresh_token: REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  })
  const tokenData = (await tokenRes.json()) as Record<string, string>
  if (!tokenRes.ok || !tokenData.access_token) {
    console.error("Token refresh failed:", JSON.stringify(tokenData).slice(0, 300))
    process.exit(1)
  }
  const token = tokenData.access_token

  /* 2) accounts */
  const accounts = await apiGet("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", token)
  if (!accounts.ok) {
    console.error("accounts.list failed:", accounts.status, JSON.stringify(accounts.data).slice(0, 400))
    console.error("-> Is the My Business Account Management API enabled in project spsgrupp?")
    process.exit(1)
  }
  const accountList = (accounts.data.accounts as Array<Record<string, unknown>>) ?? []
  console.log(`\n=== KONTOD (${accountList.length}) ===`)
  for (const a of accountList) console.log(`- ${a.accountName ?? a.name}  [${a.name}]  roll: ${a.role ?? "?"}`)
  if (accountList.length === 0) {
    console.log("\nÜhtegi kontot ei leitud - logi GBP omaniku kontoga uuesti sisse (setup:gbp-auth).")
    return
  }

  /* 3) locations per account */
  for (const account of accountList) {
    const accName = account.name as string // accounts/{id}
    const locUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/${accName}/locations?readMask=${READ_MASK}&pageSize=100`
    let locs = await apiGet(locUrl, token)
    if (!locs.ok && JSON.stringify(locs.data).includes("serviceItems")) {
      // older projects: retry without serviceItems in the mask
      locs = await apiGet(locUrl.replace(",serviceItems", ""), token)
    }
    if (!locs.ok) {
      console.error(`\nlocations.list failed for ${accName}:`, locs.status, JSON.stringify(locs.data).slice(0, 400))
      console.error("-> Is the My Business Business Information API enabled in project spsgrupp?")
      continue
    }
    const locations = (locs.data.locations as Array<Record<string, unknown>>) ?? []
    console.log(`\n=== ASUKOHAD kontol ${accName} (${locations.length}) ===`)
    for (const loc of locations) {
      printLocation(loc)
      /* 4) reviews via legacy API (best effort) */
      await printReviews(accName, loc, token)
    }
  }
}

function printLocation(loc: Record<string, unknown>) {
  const cats = (loc.categories ?? {}) as Record<string, unknown>
  const primary = (cats.primaryCategory ?? {}) as Record<string, string>
  const additional = (cats.additionalCategories ?? []) as Array<Record<string, string>>
  console.log(`\n--- ${loc.title} [${loc.name}] ---`)
  console.log(`  Põhikategooria: ${primary.displayName ?? "-"} (${primary.name ?? "-"})`)
  for (const c of additional) console.log(`  Lisakategooria:  ${c.displayName} (${c.name})`)
  const addr = (loc.storefrontAddress ?? {}) as Record<string, unknown>
  console.log(`  Aadress: ${((addr.addressLines ?? []) as string[]).join(", ")}, ${addr.locality ?? ""} ${addr.postalCode ?? ""}`)
  console.log(`  Telefon: ${((loc.phoneNumbers ?? {}) as Record<string, string>).primaryPhone ?? "-"}`)
  console.log(`  Veeb:    ${loc.websiteUri ?? "-"}`)
  const hours = (loc.regularHours ?? {}) as Record<string, unknown>
  const periods = (hours.periods ?? []) as Array<Record<string, Record<string, unknown>>>
  if (periods.length) {
    console.log(`  Avaajad:`)
    for (const p of periods) {
      const o = p.openTime ?? {}, c = p.closeTime ?? {}
      console.log(`    ${p.openDay}: ${String(o.hours ?? 0).padStart(2, "0")}:${String(o.minutes ?? 0).padStart(2, "0")} - ${String(c.hours ?? 0).padStart(2, "0")}:${String(c.minutes ?? 0).padStart(2, "0")}`)
    }
  } else {
    console.log("  Avaajad: (puuduvad!)")
  }
  const profile = (loc.profile ?? {}) as Record<string, string>
  if (profile.description) console.log(`  Kirjeldus: ${profile.description.slice(0, 200)}${profile.description.length > 200 ? "…" : ""}`)
  const items = (loc.serviceItems ?? []) as Array<Record<string, unknown>>
  console.log(`  Teenused (${items.length}):`)
  for (const s of items.slice(0, 60)) {
    const st = (s.serviceType ?? {}) as Record<string, unknown>
    const ff = (s.freeFormServiceItem ?? {}) as Record<string, Record<string, string> | string>
    const label = (st.displayName as string) ?? ((ff.label ?? {}) as Record<string, string>).displayName ?? "?"
    const price = (s.price as Record<string, string>) ?? {}
    console.log(`    - ${label}${price.moneyAmount ? ` (${price.moneyAmount} ${price.currencyCode ?? ""})` : ""}`)
  }
  const attrs = (loc.attributes ?? []) as Array<Record<string, unknown>>
  console.log(`  Atribuudid: ${attrs.length}`)
  const meta = (loc.metadata ?? {}) as Record<string, string>
  if (meta.mapsUri) console.log(`  Maps: ${meta.mapsUri}`)
}

async function printReviews(accName: string, loc: Record<string, unknown>, token: string) {
  // legacy v4: accounts/{a}/locations/{l}/reviews
  const locId = (loc.name as string).split("/").pop()
  const accId = accName.split("/").pop()
  const url = `https://mybusiness.googleapis.com/v4/accounts/${accId}/locations/${locId}/reviews?pageSize=50`
  const res = await apiGet(url, token)
  if (!res.ok) {
    console.log(`  Arvustused: legacy API ei vasta (${res.status}) - luba "Google My Business API" v4 või halda arvustusi GBP veebis.`)
    return
  }
  const reviews = (res.data.reviews ?? []) as Array<Record<string, unknown>>
  const ratingMap: Record<string, string> = { ONE: "1", TWO: "2", THREE: "3", FOUR: "4", FIVE: "5" }
  console.log(`  Arvustused (${res.data.totalReviewCount ?? reviews.length} kokku, keskmine ${res.data.averageRating ?? "?"}):`)
  for (const r of reviews) {
    const reviewer = ((r.reviewer ?? {}) as Record<string, string>).displayName ?? "?"
    const replied = !!r.reviewReply
    console.log(`    [${ratingMap[r.starRating as string] ?? r.starRating}★] ${reviewer} (${r.updateTime ?? r.createTime ?? "?"}) ${replied ? "- VASTATUD" : "- VASTAMATA"}`)
    if (r.comment) console.log(`      "${String(r.comment).slice(0, 120)}"`)
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
