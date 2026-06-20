import { readFile, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = fileURLToPath(new URL('.', import.meta.url))
const workspaceRoot = resolve(here, '..')

const packageJsonPaths = [
  'libs/core/package.json',
  'libs/components/package.json',
  'tools/nx-generators/package.json',
]

function parseLocalVersion(version) {
  const match = /^(\d+\.\d+\.\d+)(?:-local\.(\d+))?$/.exec(version)
  if (!match) {
    throw new Error(`Unsupported version format: ${version}`)
  }

  return {
    base: match[1],
    local: match[2] ? Number(match[2]) : 0,
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(workspaceRoot, path), 'utf8'))
}

async function writeJson(path, data) {
  await writeFile(resolve(workspaceRoot, path), `${JSON.stringify(data, null, 2)}\n`)
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: workspaceRoot,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const packageJsons = await Promise.all(packageJsonPaths.map((path) => readJson(path)))
const parsedVersions = packageJsons.map((pkg) => parseLocalVersion(pkg.version))
const baseVersion = parsedVersions[0]?.base

if (!baseVersion || parsedVersions.some((item) => item.base !== baseVersion)) {
  throw new Error(`Expected matching base versions across local publish packages, got: ${packageJsons.map((pkg) => pkg.version).join(', ')}`)
}

const nextLocalNumber = Math.max(...parsedVersions.map((item) => item.local)) + 1
const nextVersion = `${baseVersion}-local.${nextLocalNumber}`

await Promise.all(
  packageJsonPaths.map(async (path, index) => {
    const pkg = packageJsons[index]
    await writeJson(path, { ...pkg, version: nextVersion })
  })
)

console.log(`Publishing local packages at ${nextVersion}`)

run('pnpm', ['publish:local:core'])
run('pnpm', ['publish:local:components'])
run('pnpm', ['publish:local:nx-generators'])
