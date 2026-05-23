import { LayoutDashboard, Users, ShieldCheck, CheckSquare, Settings, BarChart3, FileText, FolderKanban, MessageSquare, CalendarDays } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarRail,
} from '@/components/ui/sidebar'
import { useLayout } from '@/context/layout-provider'
import { type AppModule, type RemoteRouteConfig } from '@/hooks/use-remote-routes'
import { type NavGroup } from './types'
import { NavGroup as NavGroupComponent } from './nav-group'
import { TeamSwitcher } from './team-switcher'

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Users, ShieldCheck, CheckSquare, Settings,
  BarChart3, FileText, FolderKanban, MessageSquare, CalendarDays,
}

function buildNavGroups(routes: RemoteRouteConfig[]): NavGroup[] {
  const groupMap: Record<string, NavGroup> = {}
  for (const route of routes) {
    const title = route.nav.group
    if (!groupMap[title]) groupMap[title] = { title, items: [] }
    groupMap[title].items.push({
      title: route.nav.title,
      url: route.path,
      icon: ICON_MAP[route.nav.icon],
    })
  }
  return Object.values(groupMap)
}

export function AppSidebar({ apps }: { apps: AppModule[] }) {
  const { collapsible, variant } = useLayout()
  const { pathname } = useLocation()

  const activeApp = apps.find((app) => pathname === app.basePath || pathname.startsWith(`${app.basePath}/`))
  const navGroups = activeApp ? buildNavGroups(activeApp.routes) : []

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher apps={apps} />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroupComponent key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
