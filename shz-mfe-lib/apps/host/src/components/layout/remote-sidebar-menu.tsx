import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Database,
  FileText,
  FolderKanban,
  GitBranch,
  FormInput,
  LayoutDashboard,
  Layers,
  MessageSquare,
  Navigation,
  Package,
  Settings,
  ShoppingCart,
  Table2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { type ShellMenuConfig } from '@shz/core'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { type AppModule } from '@/hooks/use-remote-routes'

const ICON_MAP = {
  BarChart3,
  Bell,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Database,
  FileText,
  FolderKanban,
  FormInput,
  GitBranch,
  LayoutDashboard,
  Layers,
  MessageSquare,
  Navigation,
  Package,
  Settings,
  ShoppingCart,
  Table2,
  TrendingUp,
  Users,
} as const

function buildMenuGroups(app: AppModule, menu: ShellMenuConfig) {
  const groups = new Map<string, Array<(typeof menu.nav)[number] & { url: string }>>()

  for (const item of menu.nav) {
    const url = item.path ? `${app.basePath}/${item.path.replace(/^\/+/, '')}` : app.basePath
    const groupItems = groups.get(item.group) ?? []
    groupItems.push({ ...item, url })
    groups.set(item.group, groupItems)
  }

  return [...groups.entries()].map(([title, items]) => ({ title, items }))
}

export function RemoteSidebarMenu({ app, menu }: { app: AppModule; menu: ShellMenuConfig }) {
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()
  const groups = buildMenuGroups(app, menu)

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP]
              const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)

              return (
                <SidebarMenuItem key={`${group.title}-${item.title}-${item.url}`}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                    <Link to={item.url} onClick={() => setOpenMobile(false)}>
                      {Icon && <Icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
