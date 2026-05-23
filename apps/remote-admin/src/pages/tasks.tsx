import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@shz/components'
import { Plus, CheckCheck, Clock, CircleDashed, AlertCircle, Filter } from 'lucide-react'

type Priority = 'high' | 'medium' | 'low'
type TaskStatus = 'todo' | 'in-progress' | 'done' | 'cancelled'

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assignee: string
  due: string
}

const MOCK_TASKS: Task[] = [
  { id: 'T-001', title: 'Audit user permissions', description: 'Review and update access levels for all admin users.', status: 'in-progress', priority: 'high', assignee: 'Alice J.', due: '2026-05-28' },
  { id: 'T-002', title: 'Export Q1 analytics report', description: 'Generate and distribute the quarterly metrics report.', status: 'done', priority: 'medium', assignee: 'Bob M.', due: '2026-05-20' },
  { id: 'T-003', title: 'Update onboarding flow', description: 'Revise the new user onboarding wizard based on feedback.', status: 'todo', priority: 'high', assignee: 'Carol W.', due: '2026-06-01' },
  { id: 'T-004', title: 'Migrate legacy database tables', description: 'Move remaining tables to the new schema format.', status: 'in-progress', priority: 'high', assignee: 'David C.', due: '2026-05-30' },
  { id: 'T-005', title: 'Set up staging environment', description: 'Configure and verify the new staging server.', status: 'todo', priority: 'medium', assignee: 'Eva P.', due: '2026-06-05' },
  { id: 'T-006', title: 'Write API documentation', description: 'Document all public REST endpoints with examples.', status: 'todo', priority: 'low', assignee: 'Frank L.', due: '2026-06-10' },
  { id: 'T-007', title: 'Fix CSV import bug', description: 'Resolve encoding issue when importing non-ASCII filenames.', status: 'cancelled', priority: 'low', assignee: 'Grace K.', due: '2026-05-22' },
  { id: 'T-008', title: 'Implement 2FA enforcement', description: 'Force MFA for all admin accounts.', status: 'in-progress', priority: 'high', assignee: 'Henry B.', due: '2026-05-27' },
]

const STATUS_ICON: Record<TaskStatus, React.ElementType> = {
  todo: CircleDashed,
  'in-progress': Clock,
  done: CheckCheck,
  cancelled: AlertCircle,
}

const STATUS_CLASSES: Record<TaskStatus, string> = {
  todo: 'text-muted-foreground',
  'in-progress': 'text-blue-600 dark:text-blue-400',
  done: 'text-emerald-600 dark:text-emerald-400',
  cancelled: 'text-rose-500 dark:text-rose-400',
}

const PRIORITY_VARIANT: Record<Priority, 'default' | 'secondary' | 'outline'> = {
  high: 'default',
  medium: 'secondary',
  low: 'outline',
}

const FILTERS: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default function AdminTasksPage() {
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all')

  const tasks = filter === 'all' ? MOCK_TASKS : MOCK_TASKS.filter((t) => t.status === filter)

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Tasks</h1>
          <p className='text-sm text-muted-foreground'>Track and manage admin tasks.</p>
        </div>
        <Button size='sm' className='gap-1.5'>
          <Plus className='size-4' />
          New Task
        </Button>
      </div>

      {/* Filter tabs */}
      <div className='flex items-center gap-1 rounded-lg border bg-muted/40 p-1 w-fit'>
        <Filter className='ml-1 size-3.5 text-muted-foreground' />
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='divide-y'>
            {tasks.map((task) => {
              const StatusIcon = STATUS_ICON[task.status]
              return (
                <div key={task.id} className='flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/30'>
                  <StatusIcon className={`mt-0.5 size-4 shrink-0 ${STATUS_CLASSES[task.status]}`} />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-mono text-xs text-muted-foreground'>{task.id}</span>
                      <p className='font-medium leading-none'>{task.title}</p>
                    </div>
                    <p className='mt-1 text-xs text-muted-foreground line-clamp-1'>{task.description}</p>
                  </div>
                  <div className='flex items-center gap-3 shrink-0'>
                    <Badge variant={PRIORITY_VARIANT[task.priority]} className='capitalize text-xs'>
                      {task.priority}
                    </Badge>
                    <span className='text-xs text-muted-foreground hidden sm:block'>{task.assignee}</span>
                    <span className='text-xs text-muted-foreground tabular-nums hidden md:block'>{task.due}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
