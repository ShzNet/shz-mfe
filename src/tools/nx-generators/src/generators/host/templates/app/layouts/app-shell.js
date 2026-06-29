function buildAppShellTsx(options) {
  return `import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarRail } from '${options.componentsPackage}'
import { useNavigate } from 'react-router-dom'
import { RemoteShellMenu, RemoteShellPage, useRemoteShell } from '../components/remote-shell'
import { createHostShellServices } from '../lib/host-services'
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
  const remoteShell = useRemoteShell(app.remoteName, app.entry)

  function handleSignOut() {
    onSignOut()
    navigate('/sign-in', { replace: true })
  }

  const shellServices = createHostShellServices(auth, app, handleSignOut)

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <AppSidebarNav app={app} />
        </SidebarHeader>
        <SidebarContent>
          {remoteShell.error && <div className='px-3 py-2 text-sm text-destructive'>{remoteShell.error.message}</div>}
          <RemoteShellMenu state={remoteShell} shellServices={shellServices} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <AppHeader app={app} auth={auth} onSignOut={handleSignOut} />
        <main className='flex min-h-0 flex-1 flex-col p-4 md:p-6'>
          <RemoteShellPage state={remoteShell} shellServices={shellServices} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
`
}

module.exports = { buildAppShellTsx }
