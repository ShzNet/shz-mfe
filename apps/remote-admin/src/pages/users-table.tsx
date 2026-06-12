import { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type ColumnFiltersState,
  type ColumnDef,
  type VisibilityState,
} from '@shz/components'
import { Columns3, Filter, Plus, RotateCcw, Search } from 'lucide-react'

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
type FilterValue<T extends string> = T | 'all'

interface UserFilters {
  keyword: string
  role: FilterValue<Role>
  status: FilterValue<Status>
  team: string
}

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

const DEFAULT_FILTERS: UserFilters = {
  keyword: '',
  role: 'all',
  status: 'all',
  team: '',
}

const MANAGEABLE_COLUMNS = [
  { id: 'name', label: 'Name' },
  { id: 'team', label: 'Team' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'joined', label: 'Joined' },
] as const

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
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<UserFilters>(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState<UserFilters>(DEFAULT_FILTERS)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [draftColumnVisibility, setDraftColumnVisibility] = useState<VisibilityState>({})

  useEffect(() => {
    if (filtersOpen) {
      setDraftFilters(appliedFilters)
    }
  }, [filtersOpen, appliedFilters])

  useEffect(() => {
    if (columnsOpen) {
      setDraftColumnVisibility(columnVisibility)
    }
  }, [columnsOpen, columnVisibility])

  function startCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
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

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []

    if (appliedFilters.keyword.trim()) {
      filters.push({ id: 'name', value: appliedFilters.keyword.trim() })
    }
    if (appliedFilters.role !== 'all') {
      filters.push({ id: 'role', value: appliedFilters.role })
    }
    if (appliedFilters.status !== 'all') {
      filters.push({ id: 'status', value: appliedFilters.status })
    }
    if (appliedFilters.team.trim()) {
      filters.push({ id: 'team', value: appliedFilters.team.trim() })
    }

    return filters
  }, [appliedFilters])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (appliedFilters.keyword.trim()) count += 1
    if (appliedFilters.role !== 'all') count += 1
    if (appliedFilters.status !== 'all') count += 1
    if (appliedFilters.team.trim()) count += 1
    return count
  }, [appliedFilters])

  const visibleColumnCount = useMemo(
    () => MANAGEABLE_COLUMNS.filter((column) => isColumnVisible(columnVisibility, column.id)).length,
    [columnVisibility],
  )

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
      id: 'name',
      accessorFn: (row) => `${row.name} ${row.email}`,
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
  ], [])

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-4'>
      <AcitonBar>
        <div className='flex flex-wrap items-center gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='gap-1.5' onClick={startCreate}>
                <Plus className='size-4' />
                New
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
      </AcitonBar>

      <div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-background shadow-sm'>
        <div className='border-b px-3 py-2'>
          <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end'>
            {activeFilterCount > 0 && (
              <Button variant='ghost' size='sm' className='gap-1.5 lg:order-1' onClick={() => setAppliedFilters(DEFAULT_FILTERS)}>
                <RotateCcw className='size-4' />
                Reset filters
              </Button>
            )}
            <Button variant='ghost' size='sm' className='gap-1.5 lg:order-2' onClick={() => setColumnsOpen(true)}>
              <Columns3 className='size-4' />
              Edit columns
              <span className='text-muted-foreground'>{visibleColumnCount}/{MANAGEABLE_COLUMNS.length}</span>
            </Button>
            <Button variant='ghost' size='sm' className='gap-1.5 lg:order-3' onClick={() => setFiltersOpen(true)}>
              <Filter className='size-4' />
              Edit filters
              {activeFilterCount > 0 && <span className='rounded-sm bg-muted px-1.5 py-0.5 text-xs'>{activeFilterCount}</span>}
            </Button>
            <div className='relative w-full lg:order-4 lg:w-72'>
              <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                value={appliedFilters.keyword}
                onChange={(e) => setAppliedFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                placeholder='Filter by keyword'
                className='pl-9'
              />
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={users}
          pageSize={10}
          columnFilters={columnFilters}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          showToolbar={false}
          className='min-h-0 flex-1 space-y-0'
        />
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side='right' className='w-full gap-0 p-0 sm:max-w-xl'>
          <SheetHeader className='border-b px-6 py-5'>
            <SheetTitle>Edit filters</SheetTitle>
            <SheetDescription>Apply field-level filters to narrow the list view like Dynamics 365.</SheetDescription>
          </SheetHeader>

          <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
            <div className='grid gap-2'>
              <Label>Keyword</Label>
              <Input
                value={draftFilters.keyword}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                placeholder='Search by name or email'
              />
            </div>

            <div className='grid gap-2'>
              <Label>Role</Label>
              <Select
                value={draftFilters.role}
                onValueChange={(value) => setDraftFilters((prev) => ({ ...prev, role: value as FilterValue<Role> }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All roles</SelectItem>
                  <SelectItem value='admin'>Admin</SelectItem>
                  <SelectItem value='editor'>Editor</SelectItem>
                  <SelectItem value='viewer'>Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-2'>
              <Label>Status</Label>
              <Select
                value={draftFilters.status}
                onValueChange={(value) => setDraftFilters((prev) => ({ ...prev, status: value as FilterValue<Status> }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All status</SelectItem>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-2'>
              <Label>Team</Label>
              <Input
                value={draftFilters.team}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, team: e.target.value }))}
                placeholder='Filter team'
              />
            </div>
          </div>

          <SheetFooter className='border-t px-6 py-4 sm:flex-row sm:justify-between'>
            <Button variant='ghost' onClick={() => setDraftFilters(DEFAULT_FILTERS)}>
              Reset to default
            </Button>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setFiltersOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setAppliedFilters(draftFilters)
                  setFiltersOpen(false)
                }}
              >
                Apply
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={columnsOpen} onOpenChange={setColumnsOpen}>
        <SheetContent side='right' className='w-full gap-0 p-0 sm:max-w-lg'>
          <SheetHeader className='border-b px-6 py-5'>
            <SheetTitle>Edit columns</SheetTitle>
            <SheetDescription>Choose which columns are visible in the grid.</SheetDescription>
          </SheetHeader>

          <div className='flex-1 space-y-3 overflow-y-auto px-6 py-5'>
            {MANAGEABLE_COLUMNS.map((column) => (
              <label
                key={column.id}
                className='flex cursor-pointer items-center justify-between rounded-md border px-3 py-3 transition-colors hover:bg-muted/40'
              >
                <div>
                  <p className='font-medium'>{column.label}</p>
                  <p className='text-xs text-muted-foreground'>Show this column in the table view.</p>
                </div>
                <Checkbox
                  checked={isColumnVisible(draftColumnVisibility, column.id)}
                  onCheckedChange={(checked) => {
                    setDraftColumnVisibility((prev) => setColumnVisible(prev, column.id, !!checked))
                  }}
                />
              </label>
            ))}
          </div>

          <SheetFooter className='border-t px-6 py-4 sm:flex-row sm:justify-between'>
            <Button variant='ghost' onClick={() => setDraftColumnVisibility({})}>
              Reset to default
            </Button>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setColumnsOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setColumnVisibility(draftColumnVisibility)
                  setColumnsOpen(false)
                }}
              >
                Apply
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function AcitonBar({ children }: { children: React.ReactNode }) {
  return (
    <div className='rounded-lg border bg-background px-3 py-2 shadow-sm'>
      {children}
    </div>
  )
}

function isColumnVisible(state: VisibilityState, columnId: string) {
  return state[columnId] !== false
}

function setColumnVisible(state: VisibilityState, columnId: string, visible: boolean): VisibilityState {
  const next = { ...state }
  if (visible) {
    delete next[columnId]
  } else {
    next[columnId] = false
  }
  return next
}
