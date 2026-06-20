function buildHeaderUserTsx(options) {
  return `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '${options.componentsPackage}'
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { AuthState } from '../types'

type HeaderUserProps = {
  auth: AuthState
  onSignOut: () => void
}

export function HeaderUser({ auth, onSignOut }: HeaderUserProps) {
  const [signOutOpen, setSignOutOpen] = useState(false)
  const initials = auth.email.slice(0, 2).toUpperCase()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring'>
            <Avatar className='size-8'>
              <AvatarImage src='' alt={auth.email} />
              <AvatarFallback className='text-xs font-semibold'>{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-56 rounded-lg'>
          <DropdownMenuLabel className='p-0 font-normal'>
            <div className='flex items-center gap-2 px-1 py-1.5'>
              <Avatar className='size-8 rounded-lg'>
                <AvatarImage src='' alt={auth.email} />
                <AvatarFallback className='rounded-lg text-xs'>{initials}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>{auth.email.split('@')[0]}</span>
                <span className='truncate text-xs text-muted-foreground'>{auth.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles className='size-4' />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck className='size-4' />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className='size-4' />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className='size-4' />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setSignOutOpen(true)}>
            <LogOut className='size-4' />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Sign out</DialogTitle>
            <DialogDescription>Are you sure you want to sign out?</DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <Button variant='outline' onClick={() => setSignOutOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={onSignOut}>
              Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
`
}

module.exports = { buildHeaderUserTsx }
