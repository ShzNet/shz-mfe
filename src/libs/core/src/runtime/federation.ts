import { loadRemote, preloadRemote, registerRemotes } from '@module-federation/enhanced/runtime'

type FederatedManifest = {
  exposes?: Array<{
    path: string
    assets?: {
      css?: {
        sync?: string[]
        async?: string[]
      }
    }
  }>
}

export interface FederatedRemoteRegistration {
  name: string
  entry: string
}

const registeredRemotes = new Map<string, string>()
const loadedRemoteStyles = new Set<string>()
const manifestPromiseCache = new Map<string, Promise<FederatedManifest>>()

function buildFederatedModuleId(remoteName: string, exposedModule: string) {
  return `${remoteName}${exposedModule.replace(/^\./, '')}`
}

async function loadFederatedManifest(manifestUrl: string) {
  if (!manifestPromiseCache.has(manifestUrl)) {
    manifestPromiseCache.set(
      manifestUrl,
      fetch(manifestUrl).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load federated manifest: ${manifestUrl} (${response.status})`)
        }

        return (await response.json()) as FederatedManifest
      }).catch((error) => {
        manifestPromiseCache.delete(manifestUrl)
        throw error
      })
    )
  }

  return manifestPromiseCache.get(manifestUrl)!
}

export async function ensureFederatedRemoteRegistered({ name, entry }: FederatedRemoteRegistration) {
  const registeredEntry = registeredRemotes.get(name)
  if (registeredEntry === entry) return

  if (registeredEntry && registeredEntry !== entry) {
    throw new Error(`Remote "${name}" was already registered with a different entry`)
  }

  registerRemotes([{ name, entry }])
  registeredRemotes.set(name, entry)
}

export async function loadFederatedStyles(manifestUrl: string, exposedModule: string) {
  const manifest = await loadFederatedManifest(manifestUrl)
  const expose = manifest.exposes?.find((item) => item.path === exposedModule)
  const cssAssets = [...(expose?.assets?.css?.sync ?? []), ...(expose?.assets?.css?.async ?? [])]
  const baseUrl = new URL(manifestUrl)

  await Promise.all(
    cssAssets.map(async (asset) => {
      const href = new URL(asset, baseUrl).toString()
      if (loadedRemoteStyles.has(href)) return

      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLLinkElement>(`link[rel="stylesheet"][href="${href}"]`)
        if (existing) {
          loadedRemoteStyles.add(href)
          resolve()
          return
        }

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.onload = () => {
          loadedRemoteStyles.add(href)
          resolve()
        }
        link.onerror = () => reject(new Error(`Failed to load remote stylesheet: ${href}`))
        document.head.appendChild(link)
      })
    })
  )
}

export async function loadFederatedModule<TModule = unknown>(
  remoteName: string,
  exposedModule: string,
  entry: string
): Promise<TModule> {
  await ensureFederatedRemoteRegistered({ name: remoteName, entry })
  await preloadRemote([{ nameOrAlias: remoteName, exposes: [exposedModule] }])

  const moduleId = buildFederatedModuleId(remoteName, exposedModule)
  const remoteModule = await loadRemote<TModule>(moduleId)

  if (remoteModule == null) {
    throw new Error(`Remote module "${moduleId}" could not be loaded`)
  }

  return remoteModule
}
