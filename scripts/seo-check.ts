import * as cheerio from "cheerio"
import { execFile, spawn, type ChildProcess } from "node:child_process"
import { existsSync } from "node:fs"
import { createServer, type AddressInfo } from "node:net"
import { promisify } from "node:util"
import {
  getCurrentEtPath,
  localizePath,
  localizedPaths,
  type Locale,
} from "../lib/slug-map"
import { BASE_URL, canonicalUrl } from "../lib/url-utils"

type Severity = "CRITICAL" | "ERROR" | "WARN"

interface Issue {
  check: string
  severity: Severity
  detail: string
}

interface PageResult {
  productionUrl: string
  issues: Issue[]
  hreflangs: Map<string, string>
  internalLinks: Set<string>
}

interface LinkResult {
  status: number
  location?: string
  error?: string
}

const execFileAsync = promisify(execFile)
const REQUEST_TIMEOUT_MS = 20_000
const PAGE_CONCURRENCY = 8
const LINK_CONCURRENCY = 12

function comparableUrl(value: string): string {
  const url = new URL(value)
  url.hash = ""
  if (url.pathname !== "/") url.pathname = `${url.pathname.replace(/\/+$/, "")}/`
  return url.href
}

function requestIdentity(value: string): string {
  const url = new URL(value)
  url.hash = ""
  return url.href
}

function localeFromPath(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en"
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru"
  return "et"
}

function expectedAlternates(productionUrl: string): Map<string, string> | null {
  const pathname = new URL(productionUrl).pathname
  const locale = localeFromPath(pathname)
  const etPath = getCurrentEtPath(pathname, locale)
  if (!localizedPaths[etPath]) return null

  return new Map([
    ["et", canonicalUrl(etPath)],
    ["en", canonicalUrl(localizePath(etPath, "en"))],
    ["ru", canonicalUrl(localizePath(etPath, "ru"))],
    ["x-default", canonicalUrl(etPath)],
  ])
}

function toTargetUrl(productionUrl: string, targetBase: string): string {
  const production = new URL(productionUrl)
  return new URL(`${production.pathname}${production.search}`, targetBase).href
}

function toProductionUrl(url: URL, targetOrigin: string): string | null {
  if (url.origin === BASE_URL || url.origin === targetOrigin) {
    return new URL(`${url.pathname}${url.search}`, BASE_URL).href
  }
  return null
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
}

async function mapConcurrent<T, R>(
  values: T[],
  concurrency: number,
  worker: (value: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length)
  let cursor = 0

  async function runWorker() {
    while (cursor < values.length) {
      const index = cursor++
      results[index] = await worker(values[index]!, index)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, runWorker),
  )
  return results
}

async function getAvailablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once("error", reject)
    server.listen(0, "127.0.0.1", () => {
      const port = (server.address() as AddressInfo).port
      server.close((error) => (error ? reject(error) : resolve(port)))
    })
  })
}

function startNextServer(port: number): ChildProcess {
  const child = spawn(
    process.execPath,
    ["scripts/next-with-system-ca.mjs", "start", "-p", String(port)],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, PORT: String(port) },
      shell: false,
      windowsHide: true,
    },
  )
  child.stdout?.on("data", () => undefined)
  child.stderr?.on("data", () => undefined)
  return child
}

async function stopProcessTree(child: ChildProcess | null): Promise<void> {
  if (!child?.pid || child.exitCode !== null) return

  if (process.platform === "win32") {
    try {
      await execFileAsync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        windowsHide: true,
      })
    } catch {
      child.kill()
    }
    return
  }

  child.kill("SIGTERM")
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      child.kill("SIGKILL")
      resolve()
    }, 3_000)
    child.once("exit", () => {
      clearTimeout(timer)
      resolve()
    })
  })
}

