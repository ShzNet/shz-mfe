import {
  type ColumnManagerItem,
  type FilterBuilderField,
  type FilterBuilderValue,
  createFilterBuilderGroup,
} from '@shznet/components'
import { MANAGERS } from './data'
import { createViewGroup, createViewRule } from './helpers'
import type { FilterFieldId, Role, UserForm, UserRow, UsersTableViewPreset } from './types'
import { EMPTY_FORM } from './data'

export const DEFAULT_FILTERS: FilterBuilderValue<FilterFieldId> = createFilterBuilderGroup<FilterFieldId>('and')

export const MANAGEABLE_COLUMNS: ColumnManagerItem[] = [
  { id: 'name', label: 'Name', locked: true },
  { id: 'team', label: 'Team' },
  { id: 'role', label: 'Role', locked: true },
  { id: 'status', label: 'Status' },
  { id: 'joined', label: 'Joined' },
  { id: 'location', label: 'Location' },
  { id: 'manager', label: 'Manager' },
  { id: 'employeeCode', label: 'Employee Code' },
  { id: 'phone', label: 'Phone' },
  { id: 'workMode', label: 'Work Mode' },
  { id: 'timezone', label: 'Timezone' },
  { id: 'lastActive', label: 'Last Active' },
]

export const LOCKED_COLUMN_IDS = new Set(MANAGEABLE_COLUMNS.filter((column) => column.locked).map((column) => column.id))

export const FILTER_FIELDS: Array<FilterBuilderField<FilterFieldId>> = [
  {
    code: 'status',
    name: 'Status',
    dataType: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
  },
  {
    code: 'role',
    name: 'Role',
    dataType: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
  { code: 'team', name: 'Team', dataType: 'text' },
  { code: 'location', name: 'Location', dataType: 'text' },
  {
    code: 'manager',
    name: 'Manager',
    dataType: 'select',
    supportedConditions: ['equals', 'notEquals'],
    getOptions: async () => MANAGERS.map((manager) => ({ label: manager, value: manager })),
  },
  {
    code: 'workMode',
    name: 'Work Mode',
    dataType: 'select',
    options: [
      { label: 'Onsite', value: 'onsite' },
      { label: 'Hybrid', value: 'hybrid' },
      { label: 'Remote', value: 'remote' },
    ],
  },
  {
    code: 'timezone',
    name: 'Timezone',
    dataType: 'select',
    options: [
      { label: 'GMT+7', value: 'GMT+7' },
      { label: 'GMT+8', value: 'GMT+8' },
      { label: 'GMT+9', value: 'GMT+9' },
    ],
  },
  { code: 'joined', name: 'Joined', dataType: 'date' },
]

export const VIEW_PRESETS: UsersTableViewPreset[] = [
  {
    id: 'all',
    label: 'All users',
    filters: DEFAULT_FILTERS,
    columnVisibility: {},
    columnOrder: MANAGEABLE_COLUMNS.map((column) => column.id),
  },
  {
    id: 'active-ops',
    label: 'Active operations',
    filters: createViewGroup([
      createViewRule('status', 'equals', 'active'),
      createViewGroup([
        createViewRule('team', 'contains', 'Operations'),
        createViewRule('team', 'contains', 'Support'),
      ], 'or'),
    ]),
    columnVisibility: {
      phone: false,
      employeeCode: false,
      manager: false,
      lastActive: false,
    },
    columnOrder: ['name', 'team', 'status', 'workMode', 'timezone', 'joined', 'location', 'role', 'manager', 'employeeCode', 'phone', 'lastActive'],
  },
  {
    id: 'design-review',
    label: 'Design review',
    filters: createViewGroup([
      createViewRule('team', 'equals', 'Design'),
      createViewRule('status', 'notEquals', 'inactive'),
    ]),
    columnVisibility: {
      phone: false,
      employeeCode: false,
      timezone: false,
      workMode: false,
    },
    columnOrder: ['name', 'role', 'status', 'manager', 'joined', 'location', 'team', 'employeeCode', 'phone', 'workMode', 'timezone', 'lastActive'],
  },
]

export const ROLE_VARIANT: Record<Role, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  editor: 'secondary',
  viewer: 'outline',
}

export const USERS_FEATURE_DEFAULTS = {
  emptyForm: EMPTY_FORM,
  filterFields: FILTER_FIELDS,
  defaultFilters: DEFAULT_FILTERS,
  manageableColumns: MANAGEABLE_COLUMNS,
  lockedColumnIds: LOCKED_COLUMN_IDS,
  viewPresets: VIEW_PRESETS,
  roleVariant: ROLE_VARIANT,
}
