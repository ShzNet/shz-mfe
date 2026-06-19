import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@shz/components'
import { Search, UserPlus, MoreHorizontal, ShieldCheck, ShieldOff } from 'lucide-react'

type Role = 'admin' | 'editor' | 'viewer'
type Status = 'active' | 'inactive' | 'pending'

interface User {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  joined: string
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', joined: '2024-01-10' },
  { id: '2', name: 'Bob Martinez', email: 'bob@example.com', role: 'editor', status: 'active', joined: '2024-02-15' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'viewer', status: 'pending', joined: '2024-03-22' },
  { id: '4', name: 'David Chen', email: 'david@example.com', role: 'editor', status: 'active', joined: '2024-04-05' },
  { id: '5', name: 'Eva Park', email: 'eva@example.com', role: 'viewer', status: 'inactive', joined: '2024-05-18' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', role: 'admin', status: 'active', joined: '2024-06-01' },
  { id: '7', name: 'Grace Kim', email: 'grace@example.com', role: 'editor', status: 'active', joined: '2024-07-14' },
  { id: '8', name: 'Henry Brown', email: 'henry@example.com', role: 'viewer', status: 'pending', joined: '2024-08-30' },
]

const ROLE_VARIANT: Record<Role, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  editor: 'secondary',
  viewer: 'outline',
}

const STATUS_CLASSES: Record<Status, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  inactive: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Users</h1>
          <p className='text-sm text-muted-foreground'>Manage user accounts and permissions.</p>
        </div>
        <Button size='sm' className='gap-1.5'>
          <UserPlus className='size-4' />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</CardDescription>
            </div>
            <div className='relative'>
              <Search className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search users…'
                className='h-9 w-56 rounded-md border bg-transparent pl-8 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/40'>
                  <th className='px-4 py-3 text-left font-medium text-muted-foreground'>User</th>
                  <th className='px-4 py-3 text-left font-medium text-muted-foreground'>Role</th>
                  <th className='px-4 py-3 text-left font-medium text-muted-foreground'>Status</th>
                  <th className='px-4 py-3 text-left font-medium text-muted-foreground'>Joined</th>
                  <th className='px-4 py-3 text-right font-medium text-muted-foreground'></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className='border-b transition-colors hover:bg-muted/30 last:border-0'>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium'>
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className='font-medium leading-none'>{user.name}</p>
                          <p className='mt-0.5 text-xs text-muted-foreground'>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <Badge variant={ROLE_VARIANT[user.role]} className='capitalize'>
                        {user.role === 'admin' && <ShieldCheck className='mr-1 size-3' />}
                        {user.role === 'viewer' && <ShieldOff className='mr-1 size-3' />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className='px-4 py-3'>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_CLASSES[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-muted-foreground tabular-nums'>{user.joined}</td>
                    <td className='px-4 py-3 text-right'>
                      <button className='rounded-md p-1 hover:bg-muted'>
                        <MoreHorizontal className='size-4 text-muted-foreground' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
