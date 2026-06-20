import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@shz/components'
import menu from './menu'

const BASE = '/app/demo'
const iconMap = {
  LayoutDashboard,
} as const

export default function RemoteDemoNav() {
  const { pathname } = useLocation()
  const groups = Array.from(new Set(menu.nav.map((item) => item.group)))

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group}>
          <SidebarGroupLabel>{group}</SidebarGroupLabel>
          <SidebarMenu>
            {menu.nav.filter((item) => item.group === group).map((item) => {
              const href = item.path ? `${BASE}/${item.path}` : BASE
              const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard
              const isActive = item.path ? pathname === href || pathname.startsWith(`${href}/`) : pathname === href

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
