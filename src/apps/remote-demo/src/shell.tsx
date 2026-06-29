import type { ShellRemoteShellProps } from '@shznet/core'
import AppPage from './pages/app'
import RemoteDemoMenu from './menu'

type RemoteShellProps = ShellRemoteShellProps

type RemoteShellModule = {
  default: typeof RemoteShell
  Menu: typeof RemoteDemoMenu
}

function RemoteShell(_: RemoteShellProps) {
  return <AppPage />
}

const remoteShellModule = {
  default: RemoteShell,
  Menu: RemoteDemoMenu,
} satisfies RemoteShellModule

export const Menu = remoteShellModule.Menu

export default remoteShellModule.default
