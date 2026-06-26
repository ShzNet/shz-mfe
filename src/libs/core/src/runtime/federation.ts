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

export interface FederationConfig {
  /**
   * Called once per page session to produce the value appended as `?_t=<buster>`
   * on every remote entry URL, preventing stale manifest caches.
   *
   * Default: `Date.now().toString()`
   *
   * Examples:
   *   getSessionBuster: () => __webpack_hash__          // content-hash from build
   *   getSessionBuster: () => env.DEPLOY_ID             // CI deploy ID
   *   getSessionBuster: () => Date.now().toString()     // always-fresh (dev)
   */
  getSessionBuster?: () => string
}

let _config: FederationConfig = {}

/** Call this once in host bootstrap (before any module is loaded). */
export function configureFederation(config: FederationConfig): void {
  _config = { ..._config, ...config }
}

// Resolved once and cached on globalThis so the same value survives HMR reloads.
function resolveSessionBuster(): string {
  const g = globalThis as Record<string, unknown>
  if (typeof g.__mfBuster !== 'string') {
    g.__mfBuster = _config.getSessionBuster?.() ?? Date.now().toString()
  }
  return g.__mfBuster as string
}

// Track which remotes have been registered this page session; survives HMR.
const globallyRegistered: Map<string, string> = (() => {
  const g = globalThis as Record<string, unknown>
  if (!(g.__mfRegistered instanceof Map)) g.__mfRegistered = new Map<string, string>()
  return g.__mfRegistered as Map<string, string>
})()

function withBuster(entry: string): string {
  const buster = resolveSessionBuster()
  try {
    const url = new URL(entry)
    url.searchParams.set('_t', buster)
    return url.toString()
  } catch {
    return `${entry}${entry.includes('?') ? '&' : '?'}_t=${buster}`
  }
}

const loadedRemoteStyles = new Set<string>()
const manifestPromiseCache = new Map<string, Promise<FederatedManifest>>()

function buildFederatedModuleId(remoteName: string, exposedModule: string) {
  return `${remoteName}${exposedModule.replace(/^\./, '')}`
}

function toError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) return error
  return new Error(fallbackMessage)
}

function buildRemoteLoadErrorMessage(
  phase: 'register' | 'preload' | 'load',
  remoteName: string,
  exposedModule: string,
  entry: string,
  error: unknown
) {
  const detail = toError(error, `Unknown federation ${phase} error`)
  return `Failed to ${phase} federated module "${remoteName}:${exposedModule}" from "${entry}": ${detail.message}`
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
  const prev = globallyRegistered.get(name)

  if (prev === entry) return

  if (prev !== undefined && prev !== entry) {
    throw new Error(`Remote "${name}" was already registered with a different entry`)
  }

  // Add cache buster here so callers pass clean URLs and MF registration stays stable.
  registerRemotes([{ name, entry: withBuster(entry) }])
  globallyRegistered.set(name, entry)
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
  try {
    await ensureFederatedRemoteRegistered({ name: remoteName, entry })
  } catch (error) {
    throw new Error(buildRemoteLoadErrorMessage('register', remoteName, exposedModule, entry, error))
  }

  try {
    await preloadRemote([{ nameOrAlias: remoteName, exposes: [exposedModule] }])
  } catch (error) {
    throw new Error(buildRemoteLoadErrorMessage('preload', remoteName, exposedModule, entry, error))
  }

  const moduleId = buildFederatedModuleId(remoteName, exposedModule)
  let remoteModule: TModule | null | undefined

  try {
    remoteModule = await loadRemote<TModule>(moduleId)
  } catch (error) {
    throw new Error(buildRemoteLoadErrorMessage('load', remoteName, exposedModule, entry, error))
  }

  if (remoteModule == null) {
    throw new Error(`Remote module "${moduleId}" could not be loaded from "${entry}"`)
  }

  return remoteModule
}
