function buildRemoteShellTsx(options) {
  return `import { type ComponentType, Suspense, useEffect, useState } from 'react'
import type { ShellHostServices, ShellRemoteComponentProps } from '${options.corePackage}'
import { loadFederatedModule } from '${options.corePackage}'

type RemoteShellProps = ShellRemoteComponentProps<unknown, ShellHostServices>
type RemoteMenuProps = ShellRemoteComponentProps<unknown, ShellHostServices>

type RemoteShellModule = {
  default: ComponentType<RemoteShellProps>
  Menu?: ComponentType<RemoteMenuProps>
}

type RemoteShellState = {
  module: RemoteShellModule | null
  loading: boolean
  error: Error | null
}

type RemoteShellPageProps = {
  state: RemoteShellState
  shellServices?: ShellHostServices
}

const shellModuleCache = new Map<string, RemoteShellModule>()
const shellPromiseCache = new Map<string, Promise<RemoteShellModule>>()

async function loadShellModule(remoteName: string, entry: string) {
  const cacheKey = \`\${remoteName}::\${entry}\`
  if (shellModuleCache.has(cacheKey)) return shellModuleCache.get(cacheKey)!

  if (!shellPromiseCache.has(cacheKey)) {
    shellPromiseCache.set(
      cacheKey,
      loadFederatedModule<RemoteShellModule>(remoteName, './Shell', entry)
        .then((mod) => {
          if (!mod?.default) throw new Error(\`Remote shell "\${remoteName}" has no default export\`)
          shellModuleCache.set(cacheKey, mod)
          return mod
        })
        .catch((error) => {
          shellPromiseCache.delete(cacheKey)
          throw error
        })
    )
  }

  return shellPromiseCache.get(cacheKey)!
}

export function useRemoteShell(remoteName: string, entry: string): RemoteShellState {
  const cacheKey = \`\${remoteName}::\${entry}\`
  const [state, setState] = useState<RemoteShellState>(() => {
    const mod = shellModuleCache.get(cacheKey) ?? null
    return { module: mod, loading: !mod, error: null }
  })

  useEffect(() => {
    let active = true

    loadShellModule(remoteName, entry)
      .then((mod) => {
        if (!active) return
        setState({ module: mod, loading: false, error: null })
      })
      .catch((error: unknown) => {
        if (!active) return
        setState({
          module: null,
          loading: false,
          error: error instanceof Error ? error : new Error(\`Failed to load remote shell "\${remoteName}"\`),
        })
      })

    return () => {
      active = false
    }
  }, [entry, remoteName])

  return state
}

export function RemoteShellPage({ state, shellServices }: RemoteShellPageProps) {
  const { module, loading, error } = state

  if (error) {
    return <div className='rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive'>{error.message}</div>
  }

  if (loading || !module) {
    return <RemoteFallback />
  }

  const Component = module.default

  return (
    <Suspense fallback={<RemoteFallback />}>
      <Component shellServices={shellServices} />
    </Suspense>
  )
}

export function RemoteShellMenu({ state, shellServices }: { state: RemoteShellState; shellServices?: ShellHostServices }) {
  const { module, loading, error } = state

  if (error || loading || !module?.Menu) return null

  const Component = module.Menu

  return (
    <Suspense fallback={<RemoteMenuFallback />}>
      <Component shellServices={shellServices} />
    </Suspense>
  )
}

function RemoteFallback() {
  return <div className='p-4 text-sm text-muted-foreground'>Loading module...</div>
}

function RemoteMenuFallback() {
  return <div className='px-3 py-2 text-sm text-muted-foreground'>Loading menu...</div>
}
`
}

module.exports = { buildRemoteShellTsx }
