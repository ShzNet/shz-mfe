import * as React from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Checkbox } from '../checkbox'
import { cn } from '../../lib/utils'

export interface ColumnManagerItem {
  id: string
  label: string
  locked?: boolean
}

interface ColumnManagerProps {
  items: ColumnManagerItem[]
  visibility: Record<string, boolean>
  onVisibilityChange: (columnId: string, visible: boolean) => void
  onOrderChange: (items: ColumnManagerItem[]) => void
  className?: string
}

export function ColumnManager({
  items,
  visibility,
  onVisibilityChange,
  onOrderChange,
  className,
}: ColumnManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    onOrderChange(arrayMove(items, oldIndex, newIndex))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className={cn('space-y-2', className)}>
          {items.map((item) => (
            <SortableColumnItem
              key={item.id}
              item={item}
              checked={visibility[item.id] !== false}
              onCheckedChange={(checked) => onVisibilityChange(item.id, checked)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableColumnItem({
  item,
  checked,
  onCheckedChange,
}: {
  item: ColumnManagerItem
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: item.locked,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        'flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm transition-colors',
        'bg-background hover:bg-muted/30',
        isDragging && 'z-10 opacity-80 shadow-md',
        item.locked && 'bg-muted/20',
      )}
    >
      <button
        type='button'
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground',
          item.locked ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted',
        )}
        aria-label={`Reorder ${item.label}`}
        {...(item.locked ? {} : attributes)}
        {...(item.locked ? {} : listeners)}
      >
        <GripVertical className='size-3.5' />
      </button>

      <div className='min-w-0 flex-1'>
        <p className='truncate font-medium'>{item.label}</p>
      </div>

      <Checkbox
        checked={item.locked ? true : checked}
        disabled={item.locked}
        onCheckedChange={(value) => onCheckedChange(!!value)}
      />
    </div>
  )
}
