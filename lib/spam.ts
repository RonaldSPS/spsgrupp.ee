/**
 * Content-based spam heuristics for the public forms (contact + career).
 * Pure and unit-testable: no I/O, no env access.
 *
 * Design notes:
 * - Real customers of a cleaning company almost never paste URLs; contact-form
 *   spam (SEO/backlink pitches, mostly EN/RU) almost always does.
 * - Everything is matched case-insensitively on normalized text.
 * - The goal is precision over recall: a false negative just means one junk
 *   mail lands in the inbox; a false positive hides a real customer from it
 *   (they are still saved in admin, but with the Spämm badge only).
 */

export interface SpamAssessmentInput {
  name: string
  email: string
  message: string
  form: "contact" | "career"
}

export interface SpamAssessment {
  flagged: boolean
  reasons: string[]
}

const URL_RE = /(?:https?:\/\/|www\.)/gi

/** Flag a message carrying at least this many links. */
const MAX_MESSAGE_LINKS = 2

/** Classic contact-form spam phrases (lowercase, matched as substrings). */
const BLOCKED_PHRASES = [
  // EN marketing/SEO spam
  "seo service",
  "seo services",
  "search engine optimization",
  "backlink",
  "link building",
  "google ranking",
  "rank on google",
  "first page of google",
  "website traffic",
  "domain authority",
  "digital marketing agency",
  "guest post",
  "guest posting",
  // money schemes
  "crypto",
  "bitcoin",
  "forex",
  "casino",
  "passive income",
  "investment opportunity",
  // RU variants
  "продвижение",
  "раскрутка",
  "ссылочная масса",
  "наращивание ссылок",
  "поисковое продвижение",
  "заработок",
  "криптовалют",
  "инвестици",
  // adult
  "viagra",
  "porn",
  "xxx",
]

/** Disposable / throwaway e-mail domains. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "yopmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "sharklasers.com",
  "trashmail.com",
  "getnada.com",
  "dispostable.com",
  "fakeinbox.com",
  "maildrop.cc",
  "mintemail.com",
  "mohmal.com",
])

function countOccurrences(text: string, re: RegExp): number {
  const matches = text.match(re)
  return matches ? matches.length : 0
}

export function assessSubmission(input: SpamAssessmentInput): SpamAssessment {
  const reasons: string[] = []
  const name = input.name.toLowerCase()
  const message = input.message.toLowerCase()
  const emailDomain = input.email.split("@")[1]?.toLowerCase() ?? ""

  const linkCount = countOccurrences(message, URL_RE)
  if (linkCount >= MAX_MESSAGE_LINKS) {
    reasons.push(`message contains ${linkCount} links`)
  }

  if (URL_RE.test(name)) {
    reasons.push("name contains a URL")
  }
  URL_RE.lastIndex = 0

  const haystack = `${name}\n${message}`
  const hit = BLOCKED_PHRASES.find((phrase) => haystack.includes(phrase))
  if (hit) {
    reasons.push(`blocked phrase: "${hit}"`)
  }

  if (DISPOSABLE_DOMAINS.has(emailDomain)) {
    reasons.push("disposable e-mail domain")
  }

  return { flagged: reasons.length > 0, reasons }
}
