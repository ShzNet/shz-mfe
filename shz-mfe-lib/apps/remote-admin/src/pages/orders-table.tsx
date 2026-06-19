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
  Input,
  Label,
  matchesFilterBuilderGroup,
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
  type ColumnDef,
  type ColumnOrderState,
  type RowSelectionState,
  type VisibilityState,
} from '@shz/components'
import { Check, ChevronDown, Columns3, Filter, Plus, RotateCcw, Search, ShoppingCart, Trash2 } from 'lucide-react'

type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded'
type FulfillmentStatus = 'unfulfilled' | 'partial' | 'fulfilled'
type SalesChannel = 'web' | 'mobile' | 'store' | 'marketplace'
type Priority = 'low' | 'normal' | 'high'

interface OrderRow {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillment: FulfillmentStatus
  channel: SalesChannel
  country: string
  total: string
  createdAt: string
  salesRep: string
  itemsCount: number
  priority: Priority
}

type OrderForm = Omit<OrderRow, 'id'>
type FilterFieldId = 'status' | 'paymentStatus' | 'fulfillment' | 'channel' | 'country' | 'salesRep' | 'createdAt' | 'priority'
type OrdersTableViewId = 'all' | 'to-fulfill' | 'high-priority' | 'revenue-watch' | 'custom'

const COUNTRIES = ['Vietnam', 'Singapore', 'Thailand', 'Japan', 'Australia']
const SALES_REPS = ['Emma Clark', 'Daniel Tran', 'Sophia Lee', 'Lucas Nguyen']

const INITIAL_ORDERS: OrderRow[] = [
  { id: 'ord-1001', orderNumber: 'ORD-1001', customerName: 'Acme Labs', customerEmail: 'ops@acme.test', status: 'new', paymentStatus: 'pending', fulfillment: 'unfulfilled', channel: 'web', country: 'Vietnam', total: '1240', createdAt: '2026-06-01', salesRep: 'Emma Clark', itemsCount: 3, priority: 'high' },
  { id: 'ord-1002', orderNumber: 'ORD-1002', customerName: 'Northwind Retail', customerEmail: 'buy@northwind.test', status: 'processing', paymentStatus: 'paid', fulfillment: 'partial', channel: 'marketplace', country: 'Singapore', total: '4820', createdAt: '2026-06-02', salesRep: 'Daniel Tran', itemsCount: 8, priority: 'normal' },
  { id: 'ord-1003', orderNumber: 'ORD-1003', customerName: 'Studio Clover', customerEmail: 'hello@clover.test', status: 'shipped', paymentStatus: 'paid', fulfillment: 'fulfilled', channel: 'mobile', country: 'Thailand', total: '930', createdAt: '2026-06-03', salesRep: 'Sophia Lee', itemsCount: 2, priority: 'low' },
  { id: 'ord-1004', orderNumber: 'ORD-1004', customerName: 'Blue Summit', customerEmail: 'procurement@bluesummit.test', status: 'processing', paymentStatus: 'failed', fulfillment: 'unfulfilled', channel: 'web', country: 'Australia', total: '7610', createdAt: '2026-06-04', salesRep: 'Lucas Nguyen', itemsCount: 11, priority: 'high' },
  { id: 'ord-1005', orderNumber: 'ORD-1005', customerName: 'Kanso Home', customerEmail: 'orders@kanso.test', status: 'delivered', paymentStatus: 'paid', fulfillment: 'fulfilled', channel: 'store', country: 'Japan', total: '1580', createdAt: '2026-06-05', salesRep: 'Emma Clark', itemsCount: 4, priority: 'normal' },
  { id: 'ord-1006', orderNumber: 'ORD-1006', customerName: 'Orbit Trading', customerEmail: 'trade@orbit.test', status: 'cancelled', paymentStatus: 'refunded', fulfillment: 'unfulfilled', channel: 'marketplace', country: 'Vietnam', total: '2100', createdAt: '2026-06-06', salesRep: 'Daniel Tran', itemsCount: 5, priority: 'low' },
  { id: 'ord-1007', orderNumber: 'ORD-1007', customerName: 'Pixel Forge', customerEmail: 'finance@pixelforge.test', status: 'new', paymentStatus: 'paid', fulfillment: 'unfulfilled', channel: 'web', country: 'Singapore', total: '3390', createdAt: '2026-06-07', salesRep: 'Sophia Lee', itemsCount: 6, priority: 'high' },
  { id: 'ord-1008', orderNumber: 'ORD-1008', customerName: 'Mekong Goods', customerEmail: 'warehouse@mekong.test', status: 'processing', paymentStatus: 'paid', fulfillment: 'partial', channel: 'store', country: 'Thailand', total: '1180', createdAt: '2026-06-08', salesRep: 'Lucas Nguyen', itemsCount: 3, priority: 'normal' },
  { id: 'ord-1009', orderNumber: 'ORD-1009', customerName: 'Harbor Point', customerEmail: 'sales@harborpoint.test', status: 'shipped', paymentStatus: 'paid', fulfillment: 'fulfilled', channel: 'mobile', country: 'Australia', total: '5920', createdAt: '2026-06-09', salesRep: 'Emma Clark', itemsCount: 7, priority: 'normal' },
  { id: 'ord-1010', orderNumber: 'ORD-1010', customerName: 'Lotus Group', customerEmail: 'team@lotus.test', status: 'new', paymentStatus: 'pending', fulfillment: 'unfulfilled', channel: 'web', country: 'Vietnam', total: '880', createdAt: '2026-06-10', salesRep: 'Daniel Tran', itemsCount: 2, priority: 'high' },
]

