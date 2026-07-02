import type * as React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { EditableCell, type EditableCellRenderProps } from '../editable-cell'

export type EditableColumnDef<TData, V = string> = {
  id: string
  header: React.ReactNode
  accessor: (row: TData) => V
  /** Defaults to true. Pass false or a per-row predicate to lock a cell. */
  editable?: boolean | ((row: TData) => boolean)
  renderView?: (value: V, row: TData) => React.ReactNode
  renderEdit?: (props: EditableCellRenderProps<V>, row: TData) => React.ReactNode
  onSave: (row: TData, value: V) => void
}

/**
 * Builds a `ColumnDef` whose cell toggles between view mode and edit mode on click,
 * for use alongside regular columns in `DataTable` (or the `EditableTable` alias below).
 */
export function createEditableColumn<TData, V = string>(def: EditableColumnDef<TData, V>): ColumnDef<TData> {
  return {
    id: def.id,
    header: () => def.header,
    cell: ({ row }) => {
      const isEditable = typeof def.editable === 'function' ? def.editable(row.original) : (def.editable ?? true)
      return (
        <EditableCell<V>
          value={def.accessor(row.original)}
          disabled={!isEditable}
          renderView={def.renderView ? (v) => def.renderView!(v, row.original) : undefined}
          renderEdit={def.renderEdit ? (props) => def.renderEdit!(props, row.original) : undefined}
          onSave={(v) => def.onSave(row.original, v)}
        />
      )
    },
  }
}

// Dedicated, discoverable entry point for building inline-editable grids —
// same component as DataTable, composed with columns from `createEditableColumn`.
export { DataTable as EditableTable } from './data-table'
