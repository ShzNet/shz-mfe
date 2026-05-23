export type Unsubscribe = () => void

export interface CoreEvent<TType extends string = string, TPayload = unknown> {
  type: TType
  payload: TPayload
  source?: string
  timestamp: number
}

type EventHandler<TEvent extends CoreEvent = CoreEvent> = (event: TEvent) => void

export interface EventBus<TEvent extends CoreEvent = CoreEvent> {
  emit: (event: Omit<TEvent, 'timestamp'>) => void
  on: (type: TEvent['type'] | '*', handler: EventHandler<TEvent>) => Unsubscribe
  clear: () => void
}

export function createEventBus<TEvent extends CoreEvent = CoreEvent>(): EventBus<TEvent> {
  const handlers = new Map<string, Set<EventHandler<TEvent>>>()

  function emit(event: Omit<TEvent, 'timestamp'>) {
    const fullEvent = { ...event, timestamp: Date.now() } as TEvent
    handlers.get(event.type)?.forEach((h) => h(fullEvent))
    handlers.get('*')?.forEach((h) => h(fullEvent))
  }

  function on(type: TEvent['type'] | '*', handler: EventHandler<TEvent>) {
    const key = String(type)
    const bucket = handlers.get(key) ?? new Set<EventHandler<TEvent>>()
    bucket.add(handler)
    handlers.set(key, bucket)
    return () => {
      bucket.delete(handler)
      if (bucket.size === 0) handlers.delete(key)
    }
  }

  function clear() {
    handlers.clear()
  }

  return { emit, on, clear }
}
