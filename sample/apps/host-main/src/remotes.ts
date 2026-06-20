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

export const apps = [
  {
    id: 'remote-crm',
    name: 'CRM',
    basePath: '/app/crm',
    remoteName: 'remote_crm',
    entry: withRemoteCacheBuster(
      (import.meta as { env?: Record<string, string | undefined> }).env?.REMOTE_REMOTE_CRM_URL ??
        'http://localhost:3001/mf-manifest.json',
    ),
  },
  {
    id: 'remote-hr',
    name: 'HR',
    basePath: '/app/hr',
    remoteName: 'remote_hr',
    entry: withRemoteCacheBuster(
      (import.meta as { env?: Record<string, string | undefined> }).env?.REMOTE_REMOTE_HR_URL ??
        'http://localhost:3002/mf-manifest.json',
    ),
  },
] satisfies HostRemoteApp[]
