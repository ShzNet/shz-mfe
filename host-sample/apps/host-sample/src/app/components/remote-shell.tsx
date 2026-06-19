import type { ComponentType } from 'react'
import { Suspense, useEffect, useEffectEvent, useMemo, useState, useSyncExternalStore } from 'react'
import type { ShellMenuConfig } from '@shz/core'
import { loadRemoteModule } from '../lib/remote-loader'

type RemoteShellProps = {
  onMenuChange?: (menu: ShellMenuConfig) => void
}

type RemoteShellModule = {
  default: ComponentType<RemoteShellProps>
  getInitialMenu?: () => ShellMenuConfig
}

type RemoteShellState = {
  module: RemoteShellModule | null
  loading: boolean
  error: Error | null
}

type RemoteShellPageProps = {
  remoteName: string
  entry: string
}

const shellModuleCache = new Map<string, RemoteShellModule>()
const shellPromiseCache = new Map<string, Promise<RemoteShellModule>>()
const remoteMenuStore = new Map<string, ShellMenuConfig | null>()
const remoteMenuListeners = new Map<string, Set<() => void>>()

function getRemoteMenu(remoteName: string) {
  return remoteMenuStore.get(remoteName) ?? null
}

function subscribeRemoteMenu(remoteName: string, listener: () => void) {
  const listeners = remoteMenuListeners.get(remoteName) ?? new Set<() => void>()
  listeners.add(listener)
  remoteMenuListeners.set(remoteName, listeners)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) remoteMenuListeners.delete(remoteName)
  }
}

function notifyRemoteMenu(remoteName: string) {
  remoteMenuListeners.get(remoteName)?.forEach((listener) => listener())
}

function ensureInitialMenu(remoteName: string, mod: RemoteShellModule) {
  if (remoteMenuStore.has(remoteName)) return
  remoteMenuStore.set(remoteName, mod.getInitialMenu?.() ?? null)
}

function setRemoteMenu(remoteName: string, menu: ShellMenuConfig) {
  remoteMenuStore.set(remoteName, menu)
  notifyRemoteMenu(remoteName)
}

async function loadShellModule(remoteName: string, entry: string) {
  if (shellModuleCache.has(remoteName)) return shellModuleCache.get(remoteName)!

  if (!shellPromiseCache.has(remoteName)) {
    shellPromiseCache.set(
      remoteName,
      loadRemoteModule<RemoteShellModule>(remoteName, './Shell', entry)
        .then((mod) => {
          if (!mod?.default) throw new Error(`Remote shell "${remoteName}" has no default export`)
          shellModuleCache.set(remoteName, mod)
          ensureInitialMenu(remoteName, mod)
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

export function useRemoteShellMenu(remoteName: string, entry: string) {
  const state = useRemoteShellModule(remoteName, entry)

  useEffect(() => {
    if (state.module) ensureInitialMenu(remoteName, state.module)
  }, [remoteName, state.module])

  const menu = useSyncExternalStore(
    (listener) => subscribeRemoteMenu(remoteName, listener),
    () => getRemoteMenu(remoteName),
    () => getRemoteMenu(remoteName)
  )

  return { ...state, menu }
}

export function RemoteShellPage({ remoteName, entry }: RemoteShellPageProps) {
  const { module, loading, error } = useRemoteShellModule(remoteName, entry)
  const onMenuChange = useEffectEvent((menu: ShellMenuConfig) => {
    setRemoteMenu(remoteName, menu)
  })

  const shellProps = useMemo<RemoteShellProps>(
    () => ({ onMenuChange }),
    [onMenuChange]
  )

  if (error) {
    return <div className='p-6 text-sm text-destructive'>{error.message}</div>
  }

  if (loading || !module) {
    return <RemoteFallback />
  }

  const Component = module.default

  return (
    <Suspense fallback={<RemoteFallback />}>
      <Component {...shellProps} />
    </Suspense>
  )
}

function RemoteFallback() {
  return <div className='p-6 text-sm text-muted-foreground'>Loading module...</div>
}
