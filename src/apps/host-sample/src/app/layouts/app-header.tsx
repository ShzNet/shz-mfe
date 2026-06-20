import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarTrigger,
} from '@shznet/components'
import { Link, useLocation } from 'react-router-dom'
import { HeaderActions } from '../components/header-actions'
import type { AppDefinition, AuthState } from '../types'

type AppHeaderProps = {
  app: AppDefinition
  auth: AuthState
  onSignOut: () => void
}

export function AppHeader({ app, auth, onSignOut }: AppHeaderProps) {
  const { pathname } = useLocation()
  const relativePath = pathname.startsWith(app.basePath) ? pathname.slice(app.basePath.length) : ''
  const segments = relativePath.split('/').filter(Boolean)
  const currentPage = segments.length ? formatBreadcrumbLabel(segments[segments.length - 1]) : null

  return (
    <header className='relative z-10 flex h-16 items-center gap-3 border-b bg-sidebar px-4 shadow-md shadow-black/15'>
      <SidebarTrigger />
      <Separator orientation='vertical' className='h-4' />
      <div className='min-w-0 flex-1'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to='/'>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {currentPage ? (
                <BreadcrumbLink asChild>
                  <Link to={app.basePath}>{app.name}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{app.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {currentPage ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Badge variant='secondary' className='hidden sm:inline-flex'>
        {auth.email}
      </Badge>
      <HeaderActions auth={auth} onSignOut={onSignOut} />
    </header>
  )
}

function formatBreadcrumbLabel(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
