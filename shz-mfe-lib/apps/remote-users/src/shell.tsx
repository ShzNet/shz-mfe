import { useEffect } from 'react'
import type { ShellRemoteShellModule, ShellRemoteShellProps } from '@shz/core'
import config from './config'
import UsersPage from './pages/page'

function RemoteUsersShell({ onMenuChange }: ShellRemoteShellProps) {
  useEffect(() => {
    onMenuChange?.(config)
  }, [onMenuChange])

  return <UsersPage />
}

export const getInitialMenu: ShellRemoteShellModule['getInitialMenu'] = () => config

export default RemoteUsersShell
