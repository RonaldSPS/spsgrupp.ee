/**
 * One-time LinkedIn Advertising API (Marketing Developer Platform) OAuth2
 * setup + connection test.
 *
 * Mirrors scripts/gbp-oauth-setup.ts, but for LinkedIn. 3-legged OAuth:
 * this script binds a loopback HTTP server, opens the consent screen in a
 * browser, exchanges the authorization code, and prints the refresh token.
 *
 * Prerequisites:
 *   1. Developer Portal app at https://developer.linkedin.com/ associated
 *      with the SPS Grupp LinkedIn Page (Settings -> Verify the page link).
 *   2. Products tab -> "Advertising API" (Marketing Developer Platform)
 *      access requested and approved (needs the company page + the 9-digit
 *      ad account ID from Campaign Manager); the ad account added under
 *      Products -> View Ad Accounts (up to 5 on the Development tier).
 *   3. Auth tab -> OAuth 2.0 settings -> Authorized redirect URLs:
 *      http://localhost:3000/oauth/linkedin/callback
 *   4. .env.local (Auth tab -> Application credentials):
 *        LINKEDIN_CLIENT_ID=...
 *        LINKEDIN_CLIENT_SECRET=...
 *        LINKEDIN_REDIRECT_URI=http://localhost:3000/oauth/linkedin/callback
 *
 * Usage:
 *   npm run setup:linkedin-auth
 *   -> a browser opens; sign in with the LinkedIn member who is admin on the
 *      SPS Grupp Page / ad account and approve.
 *   -> the script exchanges the code, calls adAccounts search as a
 *      connection test, and prints the refresh token; add it to .env.local:
 *        LINKEDIN_REFRESH_TOKEN=...
 *
 * Token lifetimes (MDP partners get programmatic refresh tokens):
 * access token 60 days, refresh token 365 days. Refresh later with
 * grant_type=refresh_token against the same token endpoint.
 */

import { createServer } from "node:http"
import { exec } from "node:child_process"
import { randomBytes } from "node:crypto"
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

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI ?? "http://localhost:3000/oauth/linkedin/callback"
/* Space-delimited per LinkedIn docs (URLSearchParams encodes the spaces).
   r_ads_reporting = analytics read, r_ads = account/campaign read,
   rw_ads = write. Override with LINKEDIN_SCOPES if the app has fewer grants. */
const SCOPE = process.env.LINKEDIN_SCOPES ?? "r_ads r_ads_reporting rw_ads"

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error(
      [
        "LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET are not set in .env.local",
        "",
        "Create a developer app at https://developer.linkedin.com/ (see the",
        "prerequisites in this file's header), then copy the Auth tab",
        "credentials to .env.local:",
        "  LINKEDIN_CLIENT_ID=...",
        "  LINKEDIN_CLIENT_SECRET=...",
        "  LINKEDIN_REDIRECT_URI=http://localhost:3000/oauth/linkedin/callback",
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

  const state = randomBytes(16).toString("hex") // CSRF protection
  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization")
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("client_id", CLIENT_ID)
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI)
  authUrl.searchParams.set("scope", SCOPE)
  authUrl.searchParams.set("state", state)

  console.log("Sign in with the LinkedIn member who is admin on the SPS Grupp Page / ad account.\n")
  console.log("If the browser does not open, paste this URL manually:\n")
  console.log(authUrl.toString(), "\n")
  try {
    exec(`start "" "${authUrl.toString()}"`)
  } catch {
    /* manual copy-paste fallback above */
  }

  const code = await new Promise<string>((resolve, reject) => {
    /* The timeout must be cleared on success and must close the server when it
       fires - otherwise a pending timer / open listener keeps the process
       alive for 10 minutes after the run has finished (holding the log file
       open and breaking reruns). */
    const timeout = setTimeout(() => {
      server.close()
      reject(new Error("Timed out waiting for consent (10 min)"))
    }, 10 * 60 * 1000)
    server.on("request", (req, res) => {
      const url = new URL(req.url ?? "/", REDIRECT_URI)
      if (url.pathname !== callbackPath) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
        res.end("Not found")
        return
      }
      const codeParam = url.searchParams.get("code")
      const errorParam = url.searchParams.get("error")
      const errorDescription = url.searchParams.get("error_description")
      const stateParam = url.searchParams.get("state")
      if (stateParam !== state) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" })
        res.end("State mismatch - aborted")
        clearTimeout(timeout)
        reject(new Error("State mismatch in callback - possible CSRF, aborted"))
        return
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      res.end("<h1>OK</h1><p>Consent received - you can close this tab and return to the terminal.</p>")
      clearTimeout(timeout)
      if (codeParam) resolve(codeParam)
      else reject(new Error(errorDescription ?? errorParam ?? "no authorization code in callback"))
    })
  })
  server.close()

  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok || typeof data.access_token !== "string") {
    throw new Error(`Token exchange failed: ${JSON.stringify(data).slice(0, 400)}`)
  }

  console.log("TOKENS RECEIVED")
  console.log({
    access_token: "YES",
    expires_in_days: typeof data.expires_in === "number" ? Math.round(data.expires_in / 86400) : "?",
    refresh_token: typeof data.refresh_token === "string" ? "YES" : "NO",
    refresh_token_expires_in_days:
      typeof data.refresh_token_expires_in === "number" ? Math.round(data.refresh_token_expires_in / 86400) : "?",
    scope: data.scope,
  })

  /* Print the refresh token BEFORE the connection test - a failing test must
     never lose an otherwise valid token. */
  if (typeof data.refresh_token === "string") {
    console.log("\nAdd this line to .env.local (keep it secret, .env.local is git-ignored):\n")
    console.log(`LINKEDIN_REFRESH_TOKEN=${data.refresh_token}`)
  } else {
    console.error(
      [
        "",
        "WARNING: no refresh_token in the response - only a 60-day access token.",
        "Programmatic refresh tokens are issued to apps approved for the",
        "Marketing Developer Platform (Advertising API product). If the",
        "Advertising API access request is still pending, re-run this script",
        "after approval. The access token works until it expires.",
      ].join("\n"),
    )
  }

  /* --- connection test: list ad accounts visible to this member --- */
  const accountsRes = await fetch("https://api.linkedin.com/rest/adAccounts?q=search", {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
      "Linkedin-Version": "202511",
      "X-Restli-Protocol-Version": "2.0.0",
    },
  })
  const accounts = (await accountsRes.json()) as Record<string, unknown>
  console.log("\nLINKEDIN RESULT (adAccounts search):")
  console.dir(accounts, { depth: null })

  if (!accountsRes.ok) {
    console.error(`\nadAccounts search failed with HTTP ${accountsRes.status} - see the error above.`)
    console.error(
      "A 403 usually means the ad account is not mapped to the app: Developer Portal -> app -> Products -> View Ad Accounts -> Add Ad Account (9-digit ID from Campaign Manager).",
    )
    console.error("The refresh token above is still valid - fix the access issue and retry the test.")
    process.exitCode = 1
    return
  }

  console.log("\nSuccess - connection works.")
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
