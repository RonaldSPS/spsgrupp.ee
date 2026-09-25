/**
 * One-time Google Business Profile OAuth2 setup + connection test.
 *
 * Mirrors scripts/ads-oauth-setup.ts, but for the GBP API. The OAuth client
 * is a "Web application" client with the redirect URI registered in Google
 * Cloud Console, so this script binds that exact URI (localhost:3000).
 *
 * Prerequisites:
 *   1. GBP API access approved for the Google Cloud project (quota 300 QPM).
 *   2. OAuth client (Web application) with redirect URI
 *      http://localhost:3000/oauth/google/callback, consent screen scope
 *      https://www.googleapis.com/auth/business.manage, GBP-owning Google
 *      account added as a test user.
 *   3. .env.local:
 *        GOOGLE_CLIENT_ID=....apps.googleusercontent.com
 *        GOOGLE_CLIENT_SECRET=...
 *        GOOGLE_REDIRECT_URI=http://localhost:3000/oauth/google/callback
 *
 * Usage:
 *   npm run setup:gbp-auth
 *   -> a browser opens; sign in with the Google account that owns/manages the
 *      SPS Grupp Business Profile and approve.
 *   -> the script exchanges the code, calls accounts.list as a connection
 *      test, and prints the refresh token; add it to .env.local:
 *        GOOGLE_GBP_REFRESH_TOKEN=...
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

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI ?? "http://localhost:3000/oauth/google/callback"
const SCOPE = "https://www.googleapis.com/auth/business.manage"

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error(
      [
        "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set in .env.local",
        "",
        "Create an OAuth client (Web application) in Google Cloud Console:",
        "  APIs & Services -> Credentials -> Create Credentials -> OAuth client ID",
        "Register the redirect URI and add to .env.local:",
        "  GOOGLE_CLIENT_ID=....apps.googleusercontent.com",
        "  GOOGLE_CLIENT_SECRET=...",
        "  GOOGLE_REDIRECT_URI=http://localhost:3000/oauth/google/callback",
      ].join("\n"),
    )
    process.exitCode = 1
    return
  }

  const redirect = new URL(REDIRECT_URI)
  const port = Number(redirect.port || 80)
  const callbackPath = redirect.pathname

  const server = createServer()
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use - close the process listening on it (e.g. the dev server) and retry.`)
      process.exitCode = 1
    } else {
      console.error(err)
      process.exitCode = 1
    }
  })
  await new Promise<void>((resolve) => server.listen(port, "127.0.0.1", resolve))

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  authUrl.searchParams.set("client_id", CLIENT_ID)
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("scope", SCOPE)
  authUrl.searchParams.set("access_type", "offline")
  authUrl.searchParams.set("prompt", "consent") // always re-consent -> always returns a refresh token

  console.log("Sign in with the Google account that owns/manages the SPS Grupp Business Profile.\n")
  console.log("If the browser does not open, paste this URL manually:\n")
  console.log(authUrl.toString(), "\n")
  try {
    exec(`start "" "${authUrl.toString()}"`)
  } catch {
    /* manual copy-paste fallback above */
  }

  const code = await new Promise<string>((resolve, reject) => {
    server.on("request", (req, res) => {
      const url = new URL(req.url ?? "/", REDIRECT_URI)
      if (url.pathname !== callbackPath) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
        res.end("Not found")
        return
      }
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
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok || typeof data.refresh_token !== "string") {
    throw new Error(`Token exchange failed: ${JSON.stringify(data).slice(0, 400)}`)
  }

  console.log("TOKENS RECEIVED")
  console.log({ access_token: data.access_token ? "YES" : "NO", refresh_token: "YES" })

  /* --- connection test: list the GBP accounts this user can manage --- */
  const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: { Authorization: `Bearer ${data.access_token}` },
  })
  const accounts = (await accountsRes.json()) as Record<string, unknown>
  console.log("\nGBP RESULT (accounts.list):")
  console.dir(accounts, { depth: null })

  if (!accountsRes.ok) {
    console.error(`\naccounts.list failed with HTTP ${accountsRes.status} - see the error above.`)
    process.exitCode = 1
    return
  }

  console.log("\nSuccess. Add this line to .env.local (keep it secret, .env.local is git-ignored):\n")
  console.log(`GOOGLE_GBP_REFRESH_TOKEN=${data.refresh_token}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
