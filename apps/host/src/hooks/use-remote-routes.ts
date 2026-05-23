import { useEffect, useState } from 'react'
import { registerRemotes, loadRemote } from '@module-federation/enhanced/runtime'
import type { RemoteAppConfig } from '@shz/components/remote-config'

export interface RemoteRouteConfig {
  path: string
  remoteName: string
  exposedModule: string
  nav: {
    title: string
    icon: string
    group: string
  }
}

export interface AppModule {
  id: string
  name: string
  icon: string
  basePath: string
  routes: RemoteRouteConfig[]
}

/** Static registry from API — only topology info, no nav config */
interface AppRegistry {
  id: string
  name: string
  icon: string
  basePath: string
  remoteName: string
  entry: string
}

const MOCK_REGISTRY: AppRegistry[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    basePath: '/app/dashboard',
    remoteName: 'remote_dashboard',
    entry: 'http://localhost:3001/mf-manifest.json',
  },
  {
    id: 'users',
    name: 'Users',
    icon: 'Users',
    basePath: '/app/users',
    remoteName: 'remote_users',
    entry: 'http://localhost:3002/mf-manifest.json',
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: 'ShieldCheck',
    basePath: '/app/admin',
    remoteName: 'remote_admin',
    entry: 'http://localhost:3003/mf-manifest.json',
  },
]

async function loadAppConfig(registry: AppRegistry): Promise<AppModule> {
  try {
    const mod = await loadRemote<{ default: RemoteAppConfig }>(`${registry.remoteName}/config`)
    const config = mod?.default ?? { nav: [] }

    const routes: RemoteRouteConfig[] = config.nav.map((item) => ({
      path: registry.basePath + item.path,
      remoteName: registry.remoteName,
      exposedModule: item.expose ?? './Page',
      nav: { title: item.title, icon: item.icon, group: item.group },
    }))

    return { id: registry.id, name: registry.name, icon: registry.icon, basePath: registry.basePath, routes }
  } catch {
    // Remote offline — return app with no routes (still show in team switcher)
    return { id: registry.id, name: registry.name, icon: registry.icon, basePath: registry.basePath, routes: [] }
  }
}

export function useRemoteRoutes() {
  const [apps, setApps] = useState<AppModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        // Register all remotes first
        registerRemotes(
          MOCK_REGISTRY.map((r) => ({ name: r.remoteName, entry: r.entry }))
        )

        // Load nav config from each remote in parallel
        const modules = await Promise.all(MOCK_REGISTRY.map(loadAppConfig))

        if (!cancelled) setApps(modules)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed to load remote routes'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  return { apps, loading, error }
}
