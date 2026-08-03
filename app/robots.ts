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

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/spsadmn/",
          "/api/spsadmn/",
          "/image-tool",
          "/variant-a",
          "/variant-b",
          "/variant-c",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
