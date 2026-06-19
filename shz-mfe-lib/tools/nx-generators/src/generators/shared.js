const { addProjectConfiguration, joinPathFragments, updateJson } = require('nx/src/devkit-exports')

const DEFAULT_COMPONENTS_PACKAGE = '@shz/components'
const DEFAULT_COMPONENTS_VERSION = '^0.0.1'
const DEFAULT_CORE_PACKAGE = '@shz/core'
const DEFAULT_CORE_VERSION = '^0.0.1'

function normalizeAppOptions(schema, type) {
  const name = toKebab(schema.name)
  const projectRoot = joinPathFragments('apps', name)
  const packageName = schema.packageName || `@shz/${name}`
  const displayName = schema.displayName || toTitle(name)
  const baseSegment = schema.baseSegment || name.replace(/^(remote-|host-)/, '')
  const basePath = schema.basePath || `/app/${baseSegment}`
  const port = Number(schema.port || (type === 'host' ? 3000 : 3001))
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
      build: 'rsbuild build',
      preview: 'rsbuild preview',
    },
    dependencies: {
      [options.componentsPackage]: options.componentsVersion,
      [options.corePackage]: options.coreVersion,
      'lucide-react': '^0.487.0',
      react: '^19.1.0',
      'react-dom': '^19.1.0',
      'react-router-dom': '^6.26.0',
      ...extraDependencies,
    },
    devDependencies: {
      '@module-federation/rsbuild-plugin': '^0.9.0',
      '@rsbuild/core': '^1.4.0',
      '@rsbuild/plugin-react': '^1.2.0',
      '@rsbuild/plugin-type-check': '^1.3.4',
      '@tailwindcss/postcss': '^4.1.0',
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      tailwindcss: '^4.1.0',
      typescript: '~5.8.0',
      ...extraDevDependencies,
    },
  }

  tree.write(joinPathFragments(options.projectRoot, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
}

function writeBaseAppFiles(tree, options, title) {
  tree.write(joinPathFragments(options.projectRoot, 'index.html'), buildIndexHtml(title))
  tree.write(joinPathFragments(options.projectRoot, 'tsconfig.json'), buildTsConfig())
  tree.write(joinPathFragments(options.projectRoot, 'src/style-modules.d.ts'), "declare module '*.css';\n")
  tree.write(joinPathFragments(options.projectRoot, 'src/styles.css'), buildStylesCss(options.componentsPackage))
}

function updateRootPackageScripts(tree, options) {
  updateJson(tree, 'package.json', (json) => {
    json.scripts ||= {}
    json.scripts[`dev:${options.name}`] = `nx dev ${options.name}`
    return json
  })
}

function buildIndexHtml(title) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`
}

function buildTsConfig() {
  return `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "types": ["react", "react-dom"],
    "baseUrl": ".",
    "paths": {}
  },
  "include": ["src/**/*", "rsbuild.config.ts"],
  "exclude": ["node_modules", "dist"]
}
`
}

function buildStylesCss(componentsPackage) {
  return `@import "tailwindcss";
@import "${componentsPackage}/styles/theme.css";

@custom-variant dark (&:is(.dark *));

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
`
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
  updateRootPackageScripts,
  writeBaseAppFiles,
  writePackageJson,
}
