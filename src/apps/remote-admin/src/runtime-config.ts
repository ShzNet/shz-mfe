const DEFAULT_REMOTE_ADMIN_ROUTE_BASE_PATH = '/app/remote-admin'

function normalizeBasePath(value: string | undefined, fallback: string) {
  const trimmed = value?.trim()
  if (!trimmed) return fallback

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return normalized === '/' ? normalized : normalized.replace(/\/+$/, '')
}

export const REMOTE_ADMIN_BASE_PATH = normalizeBasePath(
  __APP_ENV__.ROUTE_BASE_PATH,
  DEFAULT_REMOTE_ADMIN_ROUTE_BASE_PATH
)

export const REMOTE_ADMIN_STANDALONE_BASE_PATH = REMOTE_ADMIN_BASE_PATH
