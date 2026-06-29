import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppPage from './pages/app'
import { REMOTE_ADMIN_STANDALONE_BASE_PATH } from './runtime-config'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={REMOTE_ADMIN_STANDALONE_BASE_PATH}>
      <div className='p-4'>
        <AppPage />
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
