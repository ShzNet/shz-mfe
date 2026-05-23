import * as React from 'react'
import { ChevronRightIcon, FileIcon, FolderIcon, FolderOpenIcon } from 'lucide-react'
import { cn } from '../lib/utils'

export interface TreeNode {
  id: string
  label: string
  icon?: React.ElementType
  children?: TreeNode[]
  data?: unknown
}

interface TreeItemProps {
  node: TreeNode
  depth: number
  selectedId: string | null
  expandedIds: Set<string>
  onSelect: (node: TreeNode) => void
  onToggle: (id: string) => void
  renderLabel?: (node: TreeNode) => React.ReactNode
}

function TreeItem({ node, depth, selectedId, expandedIds, onSelect, onToggle, renderLabel }: TreeItemProps) {
  const isExpanded = expandedIds.has(node.id)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedId === node.id

  const DefaultIcon = hasChildren
    ? isExpanded
      ? FolderOpenIcon
      : FolderIcon
    : FileIcon
  const Icon = node.icon ?? DefaultIcon

  return (
    <li>
      <div
        role='treeitem'
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        style={{ paddingLeft: depth * 16 + 4 }}
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-2 text-sm transition-colors select-none',
          isSelected
            ? 'bg-accent text-accent-foreground'
            : 'hover:bg-muted/60 text-foreground',
        )}
        onClick={() => {
          if (hasChildren) onToggle(node.id)
          onSelect(node)
        }}
      >
        {/* Expand chevron */}
        <span className='flex size-4 shrink-0 items-center justify-center'>
          {hasChildren && (
            <ChevronRightIcon
              className={cn('size-3.5 text-muted-foreground transition-transform', isExpanded && 'rotate-90')}
            />
          )}
        </span>
        <Icon className='size-4 shrink-0 text-muted-foreground' />
        <span className='truncate'>{renderLabel ? renderLabel(node) : node.label}</span>
      </div>

      {hasChildren && isExpanded && (
        <ul role='group'>
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
              renderLabel={renderLabel}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

interface TreeProps {
  nodes: TreeNode[]
  selectedId?: string | null
  defaultExpandedIds?: string[]
  onSelect?: (node: TreeNode) => void
  renderLabel?: (node: TreeNode) => React.ReactNode
  className?: string
}

function Tree({ nodes, selectedId = null, defaultExpandedIds = [], onSelect, renderLabel, className }: TreeProps) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(() => new Set(defaultExpandedIds))

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <ul role='tree' className={cn('text-sm', className)}>
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect ?? (() => {})}
          onToggle={handleToggle}
          renderLabel={renderLabel}
        />
      ))}
    </ul>
  )
}

export { Tree }
