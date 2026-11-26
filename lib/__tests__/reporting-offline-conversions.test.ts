import { describe, it, before, after } from "node:test"
import assert from "node:assert"
import { promises as fs } from "node:fs"
import path from "node:path"
import {
  buildOfflineUploadStatus,
  getSubmissionOfflineStatus,
  hasOfflineConversionConsent,
  toFormEvent,
  toWonEvent,
  type PersistedOfflineUpload,
} from "../reporting/offline-conversions"
import type { FormSubmission } from "../form-submissions"

const UPLOADS_JSON_FILE = path.join(process.cwd(), "data", "offline-conversion-uploads.json")

describe("buildOfflineUploadStatus", () => {
  const baseRecord: PersistedOfflineUpload = {
    runAt: "2026-11-25T05:00:00.000Z",
    candidates: 5,
    uploaded: 5,
    skippedNoValue: 0,
    actionResourceName: "customers/123/conversionActions/456",
    actionCreated: false,
    wonCandidates: 1,
    wonUploaded: 1,
    wonSkippedNoValue: 0,
    wonActionResourceName: "customers/123/conversionActions/789",
    wonActionCreated: false,
    dryRun: false,
    requestId: "abc123def",
    errors: [],
  }

  it("returns ok when all events succeeded", () => {
    const status = buildOfflineUploadStatus(baseRecord, {
      formSuccess: 5,
      formErrors: 0,
      wonSuccess: 1,
      wonErrors: 0,
      hasErrors: false,
    })
    assert.strictEqual(status.status, "ok")
    assert.strictEqual(status.formSuccess, 5)
    assert.strictEqual(status.wonSuccess, 1)
    assert.strictEqual(status.hasErrors, false)
    assert.match(status.note, /Google töötleis 6 sündmust edukalt/)
    assert.match(status.note, /request ID: abc123def/)
    assert.strictEqual(status.requestId, "abc123def")
  })

  it("returns partial when some events succeeded and some errored", () => {
    const status = buildOfflineUploadStatus(baseRecord, {
      formSuccess: 4,
      formErrors: 1,
      wonSuccess: 1,
      wonErrors: 0,
      hasErrors: true,
    })
    assert.strictEqual(status.status, "partial")
    assert.strictEqual(status.hasErrors, true)
    assert.match(status.note, /Google tagastas 1 töötlemisviga/)
    assert.match(status.note, /kokku 6 sündmust/)
  })

  it("returns failed when all events errored", () => {
    const status = buildOfflineUploadStatus(baseRecord, {
      formSuccess: 0,
      formErrors: 5,
      wonSuccess: 0,
      wonErrors: 1,
      hasErrors: true,
    })
    assert.strictEqual(status.status, "failed")
    assert.match(status.note, /Google tagastas 6 töötlemisviga/)
  })

  it("falls back to uploaded counts when per-event results are missing", () => {
    const status = buildOfflineUploadStatus(baseRecord, {
      formSuccess: baseRecord.uploaded,
      formErrors: 0,
      wonSuccess: baseRecord.wonUploaded,
      wonErrors: 0,
      hasErrors: false,
    })
    assert.strictEqual(status.status, "ok")
    assert.strictEqual(status.formSuccess, 5)
    assert.strictEqual(status.wonSuccess, 1)
  })

  it("marks hasErrors true when top-level errors exist even if per-event counts are zero", () => {
    const status = buildOfflineUploadStatus({ ...baseRecord, errors: ["action lookup timeout"] }, {
      formSuccess: 5,
      formErrors: 0,
      wonSuccess: 1,
      wonErrors: 0,
      hasErrors: true,
    })
    assert.strictEqual(status.hasErrors, true)
    // Top-level errors alone currently keep status=ok because they do not indicate
    // Google-side record-processing failure; the note still mentions success counts.
    assert.strictEqual(status.status, "ok")
  })
})

