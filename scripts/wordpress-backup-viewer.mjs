import { copyFileSync, createReadStream, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { createServer } from "node:http"
import { basename, dirname, extname, join, normalize, relative } from "node:path"
import { createInterface } from "node:readline"

const BACKUP_ROOT = process.env.WP_BACKUP_ROOT || "F:\\WORKS\\2025\\SPS\\22MaiBack\\20220607_spsgrupp_8b10f447e95336534997_20230522180026_archive"
const SQL_PATH = process.env.WP_SQL_PATH || join(BACKUP_ROOT, "dup-installer", "dup-database__8b10f44-22180026.sql")
const UPLOADS_ROOT = join(BACKUP_ROOT, "wp-content", "uploads")
const PORT = Number(process.env.PORT || 8080)
const BACKUP_LABEL = process.env.WP_BACKUP_LABEL || "May 22, 2023"

function decodeSqlEscape(char) {
  return { n: "\n", r: "\r", t: "\t", 0: "\0", Z: "\x1a" }[char] ?? char
}

function parseInsertValues(source) {
  const rows = []
  let row = null
  let value = ""
  let quoted = false
  let escaped = false

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]

    if (quoted) {
      if (escaped) {
        value += decodeSqlEscape(char)
        escaped = false
      } else if (char === "\\") {
        escaped = true
      } else if (char === "'") {
        quoted = false
      } else {
        value += char
      }
      continue
    }

    if (char === "'") {
      quoted = true
    } else if (char === "(" && row === null) {
      row = []
      value = ""
    } else if (char === "," && row !== null) {
      row.push(value.trim() === "NULL" ? "" : value.trim())
      value = ""
    } else if (char === ")" && row !== null) {
      row.push(value.trim() === "NULL" ? "" : value.trim())
      rows.push(row)
      row = null
      value = ""
    } else if (row !== null) {
      value += char
    }
  }

  return rows
}

