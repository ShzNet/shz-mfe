import { useState } from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New user registered',
    description: 'user@example.com just signed up.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'Dashboard report ready',
    description: 'Monthly analytics report has been generated.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: '3',
    title: 'System update',
    description: 'Maintenance scheduled for Sunday 2:00 AM.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: '4',
    title: 'New module deployed',
    description: 'remote-users v1.2.0 is now live.',
    time: 'Yesterday',
    read: true,
  },
]

export function HeaderNotification() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='size-5' />
          {unreadCount > 0 && (
            <span className='absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className='sr-only'>Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-80 p-0' sideOffset={8}>
        <div className='flex items-center justify-between px-4 py-3'>
          <div>
            <p className='text-sm font-semibold'>Notifications</p>
            {unreadCount > 0 && (
              <p className='text-xs text-muted-foreground'>{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className='text-xs text-primary hover:underline'
            >
              Mark all read
            </button>
          )}
        </div>

        <Separator />

        <ScrollArea className='max-h-80'>
          {notifications.length === 0 ? (
            <p className='py-8 text-center text-sm text-muted-foreground'>
              No notifications
            </p>
          ) : (
            <div>
              {notifications.map((n, i) => (
                <div key={n.id}>
                  <button
                    onClick={() => markRead(n.id)}
                    className={cn(
                      'flex w-full gap-3 px-4 py-3 text-start transition-colors hover:bg-muted/50',
                      !n.read && 'bg-muted/20'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-1.5 size-2 shrink-0 rounded-full',
                        n.read ? 'bg-transparent' : 'bg-primary'
                      )}
                    />
                    <div className='min-w-0 flex-1'>
                      <p className={cn('text-sm', !n.read && 'font-medium')}>
                        {n.title}
                      </p>
                      <p className='truncate text-xs text-muted-foreground'>
                        {n.description}
                      </p>
                      <p className='mt-0.5 text-xs text-muted-foreground/70'>
                        {n.time}
                      </p>
                    </div>
                  </button>
                  {i < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator />
        <div className='p-2'>
          <button className='w-full rounded-md py-1.5 text-center text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors'>
            View all notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
