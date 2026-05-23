import { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  DataTable,
  DateInput,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type ColumnDef,
} from '@shz/components'
import { Pencil, Plus, Trash2 } from 'lucide-react'

type Role = 'admin' | 'editor' | 'viewer'
type Status = 'active' | 'inactive' | 'pending'

interface UserRow {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  team: string
  joined: string
}

type UserForm = Omit<UserRow, 'id'>

const INITIAL_USERS: UserRow[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', team: 'Platform', joined: '2024-01-10' },
  { id: '2', name: 'Bob Martinez', email: 'bob@example.com', role: 'editor', status: 'active', team: 'Design', joined: '2024-02-15' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'viewer', status: 'pending', team: 'Product', joined: '2024-03-22' },
  { id: '4', name: 'David Chen', email: 'david@example.com', role: 'editor', status: 'inactive', team: 'Platform', joined: '2024-04-05' },
  { id: '5', name: 'Eva Park', email: 'eva@example.com', role: 'viewer', status: 'active', team: 'Marketing', joined: '2024-05-18' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', role: 'admin', status: 'active', team: 'Security', joined: '2024-06-01' },
  { id: '7', name: 'Grace Kim', email: 'grace@example.com', role: 'editor', status: 'active', team: 'Design', joined: '2024-06-15' },
  { id: '8', name: 'Henry Brown', email: 'henry@example.com', role: 'viewer', status: 'pending', team: 'Operations', joined: '2024-06-20' },
  { id: '9', name: 'Iris Wu', email: 'iris@example.com', role: 'viewer', status: 'active', team: 'Support', joined: '2024-07-01' },
  { id: '10', name: 'Jason Tran', email: 'jason@example.com', role: 'editor', status: 'inactive', team: 'Product', joined: '2024-07-03' },
  { id: '11', name: 'Kelly Nguyen', email: 'kelly@example.com', role: 'admin', status: 'active', team: 'Platform', joined: '2024-07-10' },
  { id: '12', name: 'Liam Pham', email: 'liam@example.com', role: 'viewer', status: 'active', team: 'Marketing', joined: '2024-07-14' },
  { id: '13', name: 'Mia Hoang', email: 'mia@example.com', role: 'editor', status: 'pending', team: 'Design', joined: '2024-07-20' },
  { id: '14', name: 'Noah Do', email: 'noah@example.com', role: 'viewer', status: 'active', team: 'Analytics', joined: '2024-08-01' },
  { id: '15', name: 'Olivia Le', email: 'olivia@example.com', role: 'admin', status: 'active', team: 'Security', joined: '2024-08-05' },
  { id: '16', name: 'Peter Vu', email: 'peter@example.com', role: 'editor', status: 'inactive', team: 'Platform', joined: '2024-08-10' },
  { id: '17', name: 'Quinn Mai', email: 'quinn@example.com', role: 'viewer', status: 'active', team: 'Operations', joined: '2024-08-14' },
  { id: '18', name: 'Ryan Bui', email: 'ryan@example.com', role: 'editor', status: 'active', team: 'Support', joined: '2024-08-18' },
  { id: '19', name: 'Sophia Tran', email: 'sophia@example.com', role: 'viewer', status: 'pending', team: 'Product', joined: '2024-08-21' },
  { id: '20', name: 'Thomas Phan', email: 'thomas@example.com', role: 'admin', status: 'active', team: 'Analytics', joined: '2024-08-25' },
]

const EMPTY_FORM: UserForm = {
  name: '',
  email: '',
  role: 'viewer',
  status: 'active',
  team: '',
  joined: '',
}

const roleVariant: Record<Role, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  editor: 'secondary',
  viewer: 'outline',
}

export default function UsersTablePage() {
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UserForm>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)

  function startCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setOpen(true)
  }

  function startEdit(user: UserRow) {
    setEditingId(user.id)
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      team: user.team,
      joined: user.joined,
    })
    setOpen(true)
  }

  function saveUser() {
    if (!form.name.trim() || !form.email.trim()) return

    if (editingId) {
      setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...form } : u)))
    } else {
      const id = String(Date.now())
      setUsers((prev) => [{ id, ...form }, ...prev])
    }
    setOpen(false)
  }

  function deleteUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    setDeleteTarget(null)
  }

  const columns: ColumnDef<UserRow>[] = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='pl-2'>
          <Checkbox
            aria-label='Select all rows'
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? 'indeterminate'
                  : false
            }
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
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='pl-2'>
          <p className='font-medium'>{row.original.name}</p>
          <p className='text-xs text-muted-foreground'>{row.original.email}</p>
        </div>
      ),
    },
    { accessorKey: 'team', header: 'Team' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <Badge variant={roleVariant[row.original.role]} className='capitalize'>{row.original.role}</Badge>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge variant='outline' className='capitalize'>{row.original.status}</Badge>,
    },
    { accessorKey: 'joined', header: 'Joined' },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          <Button variant='ghost' size='sm' className='h-8 px-2' onClick={() => startEdit(row.original)}>
            <Pencil className='size-3.5' />
          </Button>
          <Button variant='ghost' size='sm' className='h-8 px-2 text-destructive hover:text-destructive' onClick={() => setDeleteTarget(row.original)}>
            <Trash2 className='size-3.5' />
          </Button>
        </div>
      ),
    },
  ], [])

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Users Table</h1>
          <p className='text-sm text-muted-foreground'>User management with full CRUD + header sort/filter.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size='sm' className='gap-1.5' onClick={startCreate}>
              <Plus className='size-4' />
              New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit User' : 'Create User'}</DialogTitle>
            </DialogHeader>
            <div className='grid gap-3'>
              <div className='grid gap-1.5'>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder='Full name' />
              </div>
              <div className='grid gap-1.5'>
                <Label>Email</Label>
                <Input type='email' value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder='Email' />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='grid gap-1.5'>
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v as Role }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='admin'>Admin</SelectItem>
                      <SelectItem value='editor'>Editor</SelectItem>
                      <SelectItem value='viewer'>Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-1.5'>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as Status }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                      <SelectItem value='pending'>Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='grid gap-1.5'>
                  <Label>Team</Label>
                  <Input value={form.team} onChange={(e) => setForm((p) => ({ ...p, team: e.target.value }))} placeholder='Team' />
                </div>
                <div className='grid gap-1.5'>
                  <Label>Joined Date</Label>
                  <DateInput value={form.joined} onChange={(e) => setForm((p) => ({ ...p, joined: e.target.value }))} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={saveUser}>{editingId ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Directory</CardTitle>
          <CardDescription>Open each column header menu to sort/filter. Total: {users.length} users.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchColumn='name'
            searchPlaceholder='Search name/email...'
            pageSize={10}
            headerMenu
            headerFilterConfig={{
              name: { type: 'text', placeholder: 'Filter name...' },
              team: { type: 'text', placeholder: 'Filter team...' },
              role: {
                type: 'select',
                allLabel: 'All roles',
                options: [
                  { label: 'Admin', value: 'admin' },
                  { label: 'Editor', value: 'editor' },
                  { label: 'Viewer', value: 'viewer' },
                ],
              },
              status: {
                type: 'select',
                allLabel: 'All status',
                options: [
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                  { label: 'Pending', value: 'pending' },
                ],
              },
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null) }}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            {deleteTarget
              ? `Are you sure you want to delete ${deleteTarget.name}? This action cannot be undone.`
              : 'Are you sure you want to delete this user?'}
          </p>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant='destructive'
              onClick={() => { if (deleteTarget) deleteUser(deleteTarget.id) }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
