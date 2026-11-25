import { heroObjectPosition, isHeroImagePosition } from "@/lib/case-study-format"

const checks: [string, boolean][] = [
  ["top -> center top", heroObjectPosition("top") === "center top"],
  ["bottom -> center bottom", heroObjectPosition("bottom") === "center bottom"],
  ["center -> center", heroObjectPosition("center") === "center"],
  ["undefined -> center", heroObjectPosition(undefined) === "center"],
  ["null -> center", heroObjectPosition(null) === "center"],
  ["garbage -> center", heroObjectPosition("diagonal") === "center"],
  ["isHeroImagePosition('top')", isHeroImagePosition("top") === true],
  ["isHeroImagePosition('center')", isHeroImagePosition("center") === true],
  ["isHeroImagePosition('bottom')", isHeroImagePosition("bottom") === true],
  ["isHeroImagePosition('diagonal') = false", isHeroImagePosition("diagonal") === false],
  ["isHeroImagePosition('') = false", isHeroImagePosition("") === false],
  ["isHeroImagePosition(undefined) = false", isHeroImagePosition(undefined) === false],
]

let fail = 0
for (const [name, ok] of checks) {
  console.log(ok ? "PASS" : "FAIL", name)
  if (!ok) fail++
}
if (fail) process.exit(1)
console.log("ALL PASS")