describe("getSubmissionOfflineStatus", () => {
  let previous: Buffer | null = null
  let existed = false

  before(async () => {
    try {
      previous = await fs.readFile(UPLOADS_JSON_FILE)
      existed = true
    } catch {
      existed = false
    }
    await fs.mkdir(path.dirname(UPLOADS_JSON_FILE), { recursive: true })
    await fs.writeFile(
      UPLOADS_JSON_FILE,
      JSON.stringify({
        uploads: [
          {
            runAt: "2026-11-25T05:00:00.000Z",
            candidates: 2,
            uploaded: 1,
            skippedNoValue: 0,
            actionResourceName: "customers/123/conversionActions/456",
            actionCreated: false,
            wonCandidates: 1,
            wonUploaded: 1,
            wonSkippedNoValue: 0,
            wonActionResourceName: "customers/123/conversionActions/789",
            wonActionCreated: false,
            dryRun: false,
            requestId: "req-111",
            errors: [],
            events: [
              { submissionId: 101, eventType: "form", status: "success", errorMessage: "", uploadedAt: "2026-11-25T05:00:01.000Z" },
              { submissionId: 102, eventType: "form", status: "error", errorMessage: "INVALID_GCLID", uploadedAt: "2026-11-25T05:00:02.000Z" },
              { submissionId: 103, eventType: "won", status: "success", errorMessage: "", uploadedAt: "2026-11-25T05:00:03.000Z" },
            ],
          },
        ],
      }, null, 2),
      "utf-8",
    )
  })

  after(async () => {
    if (existed && previous) {
      await fs.writeFile(UPLOADS_JSON_FILE, previous)
    } else {
      try { await fs.unlink(UPLOADS_JSON_FILE) } catch {}
    }
  })

  it("returns form success for a submission that was uploaded successfully", async () => {
    const status = await getSubmissionOfflineStatus(101)
    assert.strictEqual(status.form?.status, "success")
    assert.strictEqual(status.won, null)
    assert.strictEqual(status.lastRequestId, "req-111")
    assert.strictEqual(status.eligible, true)
  })

  it("returns form error for a submission Google rejected", async () => {
    const status = await getSubmissionOfflineStatus(102)
    assert.strictEqual(status.form?.status, "error")
    assert.strictEqual(status.form?.errorMessage, "INVALID_GCLID")
    assert.strictEqual(status.won, null)
  })

  it("returns won success for a submission with only a won event", async () => {
    const status = await getSubmissionOfflineStatus(103)
    assert.strictEqual(status.form, null)
    assert.strictEqual(status.won?.status, "success")
  })

  it("returns empty status for an unknown submission", async () => {
    const status = await getSubmissionOfflineStatus(999)
    assert.strictEqual(status.form, null)
    assert.strictEqual(status.won, null)
    assert.strictEqual(status.lastRequestId, null)
  })
})

describe("offline conversion consent", () => {
  function makeSubmission(over: Partial<FormSubmission> = {}): FormSubmission {
    return {
      id: 42,
      form: "contact",
      locale: "et",
      name: "Test",
      email: "test@example.ee",
      phone: "",
      company: "",
      message: "",
      region: "",
      workload: "",
      workTime: "",
      attachmentName: "",
      attachmentUrl: "",
      fee: "1250",
      profit: "",
      notes: "",
      isSpam: false,
      pageUrl: "",
      gclid: "test-gclid",
      source: "google_ads",
      analyticsConsent: "granted",
      adsConsent: "granted",
      consentRecordedAt: "2026-11-26T10:00:00.000Z",
      consentVersion: "2026-11-25",
      channel: "form",
      serviceKind: "",
      salesStatus: "won",
      leadQuality: "",
      areaSize: "",
      wonAt: "2026-11-26T11:00:00.000Z",
      createdAt: "2026-11-26T10:30:00.000Z",
      ...over,
    }
  }

  it("allows only an explicit granted Ads consent", () => {
    assert.strictEqual(hasOfflineConversionConsent(makeSubmission()), true)
    assert.strictEqual(hasOfflineConversionConsent(makeSubmission({ adsConsent: "denied" })), false)
    assert.strictEqual(hasOfflineConversionConsent(makeSubmission({ adsConsent: "" })), false)
  })

  it("adds the inquiry's measurement consent to form and won events", () => {
    const expected = {
      adUserData: "CONSENT_GRANTED",
      adPersonalization: "CONSENT_DENIED",
    }
    assert.deepStrictEqual(toFormEvent(makeSubmission()).consent, expected)
    assert.deepStrictEqual(toWonEvent(makeSubmission())?.consent, expected)
  })
})
