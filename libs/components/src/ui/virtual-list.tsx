import * as React from 'react'
import { ScrollArea } from './scroll-area'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  height: number
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
}

export function VirtualList<T>({ items, itemHeight, height, overscan = 5, renderItem }: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0)
  const totalHeight = items.length * itemHeight
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const end = Math.min(items.length, Math.ceil((scrollTop + height) / itemHeight) + overscan)
  const visible = items.slice(start, end)

  return (
    <ScrollArea className='rounded-md border' style={{ height }} onScrollCapture={(e) => setScrollTop((e.target as HTMLElement).scrollTop)}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: start * itemHeight, left: 0, right: 0 }}>
          {visible.map((item, i) => (
            <div key={start + i} style={{ height: itemHeight }} className='px-3 py-2'>
              {renderItem(item, start + i)}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
