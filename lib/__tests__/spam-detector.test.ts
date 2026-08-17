import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { assessSubmission } from "../spam"

const cleanContact = {
  name: "Mari Tamm",
  email: "mari.tamm@example.ee",
  message: "Tere! Sooviksin pakkumist kontorikoristusele, umbes 120 m2, kaks korda nädalas.",
  form: "contact" as const,
}

describe("assessSubmission", () => {
  it("does not flag a normal contact inquiry", () => {
    assert.deepStrictEqual(assessSubmission(cleanContact), { flagged: false, reasons: [] })
  })

  it("does not flag a normal career application", () => {
    const result = assessSubmission({
      name: "Jüri Kask",
      email: "juri.kask@gmail.com",
      message: "Olen varem töötanud koristajana ja olen huvitatud täiskohaga tööst.",
      form: "career",
    })
    assert.strictEqual(result.flagged, false)
  })

  it("tolerates a single link in the message", () => {
    const result = assessSubmission({
      ...cleanContact,
      message: "Meie ettevõtte leht: https://example.ee — palun hinnapakkumist.",
    })
    assert.strictEqual(result.flagged, false)
  })

  it("flags messages with two or more links", () => {
    const result = assessSubmission({
      ...cleanContact,
      message: "Check https://spam.example and https://more-spam.example for great offers",
    })
    assert.strictEqual(result.flagged, true)
    assert.ok(result.reasons.some((r) => r.includes("links")))
  })

  it("flags a URL in the name field", () => {
    const result = assessSubmission({ ...cleanContact, name: "Visit https://spam.example now" })
    assert.strictEqual(result.flagged, true)
    assert.ok(result.reasons.includes("name contains a URL"))
  })

  it("flags English SEO spam phrases", () => {
    const result = assessSubmission({
      ...cleanContact,
      message: "We can improve your Google ranking with high quality backlinks.",
    })
    assert.strictEqual(result.flagged, true)
    assert.ok(result.reasons.some((r) => r.startsWith("blocked phrase")))
  })

  it("flags Russian spam phrases case-insensitively", () => {
    const result = assessSubmission({
      ...cleanContact,
      message: "Предлагаем ПРОДВИЖЕНИЕ сайта в поисковых системах.",
    })
    assert.strictEqual(result.flagged, true)
  })

  it("flags disposable e-mail domains", () => {
    const result = assessSubmission({ ...cleanContact, email: "test@mailinator.com" })
    assert.strictEqual(result.flagged, true)
    assert.ok(result.reasons.includes("disposable e-mail domain"))
  })

  it("collects multiple reasons at once", () => {
    const result = assessSubmission({
      name: "https://spam.example",
      email: "x@yopmail.com",
      message: "crypto casino https://a.example https://b.example",
      form: "contact",
    })
    assert.strictEqual(result.flagged, true)
    assert.ok(result.reasons.length >= 3)
  })

  it("does not flag empty career info message", () => {
    const result = assessSubmission({
      name: "Anna Liis",
      email: "anna@gmail.com",
      message: "",
      form: "career",
    })
    assert.strictEqual(result.flagged, false)
  })
})
