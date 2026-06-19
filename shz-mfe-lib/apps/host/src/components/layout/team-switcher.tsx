import { ChevronsUpDown } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { type AppModule } from '@/hooks/use-remote-routes'

function ModuleLogo({ app, sizeClass }: { app: AppModule; sizeClass: string }) {
  const fallback = app.name.slice(0, 2).toUpperCase()
  return (
    <div className={`relative ${sizeClass} overflow-hidden rounded-sm border bg-sidebar-primary`}>
      <span className='absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-sidebar-primary-foreground'>
        {fallback}
      </span>
      {app.logoPng && (
        <img
          src={app.logoPng}
          alt={app.name}
          className='absolute inset-0 size-full object-cover'
          onError={(e) => { (e.currentTarget.style.display = 'none') }}
        />
      )}
    </div>
  )
}

export function TeamSwitcher({ apps }: { apps: AppModule[] }) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const activeApp = apps.find((app) => pathname === app.basePath || pathname.startsWith(`${app.basePath}/`))

  const display = activeApp ?? null

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
              {display ? <ModuleLogo app={display} sizeClass='size-8 rounded-lg' /> : <span className='text-xs font-bold'>?</span>}
              <div className='grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden'>
                <span className='truncate font-semibold'>{display?.name ?? 'Chọn module'}</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {display ? 'Đang hoạt động' : 'Chưa chọn'}
                </span>
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
            <DropdownMenuLabel className='text-xs text-muted-foreground'>Modules</DropdownMenuLabel>
            {apps.map((app) => {
              const isActive = activeApp?.id === app.id
              return (
                <DropdownMenuItem
                  key={app.id}
                  onClick={() => navigate(app.basePath)}
                  className='gap-2 p-2'
                  data-active={isActive}
                >
                  <div data-active={isActive} className='data-[active=true]:border-primary'>
                    <ModuleLogo app={app} sizeClass='size-6' />
                  </div>
                  <span className={isActive ? 'font-medium' : ''}>{app.name}</span>
                  {isActive && <span className='ms-auto text-xs text-muted-foreground'>active</span>}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='gap-2 p-2 text-muted-foreground'
              onClick={() => navigate('/')}
            >
              Về màn hình chính
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
