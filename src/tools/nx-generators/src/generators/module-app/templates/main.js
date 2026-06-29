function buildMainTsx() {
  return `import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppPage from './pages/app'
import { ModuleShellServicesProvider } from './shell-services'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ModuleShellServicesProvider>
        <div className='p-4'>
          <AppPage />
        </div>
      </ModuleShellServicesProvider>
    </BrowserRouter>
  </React.StrictMode>
)
`
}

module.exports = { buildMainTsx }
