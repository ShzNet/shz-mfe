import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const registry = 'http://localhost:4873'
const packageNames = ['@shz/core', '@shz/components', '@shz/nx-generators']

const workspaceRoot = process.cwd()
const appPackageName = process.argv[2]

if (!appPackageName) {
  console.error('Usage: node ../scripts/update-local-shz-deps.mjs <app-package-name>')
  process.exit(1)
}

async function readDistTag(packageName) {
  const response = await fetch(`${registry}/${encodeURIComponent(packageName)}`)
  if (!response.ok) {
    throw new Error(`Failed to read ${packageName} metadata from ${registry}: ${response.status} ${response.statusText}`)
  }

  const metadata = await response.json()
  const latest = metadata['dist-tags']?.latest

  if (!latest) {
    throw new Error(`Package ${packageName} has no latest dist-tag on ${registry}`)
  }

  return latest
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

const versions = await Promise.all(packageNames.map((packageName) => readDistTag(packageName)))
const uniqueVersions = [...new Set(versions)]

if (uniqueVersions.length !== 1) {
  console.error(
    `Expected matching latest versions across ${packageNames.join(', ')}, got: ${packageNames
      .map((packageName, index) => `${packageName}@${versions[index]}`)
      .join(', ')}`
  )
  process.exit(1)
}

const version = uniqueVersions[0]

console.log(`Updating local SHZ packages to ${version}`)

run('pnpm', ['add', '-D', `@shz/nx-generators@${version}`, '--save-exact', '--registry', registry])
run('pnpm', ['--filter', appPackageName, 'add', `@shz/core@${version}`, `@shz/components@${version}`, '--save-exact', '--registry', registry])

const rootPackageJson = JSON.parse(await readFile(resolve(workspaceRoot, 'package.json'), 'utf8'))
console.log(`Updated workspace ${rootPackageJson.name} and app ${appPackageName} to ${version}`)
