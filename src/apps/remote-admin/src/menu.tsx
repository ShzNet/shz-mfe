import './styles.css'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, type LucideIcon } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@shznet/components'

const BASE = '/app/admin'

type RemoteAdminMenuItem = {
  title: string
  path: string
  icon: LucideIcon
  group: string
  disabled?: boolean
  hidden?: boolean
  end?: boolean
}

const menuItems: RemoteAdminMenuItem[] = [
  { title: 'Overview', path: '', icon: LayoutDashboard, group: 'General', end: true },
  { title: 'Users', path: 'users', icon: Users, group: 'Management' },
]

function buildGroups() {
  const groups = new Map<string, Array<RemoteAdminMenuItem & { url: string }>>()

  for (const item of menuItems) {
    if (item.hidden) continue
    const url = item.path ? `${BASE}/${item.path.replace(/^\/+/, '')}` : BASE
    const groupItems = groups.get(item.group) ?? []
    groupItems.push({ ...item, url })
    groups.set(item.group, groupItems)
  }

  return [...groups.entries()].map(([title, items]) => ({ title, items }))
}

export default function RemoteAdminMenu() {
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()
  const groups = buildGroups()

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map(({ title, url, icon: Icon, disabled, end }) => {
              const isActive = end ? pathname === url : pathname === url || pathname.startsWith(`${url}/`)

              return (
                <SidebarMenuItem key={`${group.title}-${title}-${url}`}>
                  <SidebarMenuButton asChild tooltip={title} disabled={disabled} isActive={isActive}>
                    <NavLink
                      to={url}
                      onClick={() => setOpenMobile(false)}
                      className={disabled ? 'pointer-events-none opacity-50' : ''}
                    >
                      <Icon />
                      <span>{title}</span>
                    </NavLink>
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
