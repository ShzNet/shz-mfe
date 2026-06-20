function buildShellTsx(shellComponentName, navComponentName) {
  return `import AppPage from './pages/app'
import ${navComponentName} from './nav'

type RemoteShellProps = Record<string, never>

type RemoteShellModule = {
  default: typeof ${shellComponentName}
  Menu: typeof ${navComponentName}
}

function ${shellComponentName}(_: RemoteShellProps) {
  return <AppPage />
}

const remoteShellModule = {
  default: ${shellComponentName},
  Menu: ${navComponentName},
} satisfies RemoteShellModule

export const Menu = remoteShellModule.Menu

export default remoteShellModule.default
`
}

module.exports = { buildShellTsx }
