import * as React from 'react'
import { cn } from '../../lib/utils'
import { Badge } from '../badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'

export type OverflowBadgeItem = {
  id: React.Key
  label: string
  tooltip?: React.ReactNode
}

type OverflowBadgesProps = {
  items: OverflowBadgeItem[]
  className?: string
  badgeClassName?: string
  overflowBadgeClassName?: string
  minTruncatedWidth?: number
  gap?: number
}

type OverflowLayout = {
  fullCount: number
  visibleCount: number
}

const DEFAULT_GAP = 6
const DEFAULT_MIN_TRUNCATED_WIDTH = 28

function sum(widths: number[], end: number) {
  let total = 0
  for (let index = 0; index < end; index++) total += widths[index] ?? 0
  return total
}

function getGapWidth(count: number, gap: number) {
  return Math.max(0, count - 1) * gap
}

function calculateOverflowLayout(
  available: number,
  itemWidths: number[],
  overflowWidths: Map<number, number>,
  minTruncatedWidth: number,
  gap: number,
): OverflowLayout {
  const count = itemWidths.length
  if (count === 0) return { fullCount: 0, visibleCount: 0 }

  const allWidth = sum(itemWidths, count) + getGapWidth(count, gap)
  if (allWidth <= available + 1) return { fullCount: count, visibleCount: count }

  for (let partialIndex = count - 1; partialIndex >= 0; partialIndex--) {
    const hiddenCount = count - partialIndex - 1
    const overflowWidth = hiddenCount > 0 ? (overflowWidths.get(hiddenCount) ?? 32) : 0
    const elementCount = partialIndex + 1 + (hiddenCount > 0 ? 1 : 0)
    const availableForPartial =
      available - sum(itemWidths, partialIndex) - overflowWidth - getGapWidth(elementCount, gap)

    if (availableForPartial >= minTruncatedWidth) {
      const partialFitsFully = availableForPartial >= (itemWidths[partialIndex] ?? 0)
      return {
        fullCount: partialFitsFully ? partialIndex + 1 : partialIndex,
        visibleCount: partialIndex + 1,
      }
    }
  }

  return { fullCount: 0, visibleCount: 0 }
}

export function OverflowBadges({
  items,
  className,
  badgeClassName,
  overflowBadgeClassName,
  minTruncatedWidth = DEFAULT_MIN_TRUNCATED_WIDTH,
  gap = DEFAULT_GAP,
}: OverflowBadgesProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const measureRef = React.useRef<HTMLDivElement>(null)
  const [layout, setLayout] = React.useState<OverflowLayout>({ fullCount: items.length, visibleCount: items.length })

  React.useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const recalc = () => {
      const available = container.getBoundingClientRect().width
      const itemElements = Array.from(measure.querySelectorAll<HTMLElement>('[data-overflow-badge-item]'))
      const overflowElements = Array.from(measure.querySelectorAll<HTMLElement>('[data-overflow-badge-count]'))
      const itemWidths = itemElements.map((element) => element.getBoundingClientRect().width)
      const overflowWidths = new Map<number, number>()

      overflowElements.forEach((element) => {
        const count = Number(element.dataset.overflowBadgeCount)
        if (count > 0) overflowWidths.set(count, element.getBoundingClientRect().width)
      })

      const next = calculateOverflowLayout(available, itemWidths, overflowWidths, minTruncatedWidth, gap)
      setLayout((current) =>
        current.fullCount === next.fullCount && current.visibleCount === next.visibleCount ? current : next,
      )
    }

    const ro = new ResizeObserver(recalc)
    ro.observe(container)
    recalc()
    return () => ro.disconnect()
  }, [gap, items, minTruncatedWidth])

  const visibleItems = items.slice(0, layout.visibleCount)
  const hiddenItems = items.slice(layout.visibleCount)
  const hiddenCount = items.length - visibleItems.length

  function renderItem(item: OverflowBadgeItem, index: number) {
    const truncated = index >= layout.fullCount
    const badge = (
      <span className={cn('inline-flex min-w-0', truncated ? 'flex-1' : 'shrink-0')}>
        <Badge variant='outline' className={cn('h-6 min-w-0 max-w-full font-normal', badgeClassName)}>
          <span className='block truncate'>{item.label}</span>
        </Badge>
      </span>
    )

    if (!item.tooltip) return <React.Fragment key={item.id}>{badge}</React.Fragment>

    return (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent className='max-w-xs'>{item.tooltip}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div ref={containerRef} className={cn('relative flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden', className)}>
        <div
          ref={measureRef}
          aria-hidden
          className='pointer-events-none invisible absolute inset-0 flex items-center gap-1.5'
        >
          {items.map((item) => (
            <span key={item.id} data-overflow-badge-item>
              <Badge variant='outline' className={cn('h-6 font-normal', badgeClassName)}>
                {item.label}
              </Badge>
            </span>
          ))}
          {items.map((_, index) => {
            const count = index + 1
            return (
              <Badge
                key={count}
                data-overflow-badge-count={count}
                variant='secondary'
                className={cn('h-6 shrink-0 font-normal', overflowBadgeClassName)}
              >
                +{count}
              </Badge>
            )
          })}
        </div>

        {visibleItems.map(renderItem)}
        {hiddenCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant='secondary' className={cn('h-6 shrink-0 font-normal', overflowBadgeClassName)}>
                +{hiddenCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className='max-w-xs'>
              <div className='space-y-1'>
                {hiddenItems.map((item) => (
                  <div key={item.id} className='truncate'>
                    {item.label}
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
