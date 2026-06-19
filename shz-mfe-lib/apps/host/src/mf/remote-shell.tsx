import { Suspense, useEffect, useEffectEvent, useMemo, useState, useSyncExternalStore } from 'react'
import { loadRemote } from '@module-federation/enhanced/runtime'
import {
  clearShellRemoteContext,
  setShellRemoteContext,
  type ShellMenuConfig,
  type ShellRemoteModuleMeta,
  type ShellRemoteShellModule,
} from '@shz/core'

interface RemoteShellState {
  module: ShellRemoteShellModule | null
  loading: boolean
  error: Error | null
}

interface RemoteShellPageProps<TContextData = unknown> {
  remoteName: string
  remote?: Partial<ShellRemoteModuleMeta>
  contextData?: TContextData
}

const shellModuleCache = new Map<string, ShellRemoteShellModule>()
const shellPromiseCache = new Map<string, Promise<ShellRemoteShellModule>>()
const remoteMenuStore = new Map<string, ShellMenuConfig | null>()
const remoteMenuListeners = new Map<string, Set<() => void>>()

function buildShellModuleId(remoteName: string) {
  return `${remoteName}/Shell`
}

function getStoredRemoteMenu(remoteName: string) {
  return remoteMenuStore.get(remoteName) ?? null
}

function notifyRemoteMenu(remoteName: string) {
  remoteMenuListeners.get(remoteName)?.forEach((listener) => listener())
}

function setStoredRemoteMenu(remoteName: string, menu: ShellMenuConfig) {
  remoteMenuStore.set(remoteName, menu)
  notifyRemoteMenu(remoteName)
}

function ensureRemoteMenuInitialized(remoteName: string, mod: ShellRemoteShellModule) {
  if (remoteMenuStore.has(remoteName)) return
  const initialMenu = mod.getInitialMenu?.()
  if (initialMenu) {
    remoteMenuStore.set(remoteName, initialMenu)
  } else {
    remoteMenuStore.set(remoteName, null)
  }
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

async function loadRemoteShellModule(remoteName: string) {
  if (shellModuleCache.has(remoteName)) return shellModuleCache.get(remoteName)!

  if (!shellPromiseCache.has(remoteName)) {
    const moduleId = buildShellModuleId(remoteName)
    shellPromiseCache.set(
      remoteName,
      loadRemote<ShellRemoteShellModule>(moduleId)
        .then((mod) => {
          if (!mod?.default) throw new Error(`Remote shell "${moduleId}" has no default export`)
          shellModuleCache.set(remoteName, mod)
          ensureRemoteMenuInitialized(remoteName, mod)
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

export function useRemoteShellModule(remoteName: string): RemoteShellState {
  const [state, setState] = useState<RemoteShellState>(() => {
    const mod = shellModuleCache.get(remoteName) ?? null
    return { module: mod, loading: Boolean(remoteName) && !mod, error: null }
  })

  useEffect(() => {
    if (!remoteName) {
      setState({ module: null, loading: false, error: null })
      return
    }

    let active = true

    loadRemoteShellModule(remoteName)
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
  }, [remoteName])

  return state
}

export function useRemoteShellMenu(remoteName: string) {
  const state = useRemoteShellModule(remoteName)

  useEffect(() => {
    if (state.module) ensureRemoteMenuInitialized(remoteName, state.module)
  }, [remoteName, state.module])

  const menu = useSyncExternalStore(
    (listener) => subscribeRemoteMenu(remoteName, listener),
    () => getStoredRemoteMenu(remoteName),
    () => getStoredRemoteMenu(remoteName)
  )

  return { ...state, menu }
}

export function RemoteShellPage<TContextData = unknown>({
  remoteName,
  remote,
  contextData,
}: RemoteShellPageProps<TContextData>) {
  const { module, loading, error } = useRemoteShellModule(remoteName)

  const shellContext = useMemo(
    () => ({
      remote: { ...remote, remoteName },
      exposedModule: './Shell',
      data: contextData as TContextData,
    }),
    [contextData, remote, remoteName]
  )

  setShellRemoteContext(shellContext)

  useEffect(() => {
    return () => {
      clearShellRemoteContext(remoteName, './Shell')
    }
  }, [remoteName, shellContext])

  const onMenuChange = useEffectEvent((menu: ShellMenuConfig) => {
    setStoredRemoteMenu(remoteName, menu)
  })

  if (error) return <ModuleError error={error} />

  if (loading || !module) return <ModuleLoading />

  const Component = module.default

  return (
    <Suspense fallback={<ModuleLoading />}>
      <Component shellContext={shellContext} onMenuChange={onMenuChange} />
    </Suspense>
  )
}

function ModuleLoading() {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm'>
      <div className='relative flex size-16 items-center justify-center'>
        <div className='absolute size-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary' />
        <div className='size-8 rounded-full bg-primary/10' />
      </div>
      <p className='text-sm font-medium text-muted-foreground'>Loading module...</p>
    </div>
  )
}

function ModuleError({ error }: { error: Error }) {
  return (
    <div className='flex h-full min-h-64 items-center justify-center p-6'>
      <div className='text-center'>
        <p className='font-medium text-destructive'>Failed to load module</p>
        <p className='mt-1 text-sm text-muted-foreground'>{error.message}</p>
      </div>
    </div>
  )
}
