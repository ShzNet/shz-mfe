import { useLocation } from 'react-router-dom'
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarRail,
} from '@/components/ui/sidebar'
import { useLayout } from '@/context/layout-provider'
import { type AppModule } from '@/hooks/use-remote-routes'
import { TeamSwitcher } from './team-switcher'
import { RemoteSidebarMenu } from './remote-sidebar-menu'
import { useRemoteShellMenu } from '@/mf/remote-shell'

export function AppSidebar({ apps }: { apps: AppModule[] }) {
  const { collapsible, variant } = useLayout()
  const { pathname } = useLocation()

  const activeApp = apps.find(
    (app) => pathname === app.basePath || pathname.startsWith(`${app.basePath}/`)
  )
  const shellMenu = useRemoteShellMenu(activeApp?.remoteName ?? '')

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher apps={apps} />
      </SidebarHeader>
      <SidebarContent>
        {activeApp && (
          <>
            {shellMenu.error && (
              <div className='px-3 py-2 text-sm text-destructive'>
                {shellMenu.error.message}
              </div>
            )}
            {shellMenu.menu && <RemoteSidebarMenu app={activeApp} menu={shellMenu.menu} />}
          </>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
