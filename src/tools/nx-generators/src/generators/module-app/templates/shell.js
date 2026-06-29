function buildShellTsx(shellComponentName, navComponentName, corePackage = '@shznet/core') {
  return `import type { ShellRemoteComponentProps, ShellRemoteShellProps } from '${corePackage}'
import AppPage from './pages/app'
import ${navComponentName} from './nav'
import { ModuleShellServicesProvider, type ModuleShellServices } from './shell-services'

type RemoteShellProps = ShellRemoteShellProps<unknown, ModuleShellServices>
type RemoteMenuProps = ShellRemoteComponentProps<unknown, ModuleShellServices>

type RemoteShellModule = {
  default: typeof ${shellComponentName}
  Menu: typeof ${navComponentName}Menu
}

function ${shellComponentName}({ shellServices }: RemoteShellProps) {
  return (
    <ModuleShellServicesProvider shellServices={shellServices}>
      <AppPage />
    </ModuleShellServicesProvider>
  )
}

function ${navComponentName}Menu(_: RemoteMenuProps) {
  return <${navComponentName} />
}

const remoteShellModule = {
  default: ${shellComponentName},
  Menu: ${navComponentName}Menu,
} satisfies RemoteShellModule

export const Menu = remoteShellModule.Menu

export default remoteShellModule.default
`
}

module.exports = { buildShellTsx }
