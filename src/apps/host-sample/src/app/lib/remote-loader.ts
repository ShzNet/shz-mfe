import { loadFederatedModule } from '@shznet/core'

export async function loadRemoteModule<TModule = unknown>(remoteName: string, exposedModule: string, entry: string): Promise<TModule> {
  return loadFederatedModule<TModule>(remoteName, exposedModule, entry)
}
