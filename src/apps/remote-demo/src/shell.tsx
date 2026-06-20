import AppPage from './pages/app'
import RemoteDemoNav from './nav'

type RemoteShellProps = Record<string, never>

type RemoteShellModule = {
  default: typeof RemoteShell
  Menu: typeof RemoteDemoNav
}

function RemoteShell(_: RemoteShellProps) {
  return <AppPage />
}

const remoteShellModule = {
  default: RemoteShell,
  Menu: RemoteDemoNav,
} satisfies RemoteShellModule

export const Menu = remoteShellModule.Menu

export default remoteShellModule.default
