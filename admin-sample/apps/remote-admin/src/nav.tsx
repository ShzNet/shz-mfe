import './styles.css'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from '@shz/components'

const BASE = '/app/admin'

const LINK_CLASS =
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 h-8 text-sm text-start outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>svg]:size-4 [&>svg]:shrink-0 [&>span:last-child]:truncate data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground'

const ITEMS = [
  { title: 'Overview', path: BASE, icon: LayoutDashboard },
] as const

export default function RemoteAdminNav() {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {ITEMS.map(({ title, path, icon: Icon }) => (
          <SidebarMenuItem key={title}>
            <Link to={path} data-active={pathname === path || pathname.startsWith(`${path}/`)} className={LINK_CLASS}>
              <Icon />
              <span>{title}</span>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
