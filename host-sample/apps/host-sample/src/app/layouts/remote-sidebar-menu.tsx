import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import type { ShellMenuConfig } from '@shz/core'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@shz/components'
import type { AppDefinition } from '../types'

const ICON_MAP = {
  LayoutDashboard,
} as const

function buildGroups(app: AppDefinition, menu: ShellMenuConfig) {
  const groups = new Map<string, Array<(typeof menu.nav)[number] & { url: string }>>()

  for (const item of menu.nav) {
    const url = item.path ? `${app.basePath}/${item.path.replace(/^\/+/, '')}` : app.basePath
    const groupItems = groups.get(item.group) ?? []
    groupItems.push({ ...item, url })
    groups.set(item.group, groupItems)
  }

  return [...groups.entries()].map(([title, items]) => ({ title, items }))
}

export function RemoteSidebarMenu({ app, menu }: { app: AppDefinition; menu: ShellMenuConfig }) {
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()
  const groups = buildGroups(app, menu)

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
