import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const dist = resolve(root, 'dist')

rmSync(dist, { recursive: true, force: true })
mkdirSync(resolve(dist, 'bin'), { recursive: true })

cpSync(resolve(root, 'bin/create-shznet-workspace.js'), resolve(dist, 'bin/create-shznet-workspace.js'))
cpSync(resolve(root, 'README.md'), resolve(dist, 'README.md'))

const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
delete packageJson.scripts
if (packageJson.publishConfig?.registry) {
  delete packageJson.publishConfig.registry
}
if (packageJson.dependencies) {
  for (const [name, version] of Object.entries(packageJson.dependencies)) {
    if (typeof version === 'string' && version.startsWith('workspace:')) {
      packageJson.dependencies[name] = version.slice('workspace:'.length)
    }
  }
}

writeFileSync(resolve(dist, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
