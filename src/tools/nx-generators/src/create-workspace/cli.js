#!/usr/bin/env node

const { existsSync, readdirSync, readFileSync, writeFileSync } = require('node:fs')
const { basename, isAbsolute, resolve } = require('node:path')
const { spawnSync } = require('node:child_process')

const pkg = require('../../package.json')

const NX_VERSION = '23.0.0'
const DEFAULT_PACKAGE_MANAGER = 'pnpm'
const TYPES = new Set(['empty', 'host', 'app', 'module-app'])

if (require.main === module) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

function main() {
  const parsed = parseArgs(process.argv.slice(2))

  if (parsed.help) {
    printHelp()
    process.exit(0)
  }

  const workspaceInput = parsed.positionals[0]
  if (!workspaceInput) {
    printHelp('Missing workspace directory name.')
    process.exit(1)
  }

  const requestedType = parsed.options.type || parsed.options.preset || 'empty'
  const type = normalizeType(requestedType)

  if (!TYPES.has(type)) {
    printHelp(`Unsupported type "${requestedType}". Use one of: ${Array.from(TYPES).join(', ')}`)
    process.exit(1)
  }

  const workspaceRoot = isAbsolute(workspaceInput) ? workspaceInput : resolve(process.cwd(), workspaceInput)
  const workspaceName = parsed.options.workspaceName || basename(workspaceRoot)
  const name = parsed.options.name || parsed.options.appName || ''
  const displayName = parsed.options.displayName || ''
  const packageManager = parsed.options.packageManager || DEFAULT_PACKAGE_MANAGER
  const generatorVersion = parsed.options.generatorVersion || `^${pkg.version}`
  const coreVersion = parsed.options.coreVersion || `^${pkg.version}`
  const componentsVersion = parsed.options.componentsVersion || `^${pkg.version}`
  const nxVersion = parsed.options.nxVersion || NX_VERSION
  const packageName = parsed.options.packageName || buildPackageName(parsed.options.packageScope, name)
  const registry = parsed.options.registry || parsed.options.shznetRegistry || ''

  ensureWorkspaceTargetIsSafe(workspaceRoot)

  runCreateNxWorkspace(workspaceInput, packageManager, nxVersion)
  ensurePnpmWorkspaceConfig(workspaceRoot)
  ensureTsConfigBase(workspaceRoot)
  ensureScopedRegistry(workspaceRoot, registry)
  addGeneratorDependency(workspaceRoot, packageManager, generatorVersion)
  ensureWorkspaceScripts(workspaceRoot)

  if (type !== 'empty') {
    ensureRequiredName(name, type)

    runAppGenerator(workspaceRoot, packageManager, type, {
      name,
      displayName,
      packageName,
      coreVersion,
      componentsVersion,
      basePath: parsed.options.basePath,
      remoteName: parsed.options.remoteName,
      port: parsed.options.port,
    })
  }

  printNextSteps(workspaceInput, workspaceRoot, {
    packageManager,
    type,
    name,
  })
}

function parseArgs(argv) {
  const positionals = []
  const options = {}

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]

    if (value === '--help' || value === '-h') {
      return { help: true, positionals, options }
    }

    if (!value.startsWith('--')) {
      positionals.push(value)
      continue
    }

    const [rawKey, inlineValue] = value.slice(2).split('=')
    const key = rawKey.trim()
    if (!key) continue

    if (inlineValue !== undefined) {
      options[key] = inlineValue
      continue
    }

    const nextValue = argv[index + 1]
    if (!nextValue || nextValue.startsWith('--')) {
      options[key] = 'true'
      continue
    }

    options[key] = nextValue
    index += 1
  }

  return { help: false, positionals, options }
}

function ensureWorkspaceTargetIsSafe(workspaceRoot) {
  if (!existsSync(workspaceRoot)) return

  const entries = readdirSync(workspaceRoot)
  if (entries.length === 0) return

  const meaningfulEntries = entries.filter((entry) => entry !== '.DS_Store')
  if (meaningfulEntries.length === 0) return

  throw new Error(`Target directory is not empty: ${workspaceRoot}`)
}

function normalizeType(value) {
  if (value === 'app') return 'module-app'
  return value
}

function ensureRequiredName(name, type) {
  if (!name) {
    throw new Error(`Missing --name for type "${type}".`)
  }
}

function buildPackageName(packageScope, name) {
  if (!packageScope || !name) return ''
  return `@${packageScope}/${name}`
}

function runCreateNxWorkspace(workspaceInput, packageManager, nxVersion) {
  const command = 'npx'
  const args = [
    '--yes',
    `create-nx-workspace@${nxVersion}`,
    workspaceInput,
    '--preset=apps',
    `--packageManager=${packageManager}`,
    '--interactive=false',
    '--workspaceType=integrated',
    '--nxCloud=skip',
    '--skipGit',
  ]

  run(command, args, process.cwd())
}

function addGeneratorDependency(workspaceRoot, packageManager, generatorVersion) {
  const { command, args } = buildAddDependencyCommand(packageManager, `@shznet/nx-generators@${generatorVersion}`)
  run(command, args, workspaceRoot)
}

