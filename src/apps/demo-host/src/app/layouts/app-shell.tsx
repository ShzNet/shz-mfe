import {
  Button,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@shznet/components'
import { Link } from 'react-router-dom'
import { RemoteShellMenu, RemoteShellPage, useRemoteShell } from '../components/remote-shell'
import type { AppDefinition } from '../types'

type AppShellProps = {
  app: AppDefinition
}

export function AppShell({ app }: AppShellProps) {
  const remoteShell = useRemoteShell(app.remoteName, app.entry)

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible='icon'>
        <SidebarHeader className='p-4'>
          <div>
            <p className='text-sm font-semibold'>{app.name}</p>
            <p className='text-xs text-muted-foreground'>{app.remoteName}</p>
          </div>
        </SidebarHeader>
        <SidebarContent className='p-2'>
          <RemoteShellMenu state={remoteShell} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className='flex h-14 items-center gap-3 border-b px-4'>
          <SidebarTrigger />
          <Separator orientation='vertical' className='h-4' />
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-medium'>{app.name}</p>
            <p className='truncate text-xs text-muted-foreground'>{app.basePath}</p>
          </div>
          <Button asChild variant='outline' size='sm'>
            <Link to='/'>Back to home</Link>
          </Button>
        </header>
        <main className='flex min-h-0 flex-1 flex-col p-4 md:p-6'>
          <RemoteShellPage state={remoteShell} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
