import type { ShellMenuConfig } from '@shz/core'

const config = {
  nav: [
    { title: 'Dashboard', path: '', icon: 'LayoutDashboard', group: 'General' },
    { title: 'Analytics', path: '/analytics', icon: 'TrendingUp', group: 'General' },

    { title: 'Projects', path: '/projects', icon: 'FolderKanban', group: 'Management' },
    { title: 'Tasks', path: '/tasks', icon: 'CheckSquare', group: 'Management' },
    { title: 'Users', path: '/users', icon: 'Users', group: 'Management' },
    { title: 'Users Table', path: '/users-table', icon: 'Table2', group: 'Management' },
    { title: 'Orders Table', path: '/orders-table', icon: 'ShoppingCart', group: 'Management' },
    { title: 'Reports', path: '/reports', icon: 'FileText', group: 'Management' },
    { title: 'Messages', path: '/messages', icon: 'MessageSquare', group: 'Management' },

    { title: 'Tree Explorer', path: '/tree', icon: 'GitBranch', group: 'Tools' },
    { title: 'Kanban DnD', path: '/kanban', icon: 'LayoutGrid', group: 'Tools' },
    { title: 'Calendar', path: '/calendar', icon: 'CalendarDays', group: 'Tools' },
    { title: 'Settings', path: '/settings', icon: 'Settings', group: 'Tools' },

    { title: 'Catalog', path: '/shadcn/catalog', icon: 'Package', group: 'Components' },
    { title: 'Inputs', path: '/shadcn/inputs', icon: 'FormInput', group: 'Components' },
    { title: 'Data Display', path: '/shadcn/data-display', icon: 'BarChart3', group: 'Components' },
    { title: 'Overlays', path: '/shadcn/overlays', icon: 'Layers', group: 'Components' },
    { title: 'Navigation', path: '/shadcn/navigation', icon: 'Navigation', group: 'Components' },
    { title: 'Feedback', path: '/shadcn/feedback', icon: 'Bell', group: 'Components' },
    { title: 'UI Forms', path: '/ui-forms', icon: 'ClipboardList', group: 'Components' },
    { title: 'UI Data', path: '/ui-data', icon: 'Database', group: 'Components' },
  ],
} satisfies ShellMenuConfig

export default config
