const { formatFiles, joinPathFragments } = require('nx/src/devkit-exports')
const {
  addAppProject,
  ensureProjectDoesNotExist,
  normalizeAppOptions,
  updateRootPackageScripts,
  writeBaseAppFiles,
  writePackageJson,
} = require('../shared')
const { buildRsbuildConfig } = require('./templates/rsbuild-config')
const { buildMainTsx, buildAppTsx } = require('./templates/main')
const { buildRemotesTs } = require('./templates/remotes')
const { buildRoutesTsx } = require('./templates/app/routes')
const { buildTypesTs } = require('./templates/app/types')
const { buildUseAuthStateTs, buildUseThemeModeTs } = require('./templates/app/hooks')
const { buildAuthStorageTs, buildRemoteLoaderTs, buildThemeTs } = require('./templates/app/lib')
const { buildHostServicesTs } = require('./templates/app/lib/host-services')
const { buildAuthGuardTsx } = require('./templates/app/components/auth-guard')
const { buildHeaderActionsTsx, buildThemeToggleTsx } = require('./templates/app/components/header-actions')
const { buildHeaderNotificationTsx } = require('./templates/app/components/header-notification')
const { buildHeaderUserTsx } = require('./templates/app/components/header-user')
const { buildRemoteModuleTsx } = require('./templates/app/components/remote-module')
const { buildRemoteShellTsx } = require('./templates/app/components/remote-shell')
const { buildAppHeaderTsx } = require('./templates/app/layouts/app-header')
const { buildAppShellTsx } = require('./templates/app/layouts/app-shell')
const { buildAppSidebarNavTsx } = require('./templates/app/layouts/app-sidebar-nav')
const { buildHomePageTsx } = require('./templates/app/layouts/home-page')
const { buildSignInPageTsx } = require('./templates/app/layouts/sign-in-page')

module.exports = async function hostGenerator(tree, schema) {
  const options = normalizeAppOptions(tree, schema, 'host')
  ensureProjectDoesNotExist(tree, options.projectRoot)
  addAppProject(tree, options, ['scope:host', 'type:app'], true)
  writePackageJson(tree, options, {
    '@module-federation/enhanced': '^2.0.0',
    sonner: '^2.0.7',
  })
  writeBaseAppFiles(tree, options, `${options.displayName} Host`)

  const p = (rel) => joinPathFragments(options.projectRoot, rel)

  tree.write(p('rsbuild.config.ts'), buildRsbuildConfig(options))

  tree.write(p('src/main.tsx'), buildMainTsx())
  tree.write(p('src/app.tsx'), buildAppTsx())
  tree.write(p('src/remotes.ts'), buildRemotesTs())

  tree.write(p('src/app/routes.tsx'), buildRoutesTsx())
  tree.write(p('src/app/types.ts'), buildTypesTs())

  tree.write(p('src/app/hooks/use-auth-state.ts'), buildUseAuthStateTs())
  tree.write(p('src/app/hooks/use-theme-mode.ts'), buildUseThemeModeTs())

  tree.write(p('src/app/lib/auth-storage.ts'), buildAuthStorageTs(options))
  tree.write(p('src/app/lib/host-services.ts'), buildHostServicesTs(options))
  tree.write(p('src/app/lib/remote-loader.ts'), buildRemoteLoaderTs(options))
  tree.write(p('src/app/lib/theme.ts'), buildThemeTs(options))

  tree.write(p('src/app/components/auth-guard.tsx'), buildAuthGuardTsx())
  tree.write(p('src/app/components/header-actions.tsx'), buildHeaderActionsTsx(options))
  tree.write(p('src/app/components/header-notification.tsx'), buildHeaderNotificationTsx(options))
  tree.write(p('src/app/components/header-user.tsx'), buildHeaderUserTsx(options))
  tree.write(p('src/app/components/remote-module.tsx'), buildRemoteModuleTsx())
  tree.write(p('src/app/components/remote-shell.tsx'), buildRemoteShellTsx(options))
  tree.write(p('src/app/components/theme-toggle.tsx'), buildThemeToggleTsx(options))

  tree.write(p('src/app/layouts/app-header.tsx'), buildAppHeaderTsx(options))
  tree.write(p('src/app/layouts/app-shell.tsx'), buildAppShellTsx(options))
  tree.write(p('src/app/layouts/app-sidebar-nav.tsx'), buildAppSidebarNavTsx(options))
  tree.write(p('src/app/layouts/home-page.tsx'), buildHomePageTsx(options))
  tree.write(p('src/app/layouts/sign-in-page.tsx'), buildSignInPageTsx(options))

  updateRootPackageScripts(tree, options)
  if (typeof formatFiles === 'function') await formatFiles(tree)
}
