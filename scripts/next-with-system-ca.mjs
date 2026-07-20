import { spawn } from "child_process"
import { fileURLToPath } from "url"
import path from "path"

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, "..")

const args = process.argv.slice(2)
const child = spawn("npx", ["next", ...args], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env },
})

child.on("close", (code) => process.exit(code ?? 0))
