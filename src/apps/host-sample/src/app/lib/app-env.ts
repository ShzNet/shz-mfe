export function getAppEnv(key: string): string {
  return __APP_ENV__[key]?.trim() || ''
}

export function getAppEnvEntries(): Array<[string, string | undefined]> {
  return Object.entries(__APP_ENV__) as Array<[string, string | undefined]>
}
