export interface RemoteNavItem {
  title: string
  /** Sub-path relative to the app's basePath. Empty string = the basePath itself. */
  path: string
  icon: string
  group: string
  /** Exposed module key (e.g. './DashboardPage'). Defaults to './Page' if omitted. */
  expose?: string
}

export interface RemoteAppConfig {
  nav: RemoteNavItem[]
}