const EMPTY_FORM: OrderForm = {
  orderNumber: '',
  customerName: '',
  customerEmail: '',
  status: 'new',
  paymentStatus: 'pending',
  fulfillment: 'unfulfilled',
  channel: 'web',
  country: 'Vietnam',
  total: '',
  createdAt: '',
  salesRep: SALES_REPS[0],
  itemsCount: 1,
  priority: 'normal',
}

const DEFAULT_FILTERS: FilterBuilderValue<FilterFieldId> = createFilterBuilderGroup<FilterFieldId>('and')

const MANAGEABLE_COLUMNS: ColumnManagerItem[] = [
  { id: 'orderNumber', label: 'Order', locked: true },
  { id: 'customerName', label: 'Customer', locked: true },
  { id: 'status', label: 'Status' },
  { id: 'paymentStatus', label: 'Payment' },
  { id: 'fulfillment', label: 'Fulfillment' },
  { id: 'channel', label: 'Channel' },
  { id: 'country', label: 'Country' },
  { id: 'total', label: 'Total' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'salesRep', label: 'Sales Rep' },
  { id: 'itemsCount', label: 'Items' },
  { id: 'priority', label: 'Priority' },
]

const LOCKED_COLUMN_IDS = new Set(MANAGEABLE_COLUMNS.filter((column) => column.locked).map((column) => column.id))

