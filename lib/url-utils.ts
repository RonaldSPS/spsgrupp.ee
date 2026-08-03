const BASE_URL = "https://spsgrupp.ee"

function normalizePagePath(raw: string): string {
  let cleaned = raw

  if (cleaned.includes("://")) {
    throw new Error(
      `normalizePagePath expects a path, not a full URL: ${raw}`,
    )
  }

  cleaned = cleaned.split("?")[0]!
  cleaned = cleaned.split("#")[0]!

  cleaned = cleaned.replace(/\/+/g, "/")

  if (!cleaned || cleaned === "/") return "/"

  if (!cleaned.startsWith("/")) cleaned = `/${cleaned}`

  return cleaned.replace(/\/$/, "") + "/"
}

function canonicalUrl(path: string): string {
  if (path.includes("://")) {
    throw new Error(
      `canonicalUrl expects a path, not a full URL: ${path}`,
    )
  }
  const normalized = normalizePagePath(path)
  if (normalized === "/") return `${BASE_URL}/`
  return `${BASE_URL}${normalized}`
}

function absoluteUrl(path: string): string {
  if (path.startsWith("https://") || path.startsWith("http://")) {
    throw new Error(
      `absoluteUrl expects a path, not a full URL: ${path}`,
    )
  }
  if (path.includes("://")) {
    throw new Error(
      `absoluteUrl expects a path, not a full URL: ${path}`,
    )
  }
  let cleaned = path
  cleaned = cleaned.replace(/\/+/g, "/")
  if (cleaned === "/") return `${BASE_URL}/`
  if (!cleaned.startsWith("/")) cleaned = `/${cleaned}`
  cleaned = cleaned.replace(/\/$/, "")
  return `${BASE_URL}${cleaned}`
}

export { BASE_URL, canonicalUrl, absoluteUrl, normalizePagePath }
