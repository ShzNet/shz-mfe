import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Popover, PopoverContent, PopoverTrigger, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shz/components'

export default function ShadcnOverlaysPage() {
  return (
    <TooltipProvider>
      <div className='grid gap-6 md:grid-cols-2'>
        <section className='space-y-3 rounded-lg border p-4'>
          <h2 className='text-lg font-semibold'>Dialog</h2>
          <Dialog>
            <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>Review your data before saving.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </section>

        <section className='space-y-3 rounded-lg border p-4'>
          <h2 className='text-lg font-semibold'>Sheet</h2>
          <Sheet>
            <SheetTrigger asChild><Button variant='outline'>Open sheet</Button></SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Quick actions</SheetTitle>
                <SheetDescription>Pinned actions and shortcuts.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </section>

        <section className='space-y-3 rounded-lg border p-4'>
          <h2 className='text-lg font-semibold'>Dropdown Menu</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant='secondary'>Menu</Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        <section className='space-y-3 rounded-lg border p-4'>
          <h2 className='text-lg font-semibold'>Popover + Tooltip</h2>
          <div className='flex gap-3'>
            <Popover>
              <PopoverTrigger asChild><Button variant='outline'>Open popover</Button></PopoverTrigger>
              <PopoverContent>Popover content</PopoverContent>
            </Popover>
            <Tooltip>
              <TooltipTrigger asChild><Button variant='ghost'>Hover me</Button></TooltipTrigger>
              <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}
