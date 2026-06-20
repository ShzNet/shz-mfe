import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const repoRoot = fileURLToPath(new URL('.', import.meta.url))
const scriptPath = resolve(repoRoot, 'sample/scripts/recreate-samples.mjs')

const result = spawnSync('node', [scriptPath], {
  cwd: repoRoot,
  stdio: 'inherit',
})

process.exit(result.status ?? 1)
