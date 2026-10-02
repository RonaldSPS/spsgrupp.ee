import test from "node:test"
import assert from "node:assert/strict"
import { classifyMaintenance, isJobSeeker } from "../reporting/forms"
import type { FormSubmission } from "../form-submissions"

function makeSubmission(over: Partial<FormSubmission>): FormSubmission {
  return {
    id: 1, form: "contact", locale: "et", name: "", email: "", phone: "", company: "",
    message: "", region: "", workload: "", workTime: "", attachmentName: "",
    fee: "", profit: "", notes: "", isSpam: false, pageUrl: "", gclid: "", source: "",
    createdAt: "2026-09-25T00:00:00.000Z",
    ...over,
  }
}

/* ---------- isJobSeeker (kliendi palve 02.10.2026: tööotsingud arvestusest välja) ---------- */

test("isJobSeeker: tööportaali viide (tootukassa.ee) + pelk ametinimetus -> tööotsing", () => {
  assert.equal(
    isJobSeeker(makeSubmission({ message: "Housekeeping", source: "referral:tootukassa.ee" })),
    true,
  )
})

test("isJobSeeker: pelk ametinimetus sõnumis on üksi tööotsing", () => {
  assert.equal(isJobSeeker(makeSubmission({ message: "Housekeeping", source: "organic:google" })), true)
  assert.equal(isJobSeeker(makeSubmission({ message: "Koristaja", source: "" })), true)
  assert.equal(isJobSeeker(makeSubmission({ message: "Уборщица", source: "" })), true)
})

test("isJobSeeker: selge tööotsingu fraas", () => {
  assert.equal(
    isJobSeeker(makeSubmission({ message: "Tere, otsin tööd koristajana Tallinnas. Kas Teil on vabu töökohti?" })),
    true,
  )
})

test("isJobSeeker: career-vormi rida EI filtreeru (see on seaduslik tööavaldus)", () => {
  assert.equal(
    isJobSeeker(makeSubmission({ form: "career", message: "Otsin tööd koristajana", source: "referral:tootukassa.ee" })),
    false,
  )
})

test("isJobSeeker: tavaline äripäring ei filtreeru", () => {
  assert.equal(
    isJobSeeker(makeSubmission({
      company: "Karnaluks OÜ",
      message: "Otsime koristusfirmat 1300 m² kaubanduspinnale, 3x nädalas.",
      source: "organic:google",
    })),
    false,
  )
})

test("isJobSeeker: cv.ee viide on tööotsing ka pikema sõnumiga", () => {
  assert.equal(
    isJobSeeker(makeSubmission({ message: "Sooviksin Teie ettevõttes tööd saada.", source: "referral:cv.ee" })),
    true,
  )
})

/* ---------- classifyMaintenance (karmistatud 02.10.2026: ühekordsed ei ole "tõenäoliselt regulaarne") ---------- */

test("classifyMaintenance: ühekordne tänavakivide pesu korteriühistule -> no (Siili 13 juhtum)", () => {
  assert.equal(
    classifyMaintenance(
      "Siili 13 kü",
      "Soovime küsida hinnapakkumist korteriühistu territooriumil asuvate asfalt- ja tänavakivipindade professionaalseks puhastamiseks. Pindadele on tekkinud sammal ja mustus.",
    ),
    "no",
  )
})

test("classifyMaintenance: selge korduvuse viide -> yes (ka väikese objekti korral)", () => {
  assert.equal(
    classifyMaintenance(
      "OÜ STFF Stafferty",
      "Alates uuest aastast kolime uude kontoriruumi ning sooviksime saada hinnapakkumist regulaarsele koristusteenusele. Kontori pindala on ligikaudu 50 m² ning sooviksime koristust 2x nädalas.",
    ),
    "yes",
  )
})

test("classifyMaintenance: korduvus võidab ühekordse signaali (akende pesu 1x kuus)", () => {
  assert.equal(
    classifyMaintenance("Büroo OÜ", "Soovime pakkumist akende pesule 1x kuus, lepinguliselt."),
    "yes",
  )
})

test("classifyMaintenance: äripind ilma ühekordse märgita on endiselt likely", () => {
  assert.equal(
    classifyMaintenance("Kauplus X OÜ", "Soovime hinnapakkumist kaupluse koristusele, pind 400 m²."),
    "likely",
  )
})

test("classifyMaintenance: fassaadipesu on ühekordne, fassaadi hooldus lepinguliselt on yes", () => {
  assert.equal(classifyMaintenance("KÜ Aia 5", "Soovime fassaadi survepesu pakkumist."), "no")
  assert.equal(classifyMaintenance("KÜ Aia 5", "Soovime fassaadiklaaside pesu regulaarselt, kord kvartalis."), "yes")
})
