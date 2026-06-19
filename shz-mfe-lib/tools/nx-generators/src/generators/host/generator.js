const { formatFiles, joinPathFragments } = require('nx/src/devkit-exports')
const {
  addAppProject,
  ensureProjectDoesNotExist,
  normalizeAppOptions,
  updateRootPackageScripts,
  writeBaseAppFiles,
  writePackageJson,
} = require('../shared')

module.exports = async function hostGenerator(tree, schema) {
  const options = normalizeAppOptions(schema, 'host')
  ensureProjectDoesNotExist(tree, options.projectRoot)
  addAppProject(tree, options, ['scope:host', 'type:app'], true)
  writePackageJson(
    tree,
    options,
    {
      '@module-federation/enhanced': '^0.9.0',
      sonner: '^2.0.7',
    },
  )
  writeBaseAppFiles(tree, options, `${options.displayName} Host`)
  tree.write(joinPathFragments(options.projectRoot, 'rsbuild.config.ts'), buildRsbuildConfig(options))
  tree.write(joinPathFragments(options.projectRoot, 'src/main.tsx'), buildMainTsx())
  tree.write(joinPathFragments(options.projectRoot, 'src/app.tsx'), buildAppTsx(options))
  tree.write(joinPathFragments(options.projectRoot, 'src/remotes.ts'), buildRemotesTs())
  updateRootPackageScripts(tree, options)
  if (typeof formatFiles === 'function') await formatFiles(tree)
}

function buildRsbuildConfig(options) {
  return `import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  server: {
    port: ${options.port},
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  dev: {
    writeToDisk: true,
    client: { host: 'localhost', port: ${options.port} },
  },
  tools: {
    postcss: (config) => {
      if (typeof config.postcssOptions === 'function') return
      config.postcssOptions ??= {}
      config.postcssOptions.plugins ??= []
      config.postcssOptions.plugins.unshift(tailwindcss)
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  source: {
    entry: { index: './src/main.tsx' },
  },
  html: {
    template: './index.html',
  },
  plugins: [
    pluginReact(),
    pluginTypeCheck({
      tsCheckerOptions: {
        typescript: { configOverwrite: { include: ['src/**/*'] } },
      },
    }),
    pluginModuleFederation({
      dts: false,
      name: '${options.name.replace(/-/g, '_')}',
      remotes: {},
      shared: {
        react: { singleton: true, eager: true, requiredVersion: false },
        'react-dom': { singleton: true, eager: true, requiredVersion: false },
        'react-router-dom': { singleton: true, eager: true, requiredVersion: false },
      },
    }),
  ],
})
`
}

function buildMainTsx() {
  return `import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import { App } from './app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <App />
      <Toaster />
    </>
  </React.StrictMode>
)
`
}

function buildAppTsx(options) {
  return `import { Suspense, lazy } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '${options.componentsPackage}'
import { PlugZap } from 'lucide-react'
import { apps } from './remotes'

function Home() {
  return (
    <div className='mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-6 py-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>${options.displayName}</h1>
          <p className='text-sm text-muted-foreground'>Generated host shell wired for Module Federation remotes.</p>
        </div>
        <Badge variant='secondary'>port ${options.port}</Badge>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {apps.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg'>{app.name}</CardTitle>
                <PlugZap className='size-4 text-muted-foreground' />
              </div>
              <CardDescription>{app.basePath}</CardDescription>
            </CardHeader>
            <CardContent className='flex items-center justify-between gap-3'>
              <span className='truncate text-xs text-muted-foreground'>{app.entry}</span>
              <Button asChild size='sm'>
                <Link to={app.basePath}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function buildModuleId(remoteName, exposedModule) {
  return \`\${remoteName}\${exposedModule.replace(/^\\./, '')}\`
}

function RemotePage({ remoteName, exposedModule }) {
  const LazyComp = lazy(() =>
    import('@module-federation/enhanced/runtime').then(async ({ loadRemote }) => {
      const moduleId = buildModuleId(remoteName, exposedModule)
      const mod = await loadRemote(moduleId)
      return { default: mod.default }
    })
  )

  return (
    <Suspense fallback={<div className='p-6 text-sm text-muted-foreground'>Loading module...</div>}>
      <LazyComp />
    </Suspense>
  )
}

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route index element={<Home />} />
        {apps.map((app) => (
          <Route
            key={app.id}
            path={\`\${app.basePath}/*\`}
            element={<RemotePage remoteName={app.remoteName} exposedModule='./Page' />}
          />
        ))}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}
`
}

function buildRemotesTs() {
  return `import { registerRemotes } from '@module-federation/enhanced/runtime'

export interface HostRemoteApp {
  id: string
  name: string
  basePath: string
  remoteName: string
  entry: string
}

export const apps: HostRemoteApp[] = [
  {
    id: 'sample',
    name: 'Sample Module',
    basePath: '/app/sample',
    remoteName: 'remote_sample',
    entry: 'http://localhost:3001/mf-manifest.json',
  },
]

registerRemotes(apps.map((app) => ({ name: app.remoteName, entry: app.entry })))
`
}
