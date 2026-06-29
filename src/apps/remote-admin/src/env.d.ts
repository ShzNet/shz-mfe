/// <reference types="react" />
/// <reference types="react-dom" />

export {}

declare global {
  const __APP_ENV__: Record<string, string | undefined>

  interface ImportMetaEnv {
    readonly BASE_PATH?: string
    readonly ROUTE_BASE_PATH?: string
    readonly PORT?: string
    [key: string]: string | undefined
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
