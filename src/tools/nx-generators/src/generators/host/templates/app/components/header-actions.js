function buildHeaderActionsTsx(options) {
  return `import { HeaderNotification } from './header-notification'
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
`
}

function buildThemeToggleTsx(options) {
  return `import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '${options.componentsPackage}'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useThemeMode } from '../hooks/use-theme-mode'
import type { ThemeMode } from '../types'

const themeOptions: Array<{ label: string; value: ThemeMode; icon: typeof Sun }> = [
  { label: 'Light', value: 'light', icon: Sun },
  { label: 'Dark', value: 'dark', icon: Moon },
  { label: 'System', value: 'system', icon: Monitor },
]

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useThemeMode()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          {resolvedTheme === 'dark' ? <Moon className='size-5' /> : <Sun className='size-5' />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {themeOptions.map(({ label, value, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)} className='gap-2'>
            <Icon className='size-4' />
            {label}
            {theme === value && <span className='ml-auto text-xs text-muted-foreground'>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
`
}

module.exports = { buildHeaderActionsTsx, buildThemeToggleTsx }
