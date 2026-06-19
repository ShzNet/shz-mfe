import type { ShellRemoteModuleMeta } from '../contracts/shell'

export interface ShellRemoteContextValue<TData = unknown> {
  remote: Partial<ShellRemoteModuleMeta> & Pick<ShellRemoteModuleMeta, 'remoteName'>
  exposedModule: string
  data: TData
}

export interface ShellRemoteComponentProps<TData = unknown> {
  shellContext?: ShellRemoteContextValue<TData>
}

const remoteContextStore = new Map<string, ShellRemoteContextValue<unknown>>()

export function buildShellRemoteContextKey(remoteName: string, exposedModule: string) {
  return `${remoteName}::${exposedModule}`
}

export function setShellRemoteContext<TData>(value: ShellRemoteContextValue<TData>) {
  remoteContextStore.set(
    buildShellRemoteContextKey(value.remote.remoteName, value.exposedModule),
    value as ShellRemoteContextValue<unknown>
  )
}

export function getShellRemoteContext<TData = unknown>(remoteName: string, exposedModule: string) {
  return (
    (remoteContextStore.get(buildShellRemoteContextKey(remoteName, exposedModule)) as ShellRemoteContextValue<TData> | undefined) ??
    null
  )
}

export function getShellRemoteContextData<TData = unknown>(remoteName: string, exposedModule: string) {
  return getShellRemoteContext<TData>(remoteName, exposedModule)?.data ?? null
}

export function clearShellRemoteContext(remoteName: string, exposedModule: string) {
  remoteContextStore.delete(buildShellRemoteContextKey(remoteName, exposedModule))
}
