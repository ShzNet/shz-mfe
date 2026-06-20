const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { addProjectConfiguration, joinPathFragments, updateJson } = require('nx/src/devkit-exports')

const DEFAULT_COMPONENTS_PACKAGE = '@shznet/components'
const DEFAULT_COMPONENTS_VERSION = 'workspace:*'
const DEFAULT_CORE_PACKAGE = '@shznet/core'
const DEFAULT_CORE_VERSION = 'workspace:*'

function normalizeAppOptions(tree, schema, type) {
  const name = toKebab(schema.name)
  const projectRoot = joinPathFragments('apps', name)
  const packageName = schema.packageName || `@shznet/${name}`
  const displayName = schema.displayName || toTitle(name)
  const baseSegment = schema.baseSegment || name.replace(/^(remote-|host-)/, '')
  const basePath = schema.basePath || `/app/${baseSegment}`
  const port = Number(schema.port || (type === 'host' ? findNextAvailableAppPort(tree, 3000) : findNextAvailableAppPort(tree, 3001)))
  const remoteName = schema.remoteName || name.replace(/-/g, '_')

  return {
    name,
    projectRoot,
    packageName,
    displayName,
    baseSegment,
    basePath,
    port,
    remoteName,
    componentsPackage: schema.componentsPackage || DEFAULT_COMPONENTS_PACKAGE,
    componentsVersion: schema.componentsVersion || DEFAULT_COMPONENTS_VERSION,
    corePackage: schema.corePackage || DEFAULT_CORE_PACKAGE,
    coreVersion: schema.coreVersion || DEFAULT_CORE_VERSION,
  }
}

function findNextAvailableAppPort(tree, startPort) {
  const usedPorts = new Set()

  collectPortsFromDirectory(tree, 'apps', usedPorts)

  let port = startPort
  while (usedPorts.has(port)) port += 1
  return port
}

function collectPortsFromDirectory(tree, directory, usedPorts) {
  if (!tree.exists(directory)) return

  const entries = safeChildren(tree, directory)
  if (!entries) return

  for (const entry of entries) {
    const nestedPath = joinPathFragments(directory, entry)

    const rsbuildConfigPath = joinPathFragments(nestedPath, 'rsbuild.config.ts')
    if (tree.exists(rsbuildConfigPath)) {
      const port = readPortFromRsbuildConfig(tree, rsbuildConfigPath)
      if (port !== null) usedPorts.add(port)
    }

    collectPortsFromDirectory(tree, nestedPath, usedPorts)
  }
}

function readPortFromRsbuildConfig(tree, filePath) {
  const content = tree.read(filePath, 'utf-8')
  if (!content) return null

  const match = content.match(/\bport:\s*(\d+)\b/)
  return match ? Number(match[1]) : null
}

function safeChildren(tree, directory) {
  try {
    return tree.children(directory)
  } catch {
    return null
  }
}

function ensureProjectDoesNotExist(tree, projectRoot) {
  if (tree.exists(projectRoot)) {
    throw new Error(`Project root already exists: ${projectRoot}`)
  }
}

function addAppProject(tree, options, tags, includePreview = false) {
  const targets = {
    dev: {
      executor: 'nx:run-commands',
      options: {
        command: 'pnpm dev',
        cwd: '{projectRoot}',
      },
    },
    build: {
      executor: 'nx:run-commands',
      options: {
        command: 'pnpm build',
        cwd: '{projectRoot}',
      },
    },
    typecheck: {
      executor: 'nx:run-commands',
      options: {
        command: 'pnpm typecheck',
        cwd: '{projectRoot}',
      },
    },
  }

  if (includePreview) {
    targets.preview = {
      executor: 'nx:run-commands',
      options: {
        command: 'pnpm preview',
        cwd: '{projectRoot}',
      },
    }
  }

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'application',
    targets,
    tags,
  })
}

function writePackageJson(tree, options, extraDependencies = {}, extraDevDependencies = {}) {
  const packageJson = {
    name: options.packageName,
    version: '0.0.1',
    private: true,
    type: 'module',
    scripts: {
      dev: 'rsbuild dev',
      build: 'pnpm typecheck && rsbuild build',
      preview: 'rsbuild preview',
      typecheck: 'tsc -p tsconfig.json --noEmit && node ../../../scripts/check-no-explicit-any.mjs src',
    },
    dependencies: {
      [options.componentsPackage]: options.componentsVersion,
      [options.corePackage]: options.coreVersion,
      'lucide-react': '^1.0.0',
      react: '^19.2.7',
      'react-dom': '^19.2.7',
      'react-router-dom': '^7.0.0',
      ...extraDependencies,
    },
    devDependencies: {
      '@module-federation/rsbuild-plugin': '^2.0.0',
      '@rsbuild/core': '^2.0.0',
      '@rsbuild/plugin-react': '^2.0.0',
      '@rsbuild/plugin-type-check': '^1.4.0',
      '@tailwindcss/postcss': '^4.3.1',
      '@types/react': '^19.2.17',
      '@types/react-dom': '^19.2.3',
      tailwindcss: '^4.3.1',
      typescript: '~5.8.3',
      ...extraDevDependencies,
    },
  }

  tree.write(joinPathFragments(options.projectRoot, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
}

function writeBaseAppFiles(tree, options, title) {
  writeTemplateFiles(
    tree,
    options.projectRoot,
    resolve(__dirname, 'templates', 'base'),
    [
      ['index.html', 'index.html.template'],
      ['tsconfig.json', 'tsconfig.json.template'],
      ['src/style-modules.d.ts', 'style-modules.d.ts.template'],
      ['src/styles.css', 'styles.css.template'],
    ],
    {
      __TITLE__: title,
      __COMPONENTS_PACKAGE__: options.componentsPackage,
    }
  )
}

function updateRootPackageScripts(tree, options) {
  updateJson(tree, 'package.json', (json) => {
    json.scripts ||= {}
    json.scripts.dev ??= 'nx run-many -t dev --parallel=10'
    json.scripts.build ??= 'nx run-many -t build'
    json.scripts[`dev:${options.name}`] = `nx dev ${options.name}`
    json.scripts[`build:${options.name}`] = `nx build ${options.name}`
    return json
  })
}

function writeTemplateFiles(tree, projectRoot, templateRoot, files, replacements = {}) {
  for (const [targetFile, templateFile] of files) {
    const source = resolve(templateRoot, templateFile)
    const content = applyTemplateReplacements(readFileSync(source, 'utf8'), replacements)
    tree.write(joinPathFragments(projectRoot, targetFile), content)
  }
}

function applyTemplateReplacements(content, replacements) {
  let rendered = content
  for (const [token, value] of Object.entries(replacements)) {
    rendered = rendered.replaceAll(token, value)
  }
  return rendered
}

function toKebab(value) {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

function toPascal(value) {
  return toKebab(value)
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')
}

function toConstant(value) {
  return toKebab(value).replace(/-/g, '_').toUpperCase()
}

function toTitle(value) {
  return toKebab(value)
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

module.exports = {
  addAppProject,
  ensureProjectDoesNotExist,
  normalizeAppOptions,
  toConstant,
  toKebab,
  toPascal,
  toTitle,
  writeTemplateFiles,
  updateRootPackageScripts,
  writeBaseAppFiles,
  writePackageJson,
}
