export type { ShellMenuItem, ShellMenuConfig } from './contracts/menu'
export type { ShellRemoteModuleMeta, ShellResolvedModule, ShellRouteItem } from './contracts/shell'

export type { CoreEvent, EventBus, Unsubscribe } from './runtime/event-bus'
export { createEventBus } from './runtime/event-bus'

export type { FederatedRemoteRegistration, FederationConfig } from './runtime/federation'
export {
  configureFederation,
  ensureFederatedRemoteRegistered,
  isFederationDebugEnabled,
  loadFederatedModule,
  loadFederatedStyles,
} from './runtime/federation'

export type {
  ShellRemoteContextValue,
  ShellRemoteComponentProps,
  ShellRemoteShellProps,
  ShellRemoteShellModule,
} from './runtime/remote-context'
export {
  buildShellRemoteContextKey,
  setShellRemoteContext,
  getShellRemoteContext,
  getShellRemoteContextData,
  clearShellRemoteContext,
} from './runtime/remote-context'

export type { ShellState, ShellStateStore } from './runtime/shell-state'
export { createShellStateStore } from './runtime/shell-state'
