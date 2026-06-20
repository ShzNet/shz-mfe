export interface HostRemoteApp {
  id: string
  name: string
  basePath: string
  remoteName: string
  entry: string
}

const remoteCacheBuster = Date.now().toString()

function withRemoteCacheBuster(entry: string) {
  const url = new URL(entry)
  url.searchParams.set('t', remoteCacheBuster)
  return url.toString()
}

export const apps: HostRemoteApp[] = [
  {
    id: 'remote-sales',
    name: 'Sales',
    basePath: '/app/sales',
    remoteName: 'remote_sales',
    entry: withRemoteCacheBuster('http://localhost:3001/mf-manifest.json'),
  },
  {
    id: 'remote-hr',
    name: 'HR',
    basePath: '/app/hr',
    remoteName: 'remote_hr',
    entry: withRemoteCacheBuster('http://localhost:3002/mf-manifest.json'),
  },
]
