import type { ShellHostServices } from '@shznet/core'
import type { AppDefinition, AuthState } from '../types'

export type HostShellState = {
  auth: AuthState | null
  activeApp: Pick<AppDefinition, 'id' | 'name' | 'basePath' | 'remoteName'>
}

export type HostShellServices = ShellHostServices<HostShellState> & {
  signOut: () => void
}

export function createHostShellServices(
  auth: AuthState | null,
  app: AppDefinition,
  onSignOut: () => void
): HostShellServices {
  return {
    getState: () => ({
      auth,
      activeApp: {
        id: app.id,
        name: app.name,
        basePath: app.basePath,
        remoteName: app.remoteName,
      },
    }),
    getToken: () => auth?.token ?? null,
    signOut: onSignOut,
  }
}
