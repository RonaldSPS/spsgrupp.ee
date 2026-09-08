/**
 * One-time Google Ads OAuth2 setup: mints a refresh token for the Ads API.
 *
 * Why: the Google Ads API requires an OAuth2 *user* (not a service account
 * without domain-wide delegation). This script runs the standard loopback
 * consent flow once and prints the refresh token to store in .env.local.
 *
 * Prerequisites (see ANALYTICS.md "Google Ads API" section):
 *   1. Google Ads developer token (Ads UI -> Admin -> API Center).
 *   2. In Google Cloud project `spsgrupp`: enable "Google Ads API",
 *      configure the OAuth consent screen (scope .../auth/adwords, add the
 *      Ads-owning Google account as a test user), create an OAuth client of
 *      type "Desktop app".
 *   3. .env.local:
 *        GOOGLE_ADS_CLIENT_ID=....apps.googleusercontent.com
 *        GOOGLE_ADS_CLIENT_SECRET=...
 *
 * Usage:
 *   npm run setup:ads-auth
 *   -> a browser opens; sign in with the Google account that has access to
 *      the Ads account (AW-944834915) and approve.
 *   -> the script prints the refresh token; add it to .env.local:
 *        GOOGLE_ADS_REFRESH_TOKEN=...
 */

import { createServer } from "node:http"
import { exec } from "node:child_process"
import { readFileSync, existsSync } from "node:fs"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvLocal()

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET
const SCOPE = "https://www.googleapis.com/auth/adwords"

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error(
      [
        "GOOGLE_ADS_CLIENT_ID / GOOGLE_ADS_CLIENT_SECRET are not set in .env.local",
        "",
        "Create a 'Desktop app' OAuth client in Google Cloud Console (project spsgrupp):",
        "  APIs & Services -> Credentials -> Create Credentials -> OAuth client ID",
        "Then add to .env.local:",
        "  GOOGLE_ADS_CLIENT_ID=....apps.googleusercontent.com",
        "  GOOGLE_ADS_CLIENT_SECRET=...",
      ].join("\n"),
    )
    process.exitCode = 1
    return
  }

  const server = createServer()
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const address = server.address()
  if (!address || typeof address === "string") throw new Error("Failed to bind a local port")
  const redirectUri = `http://127.0.0.1:${address.port}`

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  authUrl.searchParams.set("client_id", CLIENT_ID)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("scope", SCOPE)
  authUrl.searchParams.set("access_type", "offline")
  authUrl.searchParams.set("prompt", "consent") // always re-consent -> always returns a refresh token

  console.log("Sign in with the Google account that has access to the Ads account (AW-944834915).\n")
  console.log("If the browser does not open, paste this URL manually:\n")
  console.log(authUrl.toString(), "\n")
  try {
    exec(`start "" "${authUrl.toString()}"`)
  } catch {
    /* manual copy-paste fallback above */
  }

  const code = await new Promise<string>((resolve, reject) => {
    server.on("request", (req, res) => {
      const url = new URL(req.url ?? "/", redirectUri)
      const codeParam = url.searchParams.get("code")
      const errorParam = url.searchParams.get("error")
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      res.end("<h1>OK</h1><p>Consent received - you can close this tab and return to the terminal.</p>")
      if (codeParam) resolve(codeParam)
      else reject(new Error(errorParam ?? "no authorization code in callback"))
    })
    setTimeout(() => reject(new Error("Timed out waiting for consent (10 min)")), 10 * 60 * 1000)
  })
  server.close()

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok || typeof data.refresh_token !== "string") {
    throw new Error(`Token exchange failed: ${JSON.stringify(data).slice(0, 400)}`)
  }

  console.log("Success. Add this line to .env.local (keep it secret, .env.local is git-ignored):\n")
  console.log(`GOOGLE_ADS_REFRESH_TOKEN=${data.refresh_token}`)
  console.log("\nThen run: npm run report:ads")
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
