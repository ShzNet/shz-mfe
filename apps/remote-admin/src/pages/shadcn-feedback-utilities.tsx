import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, ScrollArea, Switch, Toggle, ToggleGroup, ToggleGroupItem, Toaster } from '@shz/components'

export default function ShadcnFeedbackUtilitiesPage() {
  return (
    <div className='space-y-6'>
      <Toaster />

      <section className='rounded-lg border p-4'>
        <h2 className='mb-3 text-lg font-semibold'>Sonner</h2>
        <Button>Toast action demo</Button>
      </section>

      <section className='rounded-lg border p-4'>
        <h2 className='mb-3 text-lg font-semibold'>Command</h2>
        <Command className='rounded-lg border'>
          <CommandInput placeholder='Search component...' />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading='Installed'>
              <CommandItem>Button</CommandItem>
              <CommandItem>Dialog</CommandItem>
              <CommandItem>Table</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </section>

      <section className='rounded-lg border p-4'>
        <h2 className='mb-3 text-lg font-semibold'>Accordion + Scroll Area</h2>
        <Accordion type='single' collapsible>
          <AccordionItem value='a'>
            <AccordionTrigger>Component notes</AccordionTrigger>
            <AccordionContent>
              <ScrollArea className='h-24 rounded border p-2 text-sm'>
                Keep host responsible for remote mounting and menu resolution. Let remote own nested routes.
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className='rounded-lg border p-4'>
        <h2 className='mb-3 text-lg font-semibold'>Toggle + Switch</h2>
        <div className='flex items-center gap-3'>
          <Toggle>Bold</Toggle>
          <ToggleGroup type='single' defaultValue='week'>
            <ToggleGroupItem value='day'>Day</ToggleGroupItem>
            <ToggleGroupItem value='week'>Week</ToggleGroupItem>
            <ToggleGroupItem value='month'>Month</ToggleGroupItem>
          </ToggleGroup>
          <Switch defaultChecked />
        </div>
      </section>
    </div>
  )
}