async function waitForServer(url: string, child: ChildProcess): Promise<void> {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Next server exited with code ${child.exitCode}`)
    }
    try {
      const response = await fetchWithTimeout(url)
      if (response.ok) return
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 400))
  }
  throw new Error(`Next server at ${url} did not start within 60 seconds`)
}

function addIssue(
  issues: Issue[],
  check: string,
  severity: Severity,
  detail: string,
) {
  issues.push({ check, severity, detail })
}

async function checkPage(
  productionUrl: string,
  targetBase: string,
): Promise<PageResult> {
  const issues: Issue[] = []
  const hreflangs = new Map<string, string>()
  const internalLinks = new Set<string>()
  const requestUrl = toTargetUrl(productionUrl, targetBase)

  let response: Response
  try {
    response = await fetchWithTimeout(requestUrl, { redirect: "manual" })
  } catch (error) {
    addIssue(issues, "status", "CRITICAL", `Request failed: ${(error as Error).message}`)
    return { productionUrl, issues, hreflangs, internalLinks }
  }

  if (response.status >= 300 && response.status < 400) {
    addIssue(
      issues,
      "redirect",
      "CRITICAL",
      `Sitemap URL redirects (${response.status}) to ${response.headers.get("location") || "unknown"}`,
    )
    return { productionUrl, issues, hreflangs, internalLinks }
  }

  if (!response.ok) {
    addIssue(issues, "status", "CRITICAL", `HTTP ${response.status}`)
    return { productionUrl, issues, hreflangs, internalLinks }
  }

  const $ = cheerio.load(await response.text())
  const h1Count = $("h1").length
  if (h1Count !== 1) {
    addIssue(issues, "h1", "CRITICAL", `Expected exactly 1 H1, found ${h1Count}`)
  }

  if (!$("title").text().trim()) addIssue(issues, "title", "ERROR", "Empty title")
  if (!($('meta[name="description"]').attr("content") || "").trim()) {
    addIssue(issues, "meta-description", "ERROR", "Empty meta description")
  }

  const canonical = $('link[rel="canonical"]').attr("href") || ""
  if (!canonical) {
    addIssue(issues, "canonical", "CRITICAL", "Missing canonical")
  } else {
    try {
      if (comparableUrl(canonical) !== comparableUrl(productionUrl)) {
        addIssue(issues, "canonical", "CRITICAL", `Expected ${productionUrl}, found ${canonical}`)
      }
    } catch {
      addIssue(issues, "canonical", "CRITICAL", `Invalid canonical: ${canonical}`)
    }
  }

  const ogUrl = $('meta[property="og:url"]').attr("content") || ""
  if (!ogUrl) {
    addIssue(issues, "og:url", "ERROR", "Missing og:url")
  } else if (canonical && comparableUrl(ogUrl) !== comparableUrl(canonical)) {
    addIssue(issues, "og:url", "ERROR", `og:url ${ogUrl} differs from canonical ${canonical}`)
  }
  if (!$('meta[property="og:image"]').attr("content")) {
    addIssue(issues, "og:image", "ERROR", "Missing og:image")
  }
  if ($('meta[name="twitter:card"]').attr("content") !== "summary_large_image") {
    addIssue(issues, "twitter:card", "ERROR", "Expected summary_large_image")
  }

  const mainCount = $("#main-content").length
  if (mainCount !== 1) {
    addIssue(issues, "main-content", "ERROR", `Expected exactly 1 #main-content, found ${mainCount}`)
  }

  $('link[rel="alternate"][hreflang]').each((_, element) => {
    const language = ($(element).attr("hreflang") || "").toLowerCase()
    const href = $(element).attr("href") || ""
    if (language && href) hreflangs.set(language, href)
  })

  const expected = expectedAlternates(productionUrl)
  if (expected) {
    for (const [language, expectedUrl] of expected) {
      const actual = hreflangs.get(language)
      if (!actual) {
        addIssue(issues, "hreflang", "ERROR", `Missing ${language} alternate`)
      } else if (comparableUrl(actual) !== comparableUrl(expectedUrl)) {
        addIssue(issues, "hreflang", "ERROR", `${language} expected ${expectedUrl}, found ${actual}`)
      }
    }

    const selfLanguage = localeFromPath(new URL(productionUrl).pathname)
    const selfAlternate = hreflangs.get(selfLanguage)
    if (!selfAlternate || comparableUrl(selfAlternate) !== comparableUrl(productionUrl)) {
      addIssue(issues, "hreflang", "ERROR", `Missing or invalid self-reference for ${selfLanguage}`)
    }
  }

  $('script[type="application/ld+json"]').each((_, element) => {
    const value = $(element).text().trim()
    if (!value) {
      addIssue(issues, "json-ld", "ERROR", "Empty JSON-LD script")
      return
    }
    try {
      JSON.parse(value)
    } catch (error) {
      addIssue(issues, "json-ld", "ERROR", `Invalid JSON-LD: ${(error as Error).message}`)
    }
  })

  $('a[href]').each((_, element) => {
    const href = $(element).attr("href") || ""
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) return
    try {
      const resolved = new URL(href, requestUrl)
      resolved.hash = ""
      const productionLink = toProductionUrl(resolved, new URL(targetBase).origin)
      if (productionLink) internalLinks.add(productionLink)
    } catch {
      addIssue(issues, "internal-link", "ERROR", `Invalid link: ${href}`)
    }
  })

  return { productionUrl, issues, hreflangs, internalLinks }
}

async function checkLink(
  productionUrl: string,
  targetBase: string,
): Promise<LinkResult> {
  try {
    const response = await fetchWithTimeout(toTargetUrl(productionUrl, targetBase), {
      redirect: "manual",
      method: "HEAD",
    })
    return {
      status: response.status,
      location: response.headers.get("location") || undefined,
    }
  } catch (error) {
    return { status: 0, error: (error as Error).message }
  }
}

