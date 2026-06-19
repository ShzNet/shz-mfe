import { useEffect } from 'react'
import type { ShellRemoteShellModule, ShellRemoteShellProps } from '@shz/core'
import config from './config'
import DashboardPage from './pages/page'

function RemoteDashboardShell({ onMenuChange }: ShellRemoteShellProps) {
  useEffect(() => {
    onMenuChange?.(config)
  }, [onMenuChange])

  return <DashboardPage />
}

export const getInitialMenu: ShellRemoteShellModule['getInitialMenu'] = () => config

export default RemoteDashboardShell
