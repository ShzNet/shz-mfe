/// <reference types="react" />
/// <reference types="react-dom" />

export {}

declare global {
  const __APP_ENV__: Record<string, string | undefined>

  interface ImportMetaEnv {
    readonly REMOTE_APP_CODE?: string
    readonly REMOTE_APP_PROXY?: string
    readonly PUBLIC_ASSET_PREFIX?: string
    readonly HOST_PORT?: string
    [key: string]: string | undefined
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
