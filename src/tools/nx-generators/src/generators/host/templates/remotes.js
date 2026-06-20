function buildRemotesTs() {
  return `export interface HostRemoteApp {
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
  // {
  //   id: 'remote-admin',
  //   name: 'Remote Admin',
  //   basePath: '/app/admin',
  //   remoteName: 'remote_admin',
  //   entry: withRemoteCacheBuster('http://localhost:3001/mf-manifest.json'),
  // },
]
`
}

module.exports = { buildRemotesTs }
