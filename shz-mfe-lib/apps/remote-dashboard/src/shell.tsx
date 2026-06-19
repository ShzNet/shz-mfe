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

const remoteDashboardShellModule = {
  default: RemoteDashboardShell,
  getInitialMenu: () => config,
} satisfies ShellRemoteShellModule

export const getInitialMenu = remoteDashboardShellModule.getInitialMenu

export default remoteDashboardShellModule.default
