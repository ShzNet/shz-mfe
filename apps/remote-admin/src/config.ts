import type { RemoteAppConfig } from '@shz/components/remote-config'

const config: RemoteAppConfig = {
  nav: [
    // Analytics
    { title: 'Overview', path: '', icon: 'LayoutDashboard', group: 'Analytics', expose: './DashboardPage' },
    { title: 'Analytics', path: '/analytics', icon: 'BarChart3', group: 'Analytics', expose: './AnalyticsPage' },
    { title: 'Reports', path: '/reports', icon: 'FileText', group: 'Analytics', expose: './ReportsPage' },
    // Management
    { title: 'Projects', path: '/projects', icon: 'FolderKanban', group: 'Management', expose: './ProjectsPage' },
    { title: 'Users', path: '/users', icon: 'Users', group: 'Management', expose: './UsersPage' },
    { title: 'Tasks', path: '/tasks', icon: 'CheckSquare', group: 'Management', expose: './TasksPage' },
    // Communication
    { title: 'Messages', path: '/messages', icon: 'MessageSquare', group: 'Communication', expose: './MessagesPage' },
    { title: 'Calendar', path: '/calendar', icon: 'CalendarDays', group: 'Communication', expose: './CalendarPage' },
    // System
    { title: 'Settings', path: '/settings', icon: 'Settings', group: 'System', expose: './SettingsPage' },
  ],
}

export default config
