/**
 * „Lehekülje arendus" — git-põhine kokkuvõte lehel tehtud muudatustest
 * kahe raporti vahel (kliendi palve 08.10.2026: raport näitaks inimkeeles,
 * mis täiendusi tehti, kas avaldati blogisid ja mis muutus lehtede sisus).
 *
 * Andmeallikas on data/git-history.json, mille genereerib
 * scripts/generate-git-history.mjs (prebuild/predev). Serverless'is tuleb
 * fail kaasa traced-ina (next.config outputFileTracingIncludes) — dünaamilise
 * fs-lugemise tõttu ei leiaks Next tracer seda ise.
 *
 * Klassifikatsioon on teadlikult lihtne ja deterministlik (failitee-põhine),
 * kliendikeelne sõnastus tuleb LLM-kokkuvõttest (summary) — selle puudumisel
 * renderdatakse struktureeritud fallback (email-html.ts).
 */

import type { SiteChangeGroupKey, SiteChanges } from "./types"
import { auditNarrativeNumbers } from "./number-audit"

export interface GitHistoryFile {
  /** Esitäht: A/M/D/R. */
  s: string
  p: string
}

export interface GitHistoryCommit {
  hash: string
  /** ISO 8601 (committer date). */
  date: string
  subject: string
  files: GitHistoryFile[]
  newPosts?: string[]
}

interface GitHistory {
  generatedAt: string
  commits: GitHistoryCommit[]
}

/** data/git-history.json lugemine; null kui puudub või katki (sektsioon jääb vahele). */
export async function loadGitHistory(): Promise<GitHistory | null> {
  try {
    const { promises: fs } = await import("fs")
    const path = await import("path")
    const raw = await fs.readFile(path.join(process.cwd(), "data", "git-history.json"), "utf-8")
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.commits)) return null
    return parsed as GitHistory
  } catch {
    /* 23.10.2026: fail on nüüd committitud (enne gitignore'itud — Verceli build'is
     * prebuild-i git-käsu ebaõnnestumise korral fail bundlist puudus ja sektsioon
     * jäi raportitest märkamatult välja). Kui see logi ikka ilmub, on tegu
     * bundlingu-probleemiga — kontrolli route'i .nft.json faili. */
    console.warn("Lehekülje arendus: data/git-history.json pole loetav — sektsioon jääb raportist välja.")
    return null
  }
}

/** Aken (since, until] — since on välja jäetud (need olid eelmises raportis), until kaasa arvatud. */
export function filterCommits(commits: GitHistoryCommit[], since: string, until: string): GitHistoryCommit[] {
  return commits.filter((c) => c.date > since && c.date <= until)
}

/** Järelhaave ülempiir — vanemaid commit'e raportisse enam ei tõsteta. */
const CATCHUP_MAX_AGE_MS = 21 * 24 * 60 * 60 * 1000
/** Turvapiir, et üleminek/andmeauk ei ummistaks raportit vanade commitidega. */
const CATCHUP_MAX_COMMITS = 5

export interface CatchUpContext {
  /**
   * Kõik varasemates raportites juba näidatud commitide hash'id
   * (snapshot.changes.commitHashes). Täpne tee staažikas olekus.
   */
  shownHashes?: Set<string>
  /**
   * Ülemineku-varuvariant, kui hash'e veel pole (raportid enne 30.10.2026
   * parandust): eelmise NÄDALA raportis näidatud cleaned-subject'id
   * (changes.groups[*].items). Commit, mille cleaned subject seal on, loetakse
   * näidatuks; ülejäänud viimase ~10 päeva commitid tõstetakse järele.
   * Ilma selleta kaoks 26.10.2026 mega-commit vahele (Verceli build'i git-tõrge
   * + committitud git-history struktuuriline ühe-commiti mahajäämus).
   */
  shownItems?: string[]
}

/**
 * Akna-commitid + järelhaave: deployed commit'id, mis jäid eelmise raporti
 * aknast ja git-history kaetusest VAHELE (nt Verceli build'i git-tõrke korral
 * committitud git-history.json ei sisalda viimast commitit). Tagab, et ükski
 * live'le jõudnud commit ei kao raportitest märkamatult.
 */
