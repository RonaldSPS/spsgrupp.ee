/**
 * GTM container audit + remediation for the 27.10.2026 analytics audit.
 * Covers the container-side findings:
 *
 *   P1  Enhanced-Conversions/conversion tag whose destination/conversion ID
 *       is a variable (e.g. a click variable) instead of the constant
 *       AW-944834915. (Found: tag 41 "Google Ads - Enhanced Conversions Data
 *       Tag" had conversionId = "AW-944834915{{Click ID}}".)
 *   P2  Career submissions leaking into lead measurement: every tag firing
 *       on form_submit / form_submission_success must carry a blocking
 *       trigger that matches form_id=career on the same event.
 *   P3  (GTM-side) measurement tags fire on any hostname — a hostname
 *       exception covers localhost / *.vercel.app previews / mirrors.
 *       (Admin pages are handled code-side: app/spsadmn has its own
 *       GTM-free root layout; preview deploys are gated via VERCEL_ENV.)
 *   P4  Form-measurement overlap map: which tags fire on which form event,
 *       GA4 event names involved, and the GA4 key-event inventory. The
 *       Ads-imported lead key event (form_submit_2026) must be produced by
 *       exactly one career-blocked tag.
 *
 * Usage:
 *   npm run audit:gtm                     # read-only audit (tagmanager.readonly)
 *   npm run audit:gtm -- --dump           # + full tag/trigger/variable listing
 *   npm run audit:gtm -- --fix --dry-run  # print planned writes, send nothing
 *   npm run audit:gtm -- --fix            # apply fixes in the default workspace
 *                                         #   (left UNPUBLISHED for review)
 *   npm run audit:gtm -- --fix --publish  # additionally create+publish a version
 *
 * Auth: the sps-analytics-reader service account (same key as the analytics
 * reports). The SA email must be a user on the GTM container
 * (GTM → Admin → Container → User Management): "Read" for the audit,
 * "Edit" for --fix. GA4 key events are listed via the Admin API with the
 * analytics.readonly scope (SA is already a property Viewer).
 *
 * GTM API quirks handled here: list endpoints paginate via nextPageToken;
 * tag/trigger parameter lists carry {type,key,value} triples; a custom-event
 * trigger's first customEventFilter condition is the event-name match and
 * arg0 may be "_event" or "{{_event}}"; blocking triggers are
 * Tag.blockingTriggerId; update (PUT) needs the full resource incl. its
 * fingerprint (we round-trip the fetched object).
 */

import { readFileSync, existsSync } from "node:fs"
import { getGoogleAccessToken } from "../lib/reporting/google-auth"

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const i = t.indexOf("=")
    if (i > 0 && process.env[t.slice(0, i).trim()] === undefined) process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
}

const FIX = process.argv.includes("--fix")
const DRY_RUN = process.argv.includes("--dry-run")
const PUBLISH = process.argv.includes("--publish")
const DUMP = process.argv.includes("--dump")
const containerArg = process.argv.find((a) => a.startsWith("--container="))
const CONTAINER_PUBLIC_ID = containerArg ? containerArg.slice(12) : "GTM-KP5VZH9Q"

const GTM_API = "https://tagmanager.googleapis.com/tagmanager/v2"
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID ?? "328729351"
const ADS_ID = "AW-944834915"
const GA4_ID = "G-KE6ZB0WXL9"
const FORM_EVENTS = ["form_submit", "form_submission_success"]
/** The GA4 key event the Ads lead conversion is imported from (26.10.2026 cleanup). */
const LEAD_KEY_EVENT = "form_submit_2026"
const HOSTNAME_REGEX = "^(www\\.)?spsgrupp\\.ee$"
/** Tag types that send measurement data and therefore need the hostname exception. */
const MEASUREMENT_TAG_TYPES = new Set(["googtag", "gaawe", "gaawc", "awud", "awct"])

/* ------------------------------- types ---------------------------------- */

interface GtmParameter {
  type?: string
  key?: string
  value?: string
}
interface GtmCondition {
  type?: string
  parameter?: GtmParameter[]
}
interface GtmTag {
  path: string
  tagId?: string
  name?: string
  type?: string
  parameter?: GtmParameter[]
  firingTriggerId?: string[]
  blockingTriggerId?: string[]
  [k: string]: unknown
}
interface GtmTrigger {
  path: string
  triggerId?: string
  name?: string
  type?: string
  customEventFilter?: GtmCondition[]
  filter?: GtmCondition[]
  [k: string]: unknown
}
interface GtmVariable {
  path: string
  variableId?: string
  name?: string
  type?: string
  parameter?: GtmParameter[]
}
interface GtmWorkspace {
  path: string
  workspaceId?: string
  name?: string
}

