import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Separator } from './separator'

export type CommandBarItem =
  | {
      type?: 'action'
      id: string
      label: string
      icon: LucideIcon
      onClick: () => void
      show?: boolean
      disabled?: boolean
      variant?: 'default' | 'outline' | 'ghost'
      destructive?: boolean
    }
  | {
      type: 'separator'
      id: string
      show?: boolean
    }

const MORE_BTN_WIDTH = 40
const GAP = 8

export function CommandBar({ items }: { items: CommandBarItem[] }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const measureRef = React.useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = React.useState<number>(Infinity)

  const activeItems = items.filter((item) => item.show !== false)

  React.useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const recalc = () => {
      const available = container.getBoundingClientRect().width
      const children = Array.from(measure.children) as HTMLElement[]
      let used = 0
      let count = 0

      for (let i = 0; i < children.length; i++) {
        const w = children[i].getBoundingClientRect().width
        const gap = count > 0 ? GAP : 0
        const remaining = activeItems.length - (i + 1)
        const moreWidth = remaining > 0 ? MORE_BTN_WIDTH + GAP : 0

        if (used + gap + w + moreWidth > available + 1) break
        used += gap + w
        count++
      }

      setVisibleCount(count)
    }

    const ro = new ResizeObserver(recalc)
    ro.observe(container)
    recalc()
    return () => ro.disconnect()
  }, [activeItems.length])

  const shown = activeItems.slice(0, visibleCount)
  const overflow = activeItems.slice(visibleCount)

  return (
    <div ref={containerRef} className='relative flex min-w-0 flex-1 items-center gap-2 overflow-hidden'>
      {/* Hidden measurement row */}
      <div
        ref={measureRef}
        aria-hidden
        className='pointer-events-none invisible absolute inset-0 flex items-center gap-2'
      >
        {activeItems.map((item) =>
          item.type === 'separator' ? (
            <Separator key={item.id} orientation='vertical' className='h-5' />
          ) : (
            <Button key={item.id} variant={item.variant ?? 'outline'} size='sm' className='shrink-0 gap-1.5 whitespace-nowrap'>
              <item.icon className='size-4' />
              {item.label}
            </Button>
          ),
        )}
      </div>

      {/* Visible items */}
      {shown.map((item) =>
        item.type === 'separator' ? (
          <Separator key={item.id} orientation='vertical' className='mx-1 h-5 shrink-0' />
        ) : (
          <Button
            key={item.id}
            variant={item.variant ?? 'outline'}
            size='sm'
            disabled={item.disabled}
            onClick={item.onClick}
            className={[
              'shrink-0 gap-1.5 whitespace-nowrap',
              item.destructive ? 'text-destructive hover:bg-destructive/10 hover:text-destructive' : '',
            ].join(' ')}
          >
            <item.icon className='size-4' />
            {item.label}
          </Button>
        ),
      )}

      {/* Overflow dropdown */}
      {overflow.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='shrink-0'>
              <MoreHorizontal className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='min-w-40'>
            {overflow.map((item) =>
              item.type === 'separator' ? (
                <DropdownMenuSeparator key={item.id} />
              ) : (
                <DropdownMenuItem
                  key={item.id}
                  disabled={item.disabled}
                  onClick={item.onClick}
                  className={['gap-2', item.destructive ? 'text-destructive focus:text-destructive' : ''].join(' ')}
                >
                  <item.icon className='size-4' />
                  {item.label}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
