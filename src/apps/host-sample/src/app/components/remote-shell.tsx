import type { ComponentType } from 'react'
import { Suspense, useEffect, useState } from 'react'
import {
  Skeleton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@shznet/components'
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
    return <RemotePageSkeleton />
  }

  const Component = module.default

  return (
    <Suspense fallback={<RemotePageSkeleton />}>
      <Component />
    </Suspense>
  )
}

export function RemoteShellMenu({ state }: { state: RemoteShellState }) {
  const { module, loading, error } = state

  if (error) return null

  if (loading) {
    return <RemoteMenuSkeleton />
  }

  if (!module?.Menu) return null

  const Component = module.Menu

  return (
    <Suspense fallback={<RemoteMenuSkeleton />}>
      <Component />
    </Suspense>
  )
}

function RemotePageSkeleton() {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='space-y-2'>
        <Skeleton className='h-7 w-44' />
        <Skeleton className='h-4 w-72' />
      </div>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className='rounded-xl border bg-card p-6 space-y-3'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='size-4 rounded' />
            </div>
            <Skeleton className='h-8 w-28' />
            <Skeleton className='h-4 w-36' />
          </div>
        ))}
      </div>
      <div className='rounded-xl border bg-card p-6 space-y-3'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-4 w-56' />
        <div className='space-y-2 pt-2'>
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className='h-12 w-full rounded-lg' />
          ))}
        </div>
      </div>
    </div>
  )
}

function RemoteMenuSkeleton() {
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
