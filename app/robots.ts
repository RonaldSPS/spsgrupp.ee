import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/image-tool", "/variant-a", "/variant-b", "/variant-c"],
      },
    ],
    sitemap: "https://spsgrupp.ee/sitemap.xml",
  };
}
