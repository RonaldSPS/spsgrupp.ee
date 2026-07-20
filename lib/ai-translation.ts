import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"

const DEEPSEEK_BASE = "https://api.deepseek.com/v1"

export type TranslationLanguage = "en" | "ru"

export interface DeepseekTranslationOptions<T extends object> {
  source: T
  targetLanguage: TranslationLanguage
  subject: "blog post" | "job offer" | "testimonial"
  htmlFields: string[]
}

const languageNames: Record<TranslationLanguage, string> = {
  en: "English",
  ru: "Russian",
}

export function sourceHash(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex")
    .slice(0, 24)
}

export function loadDeepseekApiKey(): string {
  if (!process.env.DEEPSEEK_API_KEY && existsSync(".env.local")) {
    const envText = readFileSync(".env.local", "utf8")
    for (const line of envText.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/)
      if (!match || process.env[match[1]]) continue
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "")
    }
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured")
  return apiKey
}

export async function translateJsonWithDeepseek<T extends object>({
  source,
  targetLanguage,
  subject,
  htmlFields,
}: DeepseekTranslationOptions<T>): Promise<T> {
  const apiKey = loadDeepseekApiKey()
  const langName = languageNames[targetLanguage]

  const response = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 12000,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: "You are a professional website translator. Return ONLY valid JSON with the same keys. No markdown, no comments.",
        },
        {
          role: "user",
          content: `Translate this Estonian ${subject} JSON to ${langName}.

Rules:
- Keep every JSON key exactly as-is.
- Translate only string values.
- Preserve HTML tags and attributes exactly in these fields: ${htmlFields.join(", ")}.
- Keep href/src URLs unchanged.
- Keep brand names unchanged: SPS Grupp, SPS Grupp OÜ, SP Service OÜ.
- Keep names, phone numbers, email addresses, registry codes, dates, prices, ISO references and currency values unchanged.
- Generate URL-friendly translated slug values. For Russian slugs, use Cyrillic words and hyphens, not transliteration.
- For Russian, use formal Вы-style wording.
- Return only JSON.

JSON:
${JSON.stringify(source, null, 2)}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Deepseek API error ${response.status}: ${await response.text()}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ""
  const jsonText = extractJson(text)
  return JSON.parse(jsonText) as T
}

function extractJson(text: string): string {
  const codeBlock = text.match(/```(?:json)?\n?([\s\S]+?)\n?\s*```/)
  if (codeBlock) return codeBlock[1].trim()

  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start !== -1 && end !== -1) return text.slice(start, end + 1)

  throw new Error("Deepseek response did not contain JSON")
}
