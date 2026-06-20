function buildMainTsx() {
  return `import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import { App } from './app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <App />
      <Toaster />
    </>
  </React.StrictMode>
)
`
}

function buildAppTsx() {
  return `import { AppRoutes } from './app/routes'

export function App() {
  return <AppRoutes />
}
`
}

module.exports = { buildMainTsx, buildAppTsx }
