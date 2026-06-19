function buildRsbuildConfig(options, envName) {
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
    assetPrefix: 'http://localhost:${options.port}/',
    client: { host: 'localhost', port: ${options.port} },
  },
  output: {
    assetPrefix:
      (import.meta as { env?: Record<string, string | undefined> }).env?.${envName} ??
      'http://localhost:${options.port}/',
  },
  tools: {
    postcss: (config) => {
      if (typeof config.postcssOptions === 'function') return
      config.postcssOptions ??= {}
      config.postcssOptions.plugins ??= []
      config.postcssOptions.plugins.unshift(tailwindcss)
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
      name: '${options.remoteName}',
      exposes: {
        './config': './src/config.ts',
        './Page': './src/pages/app.tsx',
        './Nav': './src/nav.tsx',
      },
      shared: {
        '${options.corePackage}': { singleton: true, requiredVersion: false },
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'react-router-dom': { singleton: true, requiredVersion: false },
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
import { BrowserRouter } from 'react-router-dom'
import AppPage from './pages/app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className='p-4'>
        <AppPage />
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
`
}

function buildConfigTs(options) {
  return `import type { ShellMenuConfig } from '${options.corePackage}'

const config: ShellMenuConfig = {
  nav: [
    { title: 'Overview', path: '', icon: 'LayoutDashboard', group: 'General' },
  ],
}

export default config
`
}

function buildNavTsx(options, componentName) {
  return `import './styles.css'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from '${options.componentsPackage}'

const BASE = '${options.basePath}'

const LINK_CLASS =
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 h-8 text-sm text-start outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>svg]:size-4 [&>svg]:shrink-0 [&>span:last-child]:truncate data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground'

const ITEMS = [
  { title: 'Overview', path: BASE, icon: LayoutDashboard },
]

export default function ${componentName}() {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {ITEMS.map(({ title, path, icon: Icon }) => (
          <SidebarMenuItem key={title}>
            <Link to={path} data-active={pathname === path || pathname.startsWith(\`\${path}/\`)} className={LINK_CLASS}>
              <Icon />
              <span>{title}</span>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
`
}

function buildAppPageTsx() {
  return `import '../styles.css'
import DashboardPage from './dashboard'

export default function AppPage() {
  return <DashboardPage />
}
`
}

function buildDashboardPageTsx(options) {
  return `import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '${options.componentsPackage}'
import { Activity, Boxes, CircleDollarSign, ShoppingBag } from 'lucide-react'

const stats = [
  { title: 'Revenue', value: '$28,420', description: '+12.4% vs last week', icon: CircleDollarSign },
  { title: 'Orders', value: '1,204', description: '97 pending review', icon: ShoppingBag },
  { title: 'Products', value: '486', description: '24 low stock alerts', icon: Boxes },
  { title: 'Activity', value: '89%', description: 'SLA within target', icon: Activity },
]

export default function DashboardPage() {
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>${options.displayName}</h1>
          <p className='text-sm text-muted-foreground'>Single sample page generated by @shz/nx-generators.</p>
        </div>
        <Badge variant='secondary' className='text-xs'>${options.remoteName} · port ${options.port}</Badge>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardDescription>{stat.title}</CardDescription>
                <stat.icon className='size-4 text-muted-foreground' />
              </div>
              <CardTitle className='text-2xl'>{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
`
}

module.exports = {
  buildRsbuildConfig,
  buildMainTsx,
  buildConfigTs,
  buildNavTsx,
  buildAppPageTsx,
  buildDashboardPageTsx,
}
