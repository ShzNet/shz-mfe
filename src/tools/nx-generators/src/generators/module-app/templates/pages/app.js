function buildAppPageTsx() {
  return `import '../styles.css'
import { Route, Routes } from 'react-router-dom'
import DashboardPage from './dashboard'
import UsersPage from './users'

export default function AppPage() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path='users' element={<UsersPage />} />
    </Routes>
  )
}
`
}

module.exports = { buildAppPageTsx }
