import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from './button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'

export interface SplitButtonItem {
  label: string
  onSelect: () => void
}

interface SplitButtonProps {
  label: string
  onClick: () => void
  items: SplitButtonItem[]
  disabled?: boolean
}

export function SplitButton({ label, onClick, items, disabled }: SplitButtonProps) {
  return (
    <div className='inline-flex items-center'>
      <Button onClick={onClick} disabled={disabled} className='rounded-r-none'>
        {label}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='default' disabled={disabled} className='rounded-l-none border-l border-primary-foreground/20 px-2'>
            <ChevronDown className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {items.map((item) => (
            <DropdownMenuItem key={item.label} onClick={item.onSelect}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
