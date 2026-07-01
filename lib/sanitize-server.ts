export function sanitizeHtmlSafe(html: string): string {
  if (!html || typeof html !== "string") return ""
  let out = html
  out = out.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, "")
  out = out.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
  out = out.replace(/javascript\s*:/gi, "blocked:")
  out = out.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>/gi, "")
  out = out.replace(/<embed\b[^>]*\/?>/gi, "")
  out = out.replace(/<object\b[^>]*>[\s\S]*?<\/object\s*>/gi, "")
  return out
}