/* ------------------------------ helpers --------------------------------- */

async function gtmFetch<T>(token: string, url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const text = await res.text()
    if (res.status === 403) {
      throw new Error(
        `GTM API 403 PERMISSION_DENIED — teenuskontol pole õigusi.\n` +
          `  Lisa sps-analytics-reader@spsgrupp.iam.gserviceaccount.com GTM-is kasutajaks:\n` +
          `  https://tagmanager.google.com → konteiner ${CONTAINER_PUBLIC_ID} → Admin →\n` +
          `  Container → User Management → + → "${FIX ? "Edit" : "Read"}" õigus.\n` +
          `  (${text.slice(0, 200)})`,
      )
    }
    throw new Error(`${init?.method ?? "GET"} ${url} -> ${res.status}: ${text.slice(0, 1500)}`)
  }
  return (await res.json()) as T
}

async function listAll<T>(token: string, url: string, key: string): Promise<T[]> {
  const out: T[] = []
  let pageToken: string | undefined
  do {
    const sep = url.includes("?") ? "&" : "?"
    const data = await gtmFetch<Record<string, unknown>>(token, pageToken ? `${url}${sep}pageToken=${pageToken}` : url)
    const items = data[key]
    if (Array.isArray(items)) out.push(...(items as T[]))
    pageToken = typeof data.nextPageToken === "string" && data.nextPageToken ? data.nextPageToken : undefined
  } while (pageToken)
  return out
}

const param = (t: GtmTag, key: string): string | undefined => t.parameter?.find((p) => p.key === key)?.value

function condArgs(c: GtmCondition): { arg0: string; arg1: string } {
  const get = (k: string) => c.parameter?.find((p) => p.key === k)?.value ?? ""
  return { arg0: get("arg0"), arg1: get("arg1") }
}

/** Variable references may arrive as "_event" or "{{_event}}" — compare bare names. */
const bare = (s: string): string => s.replace(/^\{\{|\}\}$/g, "")

/** The event-name match of a customEvent trigger: value + operator of the _event condition. */
function customEventMatch(t: GtmTrigger): { operator: string; value: string } | null {
  if (t.type !== "customEvent") return null
  const ev = t.customEventFilter?.find((c) => bare(condArgs(c).arg0) === "_event")
  return ev ? { operator: ev.type ?? "equals", value: condArgs(ev).arg1 } : null
}

/** Does this customEvent trigger fire for the given concrete event name? Handles equals + regex + contains. */
function triggerMatchesEvent(t: GtmTrigger, eventName: string): boolean {
  const m = customEventMatch(t)
  if (!m) return false
  if (m.operator === "matchRegex") {
    try {
      return new RegExp(`^(?:${m.value})$`).test(eventName)
    } catch {
      return m.value === eventName
    }
  }
  if (m.operator === "contains") return eventName.includes(m.value)
  return m.value === eventName
}

/** True when the trigger is a customEvent matching `eventName` filtered to form_id=career. */
function isCareerBlocker(t: GtmTrigger, eventName: string): boolean {
  if (!triggerMatchesEvent(t, eventName)) return false
  // Additional conditions may land in customEventFilter or filter depending
  // on how the trigger was built — scan both.
  return [...(t.customEventFilter ?? []), ...(t.filter ?? [])].some((c) => {
    const { arg0, arg1 } = condArgs(c)
    return arg0.includes("form_id") && arg1 === "career"
  })
}

/* -------------------------------- main ----------------------------------- */

