const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "a", "img",
  "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
  "hr", "div", "span",
])

const ALLOWED_ATTRS = new Set([
  "href", "src", "alt", "title", "width", "height",
  "class", "id", "target", "rel",
])

const ALLOWED_TARGET_VALUES = new Set(["_blank", "_self", "_parent", "_top"])

const ALLOWED_REL_VALUES = new Set([
  "nofollow", "noopener", "noreferrer", "external",
  "nofollow noopener", "nofollow noopener noreferrer",
  "noopener noreferrer", "nofollow noreferrer",
])

const EVENT_ATTR_REGEX = /^on\w+/i

function isSafeUrl(value: string): boolean {
  const lower = value.toLowerCase().trim()
  if (lower.startsWith("javascript:")) return false
  if (lower.startsWith("data:")) return false
  if (lower.startsWith("vbscript:")) return false
  return true
}

function parseAttrs(attrStr: string): Map<string, string> {
  const attrs = new Map<string, string>()
  let i = 0
  while (i < attrStr.length) {
    while (i < attrStr.length && /\s/.test(attrStr[i])) i++
    if (i >= attrStr.length) break
    let nameEnd = i
    while (nameEnd < attrStr.length && attrStr[nameEnd] !== "=" && !/\s/.test(attrStr[nameEnd])) nameEnd++
    const name = attrStr.slice(i, nameEnd).toLowerCase().trim()
    if (!name) break
    i = nameEnd
    while (i < attrStr.length && /\s/.test(attrStr[i])) i++
    if (i >= attrStr.length || attrStr[i] !== "=") {
      attrs.set(name, "")
      continue
    }
    i++
    while (i < attrStr.length && /\s/.test(attrStr[i])) i++
    let value = ""
    if (i < attrStr.length && (attrStr[i] === '"' || attrStr[i] === "'")) {
      const quote = attrStr[i]
      i++
      const end = attrStr.indexOf(quote, i)
      if (end === -1) { value = attrStr.slice(i); break }
      value = attrStr.slice(i, end)
      i = end + 1
    } else {
      let end = i
      while (end < attrStr.length && !/\s/.test(attrStr[end])) end++
      value = attrStr.slice(i, end)
      i = end
    }
    attrs.set(name, value)
  }
  return attrs
}

function sanitizeAttrs(attrStr: string): string {
  const attrs = parseAttrs(attrStr)
  const parts: string[] = []
  for (const [name, value] of attrs) {
    if (EVENT_ATTR_REGEX.test(name)) continue
    if (!ALLOWED_ATTRS.has(name)) continue
    if ((name === "href" || name === "src") && !isSafeUrl(value)) continue
    if (name === "target" && !ALLOWED_TARGET_VALUES.has(value)) continue
    if (name === "rel" && !ALLOWED_REL_VALUES.has(value)) continue
    const escaped = value
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
    parts.push(` ${name}="${escaped}"`)
  }
  return parts.join("")
}

export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") return ""
  let result = ""
  let i = 0
  while (i < html.length) {
    if (html[i] === "<") {
      const close = html.indexOf(">", i)
      if (close === -1) {
        result += html.slice(i).replace(/</g, "&lt;")
        break
      }
      const raw = html.slice(i, close + 1)
      if (raw.startsWith("</")) {
        const tagName = raw.slice(2, raw.length - 1).toLowerCase().trim()
        if (ALLOWED_TAGS.has(tagName)) result += raw
        i = close + 1
        continue
      }
      if (raw.endsWith("/>")) {
        const inner = raw.slice(1, raw.length - 2).trim()
        const spaceIdx = inner.search(/\s/)
        const tagName = (spaceIdx === -1 ? inner : inner.slice(0, spaceIdx)).toLowerCase()
        if (ALLOWED_TAGS.has(tagName)) result += raw
        i = close + 1
        continue
      }
      const inner = raw.slice(1, raw.length - 1)
      const spaceIdx = inner.search(/\s/)
      const tagPart = spaceIdx === -1 ? inner : inner.slice(0, spaceIdx)
      const tagName = tagPart.toLowerCase()
      if (!ALLOWED_TAGS.has(tagName)) { i = close + 1; continue }
      if (spaceIdx === -1) {
        result += `<${tagName}>`
      } else {
        const attrStr = inner.slice(spaceIdx)
        const safeAttrs = sanitizeAttrs(attrStr)
        result += `<${tagName}${safeAttrs}>`
      }
      i = close + 1
    } else {
      result += html[i]
      i++
    }
  }
  return result
}
