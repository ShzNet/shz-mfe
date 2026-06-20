import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarRail, Skeleton } from '@shznet/components'
import { ShieldOff } from 'lucide-react'
import { RemoteShellMenu, RemoteShellPage, useRemoteShell } from '../components/remote-shell'
import { AppHeader } from './app-header'
import { AppSidebarNav } from './app-sidebar-nav'
import type { AppDefinition, AuthState } from '../types'

type AppShellProps = {
  app: AppDefinition
  auth: AuthState
  onSignOut: () => void
}

type AccessState =
  | { status: 'checking' }
  | { status: 'allowed' }
  | { status: 'denied' }

function useModuleAccess(canOpen: AppDefinition['canOpen']): AccessState {
  const [access, setAccess] = useState<AccessState>(() =>
    canOpen ? { status: 'checking' } : { status: 'allowed' }
  )

  useEffect(() => {
    if (!canOpen) return
    let active = true
    canOpen()
      .then((ok) => {
        if (!active) return
        setAccess(ok ? { status: 'allowed' } : { status: 'denied' })
      })
      .catch(() => {
        if (!active) return
        setAccess({ status: 'denied' })
      })
    return () => {
      active = false
    }
  }, [canOpen])

  return access
}

function AccessCheckingScreen({ app }: { app: AppDefinition }) {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-4 bg-muted/30'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <div className='relative flex size-16 items-center justify-center'>
          <div className='absolute inset-0 animate-spin rounded-full border-4 border-muted border-t-primary' />
          <div className='size-8 rounded-full bg-primary/10' />
        </div>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>Checking access to {app.name}</p>
          <p className='text-xs text-muted-foreground'>Verifying your permissions...</p>
        </div>
        <div className='space-y-2 w-48 pt-2'>
          <Skeleton className='h-2 w-full rounded-full' />
          <Skeleton className='h-2 w-3/4 rounded-full mx-auto' />
        </div>
      </div>
    </div>
  )
}

function AccessDeniedScreen({ app, onBack }: { app: AppDefinition; onBack: () => void }) {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-4 bg-muted/30'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <div className='flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
          <ShieldOff className='size-6' />
        </div>
        <div className='space-y-1'>
          <p className='text-lg font-semibold'>Access denied</p>
          <p className='text-sm text-muted-foreground'>
            You don&apos;t have permission to open <span className='font-medium'>{app.name}</span>.
          </p>
        </div>
        <Button variant='outline' size='sm' onClick={onBack}>
          Back to home
        </Button>
      </div>
    </div>
  )
}

export function AppShell({ app, auth, onSignOut }: AppShellProps) {
  const navigate = useNavigate()
  const access = useModuleAccess(app.canOpen)
  const remoteShell = useRemoteShell(app.remoteName, app.entry)

  function handleSignOut() {
    onSignOut()
    navigate('/sign-in', { replace: true })
  }

  if (access.status === 'checking') {
    return <AccessCheckingScreen app={app} />
  }

  if (access.status === 'denied') {
    return <AccessDeniedScreen app={app} onBack={() => navigate('/')} />
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <AppSidebarNav app={app} />
        </SidebarHeader>
        <SidebarContent>
          {remoteShell.error && <div className='px-3 py-2 text-sm text-destructive'>{remoteShell.error.message}</div>}
          <RemoteShellMenu state={remoteShell} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <AppHeader app={app} auth={auth} onSignOut={handleSignOut} />
        <main className='flex min-h-0 flex-1 flex-col p-4 md:p-6'>
          <RemoteShellPage state={remoteShell} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
