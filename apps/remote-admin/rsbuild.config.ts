import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  server: {
    port: 3003,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  dev: {
    writeToDisk: true,
    assetPrefix: 'http://localhost:3003/',
    client: { host: 'localhost', port: 3003 },
  },
  output: {
    assetPrefix:
      (import.meta as { env?: Record<string, string | undefined> }).env?.REMOTE_ADMIN_URL ??
      'http://localhost:3003/',
  },
  tools: {
    postcss: (config) => {
      if (typeof config.postcssOptions === 'function') {
        return
      }
      config.postcssOptions ??= {}
      config.postcssOptions.plugins ??= []
      config.postcssOptions.plugins.unshift(tailwindcss)
    },
  },
  resolve: {
    alias: {},
  },
  source: {
    entry: { index: './src/main.tsx' },
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
        './config': './src/config.ts',
        './Page': './src/pages/app.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'react-router-dom': { singleton: true, requiredVersion: false },
      },
    }),
  ],
})
