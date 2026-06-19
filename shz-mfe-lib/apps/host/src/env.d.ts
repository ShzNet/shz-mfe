interface ImportMeta {
  webpackHot?: {
    accept(deps: string[], callback: () => void): void
    accept(callback?: () => void): void
    dispose(callback: (data: unknown) => void): void
  }
}
