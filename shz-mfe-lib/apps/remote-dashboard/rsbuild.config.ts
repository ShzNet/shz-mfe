import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  server: {
    port: 3001,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  dev: {
    writeToDisk: true,
    assetPrefix: 'http://localhost:3001/',
    client: { host: 'localhost', port: 3001 },
  },
  output: {
    assetPrefix:
      (import.meta as { env?: Record<string, string | undefined> }).env?.REMOTE_DASHBOARD_URL ??
      'http://localhost:3001/',
  },
  tools: {
    // Remote app also processes Tailwind so it works in standalone dev mode.
    // In MFE context, host's CSS (which scans this app's source) covers all classes.
    // Having both is safe — identical CSS values don't conflict.
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
      name: 'remote_dashboard',
      exposes: {
        './Page': './src/pages/page.tsx',
        './config': './src/config.ts',
        './Nav': './src/nav.tsx',
      },
      shared: {
        '@shz/core': { singleton: true, requiredVersion: false },
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'react-router-dom': { singleton: true, requiredVersion: false },
      },
    }),
  ],
})
