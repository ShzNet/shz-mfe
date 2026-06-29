import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import tailwindcss from '@tailwindcss/postcss'

const { parsed, publicVars } = loadEnv({
  prefixes: ['PUBLIC_', 'MODULE_', 'HOST_'],
})

const hostPort = Number(parsed.HOST_PORT?.trim() || '3000')

function normalizeProxyTarget(value: string) {
  return value.startsWith('http://') || value.startsWith('https://') ? value : `http://${value}`
}

function getModuleProxyConfig() {
  const modules = Object.entries(parsed)
    .map(([key, value]) => {
      const match = key.match(/^MODULE_(\d+)_CODE$/)
      if (!match) return null

      const index = Number(match[1])
      const code = value?.trim()
      const proxy = parsed[`MODULE_${index}_PROXY`]?.trim()
      if (!code || !proxy) return null

      return { index, code, proxy: normalizeProxyTarget(proxy) }
    })
    .filter((item): item is { index: number; code: string; proxy: string } => item !== null)
    .sort((left, right) => left.index - right.index)

  if (modules.length > 0) return modules

  return [{ index: 0, code: 'remote-admin', proxy: 'http://localhost:3001' }]
}

const moduleProxyConfig = getModuleProxyConfig()
const proxy = Object.fromEntries([
  ...moduleProxyConfig.map(({ code, proxy }) => [
    `/mfe/${code}`,
    {
      target: proxy,
      changeOrigin: true,
      pathRewrite: {
        [`^/mfe/${code}`]: '',
      },
    },
  ]),
])

export default defineConfig({
  server: {
    port: hostPort,
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy,
  },
  dev: {
    writeToDisk: true,
    client: { host: 'localhost', port: hostPort },
  },
  tools: {
    postcss: (config) => {
      if (typeof config.postcssOptions === 'function') return
      config.postcssOptions ??= {}
      config.postcssOptions.plugins ??= []
      config.postcssOptions.plugins.unshift(tailwindcss)
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  source: {
    entry: { index: './src/main.tsx' },
    define: {
      ...publicVars,
      __APP_ENV__: JSON.stringify(parsed),
    },
  },
  html: {
    template: './index.html',
  },
  plugins: [
    pluginReact(),
    pluginTypeCheck({
      tsCheckerOptions: {
        typescript: { configOverwrite: { include: ['src/**/*'] } },
      },
    }),
    pluginModuleFederation({
      dts: false,
      name: 'host_sample',
      remotes: {},
      shared: {
        '@shznet/core': { singleton: true, eager: true, requiredVersion: false },
        react: { singleton: true, eager: true, requiredVersion: false },
        'react-dom': { singleton: true, eager: true, requiredVersion: false },
        'react-router-dom': { singleton: true, eager: true, requiredVersion: false },
        '@shznet/components': { singleton: true, eager: true, requiredVersion: false },
      },
    }),
  ],
})
