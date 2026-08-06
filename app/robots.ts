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
  // disallowed for everyone.
  const aiCrawlers = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "OAI-SearchBot", "Claude-User"]

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
