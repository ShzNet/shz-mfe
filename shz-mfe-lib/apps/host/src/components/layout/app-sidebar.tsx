import { useLocation } from 'react-router-dom'
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarRail,
} from '@/components/ui/sidebar'
import { useLayout } from '@/context/layout-provider'
import { type AppModule } from '@/hooks/use-remote-routes'
import { useAuthStore } from '@/stores/auth-store'
import { TeamSwitcher } from './team-switcher'
import { RemoteModule } from '@/mf/remote-module'

export function AppSidebar({ apps }: { apps: AppModule[] }) {
  const { collapsible, variant } = useLayout()
  const { pathname } = useLocation()
  const { auth } = useAuthStore()

  const activeApp = apps.find(
    (app) => pathname === app.basePath || pathname.startsWith(`${app.basePath}/`)
  )

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher apps={apps} />
      </SidebarHeader>
      <SidebarContent>
        {activeApp && (
          <RemoteModule
            remoteName={activeApp.remoteName}
            exposedModule='./Nav'
            remote={activeApp}
            contextData={{ app: activeApp, auth }}
          />
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
