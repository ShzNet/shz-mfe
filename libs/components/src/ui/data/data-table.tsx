import * as React from 'react'
import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown } from 'lucide-react'
import { Button } from '../button'
import { Input } from '../input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu'
import { cn } from '../../lib/utils'

export { type ColumnDef }
export { type ColumnFiltersState, type ColumnOrderState, type RowSelectionState, type VisibilityState }

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Column id used for the global text filter input */
  searchColumn?: string
  searchPlaceholder?: string
  pageSize?: number
  className?: string
  /** Show header dropdown on each column with sort + quick filter */
  headerMenu?: boolean
  /** Per-column filter UI in header menu */
  headerFilterConfig?: Record<string, HeaderFilterConfig>
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  columnOrder?: ColumnOrderState
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  showToolbar?: boolean
  showColumnToggle?: boolean
  stickyHeader?: boolean
  tableWrapperClassName?: string
}

type HeaderFilterConfig =
  | { type: 'text'; placeholder?: string }
  | { type: 'select'; options: Array<{ label: string; value: string }>; allLabel?: string }

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder = 'Search…',
  pageSize = 10,
  className,
  headerMenu = false,
  headerFilterConfig,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  columnOrder: controlledColumnOrder,
  onColumnOrderChange,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  showToolbar = true,
  showColumnToggle = true,
  stickyHeader = false,
  tableWrapperClassName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([])
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<VisibilityState>({})
  const [internalColumnOrder, setInternalColumnOrder] = React.useState<ColumnOrderState>([])
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({})

  const columnFilters = controlledColumnFilters ?? internalColumnFilters
  const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility
  const columnOrder = controlledColumnOrder ?? internalColumnOrder
  const rowSelection = controlledRowSelection ?? internalRowSelection

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = React.useCallback((updater) => {
    const nextValue = resolveUpdater(updater, columnFilters)
    if (controlledColumnFilters === undefined) {
      setInternalColumnFilters(nextValue)
    }
    onColumnFiltersChange?.(updater)
  }, [columnFilters, controlledColumnFilters, onColumnFiltersChange])

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = React.useCallback((updater) => {
    const nextValue = resolveUpdater(updater, columnVisibility)
    if (controlledColumnVisibility === undefined) {
      setInternalColumnVisibility(nextValue)
    }
    onColumnVisibilityChange?.(updater)
  }, [columnVisibility, controlledColumnVisibility, onColumnVisibilityChange])

  const handleColumnOrderChange: OnChangeFn<ColumnOrderState> = React.useCallback((updater) => {
    const nextValue = resolveUpdater(updater, columnOrder)
    if (controlledColumnOrder === undefined) {
      setInternalColumnOrder(nextValue)
    }
    onColumnOrderChange?.(updater)
  }, [columnOrder, controlledColumnOrder, onColumnOrderChange])

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = React.useCallback((updater) => {
    const nextValue = resolveUpdater(updater, rowSelection)
    if (controlledRowSelection === undefined) {
      setInternalRowSelection(nextValue)
    }
    onRowSelectionChange?.(updater)
  }, [controlledRowSelection, onRowSelectionChange, rowSelection])

  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize } },
    onSortingChange: setSorting,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onColumnOrderChange: handleColumnOrderChange,
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, columnFilters, columnVisibility, columnOrder, rowSelection },
  })

  return (
    <div className={cn('flex min-h-0 flex-col space-y-3', className)}>
      {showToolbar && (searchColumn || showColumnToggle) && (
        <div className='flex items-center gap-2'>
          {searchColumn && (
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
              onChange={(e) => table.getColumn(searchColumn)?.setFilterValue(e.target.value)}
              className='max-w-xs'
            />
          )}
          {showColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='ml-auto gap-1'>
                  Columns <ChevronDown className='size-4 opacity-50' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      className='capitalize'
                      checked={col.getIsVisible()}
                      onCheckedChange={(value) => col.toggleVisibility(!!value)}
                    >
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Table */}
      <div className='min-h-0 flex-1'>
        <Table wrapperClassName={tableWrapperClassName}>
          <TableHeader className={cn(stickyHeader && 'sticky top-0 z-10 bg-background shadow-[0_1px_0_0_hsl(var(--border))]')}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      headerMenu && (header.column.getCanSort() || header.column.getCanFilter()) ? (
                        <HeaderMenu
                          column={header.column}
                          label={getHeaderLabel(header.column, header.getContext())}
                          filterConfig={headerFilterConfig?.[header.column.id]}
                        />
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between border-t px-3 py-3 text-sm text-muted-foreground'>
        <div className='flex items-center gap-4'>
          <span>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected
          </span>
          <div className='flex items-center gap-2'>
            <span>Rows per page</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger size='sm' className='h-8 w-[88px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
                <SelectItem value='50'>50</SelectItem>
                <SelectItem value='100'>100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className='tabular-nums'>
            Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

function resolveUpdater<T>(updater: Updater<T>, currentValue: T): T {
  return typeof updater === 'function' ? (updater as (value: T) => T)(currentValue) : updater
}

function getHeaderLabel<TData, TValue>(column: Column<TData, TValue>, ctx: unknown) {
  const header = column.columnDef.header
  if (typeof header === 'string') return header
  if (typeof column.id === 'string') return column.id
  return String(column.id ?? '')
}

function HeaderMenu<TData, TValue>({
  column,
  label,
  filterConfig,
}: {
  column: Column<TData, TValue>
  label: string
  filterConfig?: HeaderFilterConfig
}) {
  const canSort = column.getCanSort()
  const canFilter = column.getCanFilter()
  const filterValue = (column.getFilterValue() as string) ?? ''
  const config = filterConfig ?? { type: 'text', placeholder: `Filter ${label}...` as string }

  return (
    <div className='flex items-center gap-1'>
      <span className='text-sm'>{label}</span>
      {canSort && (
        <Button
          variant='ghost'
          size='icon'
          className='size-7'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <ArrowUpDown className='size-3.5 opacity-70' />
        </Button>
      )}
      {canFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='size-7'>
              <ChevronDown className='size-3.5 opacity-70' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-56'>
            {canFilter && config.type === 'text' && (
              <div className='p-2'>
                <Input
                  placeholder={config.placeholder ?? `Filter ${label}...`}
                  value={filterValue}
                  onChange={(e) => column.setFilterValue(e.target.value)}
                  className='h-8'
                />
              </div>
            )}
            {canFilter && config.type === 'select' && (
              <div className='p-1'>
                <button
                  className='w-full rounded px-2 py-1 text-left text-sm hover:bg-accent'
                  onClick={() => column.setFilterValue('')}
                >
                  {config.allLabel ?? 'All'}
                </button>
                {config.options.map((opt) => (
                  <button
                    key={opt.value}
                    className='w-full rounded px-2 py-1 text-left text-sm hover:bg-accent'
                    onClick={() => column.setFilterValue(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            {canSort && canFilter && <DropdownMenuSeparator />}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

/** Helper: sortable column header button */
export function SortableHeader({ column, children }: { column: { toggleSorting(asc?: boolean): void; getIsSorted(): false | 'asc' | 'desc' }; children: React.ReactNode }) {
  return (
    <Button
      variant='ghost'
      size='sm'
      className='-ml-3 h-8 gap-1'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {children}
      <ArrowUpDown className='size-3.5 opacity-60' />
    </Button>
  )
}
