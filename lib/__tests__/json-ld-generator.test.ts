import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
  renderLdJson,
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
  generateReviewSchema,
  generateAggregateRatingSchema,
  generateReviewsPageSchema,
  parsePriceCard,
  generateServiceOffers,
  generateItemListSchema,
  generateCollectionPageSchema,
  htmlToPlainText,
  generateJobPostingSchema,
} from "../json-ld-generator"

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

describe("generateReviewSchema", () => {
  it("generates a Review with rating and author", () => {
    const schema = generateReviewSchema({ author: "Paul", text: "Great service", ratingValue: 5 }) as Record<string, unknown>
    assert.strictEqual(schema["@type"], "Review")
    assert.strictEqual(schema.reviewBody, "Great service")
    const author = schema.author as Record<string, unknown>
    assert.strictEqual(author["@type"], "Person")
    assert.strictEqual(author.name, "Paul")
    const rating = schema.reviewRating as Record<string, unknown>
    assert.strictEqual(rating.ratingValue, 5)
    assert.strictEqual(rating.bestRating, 5)
  })
})

describe("generateAggregateRatingSchema", () => {
  it("rounds to one decimal", () => {
    const schema = generateAggregateRatingSchema(4.666, 3) as Record<string, unknown>
    assert.strictEqual(schema["@type"], "AggregateRating")
    assert.strictEqual(schema.ratingValue, 4.7)
    assert.strictEqual(schema.reviewCount, 3)
  })
})

describe("generateReviewsPageSchema", () => {
  it("emits Organization aggregate by @id plus per-review nodes", () => {
    const schema = generateReviewsPageSchema([
      { author: "A", text: "good", ratingValue: 5 },
      { author: "B", text: "ok", ratingValue: 5 },
    ]) as Record<string, unknown>
    const graph = schema["@graph"] as Array<Record<string, unknown>>
    const org = graph[0]
    assert.strictEqual(org["@id"], "https://spsgrupp.ee/#organization")
    const agg = org.aggregateRating as Record<string, unknown>
    assert.strictEqual(agg["@type"], "AggregateRating")
    assert.strictEqual(agg.ratingValue, 5)
    assert.strictEqual(agg.reviewCount, 2)
    assert.strictEqual(graph.length, 3)
    assert.strictEqual(graph[1]["@type"], "Review")
    assert.strictEqual(graph[2]["@type"], "Review")
  })
})

describe("parsePriceCard", () => {
  it("parses et m2 price", () => {
    assert.deepStrictEqual(
      parsePriceCard({ size: "X", area: "y", price: "2 €/m²", period: "alates" }),
      { minPrice: 2, unitText: "per m²" },
    )
  })

  it("parses comma decimal", () => {
    assert.deepStrictEqual(
      parsePriceCard({ size: "X", area: "y", price: "1,20 €/m²", period: "alates" }),
      { minPrice: 1.2, unitText: "per m²" },
    )
  })

  it("parses monthly price with al. prefix", () => {
    assert.deepStrictEqual(
      parsePriceCard({ size: "X", area: "y", price: "al. 180 €", period: "kuu" }),
      { minPrice: 180, unitText: "per month" },
    )
  })

  it("parses en EUR/m2", () => {
    assert.deepStrictEqual(
      parsePriceCard({ size: "X", area: "y", price: "3.5 EUR/m²", period: "from" }),
      { minPrice: 3.5, unitText: "per m²" },
    )
  })

  it("returns null for non-numeric price", () => {
    assert.strictEqual(parsePriceCard({ size: "X", area: "y", price: "Individuaalne", period: "pakkumine" }), null)
  })
})

