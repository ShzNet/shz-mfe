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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DateInput,
  Input,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  SortableHeader,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  type ColumnDef,
} from '@shz/components'
import { CheckCircle2, Clock, FolderKanban, Pencil, Plus, Trash2 } from 'lucide-react'

type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'at-risk'
type Priority = 'high' | 'medium' | 'low'
type Billing = 'fixed' | 'time-material'

interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  due: string
  priority: Priority
  budget: number
  owner: string
  client: string
  category: string
  billing: Billing
  isPublic: boolean
  riskAccepted: boolean
  tags: string[]
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'P1',
    name: 'MFE Platform Rewrite',
    description: 'Migrate all apps to RSBuild + Module Federation',
    status: 'active',
    progress: 72,
    due: '2026-07-01',
    priority: 'high',
    budget: 180000,
    owner: 'Alice Johnson',
    client: 'Internal',
    category: 'Platform',
    billing: 'fixed',
    isPublic: false,
    riskAccepted: true,
    tags: ['mfe', 'platform'],
  },
  {
    id: 'P2',
    name: 'Design System v2',
    description: 'Expand @shz/components with new primitives',
    status: 'active',
    progress: 88,
    due: '2026-06-15',
    priority: 'high',
    budget: 90000,
    owner: 'Bob Martinez',
    client: 'Internal',
    category: 'Design',
    billing: 'time-material',
    isPublic: true,
    riskAccepted: false,
    tags: ['design-system', 'ui'],
  },
  {
    id: 'P3',
    name: 'Auth Service Integration',
    description: 'Replace mock auth with Keycloak OIDC',
    status: 'at-risk',
    progress: 41,
    due: '2026-06-10',
    priority: 'high',
    budget: 70000,
    owner: 'Carol White',
    client: 'Enterprise Client',
    category: 'Security',
    billing: 'fixed',
    isPublic: false,
    riskAccepted: true,
    tags: ['auth', 'oidc'],
  },
]

const STATUS_STYLES: Record<ProjectStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  active: { label: 'Active', variant: 'default' },
  'on-hold': { label: 'On Hold', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'outline' },
  'at-risk': { label: 'At Risk', variant: 'destructive' },
}

const PRIORITY_VARIANT = { high: 'destructive', medium: 'secondary', low: 'outline' } as const

type ProjectForm = Omit<Project, 'id'>

const EMPTY_FORM: ProjectForm = {
  name: '',
  description: '',
  status: 'active',
  progress: 20,
  due: '',
  priority: 'medium',
  budget: 10000,
  owner: '',
  client: '',
  category: 'Platform',
  billing: 'fixed',
  isPublic: false,
  riskAccepted: false,
  tags: [],
}

