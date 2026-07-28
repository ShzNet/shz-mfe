import * as React from 'react'

export type DataTableMessages = {
  searchPlaceholder: string
  columns: string
  noResults: string
  rowsPerPage: string
  selectAllMatching: string
  previous: string
  next: string
  rowsSelected: (selected: number, total: number) => string
  page: (index: number, total: number) => string
  filterByColumn: (column: string) => string
  all: string
}

export type PaginationMessages = {
  navigationLabel: string
  previous: string
  next: string
  goToPreviousPage: string
  goToNextPage: string
  morePages: string
}

export type ComponentsLocale = { dataTable: DataTableMessages; pagination: PaginationMessages }
export type ComponentsLocaleOverrides = { dataTable?: Partial<DataTableMessages>; pagination?: Partial<PaginationMessages> }

const defaultLocale: ComponentsLocale = {
  dataTable: {
    searchPlaceholder: 'Search…', columns: 'Columns', noResults: 'No results.', rowsPerPage: 'Rows per page', selectAllMatching: 'Select all matching', previous: 'Previous', next: 'Next',
    rowsSelected: (selected, total) => `${selected} of ${total} row(s) selected`, page: (index, total) => `Page ${index} / ${total}`,
    filterByColumn: (column) => `Filter ${column}...`, all: 'All',
  },
  pagination: { navigationLabel: 'pagination', previous: 'Previous', next: 'Next', goToPreviousPage: 'Go to previous page', goToNextPage: 'Go to next page', morePages: 'More pages' },
}

const ComponentsLocaleContext = React.createContext<ComponentsLocale>(defaultLocale)

export function ComponentsLocaleProvider({ children, value }: { children: React.ReactNode; value?: ComponentsLocaleOverrides }) {
  const locale = React.useMemo<ComponentsLocale>(() => ({ dataTable: { ...defaultLocale.dataTable, ...value?.dataTable }, pagination: { ...defaultLocale.pagination, ...value?.pagination } }), [value])
  return <ComponentsLocaleContext.Provider value={locale}>{children}</ComponentsLocaleContext.Provider>
}

export function useComponentsLocale() { return React.useContext(ComponentsLocaleContext) }
