import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const here = fileURLToPath(new URL('.', import.meta.url))
const workspaceRoot = resolve(here, '../../..')
const distPackageJsonPath = resolve(workspaceRoot, 'tools/nx-generators/dist/package.json')
const registry = 'http://localhost:4873'

const pkg = JSON.parse(await readFile(distPackageJsonPath, 'utf8'))
const packageName = pkg.name
const packageVersion = pkg.version
const packageUrl = `${registry}/${encodeURIComponent(packageName)}`

const response = await fetch(packageUrl)

if (response.ok) {
  const metadata = await response.json()
  if (metadata.versions?.[packageVersion]) {
    console.log('There are no new packages that should be published')
    process.exit(0)
  }
} else if (response.status !== 404) {
  console.error(`Failed to inspect ${packageName} on ${registry}: ${response.status} ${response.statusText}`)
  process.exit(1)
}

const result = spawnSync(
  'pnpm',
  ['publish', './tools/nx-generators/dist', '--registry', registry, '--access', 'public', '--no-git-checks'],
  {
    cwd: workspaceRoot,
    stdio: 'inherit',
  }
)

process.exit(result.status ?? 1)
