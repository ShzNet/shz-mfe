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

const remoteUsersShellModule = {
  default: RemoteUsersShell,
  getInitialMenu: () => config,
} satisfies ShellRemoteShellModule

export const getInitialMenu = remoteUsersShellModule.getInitialMenu

export default remoteUsersShellModule.default
