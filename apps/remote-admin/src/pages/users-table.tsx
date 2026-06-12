import { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Checkbox,
  ColumnManager,
  type ColumnManagerItem,
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
  type ColumnOrderState,
  type ColumnDef,
  type RowSelectionState,
  type VisibilityState,
} from '@shz/components'
import { Columns3, Filter, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'

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
  location: string
  manager: string
  employeeCode: string
  phone: string
  workMode: 'onsite' | 'hybrid' | 'remote'
  timezone: string
  lastActive: string
}

type UserForm = Omit<UserRow, 'id'>
type FilterFieldId = 'team' | 'role' | 'status' | 'location' | 'manager' | 'workMode' | 'timezone' | 'joined'
type FilterFieldType = 'text' | 'select' | 'date'
type FilterOperator = 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'before' | 'after' | 'on'
type FilterGroupOperator = 'and' | 'or'

interface FilterRule {
  kind: 'rule'
  id: string
  field: FilterFieldId
  operator: FilterOperator
  value: string
}

interface FilterGroup {
  kind: 'group'
  id: string
  operator: FilterGroupOperator
  children: FilterNode[]
}

type FilterNode = FilterRule | FilterGroup

interface UserFilters {
  root: FilterGroup
}

interface FilterFieldDefinition {
  id: FilterFieldId
  label: string
  type: FilterFieldType
  options?: Array<{ label: string; value: string }>
}

