import { test } from "node:test"
import assert from "node:assert/strict"
import {
  parseDeviceType,
  parseBrowser,
  parseOs,
  classifyReferrer,
  computeDailyVisitorHash,
  extractReferrerHost,
  parseUtm,
} from "../analytics"

test("parseDeviceType: desktop, mobile, tablet", () => {
  assert.equal(parseDeviceType("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"), "desktop")
  assert.equal(parseDeviceType("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"), "mobile")
  assert.equal(parseDeviceType("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)"), "tablet")
  assert.equal(parseDeviceType("Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36"), "tablet")
  assert.equal(parseDeviceType("Mozilla/5.0 (Linux; Android 14; Mobile)"), "mobile")
})

test("parseBrowser: common browsers", () => {
  assert.equal(parseBrowser("Mozilla/5.0 ... Chrome/120.0.0.0 Safari/537.36"), "Chrome")
  assert.equal(parseBrowser("Mozilla/5.0 ... Firefox/121.0"), "Firefox")
  assert.equal(parseBrowser("Mozilla/5.0 ... Version/17.0 Safari/605.1.15"), "Safari")
  assert.equal(parseBrowser("Mozilla/5.0 ... Edg/120.0.0.0"), "Edge")
})

test("parseOs: common operating systems", () => {
  assert.equal(parseOs("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), "Windows 10")
  assert.equal(parseOs("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"), "macOS")
  assert.equal(parseOs("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"), "iOS")
  assert.equal(parseOs("Mozilla/5.0 (Linux; Android 14)"), "Android")
})

test("classifyReferrer: search engines and social", () => {
  assert.equal(classifyReferrer(""), "direct")
  assert.equal(classifyReferrer("google.com"), "Google")
  assert.equal(classifyReferrer("www.google.ee"), "Google")
  assert.equal(classifyReferrer("bing.com"), "Bing")
  assert.equal(classifyReferrer("facebook.com"), "Facebook")
  assert.equal(classifyReferrer("linkedin.com"), "LinkedIn")
  assert.equal(classifyReferrer("example.com"), "example.com")
})

test("computeDailyVisitorHash: deterministic within same day, different across days", () => {
  const day1 = new Date("2026-11-25T10:00:00Z")
  const day2 = new Date("2026-11-26T10:00:00Z")
  const h1 = computeDailyVisitorHash("1.2.3.4", "test-agent", day1)
  const h1Again = computeDailyVisitorHash("1.2.3.4", "test-agent", day1)
  const h2 = computeDailyVisitorHash("1.2.3.4", "test-agent", day2)
  assert.equal(h1, h1Again)
  assert.notEqual(h1, h2)
  assert.equal(h1.length, 64)
})

test("extractReferrerHost: strips www and lowercases", () => {
  assert.equal(extractReferrerHost("https://www.google.ee/search?q=test"), "google.ee")
  assert.equal(extractReferrerHost("https://facebook.com/"), "facebook.com")
  assert.equal(extractReferrerHost(""), "")
  assert.equal(extractReferrerHost("not-a-url"), "")
})

test("parseUtm: extracts utm parameters", () => {
  const utm = parseUtm("?utm_source=LinkedIn&utm_medium=paid_social&utm_campaign=Boost")
  assert.equal(utm.utmSource, "linkedin")
  assert.equal(utm.utmMedium, "paid_social")
  assert.equal(utm.utmCampaign, "boost")
})
