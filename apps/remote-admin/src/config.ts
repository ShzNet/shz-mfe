import type { ShellMenuConfig } from '@shz/core'

const config: ShellMenuConfig = {
  nav: [
    { title: 'Dashboard', path: '', icon: 'LayoutDashboard', group: 'General' },
    { title: 'Projects', path: '/projects', icon: 'FolderKanban', group: 'Management' },
    { title: 'Reports', path: '/reports', icon: 'FileText', group: 'Management' },
    { title: 'Users Table', path: '/users-table', icon: 'Users', group: 'Management' },
    { title: 'Tree Explorer', path: '/tree', icon: 'ShieldCheck', group: 'Utilities' },
    { title: 'Kanban DnD', path: '/kanban', icon: 'CheckSquare', group: 'Utilities' },
    { title: 'Calendar', path: '/calendar', icon: 'CalendarDays', group: 'Utilities' },
    { title: 'UI Forms', path: '/ui-forms', icon: 'Settings', group: 'Components' },
    { title: 'UI Data', path: '/ui-data', icon: 'BarChart3', group: 'Components' },
  ],
}

export default config
