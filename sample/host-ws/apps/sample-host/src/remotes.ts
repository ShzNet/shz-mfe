export interface HostRemoteApp {
  id: string
  name: string
  basePath: string
  remoteName: string
  entry: string
}

export const apps: HostRemoteApp[] = [
  {
    id: 'remote-sales',
    name: 'Sales',
    basePath: '/app/sales',
    remoteName: 'remote_sales',
    entry: 'http://localhost:3001/mf-manifest.json',
  },
  {
    id: 'remote-hr',
    name: 'HR',
    basePath: '/app/hr',
    remoteName: 'remote_hr',
    entry: 'http://localhost:3002/mf-manifest.json',
  },
]
