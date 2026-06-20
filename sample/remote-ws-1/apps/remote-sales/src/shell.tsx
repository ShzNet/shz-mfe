import AppPage from './pages/app'
import RemoteSalesNav from './nav'

type RemoteShellProps = Record<string, never>

type RemoteShellModule = {
  default: typeof RemoteSalesShell
  Menu: typeof RemoteSalesNav
}

function RemoteSalesShell(_: RemoteShellProps) {
  return <AppPage />
}

const remoteShellModule = {
  default: RemoteSalesShell,
  Menu: RemoteSalesNav,
} satisfies RemoteShellModule

export const Menu = remoteShellModule.Menu

export default remoteShellModule.default