async function main() {
  console.log(`GTM-audit: konteiner ${CONTAINER_PUBLIC_ID}${FIX ? (DRY_RUN ? " [fix DRY-RUN]" : " [FIX]") : ""}`)
  const scopes = [
    FIX ? "https://www.googleapis.com/auth/tagmanager.edit.containers" : "https://www.googleapis.com/auth/tagmanager.readonly",
    // Versioning/publishing is gated by SEPARATE token scopes (27.10.2026:
    // an edit-scope token 403s with ACCESS_TOKEN_SCOPE_INSUFFICIENT even when
    // the SA has container Publish rights): create_version needs
    // edit.containerversions, :publish needs tagmanager.publish.
    ...(PUBLISH
      ? [
          "https://www.googleapis.com/auth/tagmanager.edit.containerversions",
          "https://www.googleapis.com/auth/tagmanager.publish",
        ]
      : []),
    "https://www.googleapis.com/auth/analytics.readonly",
  ]
  const token = await getGoogleAccessToken(scopes)

  // Resolve the container path (accounts -> containers -> publicId match).
  const accounts = await listAll<{ path: string; accountId?: string; name?: string }>(token, `${GTM_API}/accounts`, "account")
  let containerPath: string | null = null
  for (const acc of accounts) {
    const containers = await listAll<{ path: string; publicId?: string; name?: string }>(token, `${GTM_API}/${acc.path}/containers`, "container")
    const hit = containers.find((c) => c.publicId === CONTAINER_PUBLIC_ID)
    if (hit) {
      containerPath = hit.path
      break
    }
  }
  if (!containerPath) throw new Error(`Konteinerit ${CONTAINER_PUBLIC_ID} ei leitud ühegi teenuskonto GTM-konto alt.`)
  console.log(`Konteiner: ${containerPath}`)

  const workspaces = await listAll<GtmWorkspace>(token, `${GTM_API}/${containerPath}/workspaces`, "workspace")
  const workspace = workspaces.find((w) => w.name === "Default Workspace") ?? workspaces[0]
  if (!workspace) throw new Error("Konteineril pole ühtegi workspace'i.")
  console.log(`Workspace: ${workspace.name} (${workspace.path})`)

  const wsPath = workspace.path
  const [tags, triggers, variables] = await Promise.all([
    listAll<GtmTag>(token, `${GTM_API}/${wsPath}/tags`, "tag"),
    listAll<GtmTrigger>(token, `${GTM_API}/${wsPath}/triggers`, "trigger"),
    listAll<GtmVariable>(token, `${GTM_API}/${wsPath}/variables`, "variable"),
  ])
  const triggerById = new Map(triggers.map((t) => [t.triggerId ?? "", t]))
  console.log(`\nInventar: ${tags.length} tagi, ${triggers.length} triggerit, ${variables.length} muutujat`)

  let fails = 0
  const plannedFixes: string[] = []

  /* ---- --dump: full wiring inventory for manual review ---- */
  if (DUMP) {
    console.log(`\n## DUMP — kõik triggerid`)
    for (const t of triggers) {
      const conds = [...(t.customEventFilter ?? []), ...(t.filter ?? [])]
        .map((c) => {
          const { arg0, arg1 } = condArgs(c)
          return `${c.type}(${arg0}, ${arg1})`
        })
        .join(" AND ")
      console.log(`  [${t.triggerId}] "${t.name}" type=${t.type}${conds ? ` :: ${conds}` : ""}`)
    }
    console.log(`\n## DUMP — kõik tagid`)
    for (const t of tags) {
      const params = (t.parameter ?? []).map((p) => `${p.key}=${p.value}`).join("; ")
      console.log(`  [${t.tagId}] "${t.name}" type=${t.type}`)
      console.log(`        params: ${params.slice(0, 300)}`)
      console.log(`        firing: [${(t.firingTriggerId ?? []).join(", ")}]  blocking: [${(t.blockingTriggerId ?? []).join(", ")}]`)
    }
    console.log(`\n## DUMP — kõik muutujad`)
    for (const v of variables) {
      const params = (v.parameter ?? []).map((p) => `${p.key}=${p.value}`).join("; ")
      console.log(`  [${v.variableId}] "${v.name}" type=${v.type} ${params.slice(0, 200)}`)
    }
  }

  /* ---- P1: destination/conversion ID must be the constant, not a variable ---- */
  console.log(`\n## P1 — EC/konversiooni siht-ID peab olema konstant (${ADS_ID})`)
  const ID_KEYS = new Set(["conversionId", "destinationId", "measurementId", "tagId"])
  const p1Fixable: GtmTag[] = []
  for (const tag of tags) {
    for (const p of tag.parameter ?? []) {
      if (!p.key || !ID_KEYS.has(p.key) || !p.value) continue
      const isVariable = p.value.includes("{{")
      const wrongConstant = p.key === "conversionId" && !isVariable && ![ADS_ID, ADS_ID.replace("AW-", "")].includes(p.value)
      if (isVariable || wrongConstant) {
        fails++
        console.log(`  FAIL  "${tag.name}" (type=${tag.type}, id=${tag.tagId}): ${p.key} = ${p.value}${isVariable ? "  ← MUUTUJA ID-väljal" : "  ← võõras konstant"}`)
        // Auto-fixable: variable fragments stripped from an Ads tag's
        // conversionId must leave exactly the account id. The awud vendor
        // template validates conversionId as a bare integer ("944834915"),
        // so the "AW-" prefix goes too.
        if ((tag.type === "awud" || tag.type === "awct") && p.key === "conversionId") {
          const stripped = p.value.replace(/\{\{[^}]*\}\}/g, "").replace(/^AW-/i, "")
          if (stripped === ADS_ID.replace("AW-", "")) p1Fixable.push(tag)
          else console.log(`        (ei saa automaatselt fixida — puhastatud kuju oleks "${stripped}")`)
        }
      }
    }
  }
  if (p1Fixable.length === 0 && !tags.some((t) => (t.parameter ?? []).some((p) => p.key && ID_KEYS.has(p.key) && p.value?.includes("{{")))) {
    console.log("  OK — kõik ID-väljad on konstandid, võõrast konstanti pole.")
  } else if (p1Fixable.length > 0) {
    plannedFixes.push(`P1: ${p1Fixable.length} tagi conversionId → ${ADS_ID.replace("AW-", "")} (muutuja + AW- eemaldatud, awud nõuab paljast täisarvu)`)
  }

  /* ---- P2: career blocker on every form-event tag ---- */
  console.log(`\n## P2 — tööotsija-blokker (form_id=career) kõigil vormisündmuste tagidel`)
  const describeTrigger = (t: GtmTrigger) => {
    const m = customEventMatch(t)
    return `"${t.name}" [${t.type}${m ? `: ${m.operator} "${m.value}"` : ""}]`
  }
  const formTriggers = triggers.filter((t) => FORM_EVENTS.some((e) => triggerMatchesEvent(t, e)))
  const careerBlockers = triggers.filter((t) => FORM_EVENTS.some((e) => isCareerBlocker(t, e)))
  console.log(`  Vormi-triggerid: ${formTriggers.map(describeTrigger).join(", ") || "—"}`)
  console.log(`  Tööotsija-blokkerid: ${careerBlockers.map(describeTrigger).join(", ") || "—"}`)
  const tagsMissingBlocker: { tag: GtmTag; event: string }[] = []
  for (const tag of tags) {
    for (const trigId of tag.firingTriggerId ?? []) {
      const trig = triggerById.get(trigId)
      if (!trig) continue
      for (const ev of FORM_EVENTS) {
        if (!triggerMatchesEvent(trig, ev)) continue
        const hasBlocker = (tag.blockingTriggerId ?? []).some((bid) => {
          const b = triggerById.get(bid)
          return b ? isCareerBlocker(b, ev) : false
        })
        if (!hasBlocker && !tagsMissingBlocker.some((x) => x.tag === tag && x.event === ev)) {
          tagsMissingBlocker.push({ tag, event: ev })
        }
      }
    }
  }
  if (tagsMissingBlocker.length === 0) {
    console.log("  OK — kõigil vormi-tagidel on tööotsija-blokker.")
  } else {
    fails++
    for (const { tag, event } of tagsMissingBlocker) {
      console.log(`  FAIL  "${tag.name}" (type=${tag.type}, id=${tag.tagId}) käivitub [${event}] ilma tööotsija-blokkerita`)
    }
    plannedFixes.push(`P2: tööotsija-blokker ${tagsMissingBlocker.length} tagile (${[...new Set(tagsMissingBlocker.map((x) => `${x.event}: ${x.tag.name}`))].join("; ")})`)
  }

  /* ---- P3 (GTM-side): hostname exception on measurement tags ---- */
  console.log(`\n## P3 — mõõtmistagid peavad tulistama ainult spsgrupp.ee hostil`)
  const isHostnameException = (t: GtmTrigger): boolean =>
    (t.filter ?? []).some((c) => {
      const { arg0, arg1 } = condArgs(c)
      // GTM API v2 Condition types are positive-only; negation is a separate
      // boolean parameter `negate: true` on the condition.
      const negated = c.parameter?.some((p) => p.key === "negate" && (p.value === "true" || p.type === "boolean")) ?? false
      const negativeType = /doesNot|notMatch/i.test(c.type ?? "")
      return arg0.toLowerCase().includes("hostname") && (negativeType || negated) && arg1.includes("spsgrupp")
    })
  const hostnameException = triggers.find(isHostnameException) ?? null
  const measurementTags = tags.filter((t) => MEASUREMENT_TAG_TYPES.has(t.type ?? ""))
  const tagsMissingHostname: GtmTag[] = []
  for (const tag of measurementTags) {
    const ok = (tag.blockingTriggerId ?? []).some((bid) => {
      const b = triggerById.get(bid)
      return b ? isHostnameException(b) : false
    })
    if (ok) console.log(`  OK   "${tag.name}"`)
    else {
      console.log(`  FAIL "${tag.name}" (type=${tag.type}) — hostname-erand puudub`)
      tagsMissingHostname.push(tag)
    }
  }
  if (tagsMissingHostname.length > 0) {
    fails++
    plannedFixes.push(`P3: hostname-erand (${HOSTNAME_REGEX}) ${tagsMissingHostname.length} mõõtmistagile`)
  }

  /* ---- P4: form-event overlap map + GA4 key events ---- */
  console.log(`\n## P4 — vormisündmuste kaardistus ja kattumine`)
  for (const ev of FORM_EVENTS) {
    const firing = tags.filter((t) =>
      (t.firingTriggerId ?? []).some((id) => {
        const trig = triggerById.get(id)
        return trig ? triggerMatchesEvent(trig, ev) : false
      }),
    )
    console.log(`  [${ev}] käivitab ${firing.length} tagi:`)
    for (const t of firing) {
      const extra = t.type === "gaawe" ? ` GA4-event="${param(t, "eventName") ?? "?"}"` : ""
      const blocked = (t.blockingTriggerId ?? []).some((bid) => {
        const b = triggerById.get(bid)
        return b ? isCareerBlocker(b, ev) : false
      })
      console.log(`    - "${t.name}" (type=${t.type})${extra}${blocked ? "  [tööotsija-blokker ✓]" : ""}`)
    }
  }
  // Exactly one tag must produce the Ads-imported lead key event.
  const leadTags = tags.filter((t) => t.type === "gaawe" && param(t, "eventName") === LEAD_KEY_EVENT)
  if (leadTags.length !== 1) {
    fails++
    console.log(`  FAIL — lead key event "${LEAD_KEY_EVENT}" toodab ${leadTags.length} tagi (peab olema täpselt 1)`)
  } else {
    console.log(`  OK — "${LEAD_KEY_EVENT}" tootja: "${leadTags[0].name}" (ainus)`)
  }
  try {
    const keyEvents = await listAll<{ name?: string; eventName?: string }>(
      token,
      `https://analyticsadmin.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}/keyEvents`,
      "keyEvents",
    )
    console.log(`  GA4 key events (${keyEvents.length}): ${keyEvents.map((k) => k.eventName).join(", ") || "—"}`)
    for (const k of keyEvents) {
      if (k.eventName && FORM_EVENTS.includes(k.eventName)) {
        fails++
        console.log(`  FAIL — toores vormisündmus "${k.eventName}" on GA4 key event (rollid peavad olema eraldi: key event = "${LEAD_KEY_EVENT}")`)
      }
      if (k.eventName === "purchase") {
        console.log(`  HOIATUS — "purchase" on key event'ina märgitud, aga sait ei saada purchase-sündmust (WP-era jääk; eemalda GA4 Admin → Key events, muudab muidu aruandluse visuaali)`)
      }
    }
  } catch (e) {
    console.log(`  (GA4 key event'ide nimekirja ei saanud: ${e instanceof Error ? e.message.slice(0, 200) : e})`)
  }

  /* ------------------------------- fixes ---------------------------------- */
  const needsFix = p1Fixable.length > 0 || tagsMissingBlocker.length > 0 || tagsMissingHostname.length > 0
  let appliedFixCount = 0
  if (FIX && needsFix) {
    console.log(`\n## FIX${DRY_RUN ? " (dry-run — midagi ei saadeta)" : ""}`)

    // Variable reference for the dataLayer form_id key, copied from an
    // existing career blocker (this container uses "{{DLV - form_id}}").
    let formIdVarRef = "{{DLV - form_id}}"
    for (const t of careerBlockers) {
      for (const c of t.customEventFilter ?? []) {
        const { arg0, arg1 } = condArgs(c)
        if (arg1 === "career" && arg0.includes("form_id")) formIdVarRef = arg0
      }
    }

    const ensureCareerBlocker = async (event: string): Promise<GtmTrigger> => {
      const existing = triggers.find((t) => isCareerBlocker(t, event))
      if (existing) return existing
      const body = {
        name: `tööotsija Trigger — ${event}`,
        type: "customEvent",
        // GTM API v2: customEventFilter holds ONLY the event-name match;
        // additional conditions belong in `filter` (verified against the
        // existing "tööotsija Trigger" resource shape).
        customEventFilter: [
          { type: "equals", parameter: [{ type: "template", key: "arg0", value: "{{_event}}" }, { type: "template", key: "arg1", value: event }] },
        ],
        filter: [
          { type: "equals", parameter: [{ type: "template", key: "arg0", value: formIdVarRef }, { type: "template", key: "arg1", value: "career" }] },
        ],
      }
      if (DRY_RUN) {
        console.log(`  [dry-run] looksin triggeri "${body.name}"`)
        return { path: "(dry-run)", triggerId: "DRY", name: body.name, type: "customEvent" }
      }
      const created = await gtmFetch<GtmTrigger>(token, `${GTM_API}/${wsPath}/triggers`, { method: "POST", body: JSON.stringify(body) })
      console.log(`  Loodud trigger "${created.name}" (${created.triggerId})`)
      appliedFixCount++
      triggers.push(created)
      if (created.triggerId) triggerById.set(created.triggerId, created)
      return created
    }

    const ensureHostnameException = async (): Promise<GtmTrigger> => {
      if (hostnameException) return hostnameException
      const body = {
        name: "Blocking — mitte spsgrupp.ee host",
        type: "pageview",
        filter: [
          // Negation is a boolean `negate` parameter (API v2 has no
          // doesNotMatchRegex condition type).
          {
            type: "matchRegex",
            parameter: [
              { type: "template", key: "arg0", value: "{{Page Hostname}}" },
              { type: "template", key: "arg1", value: HOSTNAME_REGEX },
              { type: "boolean", key: "negate", value: "true" },
            ],
          },
        ],
      }
      if (DRY_RUN) {
        console.log(`  [dry-run] looksin triggeri "${body.name}"`)
        return { path: "(dry-run)", triggerId: "DRY", name: body.name, type: "pageview" }
      }
      const created = await gtmFetch<GtmTrigger>(token, `${GTM_API}/${wsPath}/triggers`, { method: "POST", body: JSON.stringify(body) })
      console.log(`  Loodud trigger "${created.name}" (${created.triggerId})`)
      appliedFixCount++
      return created
    }

    const updateTag = async (tag: GtmTag, why: string) => {
      if (DRY_RUN) {
        console.log(`  [dry-run] uuendaksin tagi "${tag.name}" — ${why}`)
        return
      }
      await gtmFetch<GtmTag>(token, `${GTM_API}/${tag.path}`, { method: "PUT", body: JSON.stringify(tag) })
      appliedFixCount++
      console.log(`  Uuendatud tag "${tag.name}" — ${why}`)
    }

    // P1: strip variable fragments + the AW- prefix from conversionId
    // (the awud vendor template accepts only the bare integer)
    for (const tag of p1Fixable) {
      for (const p of tag.parameter ?? []) {
        if (p.key === "conversionId" && p.value?.includes("{{")) {
          const before = p.value
          p.value = p.value.replace(/\{\{[^}]*\}\}/g, "").replace(/^AW-/i, "")
          await updateTag(tag, `conversionId "${before}" → "${p.value}"`)
        }
      }
    }

    // P2: attach a career blocker per form event
    const blockerByEvent = new Map<string, GtmTrigger>()
    for (const { tag, event } of tagsMissingBlocker) {
      if (!blockerByEvent.has(event)) blockerByEvent.set(event, await ensureCareerBlocker(event))
      const blocker = blockerByEvent.get(event)!
      if ((tag.blockingTriggerId ?? []).includes(blocker.triggerId ?? "")) continue
      tag.blockingTriggerId = [...(tag.blockingTriggerId ?? []), blocker.triggerId!]
      await updateTag(tag, `+tööotsija-blokker [${event}]`)
    }

    // P3: attach the hostname exception to measurement tags
    if (tagsMissingHostname.length > 0) {
      const exc = await ensureHostnameException()
      for (const tag of tagsMissingHostname) {
        if ((tag.blockingTriggerId ?? []).includes(exc.triggerId ?? "")) continue
        tag.blockingTriggerId = [...(tag.blockingTriggerId ?? []), exc.triggerId!]
        await updateTag(tag, "+hostname-erand")
      }
    }

    if (!DRY_RUN && !PUBLISH && appliedFixCount > 0) {
      console.log(`\n  ${appliedFixCount} muudatust on workspace'is "${workspace.name}", aga AVALDAMATA.`)
      console.log(`  Vaata üle GTM UI-s (Preview) ja avalda — või korda: npm run audit:gtm -- --fix --publish`)
    }
  }

  /* ---- publish (also the recovery path when a previous --fix run left the
         workspace unpublished). NOTE 27.10.2026: workspace /status reported
         "0 pending changes" while the live version clearly differed from the
         workspace (observed after a UI-side publish action) — so on 0 changes
         we additionally probe the LIVE version for the hostname-exception
         trigger before concluding there is nothing to publish. ---- */
  if (FIX && PUBLISH && !DRY_RUN) {
    const status = await gtmFetch<{ entityChangeStatus?: unknown[] }>(token, `${GTM_API}/${wsPath}/status`)
    let shouldPublish = (status.entityChangeStatus ?? []).length > 0
    if (!shouldPublish) {
      const live = await gtmFetch<{ trigger?: { name?: string }[]; containerVersionId?: string }>(
        token,
        `${GTM_API}/${containerPath}/versions:live`,
      )
      const liveTriggerNames = (live.trigger ?? []).map((t) => t.name ?? "")
      if (!liveTriggerNames.some((n) => n.includes("spsgrupp.ee host"))) {
        console.log(`  Publish: /status väidab 0 muudatust, aga live-versioonis v${live.containerVersionId} puudub hostname-trigger — avaldan ikkagi.`)
        shouldPublish = true
      }
    }
    if (!shouldPublish) {
      console.log(`\n  Publish: avaldamata muudatusi pole ja live-versioon on ajakohane — midagi ei avaldata.`)
    } else {
      try {
        const version = await gtmFetch<{ containerVersion?: { path?: string; containerVersionId?: string }; compilerError?: boolean }>(
          token,
          `${GTM_API}/${wsPath}:create_version`,
          {
            method: "POST",
            body: JSON.stringify({
              name: "Audit 27.10.2026 fixid (gtm-audit.ts)",
              notes: plannedFixes.length > 0 ? plannedFixes.join("\n") : "Audit-fixide avaldamine (rakendatud varasemas käivituses)",
            }),
          },
        )
        if (version.compilerError || !version.containerVersion?.path) throw new Error(`create_version ebaõnnestus: ${JSON.stringify(version).slice(0, 400)}`)
        await gtmFetch(token, `${GTM_API}/${version.containerVersion.path}:publish`, { method: "POST", body: "{}" })
        console.log(`\n  Avaldatud versioon ${version.containerVersion.containerVersionId} — muudatused on LIVE.`)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        if (msg.includes("403")) {
          console.error(
            `\n  PUBLISH ebaõnnestus (403): fixid ON workspace'is rakendatud, aga avaldamine ebaõnnestus.\n` +
              `  Kontrolli: (a) teenuskonto GTM-õigus peab olema "Publish" (Admin → User Management),\n` +
              `  (b) skript peab küsimise tagmanager.publish skoobi (on --publish lipuga kaasas).\n` +
              `  Või avalda GTM UI-s käsitsi (Publish-nupp).`,
          )
        } else {
          throw e
        }
      }
    }
  }

  console.log(`\n## Kokkuvõte: ${fails === 0 ? "KÕIK KONTROLLID LÄBID" : `${fails} leidud — vt ülal`}`)
  process.exit(fails === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error(`\nVIGA: ${e instanceof Error ? e.message : e}`)
  process.exit(2)
})
