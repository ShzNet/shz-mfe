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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FilterBuilder,
  countActiveFilterBuilderRules,
  createFilterBuilderGroup,
  createFilterBuilderRule,
  type FilterBuilderField,
  type FilterBuilderResolvedValue,
  type FilterBuilderValue,
  matchesFilterBuilderGroup,
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
} from '@shznet/components'
import { Check, ChevronDown, Columns3, Filter, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'

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
type UsersTableViewId = 'all' | 'active-ops' | 'design-review' | 'custom'

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
]

const LOCATIONS = ['HCMC', 'Hanoi', 'Da Nang', 'Singapore', 'Bangkok']
const MANAGERS = ['Emma Clark', 'Daniel Tran', 'Sophia Lee', 'Lucas Nguyen']
const WORK_MODES: UserRow['workMode'][] = ['hybrid', 'onsite', 'remote']
const TIMEZONES = ['GMT+7', 'GMT+8', 'GMT+9']

const INITIAL_USERS: UserRow[] = BASE_USERS.map((user, index) => ({
  ...user,
  location: LOCATIONS[index % LOCATIONS.length]!,
  manager: MANAGERS[index % MANAGERS.length]!,
  employeeCode: `EMP-${String(index + 1).padStart(4, '0')}`,
  phone: `090${String(1000000 + index * 137).slice(0, 7)}`,
  workMode: WORK_MODES[index % WORK_MODES.length]!,
  timezone: TIMEZONES[index % TIMEZONES.length]!,
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

const DEFAULT_FILTERS: FilterBuilderValue<FilterFieldId> = createFilterBuilderGroup<FilterFieldId>('and')

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

const FILTER_FIELDS: Array<FilterBuilderField<FilterFieldId>> = [
  {
    code: 'status',
    name: 'Status',
    dataType: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
  },
  {
    code: 'role',
    name: 'Role',
    dataType: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
  { code: 'team', name: 'Team', dataType: 'text' },
  { code: 'location', name: 'Location', dataType: 'text' },
  {
    code: 'manager',
    name: 'Manager',
    dataType: 'select',
    supportedConditions: ['equals', 'notEquals'],
    getOptions: async () => MANAGERS.map((manager) => ({ label: manager, value: manager })),
  },
  {
    code: 'workMode',
    name: 'Work Mode',
    dataType: 'select',
    options: [
      { label: 'Onsite', value: 'onsite' },
      { label: 'Hybrid', value: 'hybrid' },
      { label: 'Remote', value: 'remote' },
    ],
  },
  {
    code: 'timezone',
    name: 'Timezone',
    dataType: 'select',
    options: [
      { label: 'GMT+7', value: 'GMT+7' },
      { label: 'GMT+8', value: 'GMT+8' },
      { label: 'GMT+9', value: 'GMT+9' },
    ],
  },
  { code: 'joined', name: 'Joined', dataType: 'date' },
]

interface UsersTableViewPreset {
  id: Exclude<UsersTableViewId, 'custom'>
  label: string
  filters: FilterBuilderValue<FilterFieldId>
  columnVisibility: VisibilityState
  columnOrder: ColumnOrderState
}

const VIEW_PRESETS: UsersTableViewPreset[] = [
  {
    id: 'all',
    label: 'All users',
    filters: DEFAULT_FILTERS,
    columnVisibility: {},
    columnOrder: MANAGEABLE_COLUMNS.map((column) => column.id),
  },
  {
    id: 'active-ops',
    label: 'Active operations',
    filters: createViewGroup([
      createViewRule('status', 'equals', 'active'),
      createViewGroup([
        createViewRule('team', 'contains', 'Operations'),
        createViewRule('team', 'contains', 'Support'),
      ], 'or'),
    ]),
    columnVisibility: { phone: false, employeeCode: false, manager: false, lastActive: false },
    columnOrder: ['name', 'team', 'status', 'workMode', 'timezone', 'joined', 'location', 'role', 'manager', 'employeeCode', 'phone', 'lastActive'],
  },
  {
    id: 'design-review',
    label: 'Design review',
    filters: createViewGroup([
      createViewRule('team', 'equals', 'Design'),
      createViewRule('status', 'notEquals', 'inactive'),
    ]),
    columnVisibility: { phone: false, employeeCode: false, timezone: false, workMode: false },
    columnOrder: ['name', 'role', 'status', 'manager', 'joined', 'location', 'team', 'employeeCode', 'phone', 'workMode', 'timezone', 'lastActive'],
  },
]

const roleVariant: Record<Role, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  editor: 'secondary',
  viewer: 'outline',
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UserForm>(EMPTY_FORM)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<FilterBuilderValue<FilterFieldId>>(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState<FilterBuilderValue<FilterFieldId>>(DEFAULT_FILTERS)
  const [quickKeyword, setQuickKeyword] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [draftColumnVisibility, setDraftColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(MANAGEABLE_COLUMNS.map((column) => column.id))
  const [draftColumnOrder, setDraftColumnOrder] = useState<ColumnOrderState>(MANAGEABLE_COLUMNS.map((column) => column.id))
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [activeViewId, setActiveViewId] = useState<UsersTableViewId>('all')

  useEffect(() => {
    if (filtersOpen) setDraftFilters(appliedFilters)
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
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status, team: user.team, joined: user.joined, location: user.location, manager: user.manager, employeeCode: user.employeeCode, phone: user.phone, workMode: user.workMode, timezone: user.timezone, lastActive: user.lastActive })
    setOpen(true)
  }

  function saveUser() {
    if (!form.name.trim() || !form.email.trim()) return
    if (editingId) {
      setUsers((prev) => prev.map((user) => (user.id === editingId ? { ...user, ...form } : user)))
    } else {
      setUsers((prev) => [{ id: String(Date.now()), ...form }, ...prev])
    }
    setOpen(false)
  }

  function deleteSelectedUsers() {
    const selectedIds = new Set(Object.entries(rowSelection).filter(([, selected]) => selected).map(([rowId]) => rowId))
    if (!selectedIds.size) return
    setUsers((prev) => prev.filter((user) => !selectedIds.has(user.id)))
    setRowSelection({})
  }

  function applyView(viewId: Exclude<UsersTableViewId, 'custom'>) {
    const view = VIEW_PRESETS.find((entry) => entry.id === viewId)
    if (!view) return
    const nextFilters = cloneFilterValue(view.filters)
    setAppliedFilters(nextFilters)
    setDraftFilters(nextFilters)
    setColumnVisibility({ ...view.columnVisibility })
    setDraftColumnVisibility({ ...view.columnVisibility })
    setColumnOrder([...view.columnOrder])
    setDraftColumnOrder([...view.columnOrder])
    setActiveViewId(view.id)
  }

  const activeFilterCount = useMemo(() => countActiveFilterBuilderRules(appliedFilters), [appliedFilters])

  const filteredUsers = useMemo(
    () => users.filter((user) => matchesKeyword(user, quickKeyword) && matchesFilterBuilderGroup(user, appliedFilters, FILTER_FIELDS, resolveFilterFieldValue)),
    [users, appliedFilters, quickKeyword]
  )

  const selectedCount = useMemo(() => Object.values(rowSelection).filter(Boolean).length, [rowSelection])

  const dataTableColumnOrder = useMemo<ColumnOrderState>(() => ['select', ...columnOrder], [columnOrder])

  const orderedDraftColumns = useMemo(() => {
    const byId = new Map(MANAGEABLE_COLUMNS.map((column) => [column.id, column]))
    return draftColumnOrder.map((id) => byId.get(id)).filter((column): column is ColumnManagerItem => !!column)
  }, [draftColumnOrder])

  const activeViewLabel = useMemo(
    () => VIEW_PRESETS.find((view) => view.id === activeViewId)?.label ?? 'Custom view',
    [activeViewId]
  )

  const columns: ColumnDef<UserRow>[] = useMemo(
    () => [
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
            <Checkbox aria-label='Select row' checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
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
          <button type='button' className='pl-2 text-left' onClick={() => startEdit(row.original)}>
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
    ],
    []
  )

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-4'>
      <ActionBar>
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
                  <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder='Full name' />
                </div>
                <div className='grid gap-1.5'>
                  <Label>Email</Label>
                  <Input type='email' value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder='Email' />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='grid gap-1.5'>
                    <Label>Role</Label>
                    <Select value={form.role} onValueChange={(value) => setForm((prev) => ({ ...prev, role: value as Role }))}>
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
                    <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as Status }))}>
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
                    <Input value={form.team} onChange={(event) => setForm((prev) => ({ ...prev, team: event.target.value }))} placeholder='Team' />
                  </div>
                  <div className='grid gap-1.5'>
                    <Label>Joined Date</Label>
                    <DateInput value={form.joined} onChange={(event) => setForm((prev) => ({ ...prev, joined: event.target.value }))} />
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
      </ActionBar>

      <div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-background shadow-sm'>
        <div className='border-b px-3 py-2'>
          <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='h-auto gap-1 rounded-sm px-1 py-0 text-sm font-medium text-primary hover:bg-transparent hover:text-primary focus-visible:ring-0'>
                    <span>{activeViewLabel}</span>
                    <ChevronDown className='size-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  {VIEW_PRESETS.map((view) => (
                    <DropdownMenuItem key={view.id} onClick={() => applyView(view.id)}>
                      <Check className={activeViewId === view.id ? 'opacity-100' : 'opacity-0'} />
                      {view.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem onClick={() => setActiveViewId('custom')}>
                    <Check className={activeViewId === 'custom' ? 'opacity-100' : 'opacity-0'} />
                    Custom view
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end'>
              {countActiveFilterBuilderRules(appliedFilters) > 0 && (
                <Button variant='ghost' size='sm' className='gap-1.5 lg:order-1' onClick={() => { setAppliedFilters(DEFAULT_FILTERS); setActiveViewId('custom') }}>
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
                <Input value={quickKeyword} onChange={(event) => setQuickKeyword(event.target.value)} placeholder='Filter by keyword' className='pl-9' />
              </div>
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
        <SheetContent side='right' className='w-full gap-0 p-0 sm:max-w-4xl'>
          <SheetHeader className='border-b px-6 py-5'>
            <SheetTitle>Edit filters</SheetTitle>
            <SheetDescription>Build nested rule groups and combine them with AND or OR.</SheetDescription>
          </SheetHeader>
          <div className='flex-1 overflow-y-auto px-6 py-5'>
            <FilterBuilder fields={FILTER_FIELDS} value={draftFilters} onChange={setDraftFilters} />
          </div>
          <SheetFooter className='border-t px-6 py-4 sm:flex-row sm:justify-between'>
            <Button variant='ghost' onClick={() => setDraftFilters(DEFAULT_FILTERS)}>Reset to default</Button>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setFiltersOpen(false)}>Cancel</Button>
              <Button onClick={() => { setAppliedFilters(draftFilters); setActiveViewId('custom'); setFiltersOpen(false) }}>Apply</Button>
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
              onOrderChange={(items) => setDraftColumnOrder(items.map((item) => item.id))}
              className='max-h-[calc(100svh-12rem)] overflow-y-auto pr-1'
            />
          </div>
          <SheetFooter className='border-t px-6 py-4 sm:flex-row sm:justify-between'>
            <Button variant='ghost' onClick={() => { setDraftColumnVisibility({}); setDraftColumnOrder(MANAGEABLE_COLUMNS.map((column) => column.id)) }}>Reset to default</Button>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setColumnsOpen(false)}>Cancel</Button>
              <Button onClick={() => { setColumnVisibility(draftColumnVisibility); setColumnOrder(draftColumnOrder); setActiveViewId('custom'); setColumnsOpen(false) }}>Apply</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ActionBar({ children }: { children: React.ReactNode }) {
  return <div className='rounded-lg border bg-background px-3 py-2 shadow-sm'>{children}</div>
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

function matchesKeyword(user: UserRow, keyword: string) {
  const normalizedKeyword = normalizeString(keyword)
  if (!normalizedKeyword) return true
  return normalizeString(`${user.name} ${user.email}`).includes(normalizedKeyword)
}

function normalizeString(value: string) {
  return value.trim().toLowerCase()
}

function resolveFilterFieldValue(user: UserRow, fieldCode: FilterFieldId): FilterBuilderResolvedValue {
  return user[fieldCode]
}

function createViewRule(
  fieldCode: FilterFieldId,
  condition: 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'before' | 'after' | 'on',
  value: string
) {
  return { ...createFilterBuilderRule<FilterFieldId>(), fieldCode, condition, value }
}

function createViewGroup(
  children: FilterBuilderValue<FilterFieldId>['children'],
  operator: 'and' | 'or' = 'and'
) {
  return { ...createFilterBuilderGroup<FilterFieldId>(operator), children }
}

function cloneFilterValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