const BASE_USERS: Array<Omit<UserRow, 'location' | 'manager' | 'employeeCode' | 'phone' | 'workMode' | 'timezone' | 'lastActive'>> = [
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

const LOCATIONS = ['HCMC', 'Hanoi', 'Da Nang', 'Singapore', 'Bangkok']
const MANAGERS = ['Emma Clark', 'Daniel Tran', 'Sophia Lee', 'Lucas Nguyen']
const WORK_MODES: UserRow['workMode'][] = ['hybrid', 'onsite', 'remote']
const TIMEZONES = ['GMT+7', 'GMT+8', 'GMT+9']

const INITIAL_USERS: UserRow[] = BASE_USERS.map((user, index) => ({
  ...user,
  location: LOCATIONS[index % LOCATIONS.length],
  manager: MANAGERS[index % MANAGERS.length],
  employeeCode: `EMP-${String(index + 1).padStart(4, '0')}`,
  phone: `090${String(1000000 + index * 137).slice(0, 7)}`,
  workMode: WORK_MODES[index % WORK_MODES.length],
  timezone: TIMEZONES[index % TIMEZONES.length],
  lastActive: `2026-06-${String((index % 9) + 1).padStart(2, '0')} 0${index % 8}:30`,
}))

const EMPTY_FORM: UserForm = {
  name: '',
  email: '',
  role: 'viewer',
  status: 'active',
  team: '',
  joined: '',
  location: '',
  manager: '',
  employeeCode: '',
  phone: '',
  workMode: 'hybrid',
  timezone: 'GMT+7',
  lastActive: '',
}

const DEFAULT_FILTERS: UserFilters = {
  root: createFilterGroup('and'),
}

const MANAGEABLE_COLUMNS: ColumnManagerItem[] = [
  { id: 'name', label: 'Name', locked: true },
  { id: 'team', label: 'Team' },
  { id: 'role', label: 'Role', locked: true },
  { id: 'status', label: 'Status' },
  { id: 'joined', label: 'Joined' },
  { id: 'location', label: 'Location' },
  { id: 'manager', label: 'Manager' },
  { id: 'employeeCode', label: 'Employee Code' },
  { id: 'phone', label: 'Phone' },
  { id: 'workMode', label: 'Work Mode' },
  { id: 'timezone', label: 'Timezone' },
  { id: 'lastActive', label: 'Last Active' },
]

const LOCKED_COLUMN_IDS = new Set(MANAGEABLE_COLUMNS.filter((column) => column.locked).map((column) => column.id))

const FILTER_FIELDS: FilterFieldDefinition[] = [
  { id: 'status', label: 'Status', type: 'select', options: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ] },
  { id: 'role', label: 'Role', type: 'select', options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ] },
  { id: 'team', label: 'Team', type: 'text' },
  { id: 'location', label: 'Location', type: 'text' },
  { id: 'manager', label: 'Manager', type: 'text' },
  { id: 'workMode', label: 'Work Mode', type: 'select', options: [
    { label: 'Onsite', value: 'onsite' },
    { label: 'Hybrid', value: 'hybrid' },
    { label: 'Remote', value: 'remote' },
  ] },
  { id: 'timezone', label: 'Timezone', type: 'select', options: [
    { label: 'GMT+7', value: 'GMT+7' },
    { label: 'GMT+8', value: 'GMT+8' },
    { label: 'GMT+9', value: 'GMT+9' },
  ] },
  { id: 'joined', label: 'Joined', type: 'date' },
]

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
  const [quickKeyword, setQuickKeyword] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [draftColumnVisibility, setDraftColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(MANAGEABLE_COLUMNS.map((column) => column.id))
  const [draftColumnOrder, setDraftColumnOrder] = useState<ColumnOrderState>(MANAGEABLE_COLUMNS.map((column) => column.id))
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  useEffect(() => {
    if (filtersOpen) {
      setDraftFilters(appliedFilters)
    }
  }, [filtersOpen, appliedFilters])

  useEffect(() => {
    if (columnsOpen) {
      setDraftColumnVisibility(columnVisibility)
      setDraftColumnOrder(columnOrder)
    }
  }, [columnsOpen, columnOrder, columnVisibility])

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
      location: user.location,
      manager: user.manager,
      employeeCode: user.employeeCode,
      phone: user.phone,
      workMode: user.workMode,
      timezone: user.timezone,
      lastActive: user.lastActive,
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

  function deleteSelectedUsers() {
    const selectedIds = new Set(
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => rowId),
    )

    if (!selectedIds.size) return

    setUsers((prev) => prev.filter((user) => !selectedIds.has(user.id)))
    setRowSelection({})
  }

  const activeFilterCount = useMemo(() => {
    return countActiveRules(appliedFilters.root)
  }, [appliedFilters])

  const filteredUsers = useMemo(
    () => users.filter((user) => matchesKeyword(user, quickKeyword) && matchFilterGroup(user, appliedFilters.root)),
    [users, appliedFilters, quickKeyword],
  )

  const visibleColumnCount = useMemo(
    () => MANAGEABLE_COLUMNS.filter((column) => isColumnVisible(columnVisibility, column.id)).length,
    [columnVisibility],
  )

  const selectedCount = useMemo(
    () => Object.values(rowSelection).filter(Boolean).length,
    [rowSelection],
  )

  const dataTableColumnOrder = useMemo<ColumnOrderState>(
    () => ['select', ...columnOrder],
    [columnOrder],
  )

  const orderedDraftColumns = useMemo(() => {
    const byId = new Map(MANAGEABLE_COLUMNS.map((column) => [column.id, column]))
    return draftColumnOrder
      .map((id) => byId.get(id))
      .filter((column): column is ColumnManagerItem => !!column)
  }, [draftColumnOrder])

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
        <button
          type='button'
          className='pl-2 text-left'
          onClick={() => startEdit(row.original)}
        >
          <p className='font-medium text-primary hover:underline'>{row.original.name}</p>
          <p className='text-xs text-muted-foreground'>{row.original.email}</p>
        </button>
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
          {selectedCount > 0 && (
            <Button variant='outline' size='sm' className='gap-1.5' onClick={deleteSelectedUsers}>
              <Trash2 className='size-4' />
              Delete ({selectedCount})
            </Button>
          )}
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
            </Button>
            <Button variant='ghost' size='sm' className='gap-1.5 lg:order-3' onClick={() => setFiltersOpen(true)}>
              <Filter className='size-4' />
              Edit filters
              {activeFilterCount > 0 && <span className='rounded-sm bg-muted px-1.5 py-0.5 text-xs'>{activeFilterCount}</span>}
            </Button>
            <div className='relative w-full lg:order-4 lg:w-72'>
              <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                value={quickKeyword}
                onChange={(e) => setQuickKeyword(e.target.value)}
                placeholder='Filter by keyword'
                className='pl-9'
              />
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredUsers}
          pageSize={10}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          columnOrder={dataTableColumnOrder}
          onColumnOrderChange={setColumnOrder}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => row.id}
          showToolbar={false}
          stickyHeader
          tableWrapperClassName='max-h-[calc(100svh-19rem)]'
          className='min-h-0 flex-1 space-y-0'
        />
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side='right' className='w-full gap-0 p-0 sm:max-w-xl'>
          <SheetHeader className='border-b px-6 py-5'>
            <SheetTitle>Edit filters</SheetTitle>
            <SheetDescription>Build nested rule groups and combine them with AND or OR.</SheetDescription>
          </SheetHeader>

          <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
            <FilterGroupEditor
              group={draftFilters.root}
              isRoot
              onChange={(group) => setDraftFilters({ root: group })}
            />
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
            <SheetDescription>Choose visible columns and drag to reorder them.</SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6 py-5'>
            <ColumnManager
              items={orderedDraftColumns}
              visibility={Object.fromEntries(MANAGEABLE_COLUMNS.map((column) => [column.id, isColumnVisible(draftColumnVisibility, column.id)]))}
              onVisibilityChange={(columnId, visible) => {
                if (LOCKED_COLUMN_IDS.has(columnId)) return
                setDraftColumnVisibility((prev) => setColumnVisible(prev, columnId, visible))
              }}
              onOrderChange={(items) => {
                setDraftColumnOrder(items.map((item) => item.id))
              }}
              className='max-h-[calc(100svh-12rem)] overflow-y-auto pr-1'
            />
          </div>

          <SheetFooter className='border-t px-6 py-4 sm:flex-row sm:justify-between'>
            <Button
              variant='ghost'
              onClick={() => {
                setDraftColumnVisibility({})
                setDraftColumnOrder(MANAGEABLE_COLUMNS.map((column) => column.id))
              }}
            >
              Reset to default
            </Button>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setColumnsOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setColumnVisibility(draftColumnVisibility)
                  setColumnOrder(draftColumnOrder)
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

