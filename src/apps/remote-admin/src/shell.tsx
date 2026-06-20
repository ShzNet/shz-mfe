import AppPage from './pages/app'
import RemoteAdminMenu from './nav'

type RemoteShellProps = Record<string, never>

type RemoteShellModule = {
  default: typeof RemoteAdminShell
  Menu: typeof RemoteAdminMenu
}

function RemoteAdminShell(_: RemoteShellProps) {
  return <AppPage />
}

const remoteAdminShellModule = {
  default: RemoteAdminShell,
  Menu: RemoteAdminMenu,
} satisfies RemoteShellModule

export const Menu = remoteAdminShellModule.Menu

export default remoteAdminShellModule.default
