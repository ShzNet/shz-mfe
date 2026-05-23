import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import DashboardPage from './pages/dashboard'

// Standalone dev entry — not used when loaded via MF
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className='p-4'>
      <DashboardPage />
    </div>
  </React.StrictMode>
)
