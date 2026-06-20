import * as React from 'react'
import { LoaderCircle, Plus, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../button'
import { DateInput } from '../inputs/date-input'
import { Input } from '../input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select'

export type FilterBuilderDataType = 'text' | 'select' | 'date'
export type FilterBuilderCondition = 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'before' | 'after' | 'on'
export type FilterBuilderGroupOperator = 'and' | 'or'

export interface FilterBuilderOption {
  label: string
  value: string
}

export interface FilterBuilderField<TCode extends string = string> {
  code: TCode
  name: string
  dataType: FilterBuilderDataType
  supportedConditions?: FilterBuilderCondition[]
  options?: FilterBuilderOption[]
  getOptions?: () => Promise<FilterBuilderOption[]>
}

export interface FilterBuilderRule<TCode extends string = string> {
  kind: 'rule'
  id: string
  fieldCode: TCode | null
  condition: FilterBuilderCondition
  value: string
}

export interface FilterBuilderGroup<TCode extends string = string> {
  kind: 'group'
  id: string
  operator: FilterBuilderGroupOperator
  children: FilterBuilderNode<TCode>[]
}

export type FilterBuilderNode<TCode extends string = string> = FilterBuilderRule<TCode> | FilterBuilderGroup<TCode>
export type FilterBuilderValue<TCode extends string = string> = FilterBuilderGroup<TCode>
export type FilterBuilderResolvedValue = string | number | boolean | Date | null | undefined

export interface FilterBuilderProps<TCode extends string = string> {
  fields: Array<FilterBuilderField<TCode>>
  value: FilterBuilderGroup<TCode>
  onChange: (value: FilterBuilderGroup<TCode>) => void
  className?: string
  rootOperator?: FilterBuilderGroupOperator
  showRootOperator?: boolean
  messages?: Partial<FilterBuilderMessages>
}

export interface FilterBuilderMessages {
  fieldColumnLabel: string
  operatorColumnLabel: string
  valueColumnLabel: string
  actionsColumnLabel: string
  andOperatorLabel: string
  orOperatorLabel: string
  addButtonLabel: string
  addConditionLabel: string
  addGroupLabel: string
  removeGroupLabel: string
  removeConditionLabel: string
  selectFieldPlaceholder: string
  selectFieldFirstPlaceholder: string
  selectValuePlaceholder: string
  enterValuePlaceholder: string
  loadingLabel: string
  noOptionsLabel: string
  rootEmptyStateLabel: string
  nestedEmptyStateLabel: string
}

const UNSET_FILTER_FIELD = '__unset__'
const defaultFilterBuilderMessages: FilterBuilderMessages = {
  fieldColumnLabel: 'Field',
  operatorColumnLabel: 'Operator',
  valueColumnLabel: 'Value',
  actionsColumnLabel: 'Actions',
  andOperatorLabel: 'AND',
  orOperatorLabel: 'OR',
  addButtonLabel: 'Add',
  addConditionLabel: 'Add condition',
  addGroupLabel: 'Add group',
  removeGroupLabel: 'Remove group',
  removeConditionLabel: 'Remove condition',
  selectFieldPlaceholder: 'Select field',
  selectFieldFirstPlaceholder: 'Select field first',
  selectValuePlaceholder: 'Select value',
  enterValuePlaceholder: 'Enter value',
  loadingLabel: 'Loading...',
  noOptionsLabel: 'No options',
  rootEmptyStateLabel: 'No groups yet. Add a group or condition to start building logic.',
  nestedEmptyStateLabel: 'No conditions yet. Add a condition or nested group to start building logic.',
}

export function createFilterBuilderRule<TCode extends string = string>(): FilterBuilderRule<TCode> {
  return {
    kind: 'rule',
    id: createNodeId(),
    fieldCode: null,
    condition: 'equals',
    value: '',
  }
}

export function createFilterBuilderGroup<TCode extends string = string>(
  operator: FilterBuilderGroupOperator = 'and',
  withInitialRule = false,
): FilterBuilderGroup<TCode> {
  return {
    kind: 'group',
    id: createNodeId(),
    operator,
    children: withInitialRule ? [createFilterBuilderRule<TCode>()] : [],
  }
}

export function countActiveFilterBuilderRules<TCode extends string = string>(group: FilterBuilderGroup<TCode>): number {
  return group.children.reduce((count, child) => (
    child.kind === 'rule'
      ? count + (child.fieldCode && child.value.trim() ? 1 : 0)
      : count + countActiveFilterBuilderRules(child)
  ), 0)
}

export function matchesFilterBuilderGroup<TItem, TCode extends string = string>(
  item: TItem,
  group: FilterBuilderGroup<TCode>,
  fields: Array<FilterBuilderField<TCode>>,
  resolveValue: (item: TItem, fieldCode: TCode) => FilterBuilderResolvedValue,
): boolean {
  const activeChildren = group.children.filter((child) => isActiveNode(child))
  if (!activeChildren.length) return true

  return group.operator === 'or'
    ? activeChildren.some((child) => matchNode(item, child, fields, resolveValue))
    : activeChildren.every((child) => matchNode(item, child, fields, resolveValue))
}

export function FilterBuilder<TCode extends string = string>({
  fields,
  value,
  onChange,
  className,
  rootOperator = 'and',
  showRootOperator = false,
  messages,
}: FilterBuilderProps<TCode>) {
  const fieldsByCode = React.useMemo(
    () => new Map(fields.map((field) => [field.code, field])),
    [fields],
  )
  const resolvedMessages = React.useMemo(
    () => ({ ...defaultFilterBuilderMessages, ...messages }),
    [messages],
  )

  function emit(next: FilterBuilderGroup<TCode>) {
    onChange({ ...next, operator: showRootOperator ? next.operator : rootOperator })
  }

  return (
    <div className={cn('space-y-5', className)}>
      <div className='hidden grid-cols-[1.2fr_1fr_1.2fr_auto] items-center gap-2 px-3 text-xs font-medium text-muted-foreground md:grid'>
        <span>{resolvedMessages.fieldColumnLabel}</span>
        <span>{resolvedMessages.operatorColumnLabel}</span>
        <span>{resolvedMessages.valueColumnLabel}</span>
        <span className='sr-only'>{resolvedMessages.actionsColumnLabel}</span>
      </div>

      <FilterBuilderGroupEditor
        fieldsByCode={fieldsByCode}
        fields={fields}
        messages={resolvedMessages}
        group={{ ...value, operator: showRootOperator ? value.operator : rootOperator }}
        onChange={emit}
        isRoot
        showOperator={showRootOperator}
      />
    </div>
  )
}

function FilterBuilderGroupEditor<TCode extends string = string>({
  fields,
  fieldsByCode,
  messages,
  group,
  onChange,
  isRoot = false,
  showOperator = true,
  onRemove,
}: {
  fields: Array<FilterBuilderField<TCode>>
  fieldsByCode: Map<TCode, FilterBuilderField<TCode>>
  messages: FilterBuilderMessages
  group: FilterBuilderGroup<TCode>
  onChange: (group: FilterBuilderGroup<TCode>) => void
  isRoot?: boolean
  showOperator?: boolean
  onRemove?: () => void
}) {
  const wrapperClassName = isRoot
    ? 'space-y-2'
    : 'space-y-2 rounded-md border border-border bg-muted/40 px-3 py-2'
  const connectorContainerClassName = 'space-y-1.5 pl-4'
  const totalConnectorItems = group.children.length + 1

  function getConnectorItemClassName(index: number) {
    const horizontal = 'relative before:absolute before:-left-4 before:top-4 before:h-px before:w-4 before:bg-border/70'
    const overlap = 'after:absolute after:-left-4 after:w-px after:bg-border/70'

    if (totalConnectorItems === 1) return horizontal
    if (index === 0) return `${horizontal} ${overlap} after:top-4 after:-bottom-1.5`
    if (index === totalConnectorItems - 1) return `${horizontal} ${overlap} after:-top-1.5 after:h-[calc(1rem+0.375rem)]`
    return `${horizontal} ${overlap} after:-top-1.5 after:-bottom-1.5`
  }

  return (
    <div className={wrapperClassName}>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          {showOperator ? (
            <Select
              value={group.operator}
              onValueChange={(value) => onChange({ ...group, operator: value as FilterBuilderGroupOperator })}
            >
              <SelectTrigger size='sm' className='h-8 w-[88px] bg-background'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='and'>{messages.andOperatorLabel}</SelectItem>
                <SelectItem value='or'>{messages.orOperatorLabel}</SelectItem>
              </SelectContent>
            </Select>
          ) : null}
        </div>

        {!isRoot ? (
          <Button
            variant='ghost'
            size='icon'
            className='size-7 text-muted-foreground'
            onClick={onRemove}
          >
            <X className='size-3.5' />
            <span className='sr-only'>{messages.removeGroupLabel}</span>
          </Button>
        ) : null}
      </div>

      {group.children.length ? (
        <div className={connectorContainerClassName}>
          {group.children.map((child, index) => child.kind === 'rule' ? (
            <div key={child.id} className={getConnectorItemClassName(index)}>
              <FilterBuilderRuleEditor
                fields={fields}
                fieldsByCode={fieldsByCode}
                messages={messages}
                rule={child}
                onChange={(rule) => onChange(updateGroupNode(group, child.id, () => rule) as FilterBuilderGroup<TCode>)}
                onRemove={() => onChange(removeNodeFromGroup(group, child.id))}
              />
            </div>
          ) : (
            <div key={child.id} className={`${getConnectorItemClassName(index)} space-y-1.5`}>
              <FilterBuilderGroupEditor
                fields={fields}
                fieldsByCode={fieldsByCode}
                messages={messages}
                group={child}
                onChange={(nextGroup) => onChange(
                  nextGroup.children.length
                    ? updateGroupNode(group, child.id, () => nextGroup) as FilterBuilderGroup<TCode>
                    : removeNodeFromGroup(group, child.id)
                )}
                onRemove={() => onChange(removeNodeFromGroup(group, child.id))}
              />
            </div>
          ))}

          <div className={getConnectorItemClassName(totalConnectorItems - 1)}>
            <AddNodeButton
              messages={messages}
              onAddCondition={() => onChange(appendNodeToGroup(group, group.id, createFilterBuilderRule<TCode>()))}
              onAddGroup={() => onChange(appendNodeToGroup(group, group.id, createFilterBuilderGroup<TCode>('and', true)))}
            />
          </div>
        </div>
      ) : (
        <div className='px-1 py-1 text-xs text-muted-foreground'>
          {isRoot ? messages.rootEmptyStateLabel : messages.nestedEmptyStateLabel}
        </div>
      )}

      {!group.children.length ? (
        <div className='flex justify-start'>
          <AddNodeButton
            messages={messages}
            onAddCondition={() => onChange(appendNodeToGroup(group, group.id, createFilterBuilderRule<TCode>()))}
            onAddGroup={() => onChange(appendNodeToGroup(group, group.id, createFilterBuilderGroup<TCode>('and', true)))}
          />
        </div>
      ) : null}
    </div>
  )
}

function FilterBuilderRuleEditor<TCode extends string = string>({
  fields,
  fieldsByCode,
  messages,
  rule,
  onChange,
  onRemove,
}: {
  fields: Array<FilterBuilderField<TCode>>
  fieldsByCode: Map<TCode, FilterBuilderField<TCode>>
  messages: FilterBuilderMessages
  rule: FilterBuilderRule<TCode>
  onChange: (rule: FilterBuilderRule<TCode>) => void
  onRemove: () => void
}) {
  const field = rule.fieldCode ? fieldsByCode.get(rule.fieldCode) : undefined
  const supportedConditions = getSupportedConditions(field?.dataType, field?.supportedConditions)

  return (
    <div className='grid gap-2 md:grid-cols-[1.2fr_1fr_1.2fr_auto] md:items-center'>
      <Select
        value={rule.fieldCode ?? UNSET_FILTER_FIELD}
        onValueChange={(value) => {
          if (value === UNSET_FILTER_FIELD) {
            onChange({ ...rule, fieldCode: null, condition: 'equals', value: '' })
            return
          }

          const nextField = fieldsByCode.get(value as TCode)
          onChange({
            ...rule,
            fieldCode: value as TCode,
            condition: getSupportedConditions(nextField?.dataType, nextField?.supportedConditions)[0].value,
            value: '',
          })
        }}
      >
        <SelectTrigger className='h-9 bg-background'>
          <SelectValue placeholder={messages.selectFieldPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={UNSET_FILTER_FIELD}>{messages.selectFieldPlaceholder}</SelectItem>
          {fields.map((item) => (
            <SelectItem key={item.code} value={item.code}>{item.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={rule.condition}
        onValueChange={(value) => onChange({ ...rule, condition: value as FilterBuilderCondition })}
      >
        <SelectTrigger className='h-9 bg-background'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {supportedConditions.map((condition) => (
            <SelectItem key={condition.value} value={condition.value}>{condition.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <FilterBuilderValueInput
        field={field}
        messages={messages}
        value={rule.value}
        onChange={(value) => onChange({ ...rule, value })}
      />

      <Button variant='ghost' size='icon' className='size-8 text-muted-foreground' onClick={onRemove}>
        <X className='size-3.5' />
        <span className='sr-only'>{messages.removeConditionLabel}</span>
      </Button>
    </div>
  )
}

function FilterBuilderValueInput<TCode extends string = string>({
  field,
  messages,
  value,
  onChange,
}: {
  field?: FilterBuilderField<TCode>
  messages: FilterBuilderMessages
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [options, setOptions] = React.useState<FilterBuilderOption[]>(field?.options ?? [])

  React.useEffect(() => {
    setOptions(field?.options ?? [])
  }, [field?.code, field?.options])

  React.useEffect(() => {
    let cancelled = false

    if (!open || !field?.getOptions) return

    setLoading(true)
    field.getOptions()
      .then((nextOptions) => {
        if (!cancelled) setOptions(nextOptions)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [field, open])

  if (!field) {
    return (
      <Input
        className='h-9 bg-background'
        value=''
        placeholder={messages.selectFieldFirstPlaceholder}
        disabled
        readOnly
      />
    )
  }

  if (field.dataType === 'select') {
    return (
      <Select value={value || undefined} open={open} onOpenChange={setOpen} onValueChange={onChange}>
        <SelectTrigger className='h-9 bg-background'>
          <SelectValue placeholder={messages.selectValuePlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <div className='flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground'>
              <LoaderCircle className='size-4 animate-spin' />
              {messages.loadingLabel}
            </div>
          ) : options.length ? (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))
          ) : (
            <div className='px-2 py-2 text-sm text-muted-foreground'>{messages.noOptionsLabel}</div>
          )}
        </SelectContent>
      </Select>
    )
  }

  if (field.dataType === 'date') {
    return <DateInput className='h-9 bg-background' value={value} onChange={(e) => onChange(e.target.value)} />
  }

  return (
    <Input
      className='h-9 bg-background'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={messages.enterValuePlaceholder}
    />
  )
}

function AddNodeButton({
  messages,
  onAddCondition,
  onAddGroup,
}: {
  messages: FilterBuilderMessages
  onAddCondition: () => void
  onAddGroup: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 gap-1.5 bg-background'>
          <Plus className='size-4' />
          {messages.addButtonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuItem onClick={onAddCondition}>{messages.addConditionLabel}</DropdownMenuItem>
        <DropdownMenuItem onClick={onAddGroup}>{messages.addGroupLabel}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getSupportedConditions(
  dataType?: FilterBuilderDataType,
  supportedConditions?: FilterBuilderCondition[],
): Array<{ label: string; value: FilterBuilderCondition }> {
  const conditions = supportedConditions?.length ? supportedConditions : getDefaultConditions(dataType)

  return conditions.map((condition) => ({
    value: condition,
    label: conditionLabelMap[condition],
  }))
}

function getDefaultConditions(dataType?: FilterBuilderDataType): FilterBuilderCondition[] {
  if (dataType === 'date') return ['on', 'before', 'after']
  if (dataType === 'select') return ['equals', 'notEquals']
  return ['contains', 'equals', 'startsWith', 'notEquals']
}

function updateGroupNode<TCode extends string = string>(
  group: FilterBuilderGroup<TCode>,
  targetId: string,
  updater: (node: FilterBuilderNode<TCode>) => FilterBuilderNode<TCode>,
): FilterBuilderGroup<TCode> {
  return {
    ...group,
    children: group.children.map((child) => {
      if (child.id === targetId) return updater(child)
      if (child.kind === 'group') return updateGroupNode(child, targetId, updater)
      return child
    }),
  }
}

function appendNodeToGroup<TCode extends string = string>(
  group: FilterBuilderGroup<TCode>,
  targetGroupId: string,
  node: FilterBuilderNode<TCode>,
): FilterBuilderGroup<TCode> {
  if (group.id === targetGroupId) {
    return { ...group, children: [...group.children, node] }
  }

  return {
    ...group,
    children: group.children.map((child) => (
      child.kind === 'group' ? appendNodeToGroup(child, targetGroupId, node) : child
    )),
  }
}

function removeNodeFromGroup<TCode extends string = string>(
  group: FilterBuilderGroup<TCode>,
  targetId: string,
): FilterBuilderGroup<TCode> {
  return {
    ...group,
    children: group.children
      .filter((child) => child.id !== targetId)
      .map((child) => child.kind === 'group' ? removeNodeFromGroup(child, targetId) : child),
  }
}

function createNodeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const conditionLabelMap: Record<FilterBuilderCondition, string> = {
  contains: 'Contains',
  equals: 'Equals',
  notEquals: 'Not equals',
  startsWith: 'Starts with',
  before: 'Before',
  after: 'After',
  on: 'On',
}

function matchNode<TItem, TCode extends string = string>(
  item: TItem,
  node: FilterBuilderNode<TCode>,
  fields: Array<FilterBuilderField<TCode>>,
  resolveValue: (item: TItem, fieldCode: TCode) => FilterBuilderResolvedValue,
) {
  return node.kind === 'rule'
    ? matchRule(item, node, fields, resolveValue)
    : matchesFilterBuilderGroup(item, node, fields, resolveValue)
}

function matchRule<TItem, TCode extends string = string>(
  item: TItem,
  rule: FilterBuilderRule<TCode>,
  fields: Array<FilterBuilderField<TCode>>,
  resolveValue: (item: TItem, fieldCode: TCode) => FilterBuilderResolvedValue,
) {
  if (!rule.fieldCode || !rule.value.trim()) return true

  const field = fields.find((entry) => entry.code === rule.fieldCode)
  if (!field) return true

  const rawValue = resolveValue(item, rule.fieldCode)
  if (field.dataType === 'date') {
    return matchDateRule(rawValue, rule.condition, rule.value)
  }

  const left = normalizeFilterBuilderValue(rawValue)
  const right = normalizeFilterBuilderValue(rule.value)

  switch (rule.condition) {
    case 'equals':
      return left === right
    case 'notEquals':
      return left !== right
    case 'startsWith':
      return left.startsWith(right)
    case 'contains':
    default:
      return left.includes(right)
  }
}

function matchDateRule(rawValue: FilterBuilderResolvedValue, condition: FilterBuilderCondition, ruleValue: string) {
  if (!ruleValue) return true

  const left = toDateString(rawValue)
  const right = toDateString(ruleValue)

  switch (condition) {
    case 'before':
      return left < right
    case 'after':
      return left > right
    case 'on':
    case 'equals':
    default:
      return left === right
  }
}

function isActiveNode<TCode extends string = string>(node: FilterBuilderNode<TCode>): boolean {
  return node.kind === 'rule'
    ? !!node.fieldCode && !!node.value.trim()
    : node.children.some((child) => isActiveNode(child))
}

function normalizeFilterBuilderValue(value: FilterBuilderResolvedValue): string {
  return String(value ?? '').trim().toLowerCase()
}

function toDateString(value: FilterBuilderResolvedValue): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value ?? '').slice(0, 10)
}
