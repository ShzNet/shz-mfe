import { getAppEnv } from './app/lib/app-env'

export interface HostRemoteApp {
  id: string
  name: string
  basePath: string
  fullPath: string
  remoteName: string
  entry: string
}

function formatModuleName(code: string) {
  return code
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function getRemoteConfig() {
  const code = getAppEnv('REMOTE_APP_CODE') || 'remote-admin'
  const name = formatModuleName(code)
  const remoteName = code.replace(/-/g, '_')
  const fullPath = `/app/${code}`
  const basePath = stripBasename(fullPath, resolveHostBasePath())

  return { basePath, code, fullPath, name, remoteName }
}

function normalizeBasePath(value: string | undefined) {
  const trimmed = value?.trim()
  if (!trimmed || trimmed === '/') return '/'

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return normalized.replace(/\/+$/, '')
}

function resolveHostBasePath() {
  return normalizeBasePath(getAppEnv('PUBLIC_ASSET_PREFIX'))
}

function stripBasename(pathname: string, basename: string) {
  if (basename === '/') return pathname
  if (pathname === basename) return '/'
  if (pathname.startsWith(`${basename}/`)) return pathname.slice(basename.length) || '/'
  return pathname
}

function getHostManifestPath(code: string) {
  return `/mfe/${code}/mf-manifest.json`
}

function resolveRemoteCacheBuster() {
  const storageKey = 'host_sample_remote_cache_buster'
  const existing = window.sessionStorage.getItem(storageKey)
  if (existing) return existing

  const next = Date.now().toString()
  window.sessionStorage.setItem(storageKey, next)
  return next
}

function withRemoteCacheBuster(entry: string) {
  if (import.meta.env.DEV) {
    return entry
  }

  const remoteCacheBuster = resolveRemoteCacheBuster()
  const url = new URL(entry)
  url.searchParams.set('t', remoteCacheBuster)
  return url.toString()
}

function resolveRemoteEntry(code: string) {
  const hostManifestUrl = `${window.location.origin}${getHostManifestPath(code)}`
  return withRemoteCacheBuster(hostManifestUrl)
}

export const apps: HostRemoteApp[] = (() => {
  const { basePath, code, fullPath, name, remoteName } = getRemoteConfig()

  return [{
    id: code,
    name,
    basePath,
    fullPath,
    remoteName,
    entry: resolveRemoteEntry(code),
  }]
})()
