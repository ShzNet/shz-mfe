function buildRsbuildConfig(options, envName) {
  return `import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  server: {
    port: ${options.port},
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  dev: {
    writeToDisk: true,
    assetPrefix: 'http://localhost:${options.port}/',
    client: { host: 'localhost', port: ${options.port} },
  },
  output: {
    assetPrefix:
      (import.meta as { env?: Record<string, string | undefined> }).env?.${envName} ??
      'http://localhost:${options.port}/',
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
      name: '${options.remoteName}',
      exposes: {
        './config': './src/menu.ts',
        './Shell': './src/shell.tsx',
      },
      shared: {
        '${options.corePackage}': { singleton: true, requiredVersion: false },
        '${options.componentsPackage}': { singleton: true, requiredVersion: false },
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'react-router-dom': { singleton: true, requiredVersion: false },
      },
    }),
  ],
})
`
}

module.exports = { buildRsbuildConfig }
