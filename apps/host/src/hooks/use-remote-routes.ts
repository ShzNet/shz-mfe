import { useEffect, useState } from 'react'
import { registerRemotes, loadRemote } from '@module-federation/enhanced/runtime'
import type { ShellMenuConfig } from '@shz/core'

export interface RemoteRouteConfig {
  path: string
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
  logoPng: string
  basePath: string
  remoteName: string
  routes: RemoteRouteConfig[]
}

/** Static registry from API — only topology info, no nav config */
interface AppRegistry {
  id: string
  name: string
  icon: string
  logoPng: string
  basePath: string
  remoteName: string
  entry: string
}

const MOCK_REGISTRY: AppRegistry[] = [
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

async function loadAppConfig(registry: AppRegistry): Promise<AppModule> {
  try {
    const mod = await loadRemote<{ default: ShellMenuConfig }>(`${registry.remoteName}/config`)
    const config = mod?.default ?? { nav: [] }

    const joinRoutePath = (basePath: string, routePath: string) => {
      const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
      const normalizedRoute = routePath.replace(/^\/+/, '')
      return normalizedRoute ? `${normalizedBase}/${normalizedRoute}` : normalizedBase
    }

    const routes: RemoteRouteConfig[] = config.nav.map((item) => ({
      path: joinRoutePath(registry.basePath, item.path),
      nav: { title: item.title, icon: item.icon, group: item.group },
    }))

    return {
      id: registry.id,
      name: registry.name,
      icon: registry.icon,
      logoPng: registry.logoPng,
      basePath: registry.basePath,
      remoteName: registry.remoteName,
      routes,
    }
  } catch {
    // Remote offline — return app with no routes (still show in team switcher)
    return {
      id: registry.id,
      name: registry.name,
      icon: registry.icon,
      logoPng: registry.logoPng,
      basePath: registry.basePath,
      remoteName: registry.remoteName,
      routes: [],
    }
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
