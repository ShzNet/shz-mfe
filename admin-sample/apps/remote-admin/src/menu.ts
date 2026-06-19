import type { ShellMenuConfig } from '@shz/core'

const baseMenu = {
  nav: [
    { title: 'Overview', path: '', icon: 'LayoutDashboard', group: 'General' },
  ],
} satisfies ShellMenuConfig

export function getRemoteAdminMenu(): ShellMenuConfig {
  return baseMenu
}

export default baseMenu
