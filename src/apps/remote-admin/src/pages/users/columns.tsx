import { Badge, Checkbox, type ColumnDef } from '@shznet/components'
import type { Role, UserRow } from './types'

const roleVariant: Record<Role, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  editor: 'secondary',
  viewer: 'outline',
}

export function createUsersColumns(onEditUser: (user: UserRow) => void): ColumnDef<UserRow>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='pl-2'>
          <Checkbox
            aria-label='Select all rows'
            checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='pl-2'>
          <Checkbox
            aria-label='Select row'
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      enableHiding: false,
    },
    {
      id: 'name',
      accessorFn: (row) => `${row.name} ${row.email}`,
      header: 'Name',
      cell: ({ row }) => (
        <button type='button' className='pl-2 text-left' onClick={() => onEditUser(row.original)}>
          <p className='font-medium text-primary hover:underline'>{row.original.name}</p>
          <p className='text-xs text-muted-foreground'>{row.original.email}</p>
        </button>
      ),
    },
    { accessorKey: 'team', header: 'Team' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant={roleVariant[row.original.role]} className='capitalize'>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant='outline' className='capitalize'>
          {row.original.status}
        </Badge>
      ),
    },
    { accessorKey: 'joined', header: 'Joined' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'manager', header: 'Manager' },
    { accessorKey: 'employeeCode', header: 'Employee Code' },
    { accessorKey: 'phone', header: 'Phone' },
    {
      accessorKey: 'workMode',
      header: 'Work Mode',
      cell: ({ row }) => <span className='capitalize'>{row.original.workMode}</span>,
    },
    { accessorKey: 'timezone', header: 'Timezone' },
    { accessorKey: 'lastActive', header: 'Last Active' },
  ]
}
