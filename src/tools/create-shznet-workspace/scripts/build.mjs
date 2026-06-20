import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const dist = resolve(root, 'dist')

rmSync(dist, { recursive: true, force: true })
mkdirSync(resolve(dist, 'bin'), { recursive: true })

const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))

// Bundle the create-workspace CLI from nx-generators so the published package
// is self-contained and always runs code that matches its own version.
const cliSource = readFileSync(
  resolve(root, '../nx-generators/src/create-workspace/cli.js'),
  'utf8'
)
const bundled = cliSource.replace(
  /const pkg = require\([^)]+\)/,
  `const pkg = { version: ${JSON.stringify(packageJson.version)} }`,
)
writeFileSync(resolve(dist, 'bin/create-shznet-workspace.js'), bundled)

const distPackageJson = { ...packageJson }
delete distPackageJson.scripts
delete distPackageJson.dependencies
if (distPackageJson.publishConfig?.registry) {
  delete distPackageJson.publishConfig.registry
}

writeFileSync(resolve(dist, 'README.md'), readFileSync(resolve(root, 'README.md')))
writeFileSync(resolve(dist, 'package.json'), `${JSON.stringify(distPackageJson, null, 2)}\n`)
