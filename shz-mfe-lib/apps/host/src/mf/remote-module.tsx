import { Suspense, lazy, useMemo, ComponentType, useState, useEffect } from 'react'
import { loadRemote } from '@module-federation/enhanced/runtime'
import {
  clearShellRemoteContext,
  setShellRemoteContext,
  type ShellRemoteComponentProps,
  type ShellRemoteContextValue,
  type ShellRemoteModuleMeta,
} from '@shz/core'

interface RemoteModuleProps<TContextData = unknown> {
  remoteName: string
  exposedModule: string
  remote?: Partial<ShellRemoteModuleMeta>
  contextData?: TContextData
}

const moduleCache = new Map<string, ComponentType>()

function buildModuleId(remoteName: string, exposedModule: string) {
  return `${remoteName}${exposedModule.replace(/^\./, '')}`
}

function createLazy(moduleId: string): ComponentType {
  const LazyComp = lazy(() =>
    loadRemote<{ default: ComponentType<ShellRemoteComponentProps> }>(moduleId).then((m) => {
      if (!m?.default) throw new Error(`Remote module "${moduleId}" has no default export`)
      return { default: m.default }
    })
  )
  return LazyComp as unknown as ComponentType
}

export function RemoteModule<TContextData = unknown>({
  remoteName,
  exposedModule,
  remote,
  contextData,
}: RemoteModuleProps<TContextData>) {
  const moduleId = buildModuleId(remoteName, exposedModule)

  // Version key increments on HMR update to force Suspense remount
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!import.meta.webpackHot) return
    import.meta.webpackHot.accept([], () => {
      moduleCache.delete(moduleId)
      setVersion((v) => v + 1)
    })
  }, [moduleId])

  const Component = useMemo(() => {
    if (!moduleCache.has(moduleId)) {
      moduleCache.set(moduleId, createLazy(moduleId))
    }
    return moduleCache.get(moduleId)!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, version]) as ComponentType<ShellRemoteComponentProps<TContextData>>

  const shellContext = useMemo<ShellRemoteContextValue<TContextData>>(
    () => ({
      remote: { ...remote, remoteName },
      exposedModule,
      data: contextData as TContextData,
    }),
    [contextData, exposedModule, remote, remoteName]
  )

  setShellRemoteContext(shellContext)

  useEffect(() => () => {
    clearShellRemoteContext(remoteName, exposedModule)
  }, [exposedModule, remoteName])

  return (
    <Suspense fallback={<ModuleLoading />}>
      <Component shellContext={shellContext} />
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