function createFilterRule(): FilterRule {
  const field = FILTER_FIELDS[0]
  return {
    kind: 'rule',
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    field: field.id,
    operator: getOperatorsForField(field.type)[0].value,
    value: '',
  }
}

function createFilterGroup(operator: FilterGroupOperator = 'and'): FilterGroup {
  return {
    kind: 'group',
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    operator,
    children: [],
  }
}

function getFilterField(fieldId: FilterFieldId): FilterFieldDefinition {
  return FILTER_FIELDS.find((field) => field.id === fieldId) ?? FILTER_FIELDS[0]
}

function getOperatorsForField(type: FilterFieldType): Array<{ label: string; value: FilterOperator }> {
  if (type === 'date') {
    return [
      { label: 'On', value: 'on' },
      { label: 'Before', value: 'before' },
      { label: 'After', value: 'after' },
    ]
  }

  if (type === 'select') {
    return [
      { label: 'Equals', value: 'equals' },
      { label: 'Not equals', value: 'notEquals' },
    ]
  }

  return [
    { label: 'Contains', value: 'contains' },
    { label: 'Equals', value: 'equals' },
    { label: 'Starts with', value: 'startsWith' },
    { label: 'Not equals', value: 'notEquals' },
  ]
}

function matchesKeyword(user: UserRow, keyword: string) {
  const normalizedKeyword = normalizeString(keyword)
  if (!normalizedKeyword) return true
  return normalizeString(`${user.name} ${user.email}`).includes(normalizedKeyword)
}

function matchFilterGroup(user: UserRow, group: FilterGroup) {
  const activeChildren = group.children.filter((child) => isNodeActive(child))
  if (!activeChildren.length) return true

  return group.operator === 'or'
    ? activeChildren.some((child) => matchNode(user, child))
    : activeChildren.every((child) => matchNode(user, child))
}

function matchRule(user: UserRow, rule: FilterRule) {
  if (!rule.value.trim()) return true

  const field = getFilterField(rule.field)
  const rawValue = String(user[rule.field] ?? '')

  if (field.type === 'date') {
    return matchDateRule(rawValue, rule.operator, rule.value)
  }

  const left = normalizeString(rawValue)
  const right = normalizeString(rule.value)

  switch (rule.operator) {
    case 'equals':
      return left === right
    case 'notEquals':
      return left !== right
    case 'startsWith':
      return left.startsWith(right)
    case 'contains':
    default:
      return left.includes(right)
  }
}

function matchDateRule(rawValue: string, operator: FilterOperator, ruleValue: string) {
  if (!ruleValue) return true

  const left = rawValue.slice(0, 10)
  const right = ruleValue.slice(0, 10)

  switch (operator) {
    case 'before':
      return left < right
    case 'after':
      return left > right
    case 'on':
    case 'equals':
    default:
      return left === right
  }
}

function normalizeString(value: string) {
  return value.trim().toLowerCase()
}

function isNodeActive(node: FilterNode) {
  return node.kind === 'rule'
    ? !!node.value.trim()
    : node.children.some((child) => isNodeActive(child))
}

function matchNode(user: UserRow, node: FilterNode) {
  return node.kind === 'rule' ? matchRule(user, node) : matchFilterGroup(user, node)
}

function countActiveRules(group: FilterGroup): number {
  return group.children.reduce((count, child) => (
    child.kind === 'rule'
      ? count + (child.value.trim() ? 1 : 0)
      : count + countActiveRules(child)
  ), 0)
}

