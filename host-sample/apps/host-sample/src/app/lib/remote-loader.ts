import type { ComponentType } from 'react'

type RemoteManifest = {
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

const loadedRemoteStyles = new Set<string>()

function buildModuleId(remoteName: string, exposedModule: string) {
  return `${remoteName}${exposedModule.replace(/^\./, '')}`
}

async function loadRemoteStyles(manifestUrl: string, exposedModule: string) {
  const manifest = (await fetch(manifestUrl).then((response) => response.json())) as RemoteManifest
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

export async function loadRemoteComponent(remoteName: string, exposedModule: string, entry: string) {
  const { loadRemote } = await import('@module-federation/enhanced/runtime')
  await loadRemoteStyles(entry, exposedModule)
  const moduleId = buildModuleId(remoteName, exposedModule)
  return (await loadRemote(moduleId)) as { default: ComponentType }
}