function ensureWorkspaceScripts(workspaceRoot) {
  const packageJsonPath = resolve(workspaceRoot, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

  packageJson.scripts ||= {}
  packageJson.scripts.dev ??= 'nx run-many -t dev --parallel=10'
  packageJson.scripts.build ??= 'nx run-many -t build'

  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

function ensureScopedRegistry(workspaceRoot, registry) {
  if (!registry) return

  const npmrcPath = resolve(workspaceRoot, '.npmrc')
  const normalizedRegistry = registry.endsWith('/') ? registry : `${registry}/`
  const scopedRegistryLine = `@shznet:registry=${normalizedRegistry}`
  const existing = existsSync(npmrcPath) ? readFileSync(npmrcPath, 'utf8') : ''

  if (existing.includes(scopedRegistryLine)) return

  const nextContent = existing.trim()
    ? `${existing.trim()}\n${scopedRegistryLine}\n`
    : `${scopedRegistryLine}\n`

  writeFileSync(npmrcPath, nextContent)
}

function ensurePnpmWorkspaceConfig(workspaceRoot) {
  const workspaceConfigPath = resolve(workspaceRoot, 'pnpm-workspace.yaml')
  if (!existsSync(workspaceConfigPath)) {
    writeFileSync(workspaceConfigPath, `packages:\n  - 'apps/*'\n`)
    return
  }

  const content = readFileSync(workspaceConfigPath, 'utf8')
  if (/\bpackages:\s*\n(?:\s*-\s*['"]apps\/\*['"]\s*\n?)/m.test(content)) {
    return
  }

  const nextContent = `packages:\n  - 'apps/*'\n${content}`
  writeFileSync(workspaceConfigPath, nextContent)
}

function ensureTsConfigBase(workspaceRoot) {
  const tsconfigBasePath = resolve(workspaceRoot, 'tsconfig.base.json')
  if (existsSync(tsconfigBasePath)) return

  writeFileSync(
    tsconfigBasePath,
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
}

function runAppGenerator(workspaceRoot, packageManager, type, options) {
  const generatorName = type === 'host' ? 'host' : 'module-app'
  const args = [
    'g',
    `@shznet/nx-generators:${generatorName}`,
    `--name=${options.name}`,
    `--coreVersion=${options.coreVersion}`,
    `--componentsVersion=${options.componentsVersion}`,
  ]

  if (options.displayName) {
    args.push(`--displayName=${options.displayName}`)
  }

  if (options.packageName) {
    args.push(`--packageName=${options.packageName}`)
  }

  if (options.basePath && type === 'module-app') {
    args.push(`--basePath=${options.basePath}`)
  }

  if (options.remoteName && type === 'module-app') {
    args.push(`--remoteName=${options.remoteName}`)
  }

  if (options.port) {
    args.push(`--port=${options.port}`)
  }

  const commandSpec = buildNxCommand(packageManager, args)
  run(commandSpec.command, commandSpec.args, workspaceRoot)
}

function buildAddDependencyCommand(packageManager, dependency) {
  switch (packageManager) {
    case 'npm':
      return { command: 'npm', args: ['install', '-D', dependency] }
    case 'yarn':
      return { command: 'yarn', args: ['add', '-D', dependency] }
    case 'bun':
      return { command: 'bun', args: ['add', '-d', dependency] }
    case 'pnpm':
    default:
      return { command: 'pnpm', args: ['add', '-D', dependency] }
  }
}

function buildNxCommand(packageManager, nxArgs) {
  switch (packageManager) {
    case 'npm':
      return { command: 'npm', args: ['exec', 'nx', '--', ...nxArgs] }
    case 'yarn':
      return { command: 'yarn', args: ['nx', ...nxArgs] }
    case 'bun':
      return { command: 'bunx', args: ['nx', ...nxArgs] }
    case 'pnpm':
    default:
      return { command: 'pnpm', args: ['nx', ...nxArgs] }
  }
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    windowsHide: true,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function printHelp(errorMessage) {
  if (errorMessage) {
    console.error(errorMessage)
    console.error('')
  }

  console.log(`create-shznet-workspace

Usage:
  npx create-shznet-workspace my-workspace [options]

This CLI wraps create-nx-workspace, then installs @shznet/nx-generators
and optionally runs one of the app generators.

Options:
  --type <empty|host|app|module-app>  Generator type to run after workspace creation. Default: empty
  --name <name>                       Project name passed to the generator
  --displayName <label>               Display name passed to the generator
  --packageName <name>                Explicit package name passed to the generator
  --packageScope <scope>              Builds packageName as @scope/name when packageName is omitted
  --basePath <path>                   Base path for app/module-app
  --remoteName <name>                 Explicit Module Federation remote name for app/module-app
  --port <number>                     Port passed to the generator
  --packageManager <name>             Package manager passed to Nx. Default: pnpm
  --registry <url>                    Writes @shznet scoped registry to the new workspace .npmrc
  --nxVersion <version>               create-nx-workspace version. Default: ${NX_VERSION}
  --generatorVersion <range>          Version/range for @shznet/nx-generators
  --coreVersion <range>               Version passed to the generator for @shznet/core
  --componentsVersion <range>         Version passed to the generator for @shznet/components
  --help                              Show this help
`)
}

function printNextSteps(workspaceInput, workspaceRoot, options) {
  const relativeWorkspace = workspaceInput === '.' ? workspaceRoot : workspaceInput
  const openCommand = options.type === 'empty'
    ? 'run a generator when ready'
    : `${options.packageManager} dev:${options.name}`

  console.log(`\nWorkspace ready at ${workspaceRoot}

Next steps:
  cd ${relativeWorkspace}
  ${openCommand}
`)
}

module.exports = {
  main,
}
