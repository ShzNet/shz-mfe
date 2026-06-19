import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, FolderKanban, CheckSquare, Users,
  Table2, FileText, MessageSquare, GitBranch, LayoutGrid, CalendarDays,
  Settings, Package, FormInput, BarChart3, Layers, Navigation, Bell, ShoppingCart,
  ClipboardList, Database, ChevronDown,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from '@shz/components'

const BASE = '/app/admin'

interface NavItemDef {
  title: string
  path: string
  icon: LucideIcon
  group: string
  devOnly?: boolean
}

const ALL_ITEMS: NavItemDef[] = [
  { title: 'Dashboard', path: '', icon: LayoutDashboard, group: 'General' },
  { title: 'Analytics', path: '/analytics', icon: TrendingUp, group: 'General' },

  { title: 'Projects', path: '/projects', icon: FolderKanban, group: 'Management' },
  { title: 'Tasks', path: '/tasks', icon: CheckSquare, group: 'Management' },
  { title: 'Users', path: '/users', icon: Users, group: 'Management' },
  { title: 'Users Table', path: '/users-table', icon: Table2, group: 'Management' },
  { title: 'Orders Table', path: '/orders-table', icon: ShoppingCart, group: 'Management' },
  { title: 'Reports', path: '/reports', icon: FileText, group: 'Management' },
  { title: 'Messages', path: '/messages', icon: MessageSquare, group: 'Management' },

  { title: 'Tree Explorer', path: '/tree', icon: GitBranch, group: 'Tools' },
  { title: 'Kanban DnD', path: '/kanban', icon: LayoutGrid, group: 'Tools' },
  { title: 'Calendar', path: '/calendar', icon: CalendarDays, group: 'Tools' },
  { title: 'Settings', path: '/settings', icon: Settings, group: 'Tools' },

  // devOnly items — hidden by default, toggled by the remote's own button
  { title: 'Catalog', path: '/shadcn/catalog', icon: Package, group: 'Components', devOnly: true },
  { title: 'Inputs', path: '/shadcn/inputs', icon: FormInput, group: 'Components', devOnly: true },
  { title: 'Data Display', path: '/shadcn/data-display', icon: BarChart3, group: 'Components', devOnly: true },
  { title: 'Overlays', path: '/shadcn/overlays', icon: Layers, group: 'Components', devOnly: true },
  { title: 'Navigation', path: '/shadcn/navigation', icon: Navigation, group: 'Components', devOnly: true },
  { title: 'Feedback', path: '/shadcn/feedback', icon: Bell, group: 'Components', devOnly: true },
  { title: 'UI Forms', path: '/ui-forms', icon: ClipboardList, group: 'Components', devOnly: true },
  { title: 'UI Data', path: '/ui-data', icon: Database, group: 'Components', devOnly: true },
]

function buildGroups(items: NavItemDef[]) {
  const map: Record<string, { title: string; items: Array<NavItemDef & { fullPath: string }> }> = {}
  for (const item of items) {
    if (!map[item.group]) map[item.group] = { title: item.group, items: [] }
    const fullPath = item.path ? `${BASE}/${item.path.replace(/^\/+/, '')}` : BASE
    map[item.group].items.push({ ...item, fullPath })
  }
  return Object.values(map)
}

// Mirrors SidebarMenuButton's default variant styles (size default = h-8)
const LINK_CLASS =
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 h-8 text-sm text-start outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>svg]:size-4 [&>svg]:shrink-0 [&>span:last-child]:truncate data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground'

export default function AdminNav() {
  // Logic is entirely inside the remote — host has no knowledge of this state
  const [showDev, setShowDev] = useState(false)
  const { pathname } = useLocation()

  const visibleItems = ALL_ITEMS.filter((item) => !item.devOnly || showDev)
  const groups = buildGroups(visibleItems)

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map(({ title, fullPath, icon: Icon }) => {
              const isActive = pathname === fullPath || pathname.startsWith(`${fullPath}/`)
              return (
                <SidebarMenuItem key={title}>
                  <Link to={fullPath} data-active={isActive} className={LINK_CLASS}>
                    <Icon />
                    <span>{title}</span>
                  </Link>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}

      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <button
              onClick={() => setShowDev((v) => !v)}
              className={cn(LINK_CLASS, 'text-muted-foreground hover:text-sidebar-foreground')}
            >
              <ChevronDown className={cn('transition-transform duration-200', showDev && 'rotate-180')} />
              <span>{showDev ? 'Ẩn dev components' : 'Hiện dev components'}</span>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
