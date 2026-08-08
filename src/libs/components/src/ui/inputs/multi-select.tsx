import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Badge } from '../badge'
import { Button } from '../button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Select options',
  searchPlaceholder = 'Search...',
  emptyText = 'No option found.',
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  function toggle(optionValue: string) {
    if (value.includes(optionValue)) onValueChange(value.filter((v) => v !== optionValue))
    else onValueChange([...value, optionValue])
  }

  return (
    <div className='space-y-2'>
      {/* modal: non-modal Popover has no scroll lock of its own, so wheel events over its
          portaled content get swallowed by an ancestor Dialog's scroll lock instead. */}
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
            {value.length ? `${value.length} selected` : placeholder}
            <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-(--radix-popover-trigger-width) p-0'>
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const checked = value.includes(opt.value)
                  return (
                    <CommandItem key={opt.value} value={opt.label} onSelect={() => toggle(opt.value)}>
                      <Check className={cn('mr-2 size-4', checked ? 'opacity-100' : 'opacity-0')} />
                      {opt.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

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
