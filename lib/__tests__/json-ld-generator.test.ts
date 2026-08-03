import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { renderLdJson, generateServiceSchema, generateBreadcrumbSchema, generateFaqSchema } from "../json-ld-generator"

describe("renderLdJson", () => {
  it("produces valid JSON", () => {
    const data = { key: "value", num: 42 }
    const output = renderLdJson(data)
    assert.doesNotThrow(() => JSON.parse(output))
    assert.deepStrictEqual(JSON.parse(output), data)
  })

  it("escapes closing script tag", () => {
    const data = { text: "before </script> after" }
    const output = renderLdJson(data)
    assert.ok(!output.includes("</script>"))
    assert.ok(output.includes("\\u003c/script>"))
    assert.doesNotThrow(() => JSON.parse(output))
  })

  it("handles angle brackets in text", () => {
    const data = { text: "<div>content</div>" }
    const output = renderLdJson(data)
    assert.ok(!output.includes("</div>"))
    assert.ok(output.includes("\\u003cdiv>"))
    assert.doesNotThrow(() => JSON.parse(output))
  })

  it("handles quotes", () => {
    const data = { text: 'he said "hello"' }
    const output = renderLdJson(data)
    assert.doesNotThrow(() => JSON.parse(output))
    assert.strictEqual(JSON.parse(output).text, 'he said "hello"')
  })

  it("handles newlines", () => {
    const data = { text: "line1\nline2" }
    const output = renderLdJson(data)
    assert.doesNotThrow(() => JSON.parse(output))
    assert.strictEqual(JSON.parse(output).text, "line1\nline2")
  })

  it("handles HTML comment syntax -->", () => {
    const data = { text: "before --> after" }
    const output = renderLdJson(data)
    assert.doesNotThrow(() => JSON.parse(output))
    assert.strictEqual(JSON.parse(output).text, "before --> after")
  })

  it("handles array of strings with special chars", () => {
    const data = { items: ["</script>", "<div>", "-->", '"hello"'] }
    const output = renderLdJson(data)
    assert.doesNotThrow(() => JSON.parse(output))
  })
})

describe("generateServiceSchema", () => {
  it("generates a service schema with provider @id reference", () => {
    const schema = generateServiceSchema(
      "/koristusteenus/kontori-koristus",
      "et",
      "Kontori koristus",
      "Description...",
    ) as Record<string, unknown>
    assert.strictEqual(schema["@type"], "Service")
    assert.strictEqual(schema.name, "Kontori koristus")
    assert.strictEqual(schema.url, "https://spsgrupp.ee/koristusteenus/kontori-koristus/")
    const provider = schema.provider as Record<string, unknown>
    assert.strictEqual(provider["@id"], "https://spsgrupp.ee/#organization")
  })
})

describe("generateBreadcrumbSchema", () => {
  it("generates breadcrumb with position and localized URLs", () => {
    const schema = generateBreadcrumbSchema(
      [
        { name: "Avaleht", etPath: "/" },
        { name: "Koristusteenus", etPath: "/koristusteenus" },
      ],
      "et",
    ) as Record<string, unknown>
    assert.strictEqual(schema["@type"], "BreadcrumbList")
    const items = schema.itemListElement as Array<Record<string, unknown>>
    assert.strictEqual(items.length, 2)
    assert.strictEqual(items[0].position, 1)
    assert.strictEqual(items[0].name, "Avaleht")
    assert.strictEqual(items[0].item, "https://spsgrupp.ee/")
    assert.strictEqual(items[1].position, 2)
    assert.strictEqual(items[1].name, "Koristusteenus")
    assert.strictEqual(items[1].item, "https://spsgrupp.ee/koristusteenus/")
  })
})

describe("generateFaqSchema", () => {
  it("returns null for empty array", () => {
    assert.strictEqual(generateFaqSchema([]), null)
  })

  it("generates FAQ schema", () => {
    const schema = generateFaqSchema([
      { q: "How often?", a: "Weekly." },
    ]) as Record<string, unknown>
    assert.strictEqual(schema["@type"], "FAQPage")
    const entities = schema.mainEntity as Array<Record<string, unknown>>
    assert.strictEqual(entities.length, 1)
    assert.strictEqual(entities[0].name, "How often?")
    const answer = entities[0].acceptedAnswer as Record<string, unknown>
    assert.strictEqual(answer.text, "Weekly.")
  })
})
