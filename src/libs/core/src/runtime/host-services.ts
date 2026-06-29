export type ShellHostGetTokenResult = string | null | Promise<string | null>

export interface ShellHostServices<TState = unknown> {
  getState?: () => TState
  getToken?: () => ShellHostGetTokenResult
  [serviceName: string]: unknown
}

const DEFAULT_SCOPE = 'default'
const shellHostServicesStore = new Map<string, ShellHostServices<unknown>>()

export function setShellHostServices<TState = unknown>(services: ShellHostServices<TState>, scope = DEFAULT_SCOPE) {
  shellHostServicesStore.set(scope, services as ShellHostServices<unknown>)
  return services
}

export function getShellHostServices<TState = unknown>(scope = DEFAULT_SCOPE) {
  return (shellHostServicesStore.get(scope) as ShellHostServices<TState> | undefined) ?? null
}

export function clearShellHostServices(scope = DEFAULT_SCOPE) {
  shellHostServicesStore.delete(scope)
}
