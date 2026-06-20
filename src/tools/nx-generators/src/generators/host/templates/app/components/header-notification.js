function buildHeaderNotificationTsx(options) {
  return `import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, ScrollArea, Separator } from '${options.componentsPackage}'
import { Bell } from 'lucide-react'
import { useState } from 'react'

const initialNotifications = [
  { id: '1', title: 'New user registered', description: 'user@example.com just signed up.', time: '2 min ago', read: false },
  { id: '2', title: 'Dashboard report ready', description: 'Monthly analytics report has been generated.', time: '1 hr ago', read: false },
  { id: '3', title: 'System update', description: 'Maintenance scheduled for Sunday 2:00 AM.', time: '3 hr ago', read: true },
]

export function HeaderNotification() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter((item) => !item.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

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
            {unreadCount > 0 && <p className='text-xs text-muted-foreground'>{unreadCount} unread</p>}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className='text-xs text-primary hover:underline'>
              Mark all read
            </button>
          )}
        </div>
        <Separator />
        <ScrollArea className='max-h-80'>
          <div>
            {notifications.map((item, index) => (
              <div key={item.id}>
                <button
                  onClick={() => markRead(item.id)}
                  className={\`flex w-full gap-3 px-4 py-3 text-start transition-colors hover:bg-muted/50 \${!item.read ? 'bg-muted/20' : ''}\`}
                >
                  <span className={\`mt-1.5 size-2 shrink-0 rounded-full \${item.read ? 'bg-transparent' : 'bg-primary'}\`} />
                  <div className='min-w-0 flex-1'>
                    <p className={\`text-sm \${!item.read ? 'font-medium' : ''}\`}>{item.title}</p>
                    <p className='truncate text-xs text-muted-foreground'>{item.description}</p>
                    <p className='mt-0.5 text-xs text-muted-foreground/70'>{item.time}</p>
                  </div>
                </button>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
`
}

module.exports = { buildHeaderNotificationTsx }
