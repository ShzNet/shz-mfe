import AppPage from './pages/app'
import RemoteCrmNav from './nav'

type RemoteShellProps = Record<string, never>

type RemoteShellModule = {
  default: typeof RemoteCrmShell
  Menu: typeof RemoteCrmNav
}

function RemoteCrmShell(_: RemoteShellProps) {
  return <AppPage />
}

const remoteShellModule = {
  default: RemoteCrmShell,
  Menu: RemoteCrmNav,
} satisfies RemoteShellModule

export const Menu = remoteShellModule.Menu

export default remoteShellModule.default
