import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@shz/components'
import { ChevronsUpDown, PlugZap } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apps } from '../../remotes'
import type { AppDefinition } from '../types'

type AppSidebarNavProps = {
  app: AppDefinition
}

export function AppSidebarNav({ app }: AppSidebarNavProps) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeApp = apps.find((item) => pathname === item.basePath || pathname.startsWith(`${item.basePath}/`)) ?? app

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              variant='outline'
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!'
            >
              <div className='flex size-8 items-center justify-center rounded-lg border bg-primary/10 text-primary'>
                <PlugZap className='size-4' />
              </div>
              <div className='grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden'>
                <span className='truncate font-semibold'>{activeApp.name}</span>
                <span className='truncate text-xs text-muted-foreground'>App selector</span>
              </div>
              <ChevronsUpDown className='ms-auto group-data-[collapsible=icon]:hidden' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>Applications</DropdownMenuLabel>
            {apps.map((item) => {
              const isActive = item.id === activeApp.id
              return (
                <DropdownMenuItem key={item.id} onClick={() => navigate(item.basePath)} className='gap-2 p-2'>
                  <div className='flex size-7 items-center justify-center rounded-md border bg-primary/10 text-primary'>
                    <PlugZap className='size-4' />
                  </div>
                  <span className={isActive ? 'font-medium' : ''}>{item.name}</span>
                  {isActive && <span className='ms-auto text-xs text-muted-foreground'>active</span>}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2 text-muted-foreground' onClick={() => navigate('/')}>
              Back to home
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
