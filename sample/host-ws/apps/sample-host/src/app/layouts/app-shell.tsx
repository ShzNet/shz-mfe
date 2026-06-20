import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@shznet/components'
import { PermissionOverlay } from '../components/app-loading-overlay'
import { RemoteMenuSkeleton, RemotePageSkeleton, RemoteShellMenu, RemoteShellPage, useRemoteShell } from '../components/remote-shell'
import { permissionCache } from '../lib/app-nav'
import { checkPermission } from '../lib/app-permission'
import { AppHeader } from './app-header'
import { AppSidebarNav } from './app-sidebar-nav'
import type { AppDefinition, AuthState } from '../types'

type AppShellProps = {
  app: AppDefinition
  auth: AuthState
  onSignOut: () => void
}

// ─── Inner shell — mounts only after permission clears ────────────────────────

function AppShellInner({ app, auth, onSignOut }: AppShellProps) {
  const navigate = useNavigate()
  const remoteShell = useRemoteShell(app.remoteName, app.entry)

  // Guarantee the skeleton is visible for at least 800 ms even when the
  // module was preloaded and arrives from cache immediately.
  const [minDelay, setMinDelay] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setMinDelay(true), 800)
    return () => clearTimeout(id)
  }, [])

  const isLoading = !minDelay || remoteShell.loading

  function handleSignOut() {
    onSignOut()
    navigate('/sign-in', { replace: true })
  }

  if (remoteShell.error) {
    return (
      <div className='flex min-h-svh items-center justify-center'>
        <p className='text-sm text-destructive'>{remoteShell.error.message}</p>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <AppSidebarNav app={app} />
        </SidebarHeader>
        <SidebarContent>
          {isLoading ? <RemoteMenuSkeleton /> : <RemoteShellMenu state={remoteShell} />}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <AppHeader app={app} auth={auth} onSignOut={handleSignOut} />
        <main className='flex min-h-0 flex-1 flex-col p-4 md:p-6'>
          {isLoading ? <RemotePageSkeleton /> : <RemoteShellPage state={remoteShell} />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

// ─── Public entry point ───────────────────────────────────────────────────────
//
// When entering via navigateToApp(), permission is already checked + cached,
// so this component skips straight to AppShellInner.
// When entering directly (typing the URL), it calls checkPermission() itself
// and renders PermissionOverlay on top of an empty page.

export function AppShell({ app, auth, onSignOut }: AppShellProps) {
  const navigate = useNavigate()
  const [permission, setPermission] = useState<'checking' | 'allowed' | 'denied'>(() =>
    permissionCache.has(app.id) ? 'allowed' : 'checking'
  )

  useEffect(() => {
    if (permission !== 'checking') return
    let active = true
    checkPermission(app.id)
      .then((ok) => {
        if (!active) return
        if (ok) {
          permissionCache.add(app.id)
          setPermission('allowed')
        } else {
          setPermission('denied')
        }
      })
      .catch(() => { if (active) setPermission('denied') })
    return () => { active = false }
  }, [app.id, permission])

  if (permission === 'checking') {
    return <PermissionOverlay app={app} denied={false} onBack={() => navigate('/')} />
  }
  if (permission === 'denied') {
    return <PermissionOverlay app={app} denied onBack={() => navigate('/')} />
  }

  return <AppShellInner app={app} auth={auth} onSignOut={onSignOut} />
}
