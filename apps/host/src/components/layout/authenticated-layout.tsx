import { Outlet } from 'react-router-dom'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { HeaderUser } from '@/components/layout/header-user'
import { HeaderNotification } from '@/components/layout/header-notification'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { type AppModule } from '@/hooks/use-remote-routes'

const HEADER_USER = {
  name: 'Admin',
  email: 'admin@shz-mfe.dev',
  avatar: '',
}

export function AuthenticatedLayout({ apps }: { apps: AppModule[] }) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  return (
    <LayoutProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar apps={apps} />
        <SidebarInset
          className={cn(
            '@container/content',
            'has-data-[layout=fixed]:h-svh',
            'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
          )}
        >
          <Header fixed>
            <div className='ml-auto flex items-center gap-1'>
              <ThemeToggle />
              <HeaderNotification />
              <HeaderUser user={HEADER_USER} />
            </div>
          </Header>
          <main className='flex min-h-0 flex-1 flex-col px-4 pb-4 md:px-6 md:pb-6'>
            <div className='mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col'>
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </LayoutProvider>
  )
}