function updateGroupNode(group: FilterGroup, targetId: string, updater: (node: FilterNode) => FilterNode): FilterGroup {
  return {
    ...group,
    children: group.children.map((child) => {
      if (child.id === targetId) return updater(child)
      if (child.kind === 'group') return updateGroupNode(child, targetId, updater)
      return child
    }),
  }
}

function appendNodeToGroup(group: FilterGroup, targetGroupId: string, node: FilterNode): FilterGroup {
  if (group.id === targetGroupId) {
    return { ...group, children: [...group.children, node] }
  }

  return {
    ...group,
    children: group.children.map((child) => (
      child.kind === 'group' ? appendNodeToGroup(child, targetGroupId, node) : child
    )),
  }
}

function removeNodeFromGroup(group: FilterGroup, targetId: string): FilterGroup {
  return {
    ...group,
    children: group.children
      .filter((child) => child.id !== targetId)
      .map((child) => child.kind === 'group' ? removeNodeFromGroup(child, targetId) : child),
  }
}

function FilterGroupEditor({
  group,
  onChange,
  isRoot = false,
}: {
  group: FilterGroup
  onChange: (group: FilterGroup) => void
  isRoot?: boolean
}) {
  return (
    <div className='space-y-3 rounded-md border p-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <Label>{isRoot ? 'Root group' : 'Group'}</Label>
          <Select
            value={group.operator}
            onValueChange={(value) => onChange({ ...group, operator: value as FilterGroupOperator })}
          >
            <SelectTrigger size='sm' className='w-[110px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='and'>AND</SelectItem>
              <SelectItem value='or'>OR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={() => onChange(appendNodeToGroup(group, group.id, createFilterRule()))}
          >
            <Plus className='size-4' />
            Add filter
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={() => onChange(appendNodeToGroup(group, group.id, createFilterGroup('and')))}
          >
            <Plus className='size-4' />
            Add group
          </Button>
        </div>
      </div>

      {group.children.length ? (
        <div className='space-y-3'>
          {group.children.map((child) => child.kind === 'rule' ? (
            <FilterRuleEditor
              key={child.id}
              rule={child}
              onChange={(rule) => onChange(updateGroupNode(group, child.id, () => rule) as FilterGroup)}
              onRemove={() => onChange(removeNodeFromGroup(group, child.id))}
            />
          ) : (
            <div key={child.id} className='pl-4 border-l'>
              <div className='mb-2 flex justify-end'>
                <Button variant='ghost' size='sm' onClick={() => onChange(removeNodeFromGroup(group, child.id))}>
                  Remove group
                </Button>
              </div>
              <FilterGroupEditor
                group={child}
                onChange={(nextGroup) => onChange(updateGroupNode(group, child.id, () => nextGroup) as FilterGroup)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className='rounded-md border border-dashed p-4 text-sm text-muted-foreground'>
          No filters yet. Add a filter or group to start building logic.
        </div>
      )}
    </div>
  )
}

function FilterRuleEditor({
  rule,
  onChange,
  onRemove,
}: {
  rule: FilterRule
  onChange: (rule: FilterRule) => void
  onRemove: () => void
}) {
  const field = getFilterField(rule.field)
  const operators = getOperatorsForField(field.type)

  return (
    <div className='grid gap-3 rounded-md border p-3 md:grid-cols-[1.2fr_1fr_1.2fr_auto] md:items-center'>
      <Select
        value={rule.field}
        onValueChange={(value) => {
          const nextField = getFilterField(value as FilterFieldId)
          onChange({
            ...rule,
            field: value as FilterFieldId,
            operator: getOperatorsForField(nextField.type)[0].value,
            value: '',
          })
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FILTER_FIELDS.map((item) => (
            <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={rule.operator}
        onValueChange={(value) => onChange({ ...rule, operator: value as FilterOperator })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {operators.map((operator) => (
            <SelectItem key={operator.value} value={operator.value}>{operator.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {field.type === 'select' ? (
        <Select
          value={rule.value}
          onValueChange={(value) => onChange({ ...rule, value })}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select value' />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.type === 'date' ? (
        <DateInput value={rule.value} onChange={(e) => onChange({ ...rule, value: e.target.value })} />
      ) : (
        <Input
          value={rule.value}
          onChange={(e) => onChange({ ...rule, value: e.target.value })}
          placeholder='Enter value'
        />
      )}

      <Button variant='ghost' size='icon' onClick={onRemove}>
        <Trash2 className='size-4' />
      </Button>
    </div>
  )
}
