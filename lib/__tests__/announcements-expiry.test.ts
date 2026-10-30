import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { isAnnouncementExpired } from "../announcements"

const NOW = new Date(2026, 9, 30) // 2026-10-30 (local, month is 0-based)

describe("isAnnouncementExpired", () => {
  it("never expires when the deadline is missing", () => {
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "" }, NOW), false)
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "   " }, NOW), false)
  })

  it("never expires when the deadline is unparseable", () => {
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "25.06.2026" }, NOW), false)
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "soon" }, NOW), false)
  })

  it("is valid on the deadline day itself", () => {
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "2026-10-30" }, NOW), false)
  })

  it("expires the day after the deadline", () => {
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "2026-10-29" }, NOW), true)
  })

  it("is valid when the deadline is in the future", () => {
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "2026-10-31" }, NOW), false)
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "2027-01-15" }, NOW), false)
  })

  it("expires deadlines in the past", () => {
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "2026-06-25" }, NOW), true)
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "2025-12-31" }, NOW), true)
  })

  it("handles ISO datetime values and non-padded dates", () => {
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "2026-10-29T23:59:59.000Z" }, NOW), true)
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "2026-1-5" }, NOW), true)
  })

  it("handles month/year boundaries", () => {
    const jan1 = new Date(2027, 0, 1)
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "2026-12-31" }, jan1), true)
    const feb1 = new Date(2027, 1, 1)
    assert.strictEqual(isAnnouncementExpired({ applicationDeadline: "2027-01-31" }, feb1), true)
  })
})