describe("generateServiceOffers", () => {
  it("returns undefined for empty cards", () => {
    assert.strictEqual(generateServiceOffers([]), undefined)
  })

  it("uses minimum parseable price with EUR", () => {
    const offers = generateServiceOffers([
      { size: "A", area: "x", price: "3 €/m²", period: "alates", highlight: true },
      { size: "B", area: "x", price: "2 €/m²", period: "alates" },
      { size: "C", area: "x", price: "soodushind", period: "eripakkumine" },
    ]) as Record<string, unknown>
    assert.strictEqual(offers["@type"], "Offer")
    const spec = offers.priceSpecification as Record<string, unknown>
    assert.strictEqual(spec.price, 2)
    assert.strictEqual(spec.priceCurrency, "EUR")
    assert.strictEqual(spec.unitText, "per m²")
  })
})

describe("generateServiceSchema offers", () => {
  it("attaches offers when priceCards provided", () => {
    const schema = generateServiceSchema("/x", "et", "N", "D", [
      { size: "A", area: "x", price: "2 €/m²", period: "alates" },
    ]) as Record<string, unknown>
    const offers = schema.offers as Record<string, unknown>
    assert.strictEqual(offers["@type"], "Offer")
  })

  it("omits offers without priceCards", () => {
    const schema = generateServiceSchema("/x", "et", "N", "D") as Record<string, unknown>
    assert.strictEqual(schema.offers, undefined)
  })
})

describe("generateItemListSchema", () => {
  it("generates positioned list items", () => {
    const schema = generateItemListSchema([
      { name: "Job A", url: "https://spsgrupp.ee/tule-meile-toole/a/" },
      { name: "Job B", url: "https://spsgrupp.ee/tule-meile-toole/b/" },
    ]) as Record<string, unknown>
    assert.strictEqual(schema["@type"], "ItemList")
    const items = schema.itemListElement as Array<Record<string, unknown>>
    assert.strictEqual(items.length, 2)
    assert.strictEqual(items[0].position, 1)
    assert.strictEqual(items[1].name, "Job B")
  })
})

describe("generateCollectionPageSchema", () => {
  it("wraps ItemList as mainEntity", () => {
    const schema = generateCollectionPageSchema("Blogi", "desc", "https://spsgrupp.ee/blog/", [
      { name: "Post", url: "https://spsgrupp.ee/blog/x/" },
    ]) as Record<string, unknown>
    assert.strictEqual(schema["@type"], "CollectionPage")
    const main = schema.mainEntity as Record<string, unknown>
    assert.strictEqual(main["@type"], "ItemList")
  })
})

describe("htmlToPlainText", () => {
  it("strips tags and collapses whitespace", () => {
    assert.strictEqual(htmlToPlainText("<p>Hello <b>world</b></p>"), "Hello world")
  })

  it("decodes common entities", () => {
    assert.strictEqual(htmlToPlainText("a &amp; b &nbsp; c"), "a & b c")
  })
})

describe("generateJobPostingSchema", () => {
  const base = {
    canonicalPath: "/tule-meile-toole/x",
    title: "Cleaner",
    descriptionText: "Full description here",
    publishedDate: "2026-08-01",
    id: 7,
    company: "SPS Grupp OÜ",
  }

  it("includes directApply and organization @id", () => {
    const schema = generateJobPostingSchema(base) as Record<string, unknown>
    assert.strictEqual(schema["@type"], "JobPosting")
    assert.strictEqual(schema.directApply, true)
    const org = schema.hiringOrganization as Record<string, unknown>
    assert.strictEqual(org["@id"], "https://spsgrupp.ee/#organization")
  })

  it("includes baseSalary only when salary > 0", () => {
    const withSalary = generateJobPostingSchema({ ...base, salary: 650, salaryUnit: "EUR" }) as Record<string, unknown>
    const salary = withSalary.baseSalary as Record<string, unknown>
    assert.strictEqual(salary.currency, "EUR")
    const value = salary.value as Record<string, unknown>
    assert.strictEqual(value.value, 650)

    const without = generateJobPostingSchema({ ...base, salary: 0 }) as Record<string, unknown>
    assert.strictEqual(without.baseSalary, undefined)
  })
})
