export interface ShellMenuItem {
  title: string
  /** Sub-path relative to app basePath. Empty string = basePath */
  path: string
  icon: string
  group: string
}

export interface ShellMenuConfig {
  nav: ShellMenuItem[]
}
