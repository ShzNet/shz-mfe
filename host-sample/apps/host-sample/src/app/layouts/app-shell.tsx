import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarRail } from '@shz/components'
import { useNavigate } from 'react-router-dom'
import { RemoteModule } from '../components/remote-module'
import { AppHeader } from './app-header'
import { AppSidebarNav } from './app-sidebar-nav'
import type { AppDefinition, AuthState } from '../types'

type AppShellProps = {
  app: AppDefinition
  auth: AuthState
  onSignOut: () => void
}

export function AppShell({ app, auth, onSignOut }: AppShellProps) {
  const navigate = useNavigate()

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
          <RemoteModule remoteName={app.remoteName} exposedModule='./Nav' entry={app.entry} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <AppHeader app={app} auth={auth} onSignOut={handleSignOut} />
        <main className='flex min-h-0 flex-1 flex-col'>
          <RemoteModule remoteName={app.remoteName} exposedModule='./Page' entry={app.entry} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
