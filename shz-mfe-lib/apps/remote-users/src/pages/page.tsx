import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Badge, Avatar, AvatarFallback,
} from '@shz/components'
import { Search, UserPlus, MoreHorizontal } from 'lucide-react'

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', joined: '2024-02-20' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', joined: '2024-03-10' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active', joined: '2024-04-05' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'Viewer', status: 'Active', joined: '2024-05-18' },
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase()
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === 'Active' ? 'default' : 'secondary'} className='text-xs'>
      {status}
    </Badge>
  )
}

export default function UsersPage() {
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      {/* Page header */}
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Users</h1>
          <p className='text-muted-foreground text-sm'>
            Manage your team members and their roles.
          </p>
        </div>
        <Badge variant='secondary' className='text-xs'>
          remote_users · port 3002
        </Badge>
      </div>

      {/* Toolbar */}
      <div className='flex items-center gap-3'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <input
            className='flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring'
            placeholder='Search users...'
            readOnly
          />
        </div>
        <button className='inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow-xs hover:bg-primary/90 cursor-pointer'>
          <UserPlus className='size-4' />
          Add User
        </button>
      </div>

      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>{users.length} users total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b text-muted-foreground'>
                  <th className='text-left font-medium pb-3 pr-4'>User</th>
                  <th className='text-left font-medium pb-3 pr-4'>Role</th>
                  <th className='text-left font-medium pb-3 pr-4'>Status</th>
                  <th className='text-left font-medium pb-3 pr-4'>Joined</th>
                  <th className='text-right font-medium pb-3'></th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {users.map((user) => (
                  <tr key={user.id} className='hover:bg-muted/30 transition-colors'>
                    <td className='py-3 pr-4'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='size-8'>
                          <AvatarFallback className='text-xs'>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium leading-none'>{user.name}</p>
                          <p className='text-xs text-muted-foreground mt-0.5'>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className='py-3 pr-4 text-muted-foreground'>{user.role}</td>
                    <td className='py-3 pr-4'>
                      <StatusBadge status={user.status} />
                    </td>
                    <td className='py-3 pr-4 text-muted-foreground'>{user.joined}</td>
                    <td className='py-3 text-right'>
                      <button className='text-muted-foreground hover:text-foreground transition-colors p-1 rounded cursor-pointer'>
                        <MoreHorizontal className='size-4' />
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
