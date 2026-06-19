import { useEffect } from 'react'
import type { ShellMenuConfig } from '@shz/core'
import { getRemoteAdminMenu } from './menu'
import AppPage from './pages/app'

type RemoteShellProps = {
  onMenuChange?: (menu: ShellMenuConfig) => void
}

type RemoteShellModule = {
  default: typeof RemoteAdminShell
  getInitialMenu: () => ShellMenuConfig
}

function RemoteAdminShell({ onMenuChange }: RemoteShellProps) {
  useEffect(() => {
    onMenuChange?.(getRemoteAdminMenu())
  }, [onMenuChange])

  return <AppPage />
}

const remoteAdminShellModule = {
  default: RemoteAdminShell,
  getInitialMenu: getRemoteAdminMenu,
} satisfies RemoteShellModule

export const getInitialMenu = remoteAdminShellModule.getInitialMenu

export default remoteAdminShellModule.default
