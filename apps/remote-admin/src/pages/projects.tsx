import { useState } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Badge, Button, Progress, Avatar, AvatarFallback,
  DataTable, SortableHeader, type ColumnDef,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Input, Textarea, Label,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@shz/components'
import { Plus, FolderKanban, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'at-risk'

interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  team: string[]
  due: string
  priority: 'high' | 'medium' | 'low'
  tasks: { done: number; total: number }
}

const PROJECTS: Project[] = [
  { id: 'P1', name: 'MFE Platform Rewrite', description: 'Migrate all apps to RSBuild + Module Federation', status: 'active', progress: 72, team: ['AJ', 'BM', 'CW'], due: '2026-07-01', priority: 'high', tasks: { done: 34, total: 47 } },
  { id: 'P2', name: 'Design System v2', description: 'Expand @shz/components with new primitives', status: 'active', progress: 88, team: ['DC', 'EP'], due: '2026-06-15', priority: 'high', tasks: { done: 22, total: 25 } },
  { id: 'P3', name: 'Auth Service Integration', description: 'Replace mock auth with Keycloak OIDC', status: 'at-risk', progress: 41, team: ['FL', 'GK'], due: '2026-06-10', priority: 'high', tasks: { done: 12, total: 29 } },
  { id: 'P4', name: 'CI/CD Pipeline', description: 'GitHub Actions for all NX targets + Docker builds', status: 'completed', progress: 100, team: ['HB'], due: '2026-05-20', priority: 'medium', tasks: { done: 18, total: 18 } },
  { id: 'P5', name: 'Mobile PWA', description: 'Progressive web app wrapper for mobile users', status: 'on-hold', progress: 15, team: ['IW', 'JS'], due: '2026-08-30', priority: 'low', tasks: { done: 4, total: 26 } },
  { id: 'P6', name: 'Analytics Dashboard', description: 'Real-time metrics with WebSocket data feed', status: 'active', progress: 55, team: ['KA', 'LG'], due: '2026-07-15', priority: 'medium', tasks: { done: 17, total: 31 } },
]

const STATUS_STYLES: Record<ProjectStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: React.ElementType }> = {
  active: { label: 'Active', variant: 'default', icon: CheckCircle2 },
  'on-hold': { label: 'On Hold', variant: 'secondary', icon: Clock },
  completed: { label: 'Completed', variant: 'outline', icon: CheckCircle2 },
  'at-risk': { label: 'At Risk', variant: 'destructive', icon: AlertCircle },
}

const PRIORITY_VARIANT = { high: 'destructive', medium: 'secondary', low: 'outline' } as const

const columns: ColumnDef<Project, unknown>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader column={column}>Project</SortableHeader>,
    cell: ({ row }) => (
      <div>
        <p className='font-medium text-sm'>{row.original.name}</p>
        <p className='text-xs text-muted-foreground line-clamp-1'>{row.original.description}</p>
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
    cell: ({ row }) => (
      <Badge variant={PRIORITY_VARIANT[row.original.priority]} className='capitalize'>{row.original.priority}</Badge>
    ),
  },
  {
    accessorKey: 'progress',
    header: ({ column }) => <SortableHeader column={column}>Progress</SortableHeader>,
    cell: ({ row }) => (
      <div className='w-28 space-y-1'>
        <Progress value={row.original.progress} />
        <p className='text-xs text-muted-foreground text-right'>{row.original.progress}%</p>
      </div>
    ),
  },
  {
    accessorKey: 'tasks',
    header: 'Tasks',
    cell: ({ row }) => (
      <span className='text-sm tabular-nums text-muted-foreground'>
        {row.original.tasks.done}/{row.original.tasks.total}
      </span>
    ),
  },
  {
    accessorKey: 'team',
    header: 'Team',
    cell: ({ row }) => (
      <div className='flex -space-x-1.5'>
        {row.original.team.map((t) => (
          <Avatar key={t} className='size-6 border-2 border-background'>
            <AvatarFallback className='text-[10px]'>{t}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'due',
    header: ({ column }) => <SortableHeader column={column}>Due</SortableHeader>,
    cell: ({ row }) => <span className='text-sm tabular-nums text-muted-foreground'>{row.original.due}</span>,
  },
]

function ProjectCard({ project }: { project: Project }) {
  const s = STATUS_STYLES[project.status]
  const StatusIcon = s.icon
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <FolderKanban className='size-4 text-muted-foreground shrink-0 mt-0.5' />
            <CardTitle className='text-base leading-tight'>{project.name}</CardTitle>
          </div>
          <Badge variant={s.variant} className='shrink-0 gap-1 text-xs'>
            <StatusIcon className='size-3' />
            {s.label}
          </Badge>
        </div>
        <CardDescription className='line-clamp-2'>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-1.5'>
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>Progress</span>
            <span className='tabular-nums'>{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <CheckCircle2 className='size-3' />
            <span>{project.tasks.done}/{project.tasks.total} tasks</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='size-3' />
            <span>{project.due}</span>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex -space-x-1.5'>
            {project.team.map((t) => (
              <Avatar key={t} className='size-7 border-2 border-background'>
                <AvatarFallback className='text-xs'>{t}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Badge variant={PRIORITY_VARIANT[project.priority]} className='capitalize text-xs'>
            {project.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProjectsPage() {
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [dialogOpen, setDialogOpen] = useState(false)

  const byStatus = (s: ProjectStatus) => PROJECTS.filter((p) => p.status === s)

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Projects</h1>
          <p className='text-sm text-muted-foreground'>{PROJECTS.length} projects across all teams.</p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex rounded-md border overflow-hidden'>
            <button
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => setView('grid')}
            >Grid</button>
            <button
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'table' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => setView('table')}
            >Table</button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='gap-1.5'><Plus className='size-4' />New Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                <div className='space-y-1.5'><Label>Project name</Label><Input placeholder='e.g. Auth Service' /></div>
                <div className='space-y-1.5'><Label>Description</Label><Textarea placeholder='What is this project about?' rows={3} /></div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-1.5'>
                    <Label>Priority</Label>
                    <Select><SelectTrigger><SelectValue placeholder='Select…' /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value='high'>High</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='low'>Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-1.5'><Label>Due date</Label><Input type='date' /></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setDialogOpen(false)}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === 'table' ? (
        <Card>
          <CardContent className='pt-4'>
            <DataTable columns={columns} data={PROJECTS} searchColumn='name' searchPlaceholder='Search projects…' pageSize={6} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue='all'>
          <TabsList>
            <TabsTrigger value='all'>All ({PROJECTS.length})</TabsTrigger>
            <TabsTrigger value='active'>Active ({byStatus('active').length})</TabsTrigger>
            <TabsTrigger value='at-risk'>At Risk ({byStatus('at-risk').length})</TabsTrigger>
            <TabsTrigger value='on-hold'>On Hold ({byStatus('on-hold').length})</TabsTrigger>
            <TabsTrigger value='completed'>Completed ({byStatus('completed').length})</TabsTrigger>
          </TabsList>
          {(['all', 'active', 'at-risk', 'on-hold', 'completed'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {(tab === 'all' ? PROJECTS : byStatus(tab as ProjectStatus)).map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
