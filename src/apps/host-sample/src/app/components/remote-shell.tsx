import { type ComponentType, Suspense, useEffect, useState } from 'react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@shznet/components'
import type { ShellRemoteComponentProps } from '@shznet/core'
import type { HostShellServices } from '../lib/host-services'
import { loadRemoteModule } from '../lib/remote-loader'

type RemoteShellProps = ShellRemoteComponentProps<unknown, HostShellServices>
type RemoteMenuProps = ShellRemoteComponentProps<unknown, HostShellServices>

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
  shellServices?: HostShellServices
}

const shellModuleCache = new Map<string, RemoteShellModule>()
const shellPromiseCache = new Map<string, Promise<RemoteShellModule>>()

async function loadShellModule(remoteName: string, entry: string) {
  const cacheKey = `${remoteName}::${entry}`
  if (shellModuleCache.has(cacheKey)) return shellModuleCache.get(cacheKey)!

  if (!shellPromiseCache.has(cacheKey)) {
    shellPromiseCache.set(
      cacheKey,
      loadRemoteModule<RemoteShellModule>(remoteName, './Shell', entry)
        .then((mod) => {
          if (!mod?.default) throw new Error(`Remote shell "${remoteName}" has no default export`)
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

export function preloadRemoteShell(remoteName: string, entry: string): Promise<RemoteShellModule> {
  return loadShellModule(remoteName, entry)
}

export function useRemoteShell(remoteName: string, entry: string): RemoteShellState {
  const cacheKey = `${remoteName}::${entry}`
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
          error: error instanceof Error ? error : new Error(`Failed to load remote shell "${remoteName}"`),
        })
      })

    return () => { active = false }
  }, [entry, remoteName])

  return state
}

export function RemoteShellPage({ state, shellServices }: RemoteShellPageProps) {
  const { module, loading, error } = state

  if (error) {
    return <div className='rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive'>{error.message}</div>
  }

  if (loading || !module) {
    return <RemotePageSkeleton />
  }

  const Component = module.default

  return (
    <Suspense fallback={<RemotePageSkeleton />}>
      <Component shellServices={shellServices} />
    </Suspense>
  )
}

export function RemoteShellMenu({ state, shellServices }: { state: RemoteShellState; shellServices?: HostShellServices }) {
  const { module, loading, error } = state

  if (error) return null

  if (loading) return <RemoteMenuSkeleton />

  if (!module?.Menu) return null

  const Component = module.Menu

  return (
    <Suspense fallback={<RemoteMenuSkeleton />}>
      <Component shellServices={shellServices} />
    </Suspense>
  )
}

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-foreground/10 ${className}`} />
}

export function RemotePageSkeleton() {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='space-y-2'>
        <Pulse className='h-7 w-44' />
        <Pulse className='h-4 w-72' />
      </div>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className='rounded-xl border bg-card p-6 space-y-3'>
            <div className='flex items-center justify-between'>
              <Pulse className='h-4 w-20' />
              <Pulse className='size-4' />
            </div>
            <Pulse className='h-8 w-28' />
            <Pulse className='h-4 w-36' />
          </div>
        ))}
      </div>
      <div className='rounded-xl border bg-card p-6 space-y-3'>
        <Pulse className='h-5 w-32' />
        <Pulse className='h-4 w-56' />
        <div className='space-y-2 pt-2'>
          {Array.from({ length: 3 }, (_, i) => (
            <Pulse key={i} className='h-12 w-full rounded-lg' />
          ))}
        </div>
      </div>
    </div>
  )
}

export function RemoteMenuSkeleton() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({ length: 5 }, (_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
