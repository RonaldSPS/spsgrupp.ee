import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/url-utils"

export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV === "preview" ||
    process.env.PREVIEW_DEPLOYMENT === "true" ||
    process.env.NODE_ENV === "development"

  if (isPreview) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    }
  }

  // AI crawlers are explicitly welcome (AEO/GEO visibility); the admin stays
  // disallowed for everyone. The named list is a signal on top of the
  // wildcard allow - it covers training crawlers (GPTBot, ClaudeBot, CCBot),
  // search/answer agents (OAI-SearchBot, PerplexityBot) and the live-fetch
  // user agents (ChatGPT-User, Perplexity-User, Claude-SearchBot).
  const aiCrawlers = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-User",
    "Claude-SearchBot",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "Meta-ExternalAgent",
    "Amazonbot",
    "CCBot",
  ]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/spsadmn/", "/api/spsadmn/"],
      },
      ...aiCrawlers.map((agent) => ({
        userAgent: agent,
        allow: "/",
        disallow: ["/spsadmn/", "/api/spsadmn/"],
      })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
