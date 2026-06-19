import { useEffect } from 'react'
import type { ShellMenuConfig } from '@shz/core'
import config from './config'
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
    onMenuChange?.(config)
  }, [onMenuChange])

  return <AppPage />
}

const remoteAdminShellModule = {
  default: RemoteAdminShell,
  getInitialMenu: () => config,
} satisfies RemoteShellModule

export const getInitialMenu = remoteAdminShellModule.getInitialMenu

export default remoteAdminShellModule.default
