import { registerRemotes } from '@module-federation/enhanced/runtime'

export interface HostRemoteApp {
  id: string
  name: string
  basePath: string
  remoteName: string
  entry: string
}

export const apps = [
  {
    id: 'admin',
    name: 'Admin Sample',
    basePath: '/app/admin',
    remoteName: 'remote_admin',
    entry: 'http://localhost:3103/mf-manifest.json',
  },
] satisfies HostRemoteApp[]

registerRemotes(apps.map((app) => ({ name: app.remoteName, entry: app.entry })))
