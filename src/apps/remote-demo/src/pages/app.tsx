import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './home'

export default function AppPage() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path='*' element={<Navigate to='.' replace />} />
    </Routes>
  )
}
