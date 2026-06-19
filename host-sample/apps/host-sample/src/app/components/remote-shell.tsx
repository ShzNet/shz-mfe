import type { ComponentType } from 'react'
import { Suspense, useEffect, useState } from 'react'
import { loadRemoteModule } from '../lib/remote-loader'

type RemoteShellProps = Record<string, never>
type RemoteMenuProps = Record<string, never>

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
}

const shellModuleCache = new Map<string, RemoteShellModule>()
const shellPromiseCache = new Map<string, Promise<RemoteShellModule>>()

async function loadShellModule(remoteName: string, entry: string) {
  if (shellModuleCache.has(remoteName)) return shellModuleCache.get(remoteName)!

  if (!shellPromiseCache.has(remoteName)) {
    shellPromiseCache.set(
      remoteName,
      loadRemoteModule<RemoteShellModule>(remoteName, './Shell', entry)
        .then((mod) => {
          if (!mod?.default) throw new Error(`Remote shell "${remoteName}" has no default export`)
          shellModuleCache.set(remoteName, mod)
          return mod
        })
        .catch((error) => {
          shellPromiseCache.delete(remoteName)
          throw error
        })
    )
  }

  return shellPromiseCache.get(remoteName)!
}

function useRemoteShellModule(remoteName: string, entry: string): RemoteShellState {
  const [state, setState] = useState<RemoteShellState>(() => {
    const mod = shellModuleCache.get(remoteName) ?? null
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
          error: error instanceof Error ? error : new Error(`Failed to load remote shell "${remoteName}"`),
        })
      })

    return () => {
      active = false
    }
  }, [entry, remoteName])

  return state
}

export function useRemoteShell(remoteName: string, entry: string) {
  return useRemoteShellModule(remoteName, entry)
}

export function RemoteShellPage({ state }: RemoteShellPageProps) {
  const { module, loading, error } = state

  if (error) {
    return <div className='p-6 text-sm text-destructive'>{error.message}</div>
  }

  if (loading || !module) {
    return <RemoteFallback />
  }

  const Component = module.default

  return (
    <Suspense fallback={<RemoteFallback />}>
      <Component />
    </Suspense>
  )
}

export function RemoteShellMenu({ state }: { state: RemoteShellState }) {
  const { module, loading, error } = state

  if (error || loading || !module?.Menu) return null

  const Component = module.Menu

  return (
    <Suspense fallback={<RemoteMenuFallback />}>
      <Component />
    </Suspense>
  )
}

function RemoteFallback() {
  return <div className='p-6 text-sm text-muted-foreground'>Loading module...</div>
}

function RemoteMenuFallback() {
  return <div className='px-3 py-2 text-sm text-muted-foreground'>Loading menu...</div>
}
