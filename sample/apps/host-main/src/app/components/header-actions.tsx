import { HeaderNotification } from './header-notification'
import { HeaderUser } from './header-user'
import { ThemeToggle } from './theme-toggle'
import type { AuthState } from '../types'

type HeaderActionsProps = {
  auth: AuthState
  onSignOut: () => void
}

export function HeaderActions({ auth, onSignOut }: HeaderActionsProps) {
  return (
    <div className='ml-auto flex items-center gap-1'>
      <ThemeToggle />
      <HeaderNotification />
      <HeaderUser auth={auth} onSignOut={onSignOut} />
    </div>
  )
}
