export type { ShellMenuItem, ShellMenuConfig } from './contracts/menu'
export type { ShellRemoteModuleMeta, ShellResolvedModule, ShellRouteItem } from './contracts/shell'

export type { CoreEvent, EventBus, Unsubscribe } from './runtime/event-bus'
export { createEventBus } from './runtime/event-bus'

export type { ShellRemoteContextValue, ShellRemoteComponentProps } from './runtime/remote-context'
export {
  buildShellRemoteContextKey,
  setShellRemoteContext,
  getShellRemoteContext,
  getShellRemoteContextData,
  clearShellRemoteContext,
} from './runtime/remote-context'

export type { ShellState, ShellStateStore } from './runtime/shell-state'
export { createShellStateStore } from './runtime/shell-state'