function validateReciprocalHreflangs(results: PageResult[]) {
  const pagesByUrl = new Map(
    results.map((result) => [comparableUrl(result.productionUrl), result]),
  )

  for (const result of results) {
    const expected = expectedAlternates(result.productionUrl)
    if (!expected) continue
    for (const [language, alternateUrl] of expected) {
      const alternatePage = pagesByUrl.get(comparableUrl(alternateUrl))
      if (!alternatePage) {
        addIssue(result.issues, "hreflang-target", "ERROR", `${language} target is missing from sitemap: ${alternateUrl}`)
        continue
      }
      for (const [returnLanguage, returnUrl] of expected) {
        const reciprocal = alternatePage.hreflangs.get(returnLanguage)
        if (!reciprocal || comparableUrl(reciprocal) !== comparableUrl(returnUrl)) {
          addIssue(
            result.issues,
            "hreflang-reciprocal",
            "ERROR",
            `${alternateUrl} does not return the expected ${returnLanguage} alternate`,
          )
          break
        }
      }
    }
  }
}

function severityLabel(severity: Severity): string {
  if (severity === "CRITICAL") return "\x1b[31mCRITICAL\x1b[0m"
  if (severity === "ERROR") return "\x1b[33mERROR\x1b[0m"
  return "\x1b[36mWARN\x1b[0m"
}

async function run(): Promise<number> {
  const baseUrlArg = process.argv.slice(2).find((arg) => arg.startsWith("--base-url="))
  const productionMode = Boolean(baseUrlArg)
  const productionBase = (baseUrlArg?.slice("--base-url=".length) || BASE_URL).replace(/\/$/, "")
  let targetBase = productionBase
  let server: ChildProcess | null = null

  const cleanup = () => stopProcessTree(server)
  process.once("SIGINT", () => void cleanup().finally(() => { process.exitCode = 130 }))
  process.once("SIGTERM", () => void cleanup().finally(() => { process.exitCode = 143 }))

  try {
    if (!productionMode) {
      if (!existsSync(".next/BUILD_ID")) {
        throw new Error("No production build found. Run `npm run build` before `npm run seo:check`.")
      }
      const port = await getAvailablePort()
      targetBase = `http://127.0.0.1:${port}`
      console.log(`Local mode: starting Next server on port ${port}`)
      server = startNextServer(port)
      await waitForServer(targetBase, server)
    } else {
      console.log(`Production mode: crawling ${productionBase}`)
    }

    const sitemapResponse = await fetchWithTimeout(`${targetBase}/sitemap.xml`)
    if (!sitemapResponse.ok) throw new Error(`Sitemap returned HTTP ${sitemapResponse.status}`)
    const sitemap = cheerio.load(await sitemapResponse.text(), { xmlMode: true })
    const productionUrls = sitemap("url > loc")
      .map((_, element) => sitemap(element).text().trim())
      .get()
      .map((url) => {
        const parsed = new URL(url)
        return new URL(parsed.pathname, productionBase).href
      })

    console.log(`Checking ${productionUrls.length} sitemap pages...`)
    let completed = 0
    const results = await mapConcurrent(
      productionUrls,
      PAGE_CONCURRENCY,
      async (url) => {
        const result = await checkPage(url, targetBase)
        completed++
        process.stdout.write(`\rPages: ${completed}/${productionUrls.length}`)
        return result
      },
    )
    process.stdout.write("\n")

    validateReciprocalHreflangs(results)

    const linkSources = new Map<string, PageResult[]>()
    for (const result of results) {
      for (const link of result.internalLinks) {
        const key = requestIdentity(link)
        const sources = linkSources.get(key) || []
        sources.push(result)
        linkSources.set(key, sources)
      }
    }

    const links = [...linkSources.keys()]
    console.log(`Checking ${links.length} unique internal links...`)
    const linkResults = await mapConcurrent(links, LINK_CONCURRENCY, (link) => checkLink(link, targetBase))
    links.forEach((link, index) => {
      const status = linkResults[index]!
      for (const source of linkSources.get(link) || []) {
        if (status.error || status.status === 0 || status.status >= 400) {
          addIssue(source.issues, "internal-link", "ERROR", `${link} returned ${status.error || `HTTP ${status.status}`}`)
        } else if (status.status >= 300) {
          addIssue(source.issues, "internal-link", "WARN", `${link} redirects (${status.status}) to ${status.location || "unknown"}`)
        }
      }
    })

    let critical = 0
    let errors = 0
    let warnings = 0
    for (const result of results) {
      if (result.issues.length === 0) continue
      console.log(`\n${new URL(result.productionUrl).pathname}`)
      for (const issue of result.issues) {
        if (issue.severity === "CRITICAL") critical++
        else if (issue.severity === "ERROR") errors++
        else warnings++
        console.log(`  ${severityLabel(issue.severity)} ${issue.check}: ${issue.detail}`)
      }
    }

    console.log(`\n${productionUrls.length} pages checked: ${critical} critical, ${errors} errors, ${warnings} warnings`)
    return critical > 0 ? 1 : 0
  } finally {
    await stopProcessTree(server)
  }
}

run()
  .then((exitCode) => {
    process.exitCode = exitCode
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
