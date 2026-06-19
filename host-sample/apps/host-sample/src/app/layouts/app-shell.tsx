import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarRail } from '@shz/components'
import { useNavigate } from 'react-router-dom'
import { RemoteShellPage, useRemoteShellMenu } from '../components/remote-shell'
import { AppHeader } from './app-header'
import { AppSidebarNav } from './app-sidebar-nav'
import { RemoteSidebarMenu } from './remote-sidebar-menu'
import type { AppDefinition, AuthState } from '../types'

type AppShellProps = {
  app: AppDefinition
  auth: AuthState
  onSignOut: () => void
}

export function AppShell({ app, auth, onSignOut }: AppShellProps) {
  const navigate = useNavigate()
  const shellMenu = useRemoteShellMenu(app.remoteName, app.entry)

  function handleSignOut() {
    onSignOut()
    navigate('/sign-in', { replace: true })
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <AppSidebarNav app={app} />
        </SidebarHeader>
        <SidebarContent>
          {shellMenu.error && <div className='px-3 py-2 text-sm text-destructive'>{shellMenu.error.message}</div>}
          {shellMenu.menu && <RemoteSidebarMenu app={app} menu={shellMenu.menu} />}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <AppHeader app={app} auth={auth} onSignOut={handleSignOut} />
        <main className='flex min-h-0 flex-1 flex-col'>
          <RemoteShellPage remoteName={app.remoteName} entry={app.entry} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
