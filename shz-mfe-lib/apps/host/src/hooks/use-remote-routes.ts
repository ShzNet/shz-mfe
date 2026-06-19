import { registerRemotes } from '@module-federation/enhanced/runtime'

export interface AppModule {
  id: string
  name: string
  icon: string
  logoPng: string
  basePath: string
  remoteName: string
}

const MOCK_REGISTRY: (AppModule & { entry: string })[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    logoPng: '/module-logos/dashboard.png',
    basePath: '/app/dashboard',
    remoteName: 'remote_dashboard',
    entry: 'http://localhost:3001/mf-manifest.json',
  },
  {
    id: 'users',
    name: 'Users',
    icon: 'Users',
    logoPng: '/module-logos/users.png',
    basePath: '/app/users',
    remoteName: 'remote_users',
    entry: 'http://localhost:3002/mf-manifest.json',
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: 'ShieldCheck',
    logoPng: '/module-logos/admin.png',
    basePath: '/app/admin',
    remoteName: 'remote_admin',
    entry: 'http://localhost:3003/mf-manifest.json',
  },
]

// Register all remotes once at module load time (synchronous)
registerRemotes(MOCK_REGISTRY.map((r) => ({ name: r.remoteName, entry: r.entry })))

const APPS: AppModule[] = MOCK_REGISTRY.map(({ entry: _entry, ...app }) => app)

export function useRemoteRoutes() {
  return { apps: APPS, loading: false, error: null as Error | null }
}
