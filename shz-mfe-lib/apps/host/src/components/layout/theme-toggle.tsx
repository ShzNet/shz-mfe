import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          {resolvedTheme === 'dark' ? (
            <Moon className='size-5' />
          ) : (
            <Sun className='size-5' />
          )}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')} data-active={theme === 'light'} className='gap-2'>
          <Sun className='size-4' />
          Light
          {theme === 'light' && <span className='ml-auto text-xs text-muted-foreground'>✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} data-active={theme === 'dark'} className='gap-2'>
          <Moon className='size-4' />
          Dark
          {theme === 'dark' && <span className='ml-auto text-xs text-muted-foreground'>✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} data-active={theme === 'system'} className='gap-2'>
          <Monitor className='size-4' />
          System
          {theme === 'system' && <span className='ml-auto text-xs text-muted-foreground'>✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
