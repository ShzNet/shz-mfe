import type { ShellMenuConfig } from './menu'

export interface ShellRemoteModuleMeta {
  id: string
  name: string
  remoteName: string
  basePath: string
  entry: string
  /** Optional module logo path (e.g. /module-logos/admin.png) */
  logoPng?: string
}

export interface ShellResolvedModule extends ShellRemoteModuleMeta {
  menu: ShellMenuConfig
}

export interface ShellRouteItem {
  path: string
  nav: {
    title: string
    icon: string
    group: string
  }
}
