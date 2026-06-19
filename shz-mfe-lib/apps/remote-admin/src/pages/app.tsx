import { Route, Routes } from 'react-router-dom'
import DashboardPage from './dashboard'
import AnalyticsPage from './analytics'
import ProjectsPage from './projects'
import ReportsPage from './reports'
import UsersPage from './users'
import UsersTablePage from './users-table'
import TasksPage from './tasks'
import MessagesPage from './messages'
import TreeExplorerPage from './tree-explorer'
import KanbanDndPage from './kanban-dnd'
import CalendarPage from './calendar'
import SettingsPage from './settings'
import UiFormsPage from './ui-forms'
import UiDataPage from './ui-data'
import ShadcnCatalogPage from './shadcn-catalog'
import ShadcnInputsPage from './shadcn-inputs'
import ShadcnDataDisplayPage from './shadcn-data-display'
import ShadcnOverlaysPage from './shadcn-overlays'
import ShadcnNavigationPage from './shadcn-navigation'
import ShadcnFeedbackPage from './shadcn-feedback-utilities'

export default function AdminAppPage() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path='analytics' element={<AnalyticsPage />} />
      <Route path='projects' element={<ProjectsPage />} />
      <Route path='reports' element={<ReportsPage />} />
      <Route path='users' element={<UsersPage />} />
      <Route path='users-table' element={<UsersTablePage />} />
      <Route path='tasks' element={<TasksPage />} />
      <Route path='messages' element={<MessagesPage />} />
      <Route path='tree' element={<TreeExplorerPage />} />
      <Route path='kanban' element={<KanbanDndPage />} />
      <Route path='calendar' element={<CalendarPage />} />
      <Route path='settings' element={<SettingsPage />} />
      <Route path='ui-forms' element={<UiFormsPage />} />
      <Route path='ui-data' element={<UiDataPage />} />
      <Route path='shadcn/catalog' element={<ShadcnCatalogPage />} />
      <Route path='shadcn/inputs' element={<ShadcnInputsPage />} />
      <Route path='shadcn/data-display' element={<ShadcnDataDisplayPage />} />
      <Route path='shadcn/overlays' element={<ShadcnOverlaysPage />} />
      <Route path='shadcn/navigation' element={<ShadcnNavigationPage />} />
      <Route path='shadcn/feedback' element={<ShadcnFeedbackPage />} />
    </Routes>
  )
}
