import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ScrollArea, Tree, type TreeNode } from '@shz/components'

const NODES: TreeNode[] = [
  {
    id: 'workspace',
    label: 'workspace',
    children: [
      {
        id: 'apps',
        label: 'apps',
        children: [
          { id: 'host', label: 'host', children: [{ id: 'host-src', label: 'src' }, { id: 'host-config', label: 'rsbuild.config.ts' }] },
          { id: 'remote-admin', label: 'remote-admin', children: [{ id: 'ra-src', label: 'src/pages' }, { id: 'ra-config', label: 'config.ts' }] },
        ],
      },
      {
        id: 'libs',
        label: 'libs',
        children: [
          { id: 'components', label: 'components', children: [{ id: 'ui', label: 'ui/*' }, { id: 'theme', label: 'styles/theme.css' }] },
        ],
      },
      { id: 'nx-json', label: 'nx.json' },
      { id: 'pkg-json', label: 'package.json' },
    ],
  },
]

export default function TreeExplorerPage() {
  const [selected, setSelected] = useState<TreeNode | null>(null)

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='pt-4'>
        <h1 className='text-2xl font-bold tracking-tight'>Tree Explorer</h1>
        <p className='text-sm text-muted-foreground'>Hierarchical navigation sample using Tree component.</p>
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Repository Tree</CardTitle>
            <CardDescription>Expand/collapse and select node.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[420px] rounded-md border p-2'>
              <Tree nodes={NODES} selectedId={selected?.id ?? null} defaultExpandedIds={['workspace', 'apps', 'libs']} onSelect={setSelected} />
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
            <CardDescription>Selected node details</CardDescription>
          </CardHeader>
          <CardContent className='text-sm'>
            {selected ? (
              <div className='space-y-2'>
                <p><span className='text-muted-foreground'>ID:</span> {selected.id}</p>
                <p><span className='text-muted-foreground'>Label:</span> {selected.label}</p>
                <p><span className='text-muted-foreground'>Children:</span> {selected.children?.length ?? 0}</p>
              </div>
            ) : (
              <p className='text-muted-foreground'>Select a node from the tree.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