export function selectWindowCommits(
  commits: GitHistoryCommit[],
  since: string,
  until: string,
  catchUp?: CatchUpContext,
): GitHistoryCommit[] {
  const inWindow = filterCommits(commits, since, until)
  if (!catchUp) return inWindow
  const shownHashes = catchUp.shownHashes ?? new Set<string>()
  const shownItems = new Set(catchUp.shownItems ?? [])
  const cutoff = new Date(new Date(until).getTime() - CATCHUP_MAX_AGE_MS).toISOString()
  const inWindowHashes = new Set(inWindow.map((c) => c.hash))
  const missed = commits.filter((c) => {
    if (inWindowHashes.has(c.hash)) return false // aknas juba sees
    if (c.date > since) return false // akna- või tuleviku-commit — siin ei käsitleta
    if (c.date < cutoff) return false // liiga vana — ei ole selle nädala teema
    if (shownHashes.has(c.hash)) return false // juba näidatud (täpne tee)
    if (shownHashes.size === 0 && shownItems.has(cleanSubject(c.subject))) return false // üleminek: eelmises raportis näidatud
    return true
  })
  return [...inWindow, ...missed.slice(0, CATCHUP_MAX_COMMITS)]
}

const BLOG_RE = /^(wordpress_migration\/prepared\/(posts|index)\/|app\/\(et\)\/blog\/)/
const CONTENT_RE = /^(lib\/pages\/|messages\/|app\/_pages\/|app\/components\/|public\/|lib\/(page-registry|localized-page-registry|.*metadata-registry)\.)/
const SEO_RE = /^(proxy\.ts|next\.config\.ts|app\/sitemap|app\/robots|.*llms)/

/** Üks commit → üks grupp (esimene matchiv reegel võidab, et arvude summa klappiks). */
export function classifyCommit(commit: GitHistoryCommit): SiteChangeGroupKey {
  const paths = commit.files.map((f) => f.p)
  if (paths.some((p) => BLOG_RE.test(p))) return "blog"
  if (paths.some((p) => CONTENT_RE.test(p))) return "content"
  if (paths.some((p) => SEO_RE.test(p))) return "seo"
  return "technical"
}

const CONVENTIONAL_PREFIX_RE = /^(feat|fix|chore|docs|refactor|perf|test|build|ci|style|revert)(\([^)]*\))?!?:\s*/i
const MAX_ITEM_LEN = 140

/**
 * Commit-subject → kliendile sobiv lühikirjeldus: eemalda conventional-commit
 * prefix (feat(seo): …), lõika pikk selgitus em-dash'i järel ära, kapitaliseeri.
 */
