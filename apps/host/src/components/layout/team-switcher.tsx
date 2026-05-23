import { ChevronsUpDown, LayoutDashboard, Users } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { type AppModule } from '@/hooks/use-remote-routes'

const ICON_MAP: Record<string, React.ElementType> = { LayoutDashboard, Users }

export function TeamSwitcher({ apps }: { apps: AppModule[] }) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const activeApp = apps.find((app) => app.routes.some((r) => pathname.startsWith(r.path)))

  const display = activeApp ?? null
  const DisplayIcon = display ? ICON_MAP[display.icon] : null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                {DisplayIcon ? <DisplayIcon className='size-4' /> : <span className='text-xs font-bold'>?</span>}
              </div>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>{display?.name ?? 'Chọn module'}</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {display ? 'Đang hoạt động' : 'Chưa chọn'}
                </span>
              </div>
              <ChevronsUpDown className='ms-auto' />
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
              const Icon = ICON_MAP[app.icon]
              const isActive = activeApp?.id === app.id
              return (
                <DropdownMenuItem
                  key={app.id}
                  onClick={() => navigate(app.routes[0]?.path ?? '/')}
                  className='gap-2 p-2'
                  data-active={isActive}
                >
                  <div className='flex size-6 items-center justify-center rounded-sm border data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground' data-active={isActive}>
                    {Icon && <Icon className='size-4 shrink-0' />}
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
