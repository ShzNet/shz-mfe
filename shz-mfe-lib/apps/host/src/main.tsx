import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@/context/theme-provider'
import { App } from './app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
