function buildAppHeaderTsx(options) {
  return `import { Badge, Separator, SidebarTrigger } from '${options.componentsPackage}'
import { HeaderActions } from '../components/header-actions'
import type { AppDefinition, AuthState } from '../types'

type AppHeaderProps = {
  app: AppDefinition
  auth: AuthState
  onSignOut: () => void
}

export function AppHeader({ app, auth, onSignOut }: AppHeaderProps) {
  return (
    <header className='relative z-10 flex h-16 items-center gap-3 border-b bg-sidebar px-4 shadow-md shadow-black/15'>
      <SidebarTrigger />
      <Separator orientation='vertical' className='h-4' />
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{app.name}</p>
      </div>
      <Badge variant='secondary' className='hidden sm:inline-flex'>
        {auth.email}
      </Badge>
      <HeaderActions auth={auth} onSignOut={onSignOut} />
    </header>
  )
}
`
}

module.exports = { buildAppHeaderTsx }
