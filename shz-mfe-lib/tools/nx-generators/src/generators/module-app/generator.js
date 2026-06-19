const { formatFiles, joinPathFragments } = require('nx/src/devkit-exports')
const {
  addAppProject,
  ensureProjectDoesNotExist,
  normalizeAppOptions,
  toConstant,
  toPascal,
  updateRootPackageScripts,
  writeBaseAppFiles,
  writePackageJson,
} = require('../shared')

module.exports = async function moduleAppGenerator(tree, schema) {
  const options = normalizeAppOptions(schema, 'module')
  ensureProjectDoesNotExist(tree, options.projectRoot)
  addAppProject(tree, options, ['scope:remote', 'type:app'])
  writePackageJson(tree, options)
  writeBaseAppFiles(tree, options, `${options.displayName} (Standalone)`)
  tree.write(joinPathFragments(options.projectRoot, 'rsbuild.config.ts'), buildRsbuildConfig(options))
  tree.write(joinPathFragments(options.projectRoot, 'src/main.tsx'), buildMainTsx())
  tree.write(joinPathFragments(options.projectRoot, 'src/config.ts'), buildConfigTs(options))
  tree.write(joinPathFragments(options.projectRoot, 'src/nav.tsx'), buildNavTsx(options))
  tree.write(joinPathFragments(options.projectRoot, 'src/pages/app.tsx'), buildAppPageTsx())
  tree.write(joinPathFragments(options.projectRoot, 'src/pages/dashboard.tsx'), buildDashboardPageTsx(options))
  tree.write(joinPathFragments(options.projectRoot, 'src/pages/table.tsx'), buildTablePageTsx(options))
  updateRootPackageScripts(tree, options)
  if (typeof formatFiles === 'function') await formatFiles(tree)
}

function buildRsbuildConfig(options) {
  const envName = `REMOTE_${toConstant(options.name)}_URL`
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
    { title: 'Dashboard', path: '', icon: 'LayoutDashboard', group: 'General' },
    { title: 'Table', path: '/table', icon: 'Table2', group: 'General' },
  ],
}

export default config
`
}

function buildNavTsx(options) {
  return `import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Table2 } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from '${options.componentsPackage}'

const BASE = '${options.basePath}'

const LINK_CLASS =
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 h-8 text-sm text-start outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>svg]:size-4 [&>svg]:shrink-0 [&>span:last-child]:truncate data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground'

const ITEMS = [
  { title: 'Dashboard', path: BASE, icon: LayoutDashboard },
  { title: 'Table', path: \`\${BASE}/table\`, icon: Table2 },
]

export default function ${toPascal(options.name)}Nav() {
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
  return `import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from './dashboard'
import TablePage from './table'

export default function AppPage() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path='table' element={<TablePage />} />
      <Route path='*' element={<Navigate to='.' replace />} />
    </Routes>
  )
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
          <p className='text-sm text-muted-foreground'>Sample dashboard generated by @shz/nx-generators.</p>
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

function buildTablePageTsx(options) {
  return `import { useMemo, useState } from 'react'
import { Badge, Button, Checkbox, DataTable, Input, type ColumnDef, type RowSelectionState } from '${options.componentsPackage}'
import { Search } from 'lucide-react'

type Status = 'active' | 'draft' | 'archived'

interface SampleRow {
  id: string
  code: string
  name: string
  owner: string
  status: Status
  updatedAt: string
}

const DATA: SampleRow[] = [
  { id: '1', code: 'TB-001', name: 'Pipeline A', owner: 'Emma Clark', status: 'active', updatedAt: '2026-06-10' },
  { id: '2', code: 'TB-002', name: 'Pipeline B', owner: 'Daniel Tran', status: 'draft', updatedAt: '2026-06-11' },
  { id: '3', code: 'TB-003', name: 'Pipeline C', owner: 'Sophia Lee', status: 'archived', updatedAt: '2026-06-12' },
]

const statusVariant = {
  active: 'default',
  draft: 'secondary',
  archived: 'outline',
}

export default function TablePage() {
  const [keyword, setKeyword] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const filteredData = useMemo(() => {
    const normalized = keyword.trim().toLowerCase()
    if (!normalized) return DATA
    return DATA.filter((row) => \`\${row.code} \${row.name} \${row.owner}\`.toLowerCase().includes(normalized))
  }, [keyword])

  const columns = useMemo<ColumnDef<SampleRow>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label='Select all rows'
          checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label='Select row'
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'owner', header: 'Owner' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge variant={statusVariant[row.original.status]} className='capitalize'>{row.original.status}</Badge>,
    },
    { accessorKey: 'updatedAt', header: 'Updated At' },
  ], [])

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Table Sample</h1>
          <p className='text-sm text-muted-foreground'>Starter page for table-driven modules.</p>
        </div>
        <Button size='sm'>New Item</Button>
      </div>

      <div className='rounded-lg bg-background shadow-sm'>
        <div className='border-b px-3 py-2'>
          <div className='relative w-full max-w-sm'>
            <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder='Search rows' className='pl-9' />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          pageSize={10}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => row.id}
          showToolbar={false}
          stickyHeader
          className='min-h-0 flex-1 space-y-0'
        />
      </div>
    </div>
  )
}
`
}
