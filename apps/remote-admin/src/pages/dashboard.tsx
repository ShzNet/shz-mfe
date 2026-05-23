import { useState } from 'react'
import {
  // Layout
  Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
  Separator,
  ScrollArea,
  // Cards
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  // Inputs
  Input, Textarea, Label,
  Checkbox, RadioGroup, RadioGroupItem,
  Switch, Slider,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Toggle, ToggleGroup, ToggleGroupItem,
  // Overlays
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  Popover, PopoverTrigger, PopoverContent,
  Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandDialog,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
  // Data
  DataTable, SortableHeader, type ColumnDef,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Tree, type TreeNode,
  // Feedback
  Badge, Avatar, AvatarFallback, AvatarImage,
  Skeleton, Progress,
  Button,
  StatsCard,
} from '@shz/components'
import {
  DollarSign, Users, ShoppingCart, Activity,
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  Search, Terminal, Calculator, Calendar,
  Smile, LayoutDashboard,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { title: 'Total Revenue', value: '$128,450', change: '+12.5%', trend: 'up' as const, icon: DollarSign, description: 'from last month' },
  { title: 'Active Users', value: '24,310', change: '+8.2%', trend: 'up' as const, icon: Users, description: 'from last month' },
  { title: 'New Orders', value: '1,892', change: '-3.1%', trend: 'down' as const, icon: ShoppingCart, description: 'from last month' },
  { title: 'System Load', value: '64%', change: '+2%', trend: 'neutral' as const, icon: Activity, description: 'current' },
]

interface Employee {
  id: string
  name: string
  email: string
  department: string
  role: string
  status: 'active' | 'inactive'
  salary: number
}

const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@shz.dev', department: 'Engineering', role: 'Lead', status: 'active', salary: 120000 },
  { id: '2', name: 'Bob Martinez', email: 'bob@shz.dev', department: 'Design', role: 'Senior', status: 'active', salary: 95000 },
  { id: '3', name: 'Carol White', email: 'carol@shz.dev', department: 'Product', role: 'Manager', status: 'active', salary: 110000 },
  { id: '4', name: 'David Chen', email: 'david@shz.dev', department: 'Engineering', role: 'Mid', status: 'inactive', salary: 85000 },
  { id: '5', name: 'Eva Park', email: 'eva@shz.dev', department: 'Marketing', role: 'Senior', status: 'active', salary: 90000 },
  { id: '6', name: 'Frank Lee', email: 'frank@shz.dev', department: 'Engineering', role: 'Lead', status: 'active', salary: 125000 },
  { id: '7', name: 'Grace Kim', email: 'grace@shz.dev', department: 'Design', role: 'Mid', status: 'active', salary: 80000 },
  { id: '8', name: 'Henry Brown', email: 'henry@shz.dev', department: 'Product', role: 'Senior', status: 'inactive', salary: 105000 },
  { id: '9', name: 'Iris Wu', email: 'iris@shz.dev', department: 'Engineering', role: 'Junior', status: 'active', salary: 70000 },
  { id: '10', name: 'Jake Smith', email: 'jake@shz.dev', department: 'Marketing', role: 'Manager', status: 'active', salary: 100000 },
  { id: '11', name: 'Kate Adams', email: 'kate@shz.dev', department: 'Design', role: 'Lead', status: 'active', salary: 115000 },
  { id: '12', name: 'Leo Garcia', email: 'leo@shz.dev', department: 'Engineering', role: 'Mid', status: 'inactive', salary: 88000 },
]

const employeeColumns: ColumnDef<Employee, unknown>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Avatar className='size-7'>
          <AvatarFallback className='text-xs'>{row.original.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className='font-medium leading-none text-sm'>{row.original.name}</p>
          <p className='text-xs text-muted-foreground'>{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'department',
    header: ({ column }) => <SortableHeader column={column}>Department</SortableHeader>,
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'} className='capitalize'>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'salary',
    header: ({ column }) => <SortableHeader column={column}>Salary</SortableHeader>,
    cell: ({ row }) => (
      <span className='tabular-nums'>${row.original.salary.toLocaleString()}</span>
    ),
  },
]