const FILTER_FIELDS: Array<FilterBuilderField<FilterFieldId>> = [
  { code: 'status', name: 'Order status', dataType: 'select', options: [
    { label: 'New', value: 'new' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ] },
  { code: 'paymentStatus', name: 'Payment status', dataType: 'select', options: [
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Failed', value: 'failed' },
    { label: 'Refunded', value: 'refunded' },
  ] },
  { code: 'fulfillment', name: 'Fulfillment', dataType: 'select', options: [
    { label: 'Unfulfilled', value: 'unfulfilled' },
    { label: 'Partial', value: 'partial' },
    { label: 'Fulfilled', value: 'fulfilled' },
  ] },
  { code: 'channel', name: 'Channel', dataType: 'select', options: [
    { label: 'Web', value: 'web' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Store', value: 'store' },
    { label: 'Marketplace', value: 'marketplace' },
  ] },
  { code: 'country', name: 'Country', dataType: 'select', getOptions: async () => COUNTRIES.map((country) => ({ label: country, value: country })) },
  { code: 'salesRep', name: 'Sales rep', dataType: 'select', getOptions: async () => SALES_REPS.map((salesRep) => ({ label: salesRep, value: salesRep })) },
  { code: 'createdAt', name: 'Created at', dataType: 'date' },
  { code: 'priority', name: 'Priority', dataType: 'select', options: [
    { label: 'High', value: 'high' },
    { label: 'Normal', value: 'normal' },
    { label: 'Low', value: 'low' },
  ] },
]

interface OrdersTableViewPreset {
  id: Exclude<OrdersTableViewId, 'custom'>
  label: string
  filters: FilterBuilderValue<FilterFieldId>
  columnVisibility: VisibilityState
  columnOrder: ColumnOrderState
}

const VIEW_PRESETS: OrdersTableViewPreset[] = [
  {
    id: 'all',
    label: 'All orders',
    filters: DEFAULT_FILTERS,
    columnVisibility: {},
    columnOrder: MANAGEABLE_COLUMNS.map((column) => column.id),
  },
  {
    id: 'to-fulfill',
    label: 'To fulfill',
    filters: createViewGroup([
      createViewRule('fulfillment', 'equals', 'unfulfilled'),
      createViewRule('paymentStatus', 'equals', 'paid'),
    ]),
    columnVisibility: {
      country: false,
      channel: false,
    },
    columnOrder: ['orderNumber', 'customerName', 'status', 'fulfillment', 'priority', 'itemsCount', 'salesRep', 'createdAt', 'paymentStatus', 'total', 'channel', 'country'],
  },
  {
    id: 'high-priority',
    label: 'High priority',
    filters: createViewGroup([
      createViewRule('priority', 'equals', 'high'),
      createViewGroup([
        createViewRule('status', 'equals', 'new'),
        createViewRule('status', 'equals', 'processing'),
      ], 'or'),
    ]),
    columnVisibility: {
      country: false,
    },
    columnOrder: ['orderNumber', 'customerName', 'priority', 'status', 'paymentStatus', 'fulfillment', 'total', 'salesRep', 'createdAt', 'itemsCount', 'channel', 'country'],
  },
  {
    id: 'revenue-watch',
    label: 'Revenue watch',
    filters: createViewGroup([
      createViewRule('paymentStatus', 'notEquals', 'refunded'),
      createViewRule('channel', 'notEquals', 'store'),
    ]),
    columnVisibility: {
      itemsCount: false,
    },
    columnOrder: ['orderNumber', 'customerName', 'total', 'paymentStatus', 'status', 'channel', 'country', 'salesRep', 'createdAt', 'priority', 'fulfillment', 'itemsCount'],
  },
]

const statusVariant: Record<OrderStatus, 'default' | 'secondary' | 'outline'> = {
  new: 'secondary',
  processing: 'default',
  shipped: 'outline',
  delivered: 'outline',
  cancelled: 'outline',
}

const priorityVariant: Record<Priority, 'default' | 'secondary' | 'outline'> = {
  high: 'default',
  normal: 'secondary',
  low: 'outline',
}

export default function OrdersTablePage() {
  const [orders, setOrders] = useState<OrderRow[]>(INITIAL_ORDERS)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM)
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
  const [activeViewId, setActiveViewId] = useState<OrdersTableViewId>('all')

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
    setForm({
      ...EMPTY_FORM,
      orderNumber: `ORD-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setOpen(true)
  }

  function startEdit(order: OrderRow) {
    setEditingId(order.id)
    setForm({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      status: order.status,
      paymentStatus: order.paymentStatus,
      fulfillment: order.fulfillment,
      channel: order.channel,
      country: order.country,
      total: order.total,
      createdAt: order.createdAt,
      salesRep: order.salesRep,
      itemsCount: order.itemsCount,
      priority: order.priority,
    })
    setOpen(true)
  }

  function saveOrder() {
    if (!form.orderNumber.trim() || !form.customerName.trim() || !form.customerEmail.trim()) return

    if (editingId) {
      setOrders((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...form } : item)))
    } else {
      const id = `ord-${Date.now()}`
      setOrders((prev) => [{ id, ...form }, ...prev])
    }
    setOpen(false)
  }

  function deleteSelectedOrders() {
    const selectedIds = new Set(
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => rowId),
    )
    if (!selectedIds.size) return
    setOrders((prev) => prev.filter((order) => !selectedIds.has(order.id)))
    setRowSelection({})
  }

  function applyView(viewId: Exclude<OrdersTableViewId, 'custom'>) {
    const view = VIEW_PRESETS.find((entry) => entry.id === viewId)
    if (!view) return

    const nextFilters = cloneFilterValue(view.filters)
    const nextVisibility = { ...view.columnVisibility }
    const nextOrder = [...view.columnOrder]

    setAppliedFilters(nextFilters)
    setDraftFilters(nextFilters)
    setColumnVisibility(nextVisibility)
    setDraftColumnVisibility(nextVisibility)
    setColumnOrder(nextOrder)
    setDraftColumnOrder(nextOrder)
    setActiveViewId(view.id)
  }

  const activeFilterCount = useMemo(() => countActiveFilterBuilderRules(appliedFilters), [appliedFilters])

  const filteredOrders = useMemo(
    () => orders.filter((order) => (
      matchesKeyword(order, quickKeyword)
      && matchesFilterBuilderGroup(order, appliedFilters, FILTER_FIELDS, resolveFilterFieldValue)
    )),
    [orders, appliedFilters, quickKeyword],
  )

  const selectedCount = useMemo(() => Object.values(rowSelection).filter(Boolean).length, [rowSelection])

  const dataTableColumnOrder = useMemo<ColumnOrderState>(() => ['select', ...columnOrder], [columnOrder])

  const orderedDraftColumns = useMemo(() => {
    const byId = new Map(MANAGEABLE_COLUMNS.map((column) => [column.id, column]))
    return draftColumnOrder
      .map((id) => byId.get(id))
      .filter((column): column is ColumnManagerItem => !!column)
  }, [draftColumnOrder])

  const activeViewLabel = useMemo(
    () => VIEW_PRESETS.find((view) => view.id === activeViewId)?.label ?? 'Custom view',
    [activeViewId],
  )

  const columns: ColumnDef<OrderRow>[] = useMemo(() => [
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
      accessorKey: 'orderNumber',
      header: 'Order',
      cell: ({ row }) => (
        <button type='button' className='pl-2 text-left' onClick={() => startEdit(row.original)}>
          <p className='font-medium text-primary hover:underline'>{row.original.orderNumber}</p>
          <p className='text-xs text-muted-foreground'>{row.original.createdAt}</p>
        </button>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <p className='font-medium'>{row.original.customerName}</p>
          <p className='text-xs text-muted-foreground'>{row.original.customerEmail}</p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge variant={statusVariant[row.original.status]} className='capitalize'>{row.original.status}</Badge>,
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => <span className='capitalize'>{row.original.paymentStatus}</span>,
    },
    {
      accessorKey: 'fulfillment',
      header: 'Fulfillment',
      cell: ({ row }) => <span className='capitalize'>{row.original.fulfillment}</span>,
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }) => <span className='capitalize'>{row.original.channel}</span>,
    },
    { accessorKey: 'country', header: 'Country' },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => <span className='font-medium'>${Number(row.original.total).toLocaleString()}</span>,
    },
    { accessorKey: 'createdAt', header: 'Created At' },
    { accessorKey: 'salesRep', header: 'Sales Rep' },
    { accessorKey: 'itemsCount', header: 'Items' },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => <Badge variant={priorityVariant[row.original.priority]} className='capitalize'>{row.original.priority}</Badge>,
    },
  ], [])

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-4'>
      <ActionBar>
        <div className='flex flex-wrap items-center gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='gap-1.5' onClick={startCreate}>
                <Plus className='size-4' />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Order' : 'Create Order'}</DialogTitle>
              </DialogHeader>
              <div className='grid gap-3'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='grid gap-1.5'>
                    <Label>Order Number</Label>
                    <Input value={form.orderNumber} onChange={(e) => setForm((prev) => ({ ...prev, orderNumber: e.target.value }))} />
                  </div>
                  <div className='grid gap-1.5'>
                    <Label>Created At</Label>
                    <DateInput value={form.createdAt} onChange={(e) => setForm((prev) => ({ ...prev, createdAt: e.target.value }))} />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='grid gap-1.5'>
                    <Label>Customer Name</Label>
                    <Input value={form.customerName} onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))} />
                  </div>
                  <div className='grid gap-1.5'>
                    <Label>Customer Email</Label>
                    <Input value={form.customerEmail} onChange={(e) => setForm((prev) => ({ ...prev, customerEmail: e.target.value }))} />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='grid gap-1.5'>
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as OrderStatus }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value='new'>New</SelectItem>
                        <SelectItem value='processing'>Processing</SelectItem>
                        <SelectItem value='shipped'>Shipped</SelectItem>
                        <SelectItem value='delivered'>Delivered</SelectItem>
                        <SelectItem value='cancelled'>Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid gap-1.5'>
                    <Label>Payment Status</Label>
                    <Select value={form.paymentStatus} onValueChange={(value) => setForm((prev) => ({ ...prev, paymentStatus: value as PaymentStatus }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value='paid'>Paid</SelectItem>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='failed'>Failed</SelectItem>
                        <SelectItem value='refunded'>Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='grid gap-1.5'>
                    <Label>Fulfillment</Label>
                    <Select value={form.fulfillment} onValueChange={(value) => setForm((prev) => ({ ...prev, fulfillment: value as FulfillmentStatus }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value='unfulfilled'>Unfulfilled</SelectItem>
                        <SelectItem value='partial'>Partial</SelectItem>
                        <SelectItem value='fulfilled'>Fulfilled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid gap-1.5'>
                    <Label>Priority</Label>
                    <Select value={form.priority} onValueChange={(value) => setForm((prev) => ({ ...prev, priority: value as Priority }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value='high'>High</SelectItem>
                        <SelectItem value='normal'>Normal</SelectItem>
                        <SelectItem value='low'>Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-3'>
                  <div className='grid gap-1.5'>
                    <Label>Total</Label>
                    <Input value={form.total} onChange={(e) => setForm((prev) => ({ ...prev, total: e.target.value }))} />
                  </div>
                  <div className='grid gap-1.5'>
                    <Label>Items</Label>
                    <Input type='number' value={String(form.itemsCount)} onChange={(e) => setForm((prev) => ({ ...prev, itemsCount: Number(e.target.value || 0) }))} />
                  </div>
                  <div className='grid gap-1.5'>
                    <Label>Country</Label>
                    <Select value={form.country} onValueChange={(value) => setForm((prev) => ({ ...prev, country: value }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => <SelectItem key={country} value={country}>{country}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={saveOrder}>{editingId ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {selectedCount > 0 && (
            <Button variant='outline' size='sm' className='gap-1.5' onClick={deleteSelectedOrders}>
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
              {activeFilterCount > 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='gap-1.5 lg:order-1'
                  onClick={() => {
                    setAppliedFilters(DEFAULT_FILTERS)
                    setActiveViewId('custom')
                  }}
                >
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
        </div>

        <DataTable
          columns={columns}
          data={filteredOrders}
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
              <Button
                onClick={() => {
                  setAppliedFilters(draftFilters)
                  setActiveViewId('custom')
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
              onOrderChange={(items) => setDraftColumnOrder(items.map((item) => item.id))}
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
                  setActiveViewId('custom')
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

function ActionBar({ children }: { children: React.ReactNode }) {
  return <div className='rounded-lg border bg-background px-3 py-2 shadow-sm'>{children}</div>
}

function isColumnVisible(state: VisibilityState, columnId: string) {
  return state[columnId] !== false
}

function setColumnVisible(state: VisibilityState, columnId: string, visible: boolean): VisibilityState {
  const next = { ...state }
  if (visible) delete next[columnId]
  else next[columnId] = false
  return next
}

function matchesKeyword(order: OrderRow, keyword: string) {
  const normalizedKeyword = normalizeString(keyword)
  if (!normalizedKeyword) return true
  return normalizeString(`${order.orderNumber} ${order.customerName} ${order.customerEmail}`).includes(normalizedKeyword)
}

function normalizeString(value: string) {
  return value.trim().toLowerCase()
}

function resolveFilterFieldValue(order: OrderRow, fieldCode: FilterFieldId): FilterBuilderResolvedValue {
  return order[fieldCode]
}

function createViewRule(
  fieldCode: FilterFieldId,
  condition: 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'before' | 'after' | 'on',
  value: string,
) {
  const rule = createFilterBuilderRule<FilterFieldId>()
  return { ...rule, fieldCode, condition, value }
}

function createViewGroup(children: FilterBuilderValue<FilterFieldId>['children'], operator: 'and' | 'or' = 'and') {
  return { ...createFilterBuilderGroup<FilterFieldId>(operator), children }
}

function cloneFilterValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
