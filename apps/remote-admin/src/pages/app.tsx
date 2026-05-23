import { Route, Routes } from 'react-router-dom'
import DashboardPage from './dashboard'
import ProjectsPage from './projects'
import ReportsPage from './reports'
import UsersTablePage from './users-table'
import TreeExplorerPage from './tree-explorer'
import KanbanDndPage from './kanban-dnd'
import CalendarPage from './calendar'
import UiFormsPage from './ui-forms'
import UiDataPage from './ui-data'

export default function AdminAppPage() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path='projects' element={<ProjectsPage />} />
      <Route path='reports' element={<ReportsPage />} />
      <Route path='users-table' element={<UsersTablePage />} />
      <Route path='tree' element={<TreeExplorerPage />} />
      <Route path='kanban' element={<KanbanDndPage />} />
      <Route path='calendar' element={<CalendarPage />} />
      <Route path='ui-forms' element={<UiFormsPage />} />
      <Route path='ui-data' element={<UiDataPage />} />
    </Routes>
  )
}
