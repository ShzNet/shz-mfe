function buildShellServicesTsx(corePackage) {
  return `import { createContext, useContext, type PropsWithChildren } from 'react'
import type { ShellHostServices } from '${corePackage}'

export type RemoteRequestDescriptor = {
  input: RequestInfo | URL
  init?: RequestInit
}

export interface ModuleAuthService {
  getAccessToken: () => Promise<string | null>
}

export interface ModuleHttpService {
  prepareRequest: (request: RemoteRequestDescriptor) => Promise<RemoteRequestDescriptor>
}

export type ModuleShellServices = ShellHostServices & {
  auth?: ModuleAuthService
  http?: ModuleHttpService
}

function createMockShellServices(): ModuleShellServices {
  return {
    auth: {
      async getAccessToken() {
        return 'mock-access-token'
      },
    },
    http: {
      async prepareRequest(request: RemoteRequestDescriptor) {
        return request
      },
    },
    getToken: async () => 'mock-access-token',
  }
}

const defaultShellServices = createMockShellServices()

const ModuleShellServicesContext = createContext<ModuleShellServices>(defaultShellServices)

type ModuleShellServicesProviderProps = PropsWithChildren<{
  shellServices?: ModuleShellServices
}>

export function ModuleShellServicesProvider({ children, shellServices }: ModuleShellServicesProviderProps) {
  return <ModuleShellServicesContext.Provider value={shellServices ?? defaultShellServices}>{children}</ModuleShellServicesContext.Provider>
}

export function useModuleShellServices() {
  return useContext(ModuleShellServicesContext)
}

export function useModuleService<TService>(serviceName: string) {
  const services = useModuleShellServices()
  return services[serviceName] as TService | undefined
}
`
}

module.exports = { buildShellServicesTsx }
