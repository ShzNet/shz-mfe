import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AdminAppPage from './pages/app'

// Standalone dev entry — not used when loaded via MF
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className='p-4'>
        <AdminAppPage />
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
