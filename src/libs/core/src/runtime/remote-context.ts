import type { ComponentType } from 'react'
import type { ShellMenuConfig } from '../contracts/menu'
import type { ShellRemoteModuleMeta } from '../contracts/shell'
import type { ShellHostServices } from './host-services'

export interface ShellRemoteContextValue<TData = unknown> {
  remote: Partial<ShellRemoteModuleMeta> & Pick<ShellRemoteModuleMeta, 'remoteName'>
  exposedModule: string
  data: TData
}

export interface ShellRemoteComponentProps<TData = unknown, THostServices = ShellHostServices> {
  shellContext?: ShellRemoteContextValue<TData>
  shellServices?: THostServices
}

export interface ShellRemoteShellProps<TData = unknown, THostServices = ShellHostServices>
  extends ShellRemoteComponentProps<TData, THostServices> {
  onMenuChange?: (menu: ShellMenuConfig) => void
}

export interface ShellRemoteShellModule<TData = unknown, THostServices = ShellHostServices> {
  default: ComponentType<ShellRemoteShellProps<TData, THostServices>>
  getInitialMenu?: () => ShellMenuConfig
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
