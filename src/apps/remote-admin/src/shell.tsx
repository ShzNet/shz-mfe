import type { ShellRemoteShellProps } from '@shznet/core'
import AppPage from './pages/app'
import RemoteAdminMenu from './menu'

type RemoteShellProps = ShellRemoteShellProps

type RemoteShellModule = {
  default: typeof RemoteAdminShell
  Menu: typeof RemoteAdminMenu
}

function RemoteAdminShell({ shellServices }: RemoteShellProps) {
  return <AppPage shellServices={shellServices} />
}

const remoteAdminShellModule = {
  default: RemoteAdminShell,
  Menu: RemoteAdminMenu,
} satisfies RemoteShellModule

export const Menu = remoteAdminShellModule.Menu

export default remoteAdminShellModule.default
