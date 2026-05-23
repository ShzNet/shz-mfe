import { type ElementType } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { cn } from '../lib/utils'

export interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: ElementType
  description?: string
}

export function StatsCard({ title, value, change, trend, icon: Icon, description }: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardDescription>{title}</CardDescription>
          <Icon className='size-4 text-muted-foreground' />
        </div>
        <CardTitle className='text-2xl'>{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-1 text-sm'>
          {trend === 'up' && <TrendingUp className='size-3 text-emerald-500' />}
          {trend === 'down' && <TrendingDown className='size-3 text-rose-500' />}
          <span
            className={cn(
              'font-medium',
              trend === 'up' && 'text-emerald-600',
              trend === 'down' && 'text-rose-600',
              trend === 'neutral' && 'text-muted-foreground',
            )}
          >
            {change}
          </span>
          {description && <span className='text-muted-foreground'>{description}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
