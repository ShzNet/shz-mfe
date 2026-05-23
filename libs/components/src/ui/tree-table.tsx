import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

export interface TreeTableRow {
  id: string
  name: string
  type?: string
  owner?: string
  children?: TreeTableRow[]
}

interface TreeTableProps {
  rows: TreeTableRow[]
}

function flatten(rows: TreeTableRow[], depth = 0): Array<TreeTableRow & { depth: number; hasChildren: boolean }> {
  return rows.flatMap((r) => [
    { ...r, depth, hasChildren: !!r.children?.length },
    ...(r.children ? flatten(r.children, depth + 1) : []),
  ])
}

export function TreeTable({ rows }: TreeTableProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(rows.map((r) => r.id)))
  const flat = flatten(rows)

  const visible = flat.filter((row) => {
    if (row.depth === 0) return true
    const pathParts = row.id.split('/')
    let parentPath = pathParts[0]
    for (let i = 1; i < pathParts.length; i++) {
      if (!expanded.has(parentPath)) return false
      parentPath += `/${pathParts[i]}`
    }
    return true
  })

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className='flex items-center gap-1' style={{ paddingLeft: row.depth * 16 }}>
                  <button
                    className={cn('inline-flex size-5 items-center justify-center rounded hover:bg-muted', !row.hasChildren && 'invisible')}
                    onClick={() => {
                      setExpanded((prev) => {
                        const next = new Set(prev)
                        if (next.has(row.id)) next.delete(row.id)
                        else next.add(row.id)
                        return next
                      })
                    }}
                  >
                    <ChevronRight className={cn('size-3.5 transition-transform', expanded.has(row.id) && 'rotate-90')} />
                  </button>
                  <span>{row.name}</span>
                </div>
              </TableCell>
              <TableCell>{row.type ?? '—'}</TableCell>
              <TableCell>{row.owner ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
