/**
 * OpenAI click reference (oppref) capture — ajutine ChatGPT Ads pikslitest.
 *
 * ChatGPT'i reklaamid lisavad maandumis-URL-ile ?oppref=... ja piksel
 * säilitab selle first-party `__oppref` küpsises (30 p). Loeme URL-i parameetri
 * esimesena (värskeim klõps võidab) ja seejärel küpsise, nii et viide on
 * olemas ka siis, kui külastaja esmalt lehel ringi liigub. Väärtus läheb
 * serveri-poolsesse Conversions API sündmusesse kaasa (brauseri-piksel
 * püüab selle automaatselt kinni) — ilma selleta ei saa serveri-sündmust
 * reklaamklõpsule omistada.
 */
export function getOppref(): string {
  if (typeof window === "undefined") return ""

  const fromUrl = new URLSearchParams(window.location.search).get("oppref")
  if (fromUrl) return fromUrl.slice(0, 512)

  const match = document.cookie.match(/(?:^|;\s*)__oppref=([^;]+)/)
  if (match) return decodeURIComponent(match[1]).slice(0, 512)

  return ""
}
