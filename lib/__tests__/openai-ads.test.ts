import test from "node:test"
import assert from "node:assert/strict"
import {
  buildAbsoluteSourceUrl,
  buildOpenAiConversionEvent,
  OPENAI_CONVERSION_TYPE,
  OPENAI_PIXEL_ID,
  sanitizeOppref,
} from "../openai-ads"

test("buildOpenAiConversionEvent: kuju vastab Conversions API spetsifikatsioonile", () => {
  const event = buildOpenAiConversionEvent({
    id: "form-123",
    timestampMs: 1761966000000,
    pageUrl: "/kontakt/",
  })
  assert.equal(event.id, "form-123")
  assert.equal(event.type, OPENAI_CONVERSION_TYPE)
  assert.equal(event.type, "registration_completed")
  assert.equal(event.timestamp_ms, 1761966000000)
  assert.equal(event.source_url, "https://spsgrupp.ee/kontakt/")
  assert.equal(event.action_source, "web")
  assert.deepEqual(event.data, { type: "customer_action" })
  assert.equal("oppref" in event, false)
})

test("buildOpenAiConversionEvent: oppref lisatakse ainult olemasolul (muutmata kujul)", () => {
  const withRef = buildOpenAiConversionEvent({
    id: "form-1",
    timestampMs: 1,
    pageUrl: "",
    oppref: "gAAAAAb123-_=",
  })
  assert.equal(withRef.oppref, "gAAAAAb123-_=")
  const without = buildOpenAiConversionEvent({ id: "form-2", timestampMs: 1, pageUrl: "", oppref: "" })
  assert.equal("oppref" in without, false)
})

test("buildAbsoluteSourceUrl: absoluutne URL läheb muutmata läbi", () => {
  assert.equal(
    buildAbsoluteSourceUrl("https://spsgrupp.ee/koristusteenus/"),
    "https://spsgrupp.ee/koristusteenus/",
  )
})

test("buildAbsoluteSourceUrl: tühi või vigane sisend annab avalehe", () => {
  assert.equal(buildAbsoluteSourceUrl(""), "https://spsgrupp.ee/")
  assert.equal(buildAbsoluteSourceUrl("   "), "https://spsgrupp.ee/")
  assert.equal(buildAbsoluteSourceUrl("javascript:alert(1)"), "https://spsgrupp.ee/")
})

test("sanitizeOppref: lubab base64(url) tähestiku, lükkab muu tagasi", () => {
  assert.equal(sanitizeOppref("gAAAAAb123-_="), "gAAAAAb123-_=")
  assert.equal(sanitizeOppref("  abc+/=  "), "abc+/=")
  assert.equal(sanitizeOppref("vahe t\u00e4ht"), "")
  assert.equal(sanitizeOppref("<script>"), "")
  assert.equal(sanitizeOppref("x".repeat(513)), "")
  assert.equal(sanitizeOppref(undefined), "")
  assert.equal(sanitizeOppref(123), "")
})

test("pikslid on fikseeritud (kliendi antud seadistus)", () => {
  assert.equal(OPENAI_PIXEL_ID, "VeKUzbj5PSN5K641vfQRaK")
})
