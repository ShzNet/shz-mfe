import './styles.css'
import { NavLink, useLocation } from 'react-router-dom'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@shz/components'
import menuItems from './menu'

const BASE = '/app/crm'

function buildGroups() {
  const groups = new Map<string, Array<(typeof menuItems)[number] & { url: string }>>()

  for (const item of menuItems) {
    if (item.hidden) continue
    const url = item.path ? `${BASE}/${item.path.replace(/^/+/, '')}` : BASE
    const groupItems = groups.get(item.group) ?? []
    groupItems.push({ ...item, url })
    groups.set(item.group, groupItems)
  }

  return [...groups.entries()].map(([title, items]) => ({ title, items }))
}

export default function RemoteCrmNav() {
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
