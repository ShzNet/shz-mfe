import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  server: {
    port: 3000,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  dev: {
    writeToDisk: true,
    client: { host: 'localhost', port: 3000 },
  },
  tools: {
    postcss: (config) => {
      if (typeof config.postcssOptions === 'function') {
        return
      }
      config.postcssOptions ??= {}
      config.postcssOptions.plugins ??= []
      // Tailwind v4 via PostCSS — only host processes Tailwind
      // @source directives in styles.css scan remote source files too
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
      name: 'host',
      // No static remotes — all registered at runtime via registerRemotes()
      remotes: {},
      shared: {
        '@shz/core': { singleton: true, eager: true, requiredVersion: false },
        react: { singleton: true, eager: true, requiredVersion: false },
        'react-dom': { singleton: true, eager: true, requiredVersion: false },
        'react-router-dom': { singleton: true, eager: true, requiredVersion: false },
      },
    }),
  ],
})
