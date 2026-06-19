import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Collapsible, CollapsibleContent, CollapsibleTrigger, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@shz/components'

export default function ShadcnNavigationPage() {
  return (
    <div className='space-y-6'>
      <section className='rounded-lg border p-4'>
        <h2 className='mb-3 text-lg font-semibold'>Breadcrumb</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href='#'>Docs</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href='#'>Components</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Navigation</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

      <section className='rounded-lg border p-4'>
        <h2 className='mb-3 text-lg font-semibold'>Tabs</h2>
        <Tabs defaultValue='account'>
          <TabsList>
            <TabsTrigger value='account'>Account</TabsTrigger>
            <TabsTrigger value='security'>Security</TabsTrigger>
          </TabsList>
          <TabsContent value='account'>Account settings content</TabsContent>
          <TabsContent value='security'>Security settings content</TabsContent>
        </Tabs>
      </section>

      <section className='rounded-lg border p-4'>
        <h2 className='mb-3 text-lg font-semibold'>Pagination</h2>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href='#' /></PaginationItem>
            <PaginationItem><PaginationLink href='#' isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href='#'>2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href='#' /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      <section className='rounded-lg border p-4'>
        <h2 className='mb-3 text-lg font-semibold'>Collapsible</h2>
        <Collapsible>
          <CollapsibleTrigger className='text-sm font-medium'>Show details</CollapsibleTrigger>
          <CollapsibleContent className='pt-3 text-sm text-muted-foreground'>
            Collapsible content area for additional information.
          </CollapsibleContent>
        </Collapsible>
        <Separator className='mt-4' />
      </section>
    </div>
  )
}
