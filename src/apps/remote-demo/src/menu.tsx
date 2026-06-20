import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@shznet/components'

const BASE = '/app/demo'

const menuItems = [
  { title: 'Overview', path: '', icon: LayoutDashboard, group: 'General' },
] as const

export default function RemoteDemoMenu() {
  const { pathname } = useLocation()
  const groups = Array.from(new Set(menuItems.map((item) => item.group)))

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group}>
          <SidebarGroupLabel>{group}</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.filter((item) => item.group === group).map((item) => {
              const href = item.path ? `${BASE}/${item.path}` : BASE
              const isActive = item.path ? pathname === href || pathname.startsWith(`${href}/`) : pathname === href
              const Icon = item.icon

              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link to={href}>
                      <Icon />
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