function ProjectCard({ project, onEdit, onDelete }: { project: Project; onEdit: (p: Project) => void; onDelete: (id: string) => void }) {
  const s = STATUS_STYLES[project.status]

  return (
    <Card className='transition-shadow hover:shadow-md'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <FolderKanban className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
            <CardTitle className='text-base leading-tight'>{project.name}</CardTitle>
          </div>
          <Badge variant={s.variant} className='shrink-0 text-xs'>{s.label}</Badge>
        </div>
        <CardDescription className='line-clamp-2'>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='space-y-1'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>

        <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
          <div>Owner: <span className='text-foreground'>{project.owner || 'N/A'}</span></div>
          <div>Due: <span className='text-foreground'>{project.due || 'N/A'}</span></div>
          <div>Budget: <span className='text-foreground'>${project.budget.toLocaleString()}</span></div>
          <div>Billing: <span className='text-foreground capitalize'>{project.billing}</span></div>
        </div>

        <div className='flex items-center justify-between'>
          <Badge variant={PRIORITY_VARIANT[project.priority]} className='capitalize'>{project.priority}</Badge>
          <div className='flex items-center gap-1'>
            <Button variant='ghost' size='sm' className='h-8 gap-1' onClick={() => onEdit(project)}>
              <Pencil className='size-3.5' /> Edit
            </Button>
            <Button variant='ghost' size='sm' className='h-8 text-destructive hover:text-destructive' onClick={() => onDelete(project.id)}>
              <Trash2 className='size-3.5' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM)

  const columns: ColumnDef<Project, unknown>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column}>Project</SortableHeader>,
      cell: ({ row }) => (
        <div>
          <p className='text-sm font-medium'>{row.original.name}</p>
          <p className='line-clamp-1 text-xs text-muted-foreground'>{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = STATUS_STYLES[row.original.status]
        return <Badge variant={s.variant}>{s.label}</Badge>
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => <Badge variant={PRIORITY_VARIANT[row.original.priority]} className='capitalize'>{row.original.priority}</Badge>,
    },
    {
      accessorKey: 'progress',
      header: ({ column }) => <SortableHeader column={column}>Progress</SortableHeader>,
      cell: ({ row }) => <span className='tabular-nums'>{row.original.progress}%</span>,
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
    },
    {
      accessorKey: 'due',
      header: 'Due',
      cell: ({ row }) => <span className='tabular-nums text-muted-foreground'>{row.original.due}</span>,
    },
  ], [])

  const byStatus = (s: ProjectStatus) => projects.filter((p) => p.status === s)

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  function openEdit(project: Project) {
    setEditingId(project.id)
    setForm({ ...project, tags: [...project.tags] })
    setDialogOpen(true)
  }

  function saveProject() {
    if (!form.name.trim()) return

    if (editingId) {
      setProjects((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)))
    } else {
      const id = `P${Date.now()}`
      setProjects((prev) => [{ id, ...form }, ...prev])
    }
    setDialogOpen(false)
  }

  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Projects</h1>
          <p className='text-sm text-muted-foreground'>Admin project management with full CRUD form fields.</p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='overflow-hidden rounded-md border'>
            <button className={`px-3 py-1.5 text-xs font-medium ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} onClick={() => setView('grid')}>Grid</button>
            <button className={`px-3 py-1.5 text-xs font-medium ${view === 'table' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} onClick={() => setView('table')}>Table</button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='gap-1.5' onClick={openCreate}><Plus className='size-4' />New Project</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[85svh] overflow-auto sm:max-w-2xl'>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Project' : 'Create Project'}</DialogTitle>
              </DialogHeader>

              <div className='grid gap-4'>
                <div className='grid gap-1.5'>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder='Project name' />
                </div>

                <div className='grid gap-1.5'>
                  <Label>Description</Label>
                  <Textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder='Short description' />
                </div>

                <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                  <div className='grid gap-1.5'>
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as ProjectStatus }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='on-hold'>On Hold</SelectItem>
                        <SelectItem value='completed'>Completed</SelectItem>
                        <SelectItem value='at-risk'>At Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid gap-1.5'>
                    <Label>Priority</Label>
                    <Select value={form.priority} onValueChange={(v) => setForm((p) => ({ ...p, priority: v as Priority }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value='high'>High</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='low'>Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid gap-1.5'>
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Platform'>Platform</SelectItem>
                        <SelectItem value='Design'>Design</SelectItem>
                        <SelectItem value='Security'>Security</SelectItem>
                        <SelectItem value='Analytics'>Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                  <div className='grid gap-1.5'>
                    <Label>Owner</Label>
                    <Input value={form.owner} onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))} placeholder='Owner name' />
                  </div>
                  <div className='grid gap-1.5'>
                    <Label>Client</Label>
                    <Input value={form.client} onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))} placeholder='Client name' />
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                  <div className='grid gap-1.5'>
                    <Label>Due Date</Label>
                    <DateInput value={form.due} onChange={(e) => setForm((p) => ({ ...p, due: e.target.value }))} />
                  </div>
                  <div className='grid gap-1.5'>
                    <Label>Budget (USD)</Label>
                    <Input type='number' value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: Number(e.target.value || 0) }))} />
                  </div>
                </div>

                <div className='grid gap-2'>
                  <Label>Progress: {form.progress}%</Label>
                  <Slider value={[form.progress]} max={100} step={1} onValueChange={(v) => setForm((p) => ({ ...p, progress: v[0] ?? 0 }))} />
                </div>

                <div className='grid gap-2'>
                  <Label>Billing Model</Label>
                  <RadioGroup value={form.billing} onValueChange={(v) => setForm((p) => ({ ...p, billing: v as Billing }))} className='flex gap-4'>
                    <div className='flex items-center gap-2'><RadioGroupItem value='fixed' id='billing-fixed' /><Label htmlFor='billing-fixed'>Fixed</Label></div>
                    <div className='flex items-center gap-2'><RadioGroupItem value='time-material' id='billing-tm' /><Label htmlFor='billing-tm'>Time & Material</Label></div>
                  </RadioGroup>
                </div>

                <div className='grid gap-2'>
                  <Label>Tags</Label>
                  <div className='flex flex-wrap gap-2'>
                    {['mfe', 'design', 'security', 'analytics', 'backend'].map((tag) => {
                      const active = form.tags.includes(tag)
                      return (
                        <Toggle
                          key={tag}
                          pressed={active}
                          onPressedChange={(pressed) => {
                            setForm((p) => ({
                              ...p,
                              tags: pressed ? [...p.tags, tag] : p.tags.filter((t) => t !== tag),
                            }))
                          }}
                        >
                          {tag}
                        </Toggle>
                      )
                    })}
                  </div>
                </div>

                <div className='grid gap-2 md:grid-cols-2'>
                  <div className='flex items-center gap-2'>
                    <Checkbox checked={form.riskAccepted} onCheckedChange={(v) => setForm((p) => ({ ...p, riskAccepted: !!v }))} id='risk-accepted' />
                    <Label htmlFor='risk-accepted'>Risk accepted</Label>
                  </div>
                  <div className='flex items-center justify-between rounded-md border px-3 py-2'>
                    <Label htmlFor='is-public'>Public project</Label>
                    <Switch id='is-public' checked={form.isPublic} onCheckedChange={(v) => setForm((p) => ({ ...p, isPublic: v }))} />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant='outline' onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveProject}>{editingId ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardContent className='pt-4'>
            <p className='text-xs text-muted-foreground'>Total</p>
            <p className='text-xl font-semibold'>{projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-4'>
            <p className='text-xs text-muted-foreground'>Active</p>
            <p className='text-xl font-semibold'>{byStatus('active').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-4'>
            <p className='text-xs text-muted-foreground'>Completed</p>
            <p className='text-xl font-semibold'>{byStatus('completed').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-4'>
            <p className='text-xs text-muted-foreground'>At Risk</p>
            <p className='text-xl font-semibold'>{byStatus('at-risk').length}</p>
          </CardContent>
        </Card>
      </div>

      {view === 'table' ? (
        <Card>
          <CardContent className='pt-4'>
            <DataTable columns={columns} data={projects} searchColumn='name' searchPlaceholder='Search projects...' pageSize={8} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue='all'>
          <TabsList>
            <TabsTrigger value='all'>All ({projects.length})</TabsTrigger>
            <TabsTrigger value='active'>Active ({byStatus('active').length})</TabsTrigger>
            <TabsTrigger value='at-risk'>At Risk ({byStatus('at-risk').length})</TabsTrigger>
            <TabsTrigger value='on-hold'>On Hold ({byStatus('on-hold').length})</TabsTrigger>
            <TabsTrigger value='completed'>Completed ({byStatus('completed').length})</TabsTrigger>
          </TabsList>
          {(['all', 'active', 'at-risk', 'on-hold', 'completed'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {(tab === 'all' ? projects : byStatus(tab as ProjectStatus)).map((project) => (
                  <ProjectCard key={project.id} project={project} onEdit={openEdit} onDelete={deleteProject} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <div className='flex items-center gap-4 text-xs text-muted-foreground'>
        <span className='inline-flex items-center gap-1'><CheckCircle2 className='size-3.5' /> CRUD enabled</span>
        <span className='inline-flex items-center gap-1'><Clock className='size-3.5' /> Full form fields</span>
      </div>
    </div>
  )
}
