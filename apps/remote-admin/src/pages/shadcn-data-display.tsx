import { Avatar, AvatarFallback, AvatarImage, Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shz/components'

export default function ShadcnDataDisplayPage() {
  return (
    <div className='grid gap-6'>
      <section className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader><CardTitle>Active users</CardTitle><CardDescription>24h</CardDescription></CardHeader>
          <CardContent><p className='text-2xl font-semibold'>1,240</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>System status</CardTitle><CardDescription>Production</CardDescription></CardHeader>
          <CardContent><Badge>Healthy</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Migration progress</CardTitle><CardDescription>Core modules</CardDescription></CardHeader>
          <CardContent><Progress value={72} /></CardContent>
        </Card>
      </section>

      <section className='rounded-lg border p-4'>
        <h2 className='mb-3 text-lg font-semibold'>Table</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Platform</TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Avatar className='size-6'><AvatarImage src='' /><AvatarFallback>PL</AvatarFallback></Avatar>
                  <span>Phuc Le</span>
                </div>
              </TableCell>
              <TableCell><Badge variant='secondary'>On track</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className='rounded-lg border p-4'>
        <h2 className='mb-3 text-lg font-semibold'>Skeleton</h2>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-4 w-2/3' />
          <Skeleton className='h-24 w-full' />
        </div>
      </section>
    </div>
  )
}