const FILE_TREE: TreeNode[] = [
  {
    id: 'src', label: 'src', children: [
      {
        id: 'apps', label: 'apps', children: [
          { id: 'host', label: 'host', children: [{ id: 'host-src', label: 'src' }] },
          { id: 'remote-admin', label: 'remote-admin', children: [{ id: 'admin-src', label: 'src' }] },
          { id: 'remote-dashboard', label: 'remote-dashboard', children: [{ id: 'dash-src', label: 'src' }] },
        ],
      },
      {
        id: 'libs', label: 'libs', children: [
          {
            id: 'components', label: 'components', children: [
              { id: 'comp-src', label: 'src', children: [
                { id: 'ui', label: 'ui' },
                { id: 'lib', label: 'lib' },
              ]},
            ],
          },
        ],
      },
      { id: 'nx-json', label: 'nx.json' },
      { id: 'pkg', label: 'package.json' },
    ],
  },
]

const COMMANDS = [
  { group: 'Pages', icon: LayoutDashboard, items: ['Dashboard', 'Users', 'Tasks', 'Settings'] },
  { group: 'Tools', icon: Terminal, items: ['Terminal', 'Calculator', 'Calendar'] },
  { group: 'Other', icon: Smile, items: ['Help Center', 'Keyboard Shortcuts', 'About'] },
]

// ─── Section components ───────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3'>{children}</p>
}

function DemoCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-52 w-full rounded-md border bg-muted/20 p-3'>
              <svg viewBox='0 0 640 220' className='h-full w-full'>
                <polyline
                  points='20,170 100,150 180,160 260,120 340,110 420,90 500,105 620,70'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='3'
                  className='text-primary'
                />
                <polyline
                  points='20,180 100,170 180,150 260,145 340,130 420,125 500,120 620,110'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeDasharray='6 4'
                  className='text-muted-foreground'
                />
              </svg>
            </div>
            <div className='mt-3 flex items-center gap-4 text-xs text-muted-foreground'>
              <span className='inline-flex items-center gap-1'><span className='size-2 rounded-full bg-primary' />Revenue</span>
              <span className='inline-flex items-center gap-1'><span className='size-2 rounded-full bg-muted-foreground' />Target</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>Last 5 new members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {EMPLOYEES.slice(0, 5).map((emp) => (
                <div key={emp.id} className='flex items-center gap-3'>
                  <Avatar className='size-8'>
                    <AvatarImage src='' />
                    <AvatarFallback className='text-xs'>{emp.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{emp.name}</p>
                    <p className='text-xs text-muted-foreground truncate'>{emp.department}</p>
                  </div>
                  <Badge variant='outline' className='shrink-0 text-xs'>{emp.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Channel contribution (%)</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {[
              { label: 'Organic Search', value: 42 },
              { label: 'Direct', value: 28 },
              { label: 'Social', value: 18 },
              { label: 'Referral', value: 12 },
            ].map((row) => (
              <div key={row.label} className='space-y-1'>
                <div className='flex justify-between text-xs text-muted-foreground'>
                  <span>{row.label}</span>
                  <span>{row.value}%</span>
                </div>
                <div className='h-2 overflow-hidden rounded bg-muted'>
                  <div className='h-full rounded bg-primary/80' style={{ width: `${row.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion</CardTitle>
            <CardDescription>Weekly goal progress</CardDescription>
          </CardHeader>
          <CardContent className='flex items-center justify-center'>
            <div className='relative flex h-36 w-36 items-center justify-center'>
              <div
                className='absolute inset-0 rounded-full'
                style={{
                  background:
                    'conic-gradient(var(--color-primary) 0 72%, var(--color-muted) 72% 100%)',
                }}
              />
              <div className='absolute inset-3 rounded-full bg-background' />
              <div className='relative text-center'>
                <p className='text-2xl font-bold'>72%</p>
                <p className='text-xs text-muted-foreground'>of target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DataTab() {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)

  return (
    <div className='space-y-6'>
      <DemoCard title='DataTable' description='Sortable, filterable, paginated table with column visibility toggle and row selection'>
        <DataTable
          columns={employeeColumns}
          data={EMPLOYEES}
          searchColumn='name'
          searchPlaceholder='Search by name…'
          pageSize={5}
        />
      </DemoCard>

      <div className='grid gap-4 lg:grid-cols-2'>
        <DemoCard title='Tree' description='Expandable file/folder tree with keyboard-accessible selection'>
          <div className='flex gap-4'>
            <ScrollArea className='h-52 flex-1 rounded-md border p-2'>
              <Tree
                nodes={FILE_TREE}
                selectedId={selectedNode?.id ?? null}
                defaultExpandedIds={['src', 'apps', 'libs']}
                onSelect={setSelectedNode}
              />
            </ScrollArea>
            <div className='w-36 shrink-0 rounded-md border bg-muted/30 p-3 text-xs'>
              <p className='font-medium mb-1'>Selected</p>
              {selectedNode
                ? <p className='font-mono text-primary break-all'>{selectedNode.label}</p>
                : <p className='text-muted-foreground italic'>none</p>}
            </div>
          </div>
        </DemoCard>

        <DemoCard title='Table (basic)' description='Unstyled HTML table component'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Dept</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EMPLOYEES.slice(0, 5).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className='font-medium'>{e.name}</TableCell>
                  <TableCell>{e.department}</TableCell>
                  <TableCell>
                    <Badge variant={e.status === 'active' ? 'default' : 'secondary'} className='capitalize text-xs'>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>${e.salary.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DemoCard>
      </div>
    </div>
  )
}

function FormsTab() {
  const [sliderVal, setSliderVal] = useState([40])
  const [switchVal, setSwitchVal] = useState(false)
  const [radioVal, setRadioVal] = useState('email')
  const [selectVal, setSelectVal] = useState('')
  const [checks, setChecks] = useState({ notifications: true, marketing: false, updates: true })
  const [toggles, setToggles] = useState<string[]>(['bold'])

  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      <DemoCard title='Text Inputs'>
        <div className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='demo-name'>Full name</Label>
            <Input id='demo-name' placeholder='Alice Johnson' />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='demo-email'>Email</Label>
            <Input id='demo-email' type='email' placeholder='alice@example.com' />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='demo-bio'>Bio</Label>
            <Textarea id='demo-bio' placeholder='Tell us about yourself…' rows={3} />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='demo-disabled'>Disabled</Label>
            <Input id='demo-disabled' placeholder='Cannot edit this' disabled />
          </div>
        </div>
      </DemoCard>

      <DemoCard title='Select'>
        <div className='space-y-4'>
          <div className='space-y-1.5'>
            <Label>Department</Label>
            <Select value={selectVal} onValueChange={setSelectVal}>
              <SelectTrigger>
                <SelectValue placeholder='Choose department…' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='engineering'>Engineering</SelectItem>
                <SelectItem value='design'>Design</SelectItem>
                <SelectItem value='product'>Product</SelectItem>
                <SelectItem value='marketing'>Marketing</SelectItem>
                <SelectItem value='hr'>HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectVal && (
            <p className='text-sm text-muted-foreground'>
              Selected: <span className='font-medium text-foreground capitalize'>{selectVal}</span>
            </p>
          )}
        </div>
      </DemoCard>

      <DemoCard title='Checkbox'>
        <div className='space-y-3'>
          {(Object.keys(checks) as Array<keyof typeof checks>).map((key) => (
            <div key={key} className='flex items-center gap-2'>
              <Checkbox
                id={`check-${key}`}
                checked={checks[key]}
                onCheckedChange={(v) => setChecks((p) => ({ ...p, [key]: !!v }))}
              />
              <Label htmlFor={`check-${key}`} className='capitalize cursor-pointer'>{key}</Label>
            </div>
          ))}
          <Separator />
          <div className='flex items-center gap-2'>
            <Checkbox id='check-disabled' disabled />
            <Label htmlFor='check-disabled' className='text-muted-foreground'>Disabled</Label>
          </div>
        </div>
      </DemoCard>

      <DemoCard title='Radio Group'>
        <div className='space-y-1.5'>
          <Label>Notification method</Label>
          <RadioGroup value={radioVal} onValueChange={setRadioVal} className='mt-2'>
            {['email', 'sms', 'push', 'none'].map((v) => (
              <div key={v} className='flex items-center gap-2'>
                <RadioGroupItem value={v} id={`radio-${v}`} />
                <Label htmlFor={`radio-${v}`} className='capitalize cursor-pointer'>{v}</Label>
              </div>
            ))}
          </RadioGroup>
          <p className='text-xs text-muted-foreground mt-2'>Selected: <span className='font-medium'>{radioVal}</span></p>
        </div>
      </DemoCard>

      <DemoCard title='Switch'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <Label>Dark mode</Label>
              <p className='text-xs text-muted-foreground'>Toggle application theme</p>
            </div>
            <Switch checked={switchVal} onCheckedChange={setSwitchVal} />
          </div>
          <Separator />
          <div className='flex items-center justify-between opacity-50'>
            <Label>Beta features</Label>
            <Switch disabled />
          </div>
          <p className='text-xs text-muted-foreground'>Switch is: <span className='font-medium'>{switchVal ? 'on' : 'off'}</span></p>
        </div>
      </DemoCard>

      <DemoCard title='Slider'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>Volume</Label>
              <span className='text-sm tabular-nums text-muted-foreground'>{sliderVal[0]}%</span>
            </div>
            <Slider value={sliderVal} onValueChange={setSliderVal} min={0} max={100} step={1} />
          </div>
          <div className='space-y-2'>
            <Label>Brightness (read-only)</Label>
            <Slider defaultValue={[75]} disabled />
          </div>
        </div>
      </DemoCard>

      <DemoCard title='Toggle & ToggleGroup'>
        <div className='space-y-4'>
          <div className='space-y-1.5'>
            <Label>Standalone toggle</Label>
            <div className='flex gap-2 mt-1'>
              <Toggle aria-label='Bold' variant='outline'><Bold className='size-4' /></Toggle>
              <Toggle aria-label='Italic' variant='outline'><Italic className='size-4' /></Toggle>
              <Toggle aria-label='Underline' variant='outline'><Underline className='size-4' /></Toggle>
            </div>
          </div>
          <Separator />
          <div className='space-y-1.5'>
            <Label>ToggleGroup (single)</Label>
            <ToggleGroup
              type='single'
              value={toggles[0]}
              onValueChange={(v) => setToggles(v ? [v] : [])}
              variant='outline'
              className='mt-1 justify-start'
            >
              <ToggleGroupItem value='left' aria-label='Align left'><AlignLeft className='size-4' /></ToggleGroupItem>
              <ToggleGroupItem value='center' aria-label='Align center'><AlignCenter className='size-4' /></ToggleGroupItem>
              <ToggleGroupItem value='right' aria-label='Align right'><AlignRight className='size-4' /></ToggleGroupItem>
            </ToggleGroup>
            <p className='text-xs text-muted-foreground'>Alignment: {toggles[0] ?? 'none'}</p>
          </div>
        </div>
      </DemoCard>

      <DemoCard title='Pagination'>
        <div className='space-y-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href='#' /></PaginationItem>
              <PaginationItem><PaginationLink href='#'>1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href='#' isActive>2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href='#'>3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href='#' /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </DemoCard>
    </div>
  )
}

function OverlaysTab() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [cmdQuery, setCmdQuery] = useState('')

  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      <DemoCard title='Dialog' description='Modal dialog with trigger, header, body, and footer'>
        <div className='flex flex-wrap gap-2'>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant='outline'>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>
                  This is a sample dialog. You can put any content here — forms, confirmations, previews, etc.
                </DialogDescription>
              </DialogHeader>
              <div className='space-y-3'>
                <div className='space-y-1.5'>
                  <Label htmlFor='dialog-input'>Reason</Label>
                  <Input id='dialog-input' placeholder='Enter reason…' />
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DemoCard>

      <DemoCard title='Sheet' description='Slide-in panel from the side'>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant='outline'>Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>Update your account information here.</SheetDescription>
            </SheetHeader>
            <div className='mt-6 space-y-4 px-6'>
              <div className='space-y-1.5'>
                <Label>Display name</Label>
                <Input placeholder='Alice Johnson' />
              </div>
              <div className='space-y-1.5'>
                <Label>Email</Label>
                <Input type='email' placeholder='alice@shz.dev' />
              </div>
              <div className='space-y-1.5'>
                <Label>Bio</Label>
                <Textarea placeholder='About you…' rows={4} />
              </div>
              <Button className='w-full' onClick={() => setSheetOpen(false)}>Save changes</Button>
            </div>
          </SheetContent>
        </Sheet>
      </DemoCard>

      <DemoCard title='Popover' description='Floating content anchored to a trigger'>
        <div className='flex flex-wrap gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline'>Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className='w-64'>
              <div className='space-y-2'>
                <h4 className='font-medium text-sm'>Popover title</h4>
                <p className='text-xs text-muted-foreground'>This is a popover. It can contain forms, actions, or any other content.</p>
                <Separator />
                <div className='flex gap-2'>
                  <Button size='sm' className='flex-1'>Action</Button>
                  <Button size='sm' variant='outline' className='flex-1'>Cancel</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' size='sm'>With form</Button>
            </PopoverTrigger>
            <PopoverContent className='w-72'>
              <div className='space-y-3'>
                <p className='text-sm font-medium'>Quick add</p>
                <div className='space-y-1.5'>
                  <Label>Name</Label>
                  <Input placeholder='Enter name…' className='h-8' />
                </div>
                <div className='space-y-1.5'>
                  <Label>Department</Label>
                  <Select>
                    <SelectTrigger size='sm'><SelectValue placeholder='Select…' /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='eng'>Engineering</SelectItem>
                      <SelectItem value='design'>Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size='sm' className='w-full'>Add</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </DemoCard>

      <DemoCard title='Command (⌘K palette)' description='Searchable command menu powered by cmdk'>
        <div className='space-y-3'>
          <Button variant='outline' className='gap-2' onClick={() => setCmdOpen(true)}>
            <Search className='size-4' />
            <span className='text-muted-foreground flex-1 text-left'>Search commands…</span>
            <kbd className='pointer-events-none inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px] font-mono'>⌘K</kbd>
          </Button>
          <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
            <CommandInput placeholder='Type a command…' value={cmdQuery} onValueChange={setCmdQuery} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {COMMANDS.map(({ group, icon: Icon, items }) => (
                <CommandGroup key={group} heading={group}>
                  {items.map((item) => (
                    <CommandItem key={item} onSelect={() => { setCmdOpen(false); setCmdQuery('') }}>
                      <Icon className='size-4' />
                      {item}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </CommandDialog>

          <div className='rounded-md border'>
            <Command>
              <CommandInput placeholder='Inline command search…' />
              <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup heading='Pages'>
                  <CommandItem><LayoutDashboard className='size-4' />Dashboard</CommandItem>
                  <CommandItem><Users className='size-4' />Users</CommandItem>
                </CommandGroup>
                <CommandGroup heading='Tools'>
                  <CommandItem><Terminal className='size-4' />Terminal</CommandItem>
                  <CommandItem><Calculator className='size-4' />Calculator</CommandItem>
                  <CommandItem><Calendar className='size-4' />Calendar</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      </DemoCard>

      <DemoCard title='Tooltip' description='Hover tooltips with configurable placement'>
        <TooltipProvider>
          <div className='flex flex-wrap gap-3'>
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Tooltip key={side}>
                <TooltipTrigger asChild>
                  <Button variant='outline' size='sm'>{side}</Button>
                </TooltipTrigger>
                <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm'>With icon</Button>
              </TooltipTrigger>
              <TooltipContent className='flex items-center gap-1'>
                <Search className='size-3' /> Search shortcut
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </DemoCard>
    </div>
  )
}

function DisplayTab() {
  const [progress, setProgress] = useState(60)

  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      <DemoCard title='Accordion'>
        <Accordion type='single' collapsible defaultValue='item-1'>
          <AccordionItem value='item-1'>
            <AccordionTrigger>What is Module Federation?</AccordionTrigger>
            <AccordionContent>
              Module Federation lets you share code between separately deployed apps at runtime. Each app can consume components and modules from others without bundling them together.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>Why use a monorepo?</AccordionTrigger>
            <AccordionContent>
              A monorepo keeps all packages in a single repo for easier dependency management, atomic commits, and consistent tooling — while NX adds caching, task orchestration, and affected-graph analysis.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger>What is RSBuild?</AccordionTrigger>
            <AccordionContent>
              RSBuild is a Rspack-based build tool by ByteDance. It offers webpack-compatible plugin ecosystem with significantly faster build times.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DemoCard>

      <DemoCard title='Progress'>
        <div className='space-y-5'>
          {[
            { label: 'Storage used', value: progress, color: '' },
            { label: 'CPU', value: 45, color: '[&>div]:bg-blue-500' },
            { label: 'Memory', value: 72, color: '[&>div]:bg-amber-500' },
            { label: 'Network', value: 28, color: '[&>div]:bg-emerald-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className='space-y-1'>
              <div className='flex justify-between text-sm'>
                <span>{label}</span>
                <span className='tabular-nums text-muted-foreground'>{value}%</span>
              </div>
              <Progress value={value} className={color} />
            </div>
          ))}
          <div className='flex gap-2'>
            <Button size='sm' variant='outline' onClick={() => setProgress((p) => Math.max(0, p - 10))}>−10%</Button>
            <Button size='sm' variant='outline' onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10%</Button>
          </div>
        </div>
      </DemoCard>

      <DemoCard title='Badge'>
        <div className='flex flex-wrap gap-2'>
          <Badge>Default</Badge>
          <Badge variant='secondary'>Secondary</Badge>
          <Badge variant='outline'>Outline</Badge>
          <Badge variant='destructive'>Destructive</Badge>
          <Badge className='bg-emerald-500 text-white hover:bg-emerald-600'>Custom</Badge>
          <Badge className='gap-1'><Activity className='size-3' /> Live</Badge>
        </div>
      </DemoCard>

      <DemoCard title='Avatar'>
        <div className='flex flex-wrap items-center gap-4'>
          <Avatar className='size-12'>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <Avatar className='size-8'>
            <AvatarFallback className='text-xs bg-primary text-primary-foreground'>BM</AvatarFallback>
          </Avatar>
          <div className='flex -space-x-2'>
            {['AJ', 'BM', 'CW', 'DC'].map((initials) => (
              <Avatar key={initials} className='size-8 border-2 border-background'>
                <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </DemoCard>

      <DemoCard title='Skeleton'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <Skeleton className='size-10 rounded-full' />
            <div className='space-y-2 flex-1'>
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-3 w-1/2' />
            </div>
          </div>
          <Skeleton className='h-32 w-full rounded-md' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-4 w-4/6' />
          </div>
        </div>
      </DemoCard>

      <DemoCard title='Breadcrumb'>
        <div className='space-y-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href='#'>Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href='#'>Admin</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Dashboard</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href='#'>Apps</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href='#'>remote-admin</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href='#'>src</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>dashboard.tsx</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </DemoCard>

      <DemoCard title='Nested Tabs' description='Tabs component used inside another card'>
        <Tabs defaultValue='preview'>
          <TabsList>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
            <TabsTrigger value='code'>Code</TabsTrigger>
            <TabsTrigger value='docs'>Docs</TabsTrigger>
          </TabsList>
          <TabsContent value='preview'>
            <div className='rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground'>
              Component preview area
            </div>
          </TabsContent>
          <TabsContent value='code'>
            <div className='rounded-md bg-muted p-4 font-mono text-xs leading-relaxed'>
              {'<Button variant="outline">Click me</Button>'}
            </div>
          </TabsContent>
          <TabsContent value='docs'>
            <p className='text-sm text-muted-foreground'>
              Documentation and props reference for this component.
            </p>
          </TabsContent>
        </Tabs>
      </DemoCard>

      <DemoCard title='Separator'>
        <div className='space-y-4'>
          <div>
            <p className='text-sm font-medium'>Horizontal</p>
            <Separator className='my-2' />
            <p className='text-sm text-muted-foreground'>Content below separator</p>
          </div>
          <div className='flex items-center gap-4 h-8'>
            <span className='text-sm'>Left</span>
            <Separator orientation='vertical' />
            <span className='text-sm'>Middle</span>
            <Separator orientation='vertical' />
            <span className='text-sm'>Right</span>
          </div>
        </div>
      </DemoCard>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Component Demo</h1>
          <p className='text-sm text-muted-foreground'>Full showcase of @shz/components — remote_admin · port 3003</p>
        </div>
        <Badge variant='secondary' className='text-xs'>33 components</Badge>
      </div>

      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='data'>Data</TabsTrigger>
          <TabsTrigger value='forms'>Forms</TabsTrigger>
          <TabsTrigger value='overlays'>Overlays</TabsTrigger>
          <TabsTrigger value='display'>Display</TabsTrigger>
        </TabsList>

        <TabsContent value='overview'><OverviewTab /></TabsContent>
        <TabsContent value='data'><DataTab /></TabsContent>
        <TabsContent value='forms'><FormsTab /></TabsContent>
        <TabsContent value='overlays'><OverlaysTab /></TabsContent>
        <TabsContent value='display'><DisplayTab /></TabsContent>
      </Tabs>
    </div>
  )
}
