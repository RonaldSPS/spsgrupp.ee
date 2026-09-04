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
  /** Optional; contact form only. Used for generated-company detection. */
  company?: string
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

const VOWELS = new Set("aeiouõäöüyAEIOUÕÄÖÜY")
const CONSONANT_RUN_RE = /[bcdfghjklmnpqrstvwxz]{6,}/i
/** Foreign legal suffixes that generated spam companies love ("Vajxcoy LLC"). */
const COMPANY_SUFFIX_RE = /\b(?:llc|ltd|inc|llp|gmbh|corp|co)\.?$/i

/**
 * Heuristic for bot-generated gibberish like "omHItThaCbRFPkXmVwfcQMa" or
 * "YCcRMBKqAdlcYBLf": a single long token with lots of case flips, almost no
 * vowels, or an Estonian-impossible consonant run. Short tokens are never
 * flagged - real names/words stay safe.
 */
function looksLikeRandomToken(token: string): boolean {
  if (token.length < 10 || /\d/.test(token)) return false
  let caseFlips = 0
  let vowelCount = 0
  for (let i = 0; i < token.length; i++) {
    const ch = token[i]
    if (VOWELS.has(ch)) vowelCount++
    if (i > 0) {
      const prevLower = token[i - 1] >= "a" && token[i - 1] <= "z"
      const curLower = ch >= "a" && ch <= "z"
      const prevUpper = token[i - 1] >= "A" && token[i - 1] <= "Z"
      const curUpper = ch >= "A" && ch <= "Z"
      if ((prevLower && curUpper) || (prevUpper && curLower)) caseFlips++
    }
  }
  return caseFlips >= 3 || vowelCount / token.length <= 0.22 || CONSONANT_RUN_RE.test(token)
}

/** The whole field is one gibberish token ("MXutidLoKuLPuqHo"). */
function isSingleRandomToken(value: string): boolean {
  const trimmed = value.trim()
  return !/\s/.test(trimmed) && looksLikeRandomToken(trimmed)
}

/** Every long token in the field is gibberish and at least one exists. */
function isMostlyRandomTokens(value: string): boolean {
  const tokens = value.trim().split(/\s+/)
  const long = tokens.filter((t) => t.length >= 10)
  return long.length >= 2 && long.every(looksLikeRandomToken)
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

  // Bot-generated gibberish (random names/messages with no links or phrases,
  // e.g. "omHItThaCbRFPkXmVwfcQMa" / "YCcRMBKqAdlcYBLf"). Runs on the ORIGINAL
  // casing - case flips are the strongest signal and lowercasing erases them.
  if (isSingleRandomToken(input.name) || isMostlyRandomTokens(input.name)) {
    reasons.push("name looks randomly generated")
  }
  if (isSingleRandomToken(input.message) || isMostlyRandomTokens(input.message)) {
    reasons.push("message looks randomly generated")
  }
  if (input.company) {
    const core = input.company.trim().replace(COMPANY_SUFFIX_RE, "").trim()
    if (core && isSingleRandomToken(core)) {
      reasons.push("company looks randomly generated")
    }
  }

  return { flagged: reasons.length > 0, reasons }
}
