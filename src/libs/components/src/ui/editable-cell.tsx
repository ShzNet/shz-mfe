import * as React from 'react'
import { Input } from './input'
import { cn } from '../lib/utils'

export type EditableCellRenderProps<V> = {
  value: V
  onChange: (value: V) => void
  /** Pass an explicit value for controls without a separate blur step (e.g. Select). */
  commit: (value?: V) => void
  cancel: () => void
}

export type EditableCellProps<V> = {
  value: V
  disabled?: boolean
  className?: string
  onSave: (value: V) => void
  renderView?: (value: V) => React.ReactNode
  renderEdit?: (props: EditableCellRenderProps<V>) => React.ReactNode
}

function defaultRenderView<V>(value: V) {
  const text = value === '' || value == null ? '—' : String(value)
  return <span className='block truncate leading-8'>{text}</span>
}

function DefaultTextEdit({ value, onChange, commit, cancel }: EditableCellRenderProps<string>) {
  return (
    <Input
      autoFocus
      value={value}
      className='h-8'
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => commit()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          commit()
        }
        if (e.key === 'Escape') {
          e.preventDefault()
          cancel()
        }
      }}
    />
  )
}

/**
 * Generic view/edit toggle for a single cell. Renders `renderView` by default;
 * clicking swaps to `renderEdit` (a plain text input unless overridden), so any
 * widget — select, number, date, etc. — can be used as the edit mode.
 */
export function EditableCell<V = string>({
  value,
  disabled,
  className,
  onSave,
  renderView = defaultRenderView,
  renderEdit,
}: EditableCellProps<V>) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState<V>(value)

  React.useEffect(() => {
    setDraft(value)
  }, [value])

  function commit(overrideValue?: V) {
    const next = overrideValue !== undefined ? overrideValue : draft
    setEditing(false)
    if (next !== value) onSave(next)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  if (editing && !disabled) {
    const edit = renderEdit ?? (DefaultTextEdit as unknown as (props: EditableCellRenderProps<V>) => React.ReactNode)
    return <>{edit({ value: draft, onChange: setDraft, commit, cancel })}</>
  }

  return (
    <button
      type='button'
      disabled={disabled}
      onClick={() => setEditing(true)}
      className={cn(
        'block h-8 w-full min-w-0 rounded-md border border-transparent px-2 text-left text-sm transition-colors hover:border-input hover:bg-muted disabled:cursor-not-allowed disabled:hover:border-transparent disabled:hover:bg-transparent',
        className
      )}
    >
      {renderView(value)}
    </button>
  )
}
