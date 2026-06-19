import { Suspense, lazy } from 'react'
import { loadRemoteComponent } from '../lib/remote-loader'

type RemoteModuleProps = {
  remoteName: string
  exposedModule: string
  entry: string
}

function RemoteFallback() {
  return <div className='p-6 text-sm text-muted-foreground'>Loading module...</div>
}

export function RemoteModule({ remoteName, exposedModule, entry }: RemoteModuleProps) {
  const LazyComponent = lazy(async () => {
    const mod = await loadRemoteComponent(remoteName, exposedModule, entry)
    return { default: mod.default }
  })

  return (
    <Suspense fallback={<RemoteFallback />}>
      <LazyComponent />
    </Suspense>
  )
}
