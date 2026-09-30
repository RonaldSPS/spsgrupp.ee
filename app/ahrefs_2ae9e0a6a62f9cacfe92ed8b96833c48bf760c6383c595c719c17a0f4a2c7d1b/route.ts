// Ahrefs Site Audit ownership verification (no-extension URL form).
// The .html variant is served directly from public/; this route covers
// /ahrefs_<hash> (extensionless paths get trailing-slash normalized first,
// and proxy.ts must not rewrite them to /et).
export function GET() {
  return new Response(
    "ahrefs-site-verification_2ae9e0a6a62f9cacfe92ed8b96833c48bf760c6383c595c719c17a0f4a2c7d1b",
    { headers: { "content-type": "text/html; charset=utf-8" } },
  )
}
