import AppPage from './pages/app'
import RemoteHrNav from './nav'

type RemoteShellProps = Record<string, never>

type RemoteShellModule = {
  default: typeof RemoteHrShell
  Menu: typeof RemoteHrNav
}

function RemoteHrShell(_: RemoteShellProps) {
  return <AppPage />
}

const remoteShellModule = {
  default: RemoteHrShell,
  Menu: RemoteHrNav,
} satisfies RemoteShellModule

export const Menu = remoteShellModule.Menu

export default remoteShellModule.default
