import '../styles.css'
import { Route, Routes } from 'react-router-dom'
import type { ShellHostServices } from '@shznet/core'
import DashboardPage from './dashboard'
import UsersPage from './users'

type AppPageProps = {
  shellServices?: ShellHostServices
}

export default function AppPage({ shellServices }: AppPageProps) {
  return (
    <Routes>
      <Route index element={<DashboardPage shellServices={shellServices} />} />
      <Route path='users' element={<UsersPage />} />
    </Routes>
  )
}
