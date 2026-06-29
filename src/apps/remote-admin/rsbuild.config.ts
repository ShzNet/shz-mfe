import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import tailwindcss from '@tailwindcss/postcss'

const { parsed } = loadEnv({
  prefixes: ['PORT', 'BASE_PATH', 'ROUTE_BASE_PATH'],
})

const remotePort = Number(parsed.PORT?.trim() || '3001')
const assetPrefix = parsed.BASE_PATH?.trim() || '/mfe/remote-admin'

export default defineConfig({
  server: {
    port: remotePort,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  dev: {
    writeToDisk: true,
    assetPrefix,
    client: { host: 'localhost', port: remotePort },
  },
  output: {
    assetPrefix,
  },
  tools: {
    postcss: (config) => {
      if (typeof config.postcssOptions === 'function') return
      config.postcssOptions ??= {}
      config.postcssOptions.plugins ??= []
      config.postcssOptions.plugins.unshift(tailwindcss)
    },
  },
  source: {
    entry: { index: './src/main.tsx' },
    define: {
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
      name: 'remote_admin',
      exposes: {
        './config': './src/menu.tsx',
        './Shell': './src/shell.tsx',
      },
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