export function cleanSubject(subject: string): string {
  let s = subject.replace(CONVENTIONAL_PREFIX_RE, "").split(" — ")[0].trim()
  if (s.length > MAX_ITEM_LEN) s = s.slice(0, MAX_ITEM_LEN - 1).trimEnd() + "…"
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const GROUP_ORDER: SiteChangeGroupKey[] = ["blog", "content", "seo", "technical"]
const MAX_ITEMS_PER_GROUP = 8

/** Puhas funktsioon akna commitidest salvestatava SiteChanges-struktuurini (testitav). */
export function buildSiteChanges(commits: GitHistoryCommit[], since: string, until: string): SiteChanges {
  const newBlogPosts: string[] = []
  const byKey = new Map<SiteChangeGroupKey, { count: number; items: string[] }>()
  for (const commit of commits) {
    const key = classifyCommit(commit)
    const group = byKey.get(key) ?? { count: 0, items: [] }
    group.count += 1
    if (group.items.length < MAX_ITEMS_PER_GROUP) {
      const cleaned = cleanSubject(commit.subject)
      if (cleaned && !group.items.includes(cleaned)) group.items.push(cleaned)
    }
    byKey.set(key, group)
    for (const title of commit.newPosts ?? []) {
      if (!newBlogPosts.includes(title)) newBlogPosts.push(title)
    }
  }
  return {
    since,
    until,
    commits: commits.length,
    newBlogPosts,
    groups: GROUP_ORDER.filter((key) => byKey.has(key)).map((key) => ({ key, count: byKey.get(key)!.count, items: byKey.get(key)!.items })),
    commitHashes: commits.map((c) => c.hash),
  }
}

const CHANGES_SYSTEM_PROMPT = `Oled SPS Grupi (spsgrupp.ee) veebiagentuuri projektijuht. Saad JSON-is struktureeritud nimekirja veebilehel äsja tehtud muudatustest (grupeerituna: blog = uued blogipostitused ja blogi täiendused, content = lehtede tekstid/sisu/pildid, seo = tehniline SEO nagu ümbersuunamised ja metaandmed, technical = muud tehnilised täiendused).

Kirjuta kliendile (SPS Grupi juht, MITTE tehniline inimene) lühike kokkuvõte: mis lehel ära tehti ja mis kasu see annab (nt „avaldati blogipostitus …, mis toetab ettevõtete koristuspäringute leiduvust Google'is").

REEGLID:
- Väljund: 2–5 punkti, igaüks algab märgiga „- ". Eesti keel, lihtne ja sõbralik toon.
- Uued blogipostitused nimeta ALATI pealkirja järgi (need on newBlogPosts loetelus).
- Tehnilised täiendused (technical) võta kokku ühe lausega või jäta sootuks välja, kui need pole kliendile olulised.
- Ära maini git'i, commit'e, faile, koodi, skripte ega sisemisi tööriistu. Ära kasuta kuupäevi ega aastat.
- NUMBRID: kasuta ainult sisend-JSON-is esinevaid arve (gruppide count, commits). Ära liida, lahuta ega arvuta ise. Ülejäänud kirjuta sõnadena või jäta välja.
- Ära leiuta midagi, mida sisendis pole.`

/**
 * LLM-i kliendikeelne kokkuvõte muudatustest. Tagastab null, kui LLM-põhi
 * puudub, kõnnak ebaõnnestub või number-audit leiab väljamõeldud arvu
 * (sama gate kui põhinarratiivil) — siis renderdatakse struktureeritud fallback.
 */
export async function summarizeSiteChanges(changes: SiteChanges): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.DEEPSEEK_API_KEY) return null
  if (changes.commits === 0) return null
  const { callLlm } = await import("./llm")
  const payload = {
    commits: changes.commits,
    newBlogPosts: changes.newBlogPosts,
    groups: changes.groups.map((g) => ({ key: g.key, count: g.count, items: g.items })),
  }
  /* max_tokens peab olema helde: deepseek-v4-flash on reasoning-mudel — tema
   * "mõttekäik" loeb max_tokens'i SISSE (verifitseeritud 08.10.2026: 900 →
   * finish=length ja tühi content; 4000 → reasoning ~1,2k + päris vastus). */
  const text = await callLlm(JSON.stringify(payload, null, 1), CHANGES_SYSTEM_PROMPT, 4000)
  if (!text) return null
  const violations = auditNarrativeNumbers(text, [JSON.stringify(payload)])
  if (violations.length > 0) {
    console.error(`Site-changes summary number audit failed (${violations.join(", ")}) — using structured fallback.`)
    return null
  }
  return text
}

/**
 * Kogu ahel: git-history laadimine → akna filter → klassifikatsioon → LLM
 * kokkuvõte (kui saadaval). Null, kui git-history fail puudub (nt lokaalne
 * keskkond enne esimest prebuild'i) — siis sektsiooni raportisse ei lisata.
 */
export async function collectSiteChanges(since: string, until: string, catchUp?: CatchUpContext): Promise<SiteChanges | null> {
  const history = await loadGitHistory()
  if (!history) return null
  const commits = selectWindowCommits(history.commits, since, until, catchUp)
  const changes = buildSiteChanges(commits, since, until)
  const summary = await summarizeSiteChanges(changes)
  if (summary) changes.summary = summary
  return changes
}