async function loadWordPressData() {
  const posts = []
  const attachedFiles = new Map()
  const featuredImageIds = new Map()
  const postMeta = new Map()
  const revisions = new Map()
  const lines = createInterface({ input: createReadStream(SQL_PATH, { encoding: "utf8" }), crlfDelay: Infinity })

  for await (const line of lines) {
    if (line.startsWith("INSERT INTO `wp_sppsspostmeta` VALUES ")) {
      const values = line.slice(line.indexOf(" VALUES ") + 8).replace(/;$/, "")
      for (const row of parseInsertValues(values)) {
        if (row[2] === "_wp_attached_file") attachedFiles.set(row[1], row[3].replaceAll("\\", "/"))
        if (row[2] === "_thumbnail_id") featuredImageIds.set(row[1], row[3])
        if (!postMeta.has(row[1])) postMeta.set(row[1], [])
        postMeta.get(row[1]).push({ key: row[2], value: row[3] })
      }
      continue
    }

    if (!line.startsWith("INSERT INTO `wp_sppssposts` VALUES ")) continue
    const values = line.slice(line.indexOf(" VALUES ") + 8).replace(/;$/, "")

    for (const row of parseInsertValues(values)) {
      if (row[20] === "revision") {
        const parentId = row[18]
        if (!revisions.has(parentId)) revisions.set(parentId, [])
        revisions.get(parentId).push({ id: Number(row[0]), date: row[2], content: row[4], title: row[5], excerpt: row[6] })
      }
      if (row[20] !== "post" || row[7] !== "publish") continue
      posts.push({
        id: Number(row[0]),
        date: row[2],
        content: row[4],
        title: row[5] || "Untitled post",
        excerpt: row[6],
        slug: row[11] || `post-${row[0]}`,
      })
    }
  }

  for (const post of posts) {
    const attachmentId = featuredImageIds.get(String(post.id))
    post.featuredImage = attachmentId ? attachedFiles.get(attachmentId) || "" : ""
  }

  return { posts: posts.sort((a, b) => b.date.localeCompare(a.date)), attachedFiles, postMeta, revisions }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function plainText(value) {
  return value
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8211;|&ndash;/gi, "-")
    .replace(/&#8212;|&mdash;/gi, "-")
    .replace(/\s+/g, " ")
    .trim()
}

function shortcodeAttribute(attributes, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return attributes.match(new RegExp(`\\b${escapedName}=(?:"([^"]*)"|'([^']*)'|([^\\s\\]]+))`, "i"))?.slice(1).find((part) => part !== undefined) || ""
}

function localMediaUrl(url) {
  return url.replace(/https?:\/\/(?:www\.)?spsgrupp\.ee\/wp-content\/uploads\//i, "/media/")
}

function mediaPathFromUrl(url) {
  const match = url.match(/(?:https?:\/\/(?:www\.)?spsgrupp\.ee)?\/wp-content\/uploads\/([^\s"'<\]]+)/i)
  return match ? decodeURIComponent(match[1]).replaceAll("\\", "/") : ""
}

function referencedMediaPaths(value) {
  const paths = [...value.matchAll(/(?:https?:\/\/(?:www\.)?spsgrupp\.ee)?\/wp-content\/uploads\/[^\s"'<\]]+\.(?:avif|gif|jpe?g|png|svg|webp)/gi)]
    .map((match) => mediaPathFromUrl(match[0]))

  for (const match of value.matchAll(/\[fusion_imageframe\b([^\]]*)\]/gi)) {
    const attachmentId = shortcodeAttribute(match[1], "image_id").split("|")[0]
    const attachedFile = attachedFiles.get(attachmentId)
    if (attachedFile) paths.push(attachedFile)
  }

  return paths.filter((path, index, all) => path && all.indexOf(path) === index)
}

function removeQuoteForm(value) {
  return value
    .replace(/<h[1-6][^>]*>\s*K[üu]si hinnapakkumist\s*<\/h[1-6]>\s*/gi, "")
    .replace(/(?:^|<br\s*\/?\s*>|\r?\n)\s*K[üu]si hinnapakkumist\s*(?=<br\s*\/?\s*>|\r?\n|\[contact-form-7)/gi, "")
    .replace(/\[contact-form-7\b[^\]]*\/?\]/gi, "")
    .replace(/\s*Kirjelda oma soove helistades numbril\s*(?:\+372\s*)?662\s*3328[.!]?\s*/gi, "")
}

function cleanPostContent(value) {
  let cleaned = removeQuoteForm(value)
    .replace(/\[caption\b[^\]]*\]([\s\S]*?)\[\/caption\]/gi, "$1")
    .replace(/\[fusion_youtube\b([^\]]*)\/?\]/gi, (_, attributes) => {
      const id = shortcodeAttribute(attributes, "id")
      const title = shortcodeAttribute(attributes, "title_attribute") || "YouTube video"
      return id ? `<p><a href="https://www.youtube.com/watch?v=${escapeHtml(id)}">${escapeHtml(title)}</a></p>` : ""
    })
    .replace(/\[fusion_imageframe\b([^\]]*)\]([\s\S]*?)\[\/fusion_imageframe\]/gi, (_, attributes, source) => renderImageFrame(attributes, source).replaceAll('/media/', '/blog-media/'))
    .replace(/\[fusion_imageframe\b([^\]]*)\/\]/gi, (_, attributes) => renderImageFrame(attributes, "").replaceAll('/media/', '/blog-media/'))
    .replace(/\[\/?[A-Za-z][^\]]*\]/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\s(?:on\w+|style)=("[^"]*"|'[^']*')/gi, "")
    .replace(/https?:\/\/(?:www\.)?spsgrupp\.ee\/wp-content\/uploads\//gi, "/blog-media/")
    .replace(/srcset=("[^"]*"|'[^']*')/gi, "")
    .replace(/<p>\s*(?:&nbsp;|<br\s*\/?\s*>)*\s*<\/p>/gi, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

  cleaned = removeQuoteForm(cleaned).trim()
  return cleaned
}

function renderImageFrame(attributes, source) {
  const attachmentId = shortcodeAttribute(attributes, "image_id").split("|")[0]
  const sourceUrl = source.trim().match(/https?:\/\/[^\s<]+/i)?.[0] || ""
  const mediaPath = sourceUrl ? localMediaUrl(sourceUrl) : attachedFiles.get(attachmentId) ? `/media/${attachedFiles.get(attachmentId)}` : ""
  const alt = shortcodeAttribute(attributes, "alt")
  return mediaPath ? `<img class="content-media" src="${escapeHtml(mediaPath)}" alt="${escapeHtml(alt)}" loading="lazy">` : ""
}

function renderContent(value) {
  const referencedMedia = [...value.matchAll(/https?:\/\/(?:www\.)?spsgrupp\.ee\/wp-content\/uploads\/[^\s"'<\]]+\.(?:avif|gif|jpe?g|png|svg|webp)/gi)]
    .map((match) => localMediaUrl(match[0]))
    .filter((url, index, urls) => urls.indexOf(url) === index)

  let rendered = value
    .replace(/\[fusion_youtube\b([^\]]*)\/?\]/gi, (_, attributes) => {
      const id = attributes.match(/\bid=(?:"([\w-]+)"|'([\w-]+)'|([\w-]+))/i)?.slice(1).find(Boolean)
      const title = attributes.match(/\btitle_attribute=(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find(Boolean) || "YouTube video"
      if (!id) return ""
      return `<div class="video"><a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${escapeHtml(title)}" loading="lazy"><span>Watch video on YouTube</span></a></div>`
    })
    .replace(/\[fusion_imageframe\b([^\]]*)\]([\s\S]*?)\[\/fusion_imageframe\]/gi, (_, attributes, source) => renderImageFrame(attributes, source))
    .replace(/\[fusion_imageframe\b([^\]]*)\/\]/gi, (_, attributes) => renderImageFrame(attributes, ""))
    .replace(/\[\/?fusion_[^\]]*\]/gi, "")
    .replace(/\[\/?vc_[^\]]*\]/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\s(?:on\w+|style)=("[^"]*"|'[^']*')/gi, "")
    .replace(/https?:\/\/(?:www\.)?spsgrupp\.ee\/wp-content\/uploads\//gi, "/media/")
    .replace(/srcset=("[^"]*"|'[^']*')/gi, "")
    .replace(/\r?\n/g, "\n")
    .replace(/\n{2,}/g, "<br><br>")

  const recoveredMedia = referencedMedia
    .filter((url) => !rendered.includes(url))
    .map((url) => `<img class="content-media recovered-media" src="${escapeHtml(url)}" alt="" loading="lazy">`)
    .join("")

  return recoveredMedia + rendered
}

function layout(title, body) {
  return `<!doctype html>
<html lang="et">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f4f7fb; color: #1e2d3d; font-size: 16px; line-height: 1.65; }
    a { color: #1269a8; }
    header { position: sticky; top: 0; z-index: 2; background: #17345a; color: white; padding: 18px 24px; box-shadow: 0 2px 12px #0002; }
    header a { color: white; text-decoration: none; font-size: 20px; font-weight: 750; }
    main { width: min(1080px, calc(100% - 32px)); margin: 32px auto 64px; }
    .panel, article { background: white; border-radius: 16px; padding: clamp(20px, 4vw, 48px); box-shadow: 0 8px 30px #17345a12; }
    h1 { color: #17345a; font-size: clamp(32px, 5vw, 52px); line-height: 1.1; margin: 0 0 16px; }
    h2 { color: #17345a; font-size: 27px; line-height: 1.25; }
    h3 { color: #17345a; font-size: 21px; }
    p, li, input, button, .date, .summary { font-size: 16px; }
    .date { color: #65758a; margin-bottom: 28px; }
    form { display: flex; gap: 10px; margin: 26px 0; }
    input { flex: 1; min-width: 0; border: 1px solid #c8d3df; border-radius: 10px; padding: 12px 14px; }
    button { border: 0; border-radius: 10px; padding: 12px 18px; background: #17345a; color: white; cursor: pointer; }
    .posts { display: grid; gap: 14px; }
    .post { display: block; padding: 18px 20px; border: 1px solid #dce5ee; border-radius: 12px; color: inherit; text-decoration: none; }
    .post:hover { border-color: #3abeff; background: #f6fcff; }
    .post strong { display: block; color: #17345a; font-size: 19px; margin-bottom: 4px; }
    .post .date { margin: 0 0 5px; }
    article img { max-width: 100%; height: auto; border-radius: 10px; }
    .featured-image, .content-media { display: block; width: 100%; margin: 0 0 32px; }
    .video { position: relative; width: 100%; aspect-ratio: 16 / 9; margin: 28px 0 42px; overflow: hidden; border-radius: 12px; background: #111; }
    .video a { display: block; width: 100%; height: 100%; color: white; }
    .video img { width: 100%; height: 100%; object-fit: cover; border-radius: 0; }
    .video span { position: absolute; left: 18px; bottom: 18px; padding: 9px 13px; border-radius: 8px; background: #17345ae8; color: white; font-size: 15px; font-weight: 700; }
    article table { display: block; max-width: 100%; overflow-x: auto; }
    .back { display: inline-block; margin-bottom: 20px; font-size: 16px; font-weight: 650; }
    .notice { padding: 12px 15px; border-radius: 10px; background: #eef7fc; }
    .empty-note { margin: 22px 0 0; padding: 14px 16px; border-radius: 10px; background: #fff7df; color: #5f4a16; }
  </style>
</head>
<body>
  <header><a href="/">WordPress backup viewer</a></header>
  <main>${body}</main>
</body>
</html>`
}

function sendHtml(response, status, html) {
  response.writeHead(status, { "content-type": "text/html; charset=utf-8" })
  response.end(html)
}

function resolveMediaFile(requested) {
  let filePath = normalize(join(UPLOADS_ROOT, requested))
  if (!relative(UPLOADS_ROOT, filePath).startsWith("..") && !existsSync(filePath)) {
    const directory = dirname(filePath)
    if (existsSync(directory)) {
      const normalizedName = basename(filePath).normalize("NFC")
      const match = readdirSync(directory).find((name) => name.normalize("NFC") === normalizedName)
      if (match) filePath = join(directory, match)
    }
  }
  return !relative(UPLOADS_ROOT, filePath).startsWith("..") && existsSync(filePath) && statSync(filePath).isFile() ? filePath : ""
}

function sendMedia(response, pathname) {
  const requested = decodeURIComponent(pathname.slice("/media/".length))
  const filePath = resolveMediaFile(requested)
  if (!filePath) {
    response.writeHead(404)
    response.end("Not found")
    return
  }

  const types = {
    ".avif": "image/avif", ".gif": "image/gif", ".jpeg": "image/jpeg", ".jpg": "image/jpeg",
    ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".mp4": "video/mp4",
    ".webm": "video/webm", ".pdf": "application/pdf",
  }
  response.writeHead(200, { "content-type": types[extname(filePath).toLowerCase()] || "application/octet-stream" })
  createReadStream(filePath).pipe(response)
}

const { posts, attachedFiles, postMeta, revisions } = await loadWordPressData()
const postsById = new Map(posts.map((post) => [String(post.id), post]))

if (process.argv.includes("--export")) {
  const exportIndex = process.argv.indexOf("--export")
  const outputRoot = process.argv[exportIndex + 1]
  if (!outputRoot) throw new Error("--export requires an output directory")

  const postsRoot = join(outputRoot, "posts")
  const mediaRoot = join(outputRoot, "media")
  mkdirSync(postsRoot, { recursive: true })
  mkdirSync(mediaRoot, { recursive: true })

  const exportedPosts = []
  const copiedMedia = new Set()
  for (const post of posts) {
    const referencedMedia = referencedMediaPaths(post.content)
    const inferredFeaturedImage = post.featuredImage || referencedMedia.find((path) => resolveMediaFile(path)) || ""
    const contentHtml = cleanPostContent(post.content)
    const media = [...new Set([inferredFeaturedImage, ...referencedMedia].filter(Boolean))]
    const missingMedia = []

    for (const mediaPath of media) {
      const sourcePath = resolveMediaFile(mediaPath)
      if (!sourcePath) {
        missingMedia.push(mediaPath)
        continue
      }
      if (copiedMedia.has(mediaPath)) continue
      const destination = join(mediaRoot, mediaPath)
      mkdirSync(dirname(destination), { recursive: true })
      copyFileSync(sourcePath, destination)
      copiedMedia.add(mediaPath)
    }

    const exported = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      date: post.date,
      excerpt: plainText(removeQuoteForm(post.excerpt || contentHtml)).slice(0, 320),
      contentHtml,
      featuredImage: inferredFeaturedImage ? `/blog-media/${inferredFeaturedImage}` : "",
      featuredImageSource: post.featuredImage ? "wordpress" : inferredFeaturedImage ? "first-content-image" : "missing",
      media: media.map((path) => `/blog-media/${path}`),
      missingMedia,
      contentStatus: contentHtml ? "article" : inferredFeaturedImage ? "image-only" : "empty",
      sourceBackup: BACKUP_LABEL,
    }
    writeFileSync(join(postsRoot, `post-${post.id}.json`), `${JSON.stringify(exported, null, 2)}\n`)
    exportedPosts.push(exported)
  }

  const index = {
    sourceBackup: BACKUP_LABEL,
    total: exportedPosts.length,
    articles: exportedPosts.filter((post) => post.contentStatus === "article").length,
    imageOnly: exportedPosts.filter((post) => post.contentStatus === "image-only").length,
    empty: exportedPosts.filter((post) => post.contentStatus === "empty").length,
    featuredImages: {
      wordpress: exportedPosts.filter((post) => post.featuredImageSource === "wordpress").length,
      inferred: exportedPosts.filter((post) => post.featuredImageSource === "first-content-image").length,
      missing: exportedPosts.filter((post) => post.featuredImageSource === "missing").length,
    },
    shortcodeRemainders: exportedPosts.filter((post) => /\[\/?[A-Za-z][^\]]*\]/.test(post.contentHtml)).map((post) => post.id),
    quoteFormRemainders: exportedPosts.filter((post) => /contact-form-7|K[üu]si hinnapakkumist|Kirjelda oma soove helistades/i.test(post.contentHtml)).map((post) => post.id),
    missingMedia: exportedPosts.filter((post) => post.missingMedia.length).map((post) => ({ id: post.id, paths: post.missingMedia })),
    posts: exportedPosts.map(({ id, title, slug, date, featuredImage, featuredImageSource, contentStatus }) => ({ id, title, slug, date, featuredImage, featuredImageSource, contentStatus })),
  }
  writeFileSync(join(outputRoot, "index.json"), `${JSON.stringify(index, null, 2)}\n`)
  console.log(JSON.stringify(index))
  process.exit(0)
}

if (process.argv.includes("--audit")) {
  const requestedIds = process.argv.slice(process.argv.indexOf("--audit") + 1)
  const selectedPosts = requestedIds.length ? requestedIds.map((id) => postsById.get(id)).filter(Boolean) : posts
  for (const post of selectedPosts) {
    const frames = [...post.content.matchAll(/\[fusion_imageframe\b([^\]]*)\]([\s\S]*?)\[\/fusion_imageframe\]/gi)].map((match) => {
      const attachmentId = shortcodeAttribute(match[1], "image_id").split("|")[0]
      return { attachmentId, attachedFile: attachedFiles.get(attachmentId) || "", source: match[2].trim() }
    })
    console.log(JSON.stringify({
      id: post.id,
      title: post.title,
      contentLength: post.content.length,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      frames,
      meta: (postMeta.get(String(post.id)) || []).filter((item) => !item.key.startsWith("_") || ["_thumbnail_id", "_wp_old_slug"].includes(item.key)),
      revisions: (revisions.get(String(post.id)) || []).map((revision) => ({ ...revision, contentLength: revision.content.length })),
    }))
  }
  process.exit(0)
}

const server = createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`)

  if (url.pathname.startsWith("/media/")) {
    sendMedia(response, url.pathname)
    return
  }

  if (url.pathname === "/") {
    const query = (url.searchParams.get("q") || "").trim().toLocaleLowerCase("et")
    const matches = query
      ? posts.filter((post) => `${post.title} ${plainText(post.content)}`.toLocaleLowerCase("et").includes(query))
      : posts
    const list = matches.map((post) => `
      <a class="post" href="/post/${post.id}">
        <strong>${escapeHtml(post.title)}</strong>
        <div class="date">${escapeHtml(post.date.slice(0, 10))}</div>
        <div class="summary">${escapeHtml(plainText(post.excerpt || post.content).slice(0, 240))}</div>
      </a>`).join("")

    sendHtml(response, 200, layout("WordPress posts", `
      <section class="panel">
        <h1>WordPress blog posts</h1>
        <p class="notice">Read-only view of ${posts.length} published posts from the ${escapeHtml(BACKUP_LABEL)} backup.</p>
        <form method="get"><input name="q" value="${escapeHtml(url.searchParams.get("q") || "")}" placeholder="Search posts"><button>Search</button></form>
        <p>${matches.length} post${matches.length === 1 ? "" : "s"}</p>
        <div class="posts">${list || "<p>No matching posts.</p>"}</div>
      </section>`))
    return
  }

  const match = url.pathname.match(/^\/post\/(\d+)$/)
  const post = match ? postsById.get(match[1]) : null
  if (post) {
    const featuredUrl = post.featuredImage ? `/media/${post.featuredImage}` : ""
    const featuredAlreadyInContent = featuredUrl && localMediaUrl(post.content).includes(featuredUrl)
    sendHtml(response, 200, layout(post.title, `
      <a class="back" href="/">&larr; All posts</a>
      <article>
        <h1>${escapeHtml(post.title)}</h1>
        <div class="date">${escapeHtml(post.date)}</div>
        ${featuredUrl && !featuredAlreadyInContent ? `<img class="featured-image" src="${escapeHtml(featuredUrl)}" alt="${escapeHtml(post.title)}">` : ""}
        ${post.content ? renderContent(post.content) : post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : '<p class="empty-note">No article text was stored in this WordPress backup. This entry consists of its title and featured image.</p>'}
      </article>`))
    return
  }

  sendHtml(response, 404, layout("Not found", '<section class="panel"><h1>Not found</h1><a href="/">Back to posts</a></section>'))
})

server.on("clientError", (error, socket) => {
  console.error(`Client error: ${error.message}`)
  if (socket.writable) socket.end("HTTP/1.1 400 Bad Request\r\n\r\n")
})

server.on("error", (error) => {
  console.error(`Server error: ${error.message}`)
})

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Loaded ${posts.length} published posts.`)
  console.log(`Open http://127.0.0.1:${PORT}`)
})
