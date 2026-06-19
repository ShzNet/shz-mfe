import { useMemo, useState } from 'react'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shz/components'

type LaneId = 'todo' | 'doing' | 'done'

interface Task {
  id: string
  title: string
  assignee: string
  priority: 'high' | 'medium' | 'low'
}

const LANE_TITLES: Record<LaneId, string> = {
  todo: 'To Do',
  doing: 'In Progress',
  done: 'Done',
}

const INITIAL: Record<LaneId, Task[]> = {
  todo: [
    { id: 'T1', title: 'Define report KPIs', assignee: 'Alice', priority: 'high' },
    { id: 'T2', title: 'Draft onboarding flow', assignee: 'Bob', priority: 'medium' },
  ],
  doing: [
    { id: 'T3', title: 'Implement projects CRUD form', assignee: 'Carol', priority: 'high' },
  ],
  done: [
    { id: 'T4', title: 'Set up remote module routing', assignee: 'David', priority: 'low' },
  ],
}

export default function KanbanDndPage() {
  const [lanes, setLanes] = useState<Record<LaneId, Task[]>>(INITIAL)
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)

  const counts = useMemo(() => ({
    total: lanes.todo.length + lanes.doing.length + lanes.done.length,
    done: lanes.done.length,
  }), [lanes])

  function moveTask(taskId: string, targetLane: LaneId) {
    let moving: Task | null = null
    const next: Record<LaneId, Task[]> = {
      todo: lanes.todo.filter((t) => {
        if (t.id === taskId) moving = t
        return t.id !== taskId
      }),
      doing: lanes.doing.filter((t) => {
        if (t.id === taskId) moving = t
        return t.id !== taskId
      }),
      done: lanes.done.filter((t) => {
        if (t.id === taskId) moving = t
        return t.id !== taskId
      }),
    }

    if (moving) next[targetLane] = [...next[targetLane], moving]
    setLanes(next)
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='pt-4'>
        <h1 className='text-2xl font-bold tracking-tight'>Kanban Drag & Drop</h1>
        <p className='text-sm text-muted-foreground'>Simple HTML5 drag-drop board for admin task tracking.</p>
      </div>

      <div className='text-sm text-muted-foreground'>
        Completed {counts.done}/{counts.total}
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        {(['todo', 'doing', 'done'] as const).map((lane) => (
          <Card
            key={lane}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (draggingTaskId) moveTask(draggingTaskId, lane)
              setDraggingTaskId(null)
            }}
          >
            <CardHeader>
              <CardTitle className='text-base'>{LANE_TITLES[lane]}</CardTitle>
              <CardDescription>{lanes[lane].length} task(s)</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {lanes[lane].map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => setDraggingTaskId(task.id)}
                  onDragEnd={() => setDraggingTaskId(null)}
                  className='cursor-grab rounded-md border bg-background p-3 active:cursor-grabbing'
                >
                  <p className='text-sm font-medium'>{task.title}</p>
                  <div className='mt-2 flex items-center justify-between'>
                    <span className='text-xs text-muted-foreground'>{task.assignee}</span>
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'} className='capitalize'>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
