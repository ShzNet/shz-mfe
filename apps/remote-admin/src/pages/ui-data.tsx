import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TreeTable,
  type TreeTableRow,
  VirtualList,
} from '@shz/components'

const TREE_ROWS: TreeTableRow[] = [
  {
    id: 'platform',
    name: 'Platform',
    type: 'Folder',
    owner: 'Alice',
    children: [
      { id: 'platform/host', name: 'Host App', type: 'Project', owner: 'Alice' },
      { id: 'platform/admin', name: 'Admin Remote', type: 'Project', owner: 'Carol' },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    type: 'Folder',
    owner: 'Bob',
    children: [
      { id: 'analytics/events', name: 'Event Stream', type: 'Service', owner: 'David' },
    ],
  },
]

const BIG_LIST = Array.from({ length: 1000 }, (_, i) => `Row #${i + 1} - virtualized item`)

export default function UiDataPage() {
  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='pt-4'>
        <h1 className='text-2xl font-bold tracking-tight'>UI Data Components</h1>
        <p className='text-sm text-muted-foreground'>Tree table and virtual scroll list demos.</p>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Tree Table</CardTitle>
            <CardDescription>Hierarchy + tabular columns</CardDescription>
          </CardHeader>
          <CardContent>
            <TreeTable rows={TREE_ROWS} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Virtual Scroll</CardTitle>
            <CardDescription>Render only visible rows</CardDescription>
          </CardHeader>
          <CardContent>
            <VirtualList
              items={BIG_LIST}
              itemHeight={38}
              height={420}
              renderItem={(item) => <div className='rounded border px-2 py-1 text-sm'>{item}</div>}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
