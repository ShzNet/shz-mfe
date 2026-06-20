import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import type { TooltipContentProps } from 'recharts/types/component/Tooltip'
import type { LegendPayload } from 'recharts/types/component/DefaultLegendContent'
import { cn } from '../lib/utils'

// ─── Theming ──────────────────────────────────────────────────────────────────

const THEMES = { light: '', dark: '.dark' } as const

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = { config: ChartConfig }
const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error('useChart must be used within <ChartContainer />')
  return ctx
}

// ─── ChartContainer ───────────────────────────────────────────────────────────

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot='chart'
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

// ─── ChartStyle ───────────────────────────────────────────────────────────────

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, c]) => c.theme || c.color)
  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) =>
            `${prefix} [data-chart=${id}] {\n${colorConfig
              .map(([key, cfg]) => {
                const color = cfg.theme?.[theme as keyof typeof cfg.theme] || cfg.color
                return color ? `  --color-${key}: ${color};` : null
              })
              .filter(Boolean)
              .join('\n')}\n}`
          )
          .join('\n'),
      }}
    />
  )
}

// ─── ChartTooltip ─────────────────────────────────────────────────────────────

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: TooltipContentProps<ValueType, NameType> &
  React.ComponentProps<'div'> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: 'line' | 'dot' | 'dashed'
    nameKey?: string
    labelKey?: string
  }) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null
    const [item] = payload
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`
    const itemConfig = getPayloadConfig(config, item, key)
    const value =
      !labelKey && typeof label === 'string'
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return <div className={cn('font-medium', labelClassName)}>{labelFormatter(value, payload)}</div>
    }
    if (!value) return null
    return <div className={cn('font-medium', labelClassName)}>{value}</div>
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

  if (!active || !payload?.length) return null

  const nestLabel = payload.length === 1 && indicator !== 'dot'

  return (
    <div className={cn('border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl', className)}>
      {!nestLabel ? tooltipLabel : null}
      <div className='grid gap-1.5'>
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`
          const itemConfig = getPayloadConfig(config, item, key)
          const indicatorColor = color || (item.payload as Record<string, unknown>)?.fill as string || item.color

          return (
            <div
              key={String(item.dataKey ?? index)}
              className={cn('flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-muted-foreground', indicator === 'dot' && 'items-center')}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : !hideIndicator ? (
                    <div
                      className={cn(
                        'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
                        indicator === 'dot' && 'size-2.5 rounded-full',
                        indicator === 'line' && 'w-1',
                        indicator === 'dashed' && 'w-0 border-[1.5px] border-dashed bg-transparent'
                      )}
                      style={{ '--color-bg': indicatorColor, '--color-border': indicatorColor } as React.CSSProperties}
                    />
                  ) : null}
                  <div className={cn('flex flex-1 justify-between leading-none', nestLabel ? 'items-end' : 'items-center')}>
                    <div className='grid gap-1.5'>
                      {nestLabel ? tooltipLabel : null}
                      <span className='text-muted-foreground'>{itemConfig?.label || item.name}</span>
                    </div>
                    {item.value !== undefined && (
                      <span className='text-foreground font-mono font-medium tabular-nums'>
                        {Number(item.value).toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ChartLegend ──────────────────────────────────────────────────────────────

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> & {
  hideIcon?: boolean
  nameKey?: string
  payload?: LegendPayload[]
  verticalAlign?: 'top' | 'bottom' | 'middle'
}) {
  const { config } = useChart()
  if (!payload?.length) return null

  return (
    <div className={cn('flex items-center justify-center gap-4', verticalAlign === 'top' ? 'pb-3' : 'pt-3', className)}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`
        const itemConfig = getPayloadConfig(config, item, key)
        return (
          <div key={item.value} className='flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-muted-foreground'>
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div className='size-2 shrink-0 rounded-[2px]' style={{ backgroundColor: item.color }} />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function getPayloadConfig(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) return undefined
  const inner = 'payload' in payload && typeof (payload as Record<string, unknown>).payload === 'object'
    ? (payload as Record<string, unknown>).payload as Record<string, unknown>
    : undefined
  const configKey = key in config ? key : inner && key in inner ? inner[key] as string : key
  return configKey in config ? config[configKey] : undefined
}

export {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  ChartLegend, ChartLegendContent, ChartStyle,
}
