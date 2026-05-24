import * as React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Input } from '../input'

const DateInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <div className='relative w-full'>
        <Input
          ref={ref}
          type='date'
          className={cn(
            'w-full pr-10',
            '[&::-webkit-calendar-picker-indicator]:absolute',
            '[&::-webkit-calendar-picker-indicator]:right-0',
            '[&::-webkit-calendar-picker-indicator]:h-full',
            '[&::-webkit-calendar-picker-indicator]:w-10',
            '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
            '[&::-webkit-calendar-picker-indicator]:opacity-0',
            className
          )}
          {...props}
        />
        <Calendar className='pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
      </div>
    )
  }
)

DateInput.displayName = 'DateInput'

export { DateInput }
