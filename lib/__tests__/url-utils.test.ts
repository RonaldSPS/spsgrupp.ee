import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { normalizePagePath, canonicalUrl, absoluteUrl } from "../url-utils"

describe("normalizePagePath", () => {
  it('returns "/" for empty string', () => {
    assert.strictEqual(normalizePagePath(""), "/")
  })

  it('returns "/" for "/"', () => {
    assert.strictEqual(normalizePagePath("/"), "/")
  })

  it("adds trailing slash to single segment", () => {
    assert.strictEqual(normalizePagePath("/kontakt"), "/kontakt/")
  })

  it("adds a leading slash when omitted", () => {
    assert.strictEqual(normalizePagePath("kontakt"), "/kontakt/")
  })

  it("keeps trailing slash if already present", () => {
    assert.strictEqual(normalizePagePath("/kontakt/"), "/kontakt/")
  })

  it("deduplicates consecutive slashes", () => {
    assert.strictEqual(normalizePagePath("//kontakt///"), "/kontakt/")
  })

  it("strips query parameters", () => {
    assert.strictEqual(normalizePagePath("/kontakt?x=1&y=2"), "/kontakt/")
  })

  it("strips hash fragments", () => {
    assert.strictEqual(normalizePagePath("/kontakt#vorm"), "/kontakt/")
  })

  it("handles query and hash together", () => {
    assert.strictEqual(normalizePagePath("/kontakt?x=1#vorm"), "/kontakt/")
  })

  it("handles nested paths", () => {
    assert.strictEqual(
      normalizePagePath("/koristusteenus/kontori-koristus"),
      "/koristusteenus/kontori-koristus/",
    )
  })

  it("handles encoded characters", () => {
    assert.strictEqual(
      normalizePagePath("/en/specialist-cleaning-services"),
      "/en/specialist-cleaning-services/",
    )
  })

  it("throws on full URL input", () => {
    assert.throws(() => normalizePagePath("https://example.com/foo"))
  })
})

describe("canonicalUrl", () => {
  it("returns base URL with trailing slash for root", () => {
    assert.strictEqual(canonicalUrl("/"), "https://spsgrupp.ee/")
  })

  it("handles root without slash", () => {
    assert.strictEqual(canonicalUrl(""), "https://spsgrupp.ee/")
  })

  it("adds trailing slash", () => {
    assert.strictEqual(
      canonicalUrl("/kontakt"),
      "https://spsgrupp.ee/kontakt/",
    )
  })

  it("accepts a path without a leading slash", () => {
    assert.strictEqual(canonicalUrl("kontakt"), "https://spsgrupp.ee/kontakt/")
  })

  it("keeps trailing slash", () => {
    assert.strictEqual(
      canonicalUrl("/kontakt/"),
      "https://spsgrupp.ee/kontakt/",
    )
  })

  it("handles nested paths", () => {
    assert.strictEqual(
      canonicalUrl("/koristusteenus/kontori-koristus"),
      "https://spsgrupp.ee/koristusteenus/kontori-koristus/",
    )
  })

  it("strips query params from input", () => {
    assert.strictEqual(
      canonicalUrl("/kontakt?x=1"),
      "https://spsgrupp.ee/kontakt/",
    )
  })

  it("throws on full URL input", () => {
    assert.throws(() => canonicalUrl("https://spsgrupp.ee/kontakt"))
  })
})

describe("absoluteUrl", () => {
  it("returns base URL for root", () => {
    assert.strictEqual(absoluteUrl("/"), "https://spsgrupp.ee/")
  })

  it("does NOT add trailing slash for files", () => {
    assert.strictEqual(
      absoluteUrl("/SPS_LOGO.svg"),
      "https://spsgrupp.ee/SPS_LOGO.svg",
    )
  })

  it("accepts an asset path without a leading slash", () => {
    assert.strictEqual(absoluteUrl("SPS_LOGO.svg"), "https://spsgrupp.ee/SPS_LOGO.svg")
  })

  it("removes trailing slash from files", () => {
    assert.strictEqual(
      absoluteUrl("/SPS_LOGO.svg/"),
      "https://spsgrupp.ee/SPS_LOGO.svg",
    )
  })

  it("handles nested asset paths", () => {
    assert.strictEqual(
      absoluteUrl("/blog-media/2023/photo.jpg"),
      "https://spsgrupp.ee/blog-media/2023/photo.jpg",
    )
  })

  it("deduplicates slashes", () => {
    assert.strictEqual(
      absoluteUrl("//images///logo.png"),
      "https://spsgrupp.ee/images/logo.png",
    )
  })

  it("throws on full URL input", () => {
    assert.throws(() => absoluteUrl("https://example.com/img.png"))
  })
})
