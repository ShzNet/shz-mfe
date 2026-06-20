import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layouts/app-shell'
import { HomePage } from './layouts/home-page'
import { apps } from '../remotes'

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      {apps.map((app) => (
        <Route key={app.id} path={`${app.basePath}/*`} element={<AppShell app={app} />} />
      ))}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}
