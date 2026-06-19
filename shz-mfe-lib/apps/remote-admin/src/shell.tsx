import { useEffect } from 'react'
import type { ShellRemoteShellModule, ShellRemoteShellProps } from '@shz/core'
import config from './config'
import AdminAppPage from './pages/app'

function RemoteAdminShell({ onMenuChange }: ShellRemoteShellProps) {
  useEffect(() => {
    onMenuChange?.(config)
  }, [onMenuChange])

  return <AdminAppPage />
}

const remoteAdminShellModule = {
  default: RemoteAdminShell,
  getInitialMenu: () => config,
} satisfies ShellRemoteShellModule

export const getInitialMenu = remoteAdminShellModule.getInitialMenu

export default remoteAdminShellModule.default
