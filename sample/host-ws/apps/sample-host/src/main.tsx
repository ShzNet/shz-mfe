import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { configureFederation } from '@shznet/core'
import { Toaster } from 'sonner'
import { App } from './app'

// Configure the session buster before any remote module is loaded.
// Replace this with a build-time deploy ID (e.g. import.meta.env.VITE_DEPLOY_ID)
// or a content hash injected by your CI pipeline.
configureFederation({
  getSessionBuster: () => Date.now().toString(),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <App />
      <Toaster />
    </>
  </React.StrictMode>
)
