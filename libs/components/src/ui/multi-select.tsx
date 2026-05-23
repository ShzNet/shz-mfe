import * as React from 'react'
import { X } from 'lucide-react'
import { Badge } from './badge'
import { Button } from './button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu'

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, value, onValueChange, placeholder = 'Select options' }: MultiSelectProps) {
  return (
    <div className='space-y-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='w-full justify-start'>
            {value.length ? `${value.length} selected` : placeholder}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-(--radix-dropdown-menu-trigger-width)'>
          {options.map((opt) => {
            const checked = value.includes(opt.value)
            return (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={checked}
                onCheckedChange={(next) => {
                  if (next) onValueChange([...value, opt.value])
                  else onValueChange(value.filter((v) => v !== opt.value))
                }}
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className='flex flex-wrap gap-2'>
        {value.map((v) => {
          const option = options.find((o) => o.value === v)
          if (!option) return null
          return (
            <Badge key={v} variant='secondary' className='gap-1'>
              {option.label}
              <button onClick={() => onValueChange(value.filter((x) => x !== v))}>
                <X className='size-3' />
              </button>
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
