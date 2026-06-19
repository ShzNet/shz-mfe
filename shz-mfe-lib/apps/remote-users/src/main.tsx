import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import UsersPage from './pages/page'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className='p-4'>
      <UsersPage />
    </div>
  </React.StrictMode>
)
