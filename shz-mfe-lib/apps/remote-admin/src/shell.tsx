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

export const getInitialMenu: ShellRemoteShellModule['getInitialMenu'] = () => config

export default RemoteAdminShell
