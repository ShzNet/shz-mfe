import { readdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = fileURLToPath(new URL('.', import.meta.url))
const storageRoot = resolve(root, 'verdaccio/storage/@shznet')
const srcRoot = resolve(root, 'src')
const sampleRoot = resolve(root, 'sample')

const localPackages = ['core', 'components', 'nx-generators']
const sampleWorkspaces = ['host-ws', 'remote-ws-1', 'remote-ws-2']

function run(cmd, args, cwd) {
  const result = spawnSync(cmd, args, { cwd, stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

// 1. Clean Verdaccio storage
console.log('Cleaning Verdaccio storage...')
for (const pkg of localPackages) {
  await rm(resolve(storageRoot, pkg), { recursive: true, force: true })
  console.log(`  ✓ @shznet/${pkg}`)
}

// 2. Clean sample workspaces
console.log('\nCleaning sample workspaces...')
for (const ws of sampleWorkspaces) {
  const wsDir = resolve(sampleRoot, ws)

  await rm(resolve(wsDir, 'node_modules'), { recursive: true, force: true })
  await rm(resolve(wsDir, '.nx'), { recursive: true, force: true })

  const appsDir = resolve(wsDir, 'apps')
  const appNames = await readdir(appsDir).catch(() => [])
  for (const app of appNames) {
    await rm(resolve(appsDir, app, 'node_modules'), { recursive: true, force: true })
    await rm(resolve(appsDir, app, 'dist'), { recursive: true, force: true })
  }

  console.log(`  ✓ ${ws}`)
}

// 3. Re-publish packages
console.log('\nRe-publishing packages...')
run('pnpm', ['publish:local'], srcRoot)

// 4. Re-install sample workspaces
console.log('\nRe-installing sample workspaces...')
for (const ws of sampleWorkspaces) {
  console.log(`  Installing ${ws}...`)
  run('pnpm', ['install', '--force'], resolve(sampleRoot, ws))
}

console.log('\nDone.')
