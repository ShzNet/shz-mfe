#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const here = fileURLToPath(new URL('.', import.meta.url))
const repoRoot = resolve(here, '../..')
const sampleRoot = resolve(repoRoot, 'sample')
const srcRoot = resolve(repoRoot, 'src')
const registryStorageRoot = resolve(repoRoot, 'verdaccio/storage/@shznet')
const registryUrl = 'http://localhost:4873'
const nxVersion = '23.0.0'

const coreVersion = `^${await readPackageVersion(resolve(srcRoot, 'libs/core/package.json'))}`
const componentsVersion = `^${await readPackageVersion(resolve(srcRoot, 'libs/components/package.json'))}`
const generatorsVersion = `^${await readPackageVersion(resolve(srcRoot, 'tools/nx-generators/package.json'))}`

const workspaceDefinitions = [
  {
    workspaceDirName: 'host-ws',
    workspaceName: 'host-ws',
    generator: '@shznet/nx-generators:host',
    projectName: 'sample-host',
    displayName: 'Sample Host',
    port: 3000,
    extraArgs: [],
  },
  {
    workspaceDirName: 'remote-ws-1',
    workspaceName: 'remote-ws-1',
    generator: '@shznet/nx-generators:module-app',
    projectName: 'remote-sales',
    displayName: 'Sales',
    port: 3001,
    extraArgs: ['--basePath=/app/sales'],
  },
  {
    workspaceDirName: 'remote-ws-2',
    workspaceName: 'remote-ws-2',
    generator: '@shznet/nx-generators:module-app',
    projectName: 'remote-hr',
    displayName: 'HR',
    port: 3002,
    extraArgs: ['--basePath=/app/hr'],
  },
]

await ensureRegistryPackagesAreFresh()

for (const definition of workspaceDefinitions) {
  const workspaceDir = resolve(sampleRoot, definition.workspaceDirName)
  await recreateWorkspace(workspaceDir, definition)
}

for (const definition of workspaceDefinitions) {
  const workspaceDir = resolve(sampleRoot, definition.workspaceDirName)
  console.log(`\nVerifying ${definition.workspaceDirName}...`)
  run('pnpm', ['build'], workspaceDir)
}

console.log('\nSample workspaces recreated and verified successfully.')

async function ensureRegistryPackagesAreFresh() {
  console.log('Refreshing local registry packages...')

  for (const packageName of ['core', 'components', 'nx-generators']) {
    await rm(resolve(registryStorageRoot, packageName), { recursive: true, force: true })
    console.log(`  removed @shznet/${packageName}`)
  }

  run('docker', ['compose', 'up', '-d', 'npm-registry'], repoRoot)
  run('pnpm', ['publish:local'], srcRoot)
}

async function recreateWorkspace(workspaceDir, definition) {
  console.log(`\nRecreating ${definition.workspaceDirName}...`)
  await rm(workspaceDir, { recursive: true, force: true })
  await mkdir(workspaceDir, { recursive: true })

  await writeWorkspaceScaffold(workspaceDir, definition.workspaceName)

  run('pnpm', ['install'], workspaceDir)
  run(
    'pnpm',
    [
      'nx',
      'g',
      definition.generator,
      `--name=${definition.projectName}`,
      `--displayName=${definition.displayName}`,
      `--port=${definition.port}`,
      `--coreVersion=${coreVersion}`,
      `--componentsVersion=${componentsVersion}`,
      ...definition.extraArgs,
    ],
    workspaceDir
  )

  if (definition.workspaceDirName === 'host-ws') {
    await wireHostRemotes(workspaceDir)
  }
}

async function writeWorkspaceScaffold(workspaceDir, workspaceName) {
  await writeText(
    resolve(workspaceDir, '.editorconfig'),
    `# Editor configuration, see http://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
max_line_length = off
trim_trailing_whitespace = false
`
  )

  await writeText(
    resolve(workspaceDir, '.gitignore'),
    `dist
tmp
out-tsc
node_modules
.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
/.sass-cache
/connect.lock
/coverage
/libpeerconnection.log
npm-debug.log
yarn-error.log
testem.log
/typings
.DS_Store
Thumbs.db
.nx/cache
.nx/workspace-data
`
  )

  await writeText(resolve(workspaceDir, '.npmrc'), `@shznet:registry=${registryUrl}/\n`)
  await writeText(
    resolve(workspaceDir, 'nx.json'),
    `${JSON.stringify(
      {
        $schema: './node_modules/nx/schemas/nx-schema.json',
        defaultBase: 'main',
        targetDefaults: {
          build: { dependsOn: ['^build'], cache: true },
          dev: { cache: false },
        },
      },
      null,
      2
    )}\n`
  )
  await writeText(
    resolve(workspaceDir, 'pnpm-workspace.yaml'),
    `packages:
  - 'apps/*'
allowBuilds:
  '@swc/core': true
  core-js: true
  esbuild: true
  nx: true
minimumReleaseAgeExclude:
  - '@shznet/nx-generators@${stripCaret(generatorsVersion)}'
  - '@shznet/components@${stripCaret(componentsVersion)}'
  - '@shznet/core@${stripCaret(coreVersion)}'
`
  )
  await writeText(
    resolve(workspaceDir, 'tsconfig.base.json'),
    `${JSON.stringify(
      {
        compileOnSave: false,
        compilerOptions: {
          rootDir: '.',
          sourceMap: true,
          declaration: false,
          moduleResolution: 'bundler',
          experimentalDecorators: true,
          target: 'ESNext',
          module: 'ESNext',
          lib: ['ESNext', 'DOM'],
          noImplicitAny: true,
          skipLibCheck: true,
          skipDefaultLibCheck: true,
          paths: {},
        },
        exclude: ['node_modules', 'dist', '.nx'],
      },
      null,
      2
    )}\n`
  )
  await writeText(
    resolve(workspaceDir, 'package.json'),
    `${JSON.stringify(
      {
        name: workspaceName,
        private: true,
        version: '0.0.0',
        devDependencies: {
          '@shznet/nx-generators': generatorsVersion,
          nx: nxVersion,
        },
        scripts: {
          dev: 'nx run-many -t dev --parallel=10',
          build: 'nx run-many -t build',
        },
      },
      null,
      2
    )}\n`
  )
}

async function wireHostRemotes(workspaceDir) {
  await writeText(
    resolve(workspaceDir, 'apps/sample-host/src/remotes.ts'),
    `export interface HostRemoteApp {
  id: string
  name: string
  basePath: string
  remoteName: string
  entry: string
}

export const apps: HostRemoteApp[] = [
  {
    id: 'remote-sales',
    name: 'Sales',
    basePath: '/app/sales',
    remoteName: 'remote_sales',
    entry: 'http://localhost:3001/mf-manifest.json',
  },
  {
    id: 'remote-hr',
    name: 'HR',
    basePath: '/app/hr',
    remoteName: 'remote_hr',
    entry: 'http://localhost:3002/mf-manifest.json',
  },
]
`
  )
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
  })

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`)
  }
}

async function writeText(filePath, content) {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, content, 'utf8')
}

async function readPackageVersion(packageJsonPath) {
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
  return packageJson.version
}

function stripCaret(version) {
  return version.replace(/^\^/, '')
}
