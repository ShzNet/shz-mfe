function buildMainTsx() {
  return `import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppPage from './pages/app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className='p-4'>
        <AppPage />
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
`
}

module.exports = { buildMainTsx }
