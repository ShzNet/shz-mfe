import * as React from 'react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { cn } from '../lib/utils'

const MenubarMenu: typeof MenubarPrimitive.Menu = MenubarPrimitive.Menu
const MenubarGroup: typeof MenubarPrimitive.Group = MenubarPrimitive.Group
const MenubarPortal: typeof MenubarPrimitive.Portal = MenubarPrimitive.Portal
const MenubarSub: typeof MenubarPrimitive.Sub = MenubarPrimitive.Sub
const MenubarRadioGroup: typeof MenubarPrimitive.RadioGroup = MenubarPrimitive.RadioGroup

function Menubar({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      className={cn('bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs', className)}
      {...props}
    />
  )
}

function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-hidden",
        className
      )}
      {...props}
    />
  )
}

function MenubarSubTrigger({
  className, inset, children, ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.SubTrigger
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden',
        inset && 'pl-8',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className='ml-auto size-4' />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] overflow-hidden rounded-md border p-1 shadow-md',
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
}

function MenubarItem({
  className, inset, variant = 'default', ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & { inset?: boolean; variant?: 'default' | 'destructive' }) {
  return (
    <MenubarPrimitive.Item
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className, children, checked, ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className='absolute left-2 flex size-3.5 items-center justify-center'>
        <MenubarPrimitive.ItemIndicator>
          <Check className='size-4' />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({ className, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <span className='absolute left-2 flex size-3.5 items-center justify-center'>
        <MenubarPrimitive.ItemIndicator>
          <Circle className='size-2 fill-current' />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className, inset, ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.Label
      className={cn('text-foreground px-2 py-1.5 text-xs font-medium', inset && 'pl-8', className)}
      {...props}
    />
  )
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return <MenubarPrimitive.Separator className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)} {...props} />
}

export {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem,
  MenubarCheckboxItem, MenubarRadioItem, MenubarLabel, MenubarSeparator,
  MenubarShortcut, MenubarGroup, MenubarPortal, MenubarSub,
  MenubarSubContent, MenubarSubTrigger, MenubarRadioGroup,
}
